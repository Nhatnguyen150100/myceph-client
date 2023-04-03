import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DB_ENCRYPTION_CLINIC, DB_ENCRYPTION_DOCTOR, DB_ENCRYPTION_SHAREPATIENT, disConnectIndexDB, getData, onOpenIndexDB } from "../common/ConnectIndexDB.jsx";
import { cookies } from "../common/Utility.jsx";
import NavbarComponent from "../component/NavbarComponent.jsx";
import { setArrayClinic, setEncryptKeyClinic, setIdClinicDefault, setRoleOfDoctor } from "../redux/ClinicSlice.jsx";
import { setEncryptKey } from "../redux/DoctorSlice.jsx";
import { setAppName } from "../redux/GeneralSlice.jsx";
import { setArrayPatient, setCurrentPatient } from "../redux/PatientSlice.jsx";
import { getToServerWithToken } from "../services/getAPI.jsx";
import { refreshToken } from "../services/refreshToken.jsx";

export default function HomePage(props) {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic);
  const nav = useNavigate();

  const getAllClinicAndSetDefault = () => {
    return new Promise((resolve,reject) =>{
      getToServerWithToken(`/v1/doctor/getAllClinicFromDoctor/${doctor.id}`).then(result => {
        result.data.map(clinic => {
          if(clinic.roleOfDoctor==='admin'){
            !currentPatient?.id && getToServerWithToken(`/v1/patient/getPatientListForClinic/${clinic.id}?page=${1}&pageSize=${10}&nameSearch=${''}`).then(result=>{dispatch(setArrayPatient(result.data));dispatch(setCurrentPatient(result.data[0]))})
            dispatch(setIdClinicDefault(clinic.id));
            dispatch(setRoleOfDoctor(clinic.roleOfDoctor))
          }
        })
        dispatch(setArrayClinic(result.data));
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getAllClinicAndSetDefault());
        }else{
          toast.error(err.message);
        }
        reject(err);
      })
    })
  }

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t('homepage')}`));
    if(doctor && cookies.get('accessToken')){
      getAllClinicAndSetDefault();
    }
  },[])

  useEffect(()=>{
    let indexDB = null;
    onOpenIndexDB(DB_ENCRYPTION_DOCTOR).then(db=>{
      indexDB = db;
      getData(db,doctor.id,DB_ENCRYPTION_DOCTOR).then(data => 
        dispatch(setEncryptKey({key: data.key, iv: data.iv}))
      )
      getData(db,clinic.idClinicDefault,DB_ENCRYPTION_CLINIC).then(data => 
        dispatch(setEncryptKeyClinic({key: data.key, iv: data.iv}))
      )
    }).finally(()=>disConnectIndexDB(indexDB));
  },[])

  // useEffect(()=>{
  //   let indexDB = null;
  //   onOpenIndexDB(DB_ENCRYPTION_CLINIC,2).then(db=>{
  //     indexDB = db;
  //     getData(db,clinic.idClinicDefault,DB_ENCRYPTION_CLINIC).then(data => 
  //       dispatch(setEncryptKeyClinic({key: data.key, iv: data.iv}))
  //     )
  //   }).finally(()=>disConnectIndexDB(indexDB));
  // },[])

  // useEffect(()=>{
  //   let indexDB = null;
  //   onOpenIndexDB(DB_ENCRYPTION_SHAREPATIENT).then(db=>{
  //     indexDB = db;
  //     getData(db,doctor.id,DB_ENCRYPTION_SHAREPATIENT).then(data => 
  //       dispatch(setEncryptKey({key: data.key, iv: data.iv}))
  //     )
  //   }).finally(()=>disConnectIndexDB(indexDB));
  // },[])

  return <div className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
    <NavbarComponent />
    <div className="h-100 w-100" style={{
      height: '100%',
      backgroundImage: `url("/assets/images/home-background-desktop.jpg")`,
      backgroundSize: 'cover',
    }}>
      <div className="container h-100">
      </div>
    </div>
    
  </div>
}