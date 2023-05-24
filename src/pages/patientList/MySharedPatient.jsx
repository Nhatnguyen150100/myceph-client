import { Pagination } from "@mui/material";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addData, DB_ENCRYPTION_SHAREPATIENT, deleteData, disConnectIndexDB, getAllData, onOpenIndexDB } from "../../common/ConnectIndexDB.jsx";
import { findObjectFromArray, FONT_SIZE, removeVietnameseDiacritics, SELECT_PATIENT_MODE } from "../../common/Utility.jsx";
import { getToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";
import PatientRows from "./PatientRows.jsx";
import * as bootstrap from 'bootstrap';
import { setArrayEncryptKeySharePatient } from "../../redux/PatientSlice.jsx";

const PAGE_SIZE = 6;
let nameSearchTimeout = null;

export default function MySharedPatient(props){
  const {t} = useTranslation();
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const doctor = useSelector(state=>state.doctor.data);
  const arrayEncryptKeySharePatient = useSelector(state=>state.patient.arrayEncryptKeySharePatient);

  const [nameSearch,setNameSearch] = useState('');
  const [listSharedPatient,setListSharedPatient] = useState([]);
  const [loadingSearch,setLoadingSearch] = useState(false);
  const [page,setPage] = useState(1);
  const [count,setCount]= useState();
  const [selectedPatient,setSelectedPatient] = useState();
  const [encryptKeySelectedPatient,setEncryptKeySelectedPatient] = useState();
  const [indexDB,setIndexDB] = useState(null);

  const dispatch = useDispatch();
  const nav = useNavigate();

  const keyManagementModal = useRef();
  const keyManagementRef = useRef();

  useEffect(()=>{
    if(doctor) getListSharePatientOfCurrentDoctor('');
  },[page]);

  useEffect(() => {
    keyManagementModal.current = new bootstrap.Modal(keyManagementRef.current, {});
  }, [])

  useEffect(()=>{
    onOpenIndexDB(DB_ENCRYPTION_SHAREPATIENT).then(db=>setIndexDB(db)).catch(error => toast.error(error));
    return () => {
      disConnectIndexDB(indexDB);
    }
  },[])

  useEffect(()=>{
    if(indexDB){
      getAllData(indexDB,DB_ENCRYPTION_SHAREPATIENT).then(data => 
        dispatch(setArrayEncryptKeySharePatient(data))
      ).catch(error => toast.error(t(error)));
    }
  },[indexDB])
  
  const onChangePage = (event,value) => {
    setPage(value);
  }

  const onNameSearchChange = e => {
    setNameSearch(e.target.value);
    if (nameSearchTimeout) clearTimeout(nameSearchTimeout);
    nameSearchTimeout = setTimeout(getListSharePatientOfCurrentDoctor,500,e.target.value);
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
        if(err.refreshToken && !isRefresh){
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

  const upLoadFileJson = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      const data = JSON.parse(e.target.result);
      addData(indexDB,data,DB_ENCRYPTION_SHAREPATIENT).then(message => {
        setEncryptKeySelectedPatient({key: data.key, iv: data.iv});
        getAllData(indexDB,DB_ENCRYPTION_SHAREPATIENT).then(data => 
          dispatch(setArrayEncryptKeySharePatient(data))
        ).catch(error => toast.error(t(error)));
        keyManagementModal.current.hide();
        toast.success(t(message))
      }).catch(error => toast.error(t(error)));
    };
  }

  const downLoadFileJson = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({...encryptKeySelectedPatient})
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `crypto_Key_For_Share_Patient_${removeVietnameseDiacritics(selectedPatient.fullName)}.json`;
    link.click();
  };

  const deleteEncryptionKey = () => {
    if(indexDB && window.confirm(t('Are you want to remove this encryption key from device?'))) deleteData(indexDB,encryptKeySelectedPatient.id,DB_ENCRYPTION_SHAREPATIENT).then(message => {
      getAllData(indexDB,DB_ENCRYPTION_SHAREPATIENT).then(data => 
        dispatch(setArrayEncryptKeySharePatient(data))
      ).catch(error => toast.error(t(error)));
      setEncryptKeySelectedPatient(null);
      toast.success(t(message));
      keyManagementModal.current.hide();
    }).catch(error => toast.error(t(error)));
    else toast.error(t('Can not connect to the database'));
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
          <th className='align-middle mc-heading-middle d-lg-table-cell' style={{fontSize:FONT_SIZE}}>{t("shared by doctor")}</th>
        </tr>
      </thead>
      {
        (!loadingSearch || listSharedPatient.length>0) && 
        <React.Fragment>
          <tbody>{listSharedPatient.map((patient, index) => 
            <PatientRows 
              stt={index} 
              encryptKeyObject={findObjectFromArray(arrayEncryptKeySharePatient,patient?.idPatientOfDoctor)} 
              onSetEncryptKeySelectedPatient={key=>setEncryptKeySelectedPatient(key)} 
              onShowModal={patient=>{setSelectedPatient(patient);keyManagementModal.current.show()}} 
              selectPatientMode={SELECT_PATIENT_MODE.SHARE_PATIENT} key={patient.id} 
              patient={patient} 
              shareByDoctor={true} 
              action={false}
            />)}
          </tbody>
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
    {
      listSharedPatient.length===0 && !loadingSearch && <div className="d-flex justify-content-center flex-column align-items-center mt-5">
        <img className="text-capitalize" src="/assets/images/notFound.png" height={"150px"} alt={t("can't found your patient")} />
        <span className="text-danger text-capitalize mt-2">{t("can't found your patient")}</span>
      </div>
    }
    <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true" ref={keyManagementRef}>
      <div className="modal-dialog modal-dialog-centered modal-lg justify-content-center ">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title mc-color fw-bold text-capitalize">{t('Manage patient encryption key')}: {selectedPatient?.fullName}</h5>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-column h-100">
              <div className="d-flex flex-row align-items-center justify-content-center">
                {
                  encryptKeySelectedPatient ? 
                  <React.Fragment>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary py-1 px-2 d-flex align-items-center justify-content-center"
                      style={{cursor:"pointer"}}
                      onClick={downLoadFileJson}
                    >
                      <span className="material-symbols-outlined fw-bold " style={{fontSize:"30px"}}>
                        download
                      </span>
                      <span className="text-capitalize mx-2" style={{cursor:"pointer"}}>{t('download json encryption key')}</span>
                    </button>
                    <div className="mx-3">
                      <hr style={{ width: '100px' }}/>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-outline-danger py-1 px-2 d-flex align-items-center justify-content-center"
                      onClick={deleteEncryptionKey}
                    >
                      <span className="material-symbols-outlined fw-bold me-2" style={{fontSize:"30px"}}>
                        delete
                      </span>
                      <span className="text-uppercase mx-2">{t('remove encryption key from device')}</span>
                    </button>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary py-1 px-2 d-flex align-items-center justify-content-center"
                      style={{cursor:"pointer"}}
                    >
                      <span className="material-symbols-outlined fw-bold me-2" style={{fontSize:"30px"}}>
                        upload
                      </span>
                      <label htmlFor="upload_json" className="text-capitalize" style={{cursor:"pointer"}}>{t('upload a encryption key')}</label>
                      <input id="upload_json" className="d-none" type={'file'} accept=".json" onChange={upLoadFileJson}/>
                    </button>
                  </React.Fragment>
                }
              </div>
              <div className="mt-3 d-flex flex-column justify-content-center align-items-center mb-3 mx-5">
                <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('Encryption key was generate by')} <span className="mc-color fw-bold fs-5">{selectedPatient?.['Doctor.fullName']}</span></span>
                <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('Encryption key is stored in browser and cannot be recovered if browser is uninstalled.')}</span>
                <span className="text-gray" style={{fontSize:FONT_SIZE}}>{t('We strongly advise you to export encryption key to a secured location in your computer so it can be recovered once necessary.')}</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
}