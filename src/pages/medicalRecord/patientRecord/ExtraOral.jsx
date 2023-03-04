import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import InputWithLabel from "../../../common/InputWithLabel.jsx";
import RadioWithLabel from "../../../common/RadioWithLabel.jsx";
import { AVATAR_HEIGHT, AVATAR_WIDTH, FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE } from "../../../common/Utility.jsx";
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

  const [previousData,setPreviousData] = useState();

  useEffect(()=>{
    if(patient.currentPatient) getExtraOral();
  },patient.currentPatient.id)

  const onCancel = () => {
    setEditMode(false);
    updateState(previousData);
  }

  const updateState = (data) => {
    setFaceAsymetry(data.faceAsymetry);
    setChin(data.chin);
    setLipCompetence(data.lipCompetence);
    setLipPostureApart(data.lipPostureApart);
    setNormalNaresExposure(data.normalNaresExposure);
    setAlarBaseWidth(data.alarBaseWidth);
    setLipWidth(data.lipWidth);
    setVerticalDimensions(data.verticalDimensions);
    setOverallProfile(data.overallProfile);
    setLowerThirdProfile(data.lowerThirdProfile);
    setNasolabialAngle(data.nasolabialAngle);
    setSoftTissuePogonion(data.softTissuePogonion);
    setMandibularPlaneAngle(data.mandibularPlaneAngle);
    setObliqueAnalysis(data.obliqueAnalysis);
    setTeethDisplay(data.teethDisplay);
    setGingivalDisplayLevel(data.gingivalDisplayLevel);
    setIncisalDisplayMaxillary(data.incisalDisplayMaxillary);
    setIncisalDisplayMandibular(data.incisalDisplayMandibular);
    setSmileArc(data.smileArc);
    setRestPositionIncisalDisplay(data.restPositionIncisalDisplay);
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
      putToServerWithToken(`/v1/extraoral/updateExtraoral/${patient.currentPatient.id}`,{
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
      }).then(result => {
        updateState(result.data);
        setPreviousData(result.data);
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
            arrayRadios={['Symmetric','Left deviation','Right deviation']}
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
            arrayRadios={['Symmetric','Left deviation','Right deviation']}
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
            label={t('Alar Base Width')}
            value={alarBaseWidth}
            onChange={value=>setAlarBaseWidth(value)} 
            style={{fontSize:FONT_SIZE,width:"130px"}}
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
        <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/frontFace.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"cover"}}/>
      </div>
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('profile meunu')}
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
        <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/11.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"cover"}}/>
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
        <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/13.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"cover"}}/>
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
            label={t('Incisal Display')}
            onUpdate={onUpdateExtraOral}
            placeholder={t('Enter Incisal Display')}
            classNameResult="w-auto"
            type="number"
            unit={t('% maxillary incisor')}
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
            label={t('Incisal Display')}
            onUpdate={onUpdateExtraOral}
            placeholder={t('Enter Incisal Display')}
            classNameResult="w-auto"
            type="number"
            unit={t('% mandibular incisor')}
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
        <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/14.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"cover"}}/>
      </div>
    </div>
  </div>
}