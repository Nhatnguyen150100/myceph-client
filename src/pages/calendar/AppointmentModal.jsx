import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as bootstrap from 'bootstrap';
import { findObjectFromArray, FONT_SIZE, forMatMoneyVND, getHoursMinutesSeconds, SOFT_WARE_LIST, toISODateString, VIEW_CALENDAR } from "../../common/Utility.jsx";
import { toast } from "react-toastify";
import { setLoadingModal, setSoftWareSelectedTab } from "../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";
import { Link, useNavigate } from "react-router-dom";
import { setListAppointmentDate } from "../../redux/CalendarSlice.jsx";
import ConfirmComponent from "../../common/ConfirmComponent.jsx";
import { LinearProgress } from "@mui/material";
import { setCurrentPatient } from "../../redux/PatientSlice.jsx";


const AppointmentModal = (props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const appointmentModelRef = useRef();
  const appointmentModal = useRef();
  const clinic = useSelector(state=>state.clinic);
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const roomOfClinic = useSelector(state => state.calendar.propertiesClinic?.roomOfClinic);
  const servicesOfClinic = useSelector(state => state.calendar.propertiesClinic?.serviceOfClinic);
  const statusOfClinic = useSelector(state => state.calendar.propertiesClinic?.statusOfClinic);
  const listDoctors = useSelector(state => state.calendar.propertiesClinic?.doctor);
  const listPatients = useSelector(state => state.patient.arrayPatients);
  const selectedTabCalendar = useSelector(state => state.calendar.viewCalendar);

  const [doctorSelected,setDoctorSelected] = useState();
  const [listOfDoctorSharedPatient,setListOfDoctorSharedPatient] = useState([]);
  const [patientSelected,setPatientSelected] = useState(props.patientSelected);
  const [serviceSelected,setServiceSelected] = useState();
  const [priceService,setPriceService] = useState();
  const [roomSelected,setRoomSelected] = useState();
  const [statusSelected,setStatusSelected] = useState();
  const [appointmentDate,setAppointmentDate] = useState(toISODateString(new Date()));
  const [timeStart,setTimeStart] = useState();
  const [timeEnd,setTimeEnd] = useState();
  const [note,setNote] = useState('');
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  const [loadingListDoctor,setLoadingListDoctor] = useState(false);

  useEffect(()=>{
    if(props.slotInfo){
      setRoomSelected(props.slotInfo.resourceId);
      setAppointmentDate(toISODateString(props.slotInfo.start));
      setTimeStart(getHoursMinutesSeconds(props.slotInfo.start));
      setTimeEnd(getHoursMinutesSeconds(props.slotInfo.end));
    }
    if(!props.createAppointment && props.slotInfo){
      setDoctorSelected(props.slotInfo.doctor.idDoctor);
      setPatientSelected(props.slotInfo.idPatient);
      setServiceSelected(props.slotInfo.service.idService);
      setStatusSelected(props.slotInfo.status.idStatus);
      setPriceService(props.slotInfo.service.priceService);
      setNote(props.slotInfo.note);
    }
  },[props.slotInfo,props.createAppointment])


  useEffect(() => {
    appointmentModal.current = new bootstrap.Modal(appointmentModelRef.current, {});
  }, [])

  useEffect(()=>{
    if(props.showAppointmentModal) appointmentModal.current.show();
    else{
      appointmentModal.current.hide();
      setDoctorSelected();
      setPatientSelected(props.patientSelected);
      setServiceSelected();
      setRoomSelected();
      setAppointmentDate(toISODateString(new Date()));
      setStatusSelected();
      setPriceService();
      setNote('');
    } 
  },[props.showAppointmentModal])

  useEffect(()=>{
    if(props.patientSelected && (props.patientSelected !== patientSelected)){
      getAllDoctorSharedPatient(props.patientSelected)
    } 
    else if(patientSelected && props.showAppointmentModal){
      getAllDoctorSharedPatient(patientSelected)
    }
  },[patientSelected,props.showAppointmentModal,props.patientSelected])

  const createAppointment = () => {
    if(!patientSelected) toast.error(t('Patient not selected'));
    else if(!doctorSelected) toast.error(t('Doctor not selected'));
    else if(!statusSelected) toast.error(t('Status not selected')); 
    else if(!roomSelected) toast.error(t('Room not selected'));
    else if(!serviceSelected) toast.error(t('Service not selected'));
    else if(!timeStart) toast.error(t('Time start is not available'));
    else if(!timeEnd) toast.error(t('Time end is not available'));
    else if(timeStart<='08:00') toast.error(t('Time start must be greater 08:00 AM'));
    else if(timeEnd>='18:00') toast.error(t('Time end cannot be greater 06:00 PM'));
    else if(timeStart>=timeEnd) toast.error(t('Time end must be greater to timeStart'));
    else{
      return new Promise((resolve, reject) =>{
        dispatch(setLoadingModal(true));
        postToServerWithToken(`/v1/schedule/${clinic.idClinicDefault}`,{
          idPatientSchedule: patientSelected,
          idDoctorSchedule: doctorSelected,
          idStatus: statusSelected,
          idService: serviceSelected,
          idRoom: roomSelected,
          appointmentDate: appointmentDate,
          startTime: timeStart,
          endTime: timeEnd,
          note: note
        }).then(result => {
          if(selectedTabCalendar === VIEW_CALENDAR.BY_PATIENT) props.getListAppointmentDateByMode();
          else dispatch(setListAppointmentDate(result.data));
          toast.success(t(result.message));
          props.closeModal();
          resolve();
        }).catch(err =>{
          if(err.refreshToken && !isRefresh){
            refreshToken(nav,dispatch).then(()=>createAppointment());
          }else{
            toast.error(t(err.message));
          }
          reject();
        }).finally(()=>dispatch(setLoadingModal(false)));
      })
    }
  }

  const updateAppointment = () =>{
    if(!patientSelected) toast.error(t('Patient not selected'));
    else if(!doctorSelected) toast.error(t('Doctor not selected'));
    else if(!statusSelected) toast.error(t('Status not selected')); 
    else if(!roomSelected) toast.error(t('Room not selected'));
    else if(!serviceSelected) toast.error(t('Service not selected'));
    else if(!timeStart) toast.error(t('Time start is not available'));
    else if(!timeEnd) toast.error(t('Time end is not available'));
    else if(timeStart<'08:00') toast.error(t('Time start must be greater 08:00 AM'));
    else if(timeEnd>'18:00') toast.error(t('Time end cannot be greater 06:00 PM'));
    else if(timeStart>=timeEnd) toast.error(t('Time end must be greater to timeStart'));
    else{
      return new Promise((resolve, reject) =>{
        dispatch(setLoadingModal(true));
        putToServerWithToken(`/v1/schedule/${clinic.idClinicDefault}?idAppointment=${props.slotInfo.idSchedule}`,{
          idPatientSchedule: patientSelected,
          idDoctorSchedule: doctorSelected,
          idStatus: statusSelected,
          idService: serviceSelected,
          idRoom: roomSelected,
          appointmentDate: appointmentDate,
          startTime: timeStart,
          endTime: timeEnd,
          note: note
        }).then(result => {
          if(selectedTabCalendar === VIEW_CALENDAR.BY_PATIENT) props.getListAppointmentDateByMode();
          else dispatch(setListAppointmentDate(result.data));
          toast.success(t(result.message));
          props.closeModal();
          resolve();
        }).catch(err =>{
          if(err.refreshToken && !isRefresh){
            refreshToken(nav,dispatch).then(()=>updateAppointment());
          }else{
            toast.error(t(err.message));
          }
          reject();
        }).finally(()=>dispatch(setLoadingModal(false)));
      })
    }
  }

  const deleteAppointment = () => {
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      deleteToServerWithToken(`/v1/schedule/${clinic.idClinicDefault}?idAppointment=${props.slotInfo.idSchedule}`).then(result => {
        if(selectedTabCalendar === VIEW_CALENDAR.BY_PATIENT) props.getListAppointmentDateByMode();
        else dispatch(setListAppointmentDate(result.data));
        toast.success(t(result.message));
        setOpenDeleteConfirm(false);
        props.closeModal();
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>deleteAppointment());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const handleClose = () => {
    setOpenDeleteConfirm(false);
    appointmentModal.current.show();
  }
  
  const getAllDoctorSharedPatient = (idPatient) => {
    return new Promise((resolve, reject) => {
      setLoadingListDoctor(true);
      getToServerWithToken(`/v1/sharePatient/getDoctorSharedPatient/${idPatient}`).then(result => {
        setListOfDoctorSharedPatient([...result.data,...listDoctors]);
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getAllDoctorSharedPatient(idPatient));
        }else{
          toast.error(t(err.message));
        }
        reject(err);
      }).finally(()=>setLoadingListDoctor(false))
    });
  }

  return <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={'-1'} aria-labelledby="staticBackdropLabel" aria-hidden="true" ref={appointmentModelRef}>
    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-3 text-center w-100 mc-color fw-bold text-capitalize" id="staticBackdropLabel">{props.createAppointment?t('create appointment'):t('appointment')}</h1>
        </div>
        <div className="modal-body col">
          <div className="d-flex flex-column justify-content-center align-items-start">
            <div className="d-flex w-100 flex-grow-1 flex-column mb-4">
              <span className="mc-heading text-capitalize">{t("patient")}:</span>
              <div className="d-flex flex-row justify-content-center ">
                <select 
                  className="form-select w-100 text-gray" 
                  style={{fontSize:FONT_SIZE}} 
                  value={patientSelected} 
                  onChange={e=>setPatientSelected(e.target.value)}
                  disabled={patientSelected}
                >
                  {
                    props.patientSelected ? <option selected disabled>
                      {props.namePatientSelected}
                    </option>
                    :
                    <React.Fragment>
                    {
                      !patientSelected && <option selected disabled>
                        {t('Choose a patient')}
                      </option>
                    }
                    {
                      listPatients?.map((value,_)=>{
                        return <option key={value.id} value={value.id}>
                          {value.fullName}
                        </option>
                      })
                    }
                    </React.Fragment>
                  }
                </select>
                <Link 
                  onClick={e=>{
                    appointmentModal.current.hide();
                    const currentPatient = listPatients.filter(patient => patient.id === patientSelected);
                    dispatch(setCurrentPatient(currentPatient[0]));
                    dispatch(setSoftWareSelectedTab(SOFT_WARE_LIST.MEDICAL_RECORD))
                  }} 
                  to={`/medicalRecord`} 
                  title={t("MedicalRecord")} 
                  className="btn btn-outline-info p-1 ms-3 border-0"
                >
                  <img src="/assets/images/MedicalRecord.png" width="34" height="34" alt="MedicalRecord"/>
                </Link>
              </div>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-column mb-4">
              <span className="mc-heading text-capitalize">{t("doctor")}:</span>
              {
                loadingListDoctor && <LinearProgress />
              }
              <select 
                className="form-select w-100 text-gray" 
                style={{fontSize:FONT_SIZE}} 
                value={doctorSelected} 
                onChange={e=>setDoctorSelected(e.target.value)}
                disabled={clinic.roleOfDoctor==='member' || !patientSelected}
              >
                {
                  !doctorSelected ? <option selected disabled>
                    {t('Choose a doctor')}
                  </option>
                  :
                  ''
                }
                {
                listOfDoctorSharedPatient?.map((value,_)=>{
                  return <option key={value.id} value={value.id}>
                    {value.fullName} {value.fullName?'(':''}Email: {value.email}{value.fullName?')':''}
                  </option>
                })
              }
              </select>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-column mb-4">
              <span className="mc-heading text-capitalize">{t("status of clinic")}:</span>
              <div className="d-flex flex-row align-items-center">
                {
                  statusSelected && <input style={{ outline:"none" }} className="border-0 p-0 rounded me-3" type={'color'} value={(findObjectFromArray(statusOfClinic,statusSelected).colorStatus)} disabled />
                }
                <select 
                  className="form-select text-gray" 
                  style={{fontSize:FONT_SIZE}} 
                  value={statusSelected} 
                  onChange={e=>setStatusSelected(e.target.value)}
                  disabled={clinic.roleOfDoctor==='member'}
                >
                  {
                    !statusSelected && <option selected disabled>
                      {t('Choose a status of clinic')}
                    </option>
                  }
                  {
                  statusOfClinic?.map((value,_)=>{
                    return <option key={value.id} value={value.id}>
                      {value.nameStatus}
                    </option>
                  })
                }
                </select>
              </div>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-column mb-4">
              <span className="mc-heading text-capitalize">{t("room of clinic")}:</span>
              <div className="d-flex flex-row align-items-center">
                {
                  roomSelected && <input style={{ outline:"none" }} className="border-0 p-0 rounded me-3" type={'color'} value={(findObjectFromArray(roomOfClinic,roomSelected).colorRoom)} disabled />
                }
                <select 
                  className="form-select text-gray" 
                  style={{fontSize:FONT_SIZE}} 
                  value={roomSelected} 
                  onChange={e=>setRoomSelected(e.target.value)}
                  disabled={clinic.roleOfDoctor==='member'}
                >
                  {
                    !roomSelected && <option selected disabled>
                      {t('Choose a room of clinic')}
                    </option>
                  }
                  {
                  roomOfClinic?.map((value,_)=>{
                    return <option key={value.id} value={value.id}>
                      {value.nameRoom}
                    </option>
                  })
                }
                </select>
              </div>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-column mb-4">
              <span className="mc-heading text-capitalize">{t("service of clinic")}:</span>
              <div className="d-flex flex-row align-items-center">
                {
                  serviceSelected && <input style={{ outline:"none" }} className="border-0 p-0 rounded me-3" type={'color'} value={(findObjectFromArray(servicesOfClinic,serviceSelected).colorService)} disabled />
                }
                <select 
                  className="form-select text-gray" 
                  style={{fontSize:FONT_SIZE}} 
                  value={serviceSelected} 
                  onChange={e=>{
                    setServiceSelected(e.target.value)
                    setPriceService(findObjectFromArray(servicesOfClinic,e.target.value)?.priceService)
                  }}
                  disabled={clinic.roleOfDoctor==='member'}
                >
                  {
                    !serviceSelected && <option selected disabled>
                      {t('Choose a service of clinic')}
                    </option>
                  }
                  {
                    servicesOfClinic?.map((value,_)=>{
                    return <option key={value.id} value={value.id}>
                        {value.nameService}
                      </option>
                    })
                  }
                </select>
              </div>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-column mb-4">
              <span className="mc-heading text-capitalize">{t("appointment date")}:</span>
              <input className="mc-gray form-control" type={'date'} value={appointmentDate} onChange={e=>setAppointmentDate(e.target.value)} disabled={clinic.roleOfDoctor==='member'}/>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-row mb-4 align-items-center justify-content-between">
              <div className="d-flex flex-column align-items-start justify-content-center">
                <span className="mc-heading text-capitalize">{t("time start")}:</span>
                <input className="mc-gray form-control" type={'time'} value={timeStart?timeStart:''} onChange={e=>setTimeStart(e.target.value)} min={'08:00'} max={'18:00'} disabled={clinic.roleOfDoctor==='member'}/>
              </div>
              <div className="d-flex flex-column align-items-start justify-content-center">
                <span className="mc-heading text-capitalize">{t("time end")}:</span>
                <input className="mc-gray form-control" type={'time'} value={timeEnd?timeEnd:''} onChange={e=>setTimeEnd(e.target.value)} min={'08:00'} max={'18:00'} disabled={clinic.roleOfDoctor==='member'}/>
              </div>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-column mb-2">
              <span className="mc-heading text-capitalize">{t("note for appointment")}:</span>
              <textarea className="text-gray form-control" placeholder={t('Note something for schedule ...')} style={{fontSize:FONT_SIZE}} value={note} onChange={e=>setNote(e.target.value)} disabled={clinic.roleOfDoctor==='member'}/>
            </div>
          </div>
        </div>
        <div className={`modal-footer d-flex flex-row align-items-center ${props.createAppointment?'justify-content-end':'justify-content-between'}`}>
          <div className="d-flex flex-column justify-content-center align-items-start mb-2 w-100">
            {
              priceService && <div className="d-flex flex-row justify-content-center align-items-center mb-2">
                <span className="text-capitalize fw-bold mc-color" style={{fontSize:"18px"}}>{t('total payment')}:</span>
                <span className="ms-2 text-primary" style={{fontSize:"16px"}}>{forMatMoneyVND(priceService)}</span>
              </div>
            }
            <div className={`d-flex flex-row w-100 ${(!props.createAppointment && clinic.roleOfDoctor!=='member')?'justify-content-between':'justify-content-end'}`}>
              {
                !props.createAppointment && clinic.roleOfDoctor!=='member' && <button type="button" className="btn btn-danger d-flex align-items-center py-2 px-3" data-bs-dismiss="modal" onClick={()=>setOpenDeleteConfirm(true)}>
                  <span className="material-symbols-outlined me-2" style={{fontSize:"25px"}}>
                    delete
                  </span>
                  <span className="text-capitalize">{t('delete')}</span>
                </button>
              }
              <div className="d-flex align-items-center">
                <button type="button" className="btn btn-secondary d-flex align-items-center py-2 px-3 me-2" data-bs-dismiss="modal" onClick={props.closeModal}>
                  <span className="material-symbols-outlined me-2" style={{fontSize:"25px"}}>
                    close
                  </span>
                  <span className="text-capitalize">{t('close')}</span>
                </button>
                {
                  clinic.roleOfDoctor!=='member' && <button type="button" className="btn btn-primary d-flex align-items-center py-2 px-3" 
                    onClick={()=>{ 
                      if(props.createAppointment) createAppointment()
                      else updateAppointment()
                    }}
                  >
                    <span className="material-symbols-outlined me-2" style={{fontSize:"25px"}}>
                      {props.createAppointment?'save':'update'}
                    </span>
                    <span className="text-capitalize">{props.createAppointment?t('save'):t('update')}</span>
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmComponent 
      FONT_SIZE={FONT_SIZE}
      open={openDeleteConfirm} 
      title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm delete this appointment')}</span>} 
      content={
        <div>
          <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('Do you want to delete this appointment?')}</span>
        </div>
      }
      handleClose={e=>handleClose()} 
      handleSubmit={e=>deleteAppointment()}
    />
  </div>
}

export default React.memo(AppointmentModal);