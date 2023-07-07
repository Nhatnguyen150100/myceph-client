import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import TextFieldInput from "../../../common/TextFieldInput.jsx";
import { AVATAR_HEIGHT, AVATAR_WIDTH, convertISOToVNDateString, FONT_SIZE, splitAvatar, toISODateString, WIDTH_CHILD, WIDTH_HEAD } from "../../../common/Utility.jsx";
import { setOtherEmailDoctor } from "../../../redux/DoctorSlice.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { getToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

let emailSearchTimeout = null;

export default function OtherProfile(props){
  const doctor = useSelector(state=>state.doctor.data);
  const otherEmailDoctor = useSelector(state=>state.doctor.otherEmailDoctor);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [listEmailSearch,setListEmailSearch] = useState([]);
  const [otherDoctor,setOtherDoctor] = useState();

  const [email,setEmail] = useState();
  const [fullName,setFullName] = useState();
  const [avatar,setAavatar] = useState();
  const [gender,setGender] = useState();
  const [birthday,setBirthday] = useState();
  const [phoneNumber,setPhoneNumber] = useState();
  const [speciality,setSpeciality] = useState();
  const [diploma,setDiploma] = useState();
  const [position,setPosition] = useState();
  const [description,setDescription] = useState();

  const nav = useNavigate();

  const onEmailSearchChange = value => {
    setOtherDoctor(value);
    if (emailSearchTimeout) clearTimeout(emailSearchTimeout);
    emailSearchTimeout = setTimeout(getAllEmailSearch,300,value);
  }

  const onSelectOtherDoctor = (doctor) =>{
    setOtherDoctor(doctor.email);
    setListEmailSearch([]);
    dispatch(setOtherEmailDoctor(doctor.email))
  }

  useEffect(()=>{
    if(otherEmailDoctor) getInformation();
  },[otherEmailDoctor])

  const getInformation = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/doctor/getInformationDoctor/${otherEmailDoctor}`).then(result => {
        setEmail(result.data.email);
        setFullName(result.data.fullName);
        setGender(result.data.gender);
        setBirthday(result.data.birthday);
        setPhoneNumber(result.data.phoneNumber);
        setSpeciality(result.data.speciality);
        setDiploma(result.data.diploma);
        setPosition(result.data.position);
        setDescription(result.data.description);
        setAavatar(splitAvatar(result.data.avatar,'/assets/images/doctor.png'));
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getInformation());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)))
    });
  }

  const getAllEmailSearch = (email) => {
    if(!email){
      setListEmailSearch([]);
    }else{
      getToServerWithToken(`/v1/doctor/getAllDoctorFromEmailSearch/${email}?currentEmailDoctor=${doctor.email}`).then(result=>{
        setListEmailSearch(result.data);
      }).catch(err =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getAllEmailSearch(email));
        }else{
          toast.error(err.message);
        }
      })
    }
  }

  const onRemoveDoctor = () => {
    setEmail('');
    setFullName('');
    setGender('');
    setBirthday('');
    setPhoneNumber('');
    setSpeciality('');
    setDiploma('');
    setPosition('');
    setDescription('');
    setAavatar('');
    dispatch(setOtherEmailDoctor(null));
  }

  return <div className="d-flex flex-column h-100">
    <div className="position-relative mt-4" style={{width:"300px"}}>
      <TextFieldInput className="p-1" legend={t('find other doctor')} placeholder={t('Email of other doctor')} value={otherDoctor} onChange={value=>onEmailSearchChange(value)}/>
      <ul className={`position-absolute d-flex flex-grow-1 p-0 w-100 flex-column me-2 bg-white border-start border-end ${(listEmailSearch.length>=0 && otherDoctor && !otherEmailDoctor)?'border-bottom':''}`} style={{zIndex:"1"}}>
        {
          listEmailSearch?.map(doctor=>{
            return <button key={doctor.id} className="btn btn-hover-bg border-bottom border-0 py-1 px-2 d-flex flex-row align-items-center justify-content-start" type="button" onClick={e=>onSelectOtherDoctor(doctor)}>
              <img alt="avatar" className="rounded" src={splitAvatar(doctor.avatar,'/assets/images/doctor.png')} style={{height:"50px",width:"40px",objectFit:"cover"}}/>
              <div className="d-flex ms-3 flex-column justify-content-center align-items-center flex-grow-1">
                <span className="mc-color" style={{fontSize:FONT_SIZE}}>{doctor.email}</span>
                <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{'('}{doctor.fullName?doctor.fullName:t('no data')}{')'}</span>
              </div>
            </button>
          })
        }
        {
          listEmailSearch.length===0 && otherDoctor && !otherEmailDoctor && <div className="d-flex justify-content-center flex-row align-items-center h-100 py-2" style={{zIndex:"1"}}>
            <img className="text-capitalize me-2" src="/assets/images/notFound.png" height={"35px"} alt={t("can't found doctor profile")} />
            <span className="text-danger text-capitalize mt-2">{t("can't found doctor profile")}</span>
          </div>
        }
      </ul>
    </div>
    {
      email ? <div className="d-flex flex-column h-100 mt-2">
        <div className="flex-row d-flex justify-content-end">
        <IconButtonComponent 
          className="btn-outline-danger" 
          onClick={onRemoveDoctor} 
          icon="close" 
          FONT_SIZE_ICON={props.FONT_SIZE_ICON} 
          title={t("close")}
        />
        </div>
        <div className="d-flex flex-row flex-grow-1 mt-2">
          <div className="border position-relative d-flex justify-content-center align-items-center rounded mc-background-color-white rounded" style={{height:AVATAR_HEIGHT,width:AVATAR_WIDTH}}>
            <img alt="avatar" className="rounded" src={`${avatar}`} style={{height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"cover"}}/>
          </div>
          <div className="d-flex flex-column flex-grow-1 ms-5">
            <div className={`d-flex mb-3`}>
              <span className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('email')}:</span>
              <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE,width:WIDTH_CHILD}}>{email}</span>
              <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('full name')}:</label>    
              <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{fullName?fullName:'no data'}</span>
            </div>
            <div className={`d-flex mb-3 `}>
              <label className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('gender')}:</label>
              <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE,width:WIDTH_CHILD}}>{gender?gender:'no data'}</span>
              <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('date of birth')}:</label>   
              <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{convertISOToVNDateString(toISODateString(new Date(birthday?birthday:new Date())))}</span>
            </div>
            <div className={`d-flex mb-3 `}>
              <label className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('phone number')}:</label>
              <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE,width:WIDTH_CHILD}}>{phoneNumber?phoneNumber:'no data'}</span>
              <div className="d-flex flex-wrap flex-grow-1" style={{width:WIDTH_CHILD}}>
                <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('specialty')}:</label>
                <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded flex-grow-1" style={{fontSize:FONT_SIZE}}>{speciality?speciality:'no data'}</span>
              </div>
            </div>
            <div className={`d-flex mb-3 `}>
              <label className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('diploma')}:</label>
              <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded flex-grow-1" style={{fontSize:FONT_SIZE}}>{diploma?diploma:'no data'}</span>
            </div>
            <div className={`d-flex mb-3 `}>
              <label className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('position')}:</label>
              <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded flex-grow-1" style={{fontSize:FONT_SIZE}}>{position?position:'no data'}</span>    
            </div>
            <div className={`d-flex `}>
              <label className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('description')}:</label>
              <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{description?description:'no data'}</span>
            </div>
          </div>
        </div>
      </div>
      :
      <div className="d-flex justify-content-center flex-column align-items-center h-100">
        <img className="text-capitalize" src="/assets/images/notFound.png" height={"150px"} alt={t("can't found other doctor profile")} />
        <span className="text-danger text-capitalize mt-2">{t("can't found other doctor profile")}</span>
      </div>
    }
    <div className="my-3 d-flex align-items-end justify-content-center w- h-100">
      <div className="d-flex flex-row align-items-center justify-content-center">
        <hr className="hr-line" style={{ width: '140px' }} />
        <span className="mx-3 mc-color fw-bold text-uppercase text-center text-nowrap">{t('other doctor profile')}</span>
        <hr className="hr-line" style={{ width: '140px' }} />
      </div>
    </div>
  </div>
}