import { Pagination } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deCryptData } from "../../common/Crypto.jsx";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { convertISOToVNDateString, FONT_SIZE, FONT_SIZE_HEAD, splitAvatar, toISODateString, WIDTH_HEAD } from "../../common/Utility.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

const PAGE_SIZE = 6;
let emailSearchTimeout = null;
let nameSearchTimeout = null;
const AVATAR_HEIGHT = "40px";
const AVATAR_WIDTH = "40px";

const WIDTH_NAME= "200px";
const WIDTH_ATTRIBUTES ="80px";

export default function SharePatientSettingForDoctor(props){
  const doctor = useSelector(state=>state.doctor.data);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);
  const {t} = useTranslation();
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [emailSearch,setEmailSearch] = useState();
  const [listEmailSearch,setListEmailSearch] = useState([]);
  const [newDoctor,setNewDoctor] = useState();
  const [selectedDoctor,setSelectedDoctor] = useState();
  const [listDoctor,setListDoctor] = useState([]);
  const [pageDoctor,setPageDoctor] = useState(1);
  const [countDoctor,setCountDoctor] = useState();

  const [listPatientSearch,setListPatientSearch] = useState([]);
  const [nameSearch,setNameSearch] = useState('');
  const [selectedPatient,setSelectedPatient] = useState();
  const [listSharePatient,setListSharePatient] = useState([]);
  const [pagePatient,setPagePatient] = useState(1);
  const [countPatient,setCountPatient] = useState();

  useEffect(()=>{
    getAllDoctorSharePatient();
  },[pageDoctor])

  useEffect(()=>{
    if(selectedDoctor) onGetSharePatient(selectedDoctor);
  },[pagePatient])


  const onEmailSearchChange = value => {
    setListSharePatient([]);
    setSelectedDoctor();
    setCountPatient(0);
    setEmailSearch(value);
    if (emailSearchTimeout) clearTimeout(emailSearchTimeout);
    emailSearchTimeout = setTimeout(getAllEmailSearch,300,value);
  }

  const onNameSearchChange = value => {
    setNameSearch(value);
    if (nameSearchTimeout) clearTimeout(nameSearchTimeout);
    nameSearchTimeout = setTimeout(getAllPatientForDoctor,300,value);
  }

  const getAllPatientForDoctor = (name) => {
    if(name){
      return new Promise((resolve, reject) => {
        getToServerWithToken(`/v1/patient/getPatientListForDoctor/${doctor.id}?page=${1}&pageSize=${PAGE_SIZE}&nameSearch=${name?name:''}`).then(result=>{
          setListPatientSearch(result.data);
          resolve();
        }).catch((err) =>{
          if(err.refreshToken){
            refreshToken(nav,dispatch).then(()=>getAllPatientForDoctor(name));
          }else{
            toast.error(err.message);
            reject(err);
          }
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

  const getAllDoctorSharePatient = () => {
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/sharePatient/getAllDoctorSharePatient/${doctor.id}?page=${pageDoctor}&pageSize=${PAGE_SIZE}`).then(result => {
        setListDoctor(result.data);
        setCountDoctor(result.count);
        resolve();
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getAllDoctorSharePatient());
        }else{
          toast.error(err.message);
          reject(err)
        }
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const onSharePatient = (idOwnerDoctor) => {
    return new Promise((resolve,reject) => {
      postToServerWithToken('/v1/sharePatient/sharePatient',{
        idSharedPatientOfDoctor: doctor.id,
        idSharedPatient: selectedPatient.id,
        idOwnerDoctor: idOwnerDoctor
      }).then(result => {
        onGetSharePatient({id:idOwnerDoctor}).then(()=>{
          toast.success(result.message);
          if(newDoctor){
            getAllDoctorSharePatient().then(()=>{
              setNewDoctor();
              setSelectedDoctor();
              setListSharePatient();
              resolve();
            })
          }
        })
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>onSharePatient(idOwnerDoctor));
        }else{
          toast.error(err.message);
          reject(err);
        }
      });
    })
  }

  const onGetSharePatient = (ownerDoctor) => {
    setSelectedDoctor(ownerDoctor);
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/sharePatient/getListSharePatientOfDoctor/${doctor.id}?idOwnerDoctor=${ownerDoctor.id}&page=${pagePatient}&pageSize=${PAGE_SIZE}`).then(result=>{
        setListSharePatient(result.data);
        setCountPatient(result.count);
        setSelectedPatient();
        resolve(result.count);
      }).catch((err) =>{
        if(!err.refreshToken){
          toast.error(err.message);
          reject(err);
        }
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const onSetNewDoctor = (newDoctor) => {
    if(listDoctor){
      const checkIsDoctor = listDoctor.filter(doctor => doctor.id===newDoctor.id);
      if(checkIsDoctor.length>0) toast.error(t('this doctor is already to share patient'));
      else{
        setListEmailSearch([]);
        setEmailSearch('');
        setNewDoctor(newDoctor);
        setSelectedDoctor();
      }
    }else{
      setListEmailSearch([]);
      setEmailSearch('');
      setNewDoctor(newDoctor);
      setSelectedDoctor();
    }
  }

  const onSetSearchPatient = (newPatient) => {
    if(listSharePatient){
      const checkIsPatient = listSharePatient.filter(patient => patient.id===newPatient.id);
      console.log(checkIsPatient);
      if(checkIsPatient.length>0) toast.error(t('this patient already exists'));
      else{
        setNameSearch('');
        setSelectedPatient(newPatient);
        setListPatientSearch([]);
      }
    }else{
      setNameSearch('');
      setSelectedPatient(newPatient);
      setListPatientSearch([]);
    }
  }

  const deleteShareDoctor = (idOwnerDoctor) => {
    if(window.confirm(t('Are you sure you want to delete this doctor?'))){
      return new Promise((resolve, reject) => {
        deleteToServerWithToken(`/v1/sharePatient/deleteShareDoctor/${doctor.id}?idOwnerDoctor=${idOwnerDoctor}`).then(result => {
          getAllDoctorSharePatient().then(() => {
            setSelectedDoctor();
            setListSharePatient([]);
            setCountPatient(0);
            setPagePatient(1);
            toast.success(result.message);
            resolve();
          });
        }).catch((err) =>{
          if(err.refreshToken){
            refreshToken(nav,dispatch).then(()=>deleteShareDoctor(idOwnerDoctor));
          }else{
            toast.error(err.message);
            reject(err);
          }
        });
      })
    }
  }

  const removeSharePatient = (idSharedPatient) => {
    if(window.confirm(t('Are you sure you want to delete this patient?'))){
      return new Promise((resolve,reject) =>{
        postToServerWithToken(`/v1/sharePatient/removeSharePatient`,{
          idSharedPatientOfDoctor: doctor.id,
          idSharedPatient: idSharedPatient,
          idOwnerDoctor: selectedDoctor.id
        }).then(result => {
          onGetSharePatient(selectedDoctor).then(count=>{
            if(count===0){
              getAllDoctorSharePatient().then(()=>{
                toast.success(result.message);
                resolve();
              })
            }else{
              toast.success(result.message);
              resolve();
            }
          })
        }).catch((err) =>{
          if(err.refreshToken){
            refreshToken(nav,dispatch).then(()=>removeSharePatient(idSharedPatient));
          }else{
            toast.error(err.message);
            reject(err);
          }
        });
      })
    }
  }

  const onChangeRoleOfDoctor = (idSharedPatient,idOwnerDoctor,roleOfdoctor) => {
    return new Promise((resolve, reject) => {
      putToServerWithToken('/v1/sharePatient/updateRoleOfOwnerDoctor',{
        idSharedPatientOfDoctor: doctor.id,
        idSharedPatient: idSharedPatient,
        idOwnerDoctor: idOwnerDoctor,
        roleOfOwnerDoctor: roleOfdoctor
      }).then(result=>{
        onGetSharePatient({id:idOwnerDoctor}).then(()=>{
          toast.success(result.message);
          resolve();
        })
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>onChangeRoleOfDoctor(idOwnerDoctor,idOwnerDoctor,roleOfdoctor));
        }else{
          toast.error(err.message);
          reject(err);
        }
      });
    });
  }

  const onChangePageDoctor = (event,value) => {
    setPageDoctor(value);
  }

  const onChangePagePatient = (event,value) => {
    setPagePatient(value);
  }

  return <div className="h-100 w-100 container">
    <fieldset className="border-top p-2 d-flex flex-row align-items-center h-100 pb-5">
      <legend style={{fontSize:FONT_SIZE_HEAD}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
        {t(`Setting patient sharing for doctors`)}
      </legend>
      <div className="row w-100 h-100 mt-4">
        <fieldset className="border rounded p-2 col-lg-6 col-sm-12 h-100">
          <legend style={{fontSize:FONT_SIZE_HEAD}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
            {t(`Doctors are assigned shared patients`)}
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
                  return <button key={doctor.id} className="btn btn-hover-bg border-bottom border-0 py-1 px-2 d-flex flex-row align-items-center justify-content-start" type="button" onClick={e=>onSetNewDoctor(doctor)}>
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
          <div style={{overflowY:"auto"}}>
            {
              listDoctor?.map((doctor,index) => {
                return <div key={doctor.id} className={`d-flex flex-row align-items-center border rounded p-1 ${(index%2!==0) && 'mc-background-color-white'}`}>
                  <button disabled={emailSearch} onClick={e=>{if(newDoctor) setNewDoctor();e.preventDefault();onGetSharePatient(doctor)}} className={`btn border-0 btn-hover-bg ${selectedDoctor?.id===doctor.id && !emailSearch && !newDoctor && 'mc-pale-background text-white'} py-1 px-2 d-flex flex-row flex-grow-1 align-items-center justify-content-start`} type="button" >
                    <img alt="avatar" className="rounded" src={splitAvatar(doctor.avatar,'/assets/images/doctor.png')} style={{height:"50px",width:"40px",objectFit:"cover"}}/>
                    <div className="d-flex ms-3 flex-column justify-content-center align-items-center" style={{width:WIDTH_NAME}}>
                      <span className="mc-color" style={{fontSize:FONT_SIZE}}>{doctor.email}</span>
                      <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{doctor.fullName?doctor.fullName:t('no data')}</span>
                    </div>
                    <div className="d-flex ms-3 flex-column justify-content-center align-items-center" style={{width:WIDTH_ATTRIBUTES}}>
                      <span className="mc-color text-capitalize" style={{fontSize:FONT_SIZE}}>{t('gender')}</span>
                      <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{doctor.gender?doctor.gender:t('no data')}</span>
                    </div>
                    <div className="d-flex ms-3 flex-column justify-content-center align-items-center" style={{width:WIDTH_ATTRIBUTES}}>
                      <span className="mc-color text-capitalize" style={{fontSize:FONT_SIZE}}>{t('date of birth')}</span>
                      <span style={{fontSize:FONT_SIZE}}>{doctor.birthday?convertISOToVNDateString(toISODateString(new Date(doctor.birthday))):t('no data')}</span>
                    </div>
                  </button>
                  <div className="border-start mx-2 d-flex align-items-center justify-content-center">
                    <IconButtonComponent className="btn-outline-danger border-0 h-100 ms-2" icon="delete" onClick={e=>deleteShareDoctor(doctor.id)}  FONT_SIZE_ICON={"30px"} title={t("delete this doctor")}/>                 
                  </div>
                </div>
              })
            }
            {
              countDoctor > 0 && <div className="d-flex flex-grow-1 justify-content-center my-3">
                <Pagination 
                  count={Math.ceil(countDoctor/PAGE_SIZE) || 0}
                  page={pageDoctor}
                  onChange={onChangePageDoctor}
                  variant="outlined"
                  color="primary"
                />
              </div>
            }
            {
              newDoctor && <div className="d-flex flex-row align-items-center border rounded p-1">
                <button className="btn mc-pale-background border-0 py-1 px-2 d-flex flex-row flex-grow-1 align-items-center justify-content-start" type="button" >
                  <img alt="avatar" className="rounded" src={splitAvatar(newDoctor.avatar,'/assets/images/doctor.png')} style={{height:"50px",width:"40px",objectFit:"cover"}}/>
                  <div className="d-flex ms-3 flex-column justify-content-center align-items-center flex-grow-1" style={{width:WIDTH_ATTRIBUTES}}>
                    <span className="mc-color" style={{fontSize:FONT_SIZE}}>{newDoctor.email}</span>
                    <span className="text-capitalize text-white" style={{fontSize:FONT_SIZE}}>{'('}{newDoctor.fullName?newDoctor.fullName:t('no data')}{')'}</span>
                  </div>
                  <span className="text-capitalize mx-2 text-white" style={{fontSize:FONT_SIZE}}>{t('this doctor have not been shared patients')}</span>
                </button>
                <div className="border-start mx-2 d-flex align-items-center justify-content-center">
                  <IconButtonComponent className="btn-outline-danger border-0 h-100 ms-2" icon="delete" onClick={e=>{setNewDoctor('')}} FONT_SIZE_ICON={"30px"} title={t("delete this doctor")}/>
                </div>
              </div>
            }
          </div>
        </fieldset>
        <fieldset className="border rounded p-2 col-lg-6 col-sm-12">
          <legend style={{fontSize:FONT_SIZE_HEAD}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
            {t(`List of shared patients`)}
          </legend>
          <div className="position-relative d-flex flex-row align-items-center border rounded p-1">
            <input 
              className="border-0 flex-grow-1 px-2 py-1 mc-background-color-white rounded" 
              style={{outline:"none",fontSize:FONT_SIZE}} 
              type="text" value={nameSearch} 
              onChange={e=>onNameSearchChange(e.target.value)} 
              placeholder={!selectedPatient?t('Enter name of patient'):''}
              disabled={selectedPatient}
            />
            {
              selectedPatient && <div className="position-absolute px-2 py-1">
                <button
                  onClick={e=>setSelectedPatient()}
                  className={`btn btn-primary border-0 px-3 py-0 rounded-pill`}
                  style={{ color: 'white', width: '100%',fontSize:FONT_SIZE}}
                  >
                  {selectedPatient.fullName}
                </button>
              </div>
            }
            <div className="border-start ms-2">
              <IconButtonComponent onClick={e=>onSharePatient(newDoctor?newDoctor.id:selectedDoctor.id)} className={`btn-outline-success border-0 h-100 ms-2 ${selectedPatient && (newDoctor || selectedDoctor) && 'standout'}`} disabled={!selectedPatient || (!newDoctor && !selectedDoctor)} icon="add"  FONT_SIZE_ICON={"22px"} title={t("share patient")}/>
            </div>
          </div>
          <div className="position-relative">
            <div className={`position-absolute d-flex flex-grow-1 p-0 w-100 flex-column me-2 bg-white border-start border-end ${(listPatientSearch.length>=0 && nameSearch)?'border-bottom':''}`} style={{zIndex:"1"}}>
              {
                listPatientSearch?.map(patient=>{
                  return <button 
                            key={patient.id} 
                            className="btn btn-hover-bg border-bottom border-0 py-1 px-2 d-flex flex-row align-items-center justify-content-between" 
                            type="button" 
                            onClick={e=>{e.preventDefault();onSetSearchPatient(patient)}}
                          >
                    <div className="h-auto ps-3">
                      <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/frontFace.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"cover"}}/>
                    </div>
                    <div className="d-flex ms-3 flex-column justify-content-center align-items-center flex-grow-1" style={{width:WIDTH_NAME}}>
                      <span className="mc-color text-capitalize" style={{fontSize:FONT_SIZE}}>{t('full name')}</span>
                      <span className="text-wrap" style={{fontSize:FONT_SIZE}}>{patient.fullName}</span>
                    </div>
                    <div className="d-flex ms-3 flex-column justify-content-center align-items-center d-none" style={{width:WIDTH_ATTRIBUTES}}>
                      <span className="mc-color text-capitalize" style={{fontSize:FONT_SIZE}}>{t('gender')}</span>
                      <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{patient.isEncrypted?deCryptData(encryptKeyDoctor.key,encryptKeyDoctor.iv,JSON.parse(patient.gender).tag,JSON.parse(patient.gender).encrypted):patient.gender}</span>
                    </div>
                    <div className="d-flex ms-3 flex-column justify-content-center align-items-center" style={{width:WIDTH_ATTRIBUTES}}>
                      <span className="mc-color text-capitalize" style={{fontSize:FONT_SIZE}}>{t('date of birth')}</span>
                      <span style={{fontSize:FONT_SIZE}}>{convertISOToVNDateString(toISODateString(new Date(patient.birthday)))}</span>
                    </div>
                  </button>
                })
              }
              {
                listPatientSearch.length===0 && nameSearch && <div className="d-flex justify-content-center flex-row align-items-center h-100 py-2" style={{zIndex:"1"}}>
                  <img className="text-capitalize me-2" src="/assets/images/notFound.png" height={"35px"} alt={t("can't found information patient")} />
                  <span className="text-danger text-capitalize mt-2">{t("can't found information patient")}</span>
                </div>
              }
            </div>
          </div>
          <div style={{overflowY:"auto"}}>
            {
              listSharePatient?.map((patient,index) => {
                return <div key={patient.id} className={`d-flex flex-row align-items-center border rounded p-2 ${(index%2!==0) && 'mc-background-color-white'}`}>
                  <div className="h-auto" style={{width:WIDTH_HEAD}}>
                    <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/frontFace.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"cover"}}/>
                  </div>
                  <div className="d-flex ms-3 flex-column justify-content-center align-items-center" style={{width:WIDTH_NAME}}>
                    <span className="mc-color text-capitalize" style={{fontSize:FONT_SIZE}}>{t('full name')}</span>
                    <span className="text-wrap" style={{fontSize:FONT_SIZE}}>{patient.fullName}</span>
                  </div>
                  <div className="d-flex ms-3 flex-column justify-content-center align-items-center" style={{width:WIDTH_ATTRIBUTES}}>
                    <span className="mc-color text-capitalize" style={{fontSize:FONT_SIZE}}>{t('gender')}</span>
                    <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{patient.isEncrypted?deCryptData(encryptKeyDoctor.key,encryptKeyDoctor.iv,JSON.parse(patient.gender).tag,JSON.parse(patient.gender).encrypted):patient.gender}</span>
                  </div>
                  <div className="d-flex ms-3 flex-column justify-content-center align-items-center" style={{width:WIDTH_ATTRIBUTES}}>
                    <span className="mc-color text-capitalize" style={{fontSize:FONT_SIZE}}>{t('date of birth')}</span>
                    <span style={{fontSize:FONT_SIZE}}>{convertISOToVNDateString(toISODateString(new Date(patient.birthday)))}</span>
                  </div>
                  <div className="border-start mx-2 d-flex flex-column align-items-center justify-content-center ps-3">
                    <span className="mc-color fw-bold text-capitalize" style={{fontSize:FONT_SIZE}}>{t(patient['SharePatients.roleOfOwnerDoctor'])}</span>
                    <div className="form-check form-switch d-flex justify-content-center">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        checked={patient['SharePatients.roleOfOwnerDoctor']==='edit'} 
                        value={patient['SharePatients.roleOfOwnerDoctor']} 
                        onChange={e=>{
                          if(e.target.value==='edit') onChangeRoleOfDoctor(patient['SharePatients.idSharedPatient'],patient['SharePatients.idOwnerDoctor'],'view');
                          else onChangeRoleOfDoctor(patient['SharePatients.idSharedPatient'],patient['SharePatients.idOwnerDoctor'],'edit');
                        }}/>
                    </div>
                  </div>
                  <div className="border-start mx-2 d-flex align-items-center justify-content-center">
                    <IconButtonComponent className="btn-outline-danger border-0 h-100 ms-2" icon="delete" onClick={e=>removeSharePatient(patient['SharePatients.idSharedPatient'])} FONT_SIZE_ICON={"30px"} title={t("delete this patient")}/>                 
                  </div>
                </div>
              })
            }
            {
              countPatient > 0 && <div className="d-flex flex-grow-1 justify-content-center mt-3">
                <Pagination 
                  count={Math.ceil(countPatient/PAGE_SIZE) || 0}
                  page={pagePatient}
                  onChange={onChangePagePatient}
                  variant="outlined"
                  color="primary"
                />
              </div>
            }
          </div>
        </fieldset>
      </div>
    </fieldset>
  </div>
}