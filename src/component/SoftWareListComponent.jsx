import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FONT_SIZE_ICONS, SOFT_WARE_LIST } from "../common/Utility.jsx";

export default function SoftWareListComponent(props){
  const softWareSelectedTab = useSelector(state=>state.general.softWareSelectedTab);
  const {t} = useTranslation();

  return <div className="d-flex justify-content-start align-items-center my-2">
    {
      softWareSelectedTab === SOFT_WARE_LIST.MEDICAL_RECORD.tab ?  
      <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white p-1'>
        <img src="/assets/images/MedicalRecord_active.png" width="34" height="34" alt="MedicalRecord"/>
      </div>
      :
      <Link title={t("MedicalRecord")} className="btn btn-outline-info p-1 me-3 border-0">
        <img src="/assets/images/MedicalRecord.png" width="34" height="34" alt="MedicalRecord"/>
      </Link>
    }
    {
      softWareSelectedTab === SOFT_WARE_LIST.IMAGE_LIBRARY.tab ? 
      <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white p-1'>
        <img src="/assets/images/imageLibrary_active.png" width="34" height="34" alt="MedicalRecord"/>
      </div>
      :
      <Link title={t("ImageLibrary")} className="btn btn-outline-info p-1 me-3 border-0">
        <img src="/assets/images/imageLibrary.png" width="34" height="34" alt="MedicalRecord"/>
      </Link>
    }
    {
      softWareSelectedTab === SOFT_WARE_LIST.LATERALCEPH.tab ? 
      <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white p-1'>
        <img src="/assets/images/LateralCeph_active.png" width="34" height="34" alt="MedicalRecord"/>
      </div>
      :
      <Link title={t("LateralCeph")} className="btn btn-outline-info p-1 me-3 border-0">
        <img src="/assets/images/LateralCeph.png" width="34" height="34" alt="MedicalRecord"/>
      </Link>
    }
    {
      softWareSelectedTab === SOFT_WARE_LIST.CALENDAR.tab ? 
      <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white p-1'>
        <img src="/assets/images/CalendarNew_active.png" width="34" height="34" alt="MedicalRecord"/>
      </div>
      :
      <Link title={t("Calendar")} className="btn btn-outline-info p-1 me-3 border-0">
        <img src="/assets/images/CalendarNew.png" width="34" height="34" alt="MedicalRecord"/>
      </Link>
    }
    {
      softWareSelectedTab === SOFT_WARE_LIST.DISCUSSION.tab ? 
      <div className='rounded p-0 me-3 border mc-pale-color mc-background-color-white p-1'>
        <img src="/assets/images/Discussion_active.png" width="34" height="34" alt="MedicalRecord"/>
      </div>
      :
      <Link title={t("Discussion")} className="btn btn-outline-info p-1 me-3 border-0">
        <img src="/assets/images/Discussion.png" width="34" height="34" alt="MedicalRecord"/>
      </Link>
    }
  </div>
}