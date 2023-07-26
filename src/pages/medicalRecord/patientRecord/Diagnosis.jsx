import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deCryptData, encryptData } from "../../../common/Crypto.jsx";
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
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);
  const encryptKeySharePatient = useSelector(state=>state.patient.encryptKeySharePatient);

  const [editMode,setEditMode] = useState();
  const [diagnose,setDiagnose] = useState();
  const [prognosisAndNotes,setPrognosisAndNotes] = useState();
  const [roleOfDoctor,setRoleOfDoctor] = useState('edit');

  const [previousData,setPreviousData] = useState();

  const isEncrypted = patient.currentPatient.isEncrypted;
  const modeKey = useMemo(()=>{
    if(selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT) return encryptKeyDoctor;
    else if(selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) return encryptKeyClinic;
    else return encryptKeySharePatient;
  },[selectPatientOnMode])


  useEffect(()=>{
    if(patient.currentPatient) getDiagnosis();
  },[patient.currentPatient.id])

  const onCancel = () => {
    setEditMode(false);
    updateState(previousData);
  }

  const updateState = (data) => {
    setDiagnose((isEncrypted && data.diagnose)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.diagnose).tag,JSON.parse(data.diagnose).encrypted):data.diagnose);
    setPrognosisAndNotes((isEncrypted && data.prognosisAndNotes)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.prognosisAndNotes).tag,JSON.parse(data.prognosisAndNotes).encrypted):data.prognosisAndNotes);
  }

  const getDiagnosis = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/diagnosis/${patient.currentPatient.id}?mode=${props.checkRoleMode}&idDoctor=${doctor.data?.id}`).then(result => {
        setPreviousData(result.data);
        updateState(result.data);
        result.roleOfDoctor && setRoleOfDoctor(result.roleOfDoctor)
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getDiagnosis());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const onUpdateRadiography = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      let infoUpdate = {};
      if(isEncrypted){
        infoUpdate = {
          idDoctor: doctor.data.id,
          diagnose: diagnose ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,diagnose)) : null,
          prognosisAndNotes: prognosisAndNotes ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,prognosisAndNotes)) : null
        }
      }else infoUpdate = {
        idDoctor: doctor.data.id,
        diagnose: diagnose,
        prognosisAndNotes: prognosisAndNotes
      }
      putToServerWithToken(`/v1/diagnosis/updateDiagnosisAndTreatment/${patient.currentPatient.id}`,infoUpdate).then(result => {
        updateState(result.data);
        setPreviousData(result.data);
        setEditMode(false);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onUpdateRadiography());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }
  
  const roleCheck = roleOfDoctor==='edit';

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
            roleCheck &&
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