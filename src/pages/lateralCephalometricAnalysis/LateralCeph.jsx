import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FONT_SIZE, FONT_SIZE_HEAD, SELECT_PATIENT_MODE, SOFT_WARE_LIST } from "../../common/Utility.jsx";
import NavbarComponent from "../../components/NavbarComponent.jsx";
import SelectPatientComponent from "../../components/SelectPatientComponent.jsx";
import SoftWareListComponent from "../../components/SoftWareListComponent.jsx";
import { setAppName } from "../../redux/GeneralSlice.jsx";
import ControlSection from "./ControlSection.jsx";
import CustomIndicator from "./CustomIndicator.jsx";
import ResultAnalysisTable from "./ResultAnalysisTable.jsx";

const filterMap = {
  contrast: Konva.Filters.Contrast,
  brightness: Konva.Filters.Brighten
}

const stagePos = {x:0, y: 0}

const WIDTH = 30;
const HEIGHT = 30;

export default function LateralCeph(props) {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {t} = useTranslation();
  const doctor = useSelector(state=>state.doctor);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const currentImageAnalysis = useSelector(state=>state.lateralCeph.currentImageAnalysis);

  const stageRef = useRef();
  const imageRef = useRef();

  const [filtersMap, setFiltersMap] = useState(new Map());
  const [openGrid,setOpenGrid] = useState(false);

  const [imageObject,setImageObject] = useState(null);
  const [isGrab,setIsGrab] = useState(false);
  const [stateImage,setStateImage] = useState({
    isDragging: false,
    x: 0,
    y: 0,
  });

  const startX = Math.floor((-stagePos.x - window.innerWidth) / WIDTH) * WIDTH;
  const endX = Math.floor((-stagePos.x + window.innerWidth * 2) / WIDTH) * WIDTH;

  const startY = Math.floor((-stagePos.y - window.innerHeight) / HEIGHT) * HEIGHT;
  const endY = Math.floor((-stagePos.y + window.innerHeight * 2) / HEIGHT) * HEIGHT;

  const gridComponents = [];
  for (var x = startX; x < endX; x += WIDTH) {
    for (var y = startY; y < endY; y += HEIGHT) {
      gridComponents.push(
        <Rect
          x={x}
          y={y}
          width={WIDTH}
          height={HEIGHT}
          stroke="blue"
          strokeWidth = {0.15}
        />
      );
    }
  }

  const filterFuncs = [];
  const filterVals = {};
  filtersMap.forEach((f, name) => {
    f.filter && filterFuncs.push(f.filter);
    filterVals[name] = f.value;
  });

  const applyCache = () => {
    imageRef.current.cache();
  };

  useEffect(() => {
    if (currentImageAnalysis){
      const stage = stageRef.current;
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });
      stage.batchDraw();
      let image = new window.Image();
      image.src = currentImageAnalysis;
      image.setAttribute("crossOrigin","anonymous");
      image.onload = () => {
        if (image.width > 0 && image.height > 0) {
          const scale = image.height/(window.innerHeight-50-(105*2));
          image.width = image.width/scale;
          image.height = image.height/scale;
          setImageObject(image);
        } else {
          toast.error(t('Error loading image'));
        }
      };
    }
  }, [currentImageAnalysis])

  useEffect(()=>{
    if(imageObject){
      applyCache();
    } 
  },[imageObject])

  useEffect(()=>{
    if(!doctor.data?.id) nav('/login');
    dispatch(setAppName(`Myceph - ${t(SOFT_WARE_LIST.LATERALCEPH)}`));
  },[])

  const addFilter = (key, value) => {
    setFiltersMap((prev) => new Map([...prev, [key, value]]));
  };

  const upsertFilter = (key, value) => {
    setFiltersMap((prev) => new Map(prev).set(key, value));
  };

  const handleChange = (name, value) => {
    const mapValue = { filter: filterMap[name], value };
    if(filtersMap.has(name)) {
      upsertFilter(name, mapValue);
    }else if (value !== 0) {
      addFilter(name, mapValue);
    }
  };

  return <div className="d-flex flex-column justify-content-start align-items-center" style={{height:window.innerHeight}}>
    <NavbarComponent />
    <div className="d-flex flex-column container my-1">
      <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-1" style={{minHeight:`${selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
        <SelectPatientComponent condition={selectPatientOnMode === SELECT_PATIENT_MODE.CLINIC_PATIENT} showSelectedPatient={true}/>
        <SoftWareListComponent />
      </div>
    </div>
    <div className="row container-fluid h-100 mb-4">
      <div className="col-md-3 h-100 border-start border-top border-bottom p-0" style={{borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px"}}>
        <ResultAnalysisTable />
      </div>
      <div className="col-md-9 h-100 border p-0" style={{borderTopRightRadius:"5px",borderBottomRightRadius:"5px"}}>
        <div className="d-flex flex-column w-100 h-100 p-0">
          <div className="row p-0 d-flex flex-grow-1">
            <div className="col-md-9 d-flex flex-column flex-grow-1 pe-0">
              <div className="py-1 mc-background row px-2" style={{borderBottomLeftRadius:"5px",borderBottomRightRadius:"5px"}}>
                <span className="text-white fw-bold text-capitalize  border-start" style={{fontSize:FONT_SIZE_HEAD}}>{t('radiography')}</span>
              </div>
              <div className="d-flex flex-grow-1 flex-row">
                <ControlSection />
                <div className="bg-secondary h-100 w-100">

                </div>
              </div>
            </div>
            <CustomIndicator col='col-md-3 ps-0' />
          </div>
        </div>
      </div>
    </div>
  </div>
}