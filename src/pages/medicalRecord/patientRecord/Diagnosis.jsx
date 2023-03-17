import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import InputWithLabel from "../../../common/InputWithLabel.jsx";
import { FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE } from "../../../common/Utility.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

export default function Diagnosis(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);

  const [editMode,setEditMode] = useState();
  const [diagnose,setDiagnose] = useState();
  const [prognosisAndNotes,setPrognosisAndNotes] = useState();

  const [previousData,setPreviousData] = useState();

  useEffect(()=>{
    if(patient.currentPatient) getDiagnosis();
  },patient.currentPatient.id)

  const onCancel = () => {
    setEditMode(false);
    updateState(previousData);
  }

  const updateState = (data) => {
    setDiagnose(data.diagnose);
    setPrognosisAndNotes(data.prognosisAndNotes);
  }

  const getDiagnosis = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/diagnosis/${patient.currentPatient.id}`).then(result => {
        setPreviousData(result.data);
        updateState(result.data);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getDiagnosis());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const onUpdateRadiography = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      putToServerWithToken(`/v1/diagnosis/updateDiagnosisAndTreatment/${patient.currentPatient.id}`,{
        idDoctor: doctor.data.id,
        diagnose: diagnose,
        prognosisAndNotes: prognosisAndNotes
      }).then(result => {
        updateState(result.data);
        setPreviousData(result.data);
        setEditMode(false);
        toast.success(result.message);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onUpdateRadiography());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  return <div className="h-100 w-100 d-flex flex-column justify-content-start mt-1">
    <div className="d-flex justify-content-end align-items-center mt-1 mb-2">
      {
        editMode ?
        <div>
          <IconButtonComponent className="btn-outline-success me-2" icon="done" onClick={onUpdateRadiography}  FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("save")}/>
          <IconButtonComponent className="btn-outline-danger" onClick={onCancel} icon="close" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("cancel")}/>
        </div>
        :
        <div>
          {
            ((selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor === 'admin') || selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT || patient.currentPatient['SharePatients.roleOfOwnerDoctor']==='edit') &&
            <IconButtonComponent className="btn-outline-warning" onClick={e=>setEditMode(true)} icon="edit" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("edit")}/>
          }
        </div>
      }
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('diagnosis')}
      </span>
    </div>
    <div className="w-100 h-auto mt-1">
      <InputWithLabel 
        editMode={editMode}
        onCancel={onCancel}
        onUpdate={onUpdateRadiography}
        placeholder={t('Enter Diagnosis')}
        classNameResult="flex-grow-1"
        type="text"
        value={diagnose}
        onChange={value=>setDiagnose(value)} 
        style={{fontSize:FONT_SIZE,width:"80px"}}
        result={diagnose?diagnose:t('no data')}
      />
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('prognosis and notes')}
      </span>
    </div>
    <div className="w-100 h-auto mt-1">
      <InputWithLabel 
        editMode={editMode}
        onCancel={onCancel}
        onUpdate={onUpdateRadiography}
        placeholder={t('Enter Prognosis And Notes')}
        classNameResult="flex-grow-1"
        type="text"
        value={prognosisAndNotes}
        onChange={value=>setPrognosisAndNotes(value)} 
        style={{fontSize:FONT_SIZE,width:"80px"}}
        result={prognosisAndNotes?prognosisAndNotes:t('no data')}
      />
    </div>
  </div>
}