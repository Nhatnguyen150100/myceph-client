import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../../common/ConfirmComponent.jsx";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import { FONT_SIZE } from "../../../common/Utility.jsx";
import SelectPatientComponent from "../../../component/SelectPatientComponent.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

export default function StatusSetting(props){
  const {t} = useTranslation();
  const clinic = useSelector(state=>state.clinic);
  const dispatch = useDispatch();
  const nav = useNavigate();


  const [arrayStatus,setArrayStatus] = useState([]);
  const [newStatus,setNewStatus] = useState('');
  const [colorStatus,setColorStatus] = useState('#ffffff');
  const [editStatusId,setEditStatusId] = useState('');
  const [editNameStatus,setEditNameStatus] = useState();
  const [editColorStatus,setEditColorStatus] = useState();
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  useEffect(()=>{
    if(clinic.idClinicDefault) getListStatus();
  },[clinic.idClinicDefault])

  const getListStatus = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/statusOfClinic/${clinic.idClinicDefault}`).then(result => {
        setArrayStatus(result.data);
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getListStatus());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const createStatus = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      postToServerWithToken(`/v1/statusOfClinic/${clinic.idClinicDefault}`,{
        nameStatus: newStatus,
        colorStatus: colorStatus
      }).then(result => {
        setArrayStatus(result.data);
        setNewStatus('');
        setColorStatus('#ffffff');
        toast.success(t(result.message));
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>createStatus());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const updateStatus = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      putToServerWithToken(`/v1/statusOfClinic/${clinic.idClinicDefault}`,{
        idStatus: editStatusId,
        nameStatus: editNameStatus,
        colorStatus: editColorStatus
      }).then(result => {
        setArrayStatus(result.data);
        setEditColorStatus('');
        setEditNameStatus('');
        setEditStatusId('');
        toast.success(t(result.message));
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>updateStatus());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const deleteStatus = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      deleteToServerWithToken(`/v1/statusOfClinic/${clinic.idClinicDefault}?idStatus=${editStatusId}`).then(result => {
        setArrayStatus(result.data);
        setEditColorStatus('');
        setEditNameStatus('');
        setEditStatusId('');
        setOpenDeleteConfirm(false);
        toast.success(t(result.message));
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>deleteStatus());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const handleClose = () => {
    setOpenDeleteConfirm(false);
  }

  return <div className="w-100 py-3">
    <div style={{width:"400px"}}>
      <SelectPatientComponent condition={true} showSelectedPatient={false}/>
    </div>
    <h4 className="text-capitalize mc-color mt-1 text-center fw-bold">{t('list status of clinic')}</h4>
    <table className="table table-bordered table-striped text-center rounded my-4">
      <thead className='mc-background text-white text-uppercase'>
        <tr>
          <th className='align-middle mc-heading-middle d-lg-table-cell d-none text-uppercase' style={{fontSize:FONT_SIZE}}>stt</th>
          <th style={{minWidth:"350px",fontSize:FONT_SIZE}}>
            <div className={`d-flex align-items-center justify-content-between border form-control w-100`} >
              <input 
                type="text" 
                disabled={clinic.roleOfDoctor!=='admin'} 
                className="border-0 flex-grow-1 w-100" 
                placeholder={t("Enter new name of status")} 
                onKeyDown={e=>{if(e.key === "Enter") createStatus()}}  
                style={{ outline: "none" }} 
                value={newStatus} 
                onChange={e=>setNewStatus(e.target.value)}
              />
              <span className="material-symbols-outlined mc-color fw-bolder" style={{fontSize:"30px"}}>checklist</span>
            </div>
          </th>
          <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{fontSize:FONT_SIZE,minWidth:"100px"}}>
            <div className={`d-flex flex-column align-items-center justify-content-center`} >
              <span className="text-white fw-bold" style={{fontSize:FONT_SIZE}}>{t("color")}</span>
              <input type="color" disabled={clinic.roleOfDoctor!=='admin'} className="border-0 p-0" style={{ outline: "none" }} value={colorStatus} onChange={e=>setColorStatus(e.target.value)}/>
            </div>
          </th>
          <th className='align-middle mc-heading-middle d-lg-table-cell' style={{fontSize:FONT_SIZE, minWidth:"150px"}}>
            <IconButtonComponent className={`btn-success h-100 ${clinic.roleOfDoctor==='admin' && 'standout'}`} onClick={createStatus} icon="add" FONT_SIZE_ICON={"25px"} title={t("add new status")} disabled={clinic.roleOfDoctor!=='admin'}/>
          </th>
        </tr>
      </thead>
      <tbody>
        {
          arrayStatus?.map((status,index)=>{
            return <tr key={status.id} className='align-middle hover-font-weight' style={{cursor:"pointer"}}>
              <td className="d-lg-table-cell d-none" style={{fontSize:FONT_SIZE}}>
                {index+1}
              </td>
              <td className="d-lg-table-cell d-none" style={{fontSize:FONT_SIZE}}>
                <input 
                  type="text" 
                  className="border-0 flex-grow-1 w-100 py-2 ps-2 rounded" 
                  disabled={editStatusId!==status.id}
                  placeholder={t("Enter new name of status")} 
                  style={{outline: "none",fontSize:FONT_SIZE}}
                  onKeyDown={e=>{if(e.key === "Enter") updateStatus(e)}}  
                  value={editStatusId!==status.id?status.nameStatus:editNameStatus} 
                  onChange={e=>setEditNameStatus(e.target.value)}
                />
              </td>
              <td className="d-lg-table-cell d-none">
                <input type="color" disabled={editStatusId!==status.id} className="border-0" style={{ outline: "none" }} value={editStatusId!==status.id?status.colorStatus:editColorStatus} onChange={e=>setEditColorStatus(e.target.value)}/>
              </td>
              <td className="d-lg-table-cell d-none align-middle" style={{fontSize:FONT_SIZE}}>
                {
                  editStatusId===status.id ?
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    <IconButtonComponent className="btn-outline-danger me-2" icon="delete" FONT_SIZE_ICON={"20px"} onClick={()=>setOpenDeleteConfirm(true)} title={t("save")}/>
                    <IconButtonComponent className="btn-outline-success me-2" icon="done" FONT_SIZE_ICON={"20px"} onClick={()=>updateStatus()} title={t("save")}/>
                    <IconButtonComponent className="btn-outline-danger" icon="close" FONT_SIZE_ICON={"20px"} onClick={()=>{setEditStatusId('');setEditNameStatus('')}} title={t("cancel")}/>
                  </div>
                  :
                  <IconButtonComponent 
                  className="btn-outline-warning" 
                  onClick={e=>{
                    setEditStatusId(status.id);
                    setEditNameStatus(status.nameStatus);
                    setEditColorStatus(status.colorStatus);
                  }} 
                  icon="edit" 
                  FONT_SIZE_ICON={"20px"} 
                  title={t("edit")}
                />
                }
              </td>
            </tr>
          })
        }
      </tbody>
    </table>
    <ConfirmComponent 
      FONT_SIZE={FONT_SIZE}
      open={openDeleteConfirm} 
      title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm delete this status')}</span>} 
      content={
        <div>
          <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('To delete this this status, enter the agree button')}</span>
        </div>
      }
      handleClose={e=>handleClose()} 
      handleSubmit={e=>deleteStatus()}
    />
  </div>
}