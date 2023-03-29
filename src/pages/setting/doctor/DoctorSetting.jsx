import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FONT_SIZE } from "../../../common/Utility.jsx";
import { setDoctorSettingTab } from "../../../redux/GeneralSlice.jsx";
import MyEncryptionManagement from "./MyEncryptionManagement.jsx";
import MyProfile from "./MyProfile.jsx";
import OtherProfile from "./OtherProfile.jsx";

export default function DoctorSetting(props){
  const dispatch = useDispatch();
  const selectedTab = useSelector(state=>state.general.doctorSettingTab);
  let currentTab = null;
  
  const {t} = useTranslation();

  switch(selectedTab){
    case 0: currentTab = <MyProfile/>
    break;
    case 1: currentTab = <OtherProfile/>
    break;
    case 2: currentTab = <MyEncryptionManagement />
    break;
    default: currentTab = <div>error</div>
  }

  return <div className="d-flex flex-column h-100">
    <div className="w-100 d-flex justify-content-end mc-background-color-white py-2 rounded">
      <div className="d-flex flex-row align-items-center justify-content-between">
        <button type="button" className={`btn me-3 px-3 py-0 text-white-hover ${selectedTab===0?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setDoctorSettingTab(0))}>
          <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{t('my profile')}</span>
        </button>
        <button type="button" className={`btn me-3 px-3 py-0 text-white-hover ${selectedTab===1?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setDoctorSettingTab(1))}>
          <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{t('other doctor profile')}</span>
        </button>
        <button type="button" className={`btn px-3 py-0 text-white-hover ${selectedTab===2?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setDoctorSettingTab(2))}>
          <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{t('encryption management')}</span>
        </button>
      </div>
    </div>
    {currentTab}
  </div>
}