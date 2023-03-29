import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../common/ConfirmComponent.jsx";
import { FONT_SIZE, SELECT_PATIENT_MODE } from "../../common/Utility.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { setGetAllPatientDoctor } from "../../redux/PatientSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";
import PatientRows from "./PatientRows.jsx";

const PAGE_SIZE = 5;
let nameSearchTimeout = null;

export default function MyPatient(props){
  const loading = useSelector(state=>state.general.loading);
  const getAllPatientDoctor = useSelector(state=>state.patient.getAllPatientDoctor);
  const doctor = useSelector(state=>state.doctor.data);
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
    nameSearchTimeout = setTimeout(getAllPatientForDoctor,500,e.target.value);
  }

  const getAllPatientForDoctor = (name) => {
    return new Promise((resolve, reject) => {
      setLoadingSearch(true);
      getToServerWithToken(`/v1/patient/getPatientListForDoctor/${doctor.id}?page=${page}&pageSize=${PAGE_SIZE}&nameSearch=${name?name:''}`).then(result=>{
        if(result.data.length===0 && page>1) setPage(page-1);
        setListPatient(result.data);
        setCount(result.count);
        dispatch(setGetAllPatientDoctor(false));
        resolve();
      }).catch((err) =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getAllPatientForDoctor(name));
        }else{
          toast.error(err.message);
        }
        reject(err);
      }).finally(() =>{
        setLoadingSearch(false);
      });
    })
  }

  const deletePatient = (idPatient) => {
    if(idPatient===idPatientDelete){
      setOpenDeleteConfirm(false);
      return new Promise((resolve, reject) => {
        dispatch(setLoadingModal(true));
        deleteToServerWithToken(`/v1/patient/deletePatient/${idPatient}`).then(result=>{
          getAllPatientForDoctor().then(()=>{
            toast.success(result.message);
            resolve();
          });
        }).catch((err) =>{
          reject(err);
        }
        ).finally(() =>{
          dispatch(setLoadingModal(false));
        });
      })
    }else toast.error(t('Id patient not match'));
  }

  const onChangePage = (event,value) => {
    setPage(value);
  }

  useEffect(()=>{
    if(doctor) getAllPatientForDoctor();
    else nav('/login');
  },[page])

  useEffect(()=>{
    if(getAllPatientDoctor) getAllPatientForDoctor();
  },[getAllPatientDoctor])

  const handleClose = () => {
    setOpenDeleteConfirm(false);
  };

  const onDeleteHandle = (idPatient) =>{
    setOpenDeleteConfirm(true);
    setIdPatientDelete(idPatient);
  }

  return <div className="h-100 w-100 container">
      <table className="table table-bordered table-striped text-center rounded my-4">
        <thead className='mc-background text-white text-uppercase'>
          <tr>
            <th className='align-middle mc-heading-middle d-lg-table-cell d-none text-uppercase' style={{fontSize:FONT_SIZE}}>stt</th>
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
            <th className='align-middle mc-heading-middle d-lg-table-cell' style={{fontSize:FONT_SIZE}}>{t("action")}</th>
          </tr>
        </thead>
        {
          (!loadingSearch || listPatient.length>0) && 
          <React.Fragment>
            <tbody>{listPatient.map((patient, index) => <PatientRows key={patient.id} stt={index} selectPatientMode={SELECT_PATIENT_MODE.MY_PATIENT} patient={patient} action={true} onDeleteHandle={idPaient=>onDeleteHandle(idPaient)} />)}</tbody>
            {
              listPatient.length!==0 && <tfoot className="align-middle">
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
    {
      loadingSearch && <div className="d-flex flex-grow-1 justify-content-center w-100">
        <div className="spinner-grow"></div>
      </div>
    }
    {
      listPatient.length===0 && !loading && !loadingSearch && <div className="d-flex justify-content-center flex-column align-items-center mt-5">
        <img className="text-capitalize" src="/assets/images/notFound.png" height={"150px"} alt={t("can't found your patient")} />
        <span className="text-danger text-capitalize mt-2">{t("can't found your patient")}</span>
      </div>
    }
    <ConfirmComponent 
      FONT_SIZE={FONT_SIZE}
      open={openDeleteConfirm} 
      title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm delete this patient')}</span>} 
      content={
        <div>
          <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('To delete this patient, enter the id')}</span>
          <span style={{fontSize:FONT_SIZE}} className="text-danger fw-bold">{idPatientDelete}</span>
          <span className="ms-1" style={{fontSize:FONT_SIZE}}>{t('in the box below and press agree')}</span>
          <p className="fst-italic m-0 text-danger" style={{fontSize:FONT_SIZE}}>{t("ATTENTION: All patient data including records and image will be deleted")}</p>
        </div>
      } 
      label={t('Id patient')}
      handleClose={handleClose} 
      handleSubmit={value=>deletePatient(value)}
    />
  </div>
}