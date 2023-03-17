import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import TextAreaFieldInput from "../../../common/TextAreaFieldInput.jsx";
import TextFieldInput from "../../../common/TextFieldInput.jsx";
import { FONT_SIZE, FONT_SIZE_BUTTON_ICON, FONT_SIZE_ICON, SELECT_PATIENT_MODE } from "../../../common/Utility.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";


export default function Issue(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);

  const [issue,setIssue] = useState();
  const [treatmentObject,setTreatmentObject] = useState();
  const [treatmentMethod,setTreatmentMethod] = useState();
  const [priotized,setPriotized] = useState(false);


  const [editIssueId,setEditIssueId] = useState();
  const [issueItem,setIssueItem] = useState();
  const [treatmentObjectItem,setTreatmentObjectItem] = useState();
  const [treatmentMethodItem,setTreatmentMethodItem] = useState();
  const [priotizedItem,setPriotizedItem] = useState();

  const [listOfIssue,setListOfIssue] = useState();

  const roleCheck = ((selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor === 'admin') || selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT || patient.currentPatient['SharePatients.roleOfOwnerDoctor']==='edit');

  useEffect(()=>{
    if(patient.currentPatient) getListOfIssues();
  },[patient.currentPatient])

  const getListOfIssues = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      getToServerWithToken(`/v1/listOfIssue/${patient.currentPatient.id}`).then(result => {
        setListOfIssue(result.data);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getListOfIssues());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const createIssue = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      postToServerWithToken(`/v1/listOfIssue/createIssue/${patient.currentPatient.id}`,{
        idDoctor: doctor.data.id,
        issue: issue,
        treatmentObject: treatmentObject,
        treatmentMethod: treatmentMethod,
        priotized: priotized
      }).then(result => {
        setIssue('');
        setTreatmentMethod('');
        setTreatmentObject('');
        setPriotized(false);
        setListOfIssue(result.data);
        toast.success(t(result.message));
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>createIssue());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }


  const updateIssue = (idIssue) => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      putToServerWithToken(`/v1/listOfIssue/updateIssue/${patient.currentPatient.id}?idIssue=${idIssue}`,{
        idDoctor: doctor.data.id,
        issue: issueItem,
        treatmentObject: treatmentObjectItem,
        treatmentMethod: treatmentMethodItem,
        priotized: priotizedItem
      }).then(result => {
        setListOfIssue(result.data);
        setEditIssueId();
        toast.success(result.message);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>updateIssue(idIssue));
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const deleteIssue = (idIssue) => {
    if(window.confirm(t('Are you sure you want to delete this issue'))){
      dispatch(setLoadingModal(true));
      return new Promise((resolve, reject) =>{
        deleteToServerWithToken(`/v1/listOfIssue/deleteIssue/${patient.currentPatient.id}?idIssue=${idIssue}`).then(result => {
          setListOfIssue(result.data);
          toast.success(result.message);
          resolve();
        }).catch(err =>{
          if(err.refreshToken && !isRefresh){
            refreshToken(nav,dispatch).then(()=>deleteIssue(idIssue));
          }else{
            toast.error(err.message);
          }
          reject();
        }).finally(()=>dispatch(setLoadingModal(false)));
      })
    }
  }

  return <div className="h-100 w-100 d-flex flex-column justify-content-start mt-1">
    {
      roleCheck && 
      <React.Fragment>
        <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
          <span className="text-uppercase">
            {t('create an issue')}
          </span>
        </div>
        <div className="container">
          <fieldset className="border row rounded mt-3">
            <legend className="d-flex align-items-center float-none px-0 ms-auto me-2 w-auto">
              <div className="border rounded d-flex align-items-center py-1">
                <span className="px-2 text-capitalize d-md-block d-none text-gray" style={{fontSize:FONT_SIZE}}>
                  {t('priotized')}:
                </span>
                <fieldset className="border rounded px-1 border-0 " style={{fontSize:"small"}}>
                  <input className="rounded mt-1 me-1" type="checkbox" style={{height:"15px"}} checked={priotized} value={priotized} id="checkBox" onChange={e=>setPriotized(priotized?false:true)}/>
                </fieldset>
              </div>
              <IconButtonComponent className="btn-outline-info p-0" onClick={()=>createIssue()} icon="save" FONT_SIZE_ICON={"20px"} title={t("add new treatment issue")}/>
            </legend>
            <div className="row">
              <div className="col-sm-4">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-1 float-none px-2 text-uppercase fw-bold'>
                    {t('issue')}
                  </legend>
                  <textarea 
                    value={issue}
                    placeholder={t('Enter Issue')}
                    onKeyDown={e=>{if(e.key === "Enter") createIssue()}} 
                    onChange={e=>setIssue(e.target.value)}
                    className='border-0 px-2 py-2 rounded px-3 mc-background-color-white' 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}}
                  />
                </fieldset>
              </div>
              <div className="col-sm-4">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-1 float-none px-2 text-uppercase fw-bold'>
                    {t('treatment object')}
                  </legend>
                  <textarea 
                    value={treatmentObject}
                    placeholder={t('Enter Treatment Object')}
                    onKeyDown={e=>{if(e.key === "Enter") createIssue()}} 
                    onChange={e=>setTreatmentObject(e.target.value)}
                    className='border-0 px-2 py-2 rounded px-3 mc-background-color-white' 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}}
                  />
                </fieldset>
              </div>
              <div className="col-sm-4">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-1 float-none px-2 text-uppercase fw-bold'>
                    {t('treatment method')}
                  </legend>
                  <textarea 
                    value={treatmentMethod}
                    placeholder={t('Enter Treatment Method')}
                    onKeyDown={e=>{if(e.key === "Enter") createIssue()}} 
                    onChange={e=>setTreatmentMethod(e.target.value)}
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
        {t('list of issue')}
      </span>
    </div>
    <div className="container">
      {
        listOfIssue?.map((issue,index) => {
          return <fieldset className="border row rounded mt-3" key={issue.id}>
            <legend className="d-flex align-items-center float-none px-0 ms-auto me-2 w-auto">
              <div className="border rounded d-flex align-items-center py-1">
                <span className="px-2 text-capitalize d-md-block d-none text-gray" style={{fontSize:FONT_SIZE}}>
                  {t('priotized')}:
                </span>
                <fieldset className="border rounded px-1 border-0 " style={{fontSize:"small"}}>
                  <input 
                    className="rounded mt-1 me-1" 
                    type="checkbox" 
                    checked={editIssueId===issue.id?priotizedItem:issue.priotized}
                    style={{height:"15px"}} 
                    onChange={e=>{if(editIssueId===issue.id) setPriotizedItem(priotizedItem?false:true)}}
                    value={editIssueId===issue.id?priotizedItem:issue.priotized} 
                    id="checkBox"
                    disabled={editIssueId!==issue.id}
                  />
                </fieldset>
              </div>
              {
                roleCheck && <div className="d-flex justify-content-end align-items-end my-1">
                  {
                    editIssueId===issue.id ?
                    <div className="d-flex flex-row justify-content-end align-items-center">
                      <IconButtonComponent className="btn-outline-danger me-2" icon="delete" onClick={()=>deleteIssue(issue.id)} FONT_SIZE_ICON={"20px"} title={t("save")}/>
                      <IconButtonComponent className="btn-outline-success me-2" icon="done" onClick={()=>updateIssue(issue.id)} FONT_SIZE_ICON={"20px"} title={t("save")}/>
                      <IconButtonComponent className="btn-outline-danger" onClick={()=>setEditIssueId('')} icon="close" FONT_SIZE_ICON={"20px"} title={t("cancel")}/>
                    </div>
                    :
                    <IconButtonComponent 
                    className="btn-outline-warning" 
                    onClick={e=>{
                      setIssueItem(issue.issue);
                      setTreatmentMethodItem(issue.treatmentMethod);
                      setTreatmentObjectItem(issue.treatmentObject);
                      setPriotizedItem(issue.priotized);
                      setEditIssueId(issue.id)
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
              <div className="col-sm-4">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-2 float-none px-2 text-uppercase fw-bold'>
                    {t('issue')}{' '}{index+1}
                  </legend>
                  <textarea 
                    onKeyDown={e=>{if(e.key === "Enter") updateIssue(issue.id) ; if(e.key === "Escape") setEditIssueId('')}} 
                    value={editIssueId===issue.id?issueItem:issue.issue}
                    onChange={e=>{if(editIssueId===issue.id) setIssueItem(e.target.value)}}
                    className='border-0 px-2 py-2 rounded px-3' 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}} 
                    disabled={editIssueId!==issue.id}
                  />
                </fieldset>
              </div>
              <div className="col-sm-4">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-2 float-none px-2 text-uppercase fw-bold'>
                    {t('treament object')}{' '}{index+1}
                  </legend>
                  <textarea
                    onKeyDown={e=>{if(e.key === "Enter") updateIssue(issue.id) ; if(e.key === "Escape") setEditIssueId('')}} 
                    value={editIssueId===issue.id?treatmentObjectItem:issue.treatmentObject}
                    onChange={e=>{if(editIssueId===issue.id) setTreatmentObjectItem(e.target.value)}}
                    className='border-0 px-2 py-2 rounded px-3' 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}} 
                    disabled={editIssueId!==issue.id}
                  />
                </fieldset>
              </div>
              <div className="col-sm-4">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-2 float-none px-2 text-uppercase fw-bold'>
                    {t('treatment method')}{' '}{index+1}
                  </legend>
                  <textarea
                    onKeyDown={e=>{if(e.key === "Enter") updateIssue(issue.id) ; if(e.key === "Escape") setEditIssueId('')}} 
                    value={editIssueId===issue.id?treatmentMethodItem:issue.treatmentMethod}
                    onChange={e=>{if(editIssueId===issue.id) setTreatmentMethodItem(e.target.value)}}
                    className='border-0 px-2 py-2 rounded px-3' 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}} 
                    disabled={editIssueId!==issue.id}
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