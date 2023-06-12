import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bootstrap from 'bootstrap';
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken } from "../../services/getAPI.jsx";
import { setCurrentImageAnalysis, setIsVisitableHelper, setLengthOfRuler, setListImageFontSide, setMarkerPoints, setNoteAnalysis, setScaleImage, setVisitableAnalysisLines, setVisitableMarkerPoints } from "../../redux/LateralCephSlice.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import UploadImage from "../../common/UploadImage.jsx";
import { FONT_SIZE, getKeyByNameValue, IMAGE_TYPE_LIST, splitAvatar, upLoadImageLibrary } from "../../common/Utility.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { Slider } from "@mui/material";
import { ANALYSIS, MARKER_LIST } from "./LateralCephalometricUtility.jsx";
import { checkAllPointsExist, MANDIBULAR, UNDER_INCISOR_CURVE, UPPER_INCISOR_CURVE, UPPER_JAW_BONE_CURVE, UPPER_MOLAR } from "../CalculatorToothMovement/CalculatorToothUtility.jsx";
import { setSelectedCurve } from "../../redux/CurveSlice.jsx";

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
  const noteAnalysis = useSelector(state=>state.lateralCeph.noteAnalysis);
  const isVisitableMarkerPoints = useSelector(state=>state.lateralCeph.isVisitableMarkerPoints);
  const isVisitableAnalysisLines = useSelector(state=>state.lateralCeph.isVisitableAnalysisLines);
  const isVisitableHelper = useSelector(state=>state.lateralCeph.isVisitableHelper);

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
    dispatch(setNoteAnalysis(null));
    dispatch(setCurrentImageAnalysis(null));
    if(currentPatient) getListFontSideImages();
  },[currentPatient])

  const getListFontSideImages = () => {
    dispatch(setLoadingModal(true));
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
      }).finally(()=>dispatch(setLoadingModal(false)));
    });
  }
  
  const uploadImageToCloudinary = (image,typeImage,linkImage) => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
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
          dispatch(setNoteAnalysis(result.data.noteAnalysis));
          toast.info(t(result.message));
        }else{
          dispatch(setMarkerPoints({}));
          props.onSetMarkerPointList({});
          dispatch(setScaleImage(null));
          dispatch(setLengthOfRuler(10));
          dispatch(setNoteAnalysis(null));
          toast.warning(t(result.message))
        }
        resolve();
      }).catch(err =>{
        if(err.refreshToken){
          refreshToken(nav,dispatch).then(()=>getImageAnalysis(image));
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
        lengthOfRuler: lengthOfRuler,
        noteAnalysis: noteAnalysis
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
        dispatch(setNoteAnalysis(null));
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

  const findCurrentMarkerPoint = (listPoints,markerPoints) => {
    for (const point of Object.keys(listPoints)) {
      const checkPointExist = Object.keys(markerPoints).find(isPoint => point === isPoint)
      if (checkPointExist === undefined) {
        return point
      }
    }
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
            <select className="form-select mx-2 w-auto" value={lengthOfRuler} onChange={e=>{dispatch(setLengthOfRuler(e.target.value))}}>
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
        <React.Fragment> 
          {
            props.stageMode === 0 ?
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
            :
            <div className="btn-group dropend">
              <button 
                type="button" 
                className={`btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded`}
                data-bs-toggle='dropdown'
                aria-expanded="false"
              >
                <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
                  gesture
                </span>
              </button>
              <ul className="dropdown-menu ms-2 w-auto p-0" style={{maxHeight:window.innerHeight/2,overflowY:"auto"}}>
                <button 
                  type="button" 
                  disabled={checkAllPointsExist(UPPER_JAW_BONE_CURVE,markerPoints)}
                  className="btn btn-hover-bg p-1 m-0 d-flex justify-content-start align-items-center border-bottom flex-grow-1 w-100 border-0"
                  onClick={()=>{
                    const currentMarker = findCurrentMarkerPoint(UPPER_JAW_BONE_CURVE.markerPoints,markerPoints)
                    dispatch(setSelectedCurve(UPPER_JAW_BONE_CURVE.name))
                    props.onSetCurrentMarkerPoint(currentMarker)
                  }}
                >
                  <img src={`${checkAllPointsExist(UPPER_JAW_BONE_CURVE,markerPoints) ? '/assets/images/MAXILLARY_delete.jpg' : '/assets/images/MAXILLARY_create.jpg'}`} alt="maxillary"/>
                  <span className={`text-uppercase fw-bold mx-2 text-nowrap ${checkAllPointsExist(UPPER_JAW_BONE_CURVE,markerPoints) && 'text-danger text-decoration-line-through'}`} style={{fontSize:FONT_SIZE}}>{t('maxillary')}</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-hover-bg p-1 m-0 d-flex justify-content-start align-items-center border-bottom flex-grow-1 w-100 border-0"
                  disabled={checkAllPointsExist(UPPER_INCISOR_CURVE,markerPoints)}
                  onClick={()=>{
                    const currentMarker = findCurrentMarkerPoint(UPPER_INCISOR_CURVE.markerPoints,markerPoints)
                    dispatch(setSelectedCurve(UPPER_INCISOR_CURVE.name))
                    props.onSetCurrentMarkerPoint(currentMarker)
                  }}
                >
                  <img src={`${checkAllPointsExist(UPPER_INCISOR_CURVE,markerPoints) ? '/assets/images/UPPER_INCISOR_delete.jpg' : '/assets/images/UPPER_INCISOR_create.jpg'}`} alt="maxillary"/>
                  <span className={`text-uppercase fw-bold mx-2 text-nowrap ${checkAllPointsExist(UPPER_INCISOR_CURVE,markerPoints) && 'text-danger text-decoration-line-through'}`} style={{fontSize:FONT_SIZE}}>{t('upper incisor')}</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-hover-bg p-1 m-0 d-flex justify-content-start align-items-center border-bottom flex-grow-1 w-100 border-0"
                  disabled={checkAllPointsExist(UNDER_INCISOR_CURVE,markerPoints)}
                  onClick={()=>{
                    const currentMarker = findCurrentMarkerPoint(UNDER_INCISOR_CURVE.markerPoints,markerPoints)
                    dispatch(setSelectedCurve(UNDER_INCISOR_CURVE.name))
                    props.onSetCurrentMarkerPoint(currentMarker)
                  }}
                >
                  <img src={`${checkAllPointsExist(UNDER_INCISOR_CURVE,markerPoints) ? '/assets/images/UNDER_INCISOR_delete.jpg' : '/assets/images/UNDER_INCISOR_create.jpg'}`} alt="maxillary"/>
                  <span className={`text-uppercase fw-bold mx-2 text-nowrap ${checkAllPointsExist(UNDER_INCISOR_CURVE,markerPoints) && 'text-danger text-decoration-line-through'}`} style={{fontSize:FONT_SIZE}}>{t('under incisor')}</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-hover-bg p-1 m-0 d-flex justify-content-start align-items-center border-bottom flex-grow-1 w-100 border-0"
                  disabled={checkAllPointsExist(MANDIBULAR,markerPoints)}
                  onClick={()=>{
                    const currentMarker = findCurrentMarkerPoint(MANDIBULAR.markerPoints,markerPoints)
                    dispatch(setSelectedCurve(MANDIBULAR.name))
                    props.onSetCurrentMarkerPoint(currentMarker)
                  }}
                >
                  <img src={`${checkAllPointsExist(MANDIBULAR,markerPoints) ? '/assets/images/MANDIBULAR1_DELETE.jpg' : '/assets/images/MANDIBULAR1_CREATE.jpg'}`} height={37} alt="mandibular"/>
                  <span className={`text-uppercase fw-bold mx-2 text-nowrap ${checkAllPointsExist(MANDIBULAR,markerPoints) && 'text-danger text-decoration-line-through'}`} style={{fontSize:FONT_SIZE}}>{t('mandibular')}</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-hover-bg p-1 m-0 d-flex justify-content-start align-items-center border-bottom flex-grow-1 w-100 border-0"
                  disabled={checkAllPointsExist(UPPER_MOLAR,markerPoints)}
                  onClick={()=>{
                    const currentMarker = findCurrentMarkerPoint(UPPER_MOLAR.markerPoints,markerPoints)
                    dispatch(setSelectedCurve(UPPER_MOLAR.name))
                    props.onSetCurrentMarkerPoint(currentMarker)
                  }}
                >
                  <img src={`${checkAllPointsExist(UPPER_MOLAR,markerPoints) ? '/assets/images/RANG_HAM_TREN_delete.jpg' : '/assets/images/RANG_HAM_TREN_create.jpg'}`} height={37} alt="mandibular"/>
                  <span className={`text-uppercase fw-bold mx-2 text-nowrap ${checkAllPointsExist(UPPER_MOLAR,markerPoints) && 'text-danger text-decoration-line-through'}`} style={{fontSize:FONT_SIZE}}>{t('mandibular')}</span>
                </button>
              </ul>
            </div>
          }
        </React.Fragment>
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
          {props.isDragImage?'back_hand':'do_not_touch'}
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
        <ul className="dropdown-menu ms-2 p-0">
          <button 
            type="button" 
            className="w-100 btn btn-outline-secondary border-0 d-flex flex-grow-1 align-items-center justify-content-center"
            onClick={()=>dispatch(setVisitableMarkerPoints(isVisitableMarkerPoints?false:true))}
          >
            <span className="material-symbols-outlined mt-1" style={{fontSize:ICON_SIZE}}>
              {isVisitableMarkerPoints?'visibility':'visibility_off'}
            </span>
            <span className="mc-color text-capitalize mx-1" style={{fontSize:FONT_SIZE}}>
              {t('marker points')}
            </span>
          </button>
          <button 
            type="button" 
            className="w-100 btn btn-outline-secondary border-0 d-flex flex-grow-1 align-items-center justify-content-center"
            onClick={()=>dispatch(setVisitableAnalysisLines(isVisitableAnalysisLines?false:true))}
          >
            <span className="material-symbols-outlined mt-1" style={{fontSize:ICON_SIZE}}>
              {isVisitableAnalysisLines?'visibility':'visibility_off'}
            </span>
            <span className="mc-color text-capitalize mx-1" style={{fontSize:FONT_SIZE}}>
              {t('analysis lines')}
            </span>
          </button>
        </ul>
      </div>
      <button 
        type="button" 
        className="btn btn-outline-primary border-0 p-0 m-2 d-flex flex-row justify-content-center align-items-center rounded"
        onClick={()=>{
          if(isVisitableHelper) dispatch(setIsVisitableHelper(false));
          else dispatch(setIsVisitableHelper(true));
        }}
      >
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          {isVisitableHelper?'auto_fix_normal':'auto_fix_off'}
        </span>
      </button>
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