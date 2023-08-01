import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import NavbarComponent from "../../components/NavbarComponent.jsx";
import SoftWareListComponent from "../../components/SoftWareListComponent.jsx";
import SelectPatientComponent from "../../components/SelectPatientComponent.jsx";
import { convertAppointmentDateToEvent, convertAppointmentDateToEvents, convertISOToVNDateString, FONT_SIZE, onDecryptedDataPreviewInArray, SOFT_WARE_LIST, timeString12hr, toISODateString, VIEW_CALENDAR } from "../../common/Utility.jsx";
import { useTranslation } from "react-i18next";
import RBCToolbar from "./RBCToolbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { useLayoutEffect } from "react";
import SmallCalendar from "./SmallCalendar.jsx";
import { setListAppointmentDate, setPropertiesClinic, setViewCalendar } from "../../redux/CalendarSlice.jsx";
import AppointmentModal from "./AppointmentModal.jsx";
import CustomEvent from "./CustomEvent.jsx";
import { getToServerWithToken } from "../../services/getAPI.jsx";
import { toast } from "react-toastify";
import { setAppName, setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";
import { useNavigate } from "react-router-dom";
import ChartSection from "./ChartSection.jsx";
import { setCurrentPatient } from "../../redux/PatientSlice.jsx";

export const localizer = momentLocalizer(moment);

export default function BigCalendar(props){
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const view = useSelector(state => state.calendar.view);
  const patient = useSelector(state=>state.patient);
  const selectedTab = useSelector(state => state.calendar.viewCalendar);
  const listAppointmentDate = useSelector(state => state.calendar.listAppointmentDate);
  const roomsOfClinic = useSelector(state => state.calendar.propertiesClinic?.roomOfClinic);
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const clinic = useSelector(state=>state.clinic);
  const doctor = useSelector(state=>state.doctor.data);
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const nav = useNavigate();

  const headerRef = useRef(null);
  const clickRef = useRef(null);

  const [heightCalendar, setHeightCalendar] = useState(0);
  const [showAppointmentModal,setShowAppointmentModal] = useState(false);
  const [isCreateAppointment,setIsCreateAppointment] = useState(true);
  const [slotInfo,setSlotInfo] = useState();
  const [currentDay,setCurrentDay] = useState(new Date());
  const [sortMode,setSortMode] = useState(null);
  const [listAppointmentDateOnSort,setListAppointmentDateOnSort] = useState([]);

  let currentTab = null;

  useEffect(()=>{
    if(!doctor?.id) nav('/login');
  },[])

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t(SOFT_WARE_LIST.CALENDAR)}`));
  },[])
  
  useLayoutEffect(()=>{
    // đặt chiều cao của Calendar
    setHeightCalendar(window.innerHeight - headerRef.current.clientHeight - 20);
  },[])

  useEffect(() => {
    return () => {
      window.clearTimeout(clickRef?.current)
    }
  }, [])

  useEffect(() => {
    /**
     * todo: Nếu ở chế độ xem theo bệnh nhân mà không có bệnh nhân hoặc bệnh nhân không thuộc phòng khám thì đặt lại bệnh nhân đầu của phòng khám
     */
    if(selectedTab===VIEW_CALENDAR.BY_DATE && !patient.currentPatient?.idPatientOfClinic && patient.arrayPatients.length > 0){
      const currentPatientEncrypt = onDecryptedDataPreviewInArray(patient.arrayPatients,encryptKeyClinic)
      dispatch(setCurrentPatient(currentPatientEncrypt));
    }
  }, [selectedTab])

  useEffect(()=>{
    if(clinic.idClinicDefault) getPropertiesClinic();
  },[patient.currentPatient?.id])

  const onSortAppointmentDate = (condition) => {
    const indexList = [...listAppointmentDate];
    indexList.sort((a,b) =>{
      if(condition==='ASC'?(new Date(a.appointmentDate) > new Date(b.appointmentDate)):(new Date(a.appointmentDate) < new Date(b.appointmentDate))) return -1;
      else return 1
    })
    setListAppointmentDateOnSort(indexList);
  }  

  const getPropertiesClinic = () => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/schedule/getPropertiesClinic/${clinic.idClinicDefault}`).then(result => {
        if(result.data?.roomOfClinic.length === 0) toast.warning(t('This clinic does not have any room'));
        else if(result.data?.serviceOfClinic.length === 0) toast.warning(t('This clinic does not have any service'));
        else if(result.data?.statusOfClinic.length === 0) toast.warning(t('This clinic does not have any status'));
        dispatch(setPropertiesClinic(result.data));
        if(selectedTab===VIEW_CALENDAR.BY_DATE) getListAppointmentDateByMode(false);
        else getListAppointmentDateByMode(true);
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getPropertiesClinic());
        }else{
          toast.error(t(err.message));
        }
        reject(err);
      })
    })
  } 
  
  const getAllPatientForClinic = () => {
    return new Promise((resolve, reject) => {
      if(clinic.roleOfDoctor === 'admin'){
        getToServerWithToken(`/v1/patient/getPatientListForClinic/${clinic.idClinicDefault}?page=${1}&pageSize=${4}&nameSearch=`).then(result=>{
          resolve(result.data);
        }).catch((err) =>{
          if(err.refreshToken && !isRefresh){
            refreshToken(nav,dispatch).then(()=>getAllPatientForClinic());
          }else{
            toast.error(t(err.message));
          }
          reject(err);
        })
      }else{
        getToServerWithToken(`/v1/patient/getSharedPatientOfDoctorInClinic/${doctor.id}?idClinic=${clinic.idClinicDefault}&page=${1}&pageSize=${1000}&nameSearch=`).then(result=>{
          resolve(result.data);
        }).catch((err) =>{
          if(err.refreshToken && !isRefresh){
            refreshToken(nav,dispatch).then(()=>getAllPatientForClinic());
          }else{
            toast.error(t(err.message));
          }
          reject(err);
        })
      }
    })
  }

  const getListAppointmentDateByMode = (idPatient) => {
    if((idPatient && patient.currentPatient?.id) || !idPatient) return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/schedule/getAllAppointments/${clinic.idClinicDefault}?idDoctor=${clinic.roleOfDoctor === 'admin'?'':doctor.id}&idPatient=${idPatient?patient.currentPatient?.id:''}`).then(result => {
        dispatch(setListAppointmentDate(result.data));
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getListAppointmentDateByMode(idPatient));
        }else{
          toast.error(t(err.message));
        }
        reject(err);
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  } 

  const onSelectSlot = useCallback(slotInfo => {
    window.clearTimeout(clickRef?.current)
    clickRef.current = window.setTimeout(() => {
      setShowAppointmentModal(true);
      setIsCreateAppointment(true);
      setSlotInfo(slotInfo);
    }, 200)
  }, [])

  const eventPropGetter = useCallback(
    event => ({
      className: "transform-hover"
      ,
      style : {
        backgroundColor: event.service.colorService,
        borderColor: "white"
      }
    })
  ,[])

  const onClickEvent = useCallback(callEvent => {
    window.clearTimeout(clickRef?.current)
    clickRef.current = window.setTimeout(() => {
      setShowAppointmentModal(true);
      setIsCreateAppointment(false);
      setSlotInfo(callEvent);
    }, 200)
  },[])

  const onNavigate = useCallback(newDate => {
    setCurrentDay(newDate);
  },[])

  const { date, formats, messages, views, resources, events} = useMemo(() => ({
    date: currentDay,
    messages: {
      week: t('Week'),
      day: t('Day'),
      month: t('Month'),
      previous: t('Previous'),
      next: t('Next'),
      today: t('Today'),

      showMore: (total) => `+${total} ${t('more')}`,
    },
    formats: {
        weekdayFormat: (date, culture, localizer) =>
          localizer.format(date, 'dddd DD/MM', culture),
        dayFormat: (date, culture, localizer) =>
          localizer.format(date, 'dddd Do', culture),
        timeGutterFormat: (date, culture, localizer) =>
          localizer.format(date, 'hh:mm - A', culture),
        dayHeaderFormat: (date, culture, localizer) =>
          localizer.format(date, 'dddd DD/MM/YYYY', culture),
    },
    views: [Views.WEEK, Views.DAY],
    // đặt lại tên nameRoom => title theo doc của Calendar resources
    resources: roomsOfClinic?.map(({id, nameRoom: title}) => ({id, title})),
    events: listAppointmentDate.length>0 ? convertAppointmentDateToEvents(listAppointmentDate): []
  }), [currentDay,roomsOfClinic,listAppointmentDate])

  const slotGroupPropGetter = useCallback(
    () => ({
      style: {
        minHeight: 60
      },
    }),
    []
  )

  switch(selectedTab){
    case VIEW_CALENDAR.BY_DATE: currentTab = 
      <Calendar
        resources={resources}
        components={{
          toolbar: RBCToolbar,
          event: CustomEvent 
        }}
        events={events}
        eventPropGetter={eventPropGetter}
        min={new Date(2000, 0, 1, 8, 0, 0, 0)}
        max={new Date(2100, 0, 1, 18, 0, 0, 0)}
        popup={true}
        selectable={clinic.roleOfDoctor === 'admin'?true:false}
        onSelectSlot={onSelectSlot}
        step={15}
        onSelectEvent={onClickEvent}
        timeslots={2}
        slotGroupPropGetter={slotGroupPropGetter}
        drilldownView={view}
        views={views}
        onNavigate={onNavigate}
        defaultView={view}
        date={date}
        formats={formats}
        messages={messages}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        className="col-md-9"
        style={{height:heightCalendar}}
      />
    break;
    case VIEW_CALENDAR.BY_PATIENT: currentTab = <div className="col-md-9 " style={{height:heightCalendar,overflow:"auto"}}>
        <table className="table table-bordered text-center rounded">
          <thead className="text-uppercase text-gray fw-bold" style={{fontSize:FONT_SIZE}}>
            <tr>
              <th style={{width:"30px"}}>
                STT
              </th>
              <th style={{width:"200px"}}>
                <button className="btn btn-hover-bg border-0 p-0 w-100 d-flex align-items-center justify-content-center" type="button" onClick={()=>{
                  if(!sortMode){
                    setSortMode('ASC');
                    onSortAppointmentDate('ASC');
                  }else if(sortMode==='ASC'){
                    setSortMode('DESC');
                    onSortAppointmentDate('DESC');
                  }else{
                    setSortMode(null);
                    onSortAppointmentDate([]);
                  }
                }}>
                  <span className="text-uppercase text-gray fw-bold" style={{fontSize:FONT_SIZE}}>{t('appointment date')}</span>
                  {
                    sortMode && <span className="material-symbols-outlined ms-2 mc-color fw-bold">
                      {sortMode==='ASC'?'arrow_drop_down':'arrow_drop_up'}
                    </span>
                  }
                </button>
              </th>
              <th style={{width:"180px"}}>
                {t('time date')}
              </th>
              <th style={{width:"350px"}}>
                {t('doctor')}
              </th>
              <th>
                {t('service of clinic')}
              </th>
            </tr>
          </thead>
          <tbody className="body-table">
            {  
              (sortMode ? listAppointmentDateOnSort : listAppointmentDate)?.map((appoint,index)=>{
                return <tr className="transform-hover-small" key={appoint.id} style={{backgroundColor:appoint.ServicesOfClinic.colorService,cursor:"pointer"}} onClick={()=>onClickEvent(convertAppointmentDateToEvent(appoint))}>
                  <td className="text-white" style={{fontSize:FONT_SIZE}}>
                    {index+1}
                  </td>
                  <td className="text-white" style={{fontSize:FONT_SIZE}}>
                    {convertISOToVNDateString(toISODateString(new Date(appoint.appointmentDate)))}
                  </td>
                  <td className="text-white" style={{fontSize:FONT_SIZE}}>
                    {timeString12hr(appoint.startTime) + ' - ' + timeString12hr(appoint.endTime)}
                  </td>
                  <td>
                    <button type="button" className="text-white btn w-100 p-0 border-0 d-flex flex-row justify-content-center align-items-center" style={{fontSize:FONT_SIZE}}>
                      <span>{appoint.Doctor.fullName}</span>
                      <span className="ms-2 d-none d-lg-block">({appoint.Doctor.email})</span>
                    </button>
                  </td>
                  <td className="text-white" style={{fontSize:FONT_SIZE}}>
                    {appoint.ServicesOfClinic.nameService}
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    break;
    default: currentTab = <div>null</div>
  }

  return <div className="h-100">
    <AppointmentModal 
      patientSelected={selectedTab === VIEW_CALENDAR.BY_PATIENT ? patient.currentPatient?.id : null}
      namePatientSelected={selectedTab === VIEW_CALENDAR.BY_PATIENT ? patient.currentPatient?.fullName : null}
      getListAppointmentDateByMode={()=>getListAppointmentDateByMode(true)} 
      slotInfo={slotInfo} 
      showAppointmentModal={showAppointmentModal} 
      closeModal={()=>{setShowAppointmentModal(false);setIsCreateAppointment(true)}} 
      createAppointment={isCreateAppointment}
    />
    <div ref={headerRef}>
      <NavbarComponent />
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button 
            type="button" 
            className={`px-2 py-1 btn-outline-secondary nav-link ${selectedTab===VIEW_CALENDAR.BY_DATE?'active':'btn-hover-bg'} ms-3 d-flex align-items-center`} 
            style={{fontSize:FONT_SIZE}}
            onClick={()=>{dispatch(setViewCalendar(VIEW_CALENDAR.BY_DATE));getListAppointmentDateByMode(false)}}
            disabled={selectedTab===VIEW_CALENDAR.BY_DATE}
          >
            <span className="material-symbols-outlined me-2 mc-color">
              event_note
            </span>
            <span className="text-uppercase fw-bold mc-color">{t('view by date')}</span>
          </button>
        </li>
        <li className="nav-item">
          <button 
            type="button" 
            className={`px-2 py-1 btn-outline-secondary nav-link ${selectedTab===VIEW_CALENDAR.BY_PATIENT?'active':'btn-hover-bg'} d-flex align-items-center`} 
            style={{fontSize:FONT_SIZE}}
            onClick={()=>{
              getAllPatientForClinic().then(data => {
                const currentPatient = onDecryptedDataPreviewInArray(data,encryptKeyClinic)
                if(data.length > 0 && currentPatient){
                  dispatch(setCurrentPatient(currentPatient));
                  dispatch(setViewCalendar(VIEW_CALENDAR.BY_PATIENT));
                  getListAppointmentDateByMode(true)
                }else if(data.length > 0 && !currentPatient){
                  toast.error(t('You need an encryption key to decrypt patient data'))
                }else toast.error(t('This clinic has no patient'))
              })
            }}
            disabled={selectedTab===VIEW_CALENDAR.BY_PATIENT}
          >
            <span className="material-symbols-outlined me-2 mc-color">
              person
            </span>
            <span className="text-uppercase fw-bold mc-color">{t('view by patient')}</span>
          </button>
        </li>
      </ul>
      <div className="container-fluid my-1">
        <div className={`d-flex flex-wrap flex-row ${selectedTab===VIEW_CALENDAR.BY_PATIENT?'justify-content-between':'justify-content-start'} align-items-center w-100`}>  
          <div className="d-flex flex-wrap flex-row align-items-center">
            <IconButtonComponent
              disabled={clinic.roleOfDoctor !== 'admin'} 
              className={`btn-primary h-100 pb-1 d-flex align-items-center me-4`} 
              icon="add" 
              FONT_SIZE_ICON={"25px"} 
              title={t("Create appointment")}
              onClick={()=>setShowAppointmentModal(true)}
              label={
                <span className="text-capitalize text-white fw-bold me-2 mt-1" style={{fontSize:FONT_SIZE}}>
                  {t('create appointment')}
                </span>
              }
            />
            <SelectPatientComponent condition={true} showSelectedPatient={selectedTab === VIEW_CALENDAR.BY_PATIENT?true:false}/>
          </div>
          {
            selectedTab === VIEW_CALENDAR.BY_PATIENT && <div className="me-5">
              <SoftWareListComponent />
            </div>
          }
        </div>
      </div>
    </div>
    <div className={`row ${selectedTab === VIEW_CALENDAR.BY_DATE?'mx-2 pt-2':'me-2'} border-top`}>
      {currentTab}
      <div className={`col-md-3 d-flex flex-column align-items-center justify-content-between ${selectedTab !== VIEW_CALENDAR.BY_DATE && 'pt-2'}`}>
        <SmallCalendar currentDay={currentDay} setCurrentDay={value => setCurrentDay(value)}/>
        <ChartSection currentDay={currentDay}/>
      </div>
    </div>
  </div>
}
