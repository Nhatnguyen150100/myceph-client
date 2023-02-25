import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import TextFieldInput from "../../common/TextFieldInput.jsx";
import { convertISOToVNDateString, FONT_SIZE, SOFT_WARE_LIST, toISODateString } from "../../common/Utility.jsx";
import { setOtherEmailDoctor } from "../../redux/DoctorSlice.jsx";
import { setDoctorSettingTab, setSelectPatientMode, setSettingTab, setSoftWareSelectedTab } from "../../redux/GeneralSlice.jsx";
import { setCurrentPatient } from "../../redux/PatientSlice.jsx";

const AVATAR_HEIGHT = "90px";
const AVATAR_WIDTH = "90px";

export default function PatientRows(props){
  const {t} = useTranslation();
  const clinic = useSelector(state=>state.clinic);
  const selectedTab = useSelector(state=>state.general.patientListTab);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const toOtherDoctorProfile = (email) => {
    nav('/setting');
    dispatch(setOtherEmailDoctor(email));
    dispatch(setSettingTab(0));
    dispatch(setDoctorSettingTab(1));
  }

  const onToSoftWare = (tab) => {
    dispatch(setSelectPatientMode(props.selectPatientMode));
    dispatch(setSoftWareSelectedTab(tab));
    dispatch(setCurrentPatient(props.patient));
  }

  return <tr className={`align-middle hover-font-weight`}>
    <td className="d-lg-table-cell d-none" style={{width:"180px",cursor:"pointer"}}>
      <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/frontFace.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"cover"}}/>
    </td>
    <td className={`text-gray`}>
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
        <Link to={`/medicalRecord`} onClick={e=>onToSoftWare(SOFT_WARE_LIST.MEDICAL_RECORD.tab)} title={t("MedicalRecord")} className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/MedicalRecord.png" width="34" height="34" alt="MedicalRecord"/>
        </Link>
        <Link title={t("ImageLibrary")} className="btn btn-outline-info p-1 border-0 me-2 mb-2">
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
            <Link title={t("share patient")} className="btn btn-outline-info p-1 border-0 me-2 mb-2 rounded d-none d-sm-block" disabled={selectedTab===1 && clinic.roleOfDoctor!=='admin'}>
              <img src="/assets/images/Share.png" width="34" height="34" alt="Discussion"/>
            </Link>
          </div>
          <IconButtonComponent className="btn-outline-danger border-0 p-0 mb-1" icon="delete" FONT_SIZE_ICON={"30px"} title={t("delete patient")} disabled={selectedTab===1 && clinic.roleOfDoctor!=='admin'} onClick={e=>props.onDeleteHandle(props.patient.id)}/>
        </div>
      </td>
    }
    {
      props.shareByDoctor &&  <td className={`d-lg-table-cell`} style={{fontSize:FONT_SIZE,cursor:"pointer"}}>
        <button onClick={e=>toOtherDoctorProfile(props.patient['Doctor.email'])} type="button" style={{background:"none"}} className="tranform-hover border-0 d-flex flex-column align-items-center justify-content-center h-100 w-100">
          <strong className="mc-color fw-bold" style={{fontSize:FONT_SIZE}}>{props.patient['Doctor.email']}</strong>
          <span className="text-gray" style={{fontSize:FONT_SIZE}}>{'( '}{props.patient['Doctor.fullName']}{' )'}</span>
        </button>
      </td>
    }
  </tr>
}