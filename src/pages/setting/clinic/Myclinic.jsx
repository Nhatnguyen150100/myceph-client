import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../../common/ConfirmComponent.jsx";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import TextFieldInput from "../../../common/TextFieldInput.jsx";
import UploadImage from "../../../common/UploadImage.jsx";
import { AVATAR_HEIGHT, AVATAR_WIDTH, convertISOToVNDateString, deleteImage, findObjectFromArray, FONT_SIZE, FONT_SIZE_BUTTON_ICON, FONT_SIZE_ICON, isValidEmail, splitAvatar, splitPublic_id, toISODateString, upLoadImage, WIDTH_HEAD } from "../../../common/Utility.jsx";
import SelectPatientComponent from "../../../components/SelectPatientComponent.jsx";
import { setArrayClinic, setIdClinicDefault, setRoleOfDoctor } from "../../../redux/ClinicSlice.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";


export default function Myclinic(props){
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic);
  const [image,setImage] = useState('');
  const [newAvatarUrl,setNewAvatarUrl] = useState();
  const [editMode,setEditMode] = useState(false);
  const [newClinic,setNewClinic] = useState();

  const [nameClinic,setNameClinic] = useState();
  const [emailClinic,setEmailClinic] = useState();
  const [phoneNumberClinic,setPhoneNumberClinic] = useState();
  const [avatarClinic,setAvatarClinic] = useState();
  
  const [publicIdAvatar,setPublicIdAvatar] = useState();
  const [addressClinic,setAddressClinic] = useState();
  const [description,setDescription] = useState();

  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);
  
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(()=>{
    if(clinic.idClinicDefault) getInformation();
    else getAllClinicAndSetDefault(true)
  },[clinic.idClinicDefault]);

  const getInformation = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/clinic/getInformationClinic/${clinic.idClinicDefault}`).then(result => {
        setNameClinic(result.data.nameClinic);
        setEmailClinic(result.data.emailClinic);
        setPhoneNumberClinic(result.data.phoneNumberClinic);
        setAddressClinic(result.data.addressClinic);
        setDescription(result.data.description);
        setAvatarClinic(splitAvatar(result.data.avatarClinic,'/assets/images/clinic.png'));
        setPublicIdAvatar(splitPublic_id(result.data.avatarClinic));
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

  const createClinic = () =>{
    if(!newClinic){
      toast.error(t('Name of clinic is required'));
    }else{
      return new Promise((resolve, reject) =>{
        dispatch(setLoadingModal(true));
        postToServerWithToken(`/v1/clinic/createClinic/${doctor.id}`,{
          nameClinic: newClinic
        }).then(result => {
          dispatch(setIdClinicDefault(result.idClinic));
          dispatch(setRoleOfDoctor('admin'));
          setNewClinic('');
          toast.success(t(result.message))
          getAllClinicAndSetDefault(false).then(()=>resolve());
        }).catch((err) => {
          if(err.refreshToken){
            refreshToken(nav,dispatch).then(()=>createClinic());
          }else{
            toast.error(t(err.message));
          }
          reject(err.message);
        }).finally(() => dispatch(setLoadingModal(false)))
      });
    }
  }

  const onCancel = () => {
    for (const indexClinic of clinic.arrayClinic) {
      if(indexClinic.id === clinic.idClinicDefault){
        setNameClinic(indexClinic.nameClinic);
        setEmailClinic(indexClinic.emailClinic);
        setPhoneNumberClinic(indexClinic.phoneNumberClinic);
        setAddressClinic(indexClinic.addressClinic);
        setDescription(indexClinic.description);
        setDescription(indexClinic.description);
      }
    }
    setImage('');
    setNewAvatarUrl('');
    setEditMode(false);
  }

  const onDeleteHandle = () =>{
    setOpenDeleteConfirm(true);
  }

  const deleteClinic = (idClinicCheck) => {
    if(idClinicCheck===clinic.idClinicDefault){
      setOpenDeleteConfirm(false);
      return new Promise((resolve, reject) =>{
        dispatch(setLoadingModal(true));
        deleteToServerWithToken(`/v1/clinic/deleteClinic/${clinic.idClinicDefault}`).then((result) => {
          toast.warning(t(result.message));
          setOpenDeleteConfirm(false);
          setEditMode(false);
          getAllClinicAndSetDefault(true).then(()=>resolve());
        }).catch((err) => {
          if(err.refreshToken){
            refreshToken(nav,dispatch).then(()=>deleteClinic(idClinicCheck));
          }else{
            toast.error(t(err.message));
          }
          reject(err.message);
        }).finally(() => dispatch(setLoadingModal(false)));
      })
    }else{
      toast.error(t('id clinic not match'))
    }    
  }

  const pushDataToServer = (avatar) =>{
    putToServerWithToken(`/v1/clinic/updateInformationClinic/${clinic.idClinicDefault}`,{
      nameClinic: nameClinic,
      emailClinic: emailClinic,
      phoneNumberClinic: phoneNumberClinic,
      avatarClinic: avatar,
      addressClinic: addressClinic,
      description: description,
    }).then(() => {
      let promise1;
      if(findObjectFromArray(clinic.arrayClinic,clinic.idClinicDefault)?.nameClinic !== nameClinic){
        promise1 = new Promise((resolve, reject) => {
          getToServerWithToken(`/v1/doctor/getAllClinicFromDoctor/${doctor?.id}`).then(result => {
            dispatch(setArrayClinic(result.data));
            resolve();
          }).catch(error=>{
            toast.error(t(error));
            reject();
          })
        })
      }
      let promise2 = new Promise((resolve, reject) =>{
        getInformation().then(()=>{
          resolve();
        }).catch((error) =>{
          toast.error(t(error));
          reject();
        })
      })
      Promise.all([promise1,promise2]).then(()=>setEditMode(false)).catch(error =>toast.error(t(error)));
    }).catch((err) => {
      if(err.refreshToken){
        refreshToken(nav,dispatch).then(()=>pushDataToServer(avatar));
      }else{
        toast.error(t(err.message));
      }
    }).finally(() => dispatch(setLoadingModal(false)));
  }

  const onUpdate = async () => {
    if(!isValidEmail(emailClinic) && emailClinic) toast.error(t("email is incorrect format"))
    else if(!nameClinic){
      toast.error(t('Name of clinic is required'));
    }
    else{
      dispatch(setLoadingModal(true));
      if(image){
        if(avatarClinic!=='/assets/images/clinic.png'){
          deleteImage(publicIdAvatar).then(async (response) => {
            if(response.data.result==="ok"){
              const responseData = await upLoadImage(image);
              const newAvatar = responseData.data.secure_url + '|' + responseData.data.public_id;
              pushDataToServer(newAvatar);
            }else{
              toast.error(t('update avatar failed'));
              dispatch(setLoadingModal(false))
            }
          })
        }else{
          const responseData = await upLoadImage(image);
          const newAvatar = responseData.data.secure_url + '|' + responseData.data.public_id;
          pushDataToServer(newAvatar);
        }
      }else{
        if(avatarClinic!=='/assets/images/clinic.png'){
          pushDataToServer(clinic.arrayClinic.avatarClinic);
        }else{
          pushDataToServer('');
        }
      }
    }
  }

  const getAllClinicAndSetDefault = (setDefault) => {
    return new Promise((resolve,reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/doctor/getAllClinicFromDoctor/${doctor?.id}`).then(result => {
        if(setDefault){
          let isDefaultAdmin = false;
          result.data.map(clinic => {
            if(clinic.roleOfDoctor==='admin'){
              isDefaultAdmin = true;
              dispatch(setIdClinicDefault(clinic.id));
              dispatch(setRoleOfDoctor(clinic.roleOfDoctor))
            }
          })
          if(!isDefaultAdmin){
            dispatch(setIdClinicDefault(result.data[0]?.id));
            dispatch(setRoleOfDoctor(result.data[0]?.roleOfDoctor))
          }
        }
        if(result.data.length === 0){
          dispatch(setIdClinicDefault(null));
          dispatch(setRoleOfDoctor(null))
        }
        dispatch(setArrayClinic(result.data));
        resolve();
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getAllClinicAndSetDefault(setDefault));
        }else{
          toast.error(t(err.message));
        }
        reject(err);
      }
      ).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const handleClose = () => {
    setOpenDeleteConfirm(false);
  }

  return <div className="d-flex flex-column h-100 py-3">
    <div className="d-flex flex-grow-1 flex-wrap justify-content-between mb-2">
      <div style={{width:"400px"}}>
        <SelectPatientComponent showSelectedPatient={false} condition={true}/>
      </div>
      <div className="d-flex flex-row align-items-end flex-wrap">
        <div className="add-clinic" style={{width:"400px"}}>
          <TextFieldInput className="p-1 me-2" legend={t('add new clinic')} placeholder={t('Name of new clinic')} value={newClinic} onChange={value=>setNewClinic(value)}/>
        </div>
        <div className="full-width-on-mobile d-flex justify-content-center mt-3">
          <IconButtonComponent className="btn-outline-success" styleButton={{height:"50px",width:"50px"}} onClick={createClinic} icon="add" FONT_SIZE_ICON={"40px"} title={t("add clinic")}/>
        </div>
      </div>
    </div>
    {
      clinic.idClinicDefault ? 
      <div className="d-flex flex-column h-100">
        <div className="d-flex flex-row align-items-end justify-content-end w-100">
          <span className="text-capitalize mc-color fw-bold me-2" style={{fontSize:FONT_SIZE}}>{t('update at')}: </span>
          <span className="me-3">{convertISOToVNDateString(toISODateString(new Date(clinic.arrayClinic?.updatedAt?clinic.arrayClinic?.updatedAt:new Date())))}</span>
          {
            editMode ?
            <div>
              <IconButtonComponent className="btn-outline-success me-2" onClick={onUpdate} icon="done" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("save")}/>
              <IconButtonComponent className="btn-outline-danger" onClick={onCancel} icon="close" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("cancel")}/>
            </div>
            :
            <div>
              {
                clinic.roleOfDoctor === 'admin' &&
                <IconButtonComponent className="btn-outline-warning" onClick={e=>setEditMode(true)} icon="edit" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("edit")}/>
              }
            </div>
          }
        </div>
        <div className="d-flex flex-row flex-wrap flex-grow-1 mt-3">
          <div className="border full-width-on-mobile mb-2 position-relative d-flex justify-content-center align-items-center rounded mc-background-color-white rounded" style={{height:AVATAR_HEIGHT,width:AVATAR_WIDTH}}>
            {
              editMode && <UploadImage icon={"photo_camera"} className="position-absolute btn-primary" style={{height:FONT_SIZE_BUTTON_ICON,width:FONT_SIZE_BUTTON_ICON,top:"0px",right:"0px",fontSize:FONT_SIZE}} getUrlImage={value =>setNewAvatarUrl(value)} getImage={value=>setImage(value)}/>
            }
            <img alt="avatar" className="rounded" src={`${editMode?(newAvatarUrl?newAvatarUrl:avatarClinic):avatarClinic}`} style={{height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"cover"}}/>
          </div>
          <div className="d-flex flex-column flex-wrap flex-grow-1 info-clinic" style={{marginLeft:"20px"}}>
            <div className={`d-flex flex-wrap mb-3 ${editMode?'border-bottom':''}`}>
              <label className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('email of clinic')}:</label>
              {
                editMode ? 
                <input className="text-gray btn-hover-bg rounded border-0 flex-grow-1 px-2 py-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={emailClinic} onChange={e=>setEmailClinic(e.target.value)}/>
                :
                <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{emailClinic?emailClinic:t('no data')}</span>
              }
            </div>
            <div className={`d-flex flex-wrap mb-3 ${editMode?'border-bottom':''}`}>
              <label className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('name clinic')}:</label>
              {
                editMode ? 
                <input className="text-gray btn-hover-bg rounded border-0 flex-grow-1 px-2 py-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={nameClinic} onChange={e=>setNameClinic(e.target.value)}/>
                :
                <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{nameClinic?nameClinic:t('no data')}</span>
              }
            </div>
            <div className={`d-flex flex-wrap mb-3 ${editMode?'border-bottom':''}`}>
              <label className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('phone number')}:</label>
              {
                editMode ? 
                <input className="text-gray btn-hover-bg rounded border-0 px-2 py-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE,width:'150px'}} type="number" value={phoneNumberClinic} onChange={e=>setPhoneNumberClinic(e.target.value)}/>
                :
                <span className="text-gray mc-background-color-white px-2 py-1 rounded flex-grow-1" style={{fontSize:FONT_SIZE,width:'150px'}}>{phoneNumberClinic?phoneNumberClinic:t('no data')}</span>
              }
            </div>
            <div className={`d-flex flex-wrap mb-3 ${editMode?'border-bottom':''}`}>
              <label className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('address of clinic')}:</label>
              {
                editMode ? 
                <input className="text-gray btn-hover-bg rounded border-0 d-flex flex-grow-1 px-2 py-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={addressClinic} onChange={e=>setAddressClinic(e.target.value)}/>
                :
                <span className="text-gray mc-background-color-white px-2 py-1 rounded flex-grow-1" style={{fontSize:FONT_SIZE}}>{addressClinic?addressClinic:t('no data')}</span>
              }
            </div>
            <div className={`d-flex flex-wrap ${editMode?'border-bottom':''}`}>
              <label className="text-capitalize mc-color fw-bold" style={{fontSize:FONT_SIZE,width:WIDTH_HEAD}}>{t('description')}:</label>
              {
                editMode ? 
                <textarea className="text-gray btn-hover-bg rounded border-0 d-flex flex-grow-1 px-2 py-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:FONT_SIZE}} value={description} onChange={e=>setDescription(e.target.value)}/>
                :
                <span className="text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:FONT_SIZE}}>{description?description:t('no data')}</span>
              }
            </div>
          </div>
        </div>
      </div>
      :
      <div className="d-flex justify-content-center flex-column align-items-center h-100">
        <img className="text-capitalize" src="/assets/images/notFound.png" height={"150px"} alt={t("can't found your clinic")} />
        <span className="text-danger text-capitalize mt-2">{t("can't found your clinic")}</span>
      </div>
    }
    <div className="my-3 d-flex align-items-center justify-content-center w-100 flex-column">
      <div className="d-flex flex-row align-items-center justify-content-center">
        <hr className="hr-line" style={{ width: '140px' }} />
        <span className="mx-3 text-nowrap mc-color fw-bold text-uppercase text-center">{t('my clinic')}</span>
        <hr className="hr-line" style={{ width: '140px' }} />
      </div>
      {
        editMode && clinic.roleOfDoctor==='admin' && <button type="button" className="btn btn-outline-danger mt-2 d-flex flex-row align-items-center justify-content-center" onClick={onDeleteHandle}>
          <span className="material-symbols-outlined me-2">
            delete
          </span>
          <span className="fw-bold text-uppercase">{t('delete clinic')}</span>
        </button>
      }
    </div>
    <ConfirmComponent 
      FONT_SIZE={FONT_SIZE}
      open={openDeleteConfirm} 
      title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm delete this clinic')}</span>} 
      content={
        <div>
          <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('To delete this clinic, enter the id clinic')}</span>
          <span style={{fontSize:FONT_SIZE}} className="text-danger fw-bold">{clinic.idClinicDefault}</span>
          <span className="ms-1" style={{fontSize:FONT_SIZE}}>{t('in the box below and press agree')}</span>
        </div>
      } 
      label={t('Id clinic')}
      handleClose={handleClose} 
      handleSubmit={value=>deleteClinic(value)}
    />
  </div>
}