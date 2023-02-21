import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAllSclice } from "../../common/Utility";
import { setGetAllPatientClinic, setGetAllPatientDoctor } from "../../redux/PatientSlice";
import { getToServerWithToken } from "../../services/getAPI";

const PAGE_SIZE = 5;
let nameSearchTimeout = null;
export default function PatientOfClinic(props){
  const clinic = useSelector(state=>state.clinic)
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [listPatient,setListPatient] = useState([]);
  const [nameSearch,setNameSearch] = useState('');
  const [loadingSearch,setLoadingSearch] = useState(false);
  const [count,setCount] = useState();
  const [page,setPage] = useState(1);
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);
  const [idPatientDelete,setIdPatientDelete] = useState();

  const onNameSearchChange = e => {
    setNameSearch(e.target.value);
    if (nameSearchTimeout) clearTimeout(nameSearchTimeout);
    nameSearchTimeout = setTimeout(getAllPaitentForDoctor,300,e.target.value);
  }

  const getAllPaitentForDoctor = (name) => {
    return new Promise((resolve, reject) => {
      setLoadingSearch(true);
      getToServerWithToken(`/v1/patient/getPatientListForClinic/${clinic.idClinicDefault}?page=${page}&pageSize=${PAGE_SIZE}&nameSearch=${name?name:''}`).then(result=>{
        if(result.data.length===0 && page>1) setPage(page-1);
        setListPatient(result.data);
        setCount(result.count);
        dispatch(setGetAllPatientClinic(false));
        resolve();
      }).catch((err) =>{
        if(err.isLogin===false){
          clearAllSclice(dispatch);
          nav("/login");
        }else{
          reject(err);
        }
      }
      ).finally(() =>{
        setLoadingSearch(false);
      });
    })
  }
  return <div className="h-100 w-100 container">

  </div>
}