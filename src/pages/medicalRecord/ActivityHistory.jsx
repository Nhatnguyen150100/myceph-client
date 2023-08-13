import React from 'react'
import { FONT_SIZE, SELECT_PATIENT_MODE, convertISOToVNDateString, getHoursMinutesSeconds, splitAvatar, toISODateString } from '../../common/Utility.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { setDoctorSettingTab, setLoadingModal, setSettingTab } from '../../redux/GeneralSlice.jsx';
import { deleteToServerWithToken, getToServerWithToken } from '../../services/getAPI.jsx';
import { useState } from 'react';
import { refreshToken } from '../../services/refreshToken.jsx';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Pagination, Select } from '@mui/material';
import { setOtherEmailDoctor } from '../../redux/DoctorSlice.jsx';
import IconButtonComponent from '../../common/IconButtonComponent.jsx';

const PAGE_SIZE = 3;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export default function ActivityHistory(props) {
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);

  const [activityArray,setActivityArray] = useState([])
  const [arrayDoctorAdmin,setArrayDoctorAdmin] = useState([])
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  const [filterByDoctor,setFilterByDoctor] = useState('')
  const [filterByDate,setFilterByDate] = useState('')

  const [page,setPage] = useState(1);
  const [count,setCount] = useState(0);

  useEffect(()=>{
    if(patient.currentPatient?.id) getActivityHistory()
  },[patient.currentPatient,page,filterByDoctor,filterByDate])

  const roleCheck = ((selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor === 'admin') || selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT);

  const handleChangeFilterDoctor = (event) => {
    setFilterByDoctor(event.target.value)
  }

  const getActivityHistory = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/activityHistory/${patient.currentPatient.id}?page=${page}&pageSize=${PAGE_SIZE}&mode=${props.checkRoleMode}&idDoctor=${doctor?.data.id}&searchDoctor=${filterByDoctor}&searchDate=${filterByDate}`).then(result => {
        setCount(result.count);
        setActivityArray(result.data)
        setArrayDoctorAdmin(result.arrayDoctorAdmin)
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getActivityHistory());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }

  const deleteActivityHistory = (idActivityHistory) => {
    if(window.confirm(t('Do you want delete this activity history?'))){
      return new Promise((resolve, reject) => {
        dispatch(setLoadingModal(true));
        deleteToServerWithToken(`/v1/activityHistory/${patient.currentPatient.id}?id=${idActivityHistory}&page=${page}&pageSize=${PAGE_SIZE}&mode=${props.checkRoleMode}&idDoctor=${doctor?.data.id}&searchDoctor=${filterByDoctor}&searchDate=${filterByDate}`).then(result => {
          setCount(result.count);
          setActivityArray(result.data)
          setArrayDoctorAdmin(result.arrayDoctorAdmin)
          resolve();
        }).catch(err =>{
          if(err.refreshToken && !isRefresh){
            refreshToken(nav,dispatch).then(()=>deleteActivityHistory(idActivityHistory));
          }else{
            toast.error(t(err.message));
          }
          reject();
        }).finally(()=>dispatch(setLoadingModal(false)));
      });
    }
  }

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const toProfile = (email) => {
    nav('/setting')
    if(doctor.data.email===email){
      dispatch(setSettingTab(0));
      dispatch(setDoctorSettingTab(0));
    }else{
      dispatch(setSettingTab(0));
      dispatch(setDoctorSettingTab(1));
      dispatch(setOtherEmailDoctor(email));
    }
  }

  const onChangePage = (event,value) => {
    setPage(value);
  }

  return (
    <div className="w-100">
      {
        roleCheck ? 
        <React.Fragment>
          <div className='d-flex flex-column'>
            <div className='d-flex flex-row my-2'>
              <FormControl sx={{ mt: 1, width: 250 }} size="small">
                <InputLabel id="doctor-label">{t('Filter by doctor')}</InputLabel>
                <Select
                  labelId="doctor-label"
                  id="filter-doctor"
                  value={filterByDoctor}
                  displayEmpty
                  onChange={handleChangeFilterDoctor}
                  input={<OutlinedInput label="Filter by doctor" />}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="All doctor">{t('All doctor')}</MenuItem>
                  {arrayDoctorAdmin?.map((doctor) => (
                    <MenuItem
                      key={doctor.id}
                      value={doctor.id}
                    >
                      {doctor.fullName?doctor.fullName:doctor.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <fieldset className="border rounded px-1 ms-3" style={{fontSize:"small"}}>
                <legend className="d-flex align-items-center float-none px-0 ms-auto me-2 w-auto">
                  <span className="px-2 d-md-block d-none text-gray" style={{fontSize:FONT_SIZE}}>
                    {t('Filter by date')}
                  </span>
                </legend>
                <input className="border-0 p-0 form-input mx-2" style={{outline:"none"}} type={"date"} value={filterByDate?toISODateString(new Date(filterByDate)):''} onChange={e=>setFilterByDate(e.target.value)}/>
              </fieldset>
            </div>
            <div className='p-0 m-0'>
              {
                activityArray?.map(ac => {
                  return <fieldset className="border rounded px-1 w-100 mb-2 btn-hover-bg" style={{fontSize:"small",cursor:"pointer"}} key={ac.id} >
                    <legend className="d-flex align-items-center float-none px-0 ms-auto me-2 w-auto mc-background-color-white">
                      <div className="border rounded d-flex align-items-center py-1">
                        <span className="px-2 d-md-block d-none text-gray" style={{fontSize:FONT_SIZE}}>
                          {t('change date')}:
                        </span>
                        <fieldset className="border rounded px-1 border-0 " style={{fontSize:"small"}}>
                          <input className="border-0 p-0 form-input" style={{outline:"none"}} type={"date"} value={toISODateString(new Date(ac.createdAt))} disabled/>
                        </fieldset>
                      </div>
                    </legend>
                    <div className='d-flex flex-row justify-content-between align-items-center rounded'>
                      <div className='d-flex align-items-center justify-content-center mb-3'>
                        <div className='ms-2 me-4'>
                          <img alt="avatar" className="rounded" src={splitAvatar(ac['Doctor.avatar'],'/assets/images/doctor.png')} style={{height:"100px",width:"90px",objectFit:"cover"}}/>
                        </div>
                        <div className='d-flex flex-column me-5 h-100'>
                          <div className='d-flex align-items-center justify-content-start transform-hover' onClick={e=>toProfile(ac['Doctor.email'])}>
                            <label className='text-capitalize fw-bold mc-color' style={{fontSize:FONT_SIZE}}>
                              {t('email')}:
                            </label>
                            <span className='tex-gray ms-3' style={{fontSize:FONT_SIZE}}>
                              {ac['Doctor.email']}
                            </span>
                          </div>
                          {
                            ac['Doctor.fullName'] ? 
                            <div className='d-flex align-items-center justify-content-start'>
                              <label className='text-capitalize fw-bold mc-color' style={{fontSize:FONT_SIZE}}>
                                {t('fullName')}:
                              </label>
                              <span className='tex-gray ms-3' style={{fontSize:FONT_SIZE}}>
                                {ac['Doctor.fullName']}
                              </span>
                            </div>
                            :
                            ''
                          }
                          <div className='d-flex align-items-center justify-content-start'>
                            <label className='text-capitalize fw-bold mc-color' style={{fontSize:FONT_SIZE}}>
                              {t('gender')}:
                            </label>
                            <span className='tex-gray ms-3' style={{fontSize:FONT_SIZE}}>
                              {ac['Doctor.gender']?t(ac['Doctor.gender']):t('no data')}
                            </span>
                          </div>
                          <div className='d-flex align-items-center justify-content-start'>
                            <label className='text-capitalize fw-bold mc-color' style={{fontSize:FONT_SIZE}}>
                              {t('date of birth')}:
                            </label>
                            <span className='tex-gray ms-3' style={{fontSize:FONT_SIZE}}>
                              {ac['Doctor.birthday']?convertISOToVNDateString(toISODateString(new Date(ac['Doctor.birthday']))):t('no data')}
                            </span>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-start h-100 justify-content-start'>
                          <div className='d-flex align-items-center justify-content-start'>
                            <label className='text-capitalize fw-bold mc-color' style={{fontSize:FONT_SIZE}}>
                              {t('file change')}:
                            </label>
                            <span className='tex-gray ms-3' style={{fontSize:FONT_SIZE}}>
                              {t(ac.fileChange)}
                            </span>
                          </div>
                          <div className='d-flex align-items-center justify-content-start'>
                            <label className='text-capitalize fw-bold mc-color' style={{fontSize:FONT_SIZE}}>
                              {t('content change')}:
                            </label>
                            <span className='tex-gray ms-3' style={{fontSize:FONT_SIZE}}>
                              {ac.contentChange}
                            </span>
                          </div>
                          <div className='d-flex align-items-center justify-content-start'>
                            <label className='text-capitalize fw-bold mc-color' style={{fontSize:FONT_SIZE}}>
                              {t('at')}:
                            </label>
                            <span className='tex-gray ms-3' style={{fontSize:FONT_SIZE}}>{getHoursMinutesSeconds(new Date(ac.createdAt))}</span>
                            <span className='mx-2 fw-bold' style={{fontSize:FONT_SIZE}}>-</span>
                            <span className='tex-gray' style={{fontSize:FONT_SIZE}}>
                              {convertISOToVNDateString(toISODateString(new Date(ac.createdAt)))}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="border-start mx-2 d-flex align-items-center justify-content-center">
                        <IconButtonComponent className="btn-outline-danger border-0 h-100 ms-2" icon="delete" FONT_SIZE_ICON={"40px"} onClick={e=>deleteActivityHistory(ac.id)} title={t("delete this history")}/>                 
                      </div>
                    </div>
                  </fieldset>
                })
              }
            </div>
          </div>
          <div className="d-flex flex-grow-1 justify-content-center mt-3 mb-5">
            {
              count > 1 && <Pagination 
                  count={Math.ceil(count/PAGE_SIZE) || 0}
                  page={page}
                  onChange={onChangePage}
                  variant="outlined"
                color="primary"
              />
            }
          </div>
        </React.Fragment>
        :
        <div className="h-100 w-100 d-flex justify-content-center align-items-center mt-5">
          <h2 className="text-danger fw-bold text-capitalize">{t("doctor is not admin can't available this page")}</h2>
        </div>
      }
    </div>
  )
}
