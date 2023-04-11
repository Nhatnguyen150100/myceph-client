import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deCryptData } from "../common/Crypto.jsx";
import { computeAge, onDecryptedDataPreview, FONT_SIZE, FONT_SIZE_HEADER, SELECT_PATIENT_MODE, SOFT_WARE_LIST, splitAvatar } from "../common/Utility.jsx";
import { setArrayPatient, setCurrentPatient } from "../redux/PatientSlice.jsx";
import { getToServerWithToken } from "../services/getAPI.jsx";
import { refreshToken } from "../services/refreshToken.jsx";
import SelectClinicComponent from "./SelectClinicComponent.jsx";

let nameSearchTimeout = null;
const FONT_TEXT = '14px';

const SelectPatientComponent = (props) => {
  const {t} = useTranslation();
  const location = useLocation();
  const arrayPatients = useSelector(state=>state.patient.arrayPatients);
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const softWareSelectedTab = useSelector(state=>state.general.softWareSelectedTab);
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const [nameSearch,setNameSearch] = useState('');
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);
  const encryptKeySharePatient = useSelector(state=>state.patient.encryptKeySharePatient);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [previousClinicId,setPreviousClinicId] = useState(clinic.idClinicDefault);
  const [count,setCount] = useState(arrayPatients.length);

  let url = null;

  switch(selectPatientOnMode){
    case SELECT_PATIENT_MODE.MY_PATIENT: url = `/v1/patient/getPatientListForDoctor/${doctor.id}?`;
      break;
    case SELECT_PATIENT_MODE.CLINIC_PATIENT: if(clinic.roleOfDoctor==='admin'){
      url = `/v1/patient/getPatientListForClinic/${clinic.idClinicDefault}?`
    }else url = `/v1/patient/getSharedPatientOfDoctorInClinic/${doctor.id}?idClinic=${clinic.idClinicDefault}&`;
      break;
    case SELECT_PATIENT_MODE.SHARE_PATIENT: url = `/v1/sharePatient/getListSharePatientOfCurrentDoctor/${doctor.id}?`;
      break;
    default: if(SOFT_WARE_LIST.CALENDAR===softWareSelectedTab){
      url = `/v1/patient/getPatientListForClinic/${clinic.idClinicDefault}?`;
    }
  }

  useEffect(()=>{
    if(clinic.idClinicDefault && previousClinicId!==clinic.idClinicDefault && (selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT || SOFT_WARE_LIST.CALENDAR===softWareSelectedTab)) getAllPatient();
  },[clinic.idClinicDefault])    
  
  const onNameSearchChange = e => {
    setNameSearch(e.target.value);
    if (nameSearchTimeout) clearTimeout(nameSearchTimeout);
    nameSearchTimeout = setTimeout(getAllPatient(e.target.value),300);
  }

  /**
   * todo: lấy danh sách bệnh nhân 
   * @param {*} name Tên bệnh nhân cần tìm
   * @returns 
   */
  const getAllPatient = (name) => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`${url}page=${1}&pageSize=${10}&nameSearch=${name?name:''}`).then(result=>{
        dispatch(setArrayPatient(result.data));
        setCount(result.count);
        if(result.count===0 && location.pathname !== '/setting') toast.warning(t('Cannot found patient'));
        if(!currentPatient) dispatch(setCurrentPatient(result.data[0]));
        // chuyển bệnh nhân trong cùng 1 phòng khám thì không bị reset lại currentPatient
        if(clinic.idClinicDefault && (selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT || SOFT_WARE_LIST.CALENDAR===softWareSelectedTab)){
          setPreviousClinicId(clinic.idClinicDefault);
          if(previousClinicId!==clinic.idClinicDefault) dispatch(setCurrentPatient(result.data[0]));
        }
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          reject();
          refreshToken(nav,dispatch).then(()=>getAllPatient(name));
        }else{
          toast.error(err.message);
        }
        reject(err);
      });
    })
  }

  return <div className="d-flex flex-row justify-content-between align-items-center">
    {
      props.showSelectedPatient && <fieldset className="border rounded px-2 d-flex flex-column align-items-center flex-wrap justify-content-sm-center justify-content-center pt-0 pb-1 me-3 mb-2" style={{minWidth:"400px"}}>
        <legend style={{fontSize:FONT_SIZE}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
          {t('select patient')}
        </legend>
        <div className="d-flex flex-row align-items-center w-100">
          <img 
            alt="avatar" 
            className="rounded my-1 p-0 hoverGreenLight me-2" 
            src={`${currentPatient?.['LibraryImagePatients.linkImage']?splitAvatar(currentPatient?.['LibraryImagePatients.linkImage']):'/assets/images/frontFace.png'}`} 
            style={{borderStyle:`${currentPatient?.['LibraryImagePatients.linkImage']?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"55px",width:"50px",objectFit:"contain"}}
          />
          <div className="d-flex flex-column flex-grow-1">
            <div className="dropdown w-100 p-0 m-0">
              <button className="btn btn-hover-bg border-0 p-0 w-100 text-capitalize" onClick={()=>getAllPatient()} type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{fontSize:FONT_SIZE_HEADER,background:"#f7f7f7"}}>
                {currentPatient?.fullName}
              </button>
              <ul className="dropdown-menu w-100">
                <div className="d-flex flex-row w-100 align-items-center mc-background-color-white rounded">
                  <input className="border-0 flex-grow-1 mc-background-color-white rounded p-2" placeholder={t("Enter patient name to search")} style={{fontSize:FONT_TEXT,outline:"none"}} value={nameSearch} onChange={onNameSearchChange}/>
                  <span className="material-symbols-outlined p-0 me-2">
                    person_search
                  </span>
                </div>
                {
                  arrayPatients?.map((patient,index) => {
                    return <button 
                      onClick={e=>{
                        if(patient.isEncrypted && onDecryptedDataPreview(selectPatientOnMode,patient?.gender,encryptKeyDoctor,encryptKeyClinic,encryptKeySharePatient)==='---'){
                          ((selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT && !encryptKeyDoctor) || (selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && !encryptKeyClinic)) ? toast.error(t('You need an encryption key to decrypt patient data')) : toast.error(t('Your encryption key cannot decrypt this patient'))
                        }else dispatch(setCurrentPatient(patient))
                      }} 
                      key={patient.id} 
                      style={{background:`${index%2!==0&&'#f7f7f7'}`}} 
                      type="button" 
                      className="btn btn-hover-bg text-capitalize py-1 m-0 d-flex flex-column flex-grow-1 justify-content-center align-items-center w-100"
                    >
                      <div className="d-flex justify-content-justify-center align-items-center">
                        <span className={`${patient.isEncrypted && onDecryptedDataPreview(selectPatientOnMode,patient?.gender,encryptKeyDoctor,encryptKeyClinic,encryptKeySharePatient)==='---' && 'text-danger'} me-2`}>{patient.fullName}</span>
                        {
                          (patient.isEncrypted && onDecryptedDataPreview(selectPatientOnMode,patient?.gender,encryptKeyDoctor,encryptKeyClinic,encryptKeySharePatient)==='---' && patient.isEncrypted) ? <span className="material-symbols-outlined text-danger mb-1" style={{fontSize:"20px"}}>
                          lock
                          </span>
                          :
                          ''
                        }
                      </div>
                      <div className="d-flex flex-grow-1 flex-row justify-content-between w-100 align-items-center">
                        <div className="w-auto d-flex flex-row align-items-center justify-content-start">
                          <span 
                            className={`text-capitalize fw-bold ${patient?.isEncrypted && onDecryptedDataPreview(selectPatientOnMode,patient?.gender,encryptKeyDoctor,encryptKeyClinic,encryptKeySharePatient)==='---' && 'text-danger'}`} 
                            style={{fontSize:FONT_TEXT}}>{'( '}{t(patient?.isEncrypted?onDecryptedDataPreview(selectPatientOnMode,patient?.gender,encryptKeyDoctor,encryptKeyClinic,encryptKeySharePatient):patient.gender)}{' |'}
                          </span>
                          {
                            patient.isEncrypted ? <>
                              { onDecryptedDataPreview(selectPatientOnMode,patient?.gender,encryptKeyDoctor,encryptKeyClinic,encryptKeySharePatient) !== '---' ? <img className="mx-1" src={`/assets/images/${patient.gender==='male'?'male.png':'female.png'}`} height="15" alt={`${patient.gender==='male'?'male.png':'female.png'}`}/> : <span style={{fontSize:FONT_TEXT}} className='text-danger fw-bold mx-1'>---</span>}
                            </>
                            :
                            <img className="mx-1" src={`/assets/images/${patient.gender==='male'?'male.png':'female.png'}`} height="15" alt={`${patient.gender==='male'?'male.png':'female.png'}`}/>
                          }
                          <span className={`${patient.isEncrypted && onDecryptedDataPreview(selectPatientOnMode,patient?.gender,encryptKeyDoctor,encryptKeyClinic,encryptKeySharePatient)==='---' && 'text-danger'} fw-bold`} style={{fontSize:FONT_TEXT}}>{')'}</span>
                        </div>
                        <span className="text-capitalize fw-bold" style={{fontSize:FONT_TEXT}}>{'( '}{computeAge(patient.birthday).age} {t('age')}{computeAge(patient.birthday).month>0 && (' - '+computeAge(patient.birthday).month+t(' month'))}{' )'}</span>
                      </div>
                    </button>
                  })
                }
                <div className="d-flex flex-grow-1 w-100 border-top">
                  <span className="text-capitalize text-info w-100 text-center mt-2" style={{fontSize:FONT_TEXT}}>{`${count>10?t('only display 10 patients out of total'):''}`+' '+`${count}`+' '+t('patients')}</span>
                </div>
              </ul>
            </div>
            <div className="d-flex flex-grow-1 flex-row justify-content-between w-100 align-items-center">
              <div className="w-auto d-flex flex-row align-items-center justify-content-start">
                <span className="text-capitalize fw-bold" style={{fontSize:FONT_TEXT}}>{'( '}{t((currentPatient?.isEncrypted?onDecryptedDataPreview(selectPatientOnMode,currentPatient?.gender,encryptKeyDoctor,encryptKeyClinic,encryptKeySharePatient):currentPatient?.gender)?.toString())}{' |'}</span>
                <img className="mx-1" src={`/assets/images/${currentPatient?.gender==='male'?'male.png':'female.png'}`} height="15" alt={`${currentPatient?.gender==='male'?'male.png':'female.png'}`}/>
                <span className="fw-bold" style={{fontSize:FONT_TEXT}}>{')'}</span>
              </div>
              <span className="text-capitalize fw-bold" style={{fontSize:FONT_TEXT}}>{'( '}{computeAge(currentPatient?.birthday).age} {t('age')}{computeAge(currentPatient?.birthday).month>0 && (' - '+computeAge(currentPatient?.birthday).month+t(' month'))}{' )'}</span>
            </div>
          </div>
        </div>
      </fieldset>
    }
    <SelectClinicComponent condition={props.condition} />
  </div>
}

export default React.memo(SelectPatientComponent);