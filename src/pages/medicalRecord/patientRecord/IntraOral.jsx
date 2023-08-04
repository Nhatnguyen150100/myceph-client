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
import { setCurrentImage } from "../../../redux/LibraryImageSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

const WIDTH_TITLE = "130px";

export default function IntraOral(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);
  const encryptKeySharePatient = useSelector(state=>state.patient.encryptKeySharePatient);

  const [editMode,setEditMode] = useState();
  const [oralHygiene,setOralHygiene] = useState();
  const [dentition,setDentition] = useState();
  const [caries,setCaries] = useState();
  const [missing,setMissing] = useState();
  const [wearingTeeth,setWearingTeeth] = useState();
  const [detalAldevelopment,setDetalAldevelopment] = useState();
  const [otherProblems,setOtherProblems] = useState();
  const [archForm,setArchForm] = useState();
  const [rightCanine,setRightCanine] = useState();
  const [rightMolar,setRightMolar] = useState();
  const [leftCanine,setLeftCanine] = useState();
  const [leftMolar,setLeftMolar] = useState();
  const [overjet,setOverjet] = useState();
  const [overbite,setOverbite] = useState();
  const [curveOfSpee,setCurveOfSpee] = useState();
  const [cant,setCant] = useState();
  const [posteriorRight,setPosteriorRight] = useState();
  const [posteriorLeft,setPosteriorLeft] = useState();
  const [upperMidline,setUpperMidline] = useState();
  const [lowerMidline,setLowerMidline] = useState();
  const [deviate,setDeviate] = useState();
  const [crCoDiscrepancy,setCrCoDiscrepancy] = useState();
  const [maximumMouthOpening,setMaximumMouthOpening] = useState();
  const [guidanceOnProtrusion,setGuidanceOnProtrusion] = useState();
  const [guidanceOnRight,setGuidanceOnRight] = useState();
  const [guidanceOnLeft,setGuidanceOnLeft] = useState();
  const [musculature,setMusculature] = useState();
  const [swallowingPattern,setSwallowingPattern] = useState();
  const [historyOfTMD,setHistoryOfTMD] = useState();
  const [anteriorImage,setAnteriorImage] = useState();
  const [leftBuccalImage,setLeftBuccalImage] = useState();
  const [mandibularImage,setMandibularImage] = useState();
  const [maxillaryImage,setMaxillaryImage] = useState();
  const [rightBuccalImage,setRightBuccalImage] = useState();
  const [smileyFaceImage,setSmileyFaceImage] = useState();
  const [roleOfDoctor,setRoleOfDoctor] = useState('edit');

  const [previousData,setPreviousData] = useState();

  const isEncrypted = patient.currentPatient.isEncrypted;
  const modeKey = useMemo(()=>{
    if(selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT) return encryptKeyDoctor;
    else if(selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) return encryptKeyClinic;
    else return encryptKeySharePatient;
  },[selectPatientOnMode])

  useEffect(()=>{
    if(patient.currentPatient) getIntraOral();
  },[patient.currentPatient.id])

  const onCancel = () => {
    setEditMode(false);
    updateState(previousData);
  }

  const updateState = (data) => {
    setOralHygiene((isEncrypted && data.oralHygiene)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.oralHygiene).tag,JSON.parse(data.oralHygiene).encrypted):data.oralHygiene);
    setDentition((isEncrypted && data.dentition)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.dentition).tag,JSON.parse(data.dentition).encrypted):data.dentition);
    setCaries((isEncrypted && data.caries)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.caries).tag,JSON.parse(data.caries).encrypted):data.caries);
    setMissing((isEncrypted && data.missing)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.missing).tag,JSON.parse(data.missing).encrypted):data.missing);
    setWearingTeeth((isEncrypted && data.wearingTeeth)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.wearingTeeth).tag,JSON.parse(data.wearingTeeth).encrypted):data.wearingTeeth);
    setDetalAldevelopment((isEncrypted && data.detalAldevelopment)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.detalAldevelopment).tag,JSON.parse(data.detalAldevelopment).encrypted):data.detalAldevelopment);
    setOtherProblems((isEncrypted && data.otherProblems)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.otherProblems).tag,JSON.parse(data.otherProblems).encrypted):data.otherProblems);
    setArchForm((isEncrypted && data.archForm)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.archForm).tag,JSON.parse(data.archForm).encrypted):data.archForm);
    setRightCanine((isEncrypted && data.rightCanine)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.rightCanine).tag,JSON.parse(data.rightCanine).encrypted):data.rightCanine);
    setLeftCanine((isEncrypted && data.leftCanine)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.leftCanine).tag,JSON.parse(data.leftCanine).encrypted):data.leftCanine);
    setLeftMolar((isEncrypted && data.leftMolar)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.leftMolar).tag,JSON.parse(data.leftMolar).encrypted):data.leftMolar);
    setOverjet((isEncrypted && data.overjet)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.overjet).tag,JSON.parse(data.overjet).encrypted):data.overjet);
    setOverbite((isEncrypted && data.overbite)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.overbite).tag,JSON.parse(data.overbite).encrypted):data.overbite);
    setCurveOfSpee((isEncrypted && data.curveOfSpee)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.curveOfSpee).tag,JSON.parse(data.curveOfSpee).encrypted):data.curveOfSpee);
    setCant((isEncrypted && data.cant)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.cant).tag,JSON.parse(data.cant).encrypted):data.cant);
    setPosteriorRight((isEncrypted && data.posteriorRight)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.posteriorRight).tag,JSON.parse(data.posteriorRight).encrypted):data.posteriorRight);
    setPosteriorLeft((isEncrypted && data.posteriorLeft)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.posteriorLeft).tag,JSON.parse(data.posteriorLeft).encrypted):data.posteriorLeft);
    setUpperMidline((isEncrypted && data.upperMidline)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.upperMidline).tag,JSON.parse(data.upperMidline).encrypted):data.upperMidline);
    setLowerMidline((isEncrypted && data.lowerMidline)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.lowerMidline).tag,JSON.parse(data.lowerMidline).encrypted):data.lowerMidline);
    setDeviate((isEncrypted && data.deviate)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.deviate).tag,JSON.parse(data.deviate).encrypted):data.deviate);
    setCrCoDiscrepancy((isEncrypted && data.crCoDiscrepancy)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.crCoDiscrepancy).tag,JSON.parse(data.crCoDiscrepancy).encrypted):data.crCoDiscrepancy);
    setMaximumMouthOpening((isEncrypted && data.maximumMouthOpening)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.maximumMouthOpening).tag,JSON.parse(data.maximumMouthOpening).encrypted):data.maximumMouthOpening);
    setGuidanceOnProtrusion((isEncrypted && data.guidanceOnProtrusion)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.guidanceOnProtrusion).tag,JSON.parse(data.guidanceOnProtrusion).encrypted):data.guidanceOnProtrusion);
    setGuidanceOnRight((isEncrypted && data.guidanceOnRight)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.guidanceOnRight).tag,JSON.parse(data.guidanceOnRight).encrypted):data.guidanceOnRight);
    setGuidanceOnLeft((isEncrypted && data.guidanceOnLeft)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.guidanceOnLeft).tag,JSON.parse(data.guidanceOnLeft).encrypted):data.guidanceOnLeft);
    setMusculature((isEncrypted && data.musculature)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.musculature).tag,JSON.parse(data.musculature).encrypted):data.musculature);
    setSwallowingPattern((isEncrypted && data.swallowingPattern)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.swallowingPattern).tag,JSON.parse(data.swallowingPattern).encrypted):data.swallowingPattern);
    setHistoryOfTMD((isEncrypted && data.historyOfTMD)?deCryptData(modeKey.key,modeKey.iv,JSON.parse(data.historyOfTMD).tag,JSON.parse(data.historyOfTMD).encrypted):data.historyOfTMD);
    setAnteriorImage(data.listImage.anteriorImage);
    setLeftBuccalImage(data.listImage.leftBuccalImage);
    setMandibularImage(data.listImage.mandibularImage);
    setMaxillaryImage(data.listImage.maxillaryImage);
    setRightBuccalImage(data.listImage.rightBuccalImage);
    setSmileyFaceImage(data.listImage.smileyFace);
  }

  const getIntraOral = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/intraoral/${patient.currentPatient.id}?mode=${props.checkRoleMode}&idDoctor=${doctor.data?.id}`).then(result => {
        setPreviousData(result.data);
        updateState(result.data);
        result.roleOfDoctor && setRoleOfDoctor(result.roleOfDoctor)
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getIntraOral());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const onUpdateIntraOral = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      let infoUpdate = {};
      if(isEncrypted){
        infoUpdate = {
          idDoctor: doctor.data.id,
          oralHygiene: oralHygiene ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,oralHygiene)) : null,
          dentition: dentition ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,dentition)) : null,
          caries: caries ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,caries)) : null,
          missing: missing ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,missing)) : null,
          wearingTeeth: wearingTeeth ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,wearingTeeth)) : null,
          detalAldevelopment: detalAldevelopment ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,detalAldevelopment)) : null,
          otherProblems: otherProblems ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,otherProblems)) : null,
          archForm: archForm ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,archForm)) : null,
          rightCanine: rightCanine ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,rightCanine)) : null,
          rightMolar: rightMolar ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,rightMolar)) : null,
          leftCanine: leftCanine ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,leftCanine)) : null,
          leftMolar: leftMolar ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,leftMolar)) : null,
          overjet: overjet ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,overjet)) : null,
          overbite: overbite ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,overbite)) : null,
          curveOfSpee: curveOfSpee ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,curveOfSpee)) : null,
          cant: cant ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,cant)) : null,
          posteriorRight: posteriorRight ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,posteriorRight)) : null,
          posteriorLeft: posteriorLeft ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,posteriorLeft)) : null,
          upperMidline: upperMidline ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,upperMidline)) : null,
          lowerMidline: lowerMidline ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,lowerMidline)) : null,
          deviate: deviate ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,deviate)) : null,
          crCoDiscrepancy: crCoDiscrepancy ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,crCoDiscrepancy)) : null,
          maximumMouthOpening: maximumMouthOpening ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,maximumMouthOpening)) : null,
          guidanceOnProtrusion: guidanceOnProtrusion ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,guidanceOnProtrusion)) : null,
          guidanceOnRight: guidanceOnRight ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,guidanceOnRight)) : null,
          guidanceOnLeft: guidanceOnLeft ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,guidanceOnLeft)) : null,
          musculature: musculature ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,musculature)) : null,
          swallowingPattern: swallowingPattern ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,swallowingPattern)) : null,
          historyOfTMD: historyOfTMD ? JSON.stringify(encryptData(modeKey.key,modeKey.iv,historyOfTMD)) : null
        }
      }else infoUpdate = {
        idDoctor: doctor.data.id,
        oralHygiene: oralHygiene,
        dentition: dentition,
        caries: caries,
        missing: missing,
        wearingTeeth: wearingTeeth,
        detalAldevelopment: detalAldevelopment,
        otherProblems: otherProblems,
        archForm: archForm,
        rightCanine: rightCanine,
        rightMolar: rightMolar,
        leftCanine: leftCanine,
        leftMolar: leftMolar,
        overjet: overjet,
        overbite: overbite,
        curveOfSpee: curveOfSpee,
        cant: cant,
        posteriorRight: posteriorRight,
        posteriorLeft: posteriorLeft,
        upperMidline: upperMidline,
        lowerMidline: lowerMidline,
        deviate: deviate,
        crCoDiscrepancy: crCoDiscrepancy,
        maximumMouthOpening: maximumMouthOpening,
        guidanceOnProtrusion: guidanceOnProtrusion,
        guidanceOnRight: guidanceOnRight,
        guidanceOnLeft: guidanceOnLeft,
        musculature: musculature,
        swallowingPattern: swallowingPattern,
        historyOfTMD: historyOfTMD
      }
      putToServerWithToken(`/v1/intraoral/updateIntraoral/${patient.currentPatient.id}?mode=${props.checkRoleMode}&idDoctor=${doctor.data?.id}`,infoUpdate).then(result => {
        updateState(result.data);
        setPreviousData(result.data);
        setEditMode(false);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onUpdateIntraOral());
        }else{
          toast.error(t(err.message));
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const roleCheck = roleOfDoctor==='edit';

  return <div className="h-100 w-100 d-flex flex-column justify-content-start mt-1">
    <div className="d-flex justify-content-end align-items-center mt-1 mb-2">
      {
        editMode ?
        <div>
          <IconButtonComponent className="btn-outline-success me-2" icon="done" onClick={onUpdateIntraOral}  FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("save")}/>
          <IconButtonComponent className="btn-outline-danger" onClick={onCancel} icon="close" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("cancel")}/>
        </div>
        :
        <div>
          {
            roleCheck &&
            <IconButtonComponent className="btn-outline-warning" onClick={e=>setEditMode(true)} icon="edit" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("edit")}/>
          }
        </div>
      }
    </div>
    <div className="row w-100">
      <div className="col-sm-9">
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateIntraOral}
            label={t('Oral Hygiene')}
            value={oralHygiene}
            onChange={value=>setOralHygiene(value)} 
            style={{fontSize:FONT_SIZE,width:"120px"}}
            result={oralHygiene?oralHygiene:t('no data')}
            arrayRadios={['Good','Average','Poor']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateIntraOral}
            label={t('Dentition')}
            value={dentition}
            onChange={value=>setDentition(value)} 
            style={{fontSize:FONT_SIZE,width:"120px"}}
            result={dentition?dentition:t('no data')}
            arrayRadios={['Primary','Mixed','Permanent']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Caries/Decalcification/Restoration')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Caries/Decalcification/Restoration')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={caries}
            onChange={value=>setCaries(value)} 
            style={{fontSize:FONT_SIZE,width:"250px"}}
            result={caries?caries:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Missing/Unerupted Teeth')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Missing/Unerupted Teeth')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={missing}
            onChange={value=>setMissing(value)} 
            style={{fontSize:FONT_SIZE,width:"180px"}}
            result={missing?missing:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Wearing Teeth')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Wearing Teeth')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={wearingTeeth}
            onChange={value=>setWearingTeeth(value)} 
            style={{fontSize:FONT_SIZE,width:"120px"}}
            result={wearingTeeth?wearingTeeth:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Dental Aldevelopment')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Dental Aldevelopment')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={detalAldevelopment}
            onChange={value=>setDetalAldevelopment(value)} 
            style={{fontSize:FONT_SIZE,width:"180px"}}
            result={detalAldevelopment?detalAldevelopment:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Other Problems')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Other Problems')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={otherProblems}
            onChange={value=>setOtherProblems(value)} 
            style={{fontSize:FONT_SIZE,width:"120px"}}
            result={otherProblems?otherProblems:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Arch Form')}
            onUpdate={onUpdateIntraOral}
            classNameResult="w-auto flex-grow-1"
            value={archForm}
            onChange={value=>setArchForm(value)} 
            style={{fontSize:FONT_SIZE,width:"120px"}}
            result={archForm?archForm:t('no data')}
            arrayRadios={['Tapper','Square','Ovoid']}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex flex-column align-items-center justify-content-center">
        <img 
          alt="maxillaryImage" 
          className={`rounded mt-5 ${maxillaryImage?'p-0 transform-hover':'p-3'}`} 
          src={`${maxillaryImage?splitAvatar(maxillaryImage):'/assets/images/13.png'}`} 
          style={{borderStyle:`${maxillaryImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"contain",cursor:`${maxillaryImage?"pointer":"default"}`}}
          onClick={()=>{ 
            if(maxillaryImage) dispatch(setCurrentImage(splitAvatar(maxillaryImage)))
          }}
          title={maxillaryImage?t('Click to see'):''}
        />
        <img 
          alt="mandibularImage" 
          className={`rounded mt-5 ${mandibularImage?'p-0 transform-hover':'p-3'}`} 
          src={`${mandibularImage?splitAvatar(mandibularImage):'/assets/images/14.png'}`} 
          style={{borderStyle:`${mandibularImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"contain",cursor:`${mandibularImage?"pointer":"default"}`}}
          onClick={()=>{ 
            if(mandibularImage) dispatch(setCurrentImage(splitAvatar(mandibularImage)))
          }}
          title={mandibularImage?t('Click to see'):''}
        />
      </div>
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('occlusion - sagittal & occlusion - vertical')}
      </span>
    </div>
    <div className="row w-100">
      <div className="col-sm-9">
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateIntraOral}
            label={t('Right Canine Relationship')}
            value={rightCanine}
            onChange={value=>setRightCanine(value)} 
            style={{fontSize:FONT_SIZE,width:"200px"}}
            result={rightCanine?rightCanine:t('no data')}
            arrayRadios={['I','II','III']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateIntraOral}
            label={t('Left Canine Relationship')}
            value={leftCanine}
            onChange={value=>setLeftCanine(value)} 
            style={{fontSize:FONT_SIZE,width:"200px"}}
            result={leftCanine?leftCanine:t('no data')}
            arrayRadios={['I','II','III']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateIntraOral}
            label={t('Right Molar Relationship')}
            value={rightMolar}
            onChange={value=>setRightMolar(value)} 
            style={{fontSize:FONT_SIZE,width:"200px"}}
            result={rightMolar?rightMolar:t('no data')}
            arrayRadios={['I','II','III']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateIntraOral}
            label={t('Left Molar Relationship')}
            value={leftMolar}
            onChange={value=>setLeftMolar(value)} 
            style={{fontSize:FONT_SIZE,width:"200px"}}
            result={leftMolar?leftMolar:t('no data')}
            arrayRadios={['I','II','III']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Overjet')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Overjet')}
            classNameResult="w-auto"
            type="number"
            unit="mm"
            value={overjet}
            onChange={value=>setOverjet(value)} 
            style={{fontSize:FONT_SIZE,width:"80px"}}
            result={overjet?overjet:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Overbite')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Overbite')}
            classNameResult="w-auto"
            type="number"
            unit="mm"
            value={overbite}
            onChange={value=>setOverbite(value)} 
            style={{fontSize:FONT_SIZE,width:"80px"}}
            result={overbite?overbite:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Curve Of Spee')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Curve Of Spee')}
            classNameResult="w-auto"
            type="number"
            unit="mm"
            value={curveOfSpee}
            onChange={value=>setCurveOfSpee(value)} 
            style={{fontSize:FONT_SIZE,width:"120px"}}
            result={curveOfSpee?curveOfSpee:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Cant')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Cant')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={cant}
            onChange={value=>setCant(value)} 
            style={{fontSize:FONT_SIZE,width:"80px"}}
            result={cant?cant:t('no data')}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex flex-column align-items-center justify-content-center">
        <img 
          alt="leftBuccalImage" 
          className={`rounded mt-5 ${leftBuccalImage?'p-0 transform-hover':'p-3'}`} 
          src={`${leftBuccalImage?splitAvatar(leftBuccalImage):'/assets/images/11.png'}`} 
          style={{borderStyle:`${leftBuccalImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"contain",cursor:`${leftBuccalImage?"pointer":"default"}`}}
          onClick={()=>{ 
            if(leftBuccalImage) dispatch(setCurrentImage(splitAvatar(leftBuccalImage)))
          }}
          title={leftBuccalImage?t('Click to see'):''}
        />
        <img 
          alt="rightBuccalImage" 
          className={`rounded mt-5 ${rightBuccalImage?'p-0 transform-hover':'p-3'}`} 
          src={`${rightBuccalImage?splitAvatar(rightBuccalImage):'/assets/images/10.png'}`} 
          style={{borderStyle:`${rightBuccalImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"contain",cursor:`${rightBuccalImage?"pointer":"default"}`}}
          onClick={()=>{ 
            if(rightBuccalImage) dispatch(setCurrentImage(splitAvatar(rightBuccalImage)))
          }}
          title={rightBuccalImage?t('Click to see'):''}
        />
      </div>
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('occlusion - tranversal')}
      </span>
    </div>
    <div className="row w-100">
      <div className="col-sm-9 d-flex align-items-center flex-column">
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateIntraOral}
            label={t('Posterior Crossbite Right')}
            value={posteriorRight}
            onChange={value=>setPosteriorRight(value)} 
            style={{fontSize:FONT_SIZE,width:"200px"}}
            result={posteriorRight?posteriorRight:t('no data')}
            arrayRadios={['Yes','No']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateIntraOral}
            label={t('Posterior Crossbite Left')}
            value={posteriorLeft}
            onChange={value=>setPosteriorLeft(value)} 
            style={{fontSize:FONT_SIZE,width:"200px"}}
            result={posteriorLeft?posteriorLeft:t('no data')}
            arrayRadios={['Yes','No']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateIntraOral}
            label={t('Upper Midline')}
            value={upperMidline}
            onChange={value=>setUpperMidline(value)} 
            style={{fontSize:FONT_SIZE,width:"120px"}}
            result={upperMidline?upperMidline:t('no data')}
            arrayRadios={['Coincident','Left hand side','Right hand side']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            onUpdate={onUpdateIntraOral}
            label={t('Lower Midline')}
            value={lowerMidline}
            onChange={value=>setLowerMidline(value)} 
            style={{fontSize:FONT_SIZE,width:"120px"}}
            result={lowerMidline?lowerMidline:t('no data')}
            arrayRadios={['Coincident','Left hand side','Right hand side']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Deviate')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Deviate')}
            classNameResult="w-auto"
            type="number"
            unit="mm"
            value={deviate}
            onChange={value=>setDeviate(value)} 
            style={{fontSize:FONT_SIZE,width:"80px"}}
            result={deviate?deviate:t('no data')}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex align-items-center justify-content-center my-4">
        <img 
          alt="anteriorImage" 
          className={`rounded mt-5 ${anteriorImage?'p-0 transform-hover':'p-3'}`} 
          src={`${anteriorImage?splitAvatar(anteriorImage):'/assets/images/12.png'}`} 
          style={{borderStyle:`${anteriorImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"contain",cursor:`${anteriorImage?"pointer":"default"}`}}
          onClick={()=>{ 
            if(anteriorImage) dispatch(setCurrentImage(splitAvatar(anteriorImage)))
          }}
          title={anteriorImage?t('Click to see'):''}
        />
      </div>
    </div>
    <div className="d-flex justify-content-center align-items-center rounded border-bottom mc-background-light py-2 fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
      <span className="text-uppercase">
        {t('occlusion - functional')}
      </span>
    </div>
    <div className="row w-100 mt-1">
      <div className="col-sm-9">
        <div className="w-100 h-auto mt-1">
          <RadioWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('CR/CO Discrepancy')}
            value={crCoDiscrepancy}
            onChange={value=>setCrCoDiscrepancy(value)} 
            style={{fontSize:FONT_SIZE,width:"150px"}}
            result={crCoDiscrepancy?crCoDiscrepancy:t('no data')}
            arrayRadios={['Yes','No']}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Maximum Mouth Opening')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Maximum Mouth Opening')}
            classNameResult="w-auto"
            type="number"
            unit="cm"
            value={maximumMouthOpening}
            onChange={value=>setMaximumMouthOpening(value)} 
            style={{fontSize:FONT_SIZE,width:"200px"}}
            result={maximumMouthOpening?maximumMouthOpening:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Guidance On Protrusion')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Guidance On Protrusion')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={guidanceOnProtrusion}
            onChange={value=>setGuidanceOnProtrusion(value)} 
            style={{fontSize:FONT_SIZE,width:"200px"}}
            result={guidanceOnProtrusion?guidanceOnProtrusion:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Guidance On Right Lateral Protrusion')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Guidance On Right Lateral Protrusion')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={guidanceOnRight}
            onChange={value=>setGuidanceOnRight(value)} 
            style={{fontSize:FONT_SIZE,width:"280px"}}
            result={guidanceOnRight?guidanceOnRight:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Guidance On Left Lateral Protrusion')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Guidance On Left Lateral Protrusion')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={guidanceOnLeft}
            onChange={value=>setGuidanceOnLeft(value)} 
            style={{fontSize:FONT_SIZE,width:"280px"}}
            result={guidanceOnLeft?guidanceOnLeft:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Musculature')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Musculature')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={musculature}
            onChange={value=>setMusculature(value)} 
            style={{fontSize:FONT_SIZE,width:"120px"}}
            result={musculature?musculature:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('Swallowing Pattern')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter Swallowing Pattern')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={swallowingPattern}
            onChange={value=>setSwallowingPattern(value)} 
            style={{fontSize:FONT_SIZE,width:"150px"}}
            result={swallowingPattern?swallowingPattern:t('no data')}
          />
        </div>
        <div className="w-100 h-auto mt-1">
          <InputWithLabel 
            editMode={editMode}
            onCancel={onCancel}
            label={t('History Of TMD')}
            onUpdate={onUpdateIntraOral}
            placeholder={t('Enter History Of TMD')}
            classNameResult="w-auto flex-grow-1"
            type="text"
            value={historyOfTMD}
            onChange={value=>setHistoryOfTMD(value)} 
            style={{fontSize:FONT_SIZE,width:WIDTH_TITLE}}
            result={historyOfTMD?historyOfTMD:t('no data')}
          />
        </div>
      </div>
      <div className="col-sm-3 d-flex align-items-center justify-content-center">
        <img 
          alt="smileyFaceImage" 
          className={`rounded mt-5 ${smileyFaceImage?'p-0 transform-hover':'p-3'}`} 
          src={`${smileyFaceImage?splitAvatar(smileyFaceImage):'/assets/images/8.png'}`} 
          style={{borderStyle:`${smileyFaceImage?'none':'dashed'}`,borderWidth:"2px",borderColor:"#043d5d",height:"160px",width:"150px",objectFit:"contain",cursor:`${smileyFaceImage?"pointer":"default"}`}}
          onClick={()=>{ 
            if(smileyFaceImage) dispatch(setCurrentImage(splitAvatar(smileyFaceImage)))
          }}
          title={smileyFaceImage?t('Click to see'):''}
        />
      </div>
    </div>
  </div>
}