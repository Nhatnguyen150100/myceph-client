import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../redux/GeneralSlice.jsx";
import i18n from '../translation/i18n.jsx';

export default function NavbarComponent(props) {
  const language = useSelector(state => state.general.language);
  const dispatch  = useDispatch();

  const changeLanguage = value => {
    i18n.changeLanguage(value);
  }

  console.log(language);

  return <div className="container-fluid border-bottom">
    <div className="container">
      <div className="d-flex flex-row justify-content-between align-items-center py-2">
        <div className="d-flex flex-row justify-content-start align-items-center">
          <img style={{height:"45px"}} src="/assets/icons/logo-mc.png" alt='logo' />
        </div>
        <div className="dropdown">
          <button className="btn border-0 dropdown-toggle d-flex flex-row align-items-center px-2 text-gray" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{outline:"none"}}>
            {
              language === 'en' ? <div className="d-flex flex-row align-items-center" style={{background:"transparent"}}>
                <img className="me-1" src="/assets/icons/flag-en.png" style={{height:"30px",background:"transparent"}} alt=""/>
                <span className="text-capitalize greenlight-color-hover" style={{background:"transparent"}}>english</span>
              </div>
              :
              <div className="d-flex flex-row align-items-center" style={{background:"transparent"}}>
                <img className="me-1" src="/assets/icons/flag-vi.png" style={{height:"30px",background:"transparent"}} alt=""/>
                <span className="text-capitalize greenlight-color-hover" style={{background:"transparent"}}>vietnamese</span>
              </div>
            }
          </button>
          <ul className="dropdown-menu py-0 px-1 border">
            {
              language === 'vi' ? <li className="w-100">
                <button className="btn d-flex flex-row align-items-center w-100 border-0" onClick={e=>{dispatch(setLanguage('en'));changeLanguage('en')}}>
                  <img className="me-1" src="/assets/icons/flag-en.png" style={{height:"30px",background:"transparent"}} alt=""/>
                  <span className="text-capitalize greenlight-color-hover" style={{background:"transparent"}}>english</span>
                </button>
              </li>
              :
              <li className="w-100">
                <button className="btn d-flex flex-row align-items-center w-100 border-0" onClick={e=>{dispatch(setLanguage('vi'));changeLanguage('vi')}}>
                  <img className="me-1" src="/assets/icons/flag-vi.png" style={{height:"30px",background:"transparent"}} alt=""/>
                  <span className="text-capitalize greenlight-color-hover" style={{background:"transparent"}}>vietnamese</span>
                </button>
              </li>
            }
          </ul>
        </div>
      </div>
    </div>
  </div>
}