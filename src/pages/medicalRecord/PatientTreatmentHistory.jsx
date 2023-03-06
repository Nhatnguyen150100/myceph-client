import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { FONT_SIZE, SELECT_PATIENT_MODE, toISODateString } from "../../common/Utility.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

export default function PatientTreatmentHistory(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);
  
  const [consultationDate,setConsultationDate] = useState(toISODateString(new Date()));
  const [performedProcedures,setPerformedProcedures] = useState();
  const [currentStatus,setCurrentStatus] = useState();

  const [editPlanId,setEditPlanId] = useState();
  const [consultationDateItem,setConsultationDateItem] = useState(toISODateString(new Date()));
  const [performedProceduresItem,setPerformedProceduresItem] = useState();
  const [currentStatusItem,setCurrentStatusItem] = useState();

  const [listOfHistory,setListOfHistory] = useState([]);

  const roleCheck = ((selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor === 'admin') || selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT || patient.currentPatient['SharePatients.roleOfOwnerDoctor']==='edit');

  useEffect(()=>{
    if(patient.currentPatient.id) getTreatmentHistory();
  },[patient.currentPatient])
  
  const getTreatmentHistory = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/treatmentHistory/${patient.currentPatient.id}`).then(result => {
        setListOfHistory(result.data);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getTreatmentHistory());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const createHistory = () => {
    return new Promise((resolve,reject) => {
      dispatch(setLoadingModal(true));
      postToServerWithToken(`/v1/treatmentHistory/createHistory/${patient.currentPatient.id}`,{
        currentStatus: currentStatus,
        performedProcedures: performedProcedures,
        consultationDate: consultationDate
      }).then(result => {
        setListOfHistory(result.data);
        setCurrentStatus('');
        setPerformedProcedures('');
        setConsultationDate(toISODateString(new Date()));
        resolve();
        toast.success(result.message);
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>createHistory());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const updateHistory = (idHistory) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      putToServerWithToken(`/v1/treatmentHistory/updateHistory/${patient.currentPatient.id}?idHistory=${idHistory}`,{
        idDoctor: doctor.data.id,
        currentStatus: currentStatusItem,
        performedProcedures: performedProceduresItem,
        consultationDate: consultationDateItem
      }).then(result => {
        setListOfHistory(result.data);
        setEditPlanId('');
        toast.success(result.message);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>updateHistory(idHistory));
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const deleteHistory = (idHistory) => {
    return new Promise((resolve,reject) =>{
      dispatch(setLoadingModal(true));
      deleteToServerWithToken(`/v1/treatmentHistory/deleteHistory/${patient.currentPatient.id}?idHistory=${idHistory}`).then(result => {
        setListOfHistory(result.data);
        toast.success(result.message);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>deleteHistory(idHistory));
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
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
                    value={editPlanId===history.id?toISODateString(new Date(consultationDateItem)):toISODateString(new Date(history.consultationDate))}
                    onChange={e=>{if(editPlanId===history.id) setConsultationDateItem(e.target.value)}}
                    disabled={editPlanId!==history.id}
                  />
                </fieldset>
              </div>
              {
                roleCheck && <div className="d-flex justify-content-end align-items-end my-1">
                  {
                    editPlanId===history.id ?
                    <div className="d-flex flex-row justify-content-end align-items-center">
                      <IconButtonComponent className="btn-outline-danger me-2" icon="delete" onClick={()=>deleteHistory(history.id)} FONT_SIZE_ICON={"20px"} title={t("save")}/>
                      <IconButtonComponent className="btn-outline-success me-2" icon="done" onClick={()=>updateHistory(history.id)} FONT_SIZE_ICON={"20px"} title={t("save")}/>
                      <IconButtonComponent className="btn-outline-danger" onClick={()=>setEditPlanId('')} icon="close" FONT_SIZE_ICON={"20px"} title={t("cancel")}/>
                    </div>
                    :
                    <IconButtonComponent 
                    className="btn-outline-warning" 
                    onClick={e=>{
                      setConsultationDateItem(history.consultationDate);
                      setCurrentStatusItem(history.currentStatus);
                      setPerformedProceduresItem(history.performedProcedures);
                      setEditPlanId(history.id);
                    }} 
                    icon="edit" 
                    FONT_SIZE_ICON={"20px"} 
                    title={t("edit")}
                  />
                  }
                </div>
              }
            </legend>
            <div className="row">
              <div className="col-sm-6">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-2 float-none px-2 text-uppercase fw-bold'>
                    {t('current status')}
                  </legend>
                  <textarea 
                    value={editPlanId===history.id?currentStatusItem:history.currentStatus}
                    onChange={e=>{if(editPlanId===history.id) setCurrentStatusItem(e.target.value)}}
                    className='border-0 px-2 py-2 rounded px-3 mc-background-color-white' 
                    onKeyDown={e=>{if(e.key === "Enter") updateHistory(history.id) ; if(e.key === "Escape") setEditPlanId('')}} 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}}
                    disabled={editPlanId!==history.id}
                  />
                </fieldset>
              </div>
              <div className="col-sm-6">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-2 float-none px-2 text-uppercase fw-bold'>
                    {t('performed procedures')}
                  </legend>
                  <textarea
                    value={editPlanId===history.id?performedProceduresItem:history.performedProcedures}
                    onChange={e=>{if(editPlanId===history.id) setPerformedProceduresItem(e.target.value)}}
                    onKeyDown={e=>{if(e.key === "Enter") updateHistory(history.id) ; if(e.key === "Escape") setEditPlanId('')}} 
                    className='border-0 px-2 py-2 rounded px-3 mc-background-color-white' 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}}
                    disabled={editPlanId!==history.id}
                  />
                </fieldset>
              </div>
            </div>
          </fieldset>
        })
      }
    </div>
  </div>
}