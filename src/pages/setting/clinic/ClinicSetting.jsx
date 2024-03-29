import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FONT_SIZE } from "../../../common/Utility.jsx";
import { setClinicSettingTab } from "../../../redux/GeneralSlice.jsx";
import ClinicEncryptionManagement from "./ClinicEncryptionManagement.jsx";
import MemberOfClinic from "./MemberOfClinic.jsx";
import Myclinic from "./Myclinic.jsx";
import RoomSetting from "./RoomSetting.jsx";
import ServicesSetting from "./ServicesSetting.jsx";
import StatusSetting from "./StatusSetting.jsx";

export default function ClinicSetting(props){
  const clinic = useSelector(state=>state.clinic);
  const dispatch = useDispatch();
  const selectedTab = useSelector(state=>state.general.clinicSettingTab);
  const {t} = useTranslation();
  let currentTab = null;
  
  switch(selectedTab){
    case 0: currentTab = <Myclinic />;
      break;
    case 1: currentTab = <MemberOfClinic />;
      break;
    case 2: currentTab = <RoomSetting />;
      break;
    case 3: currentTab = <ServicesSetting />;
      break;
    case 4: currentTab = <StatusSetting />;
      break;
    case 5: currentTab = <ClinicEncryptionManagement />;
      break;
    default : currentTab = <div>error</div>
  }

  return <div className="d-flex flex-column h-100">
    <div className="w-100 d-flex justify-content-end mc-background-color-white py-2 rounded">
      <div className="d-flex flex-row align-items-center justify-content-between flex-wrap">
        <button type="button" className={`btn full-width-on-mobile me-1 px-3 py-0  text-white-hover ${selectedTab===0?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setClinicSettingTab(0))}>
          <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{t('my clinic profile')}</span>
        </button>
        {
          clinic.idClinicDefault && <button type="button" className={`btn full-width-on-mobile me-1 px-3 py-0 text-white-hover ${selectedTab===1?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setClinicSettingTab(1))}>
            <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{t('member of clinic')}</span>
          </button>
        }
        {
          clinic.idClinicDefault && <button type="button" className={`btn full-width-on-mobile me-1 px-3 py-0 text-white-hover ${selectedTab===2?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setClinicSettingTab(2))}>
            <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{t('rooms of clinic')}</span>
          </button>
        }
        {
          clinic.idClinicDefault && <button type="button" className={`btn full-width-on-mobile me-1 px-3 py-0 text-white-hover ${selectedTab===3?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setClinicSettingTab(3))}>
            <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{t('services of clinic')}</span>
          </button>
        }
        {
          clinic.idClinicDefault && <button type="button" className={`btn full-width-on-mobile me-1 px-3 py-0 text-white-hover ${selectedTab===4?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setClinicSettingTab(4))}>
            <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{t('status of clinic')}</span>
          </button>
        }
        {
          clinic.idClinicDefault && <button type="button" className={`btn full-width-on-mobile px-3 py-0 text-white-hover ${selectedTab===5?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setClinicSettingTab(5))}>
            <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{t('encryption management')}</span>
          </button>
        }
      </div>
    </div>
    {currentTab}
  </div>
}