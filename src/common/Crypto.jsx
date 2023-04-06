import crypto from 'crypto-browserify';
import { toast } from 'react-toastify';

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const HASH_ALGORITHM = 'md5';

/**
 * todo: Tạo 1 key random 32bit
 * @returns key
 */
export const generateKeyForEncryption = () => {
  const key = crypto.createHash(HASH_ALGORITHM).update(crypto.randomBytes(32)).digest('hex').substring(0, 32);
  return key;
}

/**
 * todo: Tạo 1 iv random 32bit
 * @returns key
 */
export const generateIvForEncryption = () => {
  const iv = crypto.createHash(HASH_ALGORITHM).update(crypto.randomBytes(12)).digest('hex').substring(0, 32);
  return iv;
}


/**
 * todo: tạo 1 cipher để mã hóa dữ liệu
 * @returns 
 */
export const generateCipherForEncryption = (key,iv) =>{
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  return cipher;
}

/**
 * todo: tạo 1 decipher để giải mã dữ liệu
 * @returns 
 */
 export const generateDeCipherForEncryption = (key,iv) =>{
  const deCipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
  return deCipher;
}


/**
 * todo: mã hóa dữ liệu sử dụng key và iv
 * @param {*} key 
 * @param {*} iv 
 * @param {*} data 
 * @returns encrypted: dữ liệu sau mã hóa ở dạng hex, tag: dùng trong quá trình giải mã
 */
export const encryptData = (key, iv, data) => {
  const cipher = generateCipherForEncryption(key,iv);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(data, 'utf-8')),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return {
    encrypted: encrypted.toString('hex'),
    tag: authTag.toString('hex')
  }
}

/**
 * todo: giải mã dữ liệu sử dụng key, iv, tagAuthenticate, encryptedData
 * @param {*} key khóa key
 * @param {*} iv vector iv
 * @param {*} tag tag kiểm tra toàn vẹn dữ liệu
 * @param {*} encryptedData dữ liệu bị mã hóa
 * @returns dữ liệu sau giải mã, nếu giải mã thất bại sẽ trả về '---'
 */
export const deCryptData = (key,iv,tag,encryptedData) => {
  try {
    const decipher = generateDeCipherForEncryption(key,iv);
    decipher.setAuthTag(Buffer.from(tag,'hex'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData,'hex')),
      decipher.final(),
    ]);
    return decrypted.toString('utf-8');
  }catch{
    return '---'
  }
}

export const encryptPatientData = (key,iv,data) => {
  const patientData = data.infoOfPatient;
  const patientListData = data.otherInformation;
  let informationEncrypted = {
    gender : patientData.gender ? JSON.stringify(encryptData(key,iv,patientData.gender)) : null,
    phoneNumber: patientData.phoneNumber ? JSON.stringify(encryptData(key,iv,patientData.phoneNumber.toString())) : null,
    address: patientData.address ? JSON.stringify(encryptData(key,iv,patientData.address)) : null,
    chiefcomplaint: patientData.chiefComplaint ? JSON.stringify(encryptData(key,iv,patientData.chiefcomplaint)) : null,
    note: patientData.note ? JSON.stringify(encryptData(key,iv,patientData.note)) : null
  }
  let historyEncrypted = {
    dentalHistory: patientData.histories.dentalHistory ? JSON.stringify(encryptData(key,iv,patientData.histories.dentalHistory)) : null,
    medicalHistory: patientData.histories.medicalHistory ? JSON.stringify(encryptData(key,iv,patientData.histories.medicalHistory)) : null,
    cvmi: patientData.histories.cvmi ? JSON.stringify(encryptData(key,iv,patientData.histories.cvmi)) : null,
    otherMethodToEvaluate: patientData.histories.otherMethodToEvaluate ? JSON.stringify(encryptData(key,iv,patientData.histories.otherMethodToEvaluate)) : null,
    respiration: patientData.histories.respiration ? JSON.stringify(encryptData(key,iv,patientData.histories.respiration)) : null,
    habits: patientData.histories.habits ? JSON.stringify(encryptData(key,iv,patientData.histories.habits)) : null,
    familyHistory: patientData.histories.familyHistory ? JSON.stringify(encryptData(key,iv,patientData.histories.familyHistory)) : null,
    compliance: patientData.histories.compliance ? JSON.stringify(encryptData(key,iv,patientData.histories.compliance)) : null
  }
  let extraOralEncrypted = {
    faceAsymetry: patientData.extraOrals.faceAsymetry ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.faceAsymetry)) : null,
    chin: patientData.extraOrals.chin ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.chin)) : null,
    lipCompetence: patientData.extraOrals.lipCompetence ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.lipCompetence)) : null,
    lipPostureApart: patientData.extraOrals.lipPostureApart ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.lipPostureApart.toString())) : null,
    normalNaresExposure: patientData.extraOrals.normalNaresExposure ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.normalNaresExposure)) : null,
    alarBaseWidth: patientData.extraOrals.alarBaseWidth ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.alarBaseWidth)) : null,
    lipWidth: patientData.extraOrals.lipWidth ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.lipWidth)) : null,
    verticalDimensions: patientData.extraOrals.verticalDimensions ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.verticalDimensions)) : null,
    overallProfile: patientData.extraOrals.overallProfile ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.overallProfile)) : null,
    lowerThirdProfile: patientData.extraOrals.lowerThirdProfile ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.lowerThirdProfile)) : null,
    nasolabialAngle: patientData.extraOrals.nasolabialAngle ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.nasolabialAngle)) : null,
    softTissuePogonion: patientData.extraOrals.softTissuePogonion ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.softTissuePogonion)) : null,
    mandibularPlaneAngle: patientData.extraOrals.mandibularPlaneAngle ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.mandibularPlaneAngle)) : null,
    obliqueAnalysis: patientData.extraOrals.obliqueAnalysis ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.obliqueAnalysis)) : null,
    teethDisplay: patientData.extraOrals.teethDisplay ? JSON.stringify(encryptData(key,iv,patientData.extraOrals.teethDisplay)) : null,
    gingivalDisplayLevel: patientData.extraOrals.gingivalDisplayLevel ? JSON.stringify(encryptData(key,iv, patientData.extraOrals.gingivalDisplayLevel)) : null,
    incisalDisplayMaxillary: patientData.extraOrals.incisalDisplayMaxillary ? JSON.stringify(encryptData(key,iv, patientData.extraOrals.incisalDisplayMaxillary)) : null,
    incisalDisplayMandibular: patientData.extraOrals.incisalDisplayMandibular ? JSON.stringify(encryptData(key,iv, patientData.extraOrals.incisalDisplayMandibular)) : null,
    smileArc: patientData.extraOrals.smileArc ? JSON.stringify(encryptData(key,iv, patientData.extraOrals.smileArc)) : null,
    restPositionIncisalDisplay: patientData.extraOrals.restPositionIncisalDisplay ? JSON.stringify(encryptData(key,iv, patientData.extraOrals.restPositionIncisalDisplay)) : null
  }
  let intralOralEncrypted = {
    oralHygiene: patientData.intraOrals.oralHygiene ? JSON.stringify(encryptData(key,iv, patientData.intraOrals.oralHygiene)) : null,
    dentition: patientData.intraOrals.dentition ? JSON.stringify(encryptData(key,iv, patientData.intraOrals.dentition)) : null,
    caries: patientData.intraOrals.caries ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.caries)) : null,
    missing: patientData.intraOrals.missing ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.missing)) : null,
    wearingTeeth: patientData.intraOrals.wearingTeeth ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.wearingTeeth)) : null,
    detalAldevelopment: patientData.intraOrals.detalAldevelopment ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.detalAldevelopment)) : null,
    otherProblems: patientData.intraOrals.otherProblems ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.otherProblems)) : null,
    archForm: patientData.intraOrals.archForm ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.archForm)) : null,
    rightCanine: patientData.intraOrals.rightCanine ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.rightCanine)) : null,
    rightMolar: patientData.intraOrals.rightMolar ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.rightMolar)) : null,
    leftCanine: patientData.intraOrals.leftCanine ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.leftCanine)) : null,
    leftMolar: patientData.intraOrals.leftMolar ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.leftMolar)) : null,
    overjet: patientData.intraOrals.overjet ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.overjet.toString())) : null,
    overbite: patientData.intraOrals.overbite ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.overbite.toString())) : null,
    curveOfSpee: patientData.intraOrals.curveOfSpee ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.curveOfSpee.toString())) : null,
    cant: patientData.intraOrals.cant ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.cant)) : null,
    posteriorRight: patientData.intraOrals.posteriorRight ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.posteriorRight)) : null,
    posteriorLeft: patientData.intraOrals.posteriorLeft ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.posteriorLeft)) : null,
    upperMidline: patientData.intraOrals.upperMidline ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.upperMidline)) : null,
    lowerMidline: patientData.intraOrals.lowerMidline ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.lowerMidline)) : null,
    deviate: patientData.intraOrals.deviate ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.deviate)) : null,
    crCoDiscrepancy: patientData.intraOrals.crCoDiscrepancy ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.crCoDiscrepancy)) : null,
    maximumMouthOpening: patientData.intraOrals.maximumMouthOpening ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.maximumMouthOpening.toString())) : null,
    guidanceOnProtrusion: patientData.intraOrals.guidanceOnProtrusion ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.guidanceOnProtrusion)) : null,
    guidanceOnRight: patientData.intraOrals.guidanceOnRight ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.guidanceOnRight)) : null,
    guidanceOnLeft: patientData.intraOrals.guidanceOnLeft ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.guidanceOnLeft)) : null,
    musculature: patientData.intraOrals.musculature ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.musculature)) : null,
    swallowingPattern: patientData.intraOrals.swallowingPattern ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.swallowingPattern)) : null,
    historyOfTMD: patientData.intraOrals.historyOfTMD ? JSON.stringify(encryptData(key,iv,patientData.intraOrals.historyOfTMD)) : null
  }
  let radiographyEncrypted = {
    sinuses: patientData.radiographies.sinuses ? JSON.stringify(encryptData(key,iv,patientData.radiographies.sinuses)) : null,
    condyles: patientData.radiographies.condyles ? JSON.stringify(encryptData(key,iv,patientData.radiographies.condyles)) : null,
    apparentPathology: patientData.radiographies.apparentPathology ? JSON.stringify(encryptData(key,iv,patientData.radiographies.apparentPathology)) : null,
    alveolarBoneHeights: patientData.radiographies.alveolarBoneHeights ? JSON.stringify(encryptData(key,iv,patientData.radiographies.alveolarBoneHeights)) : null,
    crownRootRatio: patientData.radiographies.crownRootRatio ? JSON.stringify(encryptData(key,iv,patientData.radiographies.crownRootRatio)) : null,
    others: patientData.radiographies.others ? JSON.stringify(encryptData(key,iv,patientData.radiographies.others)) : null,
    laterakCephalometricRadiography: patientData.radiographies.laterakCephalometricRadiography ? JSON.stringify(encryptData(key,iv,patientData.radiographies.laterakCephalometricRadiography)) : null,
    otherRadiography: patientData.radiographies.otherRadiography ? JSON.stringify(encryptData(key,iv,patientData.radiographies.otherRadiography )) : null
  }
  let diagnosisAndTreatmentEncrypted = {
    diagnose: patientData.diagnosisAndTreatments.diagnose ? JSON.stringify(encryptData(key,iv,patientData.diagnosisAndTreatments.diagnose)) : null,
    prognosisAndNotes: patientData.diagnosisAndTreatments.prognosisAndNotes ? JSON.stringify(encryptData(key,iv,patientData.diagnosisAndTreatments.prognosisAndNotes)) : null
  }
  let listOfIssueEncrypted = [];
  patientListData.listOfIssue.length > 0 && patientListData.listOfIssue.forEach(element => {
    listOfIssueEncrypted.push({
      id: element.id,
      issue: element.issue ? JSON.stringify(encryptData(key,iv,element.issue)) : null,
      // priotized: element.priotized ? JSON.stringify(encryptData(key,iv,element.priotized.toString())) : null,
      treatmentMethod: element.treatmentMethod ? JSON.stringify(encryptData(key,iv,element.treatmentMethod)) : null,
      treatmentObject: element.treatmentObject ? JSON.stringify(encryptData(key,iv,element.treatmentObject)) : null
    })
  });
  let treatmentHistoryEncrypted = [];
  patientListData.treatmentHistory.length > 0 && patientListData.treatmentHistory.forEach(element => {
    treatmentHistoryEncrypted.push({
      id: element.id,
      currentStatus: element.currentStatus ? JSON.stringify(encryptData(key,iv,element.currentStatus)) : null,
      performedProcedures: element.performedProcedures ? JSON.stringify(encryptData(key,iv,element.performedProcedures)) : null
    })
  });
  let treatmentPlanEncrypted = [];
  patientListData.treatmentPlan.length > 0 && patientListData.treatmentPlan.forEach(element => {
    treatmentPlanEncrypted.push({
      id: element.id,
      plan: element.plan ? JSON.stringify(encryptData(key,iv,element.plan)) : null,
      // selected: element.selected ? JSON.stringify(encryptData(key,iv,element.selected.toString())) : null
    })
  });
  return ({
    informationEncrypted,
    historyEncrypted,
    extraOralEncrypted,
    intralOralEncrypted,
    radiographyEncrypted,
    diagnosisAndTreatmentEncrypted,
    listOfIssueEncrypted,
    treatmentHistoryEncrypted,
    treatmentPlanEncrypted
  });
}


export const decryptPatientData = (key,iv,data) => {
  const patientData = data.infoOfPatient;
  const patientListData = data.otherInformation;
  let informationDecrypted = {
    gender : patientData.gender ? deCryptData(key,iv,JSON.parse(patientData.gender).tag,JSON.parse(patientData.gender).encrypted) : null,
    phoneNumber: patientData.phoneNumber ? parseInt(deCryptData(key,iv,JSON.parse(patientData.phoneNumber).tag,JSON.parse(patientData.phoneNumber).encrypted)) : null,
    address: patientData.address ? deCryptData(key,iv,JSON.parse(patientData.address).tag,JSON.parse(patientData.address).encrypted) : null,
    chiefcomplaint: patientData.chiefComplaint ? deCryptData(key,iv,JSON.parse(patientData.chiefcomplaint).tag,JSON.parse(patientData.chiefcomplaint).encrypted) : null,
    note: patientData.note ? deCryptData(key,iv,JSON.parse(patientData.note).tag,JSON.parse(patientData.note).encrypted) : null
  }
  let historyDecrypted = {
    dentalHistory: patientData.histories.dentalHistory ? deCryptData(key,iv,JSON.parse(patientData.histories.dentalHistory).tag,JSON.parse(patientData.histories.dentalHistory).encrypted) : null,
    medicalHistory: patientData.histories.medicalHistory ? deCryptData(key,iv,JSON.parse(patientData.histories.medicalHistory).tag,JSON.parse(patientData.histories.medicalHistory).encrypted) : null,
    cvmi: patientData.histories.cvmi ? deCryptData(key,iv,JSON.parse(patientData.histories.cvmi).tag,JSON.parse(patientData.histories.cvmi).encrypted) : null,
    otherMethodToEvaluate: patientData.histories.otherMethodToEvaluate ? deCryptData(key,iv,JSON.parse(patientData.histories.otherMethodToEvaluate).tag,JSON.parse(patientData.histories.otherMethodToEvaluate).encrypted) : null,
    respiration: patientData.histories.respiration ? deCryptData(key,iv,JSON.parse(patientData.histories.respiration).tag,JSON.parse(patientData.histories.respiration).encrypted) : null,
    habits: patientData.histories.habits ? deCryptData(key,iv,JSON.parse(patientData.histories.habits).tag,JSON.parse(patientData.histories.habits).encrypted) : null,
    familyHistory: patientData.histories.familyHistory ? deCryptData(key,iv,JSON.parse(patientData.histories.familyHistory).tag,JSON.parse(patientData.histories.familyHistory).encrypted) : null,
    compliance: patientData.histories.compliance ? deCryptData(key,iv,JSON.parse(patientData.histories.compliance).tag,JSON.parse(patientData.histories.compliance).encrypted) : null
  }
  let extraOralDecrypted = {
    faceAsymetry: patientData.extraOrals.faceAsymetry ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.faceAsymetry).tag,JSON.parse(patientData.extraOrals.faceAsymetry).encrypted) : null,
    chin: patientData.extraOrals.chin ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.chin).tag,JSON.parse(patientData.extraOrals.chin).encrypted) : null,
    lipCompetence: patientData.extraOrals.lipCompetence ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.lipCompetence).tag,JSON.parse(patientData.extraOrals.lipCompetence).encrypted) : null,
    lipPostureApart: patientData.extraOrals.lipPostureApart ? parseInt(deCryptData(key,iv,JSON.parse(patientData.extraOrals.lipPostureApart).tag,JSON.parse(patientData.extraOrals.lipPostureApart).encrypted)) : null,
    normalNaresExposure: patientData.extraOrals.normalNaresExposure ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.normalNaresExposure).tag,JSON.parse(patientData.extraOrals.normalNaresExposure).encrypted) : null,
    alarBaseWidth: patientData.extraOrals.alarBaseWidth ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.alarBaseWidth).tag,JSON.parse(patientData.extraOrals.alarBaseWidth).encrypted) : null,
    lipWidth: patientData.extraOrals.lipWidth ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.lipWidth).tag,JSON.parse(patientData.extraOrals.lipWidth).encrypted) : null,
    verticalDimensions: patientData.extraOrals.verticalDimensions ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.verticalDimensions).tag,JSON.parse(patientData.extraOrals.verticalDimensions).encrypted) : null,
    overallProfile: patientData.extraOrals.overallProfile ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.overallProfile).tag,JSON.parse(patientData.extraOrals.overallProfile).encrypted) : null,
    lowerThirdProfile: patientData.extraOrals.lowerThirdProfile ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.lowerThirdProfile).tag,JSON.parse(patientData.extraOrals.lowerThirdProfile).encrypted) : null,
    nasolabialAngle: patientData.extraOrals.nasolabialAngle ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.nasolabialAngle).tag,JSON.parse(patientData.extraOrals.nasolabialAngle).encrypted) : null,
    softTissuePogonion: patientData.extraOrals.softTissuePogonion ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.softTissuePogonion).tag,JSON.parse(patientData.extraOrals.softTissuePogonion).encrypted) : null,
    mandibularPlaneAngle: patientData.extraOrals.mandibularPlaneAngle ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.mandibularPlaneAngle).tag,JSON.parse(patientData.extraOrals.mandibularPlaneAngle).encrypted) : null,
    obliqueAnalysis: patientData.extraOrals.obliqueAnalysis ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.obliqueAnalysis).tag,JSON.parse(patientData.extraOrals.obliqueAnalysis).encrypted) : null,
    teethDisplay: patientData.extraOrals.teethDisplay ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.teethDisplay).tag,JSON.parse(patientData.extraOrals.teethDisplay).encrypted) : null,
    gingivalDisplayLevel: patientData.extraOrals.gingivalDisplayLevel ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.gingivalDisplayLevel).tag,JSON.parse(patientData.extraOrals.gingivalDisplayLevel).encrypted) : null,
    incisalDisplayMaxillary: patientData.extraOrals.incisalDisplayMaxillary ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.incisalDisplayMaxillary).tag,JSON.parse(patientData.extraOrals.incisalDisplayMaxillary).encrypted) : null,
    incisalDisplayMandibular: patientData.extraOrals.incisalDisplayMandibular ? deCryptData(key,iv,JSON.parse(patientData.extraOrals.incisalDisplayMandibular).tag,JSON.parse(patientData.extraOrals.incisalDisplayMandibular).encrypted) : null,
    smileArc: patientData.extraOrals.smileArc ? deCryptData(key,iv, JSON.parse(patientData.extraOrals.smileArc).tag,JSON.parse(patientData.extraOrals.smileArc).encrypted) : null,
    restPositionIncisalDisplay: patientData.extraOrals.restPositionIncisalDisplay ? deCryptData(key,iv, JSON.parse(patientData.extraOrals.restPositionIncisalDisplay).tag,JSON.parse(patientData.extraOrals.restPositionIncisalDisplay).encrypted) : null
  }
  let intralOralDecrypted = {
    oralHygiene: patientData.intraOrals.oralHygiene ? deCryptData(key,iv, JSON.parse(patientData.intraOrals.oralHygiene).tag,JSON.parse(patientData.intraOrals.oralHygiene).encrypted) : null,
    dentition: patientData.intraOrals.dentition ? deCryptData(key,iv, JSON.parse(patientData.intraOrals.dentition).tag,JSON.parse(patientData.intraOrals.dentition).encrypted) : null,
    caries: patientData.intraOrals.caries ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.caries).tag,JSON.parse(patientData.intraOrals.caries).encrypted) : null,
    missing: patientData.intraOrals.missing ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.missing).tag,JSON.parse(patientData.intraOrals.missing).encrypted) : null,
    wearingTeeth: patientData.intraOrals.wearingTeeth ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.wearingTeeth).tag,JSON.parse(patientData.intraOrals.wearingTeeth).encrypted) : null,
    detalAldevelopment: patientData.intraOrals.detalAldevelopment ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.detalAldevelopment).tag,JSON.parse(patientData.intraOrals.detalAldevelopment).encrypted) : null,
    otherProblems: patientData.intraOrals.otherProblems ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.otherProblems).tag,JSON.parse(patientData.intraOrals.otherProblems).encrypted) : null,
    archForm: patientData.intraOrals.archForm ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.archForm).tag,JSON.parse(patientData.intraOrals.archForm).encrypted) : null,
    rightCanine: patientData.intraOrals.rightCanine ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.rightCanine).tag,JSON.parse(patientData.intraOrals.rightCanine).encrypted) : null,
    rightMolar: patientData.intraOrals.rightMolar ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.rightMolar).tag,JSON.parse(patientData.intraOrals.rightMolar).encrypted) : null,
    leftCanine: patientData.intraOrals.leftCanine ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.leftCanine).tag,JSON.parse(patientData.intraOrals.leftCanine).encrypted) : null,
    leftMolar: patientData.intraOrals.leftMolar ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.leftMolar).tag,JSON.parse(patientData.intraOrals.leftMolar).encrypted) : null,
    overjet: patientData.intraOrals.overjet ? parseInt(deCryptData(key,iv,JSON.parse(patientData.intraOrals.overjet).tag,JSON.parse(patientData.intraOrals.overjet).encrypted)) : null,
    overbite: patientData.intraOrals.overbite ? parseInt(deCryptData(key,iv,JSON.parse(patientData.intraOrals.overbite).tag,JSON.parse(patientData.intraOrals.overbite).encrypted)) : null,
    curveOfSpee: patientData.intraOrals.curveOfSpee ? parseInt(deCryptData(key,iv,JSON.parse(patientData.intraOrals.curveOfSpee).tag,JSON.parse(patientData.intraOrals.curveOfSpee).encrypted)) : null,
    cant: patientData.intraOrals.cant ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.cant).tag,JSON.parse(patientData.intraOrals.cant).encrypted) : null,
    posteriorRight: patientData.intraOrals.posteriorRight ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.posteriorRight).tag,JSON.parse(patientData.intraOrals.posteriorRight).encrypted) : null,
    posteriorLeft: patientData.intraOrals.posteriorLeft ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.posteriorLeft).tag,JSON.parse(patientData.intraOrals.posteriorLeft).encrypted) : null,
    upperMidline: patientData.intraOrals.upperMidline ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.upperMidline).tag,JSON.parse(patientData.intraOrals.upperMidline).encrypted) : null,
    lowerMidline: patientData.intraOrals.lowerMidline ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.lowerMidline).tag,JSON.parse(patientData.intraOrals.lowerMidline).encrypted) : null,
    deviate: patientData.intraOrals.deviate ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.deviate).tag,JSON.parse(patientData.intraOrals.deviate).encrypted) : null,
    crCoDiscrepancy: patientData.intraOrals.crCoDiscrepancy ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.crCoDiscrepancy).tag,JSON.parse(patientData.intraOrals.crCoDiscrepancy).encrypted) : null,
    maximumMouthOpening: patientData.intraOrals.maximumMouthOpening ? parseInt(deCryptData(key,iv,JSON.parse(patientData.intraOrals.maximumMouthOpening).tag,JSON.parse(patientData.intraOrals.maximumMouthOpening).encrypted)) : null,
    guidanceOnProtrusion: patientData.intraOrals.guidanceOnProtrusion ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.guidanceOnProtrusion).tag,JSON.parse(patientData.intraOrals.guidanceOnProtrusion).encrypted) : null,
    guidanceOnRight: patientData.intraOrals.guidanceOnRight ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.guidanceOnRight).tag,JSON.parse(patientData.intraOrals.guidanceOnRight).encrypted) : null,
    guidanceOnLeft: patientData.intraOrals.guidanceOnLeft ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.guidanceOnLeft).tag,JSON.parse(patientData.intraOrals.guidanceOnLeft).encrypted) : null,
    musculature: patientData.intraOrals.musculature ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.musculature).tag,JSON.parse(patientData.intraOrals.musculature).encrypted) : null,
    swallowingPattern: patientData.intraOrals.swallowingPattern ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.swallowingPattern).tag,JSON.parse(patientData.intraOrals.swallowingPattern).encrypted) : null,
    historyOfTMD: patientData.intraOrals.historyOfTMD ? deCryptData(key,iv,JSON.parse(patientData.intraOrals.historyOfTMD).tag,JSON.parse(patientData.intraOrals.historyOfTMD).encrypted) : null
  }
  let radiographyDecrypted = {
    sinuses: patientData.radiographies.sinuses ? deCryptData(key,iv,JSON.parse(patientData.radiographies.sinuses).tag,JSON.parse(patientData.radiographies.sinuses).encrypted) : null,
    condyles: patientData.radiographies.condyles ? deCryptData(key,iv,JSON.parse(patientData.radiographies.condyles).tag,JSON.parse(patientData.radiographies.condyles).encrypted) : null,
    apparentPathology: patientData.radiographies.apparentPathology ? deCryptData(key,iv,JSON.parse(patientData.radiographies.apparentPathology).tag,JSON.parse(patientData.radiographies.apparentPathology).encrypted) : null,
    alveolarBoneHeights: patientData.radiographies.alveolarBoneHeights ? deCryptData(key,iv,JSON.parse(patientData.radiographies.alveolarBoneHeights).tag,JSON.parse(patientData.radiographies.alveolarBoneHeights).encrypted) : null,
    crownRootRatio: patientData.radiographies.crownRootRatio ? deCryptData(key,iv,JSON.parse(patientData.radiographies.crownRootRatio).tag,JSON.parse(patientData.radiographies.crownRootRatio).encrypted) : null,
    others: patientData.radiographies.others ? deCryptData(key,iv,JSON.parse(patientData.radiographies.others).tag,JSON.parse(patientData.radiographies.others).encrypted) : null,
    laterakCephalometricRadiography: patientData.radiographies.laterakCephalometricRadiography ? deCryptData(key,iv,JSON.parse(patientData.radiographies.laterakCephalometricRadiography).tag,JSON.parse(patientData.radiographies.laterakCephalometricRadiography).encrypted) : null,
    otherRadiography: patientData.radiographies.otherRadiography ? deCryptData(key,iv,JSON.parse(patientData.radiographies.otherRadiography).tag,JSON.parse(patientData.radiographies.otherRadiography).encrypted) : null
  }
  let diagnosisAndTreatmentDecrypted = {
    diagnose: patientData.diagnosisAndTreatments.diagnose ? deCryptData(key,iv,JSON.parse(patientData.diagnosisAndTreatments.diagnose).tag,JSON.parse(patientData.diagnosisAndTreatments.diagnose).encrypted) : null,
    prognosisAndNotes: patientData.diagnosisAndTreatments.prognosisAndNotes ? deCryptData(key,iv,JSON.parse(patientData.diagnosisAndTreatments.prognosisAndNotes).tag,JSON.parse(patientData.diagnosisAndTreatments.prognosisAndNotes).encrypted) : null
  }
  let listOfIssueDecrypted = [];
  patientListData.listOfIssue.length > 0 && patientListData.listOfIssue.forEach(element => {
    listOfIssueDecrypted.push({
      id: element.id,
      issue: element.issue ? deCryptData(key,iv,JSON.parse(element.issue).tag,JSON.parse(element.issue).encrypted) : null,
      // priotized: element.priotized ? parseInt(deCryptData(key,iv,JSON.parse(element.priotized).tag,JSON.parse(element.priotized).encrypted)) : null,
      treatmentMethod: element.treatmentMethod ? deCryptData(key,iv,JSON.parse(element.treatmentMethod).tag,JSON.parse(element.treatmentMethod).encrypted) : null,
      treatmentObject: element.treatmentObject ? deCryptData(key,iv,JSON.parse(element.treatmentObject).tag,JSON.parse(element.treatmentObject).encrypted) : null
    })
  });
  let treatmentHistoryDecrypted = [];
  patientListData.treatmentHistory.length > 0 && patientListData.treatmentHistory.forEach(element => {
    treatmentHistoryDecrypted.push({
      id: element.id,
      currentStatus: element.currentStatus ? deCryptData(key,iv,JSON.parse(element.currentStatus).tag,JSON.parse(element.currentStatus).encrypted) : null,
      performedProcedures: element.performedProcedures ? deCryptData(key,iv,JSON.parse(element.performedProcedures).tag,JSON.parse(element.performedProcedures).encrypted) : null
    })
  });
  let treatmentPlanDecrypted = [];
  patientListData.treatmentPlan.length > 0 && patientListData.treatmentPlan.forEach(element => {
    treatmentPlanDecrypted.push({
      id: element.id,
      plan: element.plan ? deCryptData(key,iv,JSON.parse(element.plan).tag,JSON.parse(element.plan).encrypted) : null,
      // selected: element.selected ? parseInt(deCryptData(key,iv,JSON.parse(element.selected).tag,JSON.parse(element.selected).encrypted)) : null
    })
  });
  return ({
    informationDecrypted,
    historyDecrypted,
    extraOralDecrypted,
    intralOralDecrypted,
    radiographyDecrypted,
    diagnosisAndTreatmentDecrypted,
    listOfIssueDecrypted,
    treatmentHistoryDecrypted,
    treatmentPlanDecrypted
  });
}