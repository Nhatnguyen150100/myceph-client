import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deCryptData, encryptData } from "../../common/Crypto.jsx";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import InputWithLabel from "../../common/InputWithLabel.jsx";
import SelectWithLabel from "../../common/SelectWithLabel.jsx";
import { convertISOToVNDateString, FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE, SIZE_IMAGE_IN_RECORD, splitAvatar, toISODateString, toTimeString } from "../../common/Utility.jsx";
import { setOtherEmailDoctor } from "../../redux/DoctorSlice.jsx";
import { setDoctorSettingTab, setLoadingModal, setSettingTab } from "../../redux/GeneralSlice.jsx";
import { setCurrentImage } from "../../redux/LibraryImageSlice.jsx";
import { setCurrentPatient } from "../../redux/PatientSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

const WIDTH_TITLE = "100px";

export default function PatientInformation(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const doctor = useSelector(state=>state.doctor.data);
  const patient = useSelector(state=>state.patient);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);
  const encryptKeySharePatient = useSelector(state=>state.patient.encryptKeySharePatient);
  const [editMode,setEditMode] = useState(false);

  const nav = useNavigate();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [fullName,setFullName] = useState();
  const [gender,setGender] = useState();
  const [birthday,setBirthday] = useState();
  const [consulationDate,setConsulationDate] = useState();
  const [phoneNumber,setPhoneNumber] = useState();
  const [address,setAddress] = useState();
  const [note,setNote] = useState();
  const [chiefcomplaint,setChiefcomplaint] = useState();
  const [selectedPlan,setSelectedPlan] = useState();
  const [diagnose,setDiagnose] = useState();
  const [updateByDoctor,setUpdateByDoctor] = useState(patient.currentPatient.updateByDoctor);
  const [emailUpdateDoctor,setEmailUpdateDoctor] = useState();
  const [nameUpdateDoctor,setNameUpdateDoctor] = useState();
  const [updatedAt,setUpdatedAt] = useState();
  const [sideFaceImage,setSideFaceImage] = useState();
  const [roleOfDoctor,setRoleOfDoctor] = useState('edit');
  const isEncrypted = patient.currentPatient.isEncrypted;
  const modeKey = useMemo(()=>{
    if(selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT) return encryptKeyDoctor;
    else if(selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) return encryptKeyClinic;
    else return encryptKeySharePatient;
  },[selectPatientOnMode])

  const [previousData,setPreviousData] = useState();

  const onCancel = () => {
    setEditMode(false);
    updatePatientState(previousData);
  }

  const onUpdateInformation = (e) => {
    setEditMode(false);
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      let infoUpdate = {};
      if(isEncrypted){
        infoUpdate = {
          fullName: fullName,
          gender: gender ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,gender)) : null,
          birthday: birthday,
          consulationDate: consulationDate,
          phoneNumber: phoneNumber ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,phoneNumber)) : phoneNumber,
          address: address ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,address)) : address,
          chiefcomplaint: chiefcomplaint ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,chiefcomplaint)) : chiefcomplaint,
          note: note ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,note)) : note,
          updateByDoctor: doctor.id,
          diagnose: diagnose ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,diagnose)) : diagnose,
          selectedPlan: selectedPlan ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,selectedPlan)) : selectedPlan,
        }
      }else infoUpdate = {
        fullName: fullName,
        gender: gender,
        birthday: birthday,
        consulationDate: consulationDate,
        phoneNumber: phoneNumber,
        address: address,
        chiefcomplaint: chiefcomplaint,
        note: note,
        updateByDoctor: doctor.id,
        diagnose: diagnose,
        selectedPlan: selectedPlan,
      }
      putToServerWithToken(`/v1/patient/updateInformationPatient/${patient.currentPatient.id}?mode=${props.checkRoleMode}&idDoctor=${doctor?.id}`,infoUpdate).then(result => {
        setPreviousData(result.data);
        updatePatientState(result.data);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onUpdateInformation());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const getPatient = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/patient/getPatient/${patient.currentPatient.id}?updateBydoctor=${updateByDoctor?updateByDoctor:doctor.id}&mode=${props.checkRoleMode}&idDoctor=${doctor?.id}`).then(result => {
        updatePatientState(result.data);
        setPreviousData(result.data);
        result.roleOfDoctor && setRoleOfDoctor(result.roleOfDoctor)
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getPatient());
        }else{
          toast.error(t(err.message));
        }
        reject(err);
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }
  

  useEffect(()=>{
    if(patient.currentPatient.id) getPatient();
  },[patient.currentPatient.id])

  const updatePatientState = (data) => {
    if(patient.currentPatient.fullName !== data.fullName){
      const patientObject = {...patient.currentPatient};
      delete patientObject.fullName;
      dispatch(setCurrentPatient({...patientObject,fullName:data.fullName}));
    }
    if(patient.currentPatient.gender !== data.gender){
      const patientObject = {...patient.currentPatient};
      delete patientObject.gender;
      dispatch(setCurrentPatient({...patientObject,gender:data.gender}));
    }
    if(new Date(patient.currentPatient.birthday).getTime() !== new Date(data.birthday).getTime()){
      const patientObject = {...patient.currentPatient};
      delete patientObject.birthday;
      dispatch(setCurrentPatient({...patientObject,birthday:data.birthday}));
    }
    setFullName(data.fullName);
    setGender((isEncrypted && data.gender)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.gender).tag,JSON.parse(data.gender).encrypted):data.gender);
    setBirthday(data.birthday);
    setConsulationDate(data.consulationDate?data.consulationDate:new Date());
    setPhoneNumber((isEncrypted && data.phoneNumber)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.phoneNumber).tag,JSON.parse(data.phoneNumber).encrypted):data.phoneNumber);
    setAddress((isEncrypted && data.address)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.address).tag,JSON.parse(data.address).encrypted):data.address);
    setNote((isEncrypted && data.note)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.note).tag,JSON.parse(data.note).encrypted):data.note);
    setChiefcomplaint((isEncrypted && data.chiefcomplaint)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.chiefcomplaint).tag,JSON.parse(data.chiefcomplaint).encrypted):data.chiefcomplaint);
    setUpdateByDoctor(data.updateByDoctor);
    setDiagnose((isEncrypted && data.diagnose)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.diagnose).tag,JSON.parse(data.diagnose).encrypted):data.diagnose);
    setSelectedPlan((isEncrypted && data.plan)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.plan).tag,JSON.parse(data.plan).encrypted):data.plan);
    setEmailUpdateDoctor(data.email);
    setNameUpdateDoctor(data.fullNameDoctor);
    setUpdatedAt(data.updatedAt);
    setSideFaceImage(data.sideFaceImage?.linkImage);
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

  const roleCheck = roleOfDoctor==='edit';

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
            roleCheck && <IconButtonComponent className="btn-outline-warning" onClick={e=>setEditMode(true)} icon="edit" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("edit")}/>
          }
        </div>
      }
    </div>
    <div className="row">
      <div className="col-sm-6">
        <div className="d-flex flex-column justify-content-start align-items-center w-100">
          <div className="row w-100">
            <div className="col-sm-5">
              <div className="d-flex flex-row align-items-center justify-content-center me-3">
                {
                  updateByDoctor && 
                  <React.Fragment>
                    <span className="fw-bold mc-color text-capitalize "></span>
                    <fieldset className='border rounded d-flex flex-column' style={{width:"300px"}}>
                      <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 mc-color fw-bold flex-row d-flex align-items-center">
                        {t('Update by')}: 
                        <button onClick={toOtherDoctorProfile} className="d-flex mx-1 flex-column border-0 btn-hover-bg px-2 rounded align-items-center justify-content-center" style={{textDecoration:"none",background:"none",color:"#40bab5"}}>
                          {
                            doctor.id === updateByDoctor ? <span className="fw-bold text-capitalize">{t('you')}</span>
                            :
                            <React.Fragment>
                              <span className="fw-bold" style={{fontSize:FONT_SIZE}}>{nameUpdateDoctor}</span>
                              {
                                emailUpdateDoctor ? <span className="text-capitalize" style={{fontSize:"13px"}}>{'('}{emailUpdateDoctor}{')'}</span> : ''
                              }
                            </React.Fragment>
                          }
                        </button>
                      </legend>
                      {
                        updatedAt && <span className="text-capitalize text-center w-100 my-1 mc-color fst-italic" style={{fontSize:"13px"}}>{t('at')}{': '}{convertISOToVNDateString(toISODateString(new Date(updatedAt)))}{' | '}{toTimeString(new Date(updatedAt))}</span>
                      }
                    </fieldset>
                  </React.Fragment>
                }
              </div>
              <div 
                className="d-flex flex-grow-1 align-items-center justify-content-center" 
              >
                <img 
                  loading="lazy"
                  alt="sideFaceImage" 
                  className={`rounded mt-5 ${sideFaceImage?'p-0 transform-hover':'p-3'} ${!updateByDoctor && 'ms-5'}`} 
                  src={`${sideFaceImage?splitAvatar(sideFaceImage):'/assets/images/5.png'}`} 
                  style={{borderStyle:`${sideFaceImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:SIZE_IMAGE_IN_RECORD,objectFit:"cover",cursor:`${sideFaceImage?"pointer":"default"}`}}
                  onClick={()=>{ 
                    if(sideFaceImage) dispatch(setCurrentImage(splitAvatar(sideFaceImage)))
                  }}
                  title={sideFaceImage?t('Click to see'):''}
                />
              </div>
            </div>
            <div className="col-sm-7" style={{marginTop:"10px"}}>
              <InputWithLabel 
                classNameResult="flex-grow-1"
                editMode={editMode}
                onCancel={onCancel}
                label={t('full name')}
                onUpdate={onUpdateInformation} 
                type="text"
                placeholder={t('Enter full name')}
                value={fullName} 
                onChange={value=>setFullName(value)} 
                style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
                result={fullName?fullName:t('no data')}
              />
              <SelectWithLabel
                editMode={editMode}
                onCancel={onCancel}
                label={t('gender')}
                onUpdate={onUpdateInformation}
                value={gender}
                onChange={value=>setGender(value)} 
                style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
                result={gender?gender:t('no data')}
              >
                <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'male'} style={{fontSize:FONT_SIZE}}>
                  {t('male')}
                </option>
                <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'female'} style={{fontSize:FONT_SIZE}}>
                  {t('female')}
                </option>
              </SelectWithLabel>
              <InputWithLabel 
                classNameResult="flex-grow-1"
                editMode={editMode}
                onCancel={onCancel}
                label={t('date of birth')}
                onUpdate={onUpdateInformation} 
                type="date"
                value={toISODateString(new Date(birthday?birthday:new Date()))} 
                onChange={value=>setBirthday(value)} 
                style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
                result={birthday?convertISOToVNDateString(toISODateString(new Date(birthday))):t('no data')}
              />
              <InputWithLabel 
                classNameResult="flex-grow-1"
                editMode={editMode}
                onCancel={onCancel}
                label={t('consultation date')}
                onUpdate={onUpdateInformation} 
                type="date"
                value={toISODateString(new Date(consulationDate?consulationDate:new Date()))}
                onChange={value=>setConsulationDate(value)} 
                style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
                result={convertISOToVNDateString(toISODateString(new Date(consulationDate?consulationDate:new Date())))}
              />
              <InputWithLabel 
                classNameResult="flex-grow-1"
                editMode={editMode}
                onCancel={onCancel}
                label={t('phone number')}
                placeholder={t('Enter phone number')}
                onUpdate={onUpdateInformation} 
                type="number"
                value={phoneNumber}
                onChange={value=>setPhoneNumber(value)} 
                style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
                result={phoneNumber?phoneNumber:t('no data')}
              />
              <InputWithLabel
                classNameResult="flex-grow-1" 
                editMode={editMode}
                onCancel={onCancel}
                label={t('address')}
                placeholder={t('Enter address')}
                onUpdate={onUpdateInformation} 
                type="text"
                value={address}
                onChange={value=>setAddress(value)} 
                style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
                result={address?address:t('no data')}
              />
            </div>
          </div>
          <fieldset className='w-100 h-100 border rounded p-2 mt-5 d-flex'>
            <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold">
              {t('note')}
            </legend>
            {
              editMode ? 
              <textarea 
                className={`border-0 btn-hover-bg px-2 py-1 rounded w-100`} 
                onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} 
                style={{outline:'none',fontSize:FONT_SIZE,resize:"vertical"}} 
                value={note} 
                onChange={e=>setNote(e.target.value)} 
                placeholder={t('Enter patient note')}
              />
              :
              <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{note?note:t('no data')}</span>
            }
          </fieldset>
        </div>
      </div>
      <div className="col-sm-6">
        <div className="d-flex flex-column justify-content-between align-items-center w-100 h-100">
          <div className="w-100">
            <fieldset className='w-100 border rounded mb-1 p-2 d-flex'>
              <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold">
                {t('chief complaint')}
              </legend>
              {
                editMode ? 
                <textarea 
                  className={`border-0 btn-hover-bg px-2 py-1 rounded w-100`} 
                  onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} 
                  style={{outline:'none',fontSize:FONT_SIZE,resize:"vertical"}} 
                  value={chiefcomplaint} 
                  onChange={e=>setChiefcomplaint(e.target.value)} 
                  placeholder={t('Enter patient chief complaint')}
                />
                :
                <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{chiefcomplaint?chiefcomplaint:t('no data')}</span>
              }
            </fieldset>
            <fieldset className='w-100 border rounded mt-3 p-2 d-flex'>
              <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold">
                {t('diagnose')}
              </legend>
              {
                editMode ? 
                <textarea 
                  className={`border-0 btn-hover-bg px-2 py-1 rounded w-100 `} 
                  onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} 
                  style={{outline:'none',fontSize:FONT_SIZE,resize:"vertical"}} 
                  value={diagnose} onChange={e=>setDiagnose(e.target.value)} 
                  placeholder={t('Enter patient diagnose')}
                />
                :
                <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{diagnose?diagnose:t('no data')}</span>
              }
            </fieldset>
          </div>
          <fieldset className='w-100 border rounded p-2 d-flex'>
            <legend style={{ fontSize: '1rem'}} className="w-auto mb-0 ms-2 float-none px-2 text-capitalize mc-color fw-bold">
              {t('selected treatment plan')}
            </legend>
            {
              editMode ? 
              <textarea 
                className={`border-0 btn-hover-bg px-2 py-1 rounded w-100`} 
                onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} 
                style={{outline:'none',fontSize:FONT_SIZE,resize:"vertical"}} 
                value={selectedPlan} onChange={e=>setSelectedPlan(e.target.value)} 
                placeholder={t('Enter patient selected plan')}
              />
              :
              <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{selectedPlan?selectedPlan:t('no data')}</span>
            }
          </fieldset>
        </div>
      </div>
    </div>
  </div>
}