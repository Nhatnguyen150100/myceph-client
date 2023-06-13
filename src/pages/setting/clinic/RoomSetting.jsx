import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../../common/ConfirmComponent.jsx";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import { FONT_SIZE } from "../../../common/Utility.jsx";
import SelectPatientComponent from "../../../components/SelectPatientComponent.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

export default function RoomSetting(props){
  const {t} = useTranslation();
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic);
  const dispatch = useDispatch();
  const nav = useNavigate();


  const [arrayRoom,setArrayRoom] = useState([]);
  const [newRoom,setNewRoom] = useState('');
  const [colorRoom,setColorRoom] = useState('#ffffff');
  const [editRoomId,setEditRoomId] = useState('');
  const [editNameRoom,setEditNameRoom] = useState();
  const [editColorRoom,setEditColorRoom] = useState();
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  useEffect(()=>{
    if(clinic.idClinicDefault) getListRoom();
  },[clinic.idClinicDefault])

  const getListRoom = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/roomOfClinic/${clinic.idClinicDefault}`).then(result => {
        setArrayRoom(result.data);
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getListRoom());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const createRoom = () =>{
    if(!newRoom) toast.error(t('Name of room is required'));
    else{
      return new Promise((resolve, reject) =>{
        dispatch(setLoadingModal(true));
        postToServerWithToken(`/v1/roomOfClinic/${clinic.idClinicDefault}`,{
          nameRoom: newRoom,
          colorRoom: colorRoom
        }).then(result => {
          setArrayRoom(result.data);
          setNewRoom('');
          setColorRoom('#ffffff');
          toast.success(t(result.message));
          resolve();
        }).catch((err) => {
          if(err.refreshToken){
            refreshToken(nav,dispatch).then(()=>createRoom());
          }else{
            toast.error(t(err.message));
          }
          reject(err.message);
        }).finally(() => dispatch(setLoadingModal(false)));
      })
    }
  }

  const updateRoom = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      putToServerWithToken(`/v1/roomOfClinic/${clinic.idClinicDefault}`,{
        idRoom: editRoomId,
        nameRoom: editNameRoom,
        colorRoom: editColorRoom
      }).then(result => {
        setArrayRoom(result.data);
        setEditColorRoom('');
        setEditNameRoom('');
        setEditRoomId('');
        toast.success(t(result.message));
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>updateRoom());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)));
    })
  }

  const deleteRoom = () =>{
    return new Promise((resolve, reject) =>{
      setOpenDeleteConfirm(false);
      dispatch(setLoadingModal(true));
      deleteToServerWithToken(`/v1/roomOfClinic/${clinic.idClinicDefault}?idRoom=${editRoomId}`).then(result => {
        setArrayRoom(result.data);
        setEditColorRoom('');
        setEditNameRoom('');
        setEditRoomId('');
        toast.success(t(result.message));
        resolve();
      }).catch((err) => {
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>deleteRoom());
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => {dispatch(setLoadingModal(false));setOpenDeleteConfirm(false);setEditRoomId('');setEditNameRoom('')});
    })
  }

  const handleClose = () => {
    setOpenDeleteConfirm(false);
  }

  return <div className="w-100 h-100 py-3">
    <div style={{width:"400px"}}>
      <SelectPatientComponent condition={true} showSelectedPatient={false}/>
    </div>
    <h4 className="text-capitalize mc-color mt-1 text-center fw-bold">{t('list rooms of clinic')}</h4>
    <table className="table table-bordered table-striped text-center rounded my-4">
      <thead className='mc-background text-white text-uppercase'>
        <tr>
          <th className='align-middle mc-heading-middle d-lg-table-cell d-none text-uppercase' style={{fontSize:FONT_SIZE}}>stt</th>
          <th className="name-width" style={{minWidth:"350px",fontSize:FONT_SIZE}}>
            <div className={`d-flex align-items-center justify-content-between border form-control w-100`} >
              <input 
                type="text" 
                disabled={clinic.roleOfDoctor!=='admin'} 
                className="border-0 flex-grow-1 w-100" 
                placeholder={t("Enter new name of room")} 
                onKeyDown={e=>{if(e.key === "Enter") createRoom()}}  
                style={{ outline: "none" }} 
                value={newRoom} 
                onChange={e=>setNewRoom(e.target.value)}
              />
              <span className="material-symbols-outlined mc-color fw-bolder" style={{fontSize:"30px"}}>door_back</span>
            </div>
          </th>
          <th className='align-middle mc-heading-middle d-lg-table-cell submit-icon' style={{fontSize:FONT_SIZE,minWidth:"100px"}}>
            <div className={`d-flex flex-column align-items-center justify-content-center`} >
              <span className="text-white fw-bold" style={{fontSize:FONT_SIZE}}>{t("color")}</span>
              <input type="color" disabled={clinic.roleOfDoctor!=='admin'} className="border-0 p-0" style={{ outline: "none" }} value={colorRoom} onChange={e=>setColorRoom(e.target.value)}/>
            </div>
          </th>
          <th className='align-middle mc-heading-middle d-lg-table-cell submit-icon' style={{fontSize:FONT_SIZE, minWidth:"150px"}}>
            <IconButtonComponent className={`btn-success h-100 ${clinic.roleOfDoctor==='admin' && 'standout'}`} onClick={createRoom} icon="add" FONT_SIZE_ICON={"25px"} title={t("add new room")} disabled={clinic.roleOfDoctor!=='admin'}/>
          </th>
        </tr>
      </thead>
      <tbody>
        {
          arrayRoom?.map((room,index)=>{
            return <tr key={room.id} className='align-middle hover-font-weight' style={{cursor:"pointer"}}>
              <td className="d-lg-table-cell d-none" style={{fontSize:FONT_SIZE}}>
                {index+1}
              </td>
              <td className="d-lg-table-cell d-none" style={{fontSize:FONT_SIZE}}>
                <input 
                  type="text" 
                  className="border-0 flex-grow-1 w-100 py-2 ps-2 rounded" 
                  disabled={editRoomId!==room.id}
                  placeholder={t("Enter new name of room")} 
                  style={{outline: "none",fontSize:FONT_SIZE}}
                  onKeyDown={e=>{if(e.key === "Enter") updateRoom(e)}}  
                  value={editRoomId!==room.id?room.nameRoom:editNameRoom} 
                  onChange={e=>setEditNameRoom(e.target.value)}
                />
              </td>
              <td className="d-lg-table-cell d-none">
                <input type="color" disabled={editRoomId!==room.id} className="border-0" style={{ outline: "none" }} value={editRoomId!==room.id?room.colorRoom:editColorRoom} onChange={e=>setEditColorRoom(e.target.value)}/>
              </td>
              <td className="d-lg-table-cell d-none align-middle" style={{fontSize:FONT_SIZE}}>
                {
                  editRoomId===room.id ?
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    <IconButtonComponent className="btn-outline-danger me-2" icon="delete" FONT_SIZE_ICON={"20px"} onClick={()=>setOpenDeleteConfirm(true)} title={t("delete")}/>
                    <IconButtonComponent className="btn-outline-success me-2" icon="done" FONT_SIZE_ICON={"20px"} onClick={()=>updateRoom()} title={t("save")}/>
                    <IconButtonComponent className="btn-outline-danger" icon="close" FONT_SIZE_ICON={"20px"} onClick={()=>{setEditRoomId('');setEditNameRoom('')}} title={t("cancel")}/>
                  </div>
                  :
                  <IconButtonComponent 
                  className="btn-outline-warning" 
                  onClick={e=>{
                    setEditRoomId(room.id);
                    setEditNameRoom(room.nameRoom);
                    setEditColorRoom(room.colorRoom);
                  }} 
                  icon="edit" 
                  FONT_SIZE_ICON={"20px"} 
                  title={t("edit")}
                />
                }
              </td>
            </tr>
          })
        }
      </tbody>
    </table>
    <div className="mb-3 mt-5 d-flex align-items-center justify-content-center w-100 flex-column">
      <div className="d-flex flex-row align-items-center justify-content-center">
        <hr style={{ width: '140px' }} />
        <span className="mx-3 text-primary fst-italic text-center">{t('Note: It is recommended to choose a dark color because when used in the calendar, the information will be displayed better')}</span>
        <hr style={{ width: '140px' }} />
      </div>
    </div>
    <ConfirmComponent 
      FONT_SIZE={FONT_SIZE}
      open={openDeleteConfirm} 
      title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm delete this room')}</span>} 
      content={
        <div>
          <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('To delete this this room, enter the agree button')}</span>
        </div>
      }
      handleClose={e=>handleClose()} 
      handleSubmit={e=>deleteRoom()}
    />
  </div>
}