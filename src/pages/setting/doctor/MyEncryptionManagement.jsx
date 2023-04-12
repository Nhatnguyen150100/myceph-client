import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../../common/ConfirmComponent.jsx";
import { addData, DB_ENCRYPTION_DOCTOR, deleteData, disConnectIndexDB, getData, onOpenIndexDB } from "../../../common/ConnectIndexDB.jsx";
import { deCryptData, encryptData, generateIvForEncryption, generateKeyForEncryption } from "../../../common/Crypto.jsx";
import { FONT_SIZE, removeVietnameseDiacritics } from "../../../common/Utility.jsx";
import { setDataDoctor, setEncryptKeyDoctor } from "../../../redux/DoctorSlice.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

export default function MyEncryptionManagement(props){
  const {t} = useTranslation();
  const doctor = useSelector(state=>state.doctor.data);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);
  const dispatch = useDispatch();
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const nav = useNavigate();

  const [indexDB,setIndexDB] = useState(null);
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  useEffect(()=>{
    onOpenIndexDB(DB_ENCRYPTION_DOCTOR).then(db=>setIndexDB(db)).catch(error => toast.error(error));
    return () => {
      disConnectIndexDB(indexDB);
    }
  },[])

  useEffect(()=>{
    onGetInformationDoctor();
  },[])

  const getEncryptionKeyInIndexDB = () => {
    if(indexDB) getData(indexDB,doctor.id,DB_ENCRYPTION_DOCTOR).then(data => 
      dispatch(setEncryptKeyDoctor({key: data.key, iv: data.iv}))
    ).catch(error => toast.error(t(error)));
    else toast.error(t('Can not connect to indexDB'));
  }

  const generateEncryptionKey = () => {
    const key = generateKeyForEncryption();
    const iv = generateIvForEncryption();
    const encryptionKey = {
      id: doctor.id,
      key: key,
      iv: iv
    }
    deleteEncryptionKey();
    if(indexDB) addData(indexDB,encryptionKey,DB_ENCRYPTION_DOCTOR).then(() => {
      getEncryptionKeyInIndexDB();
      onSetEncryptionKeyForDoctor();
    }).catch(error => toast.error(t(error)));
    else toast.error(t('Can not connect to the indexDB'));
  }

  const onGetInformationDoctor = () => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/doctor/${doctor.id}`).then(result => {
        dispatch(setDataDoctor(result.data));
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onGetInformationDoctor());
        }else{
          toast.error(err.message);
        }
        reject();
      })
    })
  }

  const onSetEncryptionKeyForDoctor = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      postToServerWithToken(`/v1/encryption/encryptionForDoctor/${doctor.id}`).then(result => {
        dispatch(setDataDoctor(result.data));
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onSetEncryptionKeyForDoctor());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)))
    })
  }

  const upLoadFileJson = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      const data = JSON.parse(e.target.result);
      addData(indexDB,data,DB_ENCRYPTION_DOCTOR).then(message => {
        dispatch(setEncryptKeyDoctor({key: data.key, iv: data.iv}));
        onSetEncryptionKeyForDoctor().then(()=> toast.success(t(message)));
      }).catch(error => toast.error(t(error)));
    };
  }

  const downLoadFileJson = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({...encryptKeyDoctor,...{id: doctor.id}})
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `crypto_Key_For_Doctor_${removeVietnameseDiacritics(doctor.fullName)}.json`;
    link.click();
  };

  const onDeleteEncryptionKeyFromDoctor = () => {
    return new Promise((resolve, reject) => {
      setOpenDeleteConfirm(false);
      dispatch(setLoadingModal(true));
      deleteToServerWithToken(`/v1/encryption/encryptionForDoctor/${doctor.id}`).then(result => {
        dispatch(setDataDoctor(result.data));
        deleteEncryptionKey();
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onDeleteEncryptionKeyFromDoctor());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)))
    })
  }

  const deleteEncryptionKey = () => {
    if(indexDB) deleteData(indexDB,doctor.id,DB_ENCRYPTION_DOCTOR).then(message => {
      setOpenDeleteConfirm(false);
      dispatch(setEncryptKeyDoctor(null));
      toast.success(t(message));
    }).catch(error => toast.error(t(error)));
    else toast.error(t('Can not connect to the indexDB'));
  }

  return <div className="h-100 d-flex flex-column justify-content-start align-items-center">
    <fieldset className='w-100 border rounded p-2 mt-1 d-flex justify-content-center'>
      <legend style={{ fontSize: '1.5rem'}} className="w-auto float-none px-2 text-capitalize mc-color fw-bold">
        {t('doctor\'s encryption key management')}
      </legend>
      {
        doctor.encryptionKey ?
        <div className="d-flex flex-column">
          <div className="d-flex w-100 flex-row justify-content-center align-items-center my-3">
            {
              encryptKeyDoctor ? <button 
                type="button" 
                className="btn btn-outline-secondary py-1 px-2 d-flex align-items-center justify-content-center"
                style={{cursor:"pointer"}}
                onClick={downLoadFileJson}
              >
                <span className="material-symbols-outlined fw-bold " style={{fontSize:"30px"}}>
                  download
                </span>
                <span className="text-capitalize mx-2" style={{cursor:"pointer"}}>{t('download json encryption key')}</span>
              </button>
              :
              <button 
                type="button" 
                className="btn btn-outline-secondary py-1 px-2 d-flex align-items-center justify-content-center"
                style={{cursor:"pointer"}}
              >
                <span className="material-symbols-outlined fw-bold me-2" style={{fontSize:"30px"}}>
                  upload
                </span>
                <label htmlFor="upload_json" className="text-capitalize" style={{cursor:"pointer"}}>{t('upload a encryption key')}</label>
                <input id="upload_json" className="d-none" type={'file'} accept=".json" onChange={upLoadFileJson}/>
              </button>
            }
            <div className="mx-3">
              <hr style={{ width: '100px' }} />
            </div>
            <button 
              type="button" 
              className="btn btn-outline-danger py-1 px-2 d-flex align-items-center justify-content-center"
              onClick={()=>setOpenDeleteConfirm(true)}
            >
              <span className="material-symbols-outlined fw-bold me-2" style={{fontSize:"30px"}}>
                delete
              </span>
              <span className="text-uppercase mx-2">{t('delete encryption key')}</span>
            </button>
          </div>
          <div className="mt-3 w-100 d-flex flex-column justify-content-center align-items-center mb-3">
            <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('Encryption key was generate by')} <span className="mc-color fw-bold fs-5">{doctor?.fullName}</span></span>
            <span className="text-gray my-1" style={{fontSize:FONT_SIZE}}>{t('Encryption key is stored in browser and cannot be recovered if browser is uninstalled.')}</span>
            <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('We strongly advise you to export encryption key to a secured location in your computer so it can be recovered once necessary.')}</span>
          </div>
        </div>
        :
        <div className="d-flex flex-column">
          <div className="d-flex w-100 flex-row justify-content-center align-items-center my-3">
            <button type="button" className="btn btn-outline-secondary py-1 px-2 d-flex align-items-center justify-content-center" onClick={generateEncryptionKey}>
              <span className="material-symbols-outlined fw-bold" style={{fontSize:"30px"}}>
                key
              </span>
              <span className="text-capitalize ms-2">
                {t('create a new encryption key')}
              </span>
            </button>
            <div className="d-flex align-items-center justify-content-center mx-3">
              <hr style={{ width: '50px' }} />
              <span className="mx-3 mc-color fw-bold text-uppercase text-center">{t('or')}</span>
              <hr style={{ width: '50px' }} />
            </div>
            <button 
              type="button" 
              className="btn btn-outline-secondary py-1 px-2 d-flex align-items-center justify-content-center"
              style={{cursor:"pointer"}}
            >
              <span className="material-symbols-outlined fw-bold me-2" style={{fontSize:"30px"}}>
                upload
              </span>
              <label htmlFor="upload_json" className="text-capitalize" style={{cursor:"pointer"}}>{t('upload a encryption key')}</label>
              <input id="upload_json" className="d-none" type={'file'} accept=".json" onChange={upLoadFileJson}/>
            </button>
          </div>
          <div className="mt-3 w-100 d-flex flex-column justify-content-center align-items-center mb-3">
            <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('To encrypt the patient you need to create a private encryption key.')}</span>
            <span className="text-gray my-1" style={{fontSize:FONT_SIZE}}>{t('The encryption key will be saved in your device\'s browser.')}</span>
            <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('We strongly advise you to export encryption key to a secured location in your computer so it can be recovered once necessary.')}</span>
          </div>
        </div>
      }
    </fieldset>
    <ConfirmComponent 
      FONT_SIZE={FONT_SIZE}
      open={openDeleteConfirm} 
      title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm delete encryption key')}</span>} 
      content={
        <div className="d-flex flex-column">
          <span className="fw-bold text-danger fst-italic mb-3" style={{fontSize:FONT_SIZE}}>{t('Warning: if you delete the encryption key, all patients encrypted with the old key will not be able to open it again. Make sure you save it')}</span>
          <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('To delete encryption key, enter the agree button')}</span>
        </div>
      }
      handleClose={e=>setOpenDeleteConfirm(false)} 
      handleSubmit={e=>onDeleteEncryptionKeyFromDoctor()}
    />
  </div>
}