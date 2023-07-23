import { t } from "i18next";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useNavigate } from "react-router-dom";
import { FONT_TAB, MEDICAL_RECORD_TABS, SELECT_PATIENT_MODE, SOFT_WARE_LIST } from "../../common/Utility.jsx";
import NavbarComponent from "../../components/NavbarComponent.jsx";
import SelectPatientComponent from "../../components/SelectPatientComponent.jsx";
import ShowImageModal from "../../components/ShowImageModal.jsx";
import SoftWareListComponent from "../../components/SoftWareListComponent.jsx";
import { setAppName, setMedicalRecordTab } from "../../redux/GeneralSlice.jsx";
import PatientInformation from "./PatientInformation.jsx";
import PatientRecord from "./patientRecord/PatientRecord.jsx";
import PatientTreatmentHistory from "./PatientTreatmentHistory.jsx";

export default function MedicalRecord(props){
  const dispatch = useDispatch();
  const nav = useNavigate();
  const doctor = useSelector(state=>state.doctor);
  const clinic = useSelector(state=>state.clinic);
  const selectedTab = useSelector(state=>state.general.medicalRecordTab);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const currentPatient = useSelector(state=>state.patient.currentPatient);

	let checkRoleMode = null;

  switch(selectPatientOnMode){
    case SELECT_PATIENT_MODE.SHARE_PATIENT: checkRoleMode = 'checkRole';
      break;
    case SELECT_PATIENT_MODE.CLINIC_PATIENT: checkRoleMode = clinic.roleOfDoctor !== 'admin' ? 'checkRole' : 'unCheck';
      break
    default: checkRoleMode = 'unCheck';
		break;
  }

  let currentTab = null;

  switch(selectedTab){
    case MEDICAL_RECORD_TABS.INFORMATION: currentTab = <PatientInformation checkRoleMode={checkRoleMode} />
      break;
    case MEDICAL_RECORD_TABS.RECORD: currentTab = <PatientRecord checkRoleMode={checkRoleMode}/>
      break;
    case MEDICAL_RECORD_TABS.TREATMENT_HISTORY: currentTab = <PatientTreatmentHistory checkRoleMode={checkRoleMode}/>
      break;
    default: currentTab = <div className="h-100 w-100 d-flex justify-content-center align-items-center">
      <strong className="text-danger fw-bold">{t('page not found')}</strong>    
    </div>
  }

  useEffect(()=>{
    if(!doctor.data?.id) nav('/login');
  },[])

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t(SOFT_WARE_LIST.MEDICAL_RECORD)}`));
  },[])

  return <div className="d-flex flex-column justify-content-start align-items-center">
    <ShowImageModal/>
    <NavbarComponent />
    <div className="d-flex flex-column h-100 container my-1">
      <div className="d-flex flex-wrap flex-row justify-content-between align-items-center w-100 mb-3" style={{minHeight:`${selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
        <SelectPatientComponent condition={selectPatientOnMode === SELECT_PATIENT_MODE.CLINIC_PATIENT} showSelectedPatient={true}/>
        <SoftWareListComponent />
      </div>
      <div className="w-100 mc-background py-1 d-flex justify-content-end align-items-start rounded">
        <button
          onClick={e=>dispatch(setMedicalRecordTab(MEDICAL_RECORD_TABS.INFORMATION))} 
          type="button" 
          className={`border-0 mc-color-hover text-uppercase fw-bold border-end pe-2 py-1 ${selectedTab===MEDICAL_RECORD_TABS.INFORMATION?'mc-pale-color':'text-white'}`} 
          style={{fontSize:FONT_TAB,background:"none"}}
          disabled={selectedTab===MEDICAL_RECORD_TABS.INFORMATION}
          >
            {t('information')}
        </button>
        <button 
          onClick={e=>dispatch(setMedicalRecordTab(MEDICAL_RECORD_TABS.RECORD))} 
          type="button" 
          className={`border-0 mc-color-hover text-uppercase fw-bold border-end mx-2 py-1 pe-2 ${selectedTab===MEDICAL_RECORD_TABS.RECORD?'mc-pale-color':'text-white'}`} 
          style={{fontSize:FONT_TAB,background:"none"}}
          disabled={selectedTab===MEDICAL_RECORD_TABS.RECORD}
          >
            {t('record')}
        </button>
        <button 
          onClick={e=>dispatch(setMedicalRecordTab(MEDICAL_RECORD_TABS.TREATMENT_HISTORY))} 
          type="button" 
          className={`border-0 mc-color-hover text-uppercase fw-bold p-1 me-2 ${selectedTab===MEDICAL_RECORD_TABS.TREATMENT_HISTORY?'mc-pale-color':'text-white'}`} 
          style={{fontSize:FONT_TAB,background:"none"}}
          disabled={selectedTab===MEDICAL_RECORD_TABS.TREATMENT_HISTORY}
          >
            {t('treatment history')}
        </button>
      </div>
      {
        currentPatient ? currentTab 
        :
        <div className="h-100 w-100 d-flex justify-content-center align-items-center mt-5">
          <h3 className="text-danger text-capitalize fw-bold">{t("can't found information of patient")}</h3>
        </div>
      }
    </div>
  </div>
}