import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import NavbarComponent from "../../component/NavbarComponent.jsx";
import SoftWareListComponent from "../../component/SoftWareListComponent.jsx";
import SelectPatientComponent from "../../component/SelectPatientComponent.jsx";
import { FONT_SIZE, VIEW_CALENDAR } from "../../common/Utility.jsx";
import { useTranslation } from "react-i18next";
import RBCToolbar from "./RBCToolbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { useLayoutEffect } from "react";
import SmallCalendar from "./SmallCalendar.jsx";
import { setViewCalendar } from "../../redux/CalendarSlice.jsx";
import AppointmentModal from "./AppointmentModal.jsx";

export const localizer = momentLocalizer(moment);

export default function BigCalendar(props){
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const view = useSelector(state => state.calendar.view);
  const [currentDay,setCurrentDay] = useState(new Date());
  const selectedTab = useSelector(state => state.calendar.viewCalendar);
  const roomsOfClinic = useSelector(state => state.calendar.propertiesClinic?.roomOfClinic);
  const clinic = useSelector(state=>state.clinic);

  const headerRef = useRef(null);
  const clickRef = useRef(null);

  const [heightCalendar, setHeightCalendar] = useState(0);
  const [showAppointmentModal,setShowAppointmentModal] = useState(false);
  const [isCreateAppointment,setIsCreateAppointment] = useState(true);
  const [slotInfo,setSlotInfo] = useState();
  
  let currentTab = null;

  const onSelectSlot = useCallback(slotInfo => {
    window.clearTimeout(clickRef?.current)
    clickRef.current = window.setTimeout(() => {
      setShowAppointmentModal(true);
      setSlotInfo(slotInfo);
    }, 200)
  }, [])

  const onNavigate = useCallback(newDate => {
    setCurrentDay(newDate);
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

  const { date, formats, messages, views, resources} = useMemo(() => ({
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
    views: [Views.MONTH,Views.WEEK, Views.DAY],
    // đặt lại tên nameRoom => title theo doc của Calendar resources
    resources: roomsOfClinic?.map(({id, nameRoom: title}) => ({id, title}))
  }), [currentDay,roomsOfClinic])

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
          toolbar: RBCToolbar
        }}
        min={new Date(1972, 0, 1, 8, 0, 0, 0)}
        max={new Date(2050, 0, 1, 18, 0, 0, 0)}
        popup={true}
        selectable={clinic.roleOfDoctor === 'admin'?true:false}
        onSelectSlot={onSelectSlot}
        step={15}
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
    case VIEW_CALENDAR.BY_PATIENT: currentTab = <div className="col-md-9">
        patient
      </div>
    break;
    default: currentTab = <div>null</div>
  }

  return <div className="h-100">
    <AppointmentModal slotInfo={slotInfo} showAppointmentModal={showAppointmentModal} closeModal={()=>setShowAppointmentModal(false)} createAppointment={isCreateAppointment}/>
    <div ref={headerRef}>
      <NavbarComponent />
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button 
            type="button" 
            className={`px-2 py-1 btn-outline-secondary nav-link ${selectedTab===VIEW_CALENDAR.BY_DATE?'active':'btn-hover-bg'} ms-3 d-flex align-items-center`} 
            style={{fontSize:FONT_SIZE}}
            onClick={()=>dispatch(setViewCalendar(VIEW_CALENDAR.BY_DATE))}
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
            onClick={()=>dispatch(setViewCalendar(VIEW_CALENDAR.BY_PATIENT))}
          >
            <span className="material-symbols-outlined me-2 mc-color">
              person
            </span>
            <span className="text-uppercase fw-bold mc-color">{t('view by patient')}</span>
          </button>
        </li>
      </ul>
      <div className="container-fluid my-1">
        <div className={`d-flex flex-row ${selectedTab===VIEW_CALENDAR.BY_PATIENT?'justify-content-between':'justify-content-start'} align-items-center w-100`}>  
          <div className="d-flex flex-row align-items-center">
            <IconButtonComponent
              disabled={clinic.roleOfDoctor !== 'admin'} 
              className={`btn-primary h-100 pb-1 d-flex align-items-center ms-2 me-4`} 
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
    <div className="row mx-2 border-top pt-2">
      {currentTab}
      <div className="col-md-3">
        <SmallCalendar currentDay={currentDay} setCurrentDay={value => setCurrentDay(value)}/>
      </div>
    </div>
  </div>
}