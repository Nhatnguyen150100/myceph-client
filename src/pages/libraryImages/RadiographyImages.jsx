import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../common/ConfirmComponent.jsx";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import UploadImage from "../../common/UploadImage.jsx";
import { deleteImage, FONT_SIZE, IMAGE_TYPE_LIST, settingForImage, splitAvatar, splitPublic_id, toISODateString, upLoadImageLibrary } from "../../common/Utility.jsx";
import ShowImageModal from "../../components/ShowImageModal.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { setCurrentImage } from "../../redux/LibraryImageSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

const SIZE_UPLOAD_IMAGE = "80px";

export default function RadiographyImages(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const doctor = useSelector(state=>state.doctor);
  const [hoverSettingId,setHoverSettingId] = useState();
  const [idImageDelete,setIdImageDelete] = useState();
  const [publicIdDelete,setPublicIdDelete] = useState();
  const [roleOfDoctor,setRoleOfDoctor] = useState('edit');

  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  const [consultationDate,setConsultationDate] = useState(toISODateString(new Date()));
  const [listImage,setListImage] = useState({});
  const [isLoadImage,setIsLoadImage] = useState(true);

  useEffect(()=>{
    if(props.patient.currentPatient.id) getListImage();
  },[props.patient.currentPatient.id])

  useEffect(()=>{
    if(isLoadImage) dispatch(setLoadingModal(true));
  },[isLoadImage])

  const onLoad = () => {
    setIsLoadImage(false);
    dispatch(setLoadingModal(false));
  }

  const onError = () => {
    setIsLoadImage(false);
    dispatch(setLoadingModal(false));
  }

  const getListImage = () => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/libraryImagePatient/${props.patient.currentPatient.id}?typeImages=radiography&mode=${props.checkRoleMode}&idDoctor=${doctor.data?.id}`).then(result => {
        setListImage(result.data);
        result.roleOfDoctor && setRoleOfDoctor(result.roleOfDoctor)
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getListImage());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const uploadImageToCloudinary = (image,typeImage,linkImage) => {
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      if(linkImage){
        postToServerWithToken(`/v1/libraryImagePatient/${props.patient.currentPatient.id}`,{
          idDoctor: doctor.data.id,
          typeImages: [1, 2, 3, 4],
          linkImage: linkImage,
          typeImage: typeImage,
          consultationDate: consultationDate
        }).then(result => {
          setListImage(result.data);
          toast.success(t(result.message));
        }).catch(err => {
          toast.error(t(err.message));
        }).finally(()=>dispatch(setLoadingModal(false)));
      }else{
        upLoadImageLibrary(image).then(responseData=>{
          const linkImage = responseData.data.secure_url + '|' + responseData.data.public_id;
          postToServerWithToken(`/v1/libraryImagePatient/${props.patient.currentPatient.id}`,{
            idDoctor: doctor.data.id,
            typeImages: [1, 2, 3, 4],
            linkImage: linkImage,
            typeImage: typeImage,
            consultationDate: consultationDate
          }).then(result => {
            setListImage(result.data);
            toast.success(t(result.message));
            resolve();
          }).catch(err =>{
            if(err.refreshToken && !isRefresh){
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

  const updateArrayPatient = (newDate,oldDate) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoadingModal(true));
      putToServerWithToken(`/v1/libraryImagePatient/updateArrayImage/${props.patient.currentPatient.id}`,{
        idDoctor: doctor.data.id,
        typeImages: [1, 2, 3, 4],
        newDate: newDate,
        oldDate: oldDate
      }).then(result => {
        setListImage(result.data);
        toast.success(result.message);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>updateArrayPatient(newDate,oldDate));
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const updateImage = (idImage,consultationDate,typeImage,newUrl) => {
    return new Promise((resolve,reject) => {
      dispatch(setLoadingModal(false));
      putToServerWithToken(`/v1/libraryImagePatient/${props.patient.currentPatient.id}`,{
        idDoctor: doctor.data.id,
        typeImages: [1, 2, 3, 4],
        idImage: idImage,
        consultationDate: consultationDate,
        typeImage: typeImage,
        linkImage: newUrl
      }).then(result => {
        setListImage(result.data);
        toast.success(result.message);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>updateImage(idImage,consultationDate,typeImage,newUrl));
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const deleteImagePatient = (isDelete) => {
    setOpenDeleteConfirm(false);
    dispatch(setLoadingModal(true));
    return new Promise((resolve,reject) => {
      if(isDelete){
        deleteToServerWithToken(`/v1/libraryImagePatient/${props.patient.currentPatient.id}?idImage=${idImageDelete}&typeImages=radiography`).then(result => {
          setListImage(result.data);
          setOpenDeleteConfirm(false);
          setIdImageDelete('');
          setPublicIdDelete('');
          toast.warning(result.message);
          resolve();
        }).catch(err => {
          toast.error(t(err.message));
        }).finally(()=>dispatch(setLoadingModal(false)));
      }else{
        deleteImage(publicIdDelete).then(async (response) => {
          if(response.data.result==="ok"){
            deleteToServerWithToken(`/v1/libraryImagePatient/${props.patient.currentPatient.id}?idImage=${idImageDelete}&typeImages=radiography`).then(result => {
              setListImage(result.data);
              setOpenDeleteConfirm(false);
              setIdImageDelete('');
              setPublicIdDelete('');
              toast.warning(result.message);
              resolve();
            }).catch(err =>{
              if(err.refreshToken && !isRefresh){
                refreshToken(nav,dispatch).then(()=>deleteImagePatient(true));
              }else{
                toast.error(t(err.message));
              }
              reject();
            }).finally(()=>dispatch(setLoadingModal(false)));
          }
        })
      }
    })
  }

  const handleClose = () => {
    setOpenDeleteConfirm(false);
    setIdImageDelete('');
  }

  const roleCheck = roleOfDoctor==='edit';

  return <div className="h-100 w-100 d-flex flex-column justify-content-start mt-1 mb-4">
    <ShowImageModal/>
    {
      roleCheck && 
      <React.Fragment>
        <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
          <span className="text-uppercase">
            {t('upload radiography image')}
          </span>
        </div>
        <div className="container">
          <fieldset className="border row rounded mt-3">
            <legend className="d-flex align-items-center float-none px-0 ms-auto me-2 w-auto">
              <div className="border rounded d-flex align-items-center py-1">
                <span className="px-2 text-capitalize d-md-block d-none text-gray" style={{fontSize:FONT_SIZE}}>
                  {t('consultation date')}:
                </span>
                <fieldset className="border rounded px-1 border-0 " style={{fontSize:"small"}}>
                  <input className="border-0 p-0 form-input" style={{outline:"none"}} type={"date"} value={consultationDate} onChange={e=>setConsultationDate(e.target.value)}/>
                </fieldset>
              </div>
            </legend>
            <div className="d-flex flex-wrap align-items-center mb-3 p-0 justify-content-start ps-4 flex-row w-100">
                <div className="me-4 mb-2" style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_UPLOAD_IMAGE}}>
                  <UploadImage 
                    imageIcon="/assets/images/1.png" 
                    styleImage={{height:"50px"}} 
                    alt={t(IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name)} 
                    className="border-0 hoverGreenLight h-100" 
                    style={{fontSize:FONT_SIZE,width:SIZE_UPLOAD_IMAGE}}
                    getUrlImage={value=>{}}
                    getImage={value => uploadImageToCloudinary(value,1,false)}
                  />
                </div>
                <div className="me-4 mb-2" style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_UPLOAD_IMAGE}}>
                  <UploadImage 
                    imageIcon="/assets/images/2.png" 
                    styleImage={{height:"50px"}} 
                    alt={t(IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name)} 
                    className="border-0 hoverGreenLight h-100" 
                    style={{fontSize:FONT_SIZE,width:SIZE_UPLOAD_IMAGE}}
                    getUrlImage={value=>{}}
                    getImage={value => uploadImageToCloudinary(value,2,false)}
                  />
                </div>
                <div className="me-4 mb-2" style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_UPLOAD_IMAGE}}>
                  <UploadImage 
                    imageIcon="/assets/images/3.png" 
                    styleImage={{height:"50px"}} 
                    alt={t(IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name)} 
                    className="border-0 hoverGreenLight h-100" 
                    style={{fontSize:FONT_SIZE,width:SIZE_UPLOAD_IMAGE}}
                    getUrlImage={value=>{}}
                    getImage={value => uploadImageToCloudinary(value,3,false)}
                  />
                </div>
                <div className="me-4 mb-2" style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_UPLOAD_IMAGE}}>
                  <UploadImage 
                    imageIcon="/assets/images/4.png" 
                    styleImage={{height:"50px"}} 
                    alt={t(IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name)} 
                    className="border-0 hoverGreenLight h-100" 
                    style={{fontSize:FONT_SIZE,width:SIZE_UPLOAD_IMAGE}}
                    getUrlImage={value=>{}}
                    getImage={value => uploadImageToCloudinary(value,4,false)}
                  />
                </div>
            </div>
          </fieldset>
        </div>
      </React.Fragment>
    }
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('list radiography images')}
      </span>
    </div>
    {
      Object.keys(listImage)?.map((date,index) => {
        return <div className="container" key={index+date}>
          <fieldset className="border row rounded mt-3">
            <legend className="d-flex align-items-center float-none px-0 ms-auto me-2 w-auto">
              <div className="border rounded d-flex align-items-center py-1">
                <span className="px-2 text-capitalize d-md-block d-none text-gray" style={{fontSize:FONT_SIZE}}>
                  {t('consultation date')}:
                </span>
                <fieldset className="border rounded px-1 border-0 " style={{fontSize:"small"}}>
                  <input className="border-0 p-0 form-input" style={{outline:"none"}} type={"date"} value={toISODateString(new Date(date))} onChange={e=>updateArrayPatient(e.target.value,date)} disabled={!roleCheck}/>
                </fieldset>
              </div>
            </legend>
            <div className="d-flex align-items-start mb-3 pb-2 justify-content-start px-4 flex-row w-100 flex-wrap">
              {
                listImage[date]?.map((image,_) => {
                  return <div onMouseEnter={e=>{if(roleCheck) setHoverSettingId(image.id)}} onMouseLeave={e=>{if(roleCheck) setHoverSettingId()}} className=" position-relative mt-3" key={image.id}>
                    <img 
                      className="me-4 transform-hover w-auto" 
                      src={splitAvatar(image.linkImage)} 
                      onLoad={onLoad}
                      onError={onError}
                      style={{maxHeight:"250px",cursor:"pointer"}}
                      alt={t(IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name)} 
                      onClick={e=>dispatch(setCurrentImage(splitAvatar(image.linkImage)))}
                      title={t('Click to see')}
                    />
                    {
                      hoverSettingId === image.id &&
                      <React.Fragment>
                        <div className="position-absolute top-0 start-0 p-0" style={{zIndex:"3"}}>
                          <input 
                            className="border-0 mc-pale-background form-input w-auto px-2 rounded text-white" 
                            style={{outline:"none",maxWidth:"120px",fontSize:FONT_SIZE}} 
                            type={"date"} 
                            value={toISODateString(new Date(image.consultationDate))}
                            onChange={e=>updateImage(image.id,e.target.value,image.typeImage,image.linkImage)}
                          />
                        </div>
                        <div className="position-absolute rounded top-0 mt-4 start-0 d-flex flex-column justify-content-center align-items-center" style={{zIndex:"3", backgroundColor:"#E8E8E8"}}>
                          <IconButtonComponent 
                            className="btn-outline-info border-0 p-0" 
                            icon="rotate_right" 
                            FONT_SIZE_ICON={"20px"} 
                            title={t("rotate 90 degree counterclockwise")}
                            onClick={e=>{
                              let newUrl = settingForImage('/a_90',image.linkImage);
                              updateImage(image.id,image.consultationDate,image.typeImage,newUrl);
                            }}
                          />
                          <IconButtonComponent 
                            className="btn-outline-info border-0 p-0" icon="rotate_left" 
                            FONT_SIZE_ICON={"20px"} 
                            title={t("rotate 90 degree clockwise")}
                            onClick={e=>{
                              let newUrl = settingForImage('/a_-90',image.linkImage);
                              updateImage(image.id,image.consultationDate,image.typeImage,newUrl);
                            }}
                          />
                          <IconButtonComponent 
                            className="btn-outline-info border-0 p-0" 
                            icon="flip" 
                            FONT_SIZE_ICON={"20px"} 
                            title={t("horizontal flip")}
                            onClick={e=>{
                              let newUrl = settingForImage('/a_hflip',image.linkImage);
                              updateImage(image.id,image.consultationDate,image.typeImage,newUrl);
                            }}
                          />
                          <IconButtonComponent 
                            className="btn-outline-info border-0 p-0" 
                            icon="border_horizontal" 
                            FONT_SIZE_ICON={"20px"} 
                            title={t("vertical flip")}
                            onClick={e=>{
                              let newUrl = settingForImage('/a_vflip',image.linkImage);
                              updateImage(image.id,image.consultationDate,image.typeImage,newUrl);
                            }}
                          />
                          <IconButtonComponent className="btn-outline-danger border-0 p-0 mt-1" onClick={e=>{setIdImageDelete(image.id);setPublicIdDelete(splitPublic_id(image.linkImage));setOpenDeleteConfirm(true)}} icon="delete" FONT_SIZE_ICON={"20px"} title={t("delete image")}/>
                        </div>
                        <div className="position-absolute bottom-0 end-0 dropup">
                          <button className="btn mc-pale-background me-4" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={`/assets/images/${image.typeImage}.png`} height="35px" alt={t('image x-ray')}/>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item btn btn-outline-secondary d-flex justify-content-start align-items-center" 
                                onClick={e=>updateImage(image.id,image.consultationDate,IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.id,image.linkImage)}
                                disabled={image.typeImage===IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.id}
                              >
                                <img src='/assets/images/1.png' height="35px" alt={t('image x-ray')}/>
                                <span className="text-capitalize text-gray ms-2" style={{fontSize:FONT_SIZE}}>{IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name}</span>
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item btn btn-outline-secondary d-flex justify-content-start align-items-center" 
                                onClick={e=>updateImage(image.id,image.consultationDate,IMAGE_TYPE_LIST.X_RAY.imageList.PA.id,image.linkImage)}
                                disabled={image.typeImage===IMAGE_TYPE_LIST.X_RAY.imageList.PA.id}
                              >
                                <img src='/assets/images/2.png' height="35px" alt={t('image x-ray')}/>
                                <span className="text-capitalize text-gray ms-2" style={{fontSize:FONT_SIZE}}>{IMAGE_TYPE_LIST.X_RAY.imageList.PA.name}</span>
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item btn btn-outline-secondary d-flex justify-content-start align-items-center" 
                                onClick={e=>updateImage(image.id,image.consultationDate,IMAGE_TYPE_LIST.X_RAY.imageList.PANORAMA.id,image.linkImage)}
                                disabled={image.typeImage===IMAGE_TYPE_LIST.X_RAY.imageList.PANORAMA.id}
                              >
                                <img src='/assets/images/3.png' height="35px" alt={t('image x-ray')}/>
                                <span className="text-capitalize text-gray ms-2" style={{fontSize:FONT_SIZE}}>{IMAGE_TYPE_LIST.X_RAY.imageList.PANORAMA.name}</span>
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item btn btn-outline-secondary d-flex justify-content-start align-items-center" 
                                onClick={e=>updateImage(image.id,image.consultationDate,IMAGE_TYPE_LIST.X_RAY.imageList.OTHER.id,image.linkImage)}
                                disabled={image.typeImage===IMAGE_TYPE_LIST.X_RAY.imageList.OTHER.id}
                              >
                                <img src='/assets/images/4.png' height="35px" alt={t('image x-ray')}/>
                                <span className="text-capitalize text-gray ms-2" style={{fontSize:FONT_SIZE}}>{IMAGE_TYPE_LIST.X_RAY.imageList.OTHER.name}</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    }
                  </div>
                })
              }
            </div>
          </fieldset>
        </div>
      })
    }
    <ConfirmComponent 
      FONT_SIZE={FONT_SIZE}
      open={openDeleteConfirm} 
      title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm delete this image')}</span>} 
      content={
        <div>
          <span className="me-1" style={{fontSize:FONT_SIZE}}>{t('To delete this this image, enter the agree button')}</span>
        </div>
      }
      handleClose={e=>handleClose()} 
      handleSubmit={e=>deleteImagePatient(false)}
    />
  </div>
}