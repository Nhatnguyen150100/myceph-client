import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import InputWithLabel from "../../../common/InputWithLabel.jsx";
import RadioWithLabel from "../../../common/RadioWithLabel.jsx";
import { FONT_SIZE, FONT_SIZE_ICON, SELECT_PATIENT_MODE } from "../../../common/Utility.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import { refreshToken } from "../../../services/refreshToken.jsx";

const WIDTH_TITLE = "130px";

export default function IntraOral(props){
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const clinic = useSelector(state=>state.clinic);
  const patient = useSelector(state=>state.patient);
  const doctor = useSelector(state=>state.doctor);

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

  const [previousData,setPreviousData] = useState();

  useEffect(()=>{
    if(patient.currentPatient) getIntraOral();
  },patient.currentPatient.id)

  const onCancel = () => {
    setEditMode(false);
    updateState(previousData);
  }

  const updateState = (data) => {
    setOralHygiene(data.oralHygiene);
    setDentition(data.dentition);
    setCaries(data.caries);
    setMissing(data.missing);
    setWearingTeeth(data.wearingTeeth);
    setDetalAldevelopment(data.detalAldevelopment);
    setOtherProblems(data.otherProblems);
    setArchForm(data.archForm);
    setRightCanine(data.rightCanine);
    setLeftCanine(data.leftCanine);
    setLeftMolar(data.leftMolar);
    setOverjet(data.overjet);
    setOverbite(data.overbite);
    setCurveOfSpee(data.curveOfSpee);
    setCant(data.cant);
    setPosteriorRight(data.posteriorRight);
    setPosteriorLeft(data.posteriorLeft);
    setUpperMidline(data.upperMidline);
    setLowerMidline(data.lowerMidline);
    setDeviate(data.deviate);
    setCrCoDiscrepancy(data.crCoDiscrepancy);
    setMaximumMouthOpening(data.maximumMouthOpening);
    setGuidanceOnProtrusion(data.guidanceOnProtrusion);
    setGuidanceOnRight(data.guidanceOnRight);
    setGuidanceOnLeft(data.guidanceOnLeft);
    setMusculature(data.musculature);
    setSwallowingPattern(data.swallowingPattern);
    setHistoryOfTMD(data.historyOfTMD);
  }

  const getIntraOral = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) => {
      getToServerWithToken(`/v1/intraoral/${patient.currentPatient.id}`).then(result => {
        setPreviousData(result.data);
        updateState(result.data);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getIntraOral());
        }else{
          toast.error(err.message);
        }
        reject();
      }).finally(()=>dispatch(setLoadingModal(false)));
    })
  }

  const onUpdateIntraOral = () => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve, reject) =>{
      putToServerWithToken(`/v1/intraoral/updateIntraoral/${patient.currentPatient.id}`,{
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
      }).then(result => {
        updateState(result.data);
        setPreviousData(result.data);
        setEditMode(false);
        toast.success(result.message);
        resolve();
      }).catch(err =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>onUpdateIntraOral());
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
          <IconButtonComponent className="btn-outline-success me-2" icon="done" onClick={onUpdateIntraOral}  FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("save")}/>
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
        <img alt="avatar" className="rounded my-3 p-2 hoverGreenLight" src={'/assets/images/13.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"120px",width:"130px",objectFit:"cover"}}/>
        <img alt="avatar" className="rounded my-3 p-2 hoverGreenLight" src={'/assets/images/14.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"120px",width:"130px",objectFit:"cover"}}/>
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
        <img alt="avatar" className="rounded my-3 p-2 hoverGreenLight" src={'/assets/images/11.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"120px",width:"130px",objectFit:"cover"}}/>
        <img alt="avatar" className="rounded my-3 p-2 hoverGreenLight" src={'/assets/images/10.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"120px",width:"130px",objectFit:"cover"}}/>
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
        <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/12.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"120px",width:"130px",objectFit:"cover"}}/>
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
        <img alt="avatar" className="rounded my-1 p-2 hoverGreenLight" src={'/assets/images/8.png'} style={{borderStyle:"dashed",borderWidth:"2px",borderColor:"#043d5d",height:"140px",width:"130px",objectFit:"cover"}}/>
      </div>
    </div>
  </div>
}