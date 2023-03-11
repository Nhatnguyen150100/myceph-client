import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cookies } from "../common/Utility.jsx";
import NavbarComponent from "../component/NavbarComponent.jsx";
import { setArrayClinic, setIdClinicDefault, setRoleOfDoctor } from "../redux/ClinicSlice.jsx";
import { setAppName } from "../redux/GeneralSlice.jsx";
import { getToServerWithToken } from "../services/getAPI.jsx";
import { refreshToken } from "../services/refreshToken.jsx";

export default function HomePage(props) {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const isRefresh = useSelector(state=>state.general.isRefresh);
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