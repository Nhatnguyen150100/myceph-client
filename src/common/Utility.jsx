import axios from 'axios';
import Cookies from 'universal-cookie';
import sha1 from 'sha1';
import { logOutDoctor } from '../redux/DoctorSlice.jsx';
import { clearClinicSlice } from '../redux/ClinicSlice.jsx';
import { clearGeneralSlice } from '../redux/GeneralSlice.jsx';
 
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
export const FONT_SIZE = '15px';
export const FONT_SIZE_ICONS = '45px';
export const FONT_SIZE_HEADER = '17px';


export const clearAllSclice = (dispatch) => {
  dispatch(logOutDoctor());
  dispatch(clearGeneralSlice());
  dispatch(clearClinicSlice());
}
 
export const expireDateCookies = () => {
  const timestamp = new Date().getTime();
  const expire = timestamp + (1000*60*60);
  return new Date(expire);
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

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
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

export const upLoadImage = (image) =>{
  return new Promise((resolve,reject)=>{
    const formData = new FormData()
    formData.append("file", image)
    formData.append("upload_preset","myceph_avatar")
    axios.post(`${CLOUDINARY_BASE_URL}/image/upload`,formData).then(response=>resolve(response)).catch(err=>reject(err));
  })
}
