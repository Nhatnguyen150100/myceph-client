import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import UploadImage from "../../common/UploadImage.jsx";
import { AVATAR_HEIGHT, AVATAR_WIDTH, FONT_SIZE, IMAGE_TYPE_LIST, SELECT_PATIENT_MODE, toISODateString, upLoadImageLibrary } from "../../common/Utility.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { postToServerWithToken } from "../../services/getAPI.jsx";
import { refreshToken } from "../../services/refreshToken.jsx";

const SIZE_UPLOAD_IMAGE = "80px";

export default function RadiographyImages(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);

  const [consultationDate,setConsultationDate] = useState(toISODateString(new Date()));
  const [listImage,setListImage] = useState({});

  const uploadImageToCloudinary = (image,typeImage) => {
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      upLoadImageLibrary(image).then(responseData=>{
        const linkImage = responseData.data.secure_url + '_' + responseData.data.public_id;
        postToServerWithToken(`/v1/libraryImagePatient/${patient.currentPatient.id}`,{
          idDoctor: doctor.data.id,
          linkImage: linkImage,
          typeImage: typeImage,
          consultationDate: consultationDate
        }).then(result => {
          setListImage(result.data);
          toast.success(result.message);
          resolve();
        }).catch(err =>{
          if(err.refreshToken && !isRefresh){
            refreshToken(nav,dispatch).then(()=>uploadImageToCloudinary(image,typeImage));
          }else{
            toast.error(err.message);
          }
          reject();
        }).finally(()=>dispatch(setLoadingModal(false)));
      })
      
    })
  }

  const roleCheck = ((selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor === 'admin') || selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT || patient.currentPatient['SharePatients.roleOfOwnerDoctor']==='edit');

  return <div className="h-100 w-100 d-flex flex-column justify-content-start mt-1">
    {
      roleCheck ? 
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
            <div className="d-flex align-items-center mb-3 p-0 justify-content-start ps-4 flex-row w-100">
                <div className="me-4" style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_UPLOAD_IMAGE}}>
                  <UploadImage 
                    imageIcon="/assets/images/1.png" 
                    styleImage={{height:"50px"}} 
                    alt={t(IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name)} 
                    className="border-0 hoverGreenLight h-100" 
                    style={{fontSize:FONT_SIZE,width:SIZE_UPLOAD_IMAGE}}
                    getUrlImage={value=>{}}
                    getImage={value => uploadImageToCloudinary(value,1)}
                  />
                </div>
                <div className="me-4" style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_UPLOAD_IMAGE}}>
                  <UploadImage 
                    imageIcon="/assets/images/2.png" 
                    styleImage={{height:"50px"}} 
                    alt={t(IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name)} 
                    className="border-0 hoverGreenLight h-100" 
                    style={{fontSize:FONT_SIZE,width:SIZE_UPLOAD_IMAGE}}
                  />
                </div>
                <div className="me-4" style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_UPLOAD_IMAGE}}>
                  <UploadImage 
                    imageIcon="/assets/images/4.png" 
                    styleImage={{height:"50px"}} 
                    alt={t(IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name)} 
                    className="border-0 hoverGreenLight h-100" 
                    style={{fontSize:FONT_SIZE,width:SIZE_UPLOAD_IMAGE}}
                  />
                </div>
                <div className="me-4" style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:SIZE_UPLOAD_IMAGE}}>
                  <UploadImage 
                    imageIcon="/assets/images/5.png" 
                    styleImage={{height:"50px"}} 
                    alt={t(IMAGE_TYPE_LIST.X_RAY.imageList.LATERAL.name)} 
                    className="border-0 hoverGreenLight h-100" 
                    style={{fontSize:FONT_SIZE,width:SIZE_UPLOAD_IMAGE}}
                  />
                </div>
            </div>
          </fieldset>
        </div>
      </React.Fragment>
      :
      <React.Fragment>
        <strong>not edit role</strong>
      </React.Fragment>
    }
  </div>
}