import axios from 'axios';
import Cookies from 'universal-cookie';
import sha1 from 'sha1';
import { logOutDoctor } from '../redux/DoctorSlice.jsx';
import { clearClinicSlice } from '../redux/ClinicSlice.jsx';
import { clearGeneralSlice } from '../redux/GeneralSlice.jsx';
import { clearPatientSlice } from '../redux/PatientSlice.jsx';
import { clearImageSlice } from '../redux/LibraryImageSlice.jsx';
import { clearCalendarSlice } from '../redux/CalendarSlice.jsx';
import { toast } from 'react-toastify';
import { deCryptData } from './Crypto.jsx';
import { clearLateralCephSlice } from '../redux/LateralCephSlice.jsx';
import { CLOUDINARY_BASE_URL, CLOUDINARY_KEY, CLOUDINARY_SECRET } from '../config/Cloudinary.jsx';
const { Buffer } = require('buffer');

// Đảm bảo rằng đối tượng Buffer được định nghĩa đúng cách trong môi trường trình duyệt
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export const cookies = new Cookies();

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
export const SIZE_IMAGE_IN_RECORD = '170px'

export const SOFT_WARE_LIST = {
  SHARE_PATIENT: 'Sharing patient records',
  DOCTOR_MANAGEMENT: 'Doctor record management',
  MEDICAL_RECORD: 'Medical Record',
  IMAGE_LIBRARY: 'Image Library',
  LATERALCEPH: 'LateralCeph',
  CURVE_ANALYSIS: 'Curve draw',
  CALENDAR: 'Calendar',
  DISCUSSION: 'Discussion',
  CALCULATOR_TOOTH_MOVEMENT:"Calculator tooth movement"
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
  TREATMENT_HISTORY: "TREATMENT_HISTORY",
  ACTIVITY_HISTORY: "ACTIVITY_HISTORY"
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
  dispatch(clearLateralCephSlice());
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
 * todo: Giải mã trước data
 * @param {*} mode trạng thái của bệnh nhân
 * @param {*} data dữ liệu bệnh nhân
 * @param {*} encryptKeyDoctor khóa của bác sĩ
 * @param {*} encryptKeyClinic khóa của phòng khám
 * @param {*} encryptKeySharePatient khóa của bệnh nhân được chia sẻ
 * @returns dữ liệu sau giải mã
 */
export const onDecryptedDataPreview = (mode,data,encryptKeyDoctor,encryptKeyClinic,encryptKeySharePatient) => {
  if(!data) return ''
  else if(mode===SELECT_PATIENT_MODE.MY_PATIENT && encryptKeyDoctor){
    return deCryptData(encryptKeyDoctor.key,encryptKeyDoctor.iv,JSON.parse(data).tag,JSON.parse(data).encrypted);
  }else if(mode===SELECT_PATIENT_MODE.CLINIC_PATIENT && encryptKeyClinic){
    return deCryptData(encryptKeyClinic.key,encryptKeyClinic.iv,JSON.parse(data).tag,JSON.parse(data).encrypted);
  }else if(mode===SELECT_PATIENT_MODE.SHARE_PATIENT && encryptKeySharePatient){
    return deCryptData(encryptKeySharePatient.key,encryptKeySharePatient.iv,JSON.parse(data).tag,JSON.parse(data).encrypted);
  }else{
    return '---'
  }
}

export const onDecryptedDataPreviewInArray = (array, encryptKeyClinic) => {
  for (const iterator of array) {
    if((iterator.isEncrypted && onDecryptedDataPreview(SELECT_PATIENT_MODE.CLINIC_PATIENT,iterator.gender,null,encryptKeyClinic,null) !== '---') || !iterator.isEncrypted) return iterator
  }
  return null
}


/**
 * todo: Tìm 1 Object trong 1 array
 * @param {*} array mảng truyền vào
 * @param {*} idObject id của Object cần tìm
 * @returns Object cần tìm trong array
 */
export const findObjectFromArray = (array, idObject) =>{
  if(array && array.length > 0){
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(element.id === idObject) return element;
    }
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
 * todo: chuyển từ 24h sang 12h
 * @param {*} timeString 
 * @returns 
 */
export const timeString12hr = (timeString) => {
  return new Date('1970-01-01T' + timeString + 'Z')
  .toLocaleTimeString('en-US',
    {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
  );
}

/**
 * todo: trả về ngày tháng năm đầy đủ cùng với giờ và phút được thêm vào
 * @param {*} day ngày không có giờ phút
 * @param {*} hours hh:mm giờ và phút
 * @returns 
 */
export const concatDayAndHours = (day, hours) => {
  let splitHours = hours.split(':');
  let fullDay = new Date(day);
  fullDay.setHours(splitHours[0]);
  fullDay.setMinutes(splitHours[1]);
  return fullDay;
}


/**
 * todo: lấy dữ diệu tương ứng theo từng quý ( 3 tháng 1 )
 * @param {*} listAppointmentDate Danh sách lịch hẹn
 * @param {*} id id của service hoặc status
 * @param {*} mode service hoặc status
 * @param {*} quarter quý trong 1 năm: quarter1, quarter2, quarter3, quarter4
 * @returns [data1,data2,data3,data4]
 */
export const getServicesDataForChart = (listAppointmentDate,id,mode,quarter) => {
  // 4 data tương ứng với 4 tháng của 1 quý
  let data1 = 0;
  let data2 = 0;
  let data3 = 0;
  if(quarter === "quarter1"){
    for (let index = 0; index < listAppointmentDate.length; index++) {
      const element = listAppointmentDate[index];
      if(element[mode] !== id) continue;
      if((new Date(element.appointmentDate).getMonth()+1) === 1) data1++;
      else if((new Date(element.appointmentDate).getMonth()+1) === 2){
        data2++;
      }
      else if((new Date(element.appointmentDate).getMonth()+1) === 3) data3++;
    }
  }else if(quarter === "quarter2"){
    for (let index = 0; index < listAppointmentDate.length; index++) {
      const element = listAppointmentDate[index];
      if(element[mode] !== id) continue;
      if((new Date(element.appointmentDate).getMonth()+1) === 4) data1++;
      else if((new Date(element.appointmentDate).getMonth()+1) === 5) data2++;
      else if((new Date(element.appointmentDate).getMonth()+1) === 6) data3++;
    }
  }else if(quarter === "quarter3"){
    for (let index = 0; index < listAppointmentDate.length; index++) {
      const element = listAppointmentDate[index];
      if(element[mode] !== id) continue;
      if((new Date(element.appointmentDate).getMonth()+1) === 7) data1++;
      else if((new Date(element.appointmentDate).getMonth()+1) === 8) data2++;
      else if((new Date(element.appointmentDate).getMonth()+1) === 9) data3++;
    }
  }else{
    for (let index = 0; index < listAppointmentDate.length; index++) {
      const element = listAppointmentDate[index];
      if(element[mode] !== [id]) continue;
      if((new Date(element.appointmentDate).getMonth()+1) === 10) data1++;
      else if((new Date(element.appointmentDate).getMonth()+1) === 11) data2++;
      else if((new Date(element.appointmentDate).getMonth()+1) === 12) data3++;
    }
  }
  return [data1,data2,data3];
}

/**
 * todo: chuyển dữ liệu trả về từ server thành events mà Calendar nhận
 * @param {*} listAppointmentDate 
 * @returns 
 */
export const convertAppointmentDateToEvents = (listAppointmentDate) => {
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

/**
 * todo: chuyển dữ liệu trả về từ server thành event mà table nhận trong tab BY_PATIENT
 * @param {*} listAppointmentDate 
 * @returns 
 */
 export const convertAppointmentDateToEvent = (appointmentDate) => {
  let event;
  event = {
    title: appointmentDate.Patient.fullName,
    start: concatDayAndHours(appointmentDate.appointmentDate,appointmentDate.startTime),
    end: concatDayAndHours(appointmentDate.appointmentDate,appointmentDate.endTime),
    resourceId: appointmentDate.idRoom,
    room: appointmentDate.RoomOfClinic,
    service: {...appointmentDate.ServicesOfClinic, idService: appointmentDate.idService},
    status: {...appointmentDate.StatusOfClinic, idStatus: appointmentDate.idStatus},
    doctor: {...appointmentDate.Doctor, idDoctor: appointmentDate.idDoctorSchedule},
    note: appointmentDate.note,
    idPatient: appointmentDate.idPatientSchedule,
    idSchedule: appointmentDate.id
  }
  return event;
}

/**
 * todo: format số sang tiền Việt Nam
 * @param {*} money số tiền
 * @returns tiền Việt Nam
 */
export const forMatMoneyVND = (money) => {
  return money.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}

export async function readPEMFile(filePath) {
  try {
    const response = await axios.get(filePath);
    return response.data;
  } catch (error) {
    toast.error(error);
  }
}

export const settingForImage = (value,linkImage) => {
  if(linkImage){
    const urlSplit = linkImage.split('upload');
    let newUrl =  urlSplit[0].concat('upload',`${value}`,urlSplit[1]);
    return newUrl;
  }else return '';
}

export const splitAvatar = (url,imageUrl) => {
  if(url){
    const avatarUrl = url.split('|');
    return avatarUrl[0];
  }
  return imageUrl;
}

export const splitFirst = (string) => {
  const stringSplit = string.split('_');
  return stringSplit[0];
}

export const splitLast = (string) => {
  const stringSplit = string.split('_');
  return stringSplit[1];
}

export const splitPublic_id = (url) => {
  if(url){
    const avatarUrl = url.split('|');
    return avatarUrl[1];
  }
  return '';
}

export const toISODateString = (dateObject) => {
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

export const toTimeString = (dateObject) => {
  let hour = dateObject.getHours();
  let minutes  = dateObject.getMinutes();
  let seconds = dateObject.getSeconds();
  return `${hour}:${minutes}:${seconds}`;
}

export const convertISOToVNDateString = (dateString) => {
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

export const computeAge = (birthday) => {
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

/**
 * todo: Tìm key của object dựa vào value
 * @param {*} object 
 * @param {*} value 
 * @returns 
 */
export const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}

/**
 * todo: Tìm key của object dựa vào value
 * @param {*} object 
 * @param {*} value 
 * @returns 
 */
export const getKeyByNameValue = (object, value) => {
  return Object.keys(object).find(key => object[key].name === value);
}

export const removeVietnameseDiacritics = (str) => {
  if(!str) return '';
  return str.replace(/[\u00E0\u00E1\u00E2\u00E3\u00E4\u00E5]/g, "a")
            .replace(/[\u00E8\u00E9\u00EA\u00EB]/g, "e")
            .replace(/[\u00EC\u00ED\u00EE\u00EF]/g, "i")
            .replace(/[\u00F2\u00F3\u00F4\u00F5\u00F6]/g, "o")
            .replace(/[\u00F9\u00FA\u00FB\u00FC]/g, "u")
            .replace(/[\u00FD\u00FF]/g, "y")
            .replace(/[\u0111]/g, "d")
            .replace(/[\u00C0\u00C1\u00C2\u00C3\u00C4\u00C5]/g, "A")
            .replace(/[\u00C8\u00C9\u00CA\u00CB]/g, "E")
            .replace(/[\u00CC\u00CD\u00CE\u00CF]/g, "I")
            .replace(/[\u00D2\u00D3\u00D4\u00D5\u00D6]/g, "O")
            .replace(/[\u00D9\u00DA\u00DB\u00DC]/g, "U")
            .replace(/[\u00DD]/g, "Y")
            .replace(/[\u0110]/g, "D");
}

export const findNextObject = (currentKey,keyArray,checkObject) => {
  if(!currentKey || !keyArray || !checkObject) return null;
  const currentIndexObject = keyArray.findIndex(element => element === currentKey);
  let nextIndexObject;
  if(currentIndexObject === keyArray.length - 1) nextIndexObject = 0;
  else nextIndexObject = currentIndexObject + 1;

  while(true){
    // eslint-disable-next-line no-loop-func
    if(!Object.keys(checkObject).find(element => element === keyArray[nextIndexObject])) return keyArray[nextIndexObject]
    else nextIndexObject++;

    if(currentIndexObject === nextIndexObject) break;
    

  }
  return null;
}
