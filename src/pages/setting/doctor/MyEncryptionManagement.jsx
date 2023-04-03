import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConfirmComponent from "../../../common/ConfirmComponent.jsx";
import { addData, DB_ENCRYPTION_DOCTOR, deleteData, disConnectIndexDB, getData, onOpenIndexDB } from "../../../common/ConnectIndexDB.jsx";
import { deCryptData, encryptData, generateIvForEncryption, generateKeyForEncryption } from "../../../common/Crypto.jsx";
import { FONT_SIZE } from "../../../common/Utility.jsx";
import { setEncryptKey } from "../../../redux/DoctorSlice.jsx";

export default function MyEncryptionManagement(props){
  const {t} = useTranslation();
  const doctor = useSelector(state=>state.doctor.data);
  const encryptKey = useSelector(state=>state.doctor.encryptKey);
  const dispatch = useDispatch();

  const [indexDB,setIndexDB] = useState(null);
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  useEffect(()=>{
    onOpenIndexDB(DB_ENCRYPTION_DOCTOR).then(db=>setIndexDB(db)).catch(error => toast.error(error));
    return () => {
      disConnectIndexDB(indexDB);
    }
  },[])

  const getEncryptionKeyInIndexDB = () => {
    if(indexDB) getData(indexDB,doctor.id,DB_ENCRYPTION_DOCTOR).then(data => 
      dispatch(setEncryptKey({key: data.key, iv: data.iv}))
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
    if(indexDB) addData(indexDB,encryptionKey,DB_ENCRYPTION_DOCTOR).then(message => {
      getEncryptionKeyInIndexDB();
      toast.success(t(message));
    }).catch(error => toast.error(t(error)));
    else toast.error(t('Can not connect to the indexDB'));
  }

  const upLoadFileJson = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      const data = JSON.parse(e.target.result);
      addData(indexDB,data,DB_ENCRYPTION_DOCTOR).then(message => {
        dispatch(setEncryptKey({key: data.key, iv: data.iv}));
        toast.success(t(message));
      }).catch(error => toast.error(t(error)));
    };
  }

  const downLoadFileJson = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({...encryptKey,...{id: doctor.id}})
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "encryptKey.json";
    link.click();
  };

  const deleteEncryptionKey = () => {
    if(indexDB) deleteData(indexDB,doctor.id,DB_ENCRYPTION_DOCTOR).then(message => {
      setOpenDeleteConfirm(false);
      dispatch(setEncryptKey(null));
      toast.success(t(message));
    }).catch(error => toast.error(t(error)));
    else toast.error(t('Can not connect to the indexDB'));
  }

  return <div className="h-100 d-flex flex-column justify-content-start align-items-center">
    <fieldset className='w-100 border rounded p-2 mt-1 d-flex justify-content-center'>
      <legend style={{ fontSize: '1.5rem'}} className="w-auto float-none px-2 text-capitalize mc-color fw-bold">
        {t('Doctor\'s encryption key management')}
      </legend>
      {
        encryptKey ?
        <div className="d-flex flex-column">
          <div className="d-flex w-100 flex-row justify-content-center align-items-center my-3">
            <button 
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
            <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('Encryption key is stored in browser and cannot be recovered if browser is uninstalled.')}</span>
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
                {t('Create a new encryption key')}
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
            <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('The encryption key will be saved in your device\'s browser.')}</span>
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
      handleSubmit={e=>deleteEncryptionKey()}
    />
  </div>
}