import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { SELECT_PATIENT_MODE, SOFT_WARE_LIST, VIEW_CALENDAR } from "../common/Utility.jsx";
import { setListAppointmentDate, setPropertiesClinic, setViewCalendar } from "../redux/CalendarSlice.jsx";
import { setSoftWareSelectedTab } from "../redux/GeneralSlice.jsx";
import { getToServerWithToken } from "../services/getAPI.jsx";

export default function SoftWareListComponent(props){
  const softWareSelectedTab = useSelector(state=>state.general.softWareSelectedTab);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const clinic = useSelector(state=>state.clinic);
  const doctor = useSelector(state=>state.doctor.data);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const selectPatientMode = useSelector(state=>state.patient.selectPatientOnMode);
  const propertiesClinic = useSelector(state=>state.patient.propertiesClinic);

  const getPropertiesClinic = () => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/schedule/getPropertiesClinic/${clinic.idClinicDefault}`).then(result => {
        dispatch(setPropertiesClinic(result.data));
        resolve();
      }).catch(err =>{
        if(!err.refreshToken){
          toast.error(t(err.message));
        }
        reject();
      })
    })
  }  

  const getListAppointmentDate = (idPatient='') => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/schedule/getAllAppointments/${clinic.idClinicDefault}?idDoctor=${clinic.roleOfDoctor === 'admin'?'':doctor.id}&idPatient=${idPatient}`).then(result => {
        dispatch(setListAppointmentDate(result.data));
        resolve();
      }).catch(err =>{
        if(!err.refreshToken){
          toast.error(t(err.message));
        }
        reject();
      })
    })
  }

  return <div>
    {
      currentPatient && <div className="d-flex justify-content-start align-items-center my-2">
        {
          softWareSelectedTab === SOFT_WARE_LIST.MEDICAL_RECORD ?  
          <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white p-1'>
            <img src="/assets/images/MedicalRecord_active.png" width="34" height="34" alt="MedicalRecord"/>
          </div>
          :
          <Link onClick={e=>dispatch(setSoftWareSelectedTab(SOFT_WARE_LIST.MEDICAL_RECORD))} to={`/medicalRecord`} title={t("MedicalRecord")} className="btn btn-outline-info p-1 me-3 border-0">
            <img src="/assets/images/MedicalRecord.png" width="34" height="34" alt="MedicalRecord"/>
          </Link>
        }
        {
          softWareSelectedTab === SOFT_WARE_LIST.IMAGE_LIBRARY ? 
          <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white p-1'>
            <img src="/assets/images/imageLibrary_active.png" width="34" height="34" alt="MedicalRecord"/>
          </div>
          :
          <Link onClick={e=>dispatch(setSoftWareSelectedTab(SOFT_WARE_LIST.IMAGE_LIBRARY))} to={`/libraryImagesManagement`} title={t("ImageLibrary")} className="btn btn-outline-info p-1 me-3 border-0">
            <img src="/assets/images/imageLibrary.png" width="34" height="34" alt="MedicalRecord"/>
          </Link>
        }
        {
          softWareSelectedTab === SOFT_WARE_LIST.LATERALCEPH ? 
          <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white p-1'>
            <img src="/assets/images/LateralCeph_active.png" width="34" height="34" alt="MedicalRecord"/>
          </div>
          :
          <Link onClick={e=>dispatch(setSoftWareSelectedTab(SOFT_WARE_LIST.LATERALCEPH))} to={`/lateralCeph`} title={t("LateralCeph")} className="btn btn-outline-info p-1 me-3 border-0">
            <img src="/assets/images/LateralCeph.png" width="34" height="34" alt="MedicalRecord"/>
          </Link>
        }
        {
          softWareSelectedTab === SOFT_WARE_LIST.CALENDAR ? 
          <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white p-1'>
            <img src="/assets/images/CalendarNew_active.png" width="34" height="34" alt="MedicalRecord"/>
          </div>
          :
          <React.Fragment>
          {
            (selectPatientMode!==SELECT_PATIENT_MODE.MY_PATIENT && selectPatientMode!==SELECT_PATIENT_MODE.SHARE_PATIENT) && <Link title={t("Calendar")} to={'/schedule'} className="btn btn-outline-info p-1 me-3 border-0" onClick={e=>{         
              if(!propertiesClinic) getPropertiesClinic().then(getListAppointmentDate(currentPatient.id))
              else getListAppointmentDate(currentPatient.id);
              dispatch(setSoftWareSelectedTab(SOFT_WARE_LIST.CALENDAR));
              dispatch(setViewCalendar(VIEW_CALENDAR.BY_PATIENT));
            }}>
              <img src="/assets/images/CalendarNew.png" width="34" height="34" alt="MedicalRecord"/>
            </Link>
          }
          </React.Fragment>
        }
        {
          softWareSelectedTab === SOFT_WARE_LIST.DISCUSSION ? 
          <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white p-1'>
            <img src="/assets/images/Discussion_active.png" width="34" height="34" alt="MedicalRecord"/>
          </div>
          :
          <Link onClick={e=>dispatch(setSoftWareSelectedTab(SOFT_WARE_LIST.DISCUSSION))} to={`/discussion`} title={t("Discussion")} className="btn btn-outline-info p-1 me-3 border-0">
            <img src="/assets/images/Discussion.png" width="34" height="34" alt="MedicalRecord"/>
          </Link>
        }
      </div>
    }
  </div> 
}