import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavbarComponent from "../../component/NavbarComponent.jsx";
import { setDataClinic } from "../../redux/ClinicSlice.jsx";
import { logOutDoctor } from "../../redux/DoctorSlice.jsx";
import { setAppName, setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { getToServerWithToken } from "../../services/getAPI.jsx";
import ClinicSetting from "./clinic/ClinicSetting.jsx";
import DoctorSetting from "./doctor/DoctorSetting.jsx";


const FONT_SIZE = '15px';
const FONT_SIZE_HEADER = '17px';

export default function Setting(props){
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [selectedTab,setSelectedTab] = useState(0);
  const [tabName,setTabName] = useState('doctor');
  const doctor = useSelector(state=>state.doctor.data);
  const nav = useNavigate();

  const getAllClinic = () => {
    dispatch(setLoadingModal(true));
    getToServerWithToken(`/v1/doctor/getAllClinicFromDoctor/${doctor.id}`).then(result => {
      dispatch(setDataClinic(result.data));
    }).catch((err) =>{
      if(!err.isLogin){
        dispatch(logOutDoctor());
        toast.info(t(err.message));
        nav("/login");
      }else{
        toast.error(t(err.message));
      }
    }
    ).finally(() => dispatch(setLoadingModal(false)));
  }

  let currentTab = null;

  switch(selectedTab){
    case 0: currentTab = <DoctorSetting FONT_SIZE={FONT_SIZE}/>
      break;
    case 1: currentTab = <ClinicSetting FONT_SIZE={FONT_SIZE}/>
      break;
    default: currentTab = <div>Error</div>
  }

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t('setting')}`));
    getAllClinic();
  },[])

  return <div className="d-flex flex-column justify-content-start align-items-center">
    <NavbarComponent />
    <div className="d-flex flex-column h-100 container">
      <div className="d-flex w-100 justify-content-start align-items-center my-2">
        {
          selectedTab === 0 ? 
          <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white' style={{height:"50px"}}>
            <span className="material-symbols-outlined m-0" style={{fontSize:"50px",fontWeight:"100"}}>
              clinical_notes
            </span>
          </div>
          :
          <button className='btn btn-hover-bg p-0 me-3 border-0' style={{height:"50px"}} onClick={e=>{setSelectedTab(0);setTabName(t('doctor'))}}>
            <span className="material-symbols-outlined m-0" style={{fontSize:"50px",fontWeight:"100"}}>
              clinical_notes
            </span>
          </button>
        }
        {
          selectedTab === 1 ? 
          <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white' style={{height:"50px"}}>
            <span className="material-symbols-outlined m-0" style={{fontSize:"50px",fontWeight:"100"}}>
              local_hospital
            </span>
          </div>
          :
          <button className='btn btn-hover-bg p-0 me-3 border-0' style={{height:"50px"}} onClick={e=>{setSelectedTab(1);setTabName(t('clinic'))}}>
            <span className="material-symbols-outlined m-0" style={{fontSize:"50px",fontWeight:"100"}}>
              local_hospital
            </span>
          </button>
        }
      </div>
      <div className="w-100 mc-background py-1 d-flex justify-content-center">
        <span className="text-white text-center text-uppercase fw-bold " style={{fontSize:FONT_SIZE_HEADER}}>{tabName}</span>
      </div>
      {currentTab}
    </div>
  </div>
}