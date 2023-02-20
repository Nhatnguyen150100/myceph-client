import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setClinicSettingTab } from "../../../redux/GeneralSlice.jsx";
import MemberOfClinic from "./MemberOfClinic.jsx";
import Myclinic from "./Myclinic.jsx";

export default function ClinicSetting(props){
  const clinic = useSelector(state=>state.clinic);
  const dispatch = useDispatch();
  const selectedTab = useSelector(state=>state.general.clinicSettingTab);
  const {t} = useTranslation();
  let currentTab = null;

  switch(selectedTab){
    case 0: currentTab = <Myclinic FONT_SIZE={props.FONT_SIZE} />;
    break;
    case 1: currentTab = <MemberOfClinic FONT_SIZE={props.FONT_SIZE} />;
    break;
    default : currentTab = <div>error</div>
  }

  return <div className="d-flex flex-column h-100">
  <div className="w-100 d-flex justify-content-end mc-background-color-white py-2">
    <div className="d-flex flex-row align-items-center justify-content-between">
      <button type="button" className={`btn me-3 px-3 py-0  text-white-hover ${selectedTab===0?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setClinicSettingTab(0))}>
        <span className="text-capitalize" style={{fontSize:props.FONT_SIZE}}>{t('my clinic profile')}</span>
      </button>
      {
        clinic.idClinicDefault && <button type="button" className={`btn px-3 py-0 text-white-hover ${selectedTab===1?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setClinicSettingTab(1))}>
          <span className="text-capitalize" style={{fontSize:props.FONT_SIZE}}>{t('member of clinic')}</span>
        </button>
      }
    </div>
  </div>
  {currentTab}
</div>
}