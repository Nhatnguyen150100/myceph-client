import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { convertISOToVNDateString, toISODateString } from "../../common/Utility.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../services/getAPI.jsx";

const WIDTH_HEAD = "150px";

export default function DoctorSetting(props){
  const loading = useSelector(state=>state.general.loading);
  const doctor = useSelector(state=>state.doctor.data);
  const [selectedTab,setSelectedTab] = useState(0);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [editMode,setEditMode] = useState(false);
  const [fullName,setFullName] = useState();
  const [gender,setGender] = useState();
  const [birthday,setBirthday] = useState();
  const [phoneNumber,setPhoneNumber] = useState();
  const [description,setDescription] = useState();

  useEffect(()=>{
    getInformation();
  },[])

  const getInformation = () =>{
    dispatch(setLoadingModal(true));
    getToServerWithToken(`/v1/doctor/getInformationDoctor/${doctor.email}`).then(result => {
      setFullName(result.data.fullName);
      setGender(result.data.gender);
      setBirthday(result.data.birthday);
      setPhoneNumber(result.data.phoneNumber);
      setDescription(result.data.description);
    }).catch((err) => toast.error(t(err.message))).finally(() => dispatch(setLoadingModal(false)))
  }

  const onCancel = () => {
    setEditMode(false);
    getInformation();
  }

  const onUpdate = () => {
    dispatch(setLoadingModal(true));
    putToServerWithToken(`/v1/doctor/updateInformation/${doctor.id}`,{
      fullName: fullName,
      gender: gender,
      birthday: birthday,
      phoneNumber: phoneNumber,
      description: description
    }).then(result => {
      onCancel();
      getInformation();
    }).catch((err) => toast.error(t(err.message))).finally(() => dispatch(setLoadingModal(false)))
  }

  let currentTab = null;

  switch(selectedTab){
    case 0: currentTab = <div className="d-flex flex-column h-100">
      <div className="d-flex flex-grow-1 justify-content-end mt-2">
        {
          editMode ?
          <div>
            <button type="button" className="btn btn-outline-success p-0 text-white-hover me-2" title={t('save')} onClick={onUpdate}>
              <span className="material-symbols-outlined mt-1 mx-1">
                done
              </span>
            </button>
            <button type="button" className="btn btn-outline-danger p-0 text-white-hover" title={t('cancel')} onClick={onCancel}>
              <span className="material-symbols-outlined mt-1 mx-1">
                close
              </span>
            </button>
          </div>
          :
          <button type="button" className="btn btn-outline-warning p-0 text-white-hover" title={t('edit profile')} onClick={e=>setEditMode(true)}>
            <span className="material-symbols-outlined mt-1 mx-1">
              edit
            </span>
          </button>
        }
      </div>
      <div className="d-flex flex-row flex-grow-1">
        <div className="border d-flex justify-content-center align-items-center rounded mc-background-color-white" style={{height:"400px",width:"300px"}}>
          <img alt="avatar" src="/assets/images/doctor.png" height={"250px"}/>
        </div>
        <div className="d-flex flex-column flex-grow-1 ms-5">
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('email')}:</label>
            <span className="text-capitalize text-gray fw-bold">{doctor.email}</span>
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('full name')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none"}} value={fullName} onChange={e=>setFullName(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{fullName?fullName:'no data'}</span>
            }
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('gender')}:</label>
            {
              editMode ? 
              <select className="text-gray border-0 p-0 text-capitalize" style={{outline:"none"}} value={gender} onChange={e=>setGender(e.target.value)}>
                <option selected disabled={true}>no data</option>
                <option className="text-gray border-0 text-capitalize" value={'male'}>
                  {t('male')}
                </option>
                <option className="text-gray border-0 text-capitalize" value={'female'}>
                  {t('female')}
                </option>
              </select>
              :
              <span className="text-capitalize text-gray fw-bold">{gender?gender:'no data'}</span>
            }
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('birth of day')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0" style={{outline:"none"}} onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} type="date" value={toISODateString(new Date(birthday?birthday:new Date()))} onChange={e=>setBirthday(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{convertISOToVNDateString(toISODateString(new Date(birthday?birthday:new Date())))}</span>
            }
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('phone number')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none"}} type="number" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{phoneNumber?phoneNumber:'no data'}</span>
            }
          </div>
          <div className="d-flex border-bottom">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('description')}:</label>
            {
              editMode ? 
              <textarea className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none"}} value={description} onChange={e=>setDescription(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{description?description:'no data'}</span>
            }
          </div>
        </div>
      </div>
    </div>
    break;
    case 1: currentTab = <div className="d-flex my-3">
      other profile
    </div>
    break;
    default: currentTab = <div>error</div>
  }

  return <div className="d-flex flex-column h-100">
    <div className="w-100 d-flex justify-content-end mc-background-color-white py-2">
      <div className="d-flex flex-row align-items-center justify-content-between">
        <button type="button" className={`btn me-3  text-white-hover ${selectedTab===0?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(0)}>
          <span className="text-capitalize">{t('my profile')}</span>
        </button>
        <button type="button" className={`btn  text-white-hover ${selectedTab===1?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(1)}>
          <span className="text-capitalize">{t('other profile')}</span>
        </button>
      </div>
    </div>
    {currentTab}
  </div>
}