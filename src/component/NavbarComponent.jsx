import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setAppName, setLanguage, setLoadingModal } from "../redux/GeneralSlice.jsx";
import i18n from '../translation/i18n.jsx';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useNavigate } from "react-router-dom";
import { clearAllSclice, cookies, splitEmail } from "../common/Utility.jsx";
import { postToServerWithToken } from "../services/getAPI.jsx";
import { toast } from "react-toastify";
import { refreshToken } from "../services/refreshToken.jsx";

const FONT_SIZE = '17px';

export default function NavbarComponent(props) {
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const doctor = useSelector(state=>state.doctor.data);
  const language = useSelector(state => state.general.language);
  const appName = useSelector(state => state.general.appName);
  const dispatch  = useDispatch();
  const nav = useNavigate();
  const {t} = useTranslation();

  useEffect(()=>{
    changeLanguage(language);
  },[language])

  const changeLanguage = value => {
    i18n.changeLanguage(value);
  }

  const logout = () => {
    dispatch(setLoadingModal(true));
    postToServerWithToken(`/v1/auth/logout`,{
      idDoctor: doctor.id,
      refreshToken: cookies.get('refreshToken')
    }).then(response => {
      clearAllSclice(dispatch);
      nav("/login");
    }).catch((err) =>{
      if(err.refreshToken && !isRefresh){
        refreshToken(nav,dispatch).then(()=>logout());
      }else{
        toast.error(err.message);
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
            <div className="d-flex flex-row justify-content-start align-items-center">
              <Link to={"/"} onClick={e=>dispatch(setAppName('Myceph'))}>
                <img style={{height:"43px"}} src="/assets/icons/logo-mc.png" alt='logo' />
              </Link>
              <Link to={"/"} style={{textDecoration:"none"}}>
                <span className="me-3 ms-2 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('homepage')}</span>
              </Link>
              <span className="vr"></span>
              <span className="mx-3 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('schedule')}</span>
              <span className="vr"></span>
              <Link to={"/patientListManagement"} style={{textDecoration:"none"}}>
                <span className="mx-3 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('patient list')}</span>
              </Link>
            </div>
            <div className="d-flex flex-row align-items-center">
              <div className="dropdown">
                <button className="btn border-0 dropdown-toggle d-flex flex-row align-items-center px-2 text-gray" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{outline:"none"}}>
                  {
                    language === 'en' ? <div className="d-flex flex-row align-items-center" style={{background:"transparent"}}>
                      <img className="me-1" src="/assets/icons/flag-en.png" style={{height:"30px",background:"transparent"}} alt=""/>
                      <span className="text-capitalize mc-color-hover" style={{fontSize:FONT_SIZE,background:"transparent"}}>english</span>
                    </div>
                    :
                    <div className="d-flex flex-row align-items-center" style={{background:"transparent"}}>
                      <img className="me-1" src="/assets/icons/flag-vi.png" style={{height:"30px",background:"transparent"}} alt=""/>
                      <span className="text-capitalize mc-color-hover" style={{fontSize:FONT_SIZE,background:"transparent"}}>vietnamese</span>
                    </div>
                  }
                </button>
                <ul className="dropdown-menu py-0 px-1 border">
                  {
                    language === 'vi' ? <li className="w-100">
                      <button className="btn d-flex flex-row align-items-center w-100 border-0" onClick={e=>{dispatch(setLanguage('en'));changeLanguage('en')}}>
                        <img className="me-1" src="/assets/icons/flag-en.png" style={{height:"30px",background:"transparent"}} alt=""/>
                        <span className="text-capitalize mc-color-hover" style={{fontSize:FONT_SIZE,background:"transparent"}}>english</span>
                      </button>
                    </li>
                    :
                    <li className="w-100">
                      <button className="btn d-flex flex-row align-items-center w-100 border-0" onClick={e=>{dispatch(setLanguage('vi'));changeLanguage('vi')}}>
                        <img className="me-1" src="/assets/icons/flag-vi.png" style={{height:"30px",background:"transparent"}} alt=""/>
                        <span className="text-capitalize mc-color-hover" style={{fontSize:FONT_SIZE,background:"transparent"}}>vietnamese</span>
                      </button>
                    </li>
                  }
                </ul>
              </div>
              {
                doctor?
                <div className="dropdown ms-3">
                  <button className="btn border-0 dropdown-toggle d-flex flex-row align-items-center px-2 text-gray" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{outline:"none"}}>
                    <div className="d-flex flex-row align-items-center" style={{background:"transparent"}}>
                      <img className="me-1 mb-1" src="/assets/icons/user.png" style={{height:"20px",background:"transparent"}} alt=""/>
                      <span className="mc-color-hover" style={{fontSize:FONT_SIZE,background:"transparent"}}>{doctor.fullName?doctor.fullName:splitEmail(doctor.email)}</span>
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
                      <button className="btn d-flex flex-row align-items-center w-100 border-0" onClick={logout}>
                        <span className="text-capitalize" style={{fontSize:FONT_SIZE,background:"transparent"}}>{t('log out')}</span>
                      </button>
                    </li>
                  </ul>
                </div>
                :
                <React.Fragment>
                  <Link to={"/login"} style={{textDecoration:"none"}}>
                    <span className="mx-3 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('login')}</span>
                  </Link>
                  <span className="vr"></span>
                  <Link to={"/register"} style={{textDecoration:"none"}}>
                    <span className="mx-3 text-capitalize text-gray mc-color-hover" style={{fontSize:FONT_SIZE,cursor:"pointer"}}>{t('sign up')}</span>
                  </Link>
                </React.Fragment>
              }
            </div>
          </div>
        </div>
      </div>
  </HelmetProvider>
  )
}