import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../../common/ConfirmComponent.jsx";
import { deCryptData, encryptData } from "../../../common/Crypto.jsx";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import TextAreaFieldInput from "../../../common/TextAreaFieldInput.jsx";
import TextFieldInput from "../../../common/TextFieldInput.jsx";
import { FONT_SIZE, FONT_SIZE_BUTTON_ICON, FONT_SIZE_ICON, SELECT_PATIENT_MODE } from "../../../common/Utility.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";


export default function TreatmentPlan(props){
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

  const [plan,setPlan] = useState();
  const [selected,setSelected] = useState(false);
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  const [editPlanId,setEditPlanId] = useState();
  const [planItem,setPlanItem] = useState();
  const [selectedItem,setSelectedItem] = useState();
  
  const [listOfPlan,setListOfPlan] = useState();
  
  const isEncrypted = patient.currentPatient.isEncrypted;
  const modeKey = useMemo(()=>{
    if(selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT) return encryptKeyDoctor;
    else return encryptKeyClinic;
  },[selectPatientOnMode])

  const roleCheck = ((selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor === 'admin') || selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT || patient.currentPatient['SharePatients.roleOfOwnerDoctor']==='edit');

  useEffect(()=>{
    if(patient.currentPatient) getListOfPlan();
  },[patient.currentPatient])

  const deCryptedListPlan = (listOfPlan) => {
    let listOfPlanDecrypted = [];
    listOfPlan.length > 0 && listOfPlan.forEach(element => {
      listOfPlanDecrypted.push({
        ...element,
        plan: element.plan ? deCryptData(modeKey.key,modeKey.iv,JSON.parse(element.plan).tag,JSON.parse(element.plan).encrypted) : null 
      })
    });
    return listOfPlanDecrypted;
  }

  const getListOfPlan = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      getToServerWithToken(`/v1/treatmentPlan/${patient.currentPatient.id}`).then(result => {
        setListOfPlan(isEncrypted?deCryptedListPlan(result.data):result.data);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getListOfPlan());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const createPlan = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      let infoPlan = {};
      if(isEncrypted){
        infoPlan = {
          idDoctor: doctor.data.id,
          plan: plan ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,plan)) : null,
          selected: selected
        }
      }else infoPlan = {
        idDoctor: doctor.data.id,
        plan: plan,
        selected: selected
      }
      postToServerWithToken(`/v1/treatmentPlan/createPlan/${patient.currentPatient.id}`,infoPlan).then(result => {
        setPlan('');
        setSelected(false);
        setListOfPlan(isEncrypted?deCryptedListPlan(result.data):result.data);
        toast.success(t(result.message));
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>createPlan());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }


  const updatePlan = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      let infoUpdate = {};
      if(isEncrypted){
        infoUpdate = {
          idDoctor: doctor.data.id,
          plan: planItem ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,planItem)) : null,
          selected: selectedItem
        }
      }else infoUpdate = {
        idDoctor: doctor.data.id,
        plan: planItem,
        selected: selectedItem
      }
      putToServerWithToken(`/v1/treatmentPlan/updatePlan/${patient.currentPatient.id}?idPlan=${editPlanId}`,infoUpdate).then(result => {
        setListOfPlan(isEncrypted?deCryptedListPlan(result.data):result.data);
        toast.success(t(result.message));
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>updatePlan());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>{dispatch(setLoadingModal(false));setEditPlanId()});
    })
  }

  const deletePlan = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      deleteToServerWithToken(`/v1/treatmentPlan/deletePlan/${patient.currentPatient.id}?idPlan=${editPlanId}`).then(result => {
        setListOfPlan(isEncrypted?deCryptedListPlan(result.data):result.data);
        toast.success(result.message);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>deletePlan());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>{dispatch(setLoadingModal(false));setEditPlanId('');setOpenDeleteConfirm(false)});
    })
  }

  const setSelectedPlan = (idPlan) => {
    const listPlanTemporary = [...listOfPlan];
    for (let index = 0; index < listPlanTemporary.length; index++) {
      const element = listPlanTemporary[index];
      if(element.id!==idPlan){
        element.selected = false;
      }else element.selected = true;
    }
    setListOfPlan(isEncrypted?deCryptedListPlan(listPlanTemporary):listPlanTemporary);
  }

  return <div className="h-100 w-100 d-flex flex-column justify-content-start mt-1">
      {
        roleCheck && 
        <React.Fragment>
          <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
            <span className="text-uppercase">
              {t('create treatment plan')}
            </span>
          </div>
          <div className="container">
            <fieldset className="border row rounded mt-3">
              <legend className="d-flex align-items-center float-none px-0 ms-auto me-2 w-auto">
                <div className="border rounded d-flex align-items-center py-1">
                  <span className="px-2 text-capitalize d-md-block d-none text-gray" style={{fontSize:FONT_SIZE}}>
                    {t('selected')}:
                  </span>
                  <fieldset className="border rounded px-1 border-0 " style={{fontSize:"small"}}>
                    <input className="rounded mt-1 me-1" type="checkbox" style={{height:"15px"}} checked={selected} value={selected} id="checkBox" onChange={e=>setSelected(selected?false:true)}/>
                  </fieldset>
                </div>
                <IconButtonComponent className="btn-outline-info p-0" onClick={()=>createPlan()} icon="save" FONT_SIZE_ICON={"20px"} title={t("add new treatment plan")}/>
              </legend>
              <div className="w-100">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <textarea 
                    placeholder={t('Enter new plan')}
                    className='border-0 px-2 py-2 rounded px-3 mc-background-color-white' 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}}
                    value={plan}
                    onChange={e=>setPlan(e.target.value)}
                  />
                </fieldset>
              </div>
            </fieldset>
          </div>
        </React.Fragment>
      }
      <div className="mt-3 d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
        <span className="text-uppercase">
          {t('list of plan')}
        </span>
      </div>
      <div className="container">
        {
          listOfPlan?.map((plan,index) => {
            return <fieldset className="border row rounded mt-3" key={plan.id}>
              <legend className="d-flex align-items-center float-none px-0 ms-auto me-2 w-auto">
                <div className="border rounded d-flex align-items-center py-1">
                  <span className="px-2 text-capitalize d-md-block d-none text-gray" style={{fontSize:FONT_SIZE}}>
                    {t('selected')}:
                  </span>
                  <fieldset className="border rounded px-1 border-0 " style={{fontSize:"small"}}>
                    <input 
                      className="rounded mt-1 me-1" 
                      type="checkbox" 
                      checked={editPlanId===plan.id?selectedItem:plan.selected}
                      style={{height:"15px"}} 
                      onChange={e=>{if(editPlanId===plan.id){
                        setSelectedItem(true);
                        setSelectedPlan(plan.id);
                      }}}
                      value={editPlanId===plan.id?selectedItem:plan.selected} 
                      id="checkBox"
                      disabled={editPlanId!==plan.id || selectedItem || plan.selected}
                    />
                  </fieldset>
                </div>
                {
                  roleCheck && <div className="d-flex justify-content-end align-items-end my-1">
                    {
                      editPlanId===plan.id ?
                      <div className="d-flex flex-row justify-content-end align-items-center">
                        <IconButtonComponent className="btn-outline-danger me-2" icon="delete" onClick={()=>setOpenDeleteConfirm(true)} FONT_SIZE_ICON={"20px"} title={t("save")}/>
                        <IconButtonComponent className="btn-outline-success me-2" icon="done" onClick={()=>updatePlan()} FONT_SIZE_ICON={"20px"} title={t("save")}/>
                        <IconButtonComponent className="btn-outline-danger" onClick={()=>{setEditPlanId('');getListOfPlan()}} icon="close" FONT_SIZE_ICON={"20px"} title={t("cancel")}/>
                      </div>
                      :
                      <IconButtonComponent 
                      className="btn-outline-warning" 
                      onClick={e=>{
                        setPlanItem(plan.plan);
                        setSelectedItem(plan.selected);
                        setEditPlanId(plan.id)
                      }} 
                      icon="edit" 
                      FONT_SIZE_ICON={"20px"} 
                      title={t("edit")}
                    />
                    }
                  </div>
                }
              </legend>
              <div className="w-100">
                <fieldset className='border-0 rounded me-2 w-100'>
                  <legend style={{ fontSize: '1rem'}} className='w-auto mb-0 ms-2 float-none px-2 text-uppercase fw-bold'>
                    {t('treatment plan')}{' '}{index+1}
                  </legend>
                  <textarea 
                    onKeyDown={e=>{if(e.key === "Enter") updatePlan(plan.id) ; if(e.key === "Escape"){setEditPlanId('');getListOfPlan()}}} 
                    value={editPlanId===plan.id?planItem:plan.plan}
                    onChange={e=>{if(editPlanId===plan.id) setPlanItem(e.target.value)}}
                    className='border-0 px-2 py-2 rounded px-3' 
                    style={{ width:'100%',height:'100%',outline:'none',fontSize:FONT_SIZE}} 
                    disabled={editPlanId!==plan.id}
                  />
                </fieldset>
              </div>
            </fieldset>
          })
        }
      </div>
      <ConfirmComponent 
      FONT_SIZE={FONT_SIZE}
      open={openDeleteConfirm} 
      title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm delete this treatment plan')}</span>} 
      content={
        <div>
          <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('To delete this treatment plan, enter the agree button')}</span>
        </div>
      }
      handleClose={e=>setOpenDeleteConfirm(false)} 
      handleSubmit={e=>deletePlan()}
    />
  </div>
}