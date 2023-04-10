import React, { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { FONT_SIZE, SELECT_PATIENT_MODE } from "../../common/Utility.jsx";
import NavbarComponent from "../../components/NavbarComponent.jsx";
import SelectPatientComponent from "../../components/SelectPatientComponent.jsx";
import SoftWareListComponent from "../../components/SoftWareListComponent.jsx";
import { baseURL } from "../../services/getAPI.jsx";

export default function Discussion(props){
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor.data);

  const [messages, setMessages] = useState([]);
  console.log("🚀 ~ file: Discussion.jsx:20 ~ Discussion ~ messages:", messages)
  const [newMessage,setNewMessage] = useState();
  const [skip, setSkip] = useState(0);
  const [doctorOnline, setDoctorOnline] = useState([]);
  console.log("🚀 ~ file: Discussion.jsx:24 ~ Discussion ~ doctorOnline:", doctorOnline)
  const [loadingMessage, setLoadingMessage] = useState(false);

  const chatBoxRef = useRef(null);

  const socket = useMemo(()=>{
    return io.connect(baseURL);
  },[]);

  const {t} = useTranslation();

  useEffect(()=>{
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
  },[])

  useEffect(()=>{
    if(socket){

      socket.on("receive_message", newMessage => {
        setMessages((messages) => [...messages,newMessage]);
      })

      socket.on("load_message", data => {
        setMessages((messages) => [...data,...messages]);
        setSkip((skip) => skip + data.length);
      })

      socket.on("online_user", doctors => {
        setDoctorOnline(doctors);
      })
    }
  },[socket])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const disconnectToSocket = () => {
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
        <SelectPatientComponent condition={selectPatientOnMode === SELECT_PATIENT_MODE.CLINIC_PATIENT || selectPatientOnMode === SELECT_PATIENT_MODE.SHARE_PATIENT} showSelectedPatient={true}/>
        <SoftWareListComponent />
      </div>
      <div className="border flex-grow-1 rounded mb-5 d-flex flex-column">
        <div className="flex-grow-1 d-flex flex-column" style={{overflowY:"auto",height:window.innerHeight-400}} ref={chatBoxRef} onScroll={handleScrollToLoadMessage}>
          {
            messages?.map((mess,index) => {
              return <span className="my-5" key={mess.id}>{mess.message}</span>
            })
          }
        </div>
        <div className="w-100 d-flex align-items-center border-top input-group p-0">
          <IconButtonComponent 
            className="btn-primary border-0 px-2" 
            icon="add_photo_alternate" 
            FONT_SIZE_ICON={"30px"}
            title={t("add image")}
            // onClick={e=>onZoomInHandle()}
          />
          <input 
            className="form-input px-2 h-100 flex-grow-1 border-0" 
            style={{fontSize:FONT_SIZE,outline:"none"}} 
            onKeyDown={e=>{if(e.key === "Enter") sendMessageHandle() ; if(e.key === "Escape") setNewMessage('')}} 
            placeholder={t('Enter your comment here')}
            onChange={e=>setNewMessage(e.target.value)}
          />
          <button className="btn btn-primary border-0 px-2 h-100" type="button" style={{fontSize:FONT_SIZE,outline:"none"}} onClick={()=>{setNewMessage('');sendMessageHandle()}}>
            {t('Send message')}
          </button>
        </div>
      </div>
    </div>
  </div>
}