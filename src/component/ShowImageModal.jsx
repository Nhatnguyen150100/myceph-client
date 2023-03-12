import React, { useEffect, useRef } from "react";
import * as bootstrap from 'bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { setCurrentImage } from "../redux/LibraryImageSlice.jsx";
import { useTranslation } from "react-i18next";

export default function ShowImageModal(props) {
  const imageModalRef = useRef();
  const imageModal = useRef();
  const currentImage = useSelector(state=>state.libraryImage.currentImage);
  const dispatch = useDispatch();
  const {t} = useTranslation();

  useEffect(() => {
    imageModal.current = new bootstrap.Modal(imageModalRef.current, {});
  }, [])

  useEffect(() => {
    if (currentImage) imageModal.current.show();
    else imageModal.current.hide();
  }, [currentImage])

  return <div className="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" ref={imageModalRef}>
    <div className="modal-dialog modal-dialog-centered modal-xl justify-content-center ">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="mc-color text-uppercase fw-bold">{t('Image')}</h2>
          <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={e=>dispatch(setCurrentImage(false))} aria-label="Close"></button>
        </div>
        <div className="modal-body h-100 w-100 d-flex justify-content-center align-items-center">
          <img src={currentImage?currentImage:undefined} style={{maxHeight:"500px"}} alt="image"/>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={e=>dispatch(setCurrentImage(false))}>Close</button>
        </div>
      </div>
    </div>
  </div >
}