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

export default function ServicesSetting(props){
  const {t} = useTranslation();
  const clinic = useSelector(state=>state.clinic);
  const dispatch = useDispatch();
  const nav = useNavigate();


  const [arrayServices,setArrayServices] = useState([]);
  const [newService,setNewService] = useState('');
  const [colorService,setColorService] = useState('#ffffff');
  const [editServiceId,setEditServiceId] = useState('');
  const [editNameService,setEditNameService] = useState();
  const [editColorService,setEditColorService] = useState();
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  useEffect(()=>{
    if(clinic.idClinicDefault) getListServices();
  },[clinic.idClinicDefault])

  const getListServices = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/servicesOfClinic/${clinic.idClinicDefault}`).then(result => {
        setArrayServices(result.data);
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getListServices());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const createService = () =>{
    if(!newService) toast.error(t('Name of service is required'));
    else{
      return new Promise((resolve, reject) =>{
        dispatch(setLoadingModal(true));
        postToServerWithToken(`/v1/servicesOfClinic/${clinic.idClinicDefault}`,{
          nameService: newService,
          colorService: colorService
        }).then(result => {
          setArrayServices(result.data);
          setNewService('');
          setColorService('#ffffff');
          toast.success(t(result.message));
          resolve();
        }).catch((err) => {
          if(err.refreshToken){
            refreshToken(nav,dispatch).then(()=>createService());
          }else{
            toast.error(t(err.message));
          }
          reject(err.message);
        }).finally(() => dispatch(setLoadingModal(false)));
      })
    }
  }

  const updateService = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      putToServerWithToken(`/v1/servicesOfClinic/${clinic.idClinicDefault}`,{
        idService: editServiceId,
        nameService: editNameService,
        colorService: editColorService
      }).then(result => {
        setArrayServices(result.data);
        setEditColorService('');
        setEditNameService('');
        setEditServiceId('');
        toast.success(t(result.message));
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>updateService());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const deleteService = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      deleteToServerWithToken(`/v1/servicesOfClinic/${clinic.idClinicDefault}?idService=${editServiceId}`).then(result => {
        setArrayServices(result.data);
        setEditColorService('');
        setEditNameService('');
        setEditServiceId('');
        toast.success(t(result.message));
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>deleteService());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => {dispatch(setLoadingModal(false));setOpenDeleteConfirm(false);setEditServiceId('');setEditNameService('')});
    })
  }

  const handleClose = () => {
    setOpenDeleteConfirm(false);
  }

  return <div className="w-100 py-3">
    <div style={{width:"400px"}}>
      <SelectPatientComponent condition={true} showSelectedPatient={false}/>
    </div>
    <h4 className="text-capitalize mc-color mt-1 text-center fw-bold">{t('list service of clinic')}</h4>
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
                placeholder={t("Enter new name of service")} 
                onKeyDown={e=>{if(e.key === "Enter") createService()}}  
                style={{ outline: "none" }} 
                value={newService} 
                onChange={e=>setNewService(e.target.value)}
              />
              <span className="material-symbols-outlined mc-color fw-bolder" style={{fontSize:"30px"}}>support_agent</span>
            </div>
          </th>
          <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{fontSize:FONT_SIZE,minWidth:"100px"}}>
            <div className={`d-flex flex-column align-items-center justify-content-center`} >
              <span className="text-white fw-bold" style={{fontSize:FONT_SIZE}}>{t("color")}</span>
              <input type="color" disabled={clinic.roleOfDoctor!=='admin'} className="border-0 p-0" style={{ outline: "none" }} value={colorService} onChange={e=>setColorService(e.target.value)}/>
            </div>
          </th>
          <th className='align-middle mc-heading-middle d-lg-table-cell' style={{fontSize:FONT_SIZE, minWidth:"150px"}}>
            <IconButtonComponent className={`btn-success h-100 ${clinic.roleOfDoctor==='admin' && 'standout'}`} onClick={createService} icon="add" FONT_SIZE_ICON={"25px"} title={t("add new service")} disabled={clinic.roleOfDoctor!=='admin'}/>
          </th>
        </tr>
      </thead>
      <tbody>
        {
          arrayServices?.map((service,index)=>{
            return <tr key={service.id} className='align-middle hover-font-weight' style={{cursor:"pointer"}}>
              <td className="d-lg-table-cell d-none" style={{fontSize:FONT_SIZE}}>
                {index+1}
              </td>
              <td className="d-lg-table-cell d-none" style={{fontSize:FONT_SIZE}}>
                <input 
                  type="text" 
                  className="border-0 flex-grow-1 w-100 py-2 ps-2 rounded" 
                  disabled={editServiceId!==service.id}
                  placeholder={t("Enter new name of service")} 
                  style={{outline: "none",fontSize:FONT_SIZE}}
                  onKeyDown={e=>{if(e.key === "Enter") updateService(e)}}  
                  value={editServiceId!==service.id?service.nameService:editNameService} 
                  onChange={e=>setEditNameService(e.target.value)}
                />
              </td>
              <td className="d-lg-table-cell d-none">
                <input type="color" disabled={editServiceId!==service.id} className="border-0" style={{ outline: "none" }} value={editServiceId!==service.id?service.colorService:editColorService} onChange={e=>setEditColorService(e.target.value)}/>
              </td>
              <td className="d-lg-table-cell d-none align-middle" style={{fontSize:FONT_SIZE}}>
                {
                  editServiceId===service.id ?
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    <IconButtonComponent className="btn-outline-danger me-2" icon="delete" FONT_SIZE_ICON={"20px"} onClick={()=>setOpenDeleteConfirm(true)} title={t("save")}/>
                    <IconButtonComponent className="btn-outline-success me-2" icon="done" FONT_SIZE_ICON={"20px"} onClick={()=>updateService()} title={t("save")}/>
                    <IconButtonComponent className="btn-outline-danger" icon="close" FONT_SIZE_ICON={"20px"} onClick={()=>{setEditServiceId('');setEditNameService('')}} title={t("cancel")}/>
                  </div>
                  :
                  <IconButtonComponent 
                  className="btn-outline-warning" 
                  onClick={e=>{
                    setEditServiceId(service.id);
                    setEditNameService(service.nameService);
                    setEditColorService(service.colorService);
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
    <div className="mb-3 mt-5 d-flex align-items-center justify-content-center w-100 flex-column">
      <div className="d-flex flex-row align-items-center justify-content-center">
        <hr style={{ width: '140px' }} />
        <span className="mx-3 text-primary fst-italic text-center">{t('Note: It is recommended to choose a dark color because when used in the calendar, the information will be displayed better')}</span>
        <hr style={{ width: '140px' }} />
      </div>
    </div>
    <ConfirmComponent 
      FONT_SIZE={FONT_SIZE}
      open={openDeleteConfirm} 
      title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm delete this service')}</span>} 
      content={
        <div>
          <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('To delete this this service, enter the agree button')}</span>
        </div>
      }
      handleClose={e=>handleClose()} 
      handleSubmit={e=>deleteService()}
    />
  </div>
}