import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useNavigate } from "react-router-dom";
import { FONT_TAB, IMAGE_TYPE_LIST, LIBRARY_IMAGES_TABS, SELECT_PATIENT_MODE, SOFT_WARE_LIST } from "../../common/Utility.jsx";
import NavbarComponent from "../../component/NavbarComponent.jsx";
import SelectPatientComponent from "../../component/SelectPatientComponent.jsx";
import SoftWareListComponent from "../../component/SoftWareListComponent.jsx";
import { setAppName, setLibraryImagesTab } from "../../redux/GeneralSlice.jsx";
import ExtraOralImages from "./ExtraOralImages.jsx";
import IntralOralImages from "./IntraOralImages.jsx";
import RadiographyImages from "./RadiographyImages.jsx";

export default function LibraryImages(props){
  const doctor = useSelector(state=>state.doctor);
  const patient = useSelector(state=>state.patient);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const nav = useNavigate();
  const selectedTab = useSelector(state=>state.general.libraryImagesTab);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);

  const currentPatient = useSelector(state=>state.patient.currentPatient);

  let currentTab = null;

  switch(selectedTab){
    case IMAGE_TYPE_LIST.X_RAY.name: currentTab = <RadiographyImages patient={patient}/>
    	break;
    case IMAGE_TYPE_LIST.FACE.name: currentTab = <ExtraOralImages patient={patient}/>
    	break;
    case IMAGE_TYPE_LIST.INTRA_ORAL.name: currentTab = <IntralOralImages patient={patient}/>
    	break;
    default: currentTab = <div className="h-100 w-100 d-flex justify-content-center align-items-center">
    <strong className="text-danger fw-bold">{t('page not found')}</strong>    
    </div>
  }

  useEffect(()=>{
    if(!doctor.data?.id) nav('/login');
  },[])

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t(SOFT_WARE_LIST.IMAGE_LIBRARY)}`));
  },[])


  return <div className="d-flex flex-column justify-content-start align-items-center">
	<NavbarComponent />
	<div className="d-flex flex-column h-100 container my-1">
		<div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3" style={{minHeight:`${selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
			<SelectPatientComponent condition={selectPatientOnMode === SELECT_PATIENT_MODE.CLINIC_PATIENT} showSelectedPatient={true}/>
			<SoftWareListComponent />
		</div>
		<div className="w-100 mc-background py-1 d-flex justify-content-end align-items-start rounded">
			<button
				onClick={e=>dispatch(setLibraryImagesTab(IMAGE_TYPE_LIST.X_RAY.name))} 
				type="button" 
				className={`border-0 d-flex flex-row align-items-center justify-content-center mc-color-hover border-end pe-2 py-1 ${selectedTab===IMAGE_TYPE_LIST.X_RAY.name?'mc-pale-color':'text-white'}`} 
				style={{fontSize:FONT_TAB,background:"none"}}
				disabled={selectedTab===IMAGE_TYPE_LIST.X_RAY.name}
				>
          <span className="material-symbols-outlined me-1">
            {IMAGE_TYPE_LIST.X_RAY.icon}
          </span>
          <span className="text-uppercase fw-bold d-none d-lg-block">{t('radiography')}</span>
			</button>
			<button 
				onClick={e=>dispatch(setLibraryImagesTab(IMAGE_TYPE_LIST.FACE.name))} 
				type="button" 
				className={`border-0 d-flex flex-row align-items-center justify-content-center mc-color-hover border-end pe-2 py-1 ${selectedTab===IMAGE_TYPE_LIST.FACE.name?'mc-pale-color':'text-white'}`} 
				style={{fontSize:FONT_TAB,background:"none"}}
				disabled={selectedTab===IMAGE_TYPE_LIST.FACE.name}
				>
          <span className="material-symbols-outlined me-1">
		  	{IMAGE_TYPE_LIST.FACE.icon}
          </span>
          <span className="text-uppercase fw-bold d-none d-lg-block">{t('extra-oral')}</span>
			</button>
			<button 
				onClick={e=>dispatch(setLibraryImagesTab(IMAGE_TYPE_LIST.INTRA_ORAL.name))} 
				type="button" 
				className={`border-0 d-flex flex-row align-items-center justify-content-center mc-color-hover pe-2 py-1 me-2 ${selectedTab===IMAGE_TYPE_LIST.INTRA_ORAL.name?'mc-pale-color':'text-white'}`} 
				style={{fontSize:FONT_TAB,background:"none"}}
				disabled={selectedTab===IMAGE_TYPE_LIST.INTRA_ORAL.name}
				>
          <span className="material-symbols-outlined me-1">
		  	{IMAGE_TYPE_LIST.INTRA_ORAL.icon}
          </span>
          <span className="text-uppercase fw-bold d-none d-lg-block">{t('intra-oral')}</span>
			</button>
		</div>
		{
			currentPatient ? currentTab 
			:
			<div className="h-100 w-100 d-flex justify-content-center align-items-center mt-5">
				<h3 className="text-danger text-capitalize fw-bold">{t("can't found information of patient")}</h3>
			</div>
		}
	</div>
</div>
}