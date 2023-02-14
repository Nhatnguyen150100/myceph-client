import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Myclinic(props){
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const doctor = useSelector(state=>state.doctor.data);
  const nav = useNavigate();

  return <div>
    Clinic
  </div>
}