import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setAppName, setLanguage, setLoadingModal, setSoftWareSelectedTab } from "../redux/GeneralSlice.jsx";
import i18n from '../translation/i18n.jsx';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useNavigate } from "react-router-dom";
import { clearAllSlice, cookies, SELECT_PATIENT_MODE, SOFT_WARE_LIST, splitEmail, VIEW_CALENDAR } from "../common/Utility.jsx";
import { postToServerWithToken } from "../services/getAPI.jsx";
import { toast } from "react-toastify";
import { refreshToken } from "../services/refreshToken.jsx";
import { setCurrentPatient, setSelectPatientOnMode } from "../redux/PatientSlice.jsx";
import { setViewCalendar } from "../redux/CalendarSlice.jsx";
import { CSSTransition } from 'react-transition-group';

const FONT_SIZE = '17px';

export default function NavbarComponent(props) {
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const doctor = useSelector(state=>state.doctor.data);
  const language = useSelector(state => state.general.language);
  const appName = useSelector(state => state.general.appName);
  const clinic = useSelector(state => state.clinic);
  const dispatch  = useDispatch();
  const nav = useNavigate();
  const {t} = useTranslation();

  const [isShowMenu,setIsShowMenu] = useState(false)
  const menuRef = useRef();

  useEffect(()=>{
    changeLanguage(language);
  },[language])

  const changeLanguage = value => {
    i18n.changeLanguage(value);
  }

  const logout = () => {
    dispatch(setLoadingModal(true));
    postToServerWithToken(`/v1/auth/logout`,{
      idDoctor: doctor?.id,
      refreshToken: cookies.get('refreshToken')
    }).then(response => {
      clearAllSlice(dispatch);
      nav("/login");
    }).catch((err) =>{
      if(err.refreshToken && !isRefresh){
        refreshToken(nav,dispatch).then(()=>logout());
      }else{
        toast.error(t(err.message));
      }
    }).finally(()=>dispatch(setLoadingModal(false)));
  }

  return (
    <HelmetProvider>
      <div className="container-fluid border-bottom bg-white">
        <Helmet>
          <title className="text-capitalize">{appName}</title>
        </Helmet>
        <div className="container">
          <div className="d-flex flex-row justify-content-between align-items-center py-1">
            <div className="d-flex flex-row justify-content-between align-items-center">
              <button className="d-block d-sm-none btn border rounded btn-light p-0 mc-color" onClick={()=>setIsShowMenu(pre => !pre)}>
                <span className="material-symbols-outlined mt-1 mx-1 fw-bold" style={{fontSize:"25px"}}>
                  {isShowMenu?'close':'menu'}
                </span>
              </button>
              <Link className="d-none d-lg-block" to={"/"} onClick={e=>dispatch(setAppName('Myceph'))}>
                <img style={{height:"43px"}} src="/assets/icons/logo-mc.png" alt='logo' />
              </Link>
              <div className="d-none d-lg-block">
                <Link to={"/"} style={{textDecoration:"none"}}>
                  <span className="me-3 ms-2 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('homepage')}</span>
                </Link>
                {
                  doctor?.id && 
                  <React.Fragment>
                    <span className="vr"></span>
                    {
                      clinic.idClinicDefault && 
                      <React.Fragment>
                        <Link to={"/schedule"} style={{textDecoration:"none"}} onClick={()=>{dispatch(setSelectPatientOnMode(SELECT_PATIENT_MODE.CLINIC_PATIENT));dispatch(setViewCalendar(VIEW_CALENDAR.BY_DATE));dispatch(setSoftWareSelectedTab(SOFT_WARE_LIST.CALENDAR))}}>
                          <span className="mx-3 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('schedule')}</span>
                        </Link>
                        <span className="vr"></span>
                      </React.Fragment>
                    }
                    <Link to={"/patientListManagement"} style={{textDecoration:"none"}}>
                      <span className="mx-3 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('patient list')}</span>
                    </Link>
                  </React.Fragment>
                }
              </div>
            </div>
            <Link className="d-block d-sm-none" to={"/"} onClick={e=>dispatch(setAppName('Myceph'))}>
              <img style={{height:"43px"}} src="/assets/icons/logo-mc.png" alt='logo' />
            </Link>
            <div className="d-flex flex-row align-items-center">
              <div className="dropdown">
                <button className="btn border-0 dropdown-toggle d-flex flex-row align-items-center px-2 text-gray" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{outline:"none"}}>
                  {
                    language === 'en' ? <div className="d-flex flex-row align-items-center" style={{background:"transparent"}}>
                      <img className="me-1" src="/assets/icons/flag-en.png" style={{height:"30px",background:"transparent"}} alt=""/>
                      <span className="text-capitalize mc-color-hover d-none d-lg-block" style={{fontSize:FONT_SIZE,background:"transparent"}}>english</span>
                    </div>
                    :
                    <div className="d-flex flex-row align-items-center" style={{background:"transparent"}}>
                      <img className="me-1" src="/assets/icons/flag-vi.png" style={{height:"30px",background:"transparent"}} alt=""/>
                      <span className="text-capitalize mc-color-hover d-none d-lg-block" style={{fontSize:FONT_SIZE,background:"transparent"}}>vietnamese</span>
                    </div>
                  }
                </button>
                <ul className="dropdown-menu py-0 px-1 border">
                  {
                    language === 'vi' ? <li className="w-auto">
                      <button className="btn d-flex flex-row align-items-center w-auto border-0" onClick={e=>{dispatch(setLanguage('en'));changeLanguage('en')}}>
                        <img className="me-1" src="/assets/icons/flag-en.png" style={{height:"30px",background:"transparent"}} alt=""/>
                        <span className="text-capitalize mc-color-hover" style={{fontSize:FONT_SIZE,background:"transparent"}}>english</span>
                      </button>
                    </li>
                    :
                    <li className="w-auto">
                      <button className="btn d-flex flex-row align-items-center w-auto border-0" onClick={e=>{dispatch(setLanguage('vi'));changeLanguage('vi')}}>
                        <img className="me-1" src="/assets/icons/flag-vi.png" style={{height:"30px",background:"transparent"}} alt=""/>
                        <span className="text-capitalize mc-color-hover" style={{fontSize:FONT_SIZE,background:"transparent"}}>vietnamese</span>
                      </button>
                    </li>
                  }
                </ul>
              </div>
              {
                doctor?
                <div className="dropdown d-none d-lg-block" style={{marginLeft:"10px"}}>
                  <button className="btn border-0 dropdown-toggle d-flex flex-row align-items-center px-2 text-gray" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{outline:"none"}}>
                    <div className="d-flex flex-row align-items-center" style={{background:"transparent"}}>
                      <img className="me-1 mb-1" src="/assets/icons/user.png" style={{height:"20px",background:"transparent"}} alt=""/>
                      <span className="mc-color-hover d-none d-lg-block" style={{fontSize:FONT_SIZE,background:"transparent"}}>{doctor.fullName?doctor.fullName:splitEmail(doctor.email)}</span>
                    </div>
                  </button>
                  <ul className="dropdown-menu py-0 px-1 border w-100">
                    <Link to={"/setting"} style={{textDecoration:"none"}}>
                      <li className="w-100 mc-color-hover">
                        <button className="btn d-flex flex-row align-items-center w-100 border-0">
                          <span className="text-capitalize" style={{fontSize:FONT_SIZE,background:"transparent"}}>{t('setting')}</span>
                        </button>
                      </li>
                    </Link>
                    <li className="w-100 mc-color-hover">
                      <button className="btn d-flex flex-row align-items-center w-100 border-0" onClick={()=>logout()}>
                        <span className="text-capitalize" style={{fontSize:FONT_SIZE,background:"transparent"}}>{t('log out')}</span>
                      </button>
                    </li>
                  </ul>
                </div>
                :
                <div className="d-none d-lg-block">
                  <Link to={"/login"} style={{textDecoration:"none"}}>
                    <span className="mx-3 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('login')}</span>
                  </Link>
                  <span className="vr"></span>
                  <Link to={"/register"} style={{textDecoration:"none"}}>
                    <span className="mx-3 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('sign up')}</span>
                  </Link>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <CSSTransition
        in={isShowMenu}
        nodeRef={menuRef}
        timeout={300}
        classNames="menu"
        unmountOnExit
      >
        <div className="d-flex flex-column justify-content-center align-items-start border-top border-bottom w-100 nav-menu" ref={menuRef}>
          <Link className="mt-1 w-100" to={"/"} style={{textDecoration:"none"}}>
            <span className="ms-2 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('homepage')}</span>
          </Link>
          {
            clinic.idClinicDefault && 
            <Link 
              className="mt-1 w-100" 
              to={"/schedule"} 
              style={{textDecoration:"none"}} 
              onClick={()=>{
                dispatch(setSelectPatientOnMode(SELECT_PATIENT_MODE.CLINIC_PATIENT));
                dispatch(setViewCalendar(VIEW_CALENDAR.BY_DATE));
                dispatch(setSoftWareSelectedTab(SOFT_WARE_LIST.CALENDAR))
              }}
            >
              <span className="ms-2 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('schedule')}</span>
            </Link>
          }
          <Link className="mt-1 w-100" to={"/patientListManagement"} style={{textDecoration:"none"}} onClick={()=>dispatch(setCurrentPatient(null))}>
            <span className="ms-2 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('patient list')}</span>
          </Link>
          {
            doctor?
            <React.Fragment>
              <Link className="mt-1 w-100" to={"/setting"} style={{textDecoration:"none"}}>
                <button className="btn d-flex flex-row align-items-center border-0 p-0">
                  <span className="ms-2 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,background:"transparent"}}>{t('setting')}</span>
                </button>
              </Link>
              <button className="btn d-flex flex-row align-items-center mt-1 border-0 p-0" onClick={()=>logout()}>
                <span className="ms-2 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,background:"transparent"}}>{t('log out')}</span>
              </button>
            </React.Fragment>
            :
            <React.Fragment>
              <Link className="mt-1 w-100" to={"/login"} style={{textDecoration:"none"}}>
                <span className="ms-2 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('login')}</span>
              </Link>
              <Link className="mt-1 w-100" to={"/register"} style={{textDecoration:"none"}}>
                <span className="ms-2 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('sign up')}</span>
              </Link>
            </React.Fragment>
          }
        </div>
      </CSSTransition>
    </HelmetProvider>
  )
}