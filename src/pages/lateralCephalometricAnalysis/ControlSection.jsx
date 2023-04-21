import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bootstrap from 'bootstrap';
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken } from "../../services/getAPI.jsx";
import { setCurrentImageAnalysis, setLengthOfRuler, setListImageFontSide, setMarkerPoints, setScaleImage } from "../../redux/LateralCephSlice.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import UploadImage from "../../common/UploadImage.jsx";
import { FONT_SIZE, getKeyByNameValue, IMAGE_TYPE_LIST, splitAvatar, upLoadImageLibrary } from "../../common/Utility.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { Slider } from "@mui/material";
import { ANALYSIS, MARKER_LIST } from "./LateralCephalometricUtility.jsx";

const ICON_SIZE = '22px'

const ControlSection = React.memo((props) => {
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const listImageFontSide = useSelector(state=>state.lateralCeph.listImageFontSide);
  const markerPoints = useSelector(state=>state.lateralCeph.markerPoints);
  const currentImageAnalysis = useSelector(state=>state.lateralCeph.currentImageAnalysis);
  const currentAnalysis = useSelector(state=>state.lateralCeph.currentAnalysis);
  const lengthOfRuler = useSelector(state=>state.lateralCeph.lengthOfRuler);
  const scaleImage = useSelector(state=>state.lateralCeph.scaleImage);
  const doctor = useSelector(state=>state.doctor);

  const dispatch = useDispatch();
  const {t} = useTranslation();
  const nav = useNavigate();
  const imageModal = useRef();
  const imageModalRef = useRef();

  const [isLoadImage,setIsLoadImage] = useState(true);
  
  useEffect(() => {
    imageModal.current = new bootstrap.Modal(imageModalRef.current, {});
  },[])

  useEffect(()=>{
    if(!currentImageAnalysis && doctor.data) imageModal.current.show();
    else imageModal.current.hide();
  },[currentImageAnalysis,currentPatient,doctor.data])

  useEffect(()=>{
    if(props.imageObject) imageModal.current.hide();
  },[props.imageObject])

  const onLoad = () => {
    setIsLoadImage(false);
  }

  const onError = () => {
    setIsLoadImage(false);
  }

  useEffect(()=>{
    dispatch(setCurrentImageAnalysis(null));
    if(currentPatient) getListFontSideImages();
  },[currentPatient])

  const getListFontSideImages = () => {
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/lateralCeph/getListFontSideImages/${currentPatient.id}`).then(result => {
        dispatch(setListImageFontSide(result.data));
        resolve();
      }).catch(err =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getListFontSideImages());
        }else{
          toast.error(t(err.message));
        }
        reject();
      })
    });
  }
  
  const uploadImageToCloudinary = (image,typeImage,linkImage) => {
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      if(linkImage){
        postToServerWithToken(`/v1/libraryImagePatient/${currentPatient.id}`,{
          idDoctor: doctor.data.id,
          typeImages: [1],
          linkImage: linkImage,
          typeImage: typeImage,
          consultationDate: new Date()
        }).then(result => {
          const listImage = Object.values(result.data);
          const flatValues = listImage.reduce((total, value) => {
            return total.concat(value);
          }, []);
          dispatch(setListImageFontSide(flatValues));
          toast.success(t(result.message));
        }).catch(err => {
          toast.error(t(err.message));
        }).finally(()=>dispatch(setLoadingModal(false)));
      }else{
        upLoadImageLibrary(image).then(responseData=>{
          const linkImage = responseData.data.secure_url + '|' + responseData.data.public_id;
          postToServerWithToken(`/v1/libraryImagePatient/${currentPatient.id}`,{
            idDoctor: doctor.data.id,
            typeImages: [1],
            linkImage: linkImage,
            typeImage: typeImage,
            consultationDate: new Date()
          }).then(result => {
            const listImage = Object.values(result.data);
            const flatValues = listImage.reduce((total, value) => {
              return total.concat(value);
            }, []);
            dispatch(setListImageFontSide(flatValues));
            toast.success(t(result.message));
            resolve();
          }).catch(err =>{
            if(err.refreshToken){
              refreshToken(nav,dispatch).then(()=>uploadImageToCloudinary(image,typeImage,linkImage));
            }else{
              toast.error(t(err.message));
            }
            reject();
          }).finally(()=>dispatch(setLoadingModal(false)));
        })
      }
    })
  }

  const getImageAnalysis = (image) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/lateralCeph/getImageAnalysis/${image.id}`).then(result => {
        if(result.data){
          dispatch(setMarkerPoints(JSON.parse(result.data.markerPoints)));
          props.onSetMarkerPointList(JSON.parse(result.data.markerPoints));
          dispatch(setScaleImage(result.data.scaleImage));
          dispatch(setLengthOfRuler(result.data.lengthOfRuler));
          toast.info(t(result.message));
        }else{
          dispatch(setMarkerPoints({}));
          props.onSetMarkerPointList({});
          dispatch(setScaleImage(null));
          dispatch(setLengthOfRuler(10));
          toast.warning(t(result.message))
        }
        resolve();
      }).catch(err =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getImageAnalysis(image.id));
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>{
        dispatch(setLoadingModal(false))
        dispatch(setCurrentImageAnalysis({
          id: image.id,
          linkImage: splitAvatar(image.linkImage)
        }));
      });
    })
  }

  const setImageAnalysis = () => {
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      postToServerWithToken(`/v1/lateralCeph/setImageAnalysis`,{
        idImageAnalysis: currentImageAnalysis.id,
        markerPoints: markerPoints,
        scaleImage: scaleImage,
        lengthOfRuler: lengthOfRuler
      }).then(result => {
        toast.success(t(result.message));
        resolve();
      }).catch(err =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>setImageAnalysis());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const deleteImageAnalysis = () => {
    return new Promise((resolve,reject) =>{
      dispatch(setLoadingModal(true));
      deleteToServerWithToken(`/v1/lateralCeph/deleteImageAnalysis/${currentImageAnalysis.id}`).then(result => {
        dispatch(setMarkerPoints({}));
        props.onSetMarkerPointList({});
        dispatch(setScaleImage(null));
        dispatch(setLengthOfRuler(10));
        toast.warning(t(result.message));
        resolve();
      }).catch(err =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>deleteImageAnalysis());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  return <div className={`d-flex flex-column justify-content-between align-items-center px-1 border-end`}>
    <div className="d-flex flex-column">
      <button 
        type="button" 
        className="btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center"
        onClick={()=>imageModal.current.show()}
      >
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          photo_camera
        </span>
      </button>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            straighten
          </span>
        </button>
        <ul className="dropdown-menu ms-2">
          <div className="d-flex flex-row justify-content-evenly align-items-center">
            <span className="fw-bold mc-color ms-2" style={{fontSize:FONT_SIZE}}>
              C1
            </span>
            <select className="form-select mx-2" value={lengthOfRuler} onChange={e=>{dispatch(setLengthOfRuler(e.target.value))}}>
              <option value={10} className="text-gray" style={{fontSize:FONT_SIZE}}>
                10 mm
              </option>
              <option value={20} className="text-gray" style={{fontSize:FONT_SIZE}}>
                20 mm
              </option>
              <option value={30} className="text-gray" style={{fontSize:FONT_SIZE}}>
                30 mm
              </option>
            </select>
            <span className="fw-bold mc-color me-2" style={{fontSize:FONT_SIZE}}>
              C2
            </span>
          </div>
        </ul>
      </div>
      {
        props.currentMarkerPoint ? 
        <button 
          type="button" 
          className={`btn btn-outline-danger border-0 p-0 m-2`}
          onClick={()=>props.onSetCurrentMarkerPoint('')}
        >
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            cancel
          </span>
        </button>
        :
        <div className="btn-group dropend">
          <button 
            type="button" 
            className={`btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded`}
            data-bs-toggle='dropdown'
            aria-expanded="false"
          >
            <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
              my_location
            </span>
          </button>
          <ul className="dropdown-menu ms-2 w-auto" style={{maxHeight:window.innerHeight/2,overflowY:"auto"}}>
            {
              ANALYSIS[getKeyByNameValue(ANALYSIS,currentAnalysis)]?.markerPoints.map((point,index) => {
                return <button 
                  key={index+Math.random(1,1000)} 
                  type="button" 
                  className="btn btn-hover-bg p-1 m-0 d-flex justify-content-start align-items-center border-bottom flex-grow-1 w-100 border-0"
                  disabled={markerPoints && markerPoints[point]}
                  onClick={()=>{
                    props.onSetCurrentMarkerPoint(point)
                  }}
                >
                  <span className={`text-uppercase fw-bold ${markerPoints && markerPoints[point] && 'text-success'}`} style={{fontSize:FONT_SIZE}}>
                    ({point})
                  </span>
                  <span className={`text-capitalize fw-bold ms-2 text-nowrap ${markerPoints && markerPoints[point] && 'text-success'}`} style={{fontSize:FONT_SIZE}}>
                    {MARKER_LIST[point]}
                  </span>
                </button>
              })
            }
          </ul>
        </div>
      }
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            autorenew
          </span>
        </button>
        <ul className="dropdown-menu ms-2">
          <div className="d-flex flex-row justify-content-evenly align-items-center">
            <button className="btn btn-outline-primary p-0 border-0" type="button" onClick={(e)=>{e.stopPropagation();props.onRotation(props.rotation-1)}}>
              <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
                swipe_left
              </span>
            </button>
            <span className="mx-2 fw-bold">
              {props.rotation}°
            </span>
            <button className="btn btn-outline-primary p-0 border-0" type="button" onClick={(e)=>{e.stopPropagation();props.onRotation(props.rotation+1)}}>
              <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
                swipe_right
              </span>
            </button>
          </div>
        </ul>
      </div>
      <button 
        type="button" 
        className={`btn ${props.isDragImage ?'btn-primary':'btn-outline-primary'} border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded`}
        onClick={()=>props.onDragImage(props.isDragImage?false:true)}
      >
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          back_hand
        </span>
      </button>
      <button 
        type="button" 
        className="btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded"
        onClick={props.onZoomInHandle}
      >
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          zoom_in
        </span>
      </button>
      <button 
        type="button" 
        className="btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded"
        onClick={props.onZoomOutHandle}
      >
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          zoom_out
        </span>
      </button>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            contrast
          </span>
        </button>
        <ul className="dropdown-menu ms-2">
          <Slider
            className="py-1"
            size="small"
            defaultValue={0}
            min={-100}
            max={100}
            step={10}
            marks
            onChange={e=>props.onChangeContrast(e.target.value)}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
        </ul>
      </div>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            brightness_medium
          </span>
        </button>
        <ul className="dropdown-menu ms-2">
          <Slider
            className="py-1"
            size="small"
            defaultValue={0}
            min={-1}
            max={1}
            step={0.1}
            marks
            onChange={e=>props.onChangeBrightness(e.target.value)}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
        </ul>
      </div>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            visibility
          </span>
        </button>
        <ul className="dropdown-menu ms-2">
          
        </ul>
      </div>
      <button 
        type="button" 
        className="btn btn-outline-success border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded"
        onClick={setImageAnalysis}
      >
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          save
        </span>
      </button>
    </div>
    <div className="d-flex flex-column">
      <button 
        type="button" 
        className="btn btn-outline-danger border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded"
        onClick={deleteImageAnalysis}
      >
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          delete
        </span>
      </button>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-info border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            info
          </span>
        </button>
        <ul className="dropdown-menu ms-2">
          
        </ul>
      </div>
    </div>
    <div className="modal fade" id="modalImageFontSide" ref={imageModalRef} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalImageFontSide" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body d-flex flex-row align-items-center justify-content-start flex-wrap">
            <div className="me-4 mb-3" style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"150px"}}>
              <UploadImage 
                imageIcon="/assets/images/1.png" 
                styleImage={{height:"100px"}} 
                alt={t(IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name)} 
                className="border-0 hoverGreenLight h-100" 
                style={{fontSize:FONT_SIZE,width:"150px"}}
                getUrlImage={value=>{}}
                getImage={value => uploadImageToCloudinary(value,1,false)}
              />
            </div>
            {
              listImageFontSide?.map((image,_)=>{
                return <button 
                    key={image.id} 
                    type="button" 
                    className="btn btn-primary p-0 me-3 mb-3 transform-hover w-auto" 
                    onClick={()=>{
                      getImageAnalysis(image);
                      imageModal.current.hide();
                    }}
                  >
                    <img 
                      src={splitAvatar(image.linkImage)} 
                      onLoad={onLoad}
                      onError={onError} 
                      alt={t('font side image')}
                      style={{maxHeight:"150px",cursor:"pointer"}}
                    />
                  </button>
              })
            }
          </div>
        </div>
      </div>
    </div>
  </div>
})

export default ControlSection;