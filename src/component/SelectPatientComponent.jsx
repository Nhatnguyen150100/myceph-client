import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { computeAge, FONT_SIZE, FONT_SIZE_HEADER, SELECT_PATIENT_MODE } from "../common/Utility.jsx";
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
    default: url = null
  }

  useEffect(()=>{
    if(clinic.idClinicDefault && selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) getAllPaitent();
  },[clinic.idClinicDefault])

  const onNameSearchChange = e => {
    setNameSearch(e.target.value);
    if (nameSearchTimeout) clearTimeout(nameSearchTimeout);
    nameSearchTimeout = setTimeout(getAllPaitent,300,e.target.value);
  }

  const getAllPaitent = (name) => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`${url}page=${1}&pageSize=${10}&nameSearch=${name?name:''}`).then(result=>{
        dispatch(setArrayPatient(result.data));
        setCount(result.count);
        if(result.count===0){
          toast.info(t('this clinic has no patients'));
        }
        if(clinic.idClinicDefault && selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT){
          setPreviousClinicId(clinic.idClinicDefault);
          if(previousClinicId!==clinic.idClinicDefault) dispatch(setCurrentPatient(result.data[0]));
        }
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getAllPaitent(name));
        }else{
          toast.error(err.message);
        }
        reject(err);
      });
    })
  }

  return <div className="d-flex flex-row justify-content-between align-items-center">
    <fieldset className="border rounded px-2 d-flex flex-column align-items-center flex-wrap justify-content-sm-center justify-content-center pt-0 pb-1 me-3 mb-2" style={{minWidth:"400px"}}>
      <legend style={{fontSize:FONT_SIZE}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
        {t('select patient')}
      </legend>
      <div className="dropdown w-100 p-0 m-0">
        <button className="btn btn-hover-bg border-0 p-0 w-100" onClick={e=>{if(arrayPatients.length===0) getAllPaitent()}} type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{fontSize:FONT_SIZE_HEADER,background:"#f7f7f7"}}>
          {currentPatient?.fullName}
        </button>
        <ul className="dropdown-menu w-100">
          <div className="d-flex flex-row w-100 align-items-center mc-background-color-white rounded">
            <input className="border-0 flex-grow-1 mc-background-color-white rounded p-2" placeholder={t("Enter patient name to search")} style={{fontSize:FONT_TEXT,outline:"none"}} value={nameSearch} onChange={onNameSearchChange}/>
            <span className="material-symbols-outlined p-0 me-2">
              search
            </span>
          </div>
          {
            arrayPatients?.map((patient,index) => {
              return <button onClick={e=>dispatch(setCurrentPatient(patient))} key={patient.id} style={{background:`${index%2!==0&&'#f7f7f7'}`}} type="button" className="btn btn-hover-bg py-1 m-0 d-flex flex-column flex-grow-1 justify-content-center align-items-center w-100">
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
    <SelectClinicComponent condition={selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT} />
  </div>
}