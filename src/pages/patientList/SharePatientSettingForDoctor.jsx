import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { convertISOToVNDateString, FONT_SIZE, FONT_SIZE_HEAD, splitAvatar, toISODateString, WIDTH_CHILD, WIDTH_HEAD } from "../../common/Utility.jsx";
import { getToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

const PAGE_SIZE = 5;
let emailSearchTimeout = null;
let nameSearchTimeout = null;
const AVATAR_HEIGHT = "40px";
const AVATAR_WIDTH = "40px";

export default function SharePatientSettingForDoctor(props){
  const doctor = useSelector(state=>state.doctor.data);
  const {t} = useTranslation();
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [emailSearch,SetEmailSearch] = useState();
  const [listEmailSearch,setListEmailSearch] = useState([]);
  const [newDoctor,setNewDoctor] = useState();

  const [listPatientSearch,setListPatientSearch] = useState([]);
  const [nameSearch,setNameSearch] = useState('');
  const [selectedPatient,setSelectedPatient] = useState();


  const onEmailSearchChange = value => {
    SetEmailSearch(value);
    if (emailSearchTimeout) clearTimeout(emailSearchTimeout);
    emailSearchTimeout = setTimeout(getAllEmailSearch,300,value);
  }

  const onNameSearchChange = value => {
    setNameSearch(value);
    if (nameSearchTimeout) clearTimeout(nameSearchTimeout);
    nameSearchTimeout = setTimeout(getAllPaitentForDoctor,300,value);
  }

  const getAllPaitentForDoctor = (name) => {
    if(name){
      return new Promise((resolve, reject) => {
        getToServerWithToken(`/v1/patient/getPatientListForDoctor/${doctor.id}?page=${1}&pageSize=${PAGE_SIZE}&nameSearch=${name?name:''}`).then(result=>{
          setListPatientSearch(result.data);
          resolve();
        }).catch((err) =>{
          if(err.refreshToken){
            refreshToken(nav,dispatch).then(()=>getAllPaitentForDoctor(name));
          }else{
            toast.error(err.message);
          }
          reject(err);
        })
      })
    }else{
      setListPatientSearch([])
    }
  }
  
  const getAllEmailSearch = (email) => {
    if(!email){
      setListEmailSearch([]);
    }else{
      getToServerWithToken(`/v1/doctor/getAllDoctorFromEmailSearch/${email}?currentEmailDoctor=${doctor.email}`).then(result=>{
        setListEmailSearch(result.data);
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getAllEmailSearch(email));
        }else{
          toast.error(err.message);
        }
      });
    }
  }

  return <div className="h-100 w-100 container">
    <fieldset className="border-top p-2 d-flex flex-row align-items-center">
      <legend style={{fontSize:FONT_SIZE_HEAD}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
        {t(`share patient setting for doctor`)}
      </legend>
      <div className="row w-100 h-100 mt-4">
        <fieldset className="border rounded p-2 col-lg-6 col-sm-12 h-100">
          <legend style={{fontSize:FONT_SIZE_HEAD}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
            {t(`Doctor is shared patient`)}
          </legend>
          <div className="d-flex flex-row align-items-center border rounded p-1">
            <input 
              className="border-0 flex-grow-1 px-2 py-1 mc-background-color-white rounded" 
              style={{outline:"none",fontSize:FONT_SIZE}} 
              type="email" value={emailSearch} 
              onChange={e=>onEmailSearchChange(e.target.value)} 
              placeholder={t('Enter email of doctor')}
            />
          </div>
          <div className="position-relative">
            <div className={`position-absolute d-flex flex-grow-1 p-0 w-100 flex-column me-2 bg-white border-start border-end ${(listEmailSearch.length>=0 && emailSearch)?'border-bottom':''}`} style={{zIndex:"1"}}>
              {
                listEmailSearch?.map(doctor=>{
                  return <button key={doctor.id} className="btn btn-hover-bg border-bottom border-0 py-1 px-2 d-flex flex-row align-items-center justify-content-start" type="button" onClick={e=>{setListEmailSearch([]);SetEmailSearch('');setNewDoctor(doctor)}}>
                    <img alt="avatar" className="rounded" src={splitAvatar(doctor.avatar,'/assets/images/doctor.png')} style={{height:"50px",width:"40px",objectFit:"cover"}}/>
                    <div className="d-flex ms-3 flex-column justify-content-center align-items-center flex-grow-1">
                      <span className="mc-color" style={{fontSize:FONT_SIZE}}>{doctor.email}</span>
                      <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{'('}{doctor.fullName?doctor.fullName:t('no data')}{')'}</span>
                    </div>
                  </button>
                })
              }
              {
                listEmailSearch.length===0 && emailSearch && <div className="d-flex justify-content-center flex-row align-items-center h-100 py-2" style={{zIndex:"1"}}>
                  <img className="text-capitalize me-2" src="/assets/images/notFound.png" height={"35px"} alt={t("can't found doctor profile")} />
                  <span className="text-danger text-capitalize mt-2">{t("can't found doctor profile")}</span>
                </div>
              }
            </div>
          </div>
          {
            newDoctor && <div className="d-flex flex-row align-items-center border rounded p-1">
              <button className="btn mc-pale-background border-0 py-1 px-2 d-flex flex-row flex-grow-1 align-items-center justify-content-start" type="button" >
                <img alt="avatar" className="rounded" src={splitAvatar(newDoctor.avatar,'/assets/images/doctor.png')} style={{height:"50px",width:"40px",objectFit:"cover"}}/>
                <div className="d-flex ms-3 flex-column justify-content-center align-items-center flex-grow-1" style={{width:WIDTH_CHILD}}>
                  <span className="mc-color" style={{fontSize:FONT_SIZE}}>{newDoctor.email}</span>
                  <span className="text-capitalize text-white" style={{fontSize:FONT_SIZE}}>{'('}{newDoctor.fullName?newDoctor.fullName:t('no data')}{')'}</span>
                </div>
                <span className="text-capitalize mx-2 text-white" style={{fontSize:FONT_SIZE}}>{t('this doctor have not been shared patients')}</span>
              </button>
              <div className="border-start mx-2 d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column justify-content-center align-items-center ms-2">
                  <span className="text-uppercase fw-bold mc-color" style={{fontSize:FONT_SIZE}}>{t('view')}</span>
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      role="switch"
                      disabled={true}
                      placeholder={t('role of doctor')}
                      />
                  </div>
                </div>
                <div className="border-start ms-2">
                  <IconButtonComponent className="btn-outline-danger border-0 h-100 ms-2" icon="delete" onClick={e=>setNewDoctor('')} FONT_SIZE_ICON={"30px"} title={t("delete this doctor")}/>
                </div>
              </div>
            </div>
          }
        </fieldset>
        <fieldset className="border rounded p-2 col-lg-6 col-sm-12">
          <legend style={{fontSize:FONT_SIZE_HEAD}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
            {t(`list patient is shared`)}
          </legend>
          <div className="d-flex flex-row align-items-center border rounded p-1">
            <input 
              className="border-0 flex-grow-1 px-2 py-1 mc-background-color-white rounded" 
              style={{outline:"none",fontSize:FONT_SIZE}} 
              type="text" value={nameSearch} 
              onChange={e=>onNameSearchChange(e.target.value)} 
              placeholder={t('Enter name of patinet')}
            />
          </div>
          <div className="position-relative">
            <div className={`position-absolute d-flex flex-grow-1 p-0 w-100 flex-column me-2 bg-white border-start border-end ${(listPatientSearch.length>=0 && nameSearch)?'border-bottom':''}`} style={{zIndex:"1"}}>
              {
                listPatientSearch?.map(patient=>{
                  return <button key={patient.id} className="btn btn-hover-bg border-bottom border-0 py-1 px-2 d-flex flex-row align-items-center justify-content-between" type="button" onBlur={e=>{setNameSearch('');setListPatientSearch([])}} onClick={e=>{setNameSearch(patient.fullName);setListPatientSearch([])}}>
                    <div className="h-auto" style={{width:WIDTH_HEAD}}>
                      <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/frontFace.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"cover"}}/>
                    </div>
                    <span className="text-wrap" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{patient.fullName}</span>
                    <span style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{patient.gender}</span>
                    <span style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{convertISOToVNDateString(toISODateString(new Date(patient.birthday)))}</span>
                  </button>
                })
              }
              {
                listPatientSearch.length===0 && nameSearch && <div className="d-flex justify-content-center flex-row align-items-center h-100 py-2" style={{zIndex:"1"}}>
                  <img className="text-capitalize me-2" src="/assets/images/notFound.png" height={"35px"} alt={t("can't found doctor profile")} />
                  <span className="text-danger text-capitalize mt-2">{t("can't found doctor profile")}</span>
                </div>
              }
            </div>
          </div>
        </fieldset>
      </div>
      
    </fieldset>
  </div>
}