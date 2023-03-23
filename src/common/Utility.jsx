import axios from 'axios';
import Cookies from 'universal-cookie';
import sha1 from 'sha1';
import { logOutDoctor } from '../redux/DoctorSlice.jsx';
import { clearClinicSlice } from '../redux/ClinicSlice.jsx';
import { clearGeneralSlice } from '../redux/GeneralSlice.jsx';
import { clearPatientSlice } from '../redux/PatientSlice.jsx';
import { clearImageSlice } from '../redux/LibraryImageSlice.jsx';
import { clearCalendarSlice } from '../redux/CalendarSlice.jsx';
 
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
export const FONT_SIZE_ICONS = '35px';
export const FONT_SIZE_HEADER = '17px';
export const SIZE_IMAGE_IN_RECORD = '150px'

export const SOFT_WARE_LIST = {
  MEDICAL_RECORD: 'Medical Record',
  IMAGE_LIBRARY: 'Image Library',
  LATERALCEPH: 'LateralCeph',
  CALENDAR: 'Calendar',
  DISCUSSION: 'Discussion'
}

export const VIEW_CALENDAR = {
  BY_DATE : 'BY_DATE',
  BY_PATIENT: 'BY_PATIENT'
}

export const SELECT_PATIENT_MODE = {
  MY_PATIENT: "MY_PATIENT",
  CLINIC_PATIENT: "CLINIC_PATIENT",
  SHARE_PATIENT: "SHARE_PATIENT",
  SCHEDULE : "SCHEDULE",
}

export const MEDICAL_RECORD_TABS = {
  INFORMATION: "INFORMATION",
  RECORD: "RECORD",
  TREATMENT_HISTORY: "TREATMENT_HISTORY"
}

export const IMAGE_TYPE_LIST = {
  X_RAY: {
    name: 'RADIOGRAPHY',
    icon: 'theaters',
    imageList: {
      LATERAL: {id:1,name:'lateral x-ray image'},
      PA: {id:2,name:'posterior anterior x-ray image'},
      PANORAMA: {id:3,name:'panorama x-ray image'},
      OTHER:{id:4,name:'other x-ray image types'}
    }
  },
  FACE: {
    name:'EXTRA_ORAL',
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
    name:'INTRA_ORAL',
    icon:'sentiment_very_satisfied',
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

/**
 * todo: Xóa toàn bộ giá trị của slice
 * @param {*} dispatch 
 */
export const clearAllSlice = (dispatch) => {
  dispatch(clearImageSlice());
  dispatch(logOutDoctor());
  dispatch(clearGeneralSlice());
  dispatch(clearClinicSlice());
  dispatch(clearPatientSlice());
  dispatch(clearCalendarSlice());
}

/**
 * todo: kiểm tra Email có hợp lệ không
 * @param {*} email 
 * @returns boolean
 */
export function isValidEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

/**
 * todo: trả về giờ phút từ ngày
 * @param {*} date 
 * @returns hh:mm
 */
export function getHoursMinutesSeconds(date){
  let hours = date.getHours();
  if(hours<10) hours = '0'+hours.toString();
  let minutes = date.getMinutes();
  if(minutes<10) minutes = '0'+minutes.toString();
  return hours +':'+ minutes
}


/**
 * todo: Tìm 1 Object trong 1 array
 * @param {*} array mảng truyền vào
 * @param {*} idObject id của Object cần tìm
 * @returns Object cần tìm trong array
 */
export const findObjectFromArray = (array, idObject) =>{
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if(element.id === idObject) return element;
  }
}


/**
 * todo: Tìm đầu của email
 * @param {*} email 
 * @returns 
 */
export function splitEmail(email) {
  const nameEmail = email.split('@');
  return nameEmail[0];
}


/**
 * todo: trả về ngày tháng năm đầy đủ cùng với giờ và phút được thêm vào
 * @param {*} day ngày không có giờ phút
 * @param {*} hours hh:mm giờ và phút
 * @returns 
 */
export function concatDayAndHours(day, hours) {
  let splitHours = hours.split(':');
  let fullDay = new Date(day);
  fullDay.setHours(splitHours[0]);
  fullDay.setMinutes(splitHours[1]);
  return fullDay;
}

/**
 * todo: chuyển dữ liệu trả về từ server thành events mà Calendar nhận
 * @param {*} listAppointmentDate 
 * @returns 
 */
export function convertAppointmentDateToEvents(listAppointmentDate) {
  let events = [];
  for (let index = 0; index < listAppointmentDate.length; index++) {
    const element = listAppointmentDate[index];
    events.push({
      title: element.Patient.fullName,
      start: concatDayAndHours(element.appointmentDate,element.startTime),
      end: concatDayAndHours(element.appointmentDate,element.endTime),
      resourceId: element.idRoom,
      room: element.RoomOfClinic,
      service: {...element.ServicesOfClinic, idService: element.idService},
      status: {...element.StatusOfClinic, idStatus: element.idStatus},
      doctor: {...element.Doctor, idDoctor: element.idDoctorSchedule},
      note: element.note,
      idPatient: element.idPatientSchedule,
      idSchedule: element.id
    })
  }
  return events;
}


export function settingForImage(value,linkImage){
  if(linkImage){
    const urlSplit = linkImage.split('upload');
    let newUrl =  urlSplit[0].concat('upload',`${value}`,urlSplit[1]);
    return newUrl;
  }else return '';
}

export function splitAvatar(url,imageUrl) {
  if(url){
    const avatarUrl = url.split('|');
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
    const avatarUrl = url.split('|');
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

export const timeRefreshToken = () => {
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

export const upLoadImageLibrary = (image) =>{
  return new Promise((resolve,reject)=>{
    const formData = new FormData()
    formData.append("file", image)
    formData.append("upload_preset","myceph_library")
    axios.post(`${CLOUDINARY_BASE_URL}/image/upload`,formData).then(response=>resolve(response)).catch(err=>reject(err));
  })
}

export const getImage = (url) => {
  return new Promise(function(resolve, reject){
    var img = new Image()
    img.onload = function(){
        resolve(url)
    }
    img.onerror = function(){
        reject(url)
    }
    img.src = url
  })
}

