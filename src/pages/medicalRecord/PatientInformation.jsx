import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import InputWithLabel from "../../common/InputWithLabel.jsx";
import SelectWithLabel from "../../common/SelectWithLabel.jsx";
import { convertISOToVNDateString, FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE, SIZE_IMAGE_IN_RECORD, toISODateString, toTimeString } from "../../common/Utility.jsx";
import { setOtherEmailDoctor } from "../../redux/DoctorSlice.jsx";
import { setDoctorSettingTab, setLoadingModal, setSettingTab } from "../../redux/GeneralSlice.jsx";
import { setCurrentPatient } from "../../redux/PatientSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../services/getAPI.jsx";
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

  const [previousData,setPreviousData] = useState();

  const onCancel = () => {
    setEditMode(false);
    updatePatientState(previousData);
  }

  const onUpdateInformation = (e) => {
    setEditMode(false);
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      putToServerWithToken(`/v1/patient/updateInformationPatient/${patient.currentPatient.id}?`,{
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
      }).then(result => {
        setPreviousData(result.data);
        updatePatientState(result.data);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onUpdateInformation());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const getPatient = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/patient/getPatient/${patient.currentPatient.id}?updateBydoctor=${updateByDoctor}`).then(result => {
        updatePatientState(result.data);
        setPreviousData(result.data);
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getPatient());
        }else{
          toast.error(err.message);
        }
        reject(err);
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  useEffect(()=>{
    if(patient.currentPatient.id) getPatient();
  },[patient.currentPatient.id])

  const updatePatientState = (data) => {
    setFullName(data.fullName);
    setGender(data.gender);
    setBirthday(data.birthday);
    setConsulationDate(data.consulationDate?data.consulationDate:new Date());
    setPhoneNumber(data.phoneNumber);
    setAddress(data.address);
    setNote(data.note);
    setChiefcomplaint(data.chiefcomplaint);
    setUpdateByDoctor(data.updateByDoctor);
    setDiagnose(data.diagnose);
    setSelectedPlan(data.plan);
    setEmailUpdateDoctor(data.email);
    setNameUpdateDoctor(data.fullNameDoctor);
    setUpdatedAt(data.updatedAt);
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
                      {
                        updatedAt && <span className="text-capitalize text-center w-100 my-1 mc-color fst-italic" style={{fontSize:"13px"}}>{t('at')}{': '}{toISODateString(new Date(updatedAt))}{' - '}{toTimeString(new Date(updatedAt))}</span>
                      }
                    </fieldset>
                  </React.Fragment>
                }
              </div>
              <div className="d-flex flex-grow-1 align-items-center justify-content-center">
                <img alt="avatar" className={`rounded mt-5 p-3 hoverGreenLight ${!updateByDoctor && 'ms-5'}`} src={'/assets/images/11.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_IMAGE_IN_RECORD,objectFit:"cover"}}/>
              </div>
            </div>
            <div className="col-sm-7" style={{marginTop:"10px"}}>
              <InputWithLabel 
                editMode={editMode}
                onCancel={onCancel}
                label={t('full name')}
                onUpdate={onUpdateInformation} 
                type="text"
                placeholder={t('Enter full name')}
                value={fullName} 
                onChange={value=>setFullName(value)} 
                style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
                result={fullName?fullName:'no data'}
              />
              <SelectWithLabel
                editMode={editMode}
                onCancel={onCancel}
                label={t('gender')}
                onUpdate={onUpdateInformation}
                value={gender} 
                onChange={value=>setGender(value)} 
                style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
                result={gender?gender:'no data'}
              >
                <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'male'} style={{fontSize:FONT_SIZE}}>
                  {t('male')}
                </option>
                <option className="text-gray border-0 rounded btn-hover-bg text-capitalize" value={'female'} style={{fontSize:FONT_SIZE}}>
                  {t('female')}
                </option>
              </SelectWithLabel>
              <InputWithLabel 
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
                editMode={editMode}
                onCancel={onCancel}
                label={t('phone number')}
                placeholder={t('Enter phone number')}
                onUpdate={onUpdateInformation} 
                type="number"
                value={phoneNumber}
                onChange={value=>setPhoneNumber(value)} 
                style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
                result={phoneNumber?phoneNumber:'no data'}
              />
              <InputWithLabel 
                editMode={editMode}
                onCancel={onCancel}
                label={t('address')}
                placeholder={t('Enter address')}
                onUpdate={onUpdateInformation} 
                type="text"
                value={address}
                onChange={value=>setAddress(value)} 
                style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
                result={address?address:'no data'}
              />
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
      <div className="col-sm-6">
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
                <textarea className={`border-0 btn-hover-bg px-2 py-1 rounded w-100 `} onKeyDown={e=>{if(e.key === "Enter") onUpdateInformation(e) ; if(e.key === "Escape") onCancel()}} style={{outline:'none',fontSize:FONT_SIZE,resize:"vertical"}} value={diagnose} onChange={e=>setDiagnose(e.target.value)} placeholder={t('Enter patient note')}/>
                :
                <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{diagnose?diagnose:'no data'}</span>
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