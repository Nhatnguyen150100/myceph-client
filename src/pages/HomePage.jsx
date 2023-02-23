import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavbarComponent from "../component/NavbarComponent.jsx";
import { setDataClinic, setIdClinicDefault, setRoleOfDoctor } from "../redux/ClinicSlice.jsx";
import { setAppName } from "../redux/GeneralSlice.jsx";
import { getToServerWithToken } from "../services/getAPI.jsx";
import { refreshToken } from "../services/refreshToken.jsx";

export default function HomePage(props) {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const doctor = useSelector(state=>state.doctor.data);
  const nav = useNavigate();

  const getAllClinicAndSetDefault = () => {
    return new Promise((resolve,reject) =>{
      getToServerWithToken(`/v1/doctor/getAllClinicFromDoctor/${doctor.id}`).then(result => {
        result.data.map(clinic=> {
          if(clinic.roleOfDoctor==='admin'){
            dispatch(setIdClinicDefault(clinic.id));
            dispatch(setRoleOfDoctor(clinic.roleOfDoctor))
          }
        })
        dispatch(setDataClinic(result.data));
        resolve();
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getAllClinicAndSetDefault());
        }else{
          toast.error(err.message);
        }
        reject(err);
      })
    })
  }

  useEffect(()=>{
    if(doctor){
      getAllClinicAndSetDefault();
    }
    dispatch(setAppName(`Myceph - ${t('homepage')}`));
  },[])

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