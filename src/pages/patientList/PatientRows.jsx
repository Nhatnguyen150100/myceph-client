import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { convertISOToVNDateString, FONT_SIZE, toISODateString } from "../../common/Utility.jsx";

const AVATAR_HEIGHT = "90px";
const AVATAR_WIDTH = "90px";

export default function PatientRows(props){
  const {t} = useTranslation();
  const clinic = useSelector(state=>state.clinic);
  const selectedTab = useSelector(state=>state.general.patientListTab);

  return <tr className={`align-middle hover-font-weight`} style={{cursor:"pointer"}}>
    <td className="d-lg-table-cell d-none" style={{width:"180px"}}>
      <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/frontFace.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"cover"}}/>
    </td>
    <td className={`text-gray`} style={{fontSize:FONT_SIZE}}>
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
        <button title="medical record" className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/MedicalRecord.png" width="34" height="34" alt="MedicalRecord"/>
        </button>
        <button title="medical record" className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/ImageLibrary.png" width="34" height="34" alt="ImageLibrary"/>
        </button>
        <button title="medical record" className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/LateralCeph.png" width="34" height="34" alt="LateralCeph"/>
        </button>
        <button title="medical record" className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/CalendarNew.png" width="34" height="34" alt="CalendarNew"/>
        </button>
        <button title="medical record" className="btn btn-outline-info p-1 border-0 me-2 mb-2">
          <img src="/assets/images/Discussion.png" width="34" height="34" alt="Discussion"/>
        </button>
      </div>
    </td>
    <td className={`d-lg-table-cell`}>
      <div className="d-flex flex-row align-items-center justify-content-center">
        <button title="medical record" className="btn btn-outline-info p-1 border-0 me-2 mb-2" disabled={selectedTab===1 && clinic.roleOfDoctor!=='admin'}>
          <img src="/assets/images/Share.png" width="34" height="34" alt="Discussion"/>
        </button>
        <IconButtonComponent className="btn-outline-danger border-0 p-0 mb-1" icon="delete" FONT_SIZE_ICON={"30px"} title={t("delete patient")} disabled={selectedTab===1 && clinic.roleOfDoctor!=='admin'} onClick={e=>props.onDeleteHandle(props.patient.id)}/>
      </div>
    </td>
  </tr>
}