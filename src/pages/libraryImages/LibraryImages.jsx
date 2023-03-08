import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FONT_TAB, LIBRARY_IMAGES_TABS, SELECT_PATIENT_MODE, SOFT_WARE_LIST } from "../../common/Utility.jsx";
import NavbarComponent from "../../component/NavbarComponent.jsx";
import SelectPatientComponent from "../../component/SelectPatientComponent.jsx";
import SoftWareListComponent from "../../component/SoftWareListComponent.jsx";
import { setAppName, setLibraryImagesTab } from "../../redux/GeneralSlice.jsx";
import ExtraOralImages from "./ExtraOralImages.jsx";
import IntralOralImages from "./IntraOralImages.jsx";
import RadiographyImages from "./RadiographyImages.jsx";

export default function LibraryImages(props){
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const selectedTab = useSelector(state=>state.general.libraryImagesTab);
  const selectPatientMode = useSelector(state=>state.general.selectPatientMode);

  const currentPatient = useSelector(state=>state.patient.currentPatient);

  let currentTab = null;

  switch(selectedTab){
    case LIBRARY_IMAGES_TABS.RADIOGRAPHY: currentTab = <RadiographyImages />
    break;
    case LIBRARY_IMAGES_TABS.EXTRA_ORAL: currentTab = <ExtraOralImages />
    break;
    case LIBRARY_IMAGES_TABS.INTRA_ORAL: currentTab = <IntralOralImages />
    break;
    default: currentTab = <div className="h-100 w-100 d-flex justify-content-center align-items-center">
    <strong className="text-danger fw-bold">{t('page not found')}</strong>    
    </div>
  }

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t(SOFT_WARE_LIST.IMAGE_LIBRARY)}`));
  },[])


  return <div className="d-flex flex-column justify-content-start align-items-center">
	<NavbarComponent />
	<div className="d-flex flex-column h-100 container my-1">
		<div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3" style={{minHeight:`${selectPatientMode===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
			<SelectPatientComponent />
			<SoftWareListComponent />
		</div>
		<div className="w-100 mc-background py-1 d-flex justify-content-end align-items-start rounded">
			<button
				onClick={e=>dispatch(setLibraryImagesTab(LIBRARY_IMAGES_TABS.RADIOGRAPHY))} 
				type="button" 
				className={`border-0 d-flex flex-row align-items-center justify-content-center mc-color-hover border-end pe-2 py-1 ${selectedTab===LIBRARY_IMAGES_TABS.RADIOGRAPHY?'mc-pale-color':'text-white'}`} 
				style={{fontSize:FONT_TAB,background:"none"}}
				disabled={selectedTab===LIBRARY_IMAGES_TABS.RADIOGRAPHY}
				>
          <span className="material-symbols-outlined me-1">
            theaters
          </span>
          <span className="text-uppercase fw-bold d-none d-lg-block">{t('radiography')}</span>
			</button>
			<button 
				onClick={e=>dispatch(setLibraryImagesTab(LIBRARY_IMAGES_TABS.EXTRA_ORAL))} 
				type="button" 
				className={`border-0 d-flex flex-row align-items-center justify-content-center mc-color-hover border-end pe-2 py-1 ${selectedTab===LIBRARY_IMAGES_TABS.EXTRA_ORAL?'mc-pale-color':'text-white'}`} 
				style={{fontSize:FONT_TAB,background:"none"}}
				disabled={selectedTab===LIBRARY_IMAGES_TABS.EXTRA_ORAL}
				>
          <span className="material-symbols-outlined me-1">
            face
          </span>
          <span className="text-uppercase fw-bold d-none d-lg-block">{t('extra-oral')}</span>
			</button>
			<button 
				onClick={e=>dispatch(setLibraryImagesTab(LIBRARY_IMAGES_TABS.INTRA_ORAL))} 
				type="button" 
				className={`border-0 d-flex flex-row align-items-center justify-content-center mc-color-hover pe-2 py-1 me-2 ${selectedTab===LIBRARY_IMAGES_TABS.INTRA_ORAL?'mc-pale-color':'text-white'}`} 
				style={{fontSize:FONT_TAB,background:"none"}}
				disabled={selectedTab===LIBRARY_IMAGES_TABS.INTRA_ORAL}
				>
          <span className="material-symbols-outlined me-1">
            sentiment_very_satisfied
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