import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { decryptPatientData, encryptPatientData } from "../../common/Crypto.jsx";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { convertISOToVNDateString, FONT_SIZE, onDecryptedDataPreview, SELECT_PATIENT_MODE, SOFT_WARE_LIST, splitAvatar, toISODateString, VIEW_CALENDAR } from "../../common/Utility.jsx";
import { setViewCalendar } from "../../redux/CalendarSlice.jsx";
import { setOtherEmailDoctor } from "../../redux/DoctorSlice.jsx";
import { setDoctorSettingTab, setLoadingModal, setSettingTab, setSoftWareSelectedTab } from "../../redux/GeneralSlice.jsx";
import { setCurrentPatient, setEncryptKeySharePatient, setGetAllPatientClinic, setGetAllPatientDoctor, setSelectPatientOnMode } from "../../redux/PatientSlice.jsx";
import { getToServerWithToken, postToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

const AVATAR_HEIGHT = "90px";
const AVATAR_WIDTH = "90px";

export default function PatientRows(props){
  const {t} = useTranslation();
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const clinic = useSelector(state=>state.clinic);
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);

  const [listOfDoctorSharedPatient,setListOfDoctorSharedPatient] = useState([]);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const getAllDoctorSharedPatient = (idPatient) => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/sharePatient/getDoctorSharedPatient/${idPatient}`).then(result => {
        setListOfDoctorSharedPatient(result.data);
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getAllDoctorSharedPatient(idPatient));
        }else{
          toast.error(err.message);
        }
        reject(err);
      });
    });
  }

  const toOtherDoctorProfile = (email) => {
    nav('/setting');
    dispatch(setOtherEmailDoctor(email));
    dispatch(setSettingTab(0));
    dispatch(setDoctorSettingTab(1));
  }

  const onToSoftWare = (tab) => {
    if(props.selectPatientMode===SELECT_PATIENT_MODE.SHARE_PATIENT && props.patient.isEncrypted) dispatch(setEncryptKeySharePatient({
      key: props.encryptKeyObject.key?props.encryptKeyObject.key:null,
      iv: props.encryptKeyObject.iv?props.encryptKeyObject.iv:null
    }));
    dispatch(setSelectPatientOnMode(props.selectPatientMode));
    dispatch(setSoftWareSelectedTab(tab));
    dispatch(setCurrentPatient(props.patient));
  }
  
  const onSetDataToPatient = (data,isEncrypted) => {
    if(isEncrypted){
      postToServerWithToken(`/v1/encryption/setDataToPatient/${props.patient.id}`,{
        informationData: {...data.informationEncrypted, isEncrypted: isEncrypted},
        intralOralData: data.intralOralEncrypted,
        historyData: data.historyEncrypted,
        extraOralData: data.extraOralEncrypted,
        diagnosisAndTreatmentData: data.diagnosisAndTreatmentEncrypted,
        listOfIssueData: data.listOfIssueEncrypted,
        radiographyData: data.radiographyEncrypted,
        treatmentHistoryData: data.treatmentHistoryEncrypted,
        treatmentPlanData: data.treatmentPlanEncrypted
      }).then(result => {
        if(props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT) dispatch(setGetAllPatientDoctor(true));
        else if(props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) dispatch(setGetAllPatientClinic(true));
        toast.success(t(result.message));
      }).catch(err => toast.error(err));
    }else{
      postToServerWithToken(`/v1/encryption/setDataToPatient/${props.patient.id}`,{
        informationData: {...data.informationDecrypted, isEncrypted: isEncrypted},
        intralOralData: data.intralOralDecrypted,
        historyData: data.historyDecrypted,
        extraOralData: data.extraOralDecrypted,
        diagnosisAndTreatmentData: data.diagnosisAndTreatmentDecrypted,
        listOfIssueData: data.listOfIssueDecrypted,
        radiographyData: data.radiographyDecrypted,
        treatmentHistoryData: data.treatmentHistoryDecrypted,
        treatmentPlanData: data.treatmentPlanDecrypted
      }).then(result => {
        if(props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT) dispatch(setGetAllPatientDoctor(true));
        else if(props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) dispatch(setGetAllPatientClinic(true));
        toast.success(t(result.message));
      }).catch(err => toast.error(err));
    }
  }

  const onEncryptInformationPatient = () => {
    if(!encryptKeyDoctor && props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT){
      toast.error(t('You must have a encryption key to encrypt your patient'));
    }else if(!encryptKeyClinic && props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT){
      toast.error(t('Your clinic must have a encryption key to encrypt your patient'));
    }else{
      return new Promise((resolve, reject) => {
        dispatch(setLoadingModal(true));
        getToServerWithToken(`/v1/encryption/getAllInformationPatient/${props.patient.id}`).then(result => {
          if(props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT){
            const encryptedDataPatient = encryptPatientData(encryptKeyDoctor.key,encryptKeyDoctor.iv,result.data);
            onSetDataToPatient(encryptedDataPatient,true);
            resolve();
          } 
          else if(props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT){
            const encryptedDataPatient = encryptPatientData(encryptKeyClinic.key,encryptKeyClinic.iv,result.data);
            onSetDataToPatient(encryptedDataPatient,true);
            resolve();
          } 
        }).catch(err =>{
          if(err.refreshToken && !isRefresh){
            refreshToken(nav,dispatch).then(()=>onEncryptInformationPatient());
          }else{
            toast.error(err.message);
          }
          reject();
        }).finally(()=>dispatch(setLoadingModal(false)));
      })
    }
  }

  const onDecryptInformationPatient = () => {
    if(!encryptKeyDoctor && props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT){
      toast.error(t('You must have a encryption key to encrypt your patient'));
    }else if(!encryptKeyClinic && props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT){
      toast.error(t('Your clinic must have a encryption key to encrypt your patient'));
    }else{
      return new Promise((resolve, reject) => {
        dispatch(setLoadingModal(true));
        getToServerWithToken(`/v1/encryption/getAllInformationPatient/${props.patient.id}`).then(result => {
          if(props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT){
            const decryptedDataPatient = decryptPatientData(encryptKeyDoctor.key,encryptKeyDoctor.iv,result.data);
            onSetDataToPatient(decryptedDataPatient,false);
            resolve();
          } 
          else if(props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT){
            const decryptedDataPatient = decryptPatientData(encryptKeyClinic.key,encryptKeyClinic.iv,result.data);
            onSetDataToPatient(decryptedDataPatient,false);
            resolve();
          } 
        }).catch(err =>{
          if(err.refreshToken && !isRefresh){
            refreshToken(nav,dispatch).then(()=>onDecryptInformationPatient());
          }else{
            toast.error(err.message);
          }
          reject();
        }).finally(()=>dispatch(setLoadingModal(false)));
      })
    }
  }

  return <tr className={`align-middle hover-font-weight`}>
    <td className={`d-lg-table-cell d-none text-gray`} style={{fontSize:FONT_SIZE}}>
      {props.stt+1}
    </td>
    <td className="d-lg-table-cell d-none" style={{width:"180px",cursor:"pointer"}}>
      <img 
        alt="avatar" 
        className="rounded my-1 p-0 hoverGreenLight" 
        src={`${(props.patient.isEncrypted ? (props.patient['LibraryImagePatients.linkImage'] && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)!=='---'):props.patient['LibraryImagePatients.linkImage'])?splitAvatar(props.patient['LibraryImagePatients.linkImage']):'/assets/images/frontFace.png'}`} 
        style={{borderStyle:`${(props.patient.isEncrypted ? (props.patient['LibraryImagePatients.linkImage'] && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)!=='---'):props.patient['LibraryImagePatients.linkImage'])?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"contain"}}
      />
    </td>
    <td className={`text-gray text-capitalize ${props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---' && 'text-danger'}`}>
      <div className="d-flex align-items-center justify-content-center">
        <span>{props.patient.fullName}</span>
        {
          (props.selectPatientMode===SELECT_PATIENT_MODE.SHARE_PATIENT && props.patient.isEncrypted && !props.encryptKeyObject) ? <span className="material-symbols-outlined text-danger ms-1 mb-1" style={{fontSize:"25px"}}>
          lock
          </span>
          :
          ''
        }
      </div>
    </td>
    <td className={`d-lg-table-cell d-none text-gray ${props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---' && 'text-danger'}`} style={{fontSize:FONT_SIZE}}>
      {(props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---')?'---':convertISOToVNDateString(toISODateString(new Date(props.patient.birthday)))}
    </td>
    <td className={`d-lg-table-cell d-none text-gray text-capitalize ${props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---' && 'text-danger'}`} style={{fontSize:FONT_SIZE}}>
      {props.patient.isEncrypted?t(onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)):t(props.patient.gender)}
    </td>
    <td className={`d-lg-table-cell d-none text-gray ${props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---' && 'text-danger'}`} style={{fontSize:FONT_SIZE}}>
      {props.patient.isEncrypted?onDecryptedDataPreview(props.selectPatientMode,props.patient.note,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject):props.patient.note}
    </td>
    <td className={`d-lg-table-cell`}>
      <div className="d-flex flex-row align-items-center justify-content-center list-software" style={{flexWrap:"nowrap"}}>
        <Link 
          to={`${props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---' ? '' : '/medicalRecord'}`} 
          onClick={()=>{
            if(props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---'){
              ((props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT && !encryptKeyDoctor) || (props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && !encryptKeyClinic) || (props.selectPatientMode===SELECT_PATIENT_MODE.SHARE_PATIENT && !props.encryptKeyObject)) ? toast.error(t('You need an encryption key to decrypt patient data')) : toast.error(t('Your encryption key cannot decrypt this patient'))
            }else{
              onToSoftWare(SOFT_WARE_LIST.MEDICAL_RECORD);
            }
            }} 
          title={t("MedicalRecord")} 
          className="btn btn-outline-info p-1 border-0 me-2 mb-2"
        >
          <img src="/assets/images/MedicalRecord.png" width="34" height="34" alt="MedicalRecord"/>
        </Link>
        <Link 
          to={`${props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---' ? '' : '/libraryImagesManagement'}`} 
          title={t("ImageLibrary")} 
          onClick={()=>{
            if(props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---'){
              ((props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT && !encryptKeyDoctor) || (props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && !encryptKeyClinic) || (props.selectPatientMode===SELECT_PATIENT_MODE.SHARE_PATIENT && !props.encryptKeyObject)) ? toast.error(t('You need an encryption key to decrypt patient data')) : toast.error(t('Your encryption key cannot decrypt this patient'))
            }else{
              onToSoftWare(SOFT_WARE_LIST.IMAGE_LIBRARY);
            }
          }}
          className="btn btn-outline-info p-1 border-0 me-2 mb-2"
        >
          <img src="/assets/images/ImageLibrary.png" width="34" height="34" alt="ImageLibrary"/>
        </Link>
        <Link 
          to={`${props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---' ? '' : '/lateralCeph'}`} 
          title={t("LateralCeph")} 
          className="btn btn-outline-info p-1 border-0 me-2 mb-2 d-none d-lg-block"
          onClick={()=>{
            if(props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---'){
              ((props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT && !encryptKeyDoctor) || (props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && !encryptKeyClinic) || (props.selectPatientMode===SELECT_PATIENT_MODE.SHARE_PATIENT && !props.encryptKeyObject)) ? toast.error(t('You need an encryption key to decrypt patient data')) : toast.error(t('Your encryption key cannot decrypt this patient'))
            }else{
              onToSoftWare(SOFT_WARE_LIST.LATERALCEPH);
            }
          }}
        >
          <img src="/assets/images/LateralCeph.png" width="34" height="34" alt="LateralCeph"/>
        </Link>
        {
          props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT &&
          <Link 
            to={`${props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---' ? '' : '/schedule'}`} 
            title={t("Calendar")}
            className="btn btn-outline-info p-1 border-0 me-2 mb-2" 
            onClick={e=>{
              if(props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---'){
                ((props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT && !encryptKeyDoctor) || (props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && !encryptKeyClinic) || (props.selectPatientMode===SELECT_PATIENT_MODE.SHARE_PATIENT && !props.encryptKeyObject)) ? toast.error(t('You need an encryption key to decrypt patient data')) : toast.error(t('Your encryption key cannot decrypt this patient'))
              }else{
                dispatch(setViewCalendar(VIEW_CALENDAR.BY_PATIENT));
                onToSoftWare(SOFT_WARE_LIST.CALENDAR);
              }
            }}
          >
            <img src="/assets/images/CalendarNew.png" width="34" height="34" alt="Calendar"/>
          </Link>
        }
        <Link 
          to={`${props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---' ? '' : '/discussion'}`} 
          title={t("Discussion")} 
          className="btn btn-outline-info p-1 border-0 me-2 mb-2"
          onClick={()=>{
            if(props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---'){
              ((props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT && !encryptKeyDoctor) || (props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && !encryptKeyClinic) || (props.selectPatientMode===SELECT_PATIENT_MODE.SHARE_PATIENT && !props.encryptKeyObject)) ? toast.error(t('You need an encryption key to decrypt patient data')) : toast.error(t('Your encryption key cannot decrypt this patient'))
            }else{
              onToSoftWare(SOFT_WARE_LIST.DISCUSSION);
            }
          }}
        >
          <img src="/assets/images/Discussion.png" width="34" height="34" alt="Discussion"/>
        </Link>
        {
          props.shareByDoctor && 
          <button 
            type="button" 
            className={`btn btn-outline-info rounded border-0 p-0 mx-1`} 
            title={t('Decryption patient')}
            onClick={()=>{
              props.onShowModal(props.patient);
              if(props.encryptKeyObject) props.onSetEncryptKeySelectedPatient({
                key: props.encryptKeyObject.key?props.encryptKeyObject.key:null,
                iv: props.encryptKeyObject.iv?props.encryptKeyObject.iv:null,
                id: props.encryptKeyObject.id?props.encryptKeyObject.id:null,
              })
            }}
            disabled={!props.patient.isEncrypted}
          >
            <span className={`material-symbols-outlined ${(props.patient.isEncrypted && !props.encryptKeyObject)?'text-danger':'text-success'}`} style={{fontSize:"36px"}}>
              {(props.patient.isEncrypted)?(!props.encryptKeyObject?'key_off':'key'):'lock_open'}
            </span>
          </button>
        }
      </div>
    </td>
    {
      !props.shareByDoctor && <td className={`d-lg-table-cell`}>
        <div className="d-flex flex-row align-items-center justify-content-center flex-wrap">
          <div className="btn-group dropstart">
            <button 
              title={t("Doctors share patient")} 
              onClick={e=>getAllDoctorSharedPatient(props.patient.id)} 
              className="btn btn-outline-info p-1 border-0 me-2 mb-2 rounded d-none d-sm-block" 
              disabled={props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor !=='admin'}
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <img src="/assets/images/Share.png" width="34" height="34" alt="Discussion"/>
            </button>
            <ul className="dropdown-menu w-auto shadow ">
              {
                listOfDoctorSharedPatient.length>0?
                <div className="d-flex flex-column justify-content-center align-items-center w-100 px-3">
                  <span className="text-uppercase fw-bold mc-color border-bottom w-100 text-center mb-1" style={{fontSize:FONT_SIZE}}>{t('list doctors was shared')}</span>
                  {
                    listOfDoctorSharedPatient?.map((doctor, _) => {
                      return <li onClick={e=>toOtherDoctorProfile(doctor.email)} className="btn w-100 d-flex flex-grow-1 flex-column justify-content-center align-items-center btn-primary border-0 px-3 py-1 text-nowrap rounded-pill mx-2 my-1" key={doctor.id}>
                        <span className="text-capitalize"  style={{fontSize:FONT_SIZE}}>{doctor.fullName}</span>
                        <span style={{fontSize:"12px"}}>{'('}{doctor.email}{')'}</span>
                      </li>
                    })
                  }
                </div>
                :
                <strong className="text-center text-capitalize mc-color fw-bold text-nowrap mx-3 my-1">{t('this patient is not shared')}</strong>
              }
            </ul>
            <button 
              type="button" 
              className="btn btn-outline-info rounded border-0 p-0 mb-2 mx-1" 
              title={t('Encryption patient')} 
              onClick={()=>{
                if(props.patient.isEncrypted && onDecryptedDataPreview(props.selectPatientMode,props.patient?.gender,encryptKeyDoctor,encryptKeyClinic,props.encryptKeyObject)==='---'){
                  ((props.selectPatientMode===SELECT_PATIENT_MODE.MY_PATIENT && !encryptKeyDoctor) || (props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && !encryptKeyClinic) || (props.selectPatientMode===SELECT_PATIENT_MODE.SHARE_PATIENT && !props.encryptKeyObject)) ? toast.error(t('You need an encryption key to decrypt patient data')) : toast.error(t('Your encryption key cannot decrypt this patient'))
                }else{
                  props.patient.isEncrypted ? onDecryptInformationPatient() : onEncryptInformationPatient()
                }
              }}
              disabled={props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor !=='admin'}
            >
              <span className={`material-symbols-outlined mt-1 ${props.patient.isEncrypted?'text-danger':'text-success'}`} style={{fontSize:"36px"}}>
                {props.patient.isEncrypted?'lock':'lock_open'}
              </span>
            </button>
          </div>
          <IconButtonComponent className="btn-outline-danger border-0 p-0 mb-1" icon="delete" FONT_SIZE_ICON={"30px"} title={t("delete patient")} disabled={props.selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor!=='admin'} onClick={e=>props.onDeleteHandle(props.patient.id)}/>
        </div>
      </td>
    }
    {
      props.shareByDoctor &&  <td className={`d-lg-table-cell`} style={{fontSize:FONT_SIZE,cursor:"pointer"}}>
        <button onClick={e=>toOtherDoctorProfile(props.patient['Doctor.email'])} type="button" style={{background:"none"}} className="transform-hover btn-hover-bg rounded border-0 d-flex flex-column align-items-center justify-content-center h-100 w-100">
          <strong className="fw-bold mc-color" style={{fontSize:FONT_SIZE}}>{props.patient['Doctor.email']}</strong>
          {
            props.patient['Doctor.fullName'] && <span style={{fontSize:FONT_SIZE}}>{'( '}{props.patient['Doctor.fullName']}{' )'}</span>
          }
        </button>
      </td>
    }
  </tr>
}