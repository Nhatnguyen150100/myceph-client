import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function AppointmentModal(props){
  const {t} = useTranslation();
  const propertiesClinic = useSelector(state => state.calendar.propertiesClinic);


  return <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body col">
          <div className="d-flex flex-column justify-content-center align-items-start">
            
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" className="btn btn-primary">Understood</button>
        </div>
      </div>
    </div>
  </div>
}