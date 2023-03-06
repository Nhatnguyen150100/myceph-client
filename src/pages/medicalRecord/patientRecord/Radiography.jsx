import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import InputWithLabel from "../../../common/InputWithLabel.jsx";
import RadioWithLabel from "../../../common/RadioWithLabel.jsx";
import { FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE } from "../../../common/Utility.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

const WIDTH_TITLE = "160px";

export default function Radiography(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);

  const [editMode,setEditMode] = useState();
  const [sinuses,setSinuses] = useState();
  const [condyles,setCondyles] = useState();
  const [apparentPathology,setApparentPathology] = useState();
  const [alveolarBoneHeights,setAlveolarBoneHeights] = useState();
  const [crownRootRatio,setCrownRootRatio] = useState();
  const [others,setOthers] = useState();
  const [laterakCephalometricRadiography,setLaterakCephalometricRadiography] = useState();
  const [otherRadiography,setOtherRadiography] = useState();

  const [previousData,setPreviousData] = useState();

  useEffect(()=>{
    if(patient.currentPatient) getRadiography();
  },patient.currentPatient.id)

  const onCancel = () => {
    setEditMode(false);
    updateState(previousData);
  }

  const updateState = (data) => {
    setSinuses(data.sinuses);
    setCondyles(data.condyles);
    setApparentPathology(data.apparentPathology);
    setOthers(data.others);
    setAlveolarBoneHeights(data.alveolarBoneHeights);
    setCrownRootRatio(data.crownRootRatio);
    setLaterakCephalometricRadiography(data.laterakCephalometricRadiography);
    setOtherRadiography(data.otherRadiography);
  }

  const getRadiography = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/radiography/${patient.currentPatient.id}`).then(result => {
        setPreviousData(result.data);
        updateState(result.data);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getRadiography());
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
      putToServerWithToken(`/v1/radiography/updateRadiography/${patient.currentPatient.id}`,{
        idDoctor: doctor.data.id,
        sinuses: sinuses,
        condyles: condyles,
        apparentPathology: apparentPathology,
        others: others,
        alveolarBoneHeights: alveolarBoneHeights,
        crownRootRatio: crownRootRatio,
        laterakCephalometricRadiography: laterakCephalometricRadiography,
        otherRadiography: otherRadiography
      }).then(result => {
        updateState(result.data);
        setPreviousData(result.data);
        toast.success(result.message);
        setEditMode(false);
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
            style={{fontSize:FONT_SIZE,width:"80px"}}
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
            style={{fontSize:FONT_SIZE,width:"80px"}}
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
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
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
        <img alt="avatar" className="rounded my-3 p-2 hoverGreenLight" src={'/assets/images/4.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"120px",objectFit:"cover"}}/>
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
            value={laterakCephalometricRadiography}
            onChange={value=>setLaterakCephalometricRadiography(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={laterakCephalometricRadiography?laterakCephalometricRadiography:t('no data')}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex align-items-center justify-content-center">
        <img alt="avatar" className="rounded my-5 p-2 hoverGreenLight" src={'/assets/images/1.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"120px",objectFit:"cover"}}/>
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