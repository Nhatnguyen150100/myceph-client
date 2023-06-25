import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deCryptData, encryptData } from "../../../common/Crypto.jsx";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import InputWithLabel from "../../../common/InputWithLabel.jsx";
import RadioWithLabel from "../../../common/RadioWithLabel.jsx";
import SelectWithLabel from "../../../common/SelectWithLabel.jsx";
import { FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE } from "../../../common/Utility.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

const WIDTH_TITLE = "140px";

export default function History(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const language = useSelector(state=>state.general.language);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);
  const encryptKeySharePatient = useSelector(state=>state.patient.encryptKeySharePatient);
  
  const [dentalHistory,setDetailHostory] = useState();
  const [medicalHistory,setMedicalHistory] = useState();
  const [cvmi,setCvmi] = useState();
  const [otherMethod,setOtherMethod] = useState();
  const [respiration,setRespiration] = useState();
  const [habits,setHabits] = useState();
  const [familyHistory,setFamilyHistory] = useState();
  const [compliance,setCompliance] = useState();
  const [editMode,setEditMode] = useState(false);
  const [previousData,setPreviousData] = useState();
  const [roleOfDoctor,setRoleOfDoctor] = useState('edit');
  const isEncrypted = patient.currentPatient.isEncrypted;
  const modeKey = useMemo(()=>{
    if(selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT) return encryptKeyDoctor;
    else if(selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) return encryptKeyClinic;
    else return encryptKeySharePatient;
  },[selectPatientOnMode])

  const onCancel = () => {
    setEditMode(false);
    updateState(previousData);
  }

  useEffect(()=>{
    if(patient.currentPatient) getHistory();
  },[patient.currentPatient.id])

  const updateState = (data) => {
    setDetailHostory((isEncrypted && data.dentalHistory)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.dentalHistory).tag,JSON.parse(data.dentalHistory).encrypted):data.dentalHistory);
    setMedicalHistory((isEncrypted && data.medicalHistory)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.medicalHistory).tag,JSON.parse(data.medicalHistory).encrypted):data.medicalHistory);
    setCvmi((isEncrypted && data.cvmi)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.cvmi).tag,JSON.parse(data.cvmi).encrypted):data.cvmi);
    setOtherMethod((isEncrypted && data.otherMethodToEvaluate)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.otherMethodToEvaluate).tag,JSON.parse(data.otherMethodToEvaluate).encrypted):data.otherMethodToEvaluate);
    setRespiration((isEncrypted && data.respiration)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.respiration).tag,JSON.parse(data.respiration).encrypted):data.respiration);
    setHabits((isEncrypted && data.habits)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.habits).tag,JSON.parse(data.habits).encrypted):data.habits);
    setFamilyHistory((isEncrypted && data.familyHistory)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.familyHistory).tag,JSON.parse(data.familyHistory).encrypted):data.familyHistory);
    setCompliance((isEncrypted && data.compliance)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.compliance).tag,JSON.parse(data.compliance).encrypted):data.compliance);
  }

  const onUpdateHistory = () => {
    dispatch(setLoadingModal(true));
    setEditMode(false);
    return new Promise((resolve, reject) => {
      let infoUpdate = {};
      if(isEncrypted){
        infoUpdate = {
          dentalHistory: dentalHistory ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,dentalHistory)) : null,
          medicalHistory: medicalHistory ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,medicalHistory)) : null,
          cvmi: cvmi ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,cvmi)) : null,
          otherMethodToEvaluate: otherMethod ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,otherMethod)) : null,
          respiration: respiration ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,respiration)) : null,
          habits: habits ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,habits)) : null,
          familyHistory: familyHistory ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,familyHistory)) : null,
          compliance: compliance ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,compliance)) : null,
          idDoctor: doctor.data.id
        }
      }else infoUpdate = {
        dentalHistory: dentalHistory,
        medicalHistory: medicalHistory,
        cvmi: cvmi,
        otherMethodToEvaluate: otherMethod,
        respiration: respiration,
        habits: habits,
        familyHistory: familyHistory,
        compliance: compliance,
        idDoctor: doctor.data.id
      }
      putToServerWithToken(`/v1/history/updateHistory/${patient.currentPatient.id}`,infoUpdate).then(result => {
        updateState(result.data);
        setPreviousData(result.data);
        toast.success(result.message);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onUpdateHistory());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const getHistory = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/history/${patient.currentPatient.id}?mode=${props.checkRoleMode}&idDoctor=${doctor.data?.id}`).then(result=>{
        updateState(result.data);
        setPreviousData(result.data);
        result.roleOfDoctor && setRoleOfDoctor(result.roleOfDoctor)
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getHistory());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const roleCheck = roleOfDoctor==='edit';

  return <div className="h-100 w-100 d-flex flex-column justify-content-start mt-2">
    <div className="d-flex justify-content-end align-items-center mt-1 mb-3">
      {
        editMode ?
        <div>
          <IconButtonComponent className="btn-outline-success me-2" icon="done" onClick={onUpdateHistory} FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("save")}/>
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
    <div className="w-100 h-auto">
      <InputWithLabel 
        classNameResult="flex-grow-1"
        editMode={editMode}
        onCancel={onCancel}
        label={t('Dental History')}
        onUpdate={onUpdateHistory}
        placeholder={t('Enter Dental History')}
        type="text"
        value={dentalHistory}
        onChange={value=>setDetailHostory(value)} 
        style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
        result={dentalHistory?dentalHistory:t('no data')}
      />
    </div>
    <div className="w-100 h-auto mt-1">
      <InputWithLabel 
        classNameResult="flex-grow-1"
        editMode={editMode}
        onCancel={onCancel}
        label={t('Medical History')}
        onUpdate={onUpdateHistory}
        placeholder={t('Enter Medical History')}
        type="text"
        value={medicalHistory}
        onChange={value=>setMedicalHistory(value)} 
        style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
        result={medicalHistory?medicalHistory:t('no data')}
      />
    </div>
    <div className="w-100 h-auto mt-1">
      <SelectWithLabel
        editMode={editMode}
        onCancel={onCancel}
        label={t('Cervical Vertebral Maturation Index (CVMI)')}
        value={cvmi} 
        onChange={value=>setCvmi(value)} 
        style={{fontSize:FONT_SIZE,width:"330px"}}
        result={cvmi?cvmi:'no data'}
      >
        <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'CS1'} style={{fontSize:FONT_SIZE}}>
          {'CS1'}
        </option>
        <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'CS2'} style={{fontSize:FONT_SIZE}}>
          {'CS2'}
        </option>
        <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'CS3'} style={{fontSize:FONT_SIZE}}>
          {'CS3'}
        </option>
        <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'CS4'} style={{fontSize:FONT_SIZE}}>
          {'CS4'}
        </option>
        <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'CS5'} style={{fontSize:FONT_SIZE}}>
          {'CS5'}
        </option>
        <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'CS6'} style={{fontSize:FONT_SIZE}}>
          {'CS6'}
        </option>
      </SelectWithLabel>
    </div>
    <div className="w-100 h-auto mt-1">
      <InputWithLabel 
        classNameResult="flex-grow-1"
        editMode={editMode}
        onCancel={onCancel}
        label={t('Other Method To Evaluate Skeletal Maturity')}
        onUpdate={onUpdateHistory}
        placeholder={t('Enter Other Method To Evaluate Skeletal Maturity')}
        type="text"
        value={otherMethod}
        onChange={value=>setOtherMethod(value)} 
        style={{fontSize:FONT_SIZE,width:`${language==='en'?'330px':'360px'}`}}
        result={otherMethod?otherMethod:t('no data')}
      />
    </div>
    <div className="w-100 h-auto mt-1">
      <InputWithLabel
        classNameResult="flex-grow-1" 
        editMode={editMode}
        onCancel={onCancel}
        label={t('Respiration')}
        onUpdate={onUpdateHistory}
        placeholder={t('Enter Respiration')}
        type="text"
        value={respiration}
        onChange={value=>setRespiration(value)} 
        style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
        result={respiration?respiration:t('no data')}
      />
    </div>
    <div className="w-100 h-auto mt-1">
      <InputWithLabel
        classNameResult="flex-grow-1" 
        editMode={editMode}
        onCancel={onCancel}
        label={t('Habits')}
        onUpdate={onUpdateHistory}
        placeholder={t('Enter Habits')}
        type="text"
        value={habits}
        onChange={value=>setHabits(value)} 
        style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
        result={habits?habits:t('no data')}
      />
    </div>
    <div className="w-100 h-auto mt-1">
      <InputWithLabel 
        classNameResult="flex-grow-1"
        editMode={editMode}
        onCancel={onCancel}
        label={t('Family History')}
        onUpdate={onUpdateHistory}
        placeholder={t('Enter Family History')}
        type="text"
        value={familyHistory}
        onChange={value=>setFamilyHistory(value)} 
        style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
        result={familyHistory?familyHistory:t('no data')}
      />
    </div>
    <div className="w-100 h-auto mt-1">
      <RadioWithLabel 
        editMode={editMode}
        onCancel={onCancel}
        label={t('Compliance')}
        value={compliance}
        onChange={value=>setCompliance(value)} 
        style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
        result={compliance?compliance:t('no data')}
        arrayRadios={['Good','Average','Poor']}
      />
    </div>
  </div>
}