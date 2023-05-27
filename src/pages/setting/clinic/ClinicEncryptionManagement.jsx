import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../../common/ConfirmComponent.jsx";
import { addData, DB_ENCRYPTION_CLINIC, deleteData, disConnectIndexDB, getData, onOpenIndexDB } from "../../../common/ConnectIndexDB.jsx";
import { generateIvForEncryption, generateKeyForEncryption } from "../../../common/Crypto.jsx";
import { findObjectFromArray, FONT_SIZE } from "../../../common/Utility.jsx";
import SelectPatientComponent from "../../../components/SelectPatientComponent.jsx";
import { setArrayClinic, setEncryptKeyClinic } from "../../../redux/ClinicSlice.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

export default function ClinicEncryptionManagement(props){
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const clinic = useSelector(state=>state.clinic);
  const doctor = useSelector(state=>state.doctor.data);
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const nav = useNavigate();
  
  const [indexDB,setIndexDB] = useState(null);
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  useEffect(()=>{
    onOpenIndexDB(DB_ENCRYPTION_CLINIC).then(db=>setIndexDB(db)).catch(error => toast.error(t(error)));
    return () => {
      disConnectIndexDB(indexDB);
    }
  },[])
  
  useEffect(()=>{
    if(clinic.idClinicDefault){
      getEncryptionKeyInIndexDB();
      getAllClinic();
    }
  },[clinic.idClinicDefault])

  const getAllClinic = () => {
    return new Promise((resolve,reject) =>{
      getToServerWithToken(`/v1/doctor/getAllClinicFromDoctor/${doctor?.id}`).then(result => {
        dispatch(setArrayClinic(result.data));
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getAllClinic());
        }else{
          toast.error(err.message);
        }
        reject(err);
      })
    })
  }

  const getEncryptionKeyInIndexDB = () => {
    if(indexDB) getData(indexDB,clinic.idClinicDefault,DB_ENCRYPTION_CLINIC).then(data => {
      data ? dispatch(setEncryptKeyClinic({key: data.key, iv: data.iv})) : dispatch(setEncryptKeyClinic(null)) 
    })
  }

  const generateEncryptionKey = () => {
    const key = generateKeyForEncryption();
    const iv = generateIvForEncryption();
    const encryptionKey = {
      id: clinic.idClinicDefault,
      key: key,
      iv: iv
    }
    deleteEncryptionKey();
    if(indexDB) addData(indexDB,encryptionKey,DB_ENCRYPTION_CLINIC).then(() => {
      getEncryptionKeyInIndexDB();
      onSetEncryptionKeyForClinic();
    }).catch(error => toast.error(t(error)));
    else toast.error(t('Can not connect to the database'));
  }

  const onSetEncryptionKeyForClinic = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      postToServerWithToken(`/v1/encryption/encryptionForClinic/${clinic.idClinicDefault}`,{
        idDoctor: doctor.id,
        nameDoctor: doctor.fullName,
        emailDoctor: doctor.email
      }).then(result => {
        let arrayClinicIndex = [...clinic.arrayClinic];
        let objectIndex = arrayClinicIndex.findIndex(element => element.id === result.data.id);
        let updatedObject = Object.assign({}, arrayClinicIndex[objectIndex], {encryptedBy: result.data.encryptedBy});
        arrayClinicIndex[objectIndex] = updatedObject;
        dispatch(setArrayClinic(arrayClinicIndex));
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onSetEncryptionKeyForClinic());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)))
    })
  }

  const onDeleteEncryptionKeyFromClinic = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      deleteToServerWithToken(`/v1/encryption/encryptionForClinic/${clinic.idClinicDefault}`).then(result => {
        let arrayClinicIndex = [...clinic.arrayClinic];
        let objectIndex = arrayClinicIndex.findIndex(element => element.id === result.data.id);
        let updatedObject = Object.assign({}, arrayClinicIndex[objectIndex], {encryptedBy: result.data.encryptedBy});
        arrayClinicIndex[objectIndex] = updatedObject;
        dispatch(setArrayClinic(arrayClinicIndex));
        deleteEncryptionKey();
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onDeleteEncryptionKeyFromClinic());
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
      if(data.id === clinic.idClinicDefault) addData(indexDB,data,DB_ENCRYPTION_CLINIC).then(message => {
        dispatch(setEncryptKeyClinic({key: data.key, iv: data.iv}));
        if(clinic.roleOfDoctor === 'admin'){
          onSetEncryptionKeyForClinic().then(()=>toast.success(t(message)));
        }else toast.success(t(message));
      }).catch(error => toast.error(t(error)));
      else toast.warning(t('Oops! it seems that this encryption key does not belong to the current clinic. Please double-check your encryption key'));
    };
  }

  const downLoadFileJson = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({...encryptKeyClinic,...{id: clinic.idClinicDefault}})
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "crypto_Key_For_Clinic.json";
    link.click();
  };

  const deleteEncryptionKey = () => {
    if(indexDB) deleteData(indexDB,clinic.idClinicDefault,DB_ENCRYPTION_CLINIC).then(message => {
      dispatch(setEncryptKeyClinic(null));
      setOpenDeleteConfirm(false);
      toast.success(t(message));
    }).catch(error => toast.error(t(error)));
    else toast.error(t('Can not connect to the database'));
  }

  return <div className="w-100 py-3">
    <div style={{width:"400px"}}>
      <SelectPatientComponent condition={true} showSelectedPatient={false}/>
    </div>
    <fieldset className='w-100 border rounded p-2 mt-1 d-flex justify-content-center'>
      <legend style={{ fontSize: '1.5rem'}} className="w-auto float-none px-2 text-capitalize mc-color fw-bold">
        {t('Clinic\'s encryption key management')}
      </legend>
      {
        findObjectFromArray(clinic.arrayClinic,clinic.idClinicDefault)?.encryptedBy ?
        <div className="d-flex flex-column">
          <div className="d-flex w-100 flex-row justify-content-center align-items-center my-3">
            {
              encryptKeyClinic?
              <React.Fragment>
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
                  <hr style={{ width: '100px' }}/>
                </div>
                <button 
                  type="button" 
                  className="btn btn-outline-danger py-1 px-2 d-flex align-items-center justify-content-center"
                  onClick={()=>setOpenDeleteConfirm(true)}
                >
                  <span className="material-symbols-outlined fw-bold me-2" style={{fontSize:"30px"}}>
                    delete
                  </span>
                  <span className="text-uppercase mx-2">{clinic.roleOfDoctor === 'admin'?t('delete encryption key'):t('remove encryption key from device')}</span>
                </button>
              </React.Fragment>
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
                <input id="upload_json" className="d-none" type={'file'} key={Math.random(0,100000)} accept=".json" onChange={e=>upLoadFileJson(e)}/>
              </button>
            }
          </div>
          <div className="mt-3 w-100 d-flex flex-column justify-content-center align-items-center mb-3">
            <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('Encryption key was generate by admin of')} <span className="mc-color fw-bold fs-5"> {findObjectFromArray(clinic.arrayClinic,clinic.idClinicDefault).nameClinic} : {findObjectFromArray(clinic.arrayClinic,clinic.idClinicDefault)?.encryptedBy.nameDoctor} ({findObjectFromArray(clinic.arrayClinic,clinic.idClinicDefault)?.encryptedBy.emailDoctor})</span></span>
            <span className="text-gray my-1" style={{fontSize:FONT_SIZE}}>{t('Encryption key is stored in browser and cannot be recovered if browser is uninstalled.')}</span>
            <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('We strongly advise you to export encryption key to a secured location in your computer so it can be recovered once necessary.')}</span>
          </div>
        </div>
        :
        <div className="d-flex flex-column">
          <div className="d-flex w-100 flex-row justify-content-center align-items-center my-3">
            {
              clinic.roleOfDoctor === 'admin' && <React.Fragment>
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
              </React.Fragment>
            }
            <button 
              type="button" 
              className="btn btn-outline-secondary py-1 px-2 d-flex align-items-center justify-content-center"
              style={{cursor:"pointer"}}
            >
              <span className="material-symbols-outlined fw-bold me-2" style={{fontSize:"30px"}}>
                upload
              </span>
              <label htmlFor="upload_json" className="text-capitalize" style={{cursor:"pointer"}}>{t('upload a encryption key')}</label>
              <input id="upload_json" className="d-none" type={'file'} key={Math.random(0,100000)} accept=".json" onChange={e=>upLoadFileJson(e)}/>
            </button>
          </div>
          <div className="mt-3 w-100 d-flex flex-column justify-content-center align-items-center  mb-3">
            <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t(`To encrypt the patient you need to ${clinic.roleOfDoctor === 'admin'?'create':'upload'} a private encryption key.`)}</span>
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
      handleSubmit={e=>{
        if(clinic.roleOfDoctor === 'admin') onDeleteEncryptionKeyFromClinic();
        else deleteEncryptionKey();
      }}
    />
  </div>
}