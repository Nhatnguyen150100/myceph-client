import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonComponent from "../common/ButtonComponent.jsx";
import NavbarComponent from "../components/NavbarComponent.jsx";
import { postToServer } from "../services/getAPI.jsx";
import { setDataDoctor } from "../redux/DoctorSlice.jsx";
import { cookies, isValidEmail, SITE_KEY_RECAPTCHA, timeRefreshToken } from "../common/Utility.jsx";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { setAppName } from "../redux/GeneralSlice.jsx";

function LoginPage(props){
  const [loading,setLoading] = useState(false);
  const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [userEmailError, setEmailError] = useState();
	const [passwordError, setPasswordError] = useState();
	const dispatch = useDispatch();
	const nav = useNavigate();
  const {t} = useTranslation();
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t('login')}`));
  },[])
  
	const loginSubmit = (e) => {
    e.preventDefault();
		if (!email) setEmailError(t('email is required'));
    else if (!isValidEmail(email)) setEmailError(t("email is incorrect format"));
		else if (!password) setPasswordError(t('password is required'));
		else {
			setLoading(true);
      executeRecaptcha('login').then(token => 
        postToServer('/v1/auth/login', { email: email, password: password, tokenRecaptcha: token }).then((result) => {
          const timeRefresh = timeRefreshToken();
          cookies.set('accessToken', result.data.accessToken, { path: '/', domain:process.env.DOMAIN , sameSite: "strict", secure: true });
          cookies.set('refreshToken', result.data.refreshToken, { path: '/', domain:process.env.DOMAIN , sameSite: "strict", expires: timeRefresh, secure: true });
          delete result.data.accessToken;
          delete result.data.refreshToken;
          dispatch(setDataDoctor(result.data));
          nav("/");
        })
        .catch((err) => toast.error(t(err.message))).finally(() => setLoading(false))
      );
		}
	};

  return <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        height: '100%',
        backgroundImage: `url("/assets/images/login_background.jpg")`,
        backgroundSize: '100% 100%',
      }}>
      <NavbarComponent />
      <div
        className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
        style={{ width: '360px' }}>
        <h1 className="my-4 text-center  text-capitalize mc-color fw-bold">
          {t('login')}
        </h1>
        <form className={`mb-3 d-flex align-items-center justify-content-between input-group form-control border`}>
          <input
            type="email"
            className="border-0 flex-grow-1"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            onKeyDown={e=>{if(e.key === "Enter") loginSubmit(e)}}
            placeholder={t("Email")}
            autoComplete="off"
            style={{ height: '45px', outline: 'none' }}
          />
          <span className="material-symbols-outlined mc-color">person</span>
        </form>
        {userEmailError && (
          <p className="d-flex align-items-center" style={{ color: 'red', width: '100%' }}>
            <span className="material-symbols-outlined me-1" style={{ color: 'red' }}>
              error
            </span>
            {userEmailError}
          </p>
        )}
        <form
          className={`mb-3 d-flex align-items-center justify-content-between input-group border form-control border`}>
          <input
            type="password"
            className="border-0 flex-grow-1"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
            }}
            onKeyDown={e=>{if(e.key === "Enter") loginSubmit(e)}}
            placeholder={t("password")}
            autoComplete="off"
            style={{ height: '45px', outline: 'none' }}
          />
          <span className="material-symbols-outlined mc-color">password</span>
        </form>
        {passwordError && (
          <p className="d-flex align-items-center" style={{ color: 'red', width: '100%' }}>
            <span className="material-symbols-outlined me-1" style={{ color: 'red' }}>
              error
            </span>
            {passwordError}
          </p>
        )}
        <div className="d-flex justify-content-end mb-4 text-capitalize mc-color-hover" style={{ width: '100%' }}>
          <Link style={{textDecoration:"none"}} to={"/forgotPassword"}>
            <span className="text-capitalize mc-color-hover mc-color">
              {t('forgot Password?')}
            </span>
          </Link>
        </div>
        <span className="my-2"></span>
        {loading ? <div className="spinner-grow"></div> : <ButtonComponent label={t('login')} onClick={e=>loginSubmit(e)} />}
        <div className="mt-3 d-flex align-items-center justify-content-center">
          <hr style={{ width: '140px' }} />
          <span className="mx-3 text-uppercase">or</span>
          <hr style={{ width: '140px' }} />
        </div>
        <div className="mt-3 d-flex flex-row justify-content-end w-100">
          <span className="me-1 text-gray">{t(`Don't have an account`)}: </span>
          <Link className='text-capitalize mc-color-hover mc-color' to={'/register'} style={{textDecoration:"none"}}>{t('register')}</Link>
        </div>
      </div>
    </div>
}

export default function Login(){
  return (
    <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY_RECAPTCHA}>
      <LoginPage />
    </GoogleReCaptchaProvider>
  )
}