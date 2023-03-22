import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as bootstrap from 'bootstrap';
import { findObjectFromArray, FONT_SIZE, getHoursMinutesSeconds, toISODateString } from "../../common/Utility.jsx";


const AppointmentModal = React.memo((props) => {
  const {t} = useTranslation();
  const appointmentModelRef = useRef();
  const appointmentMode = useRef();
  const roomOfClinic = useSelector(state => state.calendar.propertiesClinic?.roomOfClinic);
  const servicesOfClinic = useSelector(state => state.calendar.propertiesClinic?.serviceOfClinic);
  const statusOfClinic = useSelector(state => state.calendar.propertiesClinic?.statusOfClinic);
  const listDoctors = useSelector(state => state.calendar.propertiesClinic?.doctor);
  const listPatients = useSelector(state => state.patient.arrayPatients);

  const [doctorSelected,setDoctorSelected] = useState();
  const [patientSelected,setPatientSelected] = useState();
  const [serviceSelected,setServiceSelected] = useState();
  const [roomSelected,setRoomSelected] = useState();
  const [statusSelected,setStatusSelected] = useState();
  const [appointmentDate,setAppointmentDate] = useState(toISODateString(new Date()));
  const [timeStart,setTimeStart] = useState();
  console.log("🚀 ~ file: AppointmentModal.jsx:26 ~ AppointmentModal ~ timeStart:", timeStart)
  const [timeEnd,setTimeEnd] = useState();
  const [note,setNote] = useState();

  useEffect(()=>{
    if(props.slotInfo){
      setAppointmentDate(toISODateString(props.slotInfo.start));
      setTimeStart(getHoursMinutesSeconds(props.slotInfo.start));
      setTimeEnd(getHoursMinutesSeconds(props.slotInfo.end));
    }
  },[props.slotInfo])

  useEffect(() => {
    appointmentMode.current = new bootstrap.Modal(appointmentModelRef.current, {});
  }, [])

  useEffect(()=>{
    if(props.showAppointmentModal) appointmentMode.current.show();
    else{
      appointmentMode.current.hide();
      setDoctorSelected();
      setPatientSelected();
      setServiceSelected();
      setRoomSelected();
      setStatusSelected();
      setNote();
    } 
  },[props.showAppointmentModal])


  return <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={'-1'} aria-labelledby="staticBackdropLabel" aria-hidden="true" ref={appointmentModelRef}>
    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-3 text-center w-100 mc-color fw-bold" id="staticBackdropLabel">{props.createAppointment?t('Create Appointment'):t('Appointment')}</h1>
        </div>
        <div className="modal-body col">
          <div className="d-flex flex-column justify-content-center align-items-start">
            <div className="d-flex w-100 flex-grow-1 flex-column mb-4">
              <span className="mc-heading text-capitalize">{t("Patient")}:</span>
              <select className="form-select w-100 text-gray" style={{fontSize:FONT_SIZE}} value={patientSelected} onChange={e=>setPatientSelected(e.target.value)}>
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
              </select>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-column mb-4">
              <span className="mc-heading text-capitalize">{t("Doctor")}:</span>
              <select className="form-select w-100 text-gray" style={{fontSize:FONT_SIZE}} value={doctorSelected} onChange={e=>setDoctorSelected(e.target.value)}>
                {
                  !doctorSelected && <option selected disabled>
                    {t('Choose a doctor')}
                  </option>
                }
                {
                listDoctors?.map((value,_)=>{
                  return <option key={value.id} value={value.id}>
                    {value.fullName} (Email: {value.email})
                  </option>
                })
              }
              </select>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-column mb-4">
              <span className="mc-heading text-capitalize">{t("Status of clinic")}:</span>
              <div className="d-flex flex-row align-items-center">
                {
                  statusSelected && <input style={{ outline:"none" }} className="border-0 p-0 rounded me-3" type={'color'} value={(findObjectFromArray(statusOfClinic,statusSelected).colorStatus)} disabled />
                }
                <select className="form-select text-gray" style={{fontSize:FONT_SIZE}} value={statusSelected} onChange={e=>setStatusSelected(e.target.value)}>
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
              <span className="mc-heading text-capitalize">{t("Rooms of clinic")}:</span>
              <div className="d-flex flex-row align-items-center">
                {
                  roomSelected && <input style={{ outline:"none" }} className="border-0 p-0 rounded me-3" type={'color'} value={(findObjectFromArray(roomOfClinic,roomSelected).colorRoom)} disabled />
                }
                <select className="form-select text-gray" style={{fontSize:FONT_SIZE}} value={roomSelected} onChange={e=>setRoomSelected(e.target.value)}>
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
              <span className="mc-heading text-capitalize">{t("Services of clinic")}:</span>
              <div className="d-flex flex-row align-items-center">
                {
                  serviceSelected && <input style={{ outline:"none" }} className="border-0 p-0 rounded me-3" type={'color'} value={(findObjectFromArray(servicesOfClinic,serviceSelected).colorService)} disabled />
                }
                <select className="form-select text-gray" style={{fontSize:FONT_SIZE}} value={serviceSelected} onChange={e=>setServiceSelected(e.target.value)}>
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
              <input className="mc-gray form-control" type={'date'} value={appointmentDate} onChange={e=>setAppointmentDate(e.target.value)}/>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-row mb-4 align-items-center justify-content-between">
              <div className="d-flex flex-column align-items-start justify-content-center">
                <span className="mc-heading text-capitalize">{t("Time start")}:</span>
                <input className="mc-gray form-control" type={'time'} value={timeStart} onChange={e=>setTimeStart(e.target.value)} min={'08:00'} max={'18:00'}/>
              </div>
              <div className="d-flex flex-column align-items-start justify-content-center">
                <span className="mc-heading text-capitalize">{t("Time end")}:</span>
                <input className="mc-gray form-control" type={'time'} value={timeEnd} onChange={e=>setTimeEnd(e.target.value)} min={'08:00'} max={'18:00'}/>
              </div>
            </div>
            <div className="d-flex w-100 flex-grow-1 flex-column mb-2">
              <span className="mc-heading text-capitalize">{t("Note for appointment")}:</span>
              <textarea className="text-gray form-control" placeholder={t('Note something for schedule ...')} style={{fontSize:FONT_SIZE}} value={note} onChange={e=>setNote(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary d-flex align-items-center py-2 px-3" data-bs-dismiss="modal" onClick={props.closeModal}>
            <span className="material-symbols-outlined me-2" style={{fontSize:"25px"}}>
              close
            </span>
            <span>{t('Close')}</span>
          </button>
          <button type="button" className="btn btn-primary d-flex align-items-center py-2 px-3">
            <span className="material-symbols-outlined me-2" style={{fontSize:"25px"}}>
              save
            </span>
            <span>{props.createAppointment?t('Save'):t('Update')}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
})

export default AppointmentModal;