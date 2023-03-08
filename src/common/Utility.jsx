import axios from 'axios';
import Cookies from 'universal-cookie';
import sha1 from 'sha1';
import { logOutDoctor } from '../redux/DoctorSlice.jsx';
import { clearClinicSlice } from '../redux/ClinicSlice.jsx';
import { clearGeneralSlice } from '../redux/GeneralSlice.jsx';
import { clearPatientSlice } from '../redux/PatientSlice.jsx';
 
export const cookies = new Cookies();

export const SITE_KEY_RECAPTCHA = '6LdjIm8kAAAAAFhR2XpewgD4_t-aSsES5cTjNr5L';
export const CLOUDINARY_NAME = 'dvzgiho5t';
export const CLOUDINARY_KEY = '621123368244999';
export const CLOUDINARY_SECRET = 'bg5jrQ0D-YvLgDTDU1fKtFqCyMI';
export const CLOUDINARY_BASE_URL = 'https://api.cloudinary.com/v1_1/dvzgiho5t';

export const WIDTH_HEAD = "150px";
export const WIDTH_CHILD = "300px";
export const FONT_SIZE_ICON = "18px";
export const FONT_SIZE_BUTTON_ICON = "40px";
export const AVATAR_HEIGHT = "300px";
export const AVATAR_WIDTH = "200px";
export const FONT_SIZE_HEAD = '19px';
export const FONT_SIZE = '14px';
export const FONT_TAB = '14px';
export const FONT_SIZE_ICONS = '45px';
export const FONT_SIZE_HEADER = '17px';
export const SIZE_IMAGE_IN_RECORD = '150px'

export const SOFT_WARE_LIST = {
  MEDICAL_RECORD: 'Medical Record',
  IMAGE_LIBRARY: 'Image Library',
  LATERALCEPH: 'LateralCeph',
  CALENDAR: 'Calendar',
  DISCUSSION: 'Discussion'
}

export const SELECT_PATIENT_MODE = {
  MY_PATIENT: "MY_PATIENT",
  CLINIC_PATIENT: "CLINIC_PATIENT",
  SHARE_PATIENT: "SHARE_PATIENT"
}

export const MEDICAL_RECORD_TABS = {
  INFORMATION: "INFORMATION",
  RECORD: "RECORD",
  TREATMENT_HISTORY: "TREATMENT_HISTORY"
}

export const LIBRARY_IMAGES_TABS = {
  RADIOGRAPHY: "RADIOGRAPHY",
  EXTRA_ORAL: "EXTRA_ORAL",
  INTRA_ORAL: "INTRA_ORAL"
}

export const IMAGE_TYPE_LIST = {
  X_RAY: {
    name: 'radiograph',
    icon: 'theaters',
    imageList: {
      LATERAL: {id:1,name:'lateral x-ray image'},
      PA: {id:2,name:'posterior anterior x-ray image'},
      PANORAMA: {id:3,name:'panorama x-ray image'},
      OTHER:{id:4,name:'other x-ray image types'}
    }
  },
  FACE: {
    name:'extra-oral',
    icon:'face',
    imageList: {
      SIDE: {id:5,name:'side face image'},
      FRONTAL: {id:6,name:'frontal face image'},
      OBLIQUE: {id:7,name:'oblique face image'},
      SMILEY: {id:8,name:'smiley face image'},
      OTHER: {id:9,name:'other extra-oral images'}
    }
  },
  INTRA_ORAL: {
    name:'intra-oral',
    icon:'mood_bad',
    imageList: {
      RIGHT_BUCCAL:{id:10,name:'right buccal image'},
      LEFT_BUCCAL: {id:11,name:'left buccal image'},
      ANTERIOR:{id:12,name:'anterior image'},
      MAXILLARY_OCCLUSAL:{id:13,name:'maxillary occlusal image'},
      MANDIBULAR_OCCLUSAL:{id:14,name:'mandibular occlusal image'},
      OTHER:{id:15,name:'other intra oral images'}
    }
  }
}


export const clearAllSclice = (dispatch) => {
  dispatch(logOutDoctor());
  dispatch(clearGeneralSlice());
  dispatch(clearClinicSlice());
  dispatch(clearPatientSlice());
}

export function isValidEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

export function splitEmail(email) {
  const nameEmail = email.split('@');
  return nameEmail[0];
}

export function splitAvatar(url,imageUrl) {
  if(url){
    const avatarUrl = url.split('_');
    return avatarUrl[0];
  }
  return imageUrl;
}

export function splitFirst(string) {
  const stringSplit = string.split('_');
  return stringSplit[0];
}

export function splitLast(string) {
  const stringSplit = string.split('_');
  return stringSplit[1];
}

export function splitPublic_id(url) {
  if(url){
    const avatarUrl = url.split('_');
    return avatarUrl[1];
  }
  return '';
}

export function toISODateString(dateObject) {
  let result = '';
  if(dateObject && typeof dateObject.getMonth === 'function') {
    let month = '' + (dateObject.getMonth() + 1);
    let day = '' + dateObject.getDate();
    let year = dateObject.toISOString().substring(0,4);

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    result = `${year}-${month}-${day}`; 
  }
  return result;
}

export const timeToken = () => {
  const timestamp = new Date().getTime();
  const expire = timestamp + (60 * 60 * 24 * 1000 * 1);
  const expireToken = new Date(expire);
  return expireToken;
}

export function toTimeString(dateObject){
  let hour = dateObject.getHours();
  let minutes  = dateObject.getMinutes();
  let seconds = dateObject.getSeconds();
  return `${hour}:${minutes}:${seconds}`;
}

export function convertISOToVNDateString(dateString) {
  let result = "";
  if(dateString) {
    let partArray = dateString.split("-").reverse();
    if(partArray.length==3) {
      for(let part of partArray) if(part.length<2) part = `0${part}`;
      result = partArray.join('/');
    }
  }
  return result;
}

export const deleteImage = (publicIdAvatar) => {
  return new Promise((resolve, reject) =>{
    const timestamp = new Date().getTime();
    const string = `public_id=${publicIdAvatar}&timestamp=${timestamp}${CLOUDINARY_SECRET}`;
    const signature = sha1(string);
    const formData = new FormData();
    formData.append("public_id",publicIdAvatar);
    formData.append("signature",signature);
    formData.append("api_key",CLOUDINARY_KEY);
    formData.append("timestamp",timestamp);
    axios.post(`${CLOUDINARY_BASE_URL}/image/destroy`,formData).then(response=>resolve(response)).catch(error=>reject(error));
  })
}

export function computeAge(birthday) {
  let age,month;
  if(birthday) {
    let currentMonth = (new Date(Date.now())).getMonth();
    let birthMonth =  (new Date(Date.parse(birthday))).getMonth();
    age = (new Date(Date.now())).getFullYear()-(new Date(Date.parse(birthday))).getFullYear();
    if(currentMonth<birthMonth) age = age-1;
    if(age<=20) month = currentMonth<birthMonth?currentMonth+12-birthMonth:currentMonth-birthMonth;
  }
  return {age,month}
}

export const upLoadImage = (image) =>{
  return new Promise((resolve,reject)=>{
    const formData = new FormData()
    formData.append("file", image)
    formData.append("upload_preset","myceph_avatar")
    axios.post(`${CLOUDINARY_BASE_URL}/image/upload`,formData).then(response=>resolve(response)).catch(err=>reject(err));
  })
}
