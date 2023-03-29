import React from "react";
import SelectPatientComponent from "../../../component/SelectPatientComponent.jsx";

export default function ClinicEncryptionManagement(props){
  return <div className="w-100 py-3">
    <div style={{width:"400px"}}>
      <SelectPatientComponent condition={true} showSelectedPatient={false}/>
    </div>
  </div>
}