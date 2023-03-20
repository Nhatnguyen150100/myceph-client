import { fontSize } from "@mui/system";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { convertISOToVNDateString, FONT_SIZE, SOFT_WARE_LIST, toISODateString } from "../../common/Utility.jsx";
import { setOtherEmailDoctor } from "../../redux/DoctorSlice.jsx";
import { setDoctorSettingTab, setSettingTab, setSoftWareSelectedTab } from "../../redux/GeneralSlice.jsx";
import { setCurrentPatient, setSelectPatientOnMode } from "../../redux/PatientSlice.jsx";
import { getToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

const AVATAR_HEIGHT = "90px";
const AVATAR_WIDTH = "90px";

export default function PatientRows(props){
  const {t} = useTranslation();
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const clinic = useSelector(state=>state.clinic);
  const selectedTab = useSelector(state=>state.general.patientListTab);
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
    dispatch(setSelectPatientOnMode(props.selectPatientMode));
    dispatch(setSoftWareSelectedTab(tab));
    dispatch(setCurrentPatient(props.patient));
  }

  return <tr className={`align-middle hover-font-weight`}>
    <td className={`d-lg-table-cell d-none text-gray`} style={{fontSize:FONT_SIZE}}>
      {props.stt+1}
    </td>
    <td className="d-lg-table-cell d-none" style={{width:"180px",cursor:"pointer"}}>
      <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/frontFace.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"cover"}}/>
    </td>
    <td className={`text-gray text-capitalize`}>
      {props.patient.fullName}
    </td>
    <td className={`d-lg-table-cell d-none text-gray`} style={{fontSize:FONT_SIZE}}>
      {convertISOToVNDateString(toISODateString(new Date(props.patient.birthday)))}
    </td>
    <td className={`d-lg-table-cell d-none text-gray text-capitalize`} style={{fontSize:FONT_SIZE}}>
      {props.patient.gender}
    </td>
    <td className={`d-lg-table-cell d-none text-gray`} style={{fontSize:FONT_SIZE}}>
      {props.patient.note}
    </td>
    <td className={`d-lg-table-cell`}>
      <div className="d-flex flex-row align-items-center justify-content-center">
        <Link to={`/medicalRecord`} onClick={e=>onToSoftWare(SOFT_WARE_LIST.MEDICAL_RECORD)} title={t("MedicalRecord")} className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/MedicalRecord.png" width="34" height="34" alt="MedicalRecord"/>
        </Link>
        <Link to={`/libraryImagesManagement`} title={t("ImageLibrary")} onClick={e=>onToSoftWare(SOFT_WARE_LIST.IMAGE_LIBRARY)} className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/ImageLibrary.png" width="34" height="34" alt="ImageLibrary"/>
        </Link>
        <Link title={t("LateralCeph")} className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/LateralCeph.png" width="34" height="34" alt="LateralCeph"/>
        </Link>
        <Link title={t("Calendar")} className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/CalendarNew.png" width="34" height="34" alt="Calendar"/>
        </Link>
        <Link title={t("Discussion")} className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/Discussion.png" width="34" height="34" alt="Discussion"/>
        </Link>
      </div>
    </td>
    {
      props.action && <td className={`d-lg-table-cell`}>
        <div className="d-flex flex-row align-items-center justify-content-center">
          <div className="btn-group dropstart">
            <button 
              title={t("share patient")} 
              onClick={e=>getAllDoctorSharedPatient(props.patient.id)} 
              className="btn btn-outline-info p-1 border-0 me-2 mb-2 rounded d-none d-sm-block" 
              disabled={selectedTab===1 && clinic.roleOfDoctor!=='admin'}
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <img src="/assets/images/Share.png" width="34" height="34" alt="Discussion"/>
            </button>
            <ul className="dropdown-menu w-auto shadow ">
              {
                listOfDoctorSharedPatient.length>0?
                <div className="d-flex flex-column justify-content-center align-items-center w-100 px-3">
                  <span className="text-uppercase fw-bold mc-color border-bottom w-100 text-center mb-1" style={{fontSize:FONT_SIZE}}>{t('list doctor was shared')}</span>
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
          </div>
          <IconButtonComponent className="btn-outline-danger border-0 p-0 mb-1" icon="delete" FONT_SIZE_ICON={"30px"} title={t("delete patient")} disabled={selectedTab===1 && clinic.roleOfDoctor!=='admin'} onClick={e=>props.onDeleteHandle(props.patient.id)}/>
        </div>
      </td>
    }
    {
      props.shareByDoctor &&  <td className={`d-lg-table-cell`} style={{fontSize:FONT_SIZE,cursor:"pointer"}}>
        <button onClick={e=>toOtherDoctorProfile(props.patient['Doctor.email'])} type="button" style={{background:"none"}} className="tranform-hover btn-hover-bg rounded border-0 d-flex flex-column align-items-center justify-content-center h-100 w-100">
          <strong className="fw-bold mc-color" style={{fontSize:FONT_SIZE}}>{props.patient['Doctor.email']}</strong>
          <span style={{fontSize:FONT_SIZE}}>{'( '}{props.patient['Doctor.fullName']}{' )'}</span>
        </button>
      </td>
    }
  </tr>
}