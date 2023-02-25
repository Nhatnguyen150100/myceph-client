import { t } from "i18next";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FONT_TAB, MEDICAL_RECORD_TAB, SELECT_PATIENT_MODE, SOFT_WARE_LIST } from "../../common/Utility.jsx";
import NavbarComponent from "../../component/NavbarComponent.jsx";
import SelectPatientComponent from "../../component/SelectPatientComponent.jsx";
import SoftWareListComponent from "../../component/SoftWareListComponent.jsx";
import { setAppName, setMedicalRecordTab } from "../../redux/GeneralSlice.jsx";
import PatientInformation from "./PatientInformation.jsx";
import PatientTreatmentHistory from "./PatientTreatmentHistory.jsx";

export default function MedicalRecord(props){
  const dispatch = useDispatch();
  const selectedTab = useSelector(state=>state.general.medicalRecordTab);
  const selectPatientMode = useSelector(state=>state.general.selectPatientMode);

  let currentTab = null;

  switch(selectedTab){
    case MEDICAL_RECORD_TAB.INFORMATION: currentTab = <PatientInformation />
      break;
    // case MEDICAL_RECORD_TAB.RECORD: currentTab = <Patient />
    //   break;
    case MEDICAL_RECORD_TAB.TREATMENT_HISTORY: currentTab = <PatientTreatmentHistory />
      break;
    default: currentTab = <div className="h-100 w-100 d-flex justify-content-center align-items-center">
      <strong className="text-danger fw-bold">{t('page not found')}</strong>    
    </div>
  }

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t(SOFT_WARE_LIST.MEDICAL_RECORD.appName)}`));
  },[])

  return <div className="d-flex flex-column justify-content-start align-items-center h-100">
    <NavbarComponent />
    <div className="d-flex flex-column h-100 container py-3">
      <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-2" style={{minHeight:`${selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
        <SelectPatientComponent />
        <SoftWareListComponent />
      </div>
      <div className="w-100 mc-background py-1 d-flex justify-content-end align-items-center rounded">
        <button
          onClick={e=>dispatch(setMedicalRecordTab(0))} 
          type="button" 
          className={`border-0 mc-color-hover text-uppercase fw-bold border-end pe-2 py-1 ${selectedTab===MEDICAL_RECORD_TAB.INFORMATION?'mc-pale-color':'text-white'}`} 
          style={{fontSize:FONT_TAB,background:"none"}}
          disabled={selectedTab===MEDICAL_RECORD_TAB.INFORMATION}
          >
            {t('information')}
        </button>
        <button 
          onClick={e=>dispatch(setMedicalRecordTab(1))} 
          type="button" 
          className={`border-0 mc-color-hover text-uppercase fw-bold border-end mx-2 py-1 pe-2 ${selectedTab===MEDICAL_RECORD_TAB.RECORD?'mc-pale-color':'text-white'}`} 
          style={{fontSize:FONT_TAB,background:"none"}}
          disabled={selectedTab===MEDICAL_RECORD_TAB.RECORD}
          >
            {t('record')}
        </button>
        <button 
          onClick={e=>dispatch(setMedicalRecordTab(2))} 
          type="button" 
          className={`border-0 mc-color-hover text-uppercase fw-bold p-1 me-2 ${selectedTab===MEDICAL_RECORD_TAB.TREATMENT_HISTORY?'mc-pale-color':'text-white'}`} 
          style={{fontSize:FONT_TAB,background:"none"}}
          disabled={selectedTab===MEDICAL_RECORD_TAB.TREATMENT_HISTORY}
          >
            {t('treatment history')}
        </button>
      </div>
      {currentTab}
    </div>
  </div>
}