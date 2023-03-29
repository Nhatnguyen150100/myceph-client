import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import NavbarComponent from "../component/NavbarComponent.jsx";

export default function NotFoundPage(props){
  const {t} = useTranslation();

  return <div className="h-100 w-100 container-fluid">
    <NavbarComponent />
    <div className="d-flex flex-column w-100 h-100 justify-content-start align-items-center text-capitalize">
      <img alt={t('page not found')} src="/assets/images/page-not-found.png" style={{
      height: '70%',
      backgroundSize: 'cover',
    }}/>
    <h3 className="text-uppercase text-center mc-color fw-bold">
      {t('page not found')}
    </h3>
    <span className="text-capitalize text-center text-gray mt-2">
      {t("Sorry, this page isn't available!")}
    </span>
    <div className="my-3" style={{maxWidth:"350px"}}>
      <Link to={"/"} className="fw-bold text-uppercase btn rounded-pill btn-primary py-2 px-4 my-3 fw-bold fs-4" style={{borderRadius:"10px"}}>
        {t('back to homepage')}
      </Link>
    </div>
    </div>
  </div>
}