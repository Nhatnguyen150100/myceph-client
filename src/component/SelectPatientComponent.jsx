import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { computeAge, FONT_SIZE, FONT_SIZE_HEADER, SELECT_PATIENT_MODE, SOFT_WARE_LIST } from "../common/Utility.jsx";
import { setListAppointmentDate, setPropertiesClinic } from "../redux/CalendarSlice.jsx";
import { setArrayPatient, setCurrentPatient } from "../redux/PatientSlice.jsx";
import { getToServerWithToken } from "../services/getAPI.jsx";
import { refreshToken } from "../services/refreshToken.jsx";
import SelectClinicComponent from "./SelectClinicComponent.jsx";

let nameSearchTimeout = null;
const FONT_TEXT = '14px';

export default function SelectPatientComponent(props) {
  const {t} = useTranslation();
  const arrayPatients = useSelector(state=>state.patient.arrayPatients);
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const softWareSelectedTab = useSelector(state=>state.general.softWareSelectedTab);
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const [nameSearch,setNameSearch] = useState('');
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [previousClinicId,setPreviousClinicId] = useState(clinic.idClinicDefault);
  const [count,setCount] = useState(arrayPatients.length);

  let url = null;

  switch(selectPatientOnMode){
    case SELECT_PATIENT_MODE.MY_PATIENT: url = `/v1/patient/getPatientListForDoctor/${doctor.id}?`;
      break;
    case SELECT_PATIENT_MODE.CLINIC_PATIENT: if(clinic.roleOfDoctor==='admin'){
      url = `/v1/patient/getPatientListForClinic/${clinic.idClinicDefault}?`
    }else url = `/v1/patient/getSharedPatientOfDoctorInClinic/${doctor.id}?idClinic=${clinic.idClinicDefault}&`;
      break;
    case SELECT_PATIENT_MODE.SHARE_PATIENT: url = `/v1/sharePatient/getListSharePatientOfCurrentDoctor/${doctor.id}?`;
      break;
    default: if(SOFT_WARE_LIST.CALENDAR===softWareSelectedTab){
      url = `/v1/patient/getPatientListForClinic/${clinic.idClinicDefault}?`;
    }
  }

  useEffect(()=>{
    if(clinic.idClinicDefault && (selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT || SOFT_WARE_LIST.CALENDAR===softWareSelectedTab)) getAllPatient();
  },[clinic.idClinicDefault])    
  
  const onNameSearchChange = e => {
    setNameSearch(e.target.value);
    if (nameSearchTimeout) clearTimeout(nameSearchTimeout);
    nameSearchTimeout = setTimeout(getAllPatient(e.target.value),300);
  }

  /**
   * todo: lấy danh sách bệnh nhân 
   * @param {*} name Tên bệnh nhân cần tìm
   * @returns 
   */
  const getAllPatient = (name) => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`${url}page=${1}&pageSize=${10}&nameSearch=${name?name:''}`).then(result=>{
        dispatch(setArrayPatient(result.data));
        setCount(result.count);
        if(result.count===0) toast.warning(t('This clinic has no patients'));
        if(!currentPatient){
          dispatch(setCurrentPatient(result.data[0]));
        }
        // chuyển bệnh nhân trong cùng 1 phòng khám thì không bị reset lại currentPatient
        if(clinic.idClinicDefault && (selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT || SOFT_WARE_LIST.CALENDAR===softWareSelectedTab)){
          setPreviousClinicId(clinic.idClinicDefault);
          if(previousClinicId!==clinic.idClinicDefault) dispatch(setCurrentPatient(result.data[0]));
        }
        // nếu đang ở lịch thì lấy thêm các thuộc tính của phòng khám hiện tại và danh sách lịch hẹn
        if(SOFT_WARE_LIST.CALENDAR===softWareSelectedTab){
          getPropertiesClinic();
          getListAppointmentDate();
        }
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          reject();
          refreshToken(nav,dispatch).then(()=>getAllPatient(name,getPropertiesClinic));
        }else{
          toast.error(err.message);
        }
        reject(err);
      });
    })
  }

  const getListAppointmentDate = () => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/schedule/getAllAppointments/${clinic.idClinicDefault}?idDoctor=${clinic.roleOfDoctor === 'admin'?'':doctor.id}`).then(result => {
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

  return <div className="d-flex flex-row justify-content-between align-items-center">
    {
      props.showSelectedPatient && <fieldset className="border rounded px-2 d-flex flex-column align-items-center flex-wrap justify-content-sm-center justify-content-center pt-0 pb-1 me-3 mb-2" style={{minWidth:"400px"}}>
        <legend style={{fontSize:FONT_SIZE}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
          {t('select patient')}
        </legend>
        <div className="dropdown w-100 p-0 m-0">
          <button className="btn btn-hover-bg border-0 p-0 w-100 text-capitalize" onClick={e=>getAllPatient()} type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{fontSize:FONT_SIZE_HEADER,background:"#f7f7f7"}}>
            {currentPatient?.fullName}
          </button>
          <ul className="dropdown-menu w-100">
            <div className="d-flex flex-row w-100 align-items-center mc-background-color-white rounded">
              <input className="border-0 flex-grow-1 mc-background-color-white rounded p-2" placeholder={t("Enter patient name to search")} style={{fontSize:FONT_TEXT,outline:"none"}} value={nameSearch} onChange={onNameSearchChange}/>
              <span className="material-symbols-outlined p-0 me-2">
                person_search
              </span>
            </div>
            {
              arrayPatients?.map((patient,index) => {
                return <button onClick={e=>dispatch(setCurrentPatient(patient))} key={patient.id} style={{background:`${index%2!==0&&'#f7f7f7'}`}} type="button" className="btn btn-hover-bg text-capitalize py-1 m-0 d-flex flex-column flex-grow-1 justify-content-center align-items-center w-100">
                  <span>{patient.fullName}</span>
                  <div className="d-flex flex-grow-1 flex-row justify-content-between w-100 align-items-center">
                    <div className="w-auto d-flex flex-row align-items-center justify-content-start">
                      <span className="text-capitalize fw-bold" style={{fontSize:FONT_TEXT}}>{'( '}{patient.gender}{' |'}</span>
                      <img className="mx-1" src={`/assets/images/${patient.gender==='male'?'male.png':'female.png'}`} height="15" alt={`${patient.gender==='male'?'male.png':'female.png'}`}/>
                      <span className="fw-bold" style={{fontSize:FONT_TEXT}}>{')'}</span>
                    </div>
                    <span className="text-capitalize fw-bold" style={{fontSize:FONT_TEXT}}>{'( '}{computeAge(patient.birthday).age}{t(' age')}{computeAge(patient.birthday).month>0 && (' - '+computeAge(patient.birthday).month+t(' month'))}{' )'}</span>
                  </div>
                </button>
              })
            }
            <div className="d-flex flex-grow-1 w-100 border-top">
              <span className="text-capitalize text-info w-100 text-center mt-2" style={{fontSize:FONT_TEXT}}>{`${count>10?t('only display 10 patients out of total'):''}`+' '+`${count}`+' '+t('patients')}</span>
            </div>
          </ul>
        </div>
        <div className="d-flex flex-grow-1 flex-row justify-content-between w-100 align-items-center">
          <div className="w-auto d-flex flex-row align-items-center justify-content-start">
            <span className="text-capitalize fw-bold" style={{fontSize:FONT_TEXT}}>{'( '}{currentPatient?.gender}{' |'}</span>
            <img className="mx-1" src={`/assets/images/${currentPatient?.gender==='male'?'male.png':'female.png'}`} height="15" alt={`${currentPatient?.gender==='male'?'male.png':'female.png'}`}/>
            <span className="fw-bold" style={{fontSize:FONT_TEXT}}>{')'}</span>
          </div>
          <span className="text-capitalize fw-bold" style={{fontSize:FONT_TEXT}}>{'( '}{computeAge(currentPatient?.birthday).age}{t(' age')}{computeAge(currentPatient?.birthday).month>0 && (' - '+computeAge(currentPatient?.birthday).month+t(' month'))}{' )'}</span>
        </div>
      </fieldset>
    }
    <SelectClinicComponent condition={props.condition} />
  </div>
}