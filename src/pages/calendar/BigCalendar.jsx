import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import NavbarComponent from "../../component/NavbarComponent.jsx";
import SoftWareListComponent from "../../component/SoftWareListComponent.jsx";
import SelectPatientComponent from "../../component/SelectPatientComponent.jsx";
import { SELECT_PATIENT_MODE } from "../../common/Utility.jsx";

const localizer = momentLocalizer(moment);

export default function BigCalendar(props){
  return <div>
    <NavbarComponent />
    <div className="d-flex flex-column h-100 container my-1">
      <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3" style={{minHeight:`${SELECT_PATIENT_MODE===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
        <SelectPatientComponent />
        <SoftWareListComponent />
      </div>
    </div>
    <Calendar 
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
}