import { Pagination } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FONT_SIZE, SELECT_PATIENT_MODE } from "../../common/Utility.jsx";
import { getToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";
import PatientRows from "./PatientRows.jsx";

const PAGE_SIZE = 6;
let nameSearchTimeout = null;

export default function MySharedPatient(props){
  const {t} = useTranslation();
  const doctor = useSelector(state=>state.doctor.data);
  const [nameSearch,setNameSearch] = useState('');
  const [listSharedPatient,setListSharedPatient] = useState([]);
  const [loadingSearch,setLoadingSearch] = useState(false);
  const [page,setPage] = useState(1);
  const [count,setCount]= useState();
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(()=>{
    if(doctor) getListSharePatientOfCurrentDoctor('');
  },[page]);
  
  const onChangePage = (event,value) => {
    setPage(value);
  }

  const onNameSearchChange = e => {
    setNameSearch(e.target.value);
    if (nameSearchTimeout) clearTimeout(nameSearchTimeout);
    nameSearchTimeout = setTimeout(getListSharePatientOfCurrentDoctor,300,e.target.value);
  }

  const getListSharePatientOfCurrentDoctor = (name) => {
    return new Promise((resolve, reject) => {
      setLoadingSearch(true);
      getToServerWithToken(`/v1/sharePatient/getListSharePatientOfCurrentDoctor/${doctor.id}?page=${page}&pageSize=${PAGE_SIZE}&nameSearch=${name?name:''}`).then(result=>{
        if(result.data.length===0 && page>1) setPage(page-1);
        setListSharedPatient(result.data);
        setCount(result.count);
        resolve();
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getListSharePatientOfCurrentDoctor(name));
        }else{
          toast.error(err.message);
        }
        reject(err);
      }).finally(() =>{
        setLoadingSearch(false);
      });
    })
  }


  return <div className="h-100 w-100 container">
    <table className="table table-bordered table-striped text-center rounded my-4">
      <thead className='mc-background text-white text-uppercase'>
        <tr>
          <th colSpan={2} style={{minWidth:"350px",fontSize:FONT_SIZE}}>
            <div className={`d-flex align-items-center justify-content-between border form-control w-100`} >
              <input type="text" className="border-0 flex-grow-1 w-100" placeholder={t("Enter patient name to search")} style={{ outline: "none" }} value={nameSearch} onChange={onNameSearchChange}/>
              <span className="material-symbols-outlined vc-teal fw-bolder">search</span>
            </div>
          </th>
          <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{fontSize:FONT_SIZE}}>{t("date of birth")}</th>
          <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{maxWidth:"80px",fontSize:FONT_SIZE}}>{t("gender")}</th>
          <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{minWidth:"150px",fontSize:FONT_SIZE}}>{t("note")}</th>
          <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{fontSize:FONT_SIZE}}>{t("feature")}</th>
          <th className='align-middle mc-heading-middle d-lg-table-cell' style={{fontSize:FONT_SIZE}}>{t("Shared by doctor")}</th>
        </tr>
      </thead>
      {
        (!loadingSearch || listSharedPatient.length>0) && 
        <React.Fragment>
          <tbody>{listSharedPatient.map((patient, index) => <PatientRows selectPatientMode={SELECT_PATIENT_MODE.SHARE_PATIENT} key={patient.id} patient={patient} shareByDoctor={true} action={false}/>)}</tbody>
          {
            listSharedPatient.length!==0 && <tfoot className="align-middle">
              <tr>
                <td colSpan={8} align='center'>
                  <div className="d-flex flex-grow-1 justify-content-center">
                  <Pagination 
                      count={Math.ceil(count/PAGE_SIZE) || 0}
                      page={page}
                      onChange={onChangePage}
                      variant="outlined"
                      color="primary"
                    />
                  </div>
                </td>
              </tr>
            </tfoot>
          }
        </React.Fragment>
      }
    </table>
  </div>
}