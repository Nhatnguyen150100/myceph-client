import { Pagination } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../../common/ConfirmComponent.jsx";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import TextFieldInput from "../../../common/TextFieldInput.jsx";
import { FONT_SIZE, isValidEmail, splitAvatar } from "../../../common/Utility.jsx";
import SelectPatientComponent from "../../../components/SelectPatientComponent.jsx";
import { setOtherEmailDoctor } from "../../../redux/DoctorSlice.jsx";
import { setDoctorSettingTab, setLoadingModal, setSettingTab } from "../../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";
import DoctorRows from "./DoctorRows.jsx";

const PAGE_SIZE = 4;
let nameSearchTimeout = null;
let emailSearchTimeout = null;

export default function MemberOfClinic(props){
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic);
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const [listDoctor,setListDoctor] = useState([]);
  const [nameSearch,setNameSearch] = useState('');
  const [listEmailSearch,setListEmailSearch] = useState([]);
  const [newDoctor,setNewDoctor] = useState();
  const [count,setCount] = useState();
  const [page,setPage] = useState(1);
  const [openConfirm,setOpenConfirm] = useState(false);
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  const [loadingSearch,setLoadingSearch] = useState(false);

  const [idDoctorUpdate,setIdDoctorUpdate] = useState();
  const [roleDoctorUpdate,setRoleDoctorUpdate] = useState();
  const nav = useNavigate();

  const {t} = useTranslation();
  const dispatch = useDispatch();

  useEffect(()=>{
    if(clinic.idClinicDefault) getAllDoctorInClinic();
  },[clinic.idClinicDefault,page])

  const onNameSearchChange = e => {
    setNameSearch(e.target.value);
    if (nameSearchTimeout) clearTimeout(nameSearchTimeout);
    nameSearchTimeout = setTimeout(getAllDoctorInClinic,300,e.target.value);
  }

  const onEmailSearchChange = value => {
    setNewDoctor(value);
    if (emailSearchTimeout) clearTimeout(emailSearchTimeout);
    emailSearchTimeout = setTimeout(getAllEmailSearch,300,value);
  }

  const getAllEmailSearch = (email) => {
    if(!email){
      setListEmailSearch([]);
    }else{
      getToServerWithToken(`/v1/doctor/getAllDoctorFromEmailSearch/${email}?currentEmailDoctor=${doctor.email}`).then(result=>{
        setListEmailSearch(result.data);
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getAllEmailSearch(email));
        }else{
          toast.error(t(err.message));
        }
      })
    }
  }

  const getAllDoctorInClinic = (name) => {
    return new Promise((resolve, reject) =>{
      setLoadingSearch(true);
      getToServerWithToken(`/v1/clinic/getAllDoctorFromClinic/${clinic.idClinicDefault}?page=${page}&pageSize=${PAGE_SIZE}&nameSearch=${name?name:''}&currentEmailDoctor=${doctor.email}`).then(result => {
        setListDoctor(result.data);
        setCount(result.count);
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getAllDoctorInClinic(name));
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() =>setLoadingSearch(false));
    });
  }

  const onChangeRoleOfDoctor = (idDoctor,roleDoctor) => {
    setOpenConfirm(true);
    setIdDoctorUpdate(idDoctor);
    setRoleDoctorUpdate(roleDoctor);
  }

  const onDeleteHandle = (idDoctor) =>{
    setOpenDeleteConfirm(true);
    setIdDoctorUpdate(idDoctor);
  }

  const updateRoleOfDoctor = () => {
    setOpenConfirm(false);
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      putToServerWithToken(`/v1/clinic/updateRoleOfDoctor/${clinic.idClinicDefault}`,{
        idDoctor: idDoctorUpdate,
        roleOfDoctor: roleDoctorUpdate
      }).then(response=>{
        getAllDoctorInClinic().then(()=>{
          setIdDoctorUpdate('');
          setRoleDoctorUpdate('');
        });
        toast.success(t(response.message));
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>updateRoleOfDoctor());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() =>dispatch(setLoadingModal(false)));
    });
  }

  const deleteDoctorFromClinic = (idDoctorCheck) => {
    if(idDoctorUpdate!==idDoctorCheck){
      toast.error(t('id doctor not found'));
    }else{
      setOpenDeleteConfirm(false);
      return new Promise((resolve, reject) =>{
        dispatch(setLoadingModal(true));
        deleteToServerWithToken(`/v1/clinic/deleteDoctorFromClinic/${clinic.idClinicDefault}?idDoctor=${idDoctorUpdate}`).then(response=>{
          getAllDoctorInClinic().then(()=>{
            setIdDoctorUpdate('');
            toast.warning(t(response.message));
          });
          resolve();
        }).catch((err) => {
          if(err.refreshToken){
            refreshToken(nav,dispatch).then(()=>updateRoleOfDoctor());
          }else{
            toast.error(t(err.message));
          }
          reject(err.message);
        }).finally(() =>dispatch(setLoadingModal(false)));
      });
    }
  }

  const addDoctorToClinic = () => {
    return new Promise((resolve, reject) =>{
      if(!isValidEmail(newDoctor)) toast.error(t('email is incorrect format'));
      else{
        dispatch(setLoadingModal(true));
        postToServerWithToken(`/v1/clinic/addDoctorToClinic/${clinic.idClinicDefault}`,{
          email: newDoctor,
          roleOfDoctor: 'member'
        }).then(result=>{
          setNewDoctor('');
          toast.success(t(result.message))
          getAllDoctorInClinic().then(()=>{
            resolve()
          });
        }).catch((err) => {
          if(err.refreshToken){
            refreshToken(nav,dispatch).then(()=>updateRoleOfDoctor());
          }else{
            toast.error(t(err.message));
          }
          reject(err.message);
        }).finally(() =>dispatch(setLoadingModal(false)));
      }
    });
  }

  const onChangePage = (event,value) => {
    setPage(value);
  }

  const handleClose = () => {
    setOpenConfirm(false);
    setOpenDeleteConfirm(false);
  };

  const toOtherDoctorProfile = (email) => {
    dispatch(setOtherEmailDoctor(email));
    dispatch(setSettingTab(0));
    dispatch(setDoctorSettingTab(1));
  }

  return <div className="d-flex flex-column align-items-start justify-content-start h-100 py-3">
    <div className="d-flex flex-row w-100 flex-wrap justify-content-between align-items-center mb-2">
      <div style={{width:"400px"}}>
        <SelectPatientComponent condition={true} showSelectedPatient={false}/>
      </div>
      {
        clinic.roleOfDoctor==='admin' && <div className="d-flex flex-row align-items-end">
          <div className="position-relative" style={{width:"300px"}}>
            <TextFieldInput className="p-1" legend={t('add new doctor to clinic')} placeholder={t('Email of new doctor')} value={newDoctor} onChange={value=>onEmailSearchChange(value)}/>
            <ul className={`position-absolute d-flex flex-grow-1 p-0 w-100 flex-column me-2 bg-white border-start border-end ${listEmailSearch.length>0?'border-bottom':''}`} style={{zIndex:"1"}}>
              {
                listEmailSearch?.map(doctor=>{
                  return <button className="btn btn-hover-bg border-bottom border-0 py-1 px-2 d-flex flex-row align-items-center justify-content-between" type="button" onClick={e=>{setNewDoctor(doctor.email);setListEmailSearch([]);e.preventDefault()}}>
                    <img alt="avatar" className="rounded" src={splitAvatar(doctor.avatar,'/assets/images/doctor.png')} style={{height:"50px",width:"40px",objectFit:"cover"}}/>
                    <div className="d-flex ms-3 flex-column justify-content-center align-items-center">
                      <span className="mc-color" style={{fontSize:FONT_SIZE}}>{doctor.email}</span>
                      <span className="text-capitalize" style={{fontSize:FONT_SIZE}}>{'('}{doctor.fullName?doctor.fullName:t('no data')}{')'}</span>
                    </div>
                    <button type="button" className="btn btn-outline-info border-0 p-0 m-0 text-white-hover" onClick={e=>toOtherDoctorProfile(doctor.email)}>
                      <span className="material-symbols-outlined mt-1 mx-1">
                        info
                      </span>
                    </button>
                  </button>
                })
              }
              {
                listEmailSearch.length===0 && !isValidEmail(newDoctor) && newDoctor && <div className="d-flex justify-content-center flex-row align-items-center h-100 py-2" style={{zIndex:"1"}}>
                  <img className="text-capitalize me-2" src="/assets/images/notFound.png" height={"35px"} alt={t("can't found doctor profile")} />
                  <span className="text-danger text-capitalize mt-2">{t("can't found doctor profile")}</span>
                </div>
              }
            </ul>
          </div>
          <IconButtonComponent className="btn-outline-success ms-2" styleButton={{height:"50px",width:"50px"}} onClick={addDoctorToClinic} icon="add" FONT_SIZE_ICON={"40px"} title={t("add doctor")}/>
        </div>
      }
    </div>
    <div className="h-100 w-100 mt-3">
      <div className="w-100">
        <table className="table table-bordered table-striped text-center rounded">
          <thead className='mc-background text-white text-uppercase'>
            <tr>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none text-uppercase'>stt</th>
              <th className="align-middle name-col" colSpan={2} style={{minWidth:"350px",fontSize:FONT_SIZE}}>
                <div className={`d-flex align-items-center justify-content-between border form-control w-100 h-100`} >
                  <input type="text" className="border-0 flex-grow-1 w-100" placeholder={t("Enter name of doctor to search")} style={{ outline: "none" }} value={nameSearch} onChange={onNameSearchChange}/>
                  <span className="material-symbols-outlined fw-bolder">search</span>
                </div>
              </th>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{minWidth:"170px",fontSize:FONT_SIZE}}>{t("email")}</th>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{fontSize:FONT_SIZE}}>{t("date of birth")}</th>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{maxWidth:"60px",fontSize:FONT_SIZE}}>{t("gender")}</th>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{maxWidth:"50px",fontSize:FONT_SIZE}}>{t("admin")}</th>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{fontSize:FONT_SIZE}}>{t("specialty")}</th>
              <th className='align-middle mc-heading-middle d-lg-table-cell' style={{fontSize:FONT_SIZE}}>{t("action")}</th>             
            </tr>
          </thead>
          <tbody>
            {
              listDoctor.map((doctor, index) => <DoctorRows key={index} stt={index} doctor={doctor} changeRoleOfDoctor={(idDoctor,roleOfDoctor)=>onChangeRoleOfDoctor(idDoctor,roleOfDoctor)} deleteDoctorFromClinic={onDeleteHandle}/>)
            }
          </tbody>
          <tfoot className="align-middle">
            <tr>
              <td colSpan={9} align='center'>
                <div className="d-flex flex-grow-1 justify-content-center">
                <Pagination 
                    count={Math.ceil(count/PAGE_SIZE) || 0}
                    page={page}
                    onChange={onChangePage}
                    variant="outlined"
                    color="primary"
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        {
          loadingSearch && <div className="d-flex flex-grow-1 justify-content-center w-100">
            <div className="spinner-grow"></div>
          </div>
        }
      </div>
      <ConfirmComponent 
        FONT_SIZE={FONT_SIZE}
        open={openDeleteConfirm} 
        title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm remove doctor from clinic')}</span>} 
        content={
          <div>
            <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('To remove this doctor from the clinic, enter the id')}</span>
            <span style={{fontSize:FONT_SIZE}} className="text-danger fw-bold">{idDoctorUpdate}</span>
            <span className="ms-1" style={{fontSize:FONT_SIZE}}>{t('in the box below and press agree')}</span>
          </div>
        } 
        label={t('Id doctor')}
        handleClose={handleClose} 
        handleSubmit={value=>deleteDoctorFromClinic(value)}
      />
      <ConfirmComponent 
        FONT_SIZE={FONT_SIZE}
        open={openConfirm} 
        title={<span className="text-capitalize fw-bold mc-color" style={{fontSize:"20px"}}>{t('confirm change role of doctor')}</span>} 
        content={
          <div>
            <span style={{fontSize:FONT_SIZE}}>{t('Do you want to switch role of doctor from')}</span>
            <span className={`fw-bold text-uppercase ms-1 ${roleDoctorUpdate==='admin'?'text-warning':'text-success'}`} style={{fontSize:FONT_SIZE}}>{roleDoctorUpdate==='admin'?t('member'):t('admin')}</span>
            <span className="mx-1">{t('to')}</span>
            <span className={`fw-bold text-uppercase ${roleDoctorUpdate==='admin'?'text-success':'text-warning'}`} style={{fontSize:FONT_SIZE}}>{roleDoctorUpdate==='admin'?t('admin'):t('member')}</span>
          </div>
        }
        handleClose={handleClose} 
        handleSubmit={updateRoleOfDoctor}
      />
    </div>
    <div className="my-3 d-flex align-items-center justify-content-center w-100 flex-column">
      <div className="d-flex flex-row align-items-center justify-content-center">
        <hr className="hr-line" style={{ width: '140px' }} />
        <span className="mx-3 mc-color fw-bold text-uppercase text-center text-nowrap">{t('member of clinic')}</span>
        <hr className="hr-line" style={{ width: '140px' }} />
      </div>
    </div>
  </div>
}