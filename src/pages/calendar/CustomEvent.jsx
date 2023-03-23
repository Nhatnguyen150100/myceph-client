import React from "react";
import { FONT_SIZE } from "../../common/Utility.jsx";

function CustomEvent(props){
  // console.log("🚀 ~ file: CustomEvent.jsx:4 ~ CustomEvent ~ props:", props)
  return <div className="d-flex flex-column w-100">
    <button className="btn p-0 border-0 mt-1 d-flex flex-row align-items-center justify-content-start" type="button">
      <span className="material-symbols-outlined text-white" style={{fontSize:"20px"}}>
        accessible
      </span>
      <span className="text-capitalize text-white ms-2" style={{fontSize:FONT_SIZE}}>{props.title}</span>
    </button>
    <div className="d-flex flex-row w-100 mt-1 align-items-center justify-content-start">
      <span className="material-symbols-outlined text-white" style={{fontSize:"20px"}}>
        stethoscope
      </span>
      <span className="text-capitalize text-white ms-2" style={{fontSize:FONT_SIZE}}>{props.event?.doctor.fullName} ({props.event?.doctor.email})</span>
    </div>
    <div className="d-flex flex-row w-100 mt-1 align-items-center justify-content-start">
      <span className="material-symbols-outlined text-white" style={{fontSize:"20px"}}>
        checklist
      </span>
      <span className="text-capitalize text-white ms-2" style={{fontSize:FONT_SIZE}}>{props.event?.status.nameStatus}</span>
    </div>
    <div className="d-flex flex-row w-100 mt-1 align-items-center justify-content-start">
      <span className="material-symbols-outlined text-white" style={{fontSize:"20px"}}>
        medical_services
      </span>
      <span className="text-capitalize text-white ms-2" style={{fontSize:FONT_SIZE}}>{props.event?.service.nameService}</span>
    </div>
    <div className="d-flex flex-row w-100 mt-1 align-items-center justify-content-start">
      <span className="material-symbols-outlined text-white" style={{fontSize:"20px"}}>
        notes
      </span>
      <span className="text-capitalize text-white ms-2" style={{fontSize:FONT_SIZE}}>{props.event?.note}</span>
    </div>
  </div>
}

export default React.memo(CustomEvent);