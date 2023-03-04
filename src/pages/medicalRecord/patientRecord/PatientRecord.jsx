import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FONT_SIZE, FONT_SIZE_ICON } from "../../../common/Utility.jsx";
import Diagnsis from "./Diagnosis.jsx";
import ExtraOral from "./ExtraOral.jsx";
import History from "./History.jsx";
import IntraOral from "./IntraOral.jsx";
import Radiography from "./Radiography.jsx";
import TreatmentPlan from "./TreatmentPlan.jsx";

export default function PatientRecord(props){
  const {t} = useTranslation();
  const [selectedTab,setSelectedTab] = useState(2);


  let currentTab = null;
  switch(selectedTab){
    case 0: currentTab = <History />
      break;
    case 1: currentTab = <ExtraOral />
      break;
    case 2: currentTab = <IntraOral />
      break;
    case 3: currentTab = <Radiography />
      break;
    case 4: currentTab = <Diagnsis />
      break;
    case 5: currentTab = <TreatmentPlan />
      break;
    default: currentTab = <div className="h-100 w-100 d-flex justify-content-center align-items-center">
      <strong className="text-danger fw-bold">{t('page not found')}</strong>    
    </div>
  }

  return <div className="w-100 h-100 d-flex flex-column flex-grow-1">
    <div className="w-100 d-flex justify-content-between mc-background-color-white py-2 rounded">
      <div className="d-flex flex-row align-items-center justify-content-between">
        <button type="button" className={`btn d-flex align-items-center me-1 px-2 py-0 text-white-hover ${selectedTab===0?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(0)}>
          <span className="material-symbols-outlined mc-color me-1" style={{fontSize:"25px"}}>
            feed
          </span>
          <span className="text-uppercase fw-bold mc-color" style={{fontSize:FONT_SIZE}}>{t('history')}</span>
        </button>
        <span className="vr"></span>
        <button type="button" className={`btn d-flex align-items-center mx-1 px-2 py-0  text-white-hover ${selectedTab===1?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(1)}>
          <span class="material-symbols-outlined mc-color me-1" style={{fontSize:"25px"}}>
            face
          </span>
          <span className="text-uppercase fw-bold mc-color" style={{fontSize:FONT_SIZE}}>{t('extra-oral')}</span>
        </button>
        <span className="vr"></span>
        <button type="button" className={`btn d-flex align-items-center mx-1 px-2 py-0  text-white-hover ${selectedTab===2?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(2)}>
          <span class="material-symbols-outlined mc-color me-1" style={{fontSize:"25px"}}>
            sentiment_very_satisfied
          </span>
          <span className="text-uppercase fw-bold mc-color" style={{fontSize:FONT_SIZE}}>{t('intra-oral')}</span>
        </button>
        <span className="vr"></span>
        <button type="button" className={`btn d-flex align-items-center mx-1 px-2 py-0  text-white-hover ${selectedTab===3?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(3)}>
          <span className="material-symbols-outlined mc-color me-1" style={{fontSize:"25px"}}>
            airline_seat_recline_normal
          </span>
          <span className="text-uppercase fw-bold mc-color" style={{fontSize:FONT_SIZE}}>{t('radiography')}</span>
        </button>
        <span className="vr"></span>
        <button type="button" className={`btn d-flex align-items-center mx-1 px-2 py-0  text-white-hover ${selectedTab===4?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(4)}>
          <span class="material-symbols-outlined mc-color me-1" style={{fontSize:"25px"}}>
            diagnosis
          </span>
          <span className="text-uppercase fw-bold mc-color" style={{fontSize:FONT_SIZE}}>{t('diagnosis')}</span>
        </button>
        <span className="vr"></span>
        <button type="button" className={`btn d-flex align-items-center ms-1 px-2 py-0  text-white-hover ${selectedTab===5?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(5)}>
          <span class="material-symbols-outlined mc-color me-1" style={{fontSize:"25px"}}>
            airline_seat_individual_suite
          </span>
          <span className="text-uppercase fw-bold mc-color" style={{fontSize:FONT_SIZE}}>{t('issue and plan')}</span>
        </button>
      </div>
    </div>
    {currentTab}
  </div>
}