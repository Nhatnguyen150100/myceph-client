import React, { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { convertISOToVNDateString, FONT_SIZE, getHoursMinutesSeconds, SELECT_PATIENT_MODE, SOFT_WARE_LIST, toISODateString } from "../../common/Utility.jsx";
import NavbarComponent from "../../components/NavbarComponent.jsx";
import SelectPatientComponent from "../../components/SelectPatientComponent.jsx";
import SoftWareListComponent from "../../components/SoftWareListComponent.jsx";
import { setAppName } from "../../redux/GeneralSlice.jsx";
import { baseURL } from "../../services/getAPI.jsx";

export default function Discussion(props){
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor.data);

  const [messages, setMessages] = useState([]);
  const [newMessage,setNewMessage] = useState();
  const [skip, setSkip] = useState(0);
  const [doctorOnline, setDoctorOnline] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [currentScrollTop, setCurrentScrollTop] = useState();
  const [shouldScroll, setShouldScroll] = useState(true);

  const [currentPatient,setCurrentPatient] = useState(patient.currentPatient?.id);

  const chatBoxRef = useRef(null);

  const dispatch = useDispatch();
  const nav = useNavigate();

  const socket = useMemo(()=>{
    return io.connect(baseURL);
  },[]);

  const {t} = useTranslation();

  useEffect(()=>{
    if(!doctor?.id) nav('/login');
    dispatch(setAppName(`Myceph - ${t(SOFT_WARE_LIST.DISCUSSION)}`));
  },[])

  useEffect(()=>{
    if(patient.currentPatient?.id !== currentPatient) {
      setCurrentPatient(patient.currentPatient?.id);
      disconnectToSocket();
      socket.emit("join_room",{
        idRoom: patient.currentPatient?.id,
        dataClient: {
          idDoctor: doctor.id,
          fullName: doctor.fullName,
          email: doctor.email
        }
      });
    }
  },[patient.currentPatient])

  useEffect(()=>{
    if(patient.currentPatient){
      socket.emit("join_room",{
        idRoom: patient.currentPatient?.id,
        dataClient: {
          idDoctor: doctor.id,
          fullName: doctor.fullName,
          email: doctor.email
        }
      });
  
      window.addEventListener("unload", disconnectToSocket);
  
      return () => {
        window.removeEventListener("unload", disconnectToSocket);
        disconnectToSocket();
      }
    }
  },[])

  useEffect(()=>{
    if(socket){

      socket.on("receive_message", newMessage => {
        if(newMessage){
          setShouldScroll(true);
          setMessages((messages) => [newMessage,...messages]);
        } 
      })

      socket.on("load_message", data => {
        setMessages((messages) => [...messages,...data]);
        setSkip((skip) => skip + data.length);
      })
      
      socket.on("online_user", doctors => {
        setDoctorOnline(doctors);
      })
    }
  },[socket])

  useEffect(()=>{
    if(skip!==0){
      setShouldScroll(false);
      const chatBox = chatBoxRef.current;
      const chatBoxHeight = chatBox.scrollHeight;
      const newScrollTop = currentScrollTop + 250;
      chatBox.scrollTop = newScrollTop < chatBoxHeight ? newScrollTop : chatBoxHeight;
    } 
  },[skip])

  
  useEffect(()=>{
    if(shouldScroll) scrollToBottom();
  },[messages])

  const disconnectToSocket = () => {
    setMessages([]);
    socket.emit("disconnect_socket",{idRoom: patient.currentPatient?.id});
  }

  const scrollToBottom = () => {
    const chatBox = chatBoxRef.current;
    if (chatBox) { 
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }

  const handleScrollToLoadMessage = () => {
    const chatBox = chatBoxRef.current;
    setCurrentScrollTop(chatBox.scrollTop);
    if (chatBox.scrollTop === 0) {
      socket.emit('load_more_messages', { idRoom: patient.currentPatient?.id, skip });
    }
  }

  const sendMessageHandle = async () => {
    if(!newMessage){
      toast.error(t('message is required'));
    }else if(!socket){
      toast.error(t('Oops! something wrong happened. Please reload your window'));
    }else{
      setNewMessage('');
      setLoadingMessage(true);
      const messageData = {
        idRoom: patient.currentPatient?.id,
        idDoctor: doctor.id,
        message: newMessage
      }

      await socket.emit('send_message', messageData);
      setLoadingMessage(false);
    }
  }

  return <div className="h-100 w-100 d-flex flex-column align-items-start justify-content-start">
    <NavbarComponent />
    <div className="d-flex flex-column h-100 container my-1">
      <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3" style={{minHeight:`${selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
        <SelectPatientComponent condition={selectPatientOnMode === SELECT_PATIENT_MODE.CLINIC_PATIENT} showSelectedPatient={true}/>
        <SoftWareListComponent />
      </div>
      {
        currentPatient?
        <div className="border flex-grow-1 rounded mb-5 d-flex flex-column">
          <div className="flex-grow-1 d-flex flex-column" style={{overflowY:"auto",height:window.innerHeight-400}} ref={chatBoxRef} onScroll={handleScrollToLoadMessage}>
            {
              loadingMessage && <div className="spinner-grow"></div>
            }
            {
              [...messages].reverse().map((value,index) => {
                return <div key={value.id+index} className={`my-2 px-1 w-100 d-flex ${value.idDoctorSendMessage!==doctor.id?'justify-content-start':'justify-content-end'} align-items-center`}>         
                  <div className="d-flex align-items-start justify-content-start">
                    {
                      value.idDoctorSendMessage!==doctor.id && 
                      <div className="p-2 rounded-circle border m-1 shadow">
                        <img src="/assets/icons/user.png" style={{height:"20px",width:"20px",background:"transparent"}} alt=""/> 
                      </div>
                    }
                    <div className="d-flex flex-column px-2 ">
                      <span className="text-capitalize fw-bold mc-color" style={{fontSize:FONT_SIZE}}>{value['Doctor.fullName']} {' ( '}{value['Doctor.email']}{' ) '}</span>
                      <span className="p-2 mc-font rounded shadow" style={{backgroundColor:`${value.idDoctorSendMessage!==doctor.id?'#A8DDFD':'#f8e896'}`}}>{value.message}</span>
                      <div className={`d-flex flex-row w-100 mt-1 ${value.idDoctorSendMessage!==doctor.id?'justify-content-end':'justify-content-start'}`}>
                        <span className="me-1 fst-italic" style={{fontSize:FONT_SIZE}}>{getHoursMinutesSeconds(new Date(value.createdAt))}</span>
                        {
                          convertISOToVNDateString(toISODateString(new Date(value.createdAt))) !== convertISOToVNDateString(toISODateString(new Date())) && 
                          <React.Fragment>
                            <span className="ms-1 vr"></span>
                            <span className="ms-1 fst-italic" style={{fontSize:FONT_SIZE}}>{convertISOToVNDateString(toISODateString(new Date(value.createdAt)))}</span>
                          </React.Fragment>
                        }
                      </div>  
                    </div>
                    {
                      value.idDoctorSendMessage===doctor.id && 
                      <div className="p-2 rounded-circle border m-1 shadow">
                        <img src="/assets/icons/user.png" style={{height:"20px",width:"20px",background:"transparent"}} alt=""/> 
                      </div>
                    }
                  </div>
                </div> 
              })
            }
          </div>
          <div className="w-100 d-flex align-items-center border-top input-group p-0">
            {/* <IconButtonComponent 
              className="btn-primary border-0 px-2" 
              icon="add_photo_alternate" 
              FONT_SIZE_ICON={"30px"}
              title={t("add image")}
            /> */}
            <input 
              className="form-input px-2 h-100 flex-grow-1 border-0" 
              style={{fontSize:FONT_SIZE,outline:"none"}} 
              type="text"
              value={newMessage}
              onKeyDown={e=>{if(e.key === "Enter") sendMessageHandle() ; if(e.key === "Escape") setNewMessage('')}} 
              placeholder={t('Enter your comment here')}
              onChange={e=>setNewMessage(e.target.value)}
            />
            <button className="btn btn-primary border-0 px-2 h-100 d-flex flex-row align-items-center justify-content-center" type="button" style={{fontSize:FONT_SIZE,outline:"none"}} onClick={sendMessageHandle}>
              <span className="material-symbols-outlined me-1">
                send
              </span>
              <span>{t('Send message')}</span>
            </button>
          </div>
        </div>
        :
        <div className="h-100 w-100 d-flex justify-content-center align-items-center mt-5">
          <h3 className="text-danger text-capitalize fw-bold">{t("can't found information of patient")}</h3>
        </div>
      }
      
    </div>
  </div>
}