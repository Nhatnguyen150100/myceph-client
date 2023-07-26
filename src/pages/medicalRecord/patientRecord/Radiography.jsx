import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deCryptData, encryptData } from "../../../common/Crypto.jsx";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import InputWithLabel from "../../../common/InputWithLabel.jsx";
import RadioWithLabel from "../../../common/RadioWithLabel.jsx";
import { FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE, splitAvatar } from "../../../common/Utility.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { setCurrentImage } from "../../../redux/LibraryImageSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

const WIDTH_TITLE = "160px";

export default function Radiography(props){
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
  const [sinuses,setSinuses] = useState();
  const [condyles,setCondyles] = useState();
  const [apparentPathology,setApparentPathology] = useState();
  const [alveolarBoneHeights,setAlveolarBoneHeights] = useState();
  const [crownRootRatio,setCrownRootRatio] = useState();
  const [others,setOthers] = useState();
  const [lateralCephalometricRadiography,setLateralCephalometricRadiography] = useState();
  const [otherRadiography,setOtherRadiography] = useState();
  const [lateralImage,setLateralImage] = useState();
  const [panoramaImage,setPanoramaImage] = useState();
  const [roleOfDoctor,setRoleOfDoctor] = useState('edit');

  const [previousData,setPreviousData] = useState();

  const isEncrypted = patient.currentPatient.isEncrypted;
  const modeKey = useMemo(()=>{
    if(selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT) return encryptKeyDoctor;
    else if(selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) return encryptKeyClinic;
    else return encryptKeySharePatient;
  },[selectPatientOnMode])

  useEffect(()=>{
    if(patient.currentPatient) getRadiography();
  },[patient.currentPatient.id])

  const onCancel = () => {
    setEditMode(false);
    updateState(previousData);
  }

  const updateState = (data) => {
    setSinuses((isEncrypted && data.sinuses)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.sinuses).tag,JSON.parse(data.sinuses).encrypted):data.sinuses);
    setCondyles((isEncrypted && data.condyles)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.condyles).tag,JSON.parse(data.condyles).encrypted):data.condyles);
    setApparentPathology((isEncrypted && data.apparentPathology)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.apparentPathology).tag,JSON.parse(data.apparentPathology).encrypted):data.apparentPathology);
    setOthers((isEncrypted && data.others)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.others).tag,JSON.parse(data.others).encrypted):data.others);
    setAlveolarBoneHeights((isEncrypted && data.alveolarBoneHeights)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.alveolarBoneHeights).tag,JSON.parse(data.alveolarBoneHeights).encrypted):data.alveolarBoneHeights);
    setCrownRootRatio((isEncrypted && data.crownRootRatio)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.crownRootRatio).tag,JSON.parse(data.crownRootRatio).encrypted):data.crownRootRatio);
    setLateralCephalometricRadiography((isEncrypted && data.lateralCephalometricRadiography)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.lateralCephalometricRadiography).tag,JSON.parse(data.lateralCephalometricRadiography).encrypted):data.lateralCephalometricRadiography);
    setOtherRadiography((isEncrypted && data.otherRadiography)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.otherRadiography).tag,JSON.parse(data.otherRadiography).encrypted):data.otherRadiography);
    setLateralImage(data.listImage.lateralImage);
    setPanoramaImage(data.listImage.panoramaImage);
  }

  const getRadiography = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/radiography/${patient.currentPatient.id}?mode=${props.checkRoleMode}&idDoctor=${doctor.data?.id}`).then(result => {
        setPreviousData(result.data);
        updateState(result.data);
        result.roleOfDoctor && setRoleOfDoctor(result.roleOfDoctor)
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getRadiography());
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
          sinuses: sinuses ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,sinuses)) : null,
          condyles: condyles ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,condyles)) : null,
          apparentPathology: apparentPathology ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,apparentPathology)) : null,
          others: others ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,others)) : null,
          alveolarBoneHeights: alveolarBoneHeights ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,alveolarBoneHeights)) : null,
          crownRootRatio: crownRootRatio ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,crownRootRatio)) : null,
          lateralCephalometricRadiography: lateralCephalometricRadiography ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,lateralCephalometricRadiography)) : null,
          otherRadiography: otherRadiography ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,otherRadiography)) : null
        }
      }else infoUpdate = {
        idDoctor: doctor.data.id,
        sinuses: sinuses,
        condyles: condyles,
        apparentPathology: apparentPathology,
        others: others,
        alveolarBoneHeights: alveolarBoneHeights,
        crownRootRatio: crownRootRatio,
        lateralCephalometricRadiography: lateralCephalometricRadiography,
        otherRadiography: otherRadiography
      }
      putToServerWithToken(`/v1/radiography/updateRadiography/${patient.currentPatient.id}`,infoUpdate).then(result => {
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
        {t('panorama')}
      </span>
    </div>
    <div className="row w-100">
      <div className="col-sm-9">
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Sinuses')}
            onUpdate={onUpdateRadiography}
            placeholder={t('Enter Sinuses')}
            classNameResult="flex-grow-1"
            type="text"
            value={sinuses}
            onChange={value=>setSinuses(value)} 
            style={{fontSize:FONT_SIZE,width:"130px"}}
            result={sinuses?sinuses:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Condyles')}
            onUpdate={onUpdateRadiography}
            placeholder={t('Enter Condyles')}
            classNameResult="flex-grow-1"
            type="text"
            value={condyles}
            onChange={value=>setCondyles(value)} 
            style={{fontSize:FONT_SIZE,width:"130px"}}
            result={condyles?condyles:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Apparent Pathology')}
            onUpdate={onUpdateRadiography}
            placeholder={t('Enter Apparent Pathology')}
            classNameResult="flex-grow-1"
            type="text"
            value={apparentPathology}
            onChange={value=>setApparentPathology(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={apparentPathology?apparentPathology:t('no data')}
          />
        </div>
        
      <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Alveolar Bone Heights')}
            onUpdate={onUpdateRadiography}
            placeholder={t('Enter Alveolar Bone Heights')}
            classNameResult="flex-grow-1"
            type="text"
            value={alveolarBoneHeights}
            onChange={value=>setAlveolarBoneHeights(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={alveolarBoneHeights?alveolarBoneHeights:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Crown/Root Ratio')}
            onUpdate={onUpdateRadiography}
            placeholder={t('Enter Crown/Root Ratio')}
            classNameResult="flex-grow-1"
            type="text"
            value={crownRootRatio}
            onChange={value=>setCrownRootRatio(value)} 
            style={{fontSize:FONT_SIZE,width:"150px"}}
            result={crownRootRatio?crownRootRatio:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Others')}
            onUpdate={onUpdateRadiography}
            placeholder={t('Enter Others')}
            classNameResult="flex-grow-1"
            type="text"
            value={others}
            onChange={value=>setOthers(value)} 
            style={{fontSize:FONT_SIZE,width:"80px"}}
            result={others?others:t('no data')}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex align-items-center justify-content-center">
        <img 
          alt="panoramaImage" 
          className={`rounded mt-5 ${panoramaImage?'p-0 transform-hover':'p-3'}`} 
          src={`${panoramaImage?splitAvatar(panoramaImage):'/assets/images/3.png'}`} 
          style={{borderStyle:`${panoramaImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"130px",objectFit:"contain",cursor:`${panoramaImage?"pointer":"default"}`}}
          onClick={()=>{ 
            if(panoramaImage) dispatch(setCurrentImage(splitAvatar(panoramaImage)))
          }}
          title={panoramaImage?t('Click to see'):''}
        />
      </div>
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('lateral cephalometric radiography')}
      </span>
    </div>
    <div className="row w-100">
      <div className="col-sm-9 d-flex align-items-center">
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateRadiography}
            placeholder={t('Enter Lateral Cephalometric Radiography')}
            classNameResult="flex-grow-1"
            type="text"
            value={lateralCephalometricRadiography}
            onChange={value=>setLateralCephalometricRadiography(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={lateralCephalometricRadiography?lateralCephalometricRadiography:t('no data')}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex align-items-center justify-content-center">
        <img 
          alt="lateralImage" 
          className={`rounded mt-5 ${lateralImage?'p-0 transform-hover':'p-3'}`} 
          src={`${lateralImage?splitAvatar(lateralImage):'/assets/images/1.png'}`} 
          style={{borderStyle:`${lateralImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"130px",objectFit:"contain",cursor:`${lateralImage?"pointer":"default"}`}}
          onClick={()=>{ 
            if(lateralImage) dispatch(setCurrentImage(splitAvatar(lateralImage)))
          }}
          title={lateralImage?t('Click to see'):''}
        />
      </div>
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('other radiography')}
      </span>
    </div>
    <div className="w-100 h-auto mt-1 mb-3">
      <InputWithLabel 
        editMode={editMode}
        onCancel={onCancel}
        onUpdate={onUpdateRadiography}
        placeholder={t('Enter other radiography')}
        classNameResult="flex-grow-1"
        type="text"
        value={otherRadiography}
        onChange={value=>setOtherRadiography(value)} 
        style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
        result={otherRadiography?otherRadiography:t('no data')}
      />
    </div>
  </div>
}