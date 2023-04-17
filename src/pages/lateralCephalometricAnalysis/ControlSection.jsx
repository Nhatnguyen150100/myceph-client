import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bootstrap from 'bootstrap';
import { getToServerWithToken, postToServerWithToken } from "../../services/getAPI.jsx";
import { setCurrentImageAnalysis, setListImageFontSide } from "../../redux/LateralCephSlice.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import UploadImage from "../../common/UploadImage.jsx";
import { FONT_SIZE, IMAGE_TYPE_LIST, splitAvatar, upLoadImageLibrary } from "../../common/Utility.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";

const ICON_SIZE = '25px'

export default function ControlSection(props) {
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const listImageFontSide = useSelector(state=>state.lateralCeph.listImageFontSide);
  const currentImageAnalysis = useSelector(state=>state.lateralCeph.currentImageAnalysis);
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
    if(!currentImageAnalysis) imageModal.current.show();
  },[currentImageAnalysis,currentPatient])

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

  return <div className={`d-flex flex-column justify-content-between align-items-center px-1 border-end`}>
    <div className="d-flex flex-column">
      <button 
        type="button" 
        className="btn btn-outline-secondary border-0 p-0 my-2 d-flex flex-row justify-content-center align-items-center"
        onClick={()=>imageModal.current.show()}
      >
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          photo_camera
        </span>
      </button>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-secondary border-0 dropdown-toggle p-0 my-2 d-flex flex-row justify-content-center align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            straighten
          </span>
        </button>
        <ul className="dropdown-menu">
          
        </ul>
      </div>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-secondary border-0 dropdown-toggle p-0 my-2 d-flex flex-row justify-content-center align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            my_location
          </span>
        </button>
        <ul className="dropdown-menu">
          
        </ul>
      </div>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-secondary border-0 dropdown-toggle p-0 my-2 d-flex flex-row justify-content-center align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            autorenew
          </span>
        </button>
        <ul className="dropdown-menu">
          
        </ul>
      </div>
      <button type="button" className="btn btn-outline-secondary border-0 p-0 my-2 d-flex flex-row justify-content-center align-items-center">
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          zoom_in
        </span>
      </button>
      <button type="button" className="btn btn-outline-secondary border-0 p-0 my-2 d-flex flex-row justify-content-center align-items-center">
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          zoom_out
        </span>
      </button>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-secondary border-0 dropdown-toggle p-0 my-2 d-flex flex-row justify-content-center align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            contrast
          </span>
        </button>
        <ul className="dropdown-menu">
          
        </ul>
      </div>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-secondary border-0 dropdown-toggle p-0 my-2 d-flex flex-row justify-content-center align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          brightness_medium
          </span>
        </button>
        <ul className="dropdown-menu">
          
        </ul>
      </div>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-secondary border-0 dropdown-toggle p-0 my-2 d-flex flex-row justify-content-center align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            visibility
          </span>
        </button>
        <ul className="dropdown-menu">
          
        </ul>
      </div>
      <button type="button" className="btn btn-outline-secondary border-0 p-0 my-2 d-flex flex-row justify-content-center align-items-center">
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          save
        </span>
      </button>
    </div>
    <div className="d-flex flex-column">
      <button type="button" className="btn btn-outline-danger border-0 p-0 my-2 d-flex flex-row justify-content-center align-items-center">
        <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
          delete
        </span>
      </button>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-outline-info border-0 dropdown-toggle p-0 my-2 d-flex flex-row justify-content-center align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="material-symbols-outlined" style={{fontSize:ICON_SIZE}}>
            info
          </span>
        </button>
        <ul className="dropdown-menu">
          
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
                      dispatch(setCurrentImageAnalysis(splitAvatar(image.linkImage)));
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
}