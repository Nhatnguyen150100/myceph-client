import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deCryptData, encryptData } from "../../../common/Crypto.jsx";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import InputWithLabel from "../../../common/InputWithLabel.jsx";
import RadioWithLabel from "../../../common/RadioWithLabel.jsx";
import { FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE, splitAvatar } from "../../../common/Utility.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

const WIDTH_TITLE = "130px";

export default function ExtraOral(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);
  const encryptKeySharePatient = useSelector(state=>state.patient.encryptKeySharePatient);

  const [editMode,setEditMode] = useState();
  const [faceAsymetry,setFaceAsymetry] = useState();
  const [chin,setChin] = useState();
  const [lipCompetence,setLipCompetence] = useState();
  const [lipPostureApart,setLipPostureApart] = useState();
  const [normalNaresExposure,setNormalNaresExposure] = useState();
  const [alarBaseWidth,setAlarBaseWidth] = useState();
  const [lipWidth,setLipWidth] = useState();
  const [verticalDimensions,setVerticalDimensions] = useState();
  const [overallProfile,setOverallProfile] = useState();
  const [lowerThirdProfile,setLowerThirdProfile] = useState();
  const [nasolabialAngle,setNasolabialAngle] = useState();
  const [softTissuePogonion,setSoftTissuePogonion] = useState();
  const [mandibularPlaneAngle,setMandibularPlaneAngle] = useState();
  const [obliqueAnalysis,setObliqueAnalysis] = useState();
  const [teethDisplay,setTeethDisplay] = useState();
  const [gingivalDisplayLevel,setGingivalDisplayLevel] = useState();
  const [incisalDisplayMaxillary,setIncisalDisplayMaxillary] = useState();
  const [incisalDisplayMandibular,setIncisalDisplayMandibular] = useState();
  const [smileArc,setSmileArc] = useState();
  const [restPositionIncisalDisplay,setRestPositionIncisalDisplay] = useState();
  const [sideFaceImage,setSideFaceImage] = useState();
  const [frontalFaceImage,setFrontalFaceImage] = useState();
  const [obliqueFaceImage,setObliqueFaceImage] = useState();
  const [smileyFaceImage,setSmileyFaceImage] = useState();

  const [previousData,setPreviousData] = useState();

  const isEncrypted = patient.currentPatient.isEncrypted;
  const modeKey = useMemo(()=>{
    if(selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT) return encryptKeyDoctor;
    else if(selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) return encryptKeyClinic;
    else return encryptKeySharePatient;
  },[selectPatientOnMode])

  useEffect(()=>{
    if(patient.currentPatient) getExtraOral();
  },[patient.currentPatient.id])

  const onCancel = () => {
    setEditMode(false);
    updateState(previousData);
  }

  const updateState = (data) => {
    setFaceAsymetry((isEncrypted && data.faceAsymetry)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.faceAsymetry).tag,JSON.parse(data.faceAsymetry).encrypted):data.faceAsymetry);
    setChin((isEncrypted && data.chin)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.chin).tag,JSON.parse(data.chin).encrypted):data.chin);
    setLipCompetence((isEncrypted && data.lipCompetence)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.lipCompetence).tag,JSON.parse(data.lipCompetence).encrypted):data.lipCompetence);
    setLipPostureApart((isEncrypted && data.lipPostureApart)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.lipPostureApart).tag,JSON.parse(data.lipPostureApart).encrypted):data.lipPostureApart);
    setNormalNaresExposure((isEncrypted && data.normalNaresExposure)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.normalNaresExposure).tag,JSON.parse(data.normalNaresExposure).encrypted):data.normalNaresExposure);
    setAlarBaseWidth((isEncrypted && data.alarBaseWidth)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.alarBaseWidth).tag,JSON.parse(data.alarBaseWidth).encrypted):data.alarBaseWidth);
    setLipWidth((isEncrypted && data.lipWidth)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.lipWidth).tag,JSON.parse(data.lipWidth).encrypted):data.lipWidth);
    setVerticalDimensions((isEncrypted && data.verticalDimensions)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.verticalDimensions).tag,JSON.parse(data.verticalDimensions).encrypted):data.verticalDimensions);
    setOverallProfile((isEncrypted && data.overallProfile)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.overallProfile).tag,JSON.parse(data.overallProfile).encrypted):data.overallProfile);
    setLowerThirdProfile((isEncrypted && data.lowerThirdProfile)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.lowerThirdProfile).tag,JSON.parse(data.lowerThirdProfile).encrypted):data.lowerThirdProfile);
    setNasolabialAngle((isEncrypted && data.nasolabialAngle)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.nasolabialAngle).tag,JSON.parse(data.nasolabialAngle).encrypted):data.nasolabialAngle);
    setSoftTissuePogonion((isEncrypted && data.softTissuePogonion)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.softTissuePogonion).tag,JSON.parse(data.softTissuePogonion).encrypted):data.softTissuePogonion);
    setMandibularPlaneAngle((isEncrypted && data.mandibularPlaneAngle)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.mandibularPlaneAngle).tag,JSON.parse(data.mandibularPlaneAngle).encrypted):data.mandibularPlaneAngle);
    setObliqueAnalysis((isEncrypted && data.obliqueAnalysis)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.obliqueAnalysis).tag,JSON.parse(data.obliqueAnalysis).encrypted):data.obliqueAnalysis);
    setTeethDisplay((isEncrypted && data.teethDisplay)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.teethDisplay).tag,JSON.parse(data.teethDisplay).encrypted):data.teethDisplay);
    setGingivalDisplayLevel((isEncrypted && data.gingivalDisplayLevel)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.gingivalDisplayLevel).tag,JSON.parse(data.gingivalDisplayLevel).encrypted):data.gingivalDisplayLevel);
    setIncisalDisplayMaxillary((isEncrypted && data.incisalDisplayMaxillary)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.incisalDisplayMaxillary).tag,JSON.parse(data.incisalDisplayMaxillary).encrypted):data.incisalDisplayMaxillary);
    setIncisalDisplayMandibular((isEncrypted && data.incisalDisplayMandibular)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.incisalDisplayMandibular).tag,JSON.parse(data.incisalDisplayMandibular).encrypted):data.incisalDisplayMandibular);
    setSmileArc((isEncrypted && data.smileArc)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.smileArc).tag,JSON.parse(data.smileArc).encrypted):data.smileArc);
    setRestPositionIncisalDisplay((isEncrypted && data.restPositionIncisalDisplay)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.restPositionIncisalDisplay).tag,JSON.parse(data.restPositionIncisalDisplay).encrypted):data.restPositionIncisalDisplay);
    setSideFaceImage(data.listImage.sideFace);
    setFrontalFaceImage(data.listImage.frontalFace);
    setObliqueFaceImage(data.listImage.obliqueFace);
    setSmileyFaceImage(data.listImage.smileyFace);
  }

  const getExtraOral = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/extraoral/${patient.currentPatient.id}`).then(result => {
        setPreviousData(result.data);
        updateState(result.data);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getExtraOral());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const onUpdateExtraOral = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      let infoUpdate = {};
      if(isEncrypted){
        infoUpdate = {
          idDoctor: doctor.data.id,
          faceAsymetry: faceAsymetry ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,faceAsymetry)) : null,
          chin: chin ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,chin)) : null,
          lipCompetence: lipCompetence ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,lipCompetence)) : null,
          lipPostureApart: lipPostureApart ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,lipPostureApart)) : null,
          normalNaresExposure: normalNaresExposure ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,normalNaresExposure)) : null,
          alarBaseWidth: alarBaseWidth ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,alarBaseWidth)) : null,
          lipWidth: lipWidth ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,lipWidth)) : null,
          verticalDimensions: verticalDimensions ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,verticalDimensions)) : null,
          overallProfile: overallProfile ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,overallProfile)) : null,
          lowerThirdProfile: lowerThirdProfile ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,lowerThirdProfile)) : null,
          nasolabialAngle: nasolabialAngle ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,nasolabialAngle)) : null,
          softTissuePogonion: softTissuePogonion ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,softTissuePogonion)) : null,
          mandibularPlaneAngle: mandibularPlaneAngle ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,mandibularPlaneAngle)) : null,
          obliqueAnalysis: obliqueAnalysis ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,obliqueAnalysis)) : null,
          teethDisplay: teethDisplay ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,teethDisplay)) : null,
          gingivalDisplayLevel: gingivalDisplayLevel ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,gingivalDisplayLevel)) : null,
          incisalDisplayMaxillary: incisalDisplayMaxillary ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,incisalDisplayMaxillary)) : null,
          incisalDisplayMandibular: incisalDisplayMandibular ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,incisalDisplayMandibular)) : null,
          smileArc: smileArc ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,smileArc)) : null,
          restPositionIncisalDisplay: restPositionIncisalDisplay ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,restPositionIncisalDisplay)) : null
        }
      }else infoUpdate = {
        idDoctor: doctor.data.id,
        faceAsymetry: faceAsymetry,
        chin: chin,
        lipCompetence: lipCompetence,
        lipPostureApart: lipPostureApart,
        normalNaresExposure: normalNaresExposure,
        alarBaseWidth: alarBaseWidth,
        lipWidth: lipWidth,
        verticalDimensions: verticalDimensions,
        overallProfile: overallProfile,
        lowerThirdProfile: lowerThirdProfile,
        nasolabialAngle: nasolabialAngle,
        softTissuePogonion: softTissuePogonion,
        mandibularPlaneAngle: mandibularPlaneAngle,
        obliqueAnalysis: obliqueAnalysis,
        teethDisplay: teethDisplay,
        gingivalDisplayLevel: gingivalDisplayLevel,
        incisalDisplayMaxillary: incisalDisplayMaxillary,
        incisalDisplayMandibular: incisalDisplayMandibular,
        smileArc: smileArc,
        restPositionIncisalDisplay: restPositionIncisalDisplay
      }
      putToServerWithToken(`/v1/extraoral/updateExtraoral/${patient.currentPatient.id}`,infoUpdate).then(result => {
        updateState(result.data);
        setPreviousData(result.data);
        toast.success(result.message);
        setEditMode(false);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onUpdateExtraOral());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  return <div className="h-100 w-100 d-flex flex-column justify-content-start mt-1">
    <div className="d-flex justify-content-end align-items-center mt-1 mb-2">
      {
        editMode ?
        <div>
          <IconButtonComponent className="btn-outline-success me-2" icon="done" onClick={onUpdateExtraOral}  FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("save")}/>
          <IconButtonComponent className="btn-outline-danger" onClick={onCancel} icon="close" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("cancel")}/>
        </div>
        :
        <div>
          {
            ((selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT && clinic.roleOfDoctor === 'admin') || selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT || patient.currentPatient['SharePatients.roleOfOwnerDoctor']==='edit') &&
            <IconButtonComponent className="btn-outline-warning" onClick={e=>setEditMode(true)} icon="edit" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("edit")}/>
          }
        </div>
      }
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('frontal analysis')}
      </span>
    </div>
    <div className="row w-100">
      <div className="col-sm-9">
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Face Asymetry')}
            value={faceAsymetry}
            onChange={value=>setFaceAsymetry(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={faceAsymetry?faceAsymetry:t('no data')}
            arrayRadios={['Symmetric','Left Deviation','Right Deviation']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Chin')}
            value={chin}
            onChange={value=>setChin(value)} 
            style={{fontSize:FONT_SIZE,width:"60px"}}
            result={chin?chin:t('no data')}
            arrayRadios={['Symmetric','Left Deviation','Right Deviation']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Lip Competence')}
            onUpdate={onUpdateExtraOral}
            placeholder={t('Enter Lip Competence')}
            classNameResult="flex-grow-1"
            type="text"
            value={lipCompetence}
            onChange={value=>setLipCompetence(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={lipCompetence?lipCompetence:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Lip Posture Apart')}
            onUpdate={onUpdateExtraOral}
            placeholder={t('Enter Lip Posture Apart')}
            classNameResult="w-auto"
            type="number"
            unit="mm"
            value={lipPostureApart}
            onChange={value=>setLipPostureApart(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={lipPostureApart?lipPostureApart:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Normal Nares Exposure')}
            classNameResult="flex-grow-1"
            value={normalNaresExposure}
            onChange={value=>setNormalNaresExposure(value)} 
            style={{fontSize:FONT_SIZE,width:"180px"}}
            result={normalNaresExposure?normalNaresExposure:t('no data')}
            arrayRadios={['Low','Average','High']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Alar Base Width Relative To Intercanthal Width')}
            value={alarBaseWidth}
            onChange={value=>setAlarBaseWidth(value)} 
            style={{fontSize:FONT_SIZE,width:"250px"}}
            result={alarBaseWidth?alarBaseWidth:t('no data')}
            arrayRadios={['Narrower','Equal','Wider']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Lip Width Relative To Interpupillary Width')}
            value={lipWidth}
            onChange={value=>setLipWidth(value)} 
            style={{fontSize:FONT_SIZE,width:"300px"}}
            result={lipWidth?lipWidth:t('no data')}
            arrayRadios={['Narrower','Equal','Wider']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Vertical Dimensions')}
            value={verticalDimensions}
            onChange={value=>setVerticalDimensions(value)} 
            style={{fontSize:FONT_SIZE,width:"150px"}}
            result={verticalDimensions?verticalDimensions:t('no data')}
            arrayRadios={['Harmony','Disharmony']}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex align-items-center justify-content-center">
        <img 
          alt="avatar" 
          className={`rounded my-1 ${frontalFaceImage?'p-0':'p-2'} hoverGreenLight`} 
          src={`${frontalFaceImage?splitAvatar(frontalFaceImage):'/assets/images/frontFace.png'}`} 
          style={{borderStyle:`${frontalFaceImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"contain"}}
        />
      </div>
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('profile menu')}
      </span>
    </div>
    <div className="row w-100">
      <div className="col-sm-9">
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Overall Profile')}
            value={overallProfile}
            onChange={value=>setOverallProfile(value)} 
            style={{fontSize:FONT_SIZE,width:"150px"}}
            result={overallProfile?overallProfile:t('no data')}
            arrayRadios={['Straight','Convex','Concave']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Lower Third Profile')}
            value={lowerThirdProfile}
            onChange={value=>setLowerThirdProfile(value)} 
            style={{fontSize:FONT_SIZE,width:"150px"}}
            result={lowerThirdProfile?lowerThirdProfile:t('no data')}
            arrayRadios={['Straight','Convex','Concave']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Nasolabial Angle')}
            value={nasolabialAngle}
            onChange={value=>setNasolabialAngle(value)} 
            style={{fontSize:FONT_SIZE,width:"150px"}}
            result={nasolabialAngle?nasolabialAngle:t('no data')}
            arrayRadios={['Acute','Right','Obtuse']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Soft Tissue Pogonion')}
            value={softTissuePogonion}
            onChange={value=>setSoftTissuePogonion(value)} 
            style={{fontSize:FONT_SIZE,width:"150px"}}
            result={softTissuePogonion?softTissuePogonion:t('no data')}
            arrayRadios={['Normal','Pronounced','Unpronounced']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Mandibular Plane Angle')}
            value={mandibularPlaneAngle}
            onChange={value=>setMandibularPlaneAngle(value)} 
            style={{fontSize:FONT_SIZE,width:"180px"}}
            result={mandibularPlaneAngle?mandibularPlaneAngle:t('no data')}
            arrayRadios={['Normal','Pronounced','Unpronounced']}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex align-items-center justify-content-center">
        <img 
          alt="avatar" 
          className={`rounded my-1 ${sideFaceImage?'p-0':'p-2'} hoverGreenLight`} 
          src={`${sideFaceImage?splitAvatar(sideFaceImage):'/assets/images/5.png'}`} 
          style={{borderStyle:`${sideFaceImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"contain"}}
        />
      </div>
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('oblique analysis')}
      </span>
    </div>
    <div className="row w-100">
      <div className="col-sm-9 d-flex align-items-center">
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Oblique Analysis')}
            onUpdate={onUpdateExtraOral}
            placeholder={t('Enter Oblique Analysis')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={obliqueAnalysis}
            onChange={value=>setObliqueAnalysis(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={obliqueAnalysis?obliqueAnalysis:t('no data')}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex align-items-center justify-content-center my-4">
        <img 
          alt="avatar" 
          className={`rounded my-1 ${obliqueFaceImage?'p-0':'p-2'} hoverGreenLight`} 
          src={`${obliqueFaceImage?splitAvatar(obliqueFaceImage):'/assets/images/7.png'}`} 
          style={{borderStyle:`${obliqueFaceImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"contain"}}
        />
      </div>
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('smile analysis')}
      </span>
    </div>
    <div className="row w-100 mt-1">
      <div className="col-sm-9">
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Teeth Display/Buccal Corridor To Upper 6-6')}
            value={teethDisplay}
            onChange={value=>setTeethDisplay(value)} 
            style={{fontSize:FONT_SIZE,width:"310px"}}
            result={teethDisplay?teethDisplay:t('no data')}
            arrayRadios={['Yes','No']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Gingival Display Level')}
            value={gingivalDisplayLevel}
            onChange={value=>setGingivalDisplayLevel(value)} 
            style={{fontSize:FONT_SIZE,width:"170px"}}
            result={gingivalDisplayLevel?gingivalDisplayLevel:t('no data')}
            arrayRadios={['Nil','Level I','Level II','Level III']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Incisal Display')+' '+t('maxillary incisor')}
            onUpdate={onUpdateExtraOral}
            placeholder={t('Enter Incisal Display')}
            classNameResult="w-auto"
            type="number"
            unit={'%'+t('maxillary incisor')}
            value={incisalDisplayMaxillary}
            onChange={value=>setIncisalDisplayMaxillary(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={incisalDisplayMaxillary?incisalDisplayMaxillary:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Incisal Display')+' '+t('mandibular incisor')}
            onUpdate={onUpdateExtraOral}
            placeholder={t('Enter Incisal Display')}
            classNameResult="w-auto"
            type="number"
            unit={'%'+t('mandibular incisor')}
            value={incisalDisplayMandibular}
            onChange={value=>setIncisalDisplayMandibular(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={incisalDisplayMandibular?incisalDisplayMandibular:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Smile Arc')}
            value={smileArc}
            onChange={value=>setSmileArc(value)} 
            style={{fontSize:FONT_SIZE,width:"100px"}}
            result={smileArc?smileArc:t('no data')}
            arrayRadios={['+','+/-','-']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Rest Position Incisal Display')}
            value={restPositionIncisalDisplay}
            onChange={value=>setRestPositionIncisalDisplay(value)} 
            style={{fontSize:FONT_SIZE,width:"200px"}}
            result={restPositionIncisalDisplay?restPositionIncisalDisplay:t('no data')}
            arrayRadios={['Yes','No']}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex align-items-center justify-content-center">
        <img 
          alt="avatar" 
          className={`rounded my-1 ${smileyFaceImage?'p-0':'p-2'} hoverGreenLight`} 
          src={`${smileyFaceImage?splitAvatar(smileyFaceImage):'/assets/images/8.png'}`} 
          style={{borderStyle:`${smileyFaceImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"contain"}}
        />
      </div>
    </div>
  </div>
}