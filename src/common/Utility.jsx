import Cookies from 'universal-cookie';
 
export const cookies = new Cookies();

export const SITE_KEY_RECAPTCHA = '6LdjIm8kAAAAAFhR2XpewgD4_t-aSsES5cTjNr5L';

export function isValidEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

export function splitEmail(email) {
  const nameEmail = email.split('@');
  return nameEmail[0];
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
