import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import SelectFieldInput from "../../common/SelectFieldInput.jsx";
import TextFieldInput from "../../common/TextFieldInput.jsx";
import { FONT_SIZE, FONT_SIZE_HEAD, toISODateString, WIDTH_CHILD } from "../../common/Utility.jsx";
import NavbarComponent from "../../component/NavbarComponent.jsx";
import SelectPatientComponent from "../../component/SelectPatientComponent.jsx";
import { setAppName, setLoadingModal, setpatientListTab } from "../../redux/GeneralSlice.jsx";
import { setGetAllPatientClinic, setGetAllPatientDoctor } from "../../redux/PatientSlice.jsx";
import { postToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";
import MyPatient from "./MyPatient.jsx";
import MySharedPatient from "./MySharedPatient.jsx";
import PatientOfClinic from "./PatientOfClinic.jsx";
import SharePatientSettingForClinic from "./SharePatientSettingForClinic.jsx";
import SharePatientSettingForDoctor from "./SharePatientSettingForDoctor.jsx";

export default function PatientList(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic);
  const selectedTab = useSelector(state=>state.general.patientListTab);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const nav = useNavigate();

  const [newPatientName,setNewPatientName] = useState('');
  const [newPatientBirthday,setNewPatientBirthday] = useState(toISODateString(new Date()));
  const [newGenderPatient,setNewGenderPatient] = useState('male');
  const [newNotePatient,setNewNotePatient] = useState('');
  
  let currentTab = 0;

  useEffect(()=>{
    if(!doctor?.id) nav('/login');
  },[])

  const addNewPatient = () => {
    if(!newPatientName) toast.error(t('Name of patient is required'))
    else if(new Date(newPatientBirthday)>=new Date()) toast.error(t('Date of birth cannot be greater than the current date'))
    else return new Promise((resolve, reject) => {
      let patientObject = null;
      if(selectedTab===0){
        patientObject = {
          fullName: newPatientName,
          birthday: newPatientBirthday,
          gender: newGenderPatient,
          note: newNotePatient,
          idDoctor: doctor.id
        }
      }else{
        patientObject = {
          fullName: newPatientName,
          birthday: newPatientBirthday,
          gender: newGenderPatient,
          note: newNotePatient,
          idClinic: clinic.idClinicDefault
        }
      }
      dispatch(setLoadingModal(true));
      postToServerWithToken('/v1/patient/createPatient',patientObject).then(result => {
        setNewPatientName('');
        setNewPatientBirthday(toISODateString(new Date()));
        setNewGenderPatient('male');
        setNewNotePatient('');
        if(selectedTab===0){
          dispatch(setGetAllPatientDoctor(true));
        }else{
          dispatch(setGetAllPatientClinic(true));
        } 
        toast.success(result.message)
        resolve();
        }).catch((err) =>{
          if(err.refreshToken && !isRefresh){
            refreshToken(nav,dispatch).then(()=>addNewPatient());
          }else{
            toast.error(err.message);
          }
          reject(err);
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  switch(selectedTab){
    case 0: currentTab = <MyPatient />
      break;
    case 1: currentTab = <PatientOfClinic />
      break;
    case 2: currentTab = <MySharedPatient />
      break;
    case 3: currentTab = <SharePatientSettingForDoctor />
      break;
    case 4: currentTab = <SharePatientSettingForClinic />
      break;
    default: currentTab = <div>Error</div>
  }

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t('patient list')}`));
  },[])

  return <div className="d-flex flex-column justify-content-start align-items-center h-100 w-100">
    <NavbarComponent />
    <div className="container">
      <div className="mt-3 mb-1">
        <div className="d-flex align-items-center justify-content-lg-between justify-content-sm-center flex-grow-1 w-100 flex-wrap" style={{height:"70px"}}>
          <div className="flex-grow-1">
            <button type="button" style={{borderColor:"goldenrod"}} className={`btn me-3 px-3 py-0 text-white-hover ${selectedTab===3 || selectedTab===4?'mc-yellow-background text-white':'mc-yellow-hover'}`} onClick={e=>dispatch(setpatientListTab(selectedTab===0?3:4))} disabled={selectedTab===2 ||selectedTab===3 || selectedTab===4}>
              <span className="text-capitalize text-nowrap" style={{fontSize:FONT_SIZE}}>{t('Share patient setting')}</span>
            </button>
          </div>
          <div className="d-flex flex-row flex-wrap">
            <button type="button" className={`btn me-3 px-3 py-0 text-white-hover ${selectedTab===3 && 'mc-border-pale'} ${selectedTab===0 ?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setpatientListTab(0))}>
              <span className="text-capitalize text-nowrap" style={{fontSize:FONT_SIZE}}>{t('my patient')}</span>
            </button>
            <button type="button" className={`btn me-3 px-3 py-0 text-white-hover ${selectedTab===4 && 'mc-border-pale'} ${selectedTab===1 ?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setpatientListTab(1))}>
              <span className="text-capitalize text-nowrap" style={{fontSize:FONT_SIZE}}>{t('patient of clinic')}</span>
            </button>
            <button type="button" className={`btn px-3 py-0 text-white-hover ${selectedTab===2?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>dispatch(setpatientListTab(2))}>
              <span className="text-capitalize text-nowrap" style={{fontSize:FONT_SIZE}}>{t('patient shared')}</span>
            </button>
          </div>
        </div>
        <SelectPatientComponent condition={selectedTab===1 || selectedTab===4} showSelectedPatient={false}/>
      </div>
    </div>
    {
      (selectedTab === 0 || (selectedTab === 1 && clinic.roleOfDoctor==='admin' )) && <div className="container w-100 mt-1">
        <fieldset className="border rounded p-2 d-flex flex-row align-items-center flex-wrap justify-content-sm-center justify-content-center">
          <legend style={{fontSize:FONT_SIZE_HEAD}} className="mx-auto mb-0 float-none w-auto px-2 text-uppercase mc-color fw-bold">
            {t('create new patient')}
          </legend>
          <div style={{width:"400px"}}>
            <TextFieldInput 
              className="me-2"
              classNameLegend="w-auto mb-0 ms-2 float-none px-2 text-capitalize fw-bold" 
              classNameInput="rounded py-2 px-3 text-capitalize" 
              placeholder={t('Name of patient')}  
              value={newPatientName} 
              onChange={value=>setNewPatientName(value)} 
              legend={t('patient name')}
            />
          </div>
          <TextFieldInput 
            className="me-2"
            classNameLegend="w-auto mb-0 ms-2 float-none px-2 text-capitalize fw-bold" 
            classNameInput="rounded py-2 px-1" 
            type="date"
            value={newPatientBirthday} 
            fontSize="small"
            onChange={value=>setNewPatientBirthday(value)} 
            legend={t('birth day')}
          />
          <SelectFieldInput  
            className="p-0 text-capitalize me-2" 
            classNameLegend="w-auto mb-0 ms-2 float-none px-2 text-capitalize fw-bold" 
            classNameInput="rounded p-2 text-capitalize" 
            style={{outline:"none",width:WIDTH_CHILD,width:"120px"}} 
            value={newGenderPatient} 
            fontSize="small"
            onChange={value=>setNewGenderPatient(value)}
            legend={t('gender')}
          >
            <option className="text-gray border-0 text-capitalize" value={'male'} style={{fontSize:FONT_SIZE,width:WIDTH_CHILD}}>
              {t('male')}
            </option>
            <option className="text-gray border-0 text-capitalize" value={'female'} style={{fontSize:FONT_SIZE,width:WIDTH_CHILD}}>
              {t('female')}
            </option>
          </SelectFieldInput>
          <TextFieldInput 
            className="me-2 flex-grow-1"
            classNameLegend="w-auto mb-0 ms-2 float-none px-2 text-capitalize fw-bold" 
            classNameInput="rounded py-2 px-3" 
            placeholder={t('note')}  
            value={newNotePatient} 
            onChange={value=>setNewNotePatient(value)} 
            legend={t('note')}
          />
          <div className="mt-1 pt-1" style={{height:"50px"}}>
            <IconButtonComponent className="btn-outline-success h-100" onClick={addNewPatient} icon="add" FONT_SIZE_ICON={"30px"} title={t("add new patient")}/>
          </div>
        </fieldset>
      </div>
    }
    {currentTab}
  </div>
}