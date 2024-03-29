import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useNavigate } from "react-router-dom";
import { FONT_SIZE_HEAD, FONT_SIZE_HEADER, FONT_SIZE_ICONS } from "../../common/Utility.jsx";
import NavbarComponent from "../../components/NavbarComponent.jsx";
import { setAppName, setSettingTab } from "../../redux/GeneralSlice.jsx";
import ClinicSetting from "./clinic/ClinicSetting.jsx";
import DoctorSetting from "./doctor/DoctorSetting.jsx";

export default function Setting(props){
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const selectedTab = useSelector(state=>state.general.settingTab);
  const doctor = useSelector(state=>state.doctor);
  const [tabName,setTabName] = useState();

  useEffect(()=>{
    if(selectedTab===0) setTabName('doctor');
    else setTabName('clinic')
  },[selectedTab])

  let currentTab = null;

  switch(selectedTab){
    case 0: currentTab = <DoctorSetting/>
      break;
    case 1: currentTab = <ClinicSetting/>
      break;
    default: currentTab = <div>Error</div>
  }

  useEffect(()=>{
    if(!doctor.data?.id) nav('/login');
  },[])

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t('setting')}`));
  },[])

  return <div className="d-flex flex-column justify-content-start align-items-center h-100">
    <NavbarComponent />
    <div className="d-flex flex-column h-100 container">
      <div className="d-flex w-100 justify-content-start align-items-center my-3">
        {
          selectedTab === 0 ? 
          <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white d-flex flex-row align-items-end justify-content-start' style={{height:FONT_SIZE_ICONS}}>
            <span className="material-symbols-outlined m-0" style={{fontSize:FONT_SIZE_ICONS,fontWeight:"100"}}>
              clinical_notes
            </span>
            <span className="mx-2 mb-0 fw-bold text-capitalize" style={{fontSize:FONT_SIZE_HEAD}}>{t('doctor')}</span>
          </div>
          :
          <button className='btn btn-hover-bg p-0 me-3 border d-flex flex-row align-items-end justify-content-start' style={{height:FONT_SIZE_ICONS}} onClick={e=>{dispatch(setSettingTab(0));setTabName(t('doctor'))}}>
            <span className="material-symbols-outlined m-0" style={{fontSize:FONT_SIZE_ICONS,fontWeight:"100"}}>
              clinical_notes
            </span>
            <span className="mx-2 mb-0 fw-bold text-capitalize" style={{fontSize:FONT_SIZE_HEAD}}>{t('doctor')}</span>
          </button>
        }
        {
          selectedTab === 1 ? 
          <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white d-flex flex-row align-items-end justify-content-start' style={{height:FONT_SIZE_ICONS}}>
            <span className="material-symbols-outlined m-0" style={{fontSize:FONT_SIZE_ICONS,fontWeight:"100"}}>
              local_hospital
            </span>
            <span className="mx-2 mb-0 fw-bold text-capitalize" style={{fontSize:FONT_SIZE_HEAD}}>{t('clinic')}</span>
          </div>
          :
          <button className='btn btn-hover-bg p-0 me-3 border d-flex flex-row align-items-end justify-content-start' style={{height:FONT_SIZE_ICONS}} onClick={e=>{dispatch(setSettingTab(1));setTabName(t('clinic'))}}>
            <span className="material-symbols-outlined m-0" style={{fontSize:FONT_SIZE_ICONS,fontWeight:"100"}}>
              local_hospital
            </span>
            <span className="mx-2 mb-0 fw-bold text-capitalize" style={{fontSize:FONT_SIZE_HEAD}}>{t('clinic')}</span>
          </button>
        }
      </div>
      <div className="w-100 mc-background py-1 d-flex justify-content-center rounded">
        <span className="text-white text-center text-uppercase fw-bold " style={{fontSize:FONT_SIZE_HEADER}}>{t(tabName)}</span>
      </div>
      {currentTab}
    </div>
  </div>
}