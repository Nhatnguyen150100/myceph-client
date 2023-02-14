import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Myclinic from "./Myclinic.jsx";

export default function ClinicSetting(props){
  const [selectedTab,setSelectedTab] = useState(0);
  const {t} = useTranslation();
  let currentTab = null;

  switch(selectedTab){
    case 0: currentTab = <Myclinic FONT_SIZE={props.FONT_SIZE} />;
    break;
    case 1: currentTab = <div>
      member of clinic
    </div>
    break;
    default : currentTab = <div>error</div>
  }

  return <div className="d-flex flex-column h-100">
  <div className="w-100 d-flex justify-content-end mc-background-color-white py-2">
    <div className="d-flex flex-row align-items-center justify-content-between">
      <button type="button" className={`btn me-3  text-white-hover ${selectedTab===0?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(0)}>
        <span className="text-capitalize" style={{fontSize:props.FONT_SIZE}}>{t('my clinic profile')}</span>
      </button>
      <button type="button" className={`btn  text-white-hover ${selectedTab===1?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(1)}>
        <span className="text-capitalize" style={{fontSize:props.FONT_SIZE}}>{t('member of clinic')}</span>
      </button>
    </div>
  </div>
  {currentTab}
</div>
}