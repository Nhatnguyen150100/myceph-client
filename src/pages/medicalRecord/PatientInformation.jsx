import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import TextFieldInput from "../../common/TextFieldInput.jsx";
import { convertISOToVNDateString, FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE, SIZE_IMAGE_IN_RECORD, toISODateString, WIDTH_CHILD, WIDTH_HEAD } from "../../common/Utility.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { getToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

const WIDTH_TITLE = "100px";

export default function PatientInformation(props){
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const [editMode,setEditMode] = useState(false);

  const nav = useNavigate();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [fullName,setFullName] = useState(currentPatient.fullName);
  const [gender,setGender] = useState(currentPatient.gender);
  const [birthday,setBirthday] = useState(currentPatient.birthday);
  const [consulationDate,setConsulationDate] = useState(currentPatient.consulationDate?currentPatient.consulationDate:new Date());
  const [phoneNumber,setPhoneNumber] = useState(currentPatient.phoneNumber);
  const [address,setAddress] = useState(currentPatient.address);
  const [note,setNote] = useState(currentPatient.note);
  const [chiefcomplaint,setChiefcomplaint] = useState(currentPatient.chiefComplaint);
  const [plan,setPlan] = useState('');
  const [diagnosis,setDiagnosis] = useState('');
  const [updateByDoctor,setUpdateByDoctor] = useState(currentPatient.updateByDoctor);
  const [emailUpdateDoctor,setEmailUpdateDoctor] = useState();
  const [nameUpdateDoctor,setNameUpdateDoctor] = useState();

  const onCancel = () => {
    setEditMode(false);
  }

  useEffect(()=>{
    if(doctor?.id){
      getSelectedTreatmentPlan();
      getDiagnosisAndTreatment();
    }
  },[])
  
  useEffect(()=>{

  },[updateByDoctor])

  const getSelectedTreatmentPlan = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/treatmentPlan/getSelectedTreatmentPlan/${currentPatient.id}`).then(result => {
        setPlan(result.data.plan);
        setUpdateByDoctor(result.updateByDoctor);
        resolve();
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getSelectedTreatmentPlan());
        }else{
          toast.error(err.message);
        }
        reject(err);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const getDiagnosisAndTreatment = () => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/diagnosis/${currentPatient.id}`).then(result => {
        setDiagnosis(result.data.diagnosis);
        resolve();
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getDiagnosisAndTreatment());
        }else{
          toast.error(err.message);
        }
        reject(err);
      })
    })
  }

  const getInformationUpdateDoctor = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/doctor/getInformationDoctor/${updateByDoctor}`).then(result => {
        setEmailUpdateDoctor(result.data.email);
        setNameUpdateDoctor(result.data.fullName);
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getInformationUpdateDoctor());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)))
    });
  }

  return <div className="h-100 w-100 mt-3">
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <span className="fw-bold mc-color text-capitalize">{t('update by')}: </span>
          <span className="fw-bold mc-pale-color">{}</span>
        </div>
        {
          editMode ?
          <div>
            <IconButtonComponent className="btn-outline-success me-2" icon="done" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("save")}/>
            <IconButtonComponent className="btn-outline-danger" onClick={onCancel} icon="close" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("cancel")}/>
          </div>
          :
          <div>
            {
              ((selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor === 'admin') || selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT || currentPatient['SharePatients.roleOfOwnerDoctor']==='edit') &&
              <IconButtonComponent className="btn-outline-warning" onClick={e=>setEditMode(true)} icon="edit" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("edit")}/>
            }
          </div>
        }
      </div>
    <div className="row">
      <div className="col-6 col-xs-12">
        <div className="d-flex flex-column justify-content-start align-items-center w-100">
          <div className="d-flex flex-row align-items-start justify-content-between w-100">
            <img alt="avatar" className="rounded mt-5 p-3 hoverGreenLight ms-5" src={'/assets/images/11.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_IMAGE_IN_RECORD,objectFit:"cover"}}/>
            <div className="d-flex flex-column mt-2" style={{width:"350px"}}>
              <div className='d-flex mb-3 pb-1 border-bottom'>
                <label className="mc-color fw-bold ms-2 text-capitalize" style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}>{t('full name')}:</label>
                {
                  editMode ? 
                  <input className="text-gray border-0 rounded btn-hover-bg flex-grow-1 px-2 py-1" onKeyDown={e=>{if(e.key === "Enter") ; if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={fullName} onChange={e=>setFullName(e.target.value)}/>
                  :
                  <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{fullName?fullName:'no data'}</span>
                }
              </div>
              <div className='d-flex mb-3 pb-1 border-bottom'>
                <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}>{t('gender')}:</label>
                {
                  editMode ? 
                  <select className="text-gray border-0 rounded btn-hover-bg px-1 py-1 text-capitalize flex-grow-1" style={{outline:"none"}} value={gender} onChange={e=>setGender(e.target.value)}>
                    {
                      !gender && <option selected disabled={true}>no data</option>
                    }
                    <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'male'} style={{fontSize:FONT_SIZE}}>
                      {t('male')}
                    </option>
                    <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'female'} style={{fontSize:FONT_SIZE}}>
                      {t('female')}
                    </option>
                  </select>
                  :
                  <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{gender?gender:'no data'}</span>
                }
              </div>
              <div className='d-flex mb-3 pb-1 border-bottom'>
                <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}>{t('date of birth')}:</label>
                {
                  editMode ? 
                  <input className="text-gray border-0 rounded btn-hover-bg flex-grow-1 px-2 py-1" type="date" onKeyDown={e=>{if(e.key === "Enter") ; if(e.key === "Escape")  onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={toISODateString(new Date(birthday?birthday:new Date()))} onChange={e=>setBirthday(e.target.value)}/>
                  :
                  <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{convertISOToVNDateString(toISODateString(new Date(birthday?birthday:t('no data'))))}</span>
                }
              </div>
              <div className='d-flex mb-3 pb-1 border-bottom align-items-center'>
                <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}>{t('consultation date')}:</label>
                {
                  editMode ? 
                  <input className="text-gray border-0 rounded btn-hover-bg flex-grow-1 px-2 py-1" type="date" onKeyDown={e=>{if(e.key === "Enter") ; if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={toISODateString(new Date(consulationDate?consulationDate:new Date()))} onChange={e=>setConsulationDate(e.target.value)}/>
                  :
                  <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{convertISOToVNDateString(toISODateString(new Date(consulationDate?consulationDate:new Date())))}</span>
                }
              </div>
              <div className='d-flex mb-3 pb-1 border-bottom'>
                <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}>{t('phone number')}:</label>
                {
                  editMode ? 
                  <input className="text-gray border-0 rounded btn-hover-bg flex-grow-1 px-2 py-1" placeholder={t('Enter patient phone number')} type="number" onKeyDown={e=>{if(e.key === "Enter") ; if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)}/>
                  :
                  <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{phoneNumber?phoneNumber:'no data'}</span>
                }
              </div>
              <div className='d-flex mb-3 pb-1 border-bottom'>
                <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}>{t('address ')}:</label>
                {
                  editMode ? 
                  <input className="text-gray border-0 rounded btn-hover-bg flex-grow-1 px-2 py-1" placeholder={t('Enter patient address')} onKeyDown={e=>{if(e.key === "Enter") ; if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={address} onChange={e=>setFullName(e.target.value)}/>
                  :
                  <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{address?address:'no data'}</span>
                }
              </div>
            </div>
          </div>
          <fieldset className='w-100 h-100 border rounded p-2 mt-5 d-flex'>
            <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold">
              {t('note')}
            </legend>
            {
              editMode ? 
              <textarea className={`border-0 btn-hover-bg px-2 py-1 rounded w-100 h-100`} onKeyDown={e=>{if(e.key === "Enter") ; if(e.key === "Escape") onCancel()}} style={{outline:'none',fontSize:FONT_SIZE}} value={note} onChange={e=>setNote(e.target.value)} placeholder={t('Enter patient note')}/>
              :
              <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{note?note:'no data'}</span>
            }
          </fieldset>
        </div>
      </div>
      <div className="col-6 col-xs-12">
        <div className="d-flex flex-column align-items-between w-100 h-100">
          <div className="h-100">
            <fieldset className='w-100 border rounded mb-1 p-2 d-flex'>
              <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold">
                {t('chief complaint')}
              </legend>
              {
                editMode ? 
                <textarea className={`border-0 btn-hover-bg px-2 py-1 rounded w-100 h-100`} onKeyDown={e=>{if(e.key === "Enter") ; if(e.key === "Escape") onCancel()}} style={{outline:'none',fontSize:FONT_SIZE}} value={chiefcomplaint} onChange={e=>setChiefcomplaint(e.target.value)} placeholder={t('Enter patient note')}/>
                :
                <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{chiefcomplaint?chiefcomplaint:'no data'}</span>
              }
            </fieldset>
            <fieldset className='w-100 border rounded mt-3 p-2 d-flex'>
              <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold">
                {t('diagnose')}
              </legend>
              {
                editMode ? 
                <textarea className={`border-0 btn-hover-bg px-2 py-1 rounded w-100 `} onKeyDown={e=>{if(e.key === "Enter") ; if(e.key === "Escape") onCancel()}} style={{outline:'none',fontSize:FONT_SIZE}} value={diagnosis} onChange={e=>setDiagnosis(e.target.value)} placeholder={t('Enter patient note')}/>
                :
                <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{diagnosis?diagnosis:'no data'}</span>
              }
            </fieldset>
          </div>
          <fieldset className='w-100 border rounded p-2 d-flex'>
            <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold">
              {t('selected treatment plan')}
            </legend>
            {
              editMode ? 
              <textarea className={`border-0 btn-hover-bg px-2 py-1 rounded w-100 h-100`} onKeyDown={e=>{if(e.key === "Enter") ; if(e.key === "Escape") onCancel()}} style={{outline:'none',fontSize:FONT_SIZE}} value={plan} onChange={e=>setPlan(e.target.value)} placeholder={t('Enter patient note')}/>
              :
              <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{plan?plan:'no data'}</span>
            }
          </fieldset>
        </div>
      </div>
    </div>
  </div>
}