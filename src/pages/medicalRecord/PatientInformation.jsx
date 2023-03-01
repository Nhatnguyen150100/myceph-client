import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import TextFieldInput from "../../common/TextFieldInput.jsx";
import { convertISOToVNDateString, FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE, SIZE_IMAGE_IN_RECORD, toISODateString, toTimeString, WIDTH_CHILD, WIDTH_HEAD } from "../../common/Utility.jsx";
import { setOtherEmailDoctor } from "../../redux/DoctorSlice.jsx";
import { setDoctorSettingTab, setLoadingModal, setSettingTab } from "../../redux/GeneralSlice.jsx";
import { setCurrentPatient } from "../../redux/PatientSlice.jsx";
import { getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

const WIDTH_TITLE = "100px";

export default function PatientInformation(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const [editMode,setEditMode] = useState(false);

  const nav = useNavigate();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [fullName,setFullName] = useState(patient.currentPatient.fullName);
  const [gender,setGender] = useState(patient.currentPatient.gender);
  const [birthday,setBirthday] = useState(patient.currentPatient.birthday);
  const [consulationDate,setConsulationDate] = useState(patient.currentPatient.consulationDate?patient.currentPatient.consulationDate:new Date());
  const [phoneNumber,setPhoneNumber] = useState(patient.currentPatient.phoneNumber);
  const [address,setAddress] = useState(patient.currentPatient.address);
  const [note,setNote] = useState(patient.currentPatient.note);
  const [chiefcomplaint,setChiefcomplaint] = useState(patient.currentPatient.chiefcomplaint);
  const [selectedPlan,setSelectedPlan] = useState(patient.selectedPlan);
  const [diagnosis,setDiagnosis] = useState(patient.diagnosis);
  const [updateByDoctor,setUpdateByDoctor] = useState(patient.currentPatient.updateByDoctor);
  const [emailUpdateDoctor,setEmailUpdateDoctor] = useState();
  const [nameUpdateDoctor,setNameUpdateDoctor] = useState();
  const [idPlan,setIdPlan] = useState();

  const onCancel = () => {
    setEditMode(false);
    updatePatientState(patient);
  }

  const onUpdateInformation = (e) => {
    if(diagnosis) updateDiagnosisAndTreatment();
    if(!idPlan && selectedPlan) createSelectedTreatmentPlan();
    else if(idPlan && selectedPlan) updateSelectedTreatmentPlan();
    return new Promise((resolve, reject) => {
      putToServerWithToken(`/v1/patient/updateInformationPatient/${patient.currentPatient.id}`,{
        fullName: fullName,
        gender: gender,
        birthday: birthday,
        consulationDate: consulationDate,
        phoneNumber: phoneNumber,
        address: address,
        chiefcomplaint: chiefcomplaint,
        note: note,
        updateByDoctor: doctor.id
      }).then(result => {
        setEditMode(false);
        getPatient().then(()=>{
          getSelectedTreatmentPlan();
          getDiagnosisAndTreatment();
          updatePatientState({currentPatient: result.data});
          resolve();
        });
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onUpdateInformation());
        }else{
          toast.error(err.message);
        }
        reject();
      })
    });
  }

  const getPatient = () => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/patient/getPatient/${patient.currentPatient.id}`).then(result => {
        dispatch(setCurrentPatient(result.data));
        resolve();
      }).catch((err) =>{
        if(!err.refreshToken){
          toast.error(err.message);
        }
        reject(err);
      });
    })
  }

  useEffect(()=>{
    // if(!patient.diagnosis){
    //   getDiagnosisAndTreatment().then(result => dispatch(setDiagnosis(result)));
    // }
    // if(!patient.selectedPlan){
    //   getSelectedTreatmentPlan().then(result => dispatch(setSelectedPlan(result)));
    // }
    if(patient.currentPatient) updatePatientState(patient);
  },[patient.currentPatient,patient.diagnosis,patient.selectedPlan])

  const updatePatientState = (data) => {
    setFullName(data.currentPatient.fullName);
    setGender(data.currentPatient.gender);
    setBirthday(data.currentPatient.birthday);
    setConsulationDate(data.currentPatient.consulationDate?data.currentPatient.consulationDate:new Date());
    setPhoneNumber(data.currentPatient.phoneNumber);
    setAddress(data.currentPatient.address);
    setNote(data.currentPatient.note);
    setChiefcomplaint(data.currentPatient.chiefcomplaint);
    setUpdateByDoctor(data.currentPatient.updateByDoctor);
    setDiagnosis(data.diagnosis);
    setSelectedPlan(data.selectedPlan);
  }
  
  useEffect(()=>{
    if(updateByDoctor) getInformationUpdateDoctor();
  },[updateByDoctor])

  const createSelectedTreatmentPlan = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      postToServerWithToken(`/v1/treatmentPlan/createPlan/${patient.currentPatient.id}`,{
        selectedPlan: selectedPlan
      }).then(result => {
        setSelectedPlan(result.data.selectedPlan);
        resolve();
      }).catch((err) =>{
        if(!err.refreshToken){
          toast.error(err.message);
        }
        reject(err);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const updateSelectedTreatmentPlan = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      putToServerWithToken(`/v1/treatmentPlan/getSelectedTreatmentPlan/${patient.currentPatient.id}?idPlan=${idPlan}`,{
        selectedPlan: selectedPlan,
        selected: true
      }).then(result => {
        resolve();
      }).catch((err) =>{
        if(!err.refreshToken){
          toast.error(err.message);
        }
        reject(err);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const updateDiagnosisAndTreatment = () => {
    return new Promise((resolve, reject) => {
      putToServerWithToken(`/v1/diagnosis/updateDiagnosisAndTreatment/${doctor.id}?idPatient=${patient.currentPatient.id}`,{
        diagnose: diagnosis
      }).then(result => {
        resolve();
      }).catch((err) =>{
        if(!err.refreshToken){
          toast.error(err.message);
        }
        reject(err);
      })
    })
  }

  const getSelectedTreatmentPlan = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/treatmentPlan/getSelectedTreatmentPlan/${patient.currentPatient.id}`).then(result => {
        setSelectedPlan(result.data.selectedPlan);
        setIdPlan(result.data.id);
        setUpdateByDoctor(result.updateByDoctor);
        resolve(result.data.selectedPlan);
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
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
      getToServerWithToken(`/v1/diagnosis/${patient.currentPatient.id}`).then(result => {
        setDiagnosis(result.data.diagnose);
        resolve(result.data.diagnose);
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
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
      getToServerWithToken(`/v1/doctor/${updateByDoctor}`).then(result => {
        setEmailUpdateDoctor(result.data.email);
        setNameUpdateDoctor(result.data.fullName);
        resolve();
      }).catch((err) => {
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getInformationUpdateDoctor());
        }else{
          toast.error(err.message);
        }
        reject(err.message);
      });
    });
  }

  const toOtherDoctorProfile = () => {
    nav('/setting');
    if(doctor.id !== updateByDoctor){
      dispatch(setSettingTab(0));
      dispatch(setOtherEmailDoctor(emailUpdateDoctor));
      dispatch(setDoctorSettingTab(1));
    }else{
      dispatch(setSettingTab(0));
      dispatch(setDoctorSettingTab(0));
    }
  }

  return <div className="h-100 w-100">
      <div className="d-flex justify-content-end align-items-center mt-2">
        {
          editMode ?
          <div>
            <IconButtonComponent className="btn-outline-success me-2" icon="done" onClick={onUpdateInformation} FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("save")}/>
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
    <div className="row">
      <div className="col-6 col-xs-12">
        <div className="d-flex flex-column justify-content-start align-items-center w-100">
          <div className="d-flex flex-row align-items-start justify-content-between w-100">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex flex-row align-items-center justify-content-center me-3">
                {
                  updateByDoctor && 
                  <React.Fragment>
                    <span className="fw-bold mc-color text-capitalize "></span>
                    <fieldset className='border rounded d-flex flex-column' style={{width:"300px"}}>
                      <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold flex-row d-flex align-items-center">
                        {t('update by')}: 
                        <button onClick={toOtherDoctorProfile} className="d-flex mx-1 flex-column border-0 btn-hover-bg px-2 rounded align-items-center justify-content-center" style={{textDecoration:"none",background:"none",color:"#40bab5"}}>
                          {
                            doctor.id === updateByDoctor ? <span className="fw-bold text-capitalize">{t('you')}</span>
                            :
                            <React.Fragment>
                              <span className="fw-bold" style={{fontSize:FONT_SIZE}}>{emailUpdateDoctor}</span>
                              <span className="text-capitalize" style={{fontSize:"13px"}}>{'('}{nameUpdateDoctor}{')'}</span>
                            </React.Fragment>
                          }
                        </button>
                      </legend>
                      <span className="text-capitalize text-center w-100 my-1 mc-color fst-italic" style={{fontSize:"13px"}}>{t('at')}{': '}{toISODateString(new Date(patient.currentPatient.updatedAt))}{' - '}{toTimeString(new Date(patient.currentPatient.updatedAt))}</span>
                    </fieldset>
                  </React.Fragment>
                }
              </div>
              <img alt="avatar" className={`rounded mt-5 p-3 hoverGreenLight ${!updateByDoctor && 'ms-5'}`} src={'/assets/images/11.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_IMAGE_IN_RECORD,objectFit:"cover"}}/>
            </div>
            <div className="d-flex flex-column mt-2" style={{width:"350px"}}>
              <div className='d-flex mb-3 pb-1 border-bottom'>
                <label className="mc-color fw-bold ms-2 text-capitalize" style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}>{t('full name')}:</label>
                {
                  editMode ? 
                  <input className="text-gray border-0 rounded btn-hover-bg flex-grow-1 px-2 py-1" onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={fullName} onChange={e=>setFullName(e.target.value)}/>
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
                  <input className="text-gray border-0 rounded btn-hover-bg flex-grow-1 px-2 py-1" type="date" onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape")  onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={toISODateString(new Date(birthday?birthday:new Date()))} onChange={e=>setBirthday(e.target.value)}/>
                  :
                  <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{convertISOToVNDateString(toISODateString(new Date(birthday?birthday:t('no data'))))}</span>
                }
              </div>
              <div className='d-flex mb-3 pb-1 border-bottom align-items-center'>
                <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}>{t('consultation date')}:</label>
                {
                  editMode ? 
                  <input className="text-gray border-0 rounded btn-hover-bg flex-grow-1 px-2 py-1" type="date" onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={toISODateString(new Date(consulationDate?consulationDate:new Date()))} onChange={e=>setConsulationDate(e.target.value)}/>
                  :
                  <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{convertISOToVNDateString(toISODateString(new Date(consulationDate?consulationDate:new Date())))}</span>
                }
              </div>
              <div className='d-flex mb-3 pb-1 border-bottom'>
                <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}>{t('phone number')}:</label>
                {
                  editMode ? 
                  <input className="text-gray border-0 rounded btn-hover-bg d-flex align-items-center flex-grow-1 px-2 py-1" placeholder={t('Enter patient phone number')} type="number" onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)}/>
                  :
                  <span className="text-capitalize text-gray flex-grow-1 d-flex align-items-center mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{phoneNumber?phoneNumber:'no data'}</span>
                }
              </div>
              <div className='d-flex mb-3 pb-1 border-bottom'>
                <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}>{t('address ')}:</label>
                {
                  editMode ? 
                  <textarea className="text-gray border-0 rounded btn-hover-bg flex-grow-1 px-2 py-1" placeholder={t('Enter patient address')} onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={address} onChange={e=>setAddress(e.target.value)}/>
                  :
                  <span className="text-capitalize text-gray d-flex align-items-start flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{address?address:'no data'}</span>
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
              <textarea className={`border-0 btn-hover-bg px-2 py-1 rounded w-100`} onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} style={{outline:'none',fontSize:FONT_SIZE,resize:"vertical"}} value={note} onChange={e=>setNote(e.target.value)} placeholder={t('Enter patient note')}/>
              :
              <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{note?note:'no data'}</span>
            }
          </fieldset>
        </div>
      </div>
      <div className="col-6 col-xs-12">
        <div className="d-flex flex-column justify-content-between align-items-center w-100 h-100">
          <div className="w-100">
            <fieldset className='w-100 border rounded mb-1 p-2 d-flex'>
              <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold">
                {t('chief complaint')}
              </legend>
              {
                editMode ? 
                <textarea className={`border-0 btn-hover-bg px-2 py-1 rounded w-100`} onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} style={{outline:'none',fontSize:FONT_SIZE,resize:"vertical"}} value={chiefcomplaint} onChange={e=>setChiefcomplaint(e.target.value)} placeholder={t('Enter patient note')}/>
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
                <textarea className={`border-0 btn-hover-bg px-2 py-1 rounded w-100 `} onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} style={{outline:'none',fontSize:FONT_SIZE,resize:"vertical"}} value={diagnosis} onChange={e=>setDiagnosis(e.target.value)} placeholder={t('Enter patient note')}/>
                :
                <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{diagnosis?diagnosis:'no data'}</span>
              }
            </fieldset>
          </div>
          <fieldset className='w-100 border rounded p-2 d-flex'>
            <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold">
              {t('selected treatment selectedPlan')}
            </legend>
            {
              editMode ? 
              <textarea className={`border-0 btn-hover-bg px-2 py-1 rounded w-100`} onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} style={{outline:'none',fontSize:FONT_SIZE,resize:"vertical"}} value={selectedPlan} onChange={e=>setSelectedPlan(e.target.value)} placeholder={t('Enter patient note')}/>
              :
              <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{selectedPlan?selectedPlan:'no data'}</span>
            }
          </fieldset>
        </div>
      </div>
    </div>
  </div>
}