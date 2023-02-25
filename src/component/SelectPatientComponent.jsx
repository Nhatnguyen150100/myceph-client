import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FONT_SIZE, SELECT_PATIENT_MODE } from "../common/Utility.jsx";
import { getToServerWithToken } from "../services/getAPI.jsx";
import { refreshToken } from "../services/refreshToken.jsx";
import SelectClinicComponent from "./SelectClinicComponent.jsx";

export default function SelectPatientComponent(props) {
  const {t} = useTranslation();
  const doctor = useSelector(state=>state.doctor.data);
  const currentPatient = useSelector(state=>state.general.currentPatient);
  const selectPatientMode = useSelector(state=>state.general.selectPatientMode);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [listPatient,setListPatient] = useState([]);

  useEffect(()=>{
    if(selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT) getAllPaitentForDoctor();
  },[])

  const getAllPaitentForDoctor = (name) => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/patient/getPatientListForDoctor/${doctor.id}?page=${1}&pageSize=${10}&nameSearch=${name?name:''}`).then(result=>{
        setListPatient(result.data);
        resolve();
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getAllPaitentForDoctor(name));
        }else{
          toast.error(err.message);
        }
        reject(err);
      });
    })
  }

  console.log(listPatient);

  return <div className="d-flex flex-row justify-content-between align-items-center">
    <fieldset className="border rounded p-2 d-flex flex-row align-items-center flex-wrap justify-content-sm-center justify-content-center me-3" style={{minWidth:"450px"}}>
      <legend style={{fontSize:FONT_SIZE}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
        {t('select patient')}
      </legend>
    </fieldset>
    <SelectClinicComponent condition={selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT} />
  </div>
}