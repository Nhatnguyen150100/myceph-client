import { Pagination } from "@mui/material";
import React, { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../common/ConfirmComponent.jsx";
import { deCryptData, encryptData } from "../../common/Crypto.jsx";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { FONT_SIZE, SELECT_PATIENT_MODE, splitAvatar, toISODateString } from "../../common/Utility.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { setCurrentImage } from "../../redux/LibraryImageSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

const PAGE_SIZE = 2;

export default function PatientTreatmentHistory(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);
  const encryptKeySharePatient = useSelector(state=>state.patient.encryptKeySharePatient);
  
  const [consultationDate,setConsultationDate] = useState(toISODateString(new Date()));
  const [performedProcedures,setPerformedProcedures] = useState();
  const [currentStatus,setCurrentStatus] = useState();
  const [page,setPage] = useState(1);
  const [count,setCount] = useState(0);

  const [editHistoryId,setEditHistoryId] = useState();
  const [consultationDateItem,setConsultationDateItem] = useState(toISODateString(new Date()));
  const [performedProceduresItem,setPerformedProceduresItem] = useState();
  const [currentStatusItem,setCurrentStatusItem] = useState();
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  const [listOfHistory,setListOfHistory] = useState([]);
  
  const isEncrypted = patient.currentPatient.isEncrypted;
  const modeKey = useMemo(()=>{
    if(selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT) return encryptKeyDoctor;
    else if(selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) return encryptKeyClinic;
    else return encryptKeySharePatient;
  },[selectPatientOnMode])

  const roleCheck = ((selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor === 'admin') || selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT || patient.currentPatient['SharePatients.roleOfOwnerDoctor']==='edit');

  const deCryptedListHistory = (listOfHistory) => {
    let listOfHistoryDecrypted = [];
    listOfHistory.length > 0 && listOfHistory.forEach(element => {
      listOfHistoryDecrypted.push({
        ...element,
        currentStatus: element.currentStatus ? deCryptData(modeKey.key,modeKey.iv,JSON.parse(element.currentStatus).tag,JSON.parse(element.currentStatus).encrypted) : null,
        performedProcedures: element.performedProcedures ? deCryptData(modeKey.key,modeKey.iv,JSON.parse(element.performedProcedures).tag,JSON.parse(element.performedProcedures).encrypted) : null  
      })
    });
    return listOfHistoryDecrypted;
  }

  useEffect(()=>{
    if(patient.currentPatient.id) getTreatmentHistory();
    else toast.error(t('Current patient not found'));
  },[page,patient.currentPatient])
  
  const getTreatmentHistory = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/treatmentHistory/${patient.currentPatient.id}?page=${page}&pageSize=${PAGE_SIZE}`).then(result => {
        setListOfHistory(isEncrypted?deCryptedListHistory(result.data):result.data);
        setCount(result.count);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getTreatmentHistory());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const createHistory = () => {
    return new Promise((resolve,reject) => {
      let infoHistory = {};
      if(isEncrypted){
        infoHistory = {
          idDoctor: doctor.data.id,
          currentStatus: currentStatus ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,currentStatus)) : null,
          performedProcedures: performedProcedures ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,performedProcedures)) : null,
          consultationDate: consultationDate
        }
      }else infoHistory = {
        idDoctor: doctor.data.id,
        currentStatus: currentStatus,
        performedProcedures: performedProcedures,
        consultationDate: consultationDate
      }
      dispatch(setLoadingModal(true));
      postToServerWithToken(`/v1/treatmentHistory/createHistory/${patient.currentPatient.id}?mode=${props.checkRoleMode}&idDoctor=${doctor?.data.id}`,infoHistory).then(result => {
        setListOfHistory(isEncrypted?deCryptedListHistory(result.data):result.data);
        setCount(result.count);
        setCurrentStatus('');
        setPerformedProcedures('');
        setConsultationDate(toISODateString(new Date()));
        resolve();
        toast.success(t(result.message));
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>createHistory());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const updateHistory = (idHistory) => {
    return new Promise((resolve, reject) => {
      let infoUpdate = {};
      if(isEncrypted){
        infoUpdate = {
          idDoctor: doctor.data.id,
          currentStatus: currentStatusItem ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,currentStatusItem)) : null,
          performedProcedures: performedProceduresItem ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,performedProceduresItem)) : null,
          consultationDate: consultationDateItem
        }
      }else infoUpdate = {
        idDoctor: doctor.data.id,
        currentStatus: currentStatusItem,
        performedProcedures: performedProceduresItem,
        consultationDate: consultationDateItem
      }
      dispatch(setLoadingModal(true));
      putToServerWithToken(`/v1/treatmentHistory/updateHistory/${patient.currentPatient.id}?idHistory=${idHistory}&mode=${props.checkRoleMode}&idDoctor=${doctor?.data.id}&page=${page}&pageSize=${PAGE_SIZE}`,infoUpdate).then(result => {
        setListOfHistory(isEncrypted?deCryptedListHistory(result.data):result.data);
        setCount(result.count);
        setEditHistoryId('');
        toast.success(t(result.message));
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>updateHistory(idHistory));
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const deleteHistory = () => {
    return new Promise((resolve,reject) =>{
      dispatch(setLoadingModal(true));
      deleteToServerWithToken(`/v1/treatmentHistory/deleteHistory/${patient.currentPatient.id}?idHistory=${editHistoryId}&mode=${props.checkRoleMode}&idDoctor=${doctor.data.id}`).then(result => {
        setListOfHistory(isEncrypted?deCryptedListHistory(result.data):result.data);
        setCount(result.count);
        setPage(1)
        toast.warning(t(result.message));
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>deleteHistory());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>{dispatch(setLoadingModal(false));setEditHistoryId('');setOpenDeleteConfirm(false)});
    });
  }

  const onChangePage = (event,value) => {
    setPage(value);
  }

  return <div className="w-100">
    {
      roleCheck && <React.Fragment>
        <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
          <span className="text-uppercase">
            {t('create treatment history')}
          </span>
        </div>
        <div className="container">
          <fieldset className="border row rounded mt-3">
            <legend className="d-flex align-items-center float-none px-0 ms-auto me-2 w-auto">
              <div className="border rounded d-flex align-items-center py-1">
                <span className="px-2 text-capitalize d-md-block d-none text-gray" style={{fontSize:FONT_SIZE}}>
                  {t('consultation date')}:
                </span>
                <fieldset className="border rounded px-1 border-0 " style={{fontSize:"small"}}>
                  <input className="border-0 p-0 form-input" style={{outline:"none"}} type={"date"} value={consultationDate} onChange={e=>setConsultationDate(e.target.value)}/>
                </fieldset>
              </div>
              <IconButtonComponent className="btn-outline-info p-0" onClick={()=>createHistory()} icon="save" FONT_SIZE_ICON={"20px"} title={t("add new treatment history")}/>
            </legend>
            <div className="row">
              <div className="col-sm-6">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-2 float-none px-2 text-uppercase fw-bold'>
                    {t('current status')}
                  </legend>
                  <textarea 
                    value={currentStatus}
                    onChange={e=>setCurrentStatus(e.target.value)}
                    className='border-0 px-2 py-2 rounded px-3 mc-background-color-white' 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}}
                  />
                </fieldset>
              </div>
              <div className="col-sm-6">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-2 float-none px-2 text-uppercase fw-bold'>
                    {t('performed procedures')}
                  </legend>
                  <textarea 
                    value={performedProcedures}
                    onChange={e=>setPerformedProcedures(e.target.value)}
                    className='border-0 px-2 py-2 rounded px-3 mc-background-color-white' 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}}
                  />
                </fieldset>
              </div>
            </div>
          </fieldset>
        </div>
      </React.Fragment>
    }
    <div className="mt-3 d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('list treatment history')}
      </span>
    </div>
    <div className="container">
      {
        listOfHistory?.map((history,index) => {
          return <fieldset className="border row rounded mt-3" key={history.id}>
            <legend className="d-flex align-items-center float-none px-0 ms-auto me-2 w-auto">
              <div className="border rounded d-flex align-items-center py-1">
                <span className="px-2 text-capitalize d-md-block d-none text-gray" style={{fontSize:FONT_SIZE}}>
                  {t('consultation date')}:
                </span>
                <fieldset className="border rounded px-1 border-0 " style={{fontSize:"small"}}>
                  <input 
                    className="border-0 p-0 form-input" 
                    style={{outline:"none"}} 
                    type={"date"} 
                    value={editHistoryId===history.id?toISODateString(new Date(consultationDateItem)):toISODateString(new Date(history.consultationDate))}
                    onChange={e=>{if(editHistoryId===history.id) setConsultationDateItem(e.target.value)}}
                    disabled={editHistoryId!==history.id}
                  />
                </fieldset>
              </div>
              {
                roleCheck && <div className="d-flex justify-content-end align-items-end my-1">
                  {
                    editHistoryId===history.id ?
                    <div className="d-flex flex-row justify-content-end align-items-center">
                      <IconButtonComponent className="btn-outline-danger me-2" icon="delete" onClick={()=>setOpenDeleteConfirm(true)} FONT_SIZE_ICON={"20px"} title={t("delete")}/>
                      <IconButtonComponent className="btn-outline-success me-2" icon="done" onClick={()=>updateHistory(history.id)} FONT_SIZE_ICON={"20px"} title={t("save")}/>
                      <IconButtonComponent className="btn-outline-danger" onClick={()=>setEditHistoryId('')} icon="close" FONT_SIZE_ICON={"20px"} title={t("cancel")}/>
                    </div>
                    :
                    <IconButtonComponent 
                    className="btn-outline-warning" 
                    onClick={e=>{
                      setConsultationDateItem(history.consultationDate);
                      setCurrentStatusItem(history.currentStatus);
                      setPerformedProceduresItem(history.performedProcedures);
                      setEditHistoryId(history.id);
                    }} 
                    icon="edit" 
                    FONT_SIZE_ICON={"20px"} 
                    title={t("edit")}
                  />
                  }
                </div>
              }
            </legend>
            <div className="d-flex flex-column">
              <div className="row mb-3">
                <div className="col-sm-6">
                  <fieldset className='border-0 rounded me-2 w-100'>
                    <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-2 float-none px-2 text-uppercase fw-bold'>
                      {t('current status')}
                    </legend>
                    <textarea 
                      value={editHistoryId===history.id?currentStatusItem:history.currentStatus}
                      onChange={e=>{if(editHistoryId===history.id) setCurrentStatusItem(e.target.value)}}
                      className='border-0 px-2 py-2 rounded px-3 mc-background-color-white' 
                      onKeyDown={e=>{if(e.key === "Enter") updateHistory(history.id) ; if(e.key === "Escape") setEditHistoryId('')}} 
                      style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}}
                      disabled={editHistoryId!==history.id}
                    />
                  </fieldset>
                </div>
                <div className="col-sm-6">
                  <fieldset className='border-0 rounded me-2 w-100'>
                    <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-2 float-none px-2 text-uppercase fw-bold'>
                      {t('performed procedures')}
                    </legend>
                    <textarea
                      value={editHistoryId===history.id?performedProceduresItem:history.performedProcedures}
                      onChange={e=>{if(editHistoryId===history.id) setPerformedProceduresItem(e.target.value)}}
                      onKeyDown={e=>{if(e.key === "Enter") updateHistory(history.id) ; if(e.key === "Escape") setEditHistoryId('')}} 
                      className='border-0 px-2 py-2 rounded px-3 mc-background-color-white' 
                      style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}}
                      disabled={editHistoryId!==history.id}
                    />
                  </fieldset>
                </div>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-start flex-wrap">
                {
                  history.arrayImages?.map(image => {
                    return <img 
                      id={image.id}
                      loading="lazy"
                      alt="img" 
                      className={`rounded mb-2 p-0 transform-hover me-2`} 
                      src={splitAvatar(image.linkImage)} 
                      style={{maxHeight:"132px",cursor:"pointer"}}
                      onClick={()=>dispatch(setCurrentImage(splitAvatar(image.linkImage)))}
                      title={t('Click to see')}
                    />
                  })
                }
              </div>
            </div>
          </fieldset>
        })
      }
    </div>
    <div className="d-flex flex-grow-1 justify-content-center mt-3 mb-5">
      {
        count > 1 && <Pagination 
            count={Math.ceil(count/PAGE_SIZE) || 0}
            page={page}
            onChange={onChangePage}
            variant="outlined"
          color="primary"
        />
      }
    </div>
    <ConfirmComponent 
      FONT_SIZE={FONT_SIZE}
      open={openDeleteConfirm} 
      title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm delete this treatment history')}</span>} 
      content={
        <div>
          <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('Do you want to delete this treatment history?')}</span>
        </div>
      }
      handleClose={e=>setOpenDeleteConfirm(false)} 
      handleSubmit={e=>deleteHistory()}
    />
  </div>
}