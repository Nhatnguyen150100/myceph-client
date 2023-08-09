import { Tooltip } from "@mui/material";
import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Circle, Group, Image, Layer, Line, Rect, RegularPolygon, Shape, Stage, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { findNextObject, FONT_SIZE, FONT_SIZE_HEAD, getKeyByNameValue, SELECT_PATIENT_MODE, SOFT_WARE_LIST } from "../../common/Utility.jsx";
import NavbarComponent from "../../components/NavbarComponent.jsx";
import SelectPatientComponent from "../../components/SelectPatientComponent.jsx";
import SoftWareListComponent from "../../components/SoftWareListComponent.jsx";
import { setSelectedCurve } from "../../redux/CurveSlice.jsx";
import { setAppName, setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { setConsultationDate, setCurrentImageAnalysis, setMarkerPoints, setScaleImage } from "../../redux/LateralCephSlice.jsx";
import { checkAllPointsExist, getHeightModelCurve, getModelCurve, getWidthModelCurve, LOWER_MOLAR, MANDIBULAR, MANDIBULAR4, UNDER_INCISOR_CURVE, UPPER_INCISOR_CURVE, UPPER_JAW_BONE_CURVE, UPPER_MOLAR, XUONG_CHINH_MUI } from "../CalculatorToothMovement/CalculatorToothUtility.jsx";
import { CRANIAL_BASE, LOWER_SOFT_TISSUE, MANDIBULAR3, ORBITAL_CURVE, UPPER_SOFT_TISSUE } from "../CalculatorToothMovement/MultiModelCurve.jsx";
import ControlSection from "./ControlSection.jsx";
import { ANALYSIS, distanceFromTwoPoint, MARKER_LIST } from "./LateralCephalometricUtility.jsx";
import ResultAnalysisTable from "./ResultAnalysisTable.jsx";
import Ruler from "./Ruler.jsx";
import UtilitiesAnalysis from "./UtilitiesAnalysis.jsx";

const filterMap = {
  contrast: Konva.Filters.Contrast,
  brightness: Konva.Filters.Brighten
}

const ALL_MODEL_CURVES = [UPPER_JAW_BONE_CURVE,UPPER_INCISOR_CURVE,UNDER_INCISOR_CURVE,XUONG_CHINH_MUI,MANDIBULAR,MANDIBULAR4,UPPER_MOLAR,LOWER_MOLAR]

const ALL_MODEL_MULTI_CURVES = [ORBITAL_CURVE,CRANIAL_BASE,UPPER_SOFT_TISSUE,LOWER_SOFT_TISSUE,MANDIBULAR3]

export default function LateralCeph(props) {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {t} = useTranslation();
  const doctor = useSelector(state=>state.doctor);
  const currentAnalysis = useSelector(state=>state.lateralCeph.currentAnalysis);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const markerPoints = useSelector(state=>state.lateralCeph.markerPoints);
  const currentImageAnalysis = useSelector(state=>state.lateralCeph.currentImageAnalysis);
  const consultationDate = useSelector(state=>state.lateralCeph.consultationDate);
  console.log("🚀 ~ file: LateralCeph.jsx:45 ~ LateralCeph ~ consultationDate:", consultationDate)
  const scaleImage = useSelector(state=>state.lateralCeph.scaleImage);
  const lengthOfRuler = useSelector(state=>state.lateralCeph.lengthOfRuler);
  const isVisitableMarkerPoints = useSelector(state=>state.lateralCeph.isVisitableMarkerPoints);
  const isVisitableAnalysisLines = useSelector(state=>state.lateralCeph.isVisitableAnalysisLines);
  const isVisitableImageAnalysis = useSelector(state=>state.lateralCeph.isVisitableImageAnalysis);
  const roleOfDoctorOnPatient = useSelector(state=>state.doctor.roleOfDoctorOnPatient);

  let roleDoctor = roleOfDoctorOnPatient === 'edit' ? true : false;

  const selectedCurve = useSelector(state=>state.curve.selectedCurve);

  const stageRef = useRef();
  const imageRef = useRef();
  const contentAnalysisRef = useRef();
  const crosshairVerticalRef = useRef();
  const crosshairHorizontalRef = useRef();

  const [stageMode,setStageMode] = useState(0);

  const [highLightIndicator,setHighLightIndicator] = useState([])
  const [prevPatient,setPrevPatient] = useState(currentPatient?.id);

  const [markerPointList,setMarkerPointList] = useState(markerPoints);
  const [filtersMap, setFiltersMap] = useState(new Map());

  const [imageObject,setImageObject] = useState(null);
  const [isGrab,setIsGrab] = useState(false);
  const [isDragImage,setIsDragImage] = useState(false);
  const [heightStage,setHeightStage] = useState(0);
  const [widthStage,setWidthStage] = useState(0);
  const [rotation,setRotation] = useState(0);
  const [scale,setScale] = useState(1);
  const [isMobile,setIsMobile] = useState(false)

  const [hoverLine,setHoverLine] = useState(null)
  const [hoverNameCircle,setHoverNameCircle] = useState(null)
  const [hoverCurve,setHoverCurve] = useState(null)

  const [crosshairPos, setCrosshairPos] = useState({ x: 0, y: 0 });
  const [currentMarkerPoint, setCurrentMarkerPoint] = useState();

  const handleMouseMove = () => {
    // Lấy tọa độ chuột trên Stage
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    setCrosshairPos(mousePointTo);
  };

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
    if(currentImageAnalysis && prevPatient===currentPatient?.id){
      const stage = stageRef.current;
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });
      stage.batchDraw();
      let image = new window.Image();
      image.src = currentImageAnalysis.linkImage;
      image.setAttribute("crossOrigin","anonymous");
      image.onload = () => {
        if (image.width > 0 && image.height > 0) {
          const scale = scaleImage?scaleImage:(image.height/(window.innerHeight-50-(105*2))).toFixed(2);
          if(!scaleImage) dispatch(setScaleImage(scale));
          image.width = image.width/scale;
          image.height = image.height/scale;
          setImageObject(image);
        } else {
          toast.error(t('Error loading image'));
        }
      };
    }else{
      setPrevPatient(currentPatient?.id);
      setImageObject(null);
    }
  }, [currentImageAnalysis,scaleImage,currentPatient,prevPatient])

  useEffect(()=>{
    return ()=>{
      dispatch(setCurrentImageAnalysis(null));
      dispatch(setConsultationDate(null))
      setImageObject(null);
      setMarkerPointList(null);
      dispatch(setScaleImage(null));
    }
  },[])

  useEffect(()=>{
    if(imageObject){
      applyCache();
    } 
  },[imageObject])

  const handleClickStage = (event) => {
    if((event.target === stageRef.current || event.target === imageRef.current) && !currentMarkerPoint) {
      dispatch(setSelectedCurve(null))
    }
    if(currentMarkerPoint){
      onAddMarkerPoint(stageMode === 0 ? ANALYSIS[getKeyByNameValue(ANALYSIS,currentAnalysis)]?.markerPoints : Object.keys(getModelCurve(selectedCurve)?.markerPoints))
    }
  }

  const onAddMarkerPoint = (currentMarkerPoints) => {
    if(currentMarkerPoint && roleDoctor){
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };
      const newMarkerPoints = {...markerPoints,...{
        [currentMarkerPoint]: mousePointTo
      }}
      dispatch(setMarkerPoints(newMarkerPoints));
      setMarkerPointList(newMarkerPoints);
      const nextPoint = findNextObject(currentMarkerPoint,currentMarkerPoints,markerPoints);
      if(stageMode === 1 && !nextPoint) dispatch(setSelectedCurve(null))
      setCurrentMarkerPoint(nextPoint);
    }
  }

  const handleWheel = e => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const scaleBy = 1.05;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    setCrosshairPos(mousePointTo);
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage.scale({ x: newScale, y: newScale });
    setScale(newScale);
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    const updatedLength = heightStage * newScale;
    crosshairVerticalRef.current?.setAttrs({ points: [0, 0, 0, updatedLength] });
    crosshairHorizontalRef.current?.setAttrs({ points: [0, 0, widthStage * newScale, 0] });

    stage.position(newPos);
    stage.batchDraw();
  };

  const onZoomInHandle = () => {
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const newScale = oldScale*1.05;

    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const middleX = stageWidth / 2;
    const middleY = stageHeight / 2;

    const pointTo = {
      x: (middleX - stage.x()) / oldScale,
      y: (middleY - stage.y()) / oldScale,
    };
    const newMiddleX = middleX - pointTo.x *newScale;
    const newMiddleY = middleY - pointTo.y *newScale;
    stage.position({ x: newMiddleX, y: newMiddleY });

    stage.scale({ x: newScale, y: newScale });
    setScale(newScale);
  }

  const onZoomOutHandle = () => {
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const newScale = oldScale/1.05;

    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const middleX = stageWidth / 2;
    const middleY = stageHeight / 2;

    const pointTo = {
      x: (middleX - stage.x()) / oldScale,
      y: (middleY - stage.y()) / oldScale,
    };
  
    const newMiddleX = middleX - pointTo.x *newScale;
    const newMiddleY = middleY - pointTo.y *newScale;
    stage.position({ x: newMiddleX, y: newMiddleY });

    stage.scale({ x: newScale, y: newScale });
    setScale(newScale);
  }

  useEffect(()=>{
    if(!doctor.data?.id) nav('/login');
    dispatch(setAppName(`Myceph - ${t(SOFT_WARE_LIST.LATERALCEPH)}`));
  },[])

  useEffect(()=>{
    if(window.innerWidth < 580){
      setIsMobile(true);
      toast.error(t('This feature is not supported on this device, you will be redirected to homepage in 3 seconds.'));
      setTimeout(()=>{
        nav('/')
      },3000);
    }
  },[])

  useEffect(()=>{
    if(contentAnalysisRef && (!heightStage || !widthStage)){
      setHeightStage(contentAnalysisRef.current.clientHeight);
      setWidthStage(contentAnalysisRef.current.clientWidth);
    }
  },[contentAnalysisRef])

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

  const handleDragImageKeyDown = (event) => {
    if (event.repeat) return;
    if (event.code === 'Space') {
      setIsDragImage(true);
    }
  };

  const handleDragImageKeyUp = (event) => {
    if (event.code === 'Space') {
      setIsDragImage(false);
    }
  };

  const markerPointToolTip = useMemo(()=>{
    let reactToolTip = null;
    if(hoverCurve && !isDragImage && !selectedCurve){
      reactToolTip = <Group key={"hover_text_curve"}>
        <Rect 
          x={crosshairPos.x + 10/scale}
          y={crosshairPos.y - 10/scale}
          scaleX={scale.x}
          scaleY={scale.y}
          width={getModelCurve(hoverCurve).toolTipWidth/scale}
          height={20/scale}
          scale={scale}
          shadowBlur={10}
          cornerRadius={10}
          fill="#F9E29C"
        />
        <Text 
          x={crosshairPos.x + 20/scale}
          y={crosshairPos.y - 5/scale}
          text={t(hoverCurve)}
          fill="black"
          fontStyle="bold"
          scaleX={scale.x}
          scaleY={scale.y}
          fontSize={10/scale}
        />
      </Group>
    }
    if(hoverNameCircle && !isDragImage){
      if(stageMode===1 && !getModelCurve(selectedCurve).markerPoints[hoverNameCircle].isShow) return null;
      const markerPointName = stageMode === 0 ? MARKER_LIST[hoverNameCircle] : getModelCurve(selectedCurve).markerPoints[hoverNameCircle].name
      let widthRect = null;
      if(markerPointName.length<=6){
        widthRect = 11*markerPointName.length
      }else if(markerPointName.length<=13){
        widthRect = 8*markerPointName.length
      }else{
        widthRect = 6*markerPointName.length
      }
      reactToolTip = <Group key={"hover_text_marker_point"}>
        <Rect 
          x={crosshairPos.x + 10/scale}
          y={crosshairPos.y - 10/scale}
          scaleX={scale.x}
          scaleY={scale.y}
          width={widthRect/scale}
          height={20/scale}
          scale={scale}
          shadowBlur={10}
          cornerRadius={10}
          fill="#F9E29C"
        />
        <Text 
          x={crosshairPos.x + 20/scale}
          y={crosshairPos.y - 5/scale}
          text={markerPointName}
          fill="black"
          fontStyle="bold"
          scaleX={scale.x}
          scaleY={scale.y}
          fontSize={10/scale}
        />
      </Group>
    }
    return reactToolTip
  },[hoverNameCircle,scale,isDragImage,stageMode,crosshairPos,selectedCurve,hoverCurve])

  const drawLines = useMemo(()=>{
    let linesArray = [];
    for (const lines of ANALYSIS[getKeyByNameValue(ANALYSIS,currentAnalysis)]?.linesArray(markerPoints)) {
      if(lines[0] && lines[1]){
        linesArray.push(
          <Line
            visible={isVisitableAnalysisLines}
            key={lines[0].x+lines[0].y+lines[1].x+lines[1].y+Math.random(1,1000)}
            x={0}
            y={0}
            points={[lines[0].x, lines[0].y, lines[1].x,lines[1].y]}
            stroke="#8B008B"
            strokeWidth={2/scale}
            opacity={0.8}
          />
        )
      }
    }
    return linesArray;
  },[markerPoints,currentAnalysis,scale,isVisitableAnalysisLines])

  const hightLightLines = useMemo(()=>{
    let linesArray = [];
    if(highLightIndicator?.length > 0){
      for (const lines of highLightIndicator) {
        if(lines.line[0] && lines.line[1]){
          linesArray.push(
            <Line
              key={lines.line[0].x+lines.line[0].y+lines.line[1].x+lines.line[1].y+Math.random(1,1000)}
              x={0}
              y={0}
              points={[lines.line[0].x, lines.line[0].y, lines.line[1].x, lines.line[1].y]}
              stroke={lines.color}
              strokeWidth={2.5/scale}
              opacity={1}
            />
          )
        }
      }
    }
    return linesArray;
  },[highLightIndicator,scale])

  const drawMarkerPoints = useMemo(()=>{
    let circleWithTextArray = [];
    for (const key of Object.keys(markerPointList)) {
      if(markerPointList[key] && ANALYSIS[getKeyByNameValue(ANALYSIS,currentAnalysis)]?.markerPoints.find(point => point === key)){
        circleWithTextArray.push(
          <Group
            key={key}
            visible={isVisitableMarkerPoints}
          >
            <Circle
              fill={'red'}
              draggable={roleDoctor}
              opacity={1}
              radius={4/scale}
              x={markerPointList[key].x}
              y={markerPointList[key].y}
              onDragStart={(event) => {
                const circle = event.target;
                circle.fill('#27a9f1');
              }}
              onMouseOver={(event) => {
                setHoverNameCircle(key)
                const circle = event.target;
                circle.fill('#27a9f1');
              }}
              onMouseLeave={(event) => {
                setHoverNameCircle(null)
                const circle = event.target;
                circle.fill('red');
              }}
              onDragEnd={(event) => {
                const newMarkerPoints = Object.assign({}, markerPointList);
                newMarkerPoints[key] = {
                  x: event.target.x(),
                  y: event.target.y()
                };
                dispatch(setMarkerPoints(newMarkerPoints));
                setMarkerPointList(newMarkerPoints);
                const circle = event.target;
                circle.fill('red');
              }}
              onDragMove={(event) => {
                const newMarkerPoints = Object.assign({}, markerPointList);
                newMarkerPoints[key] = {
                  x: event.target.x(),
                  y: event.target.y()
                };
                dispatch(setMarkerPoints(newMarkerPoints));
                setMarkerPointList(newMarkerPoints);
                const group = event.target.findAncestor('Group');
                if (group) {
                  const textNode = group.findOne('Text');
                  if (textNode) {
                    textNode.setAttrs({
                      x: event.target.x() + 5,
                      y: event.target.y() + 5,
                    });
                  }
                }
              }}
            />
            <Text 
              x={markerPointList[key].x + 3/scale}
              y={markerPointList[key].y + 3/scale}
              scaleX={scale.x}
              scaleY={scale.y}
              draggable={false}
              text={key}
              fill="#AAFF00"
              fontSize={10/scale}
            />
          </Group>
        )
      }
    }
    return circleWithTextArray
  },[markerPointList,currentAnalysis,scale,isVisitableMarkerPoints])

  const drawMarkerPointsCurve = useMemo(()=>{
    let allPointsAndLineFromModel = [];
    for (const curveModel of ALL_MODEL_CURVES) {
      curveModel.controlPoints.map((value,_) => {
        if(markerPointList[value.startPoint]){
          allPointsAndLineFromModel.push(
            <React.Fragment key={value.startPoint}>
              <Line 
                x={0}
                y={0}
                lineCap="round"
                lineJoin="round"
                visible={selectedCurve === curveModel.name && checkAllPointsExist(curveModel,markerPointList) && !value.controlPoint1?.hide}
                dash={[5/scale, 5/scale, 0.2/scale, 5/scale]}
                points={[
                  markerPointList[value.startPoint].x, 
                  markerPointList[value.startPoint].y, 
                  value.controlPoint1.positionDefault(markerPointList).x,
                  value.controlPoint1.positionDefault(markerPointList).y
                ]}
                stroke="#FF1493"
                strokeWidth={2/scale}
                opacity={1}
              />
              <Circle 
                x={value.controlPoint1.positionDefault(markerPointList).x}
                y={value.controlPoint1.positionDefault(markerPointList).y}
                radius={4/scale}
                fill="blue" 
                onMouseOver={(event) => {
                  const circle = event.target;
                  circle.fill('#ffad00')
                }}
                onMouseLeave={event => {
                  const circle = event.target;
                  circle.fill('blue')
                }}
                visible={selectedCurve === curveModel.name && checkAllPointsExist(curveModel,markerPointList) && !value.controlPoint1?.hide}
                draggable={roleDoctor}
                onDragEnd={(e) =>{
                  const newMarkerPoints = Object.assign({}, markerPointList);
                  newMarkerPoints[value.controlPoint1.name] = {
                    name: value.controlPoint1.name,
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  dispatch(setMarkerPoints(newMarkerPoints))
                  setMarkerPointList(newMarkerPoints);
                }}
                onDragMove={(e) =>{
                  const newMarkerPoints = Object.assign({}, markerPointList);
                  newMarkerPoints[value.controlPoint1.name] = {
                    name: value.controlPoint1.name,
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  dispatch(setMarkerPoints(newMarkerPoints))
                  setMarkerPointList(newMarkerPoints);
                }}
              />
              {
                markerPointList[value.endPoint] && 
                <React.Fragment>
                  <Line 
                    x={0}
                    y={0}
                    lineCap="round"
                    lineJoin="round"
                    visible={selectedCurve === curveModel.name && checkAllPointsExist(curveModel,markerPointList) && !value.controlPoint2?.hide}
                    dash={[5/scale, 5/scale, 0.2/scale, 5/scale]}
                    points={[
                      markerPointList[value.endPoint].x, 
                      markerPointList[value.endPoint].y, 
                      value.controlPoint2.positionDefault(markerPointList).x,
                      value.controlPoint2.positionDefault(markerPointList).y
                    ]}
                    stroke="#FF1493"
                    strokeWidth={2/scale}
                    opacity={1}
                  />
                  <Circle 
                    x={value.controlPoint2.positionDefault(markerPointList).x}
                    y={value.controlPoint2.positionDefault(markerPointList).y}
                    radius={4/scale}
                    fill="blue" 
                    onMouseOver={(event) => {
                      const circle = event.target;
                      circle.fill('#ffad00')
                    }}
                    onMouseLeave={event => {
                      const circle = event.target;
                      circle.fill('blue')
                    }}
                    visible={selectedCurve === curveModel.name && checkAllPointsExist(curveModel,markerPointList) && !value.controlPoint2?.hide}
                    draggable={roleDoctor}
                    onDragEnd={(e) =>{
                      const newMarkerPoints = Object.assign({}, markerPointList);
                      newMarkerPoints[value.controlPoint2.name] = {
                        name: value.controlPoint2.name,
                        x: e.target.x(),
                        y: e.target.y()
                      };
                      dispatch(setMarkerPoints(newMarkerPoints))
                      setMarkerPointList(newMarkerPoints);
                    }}
                    onDragMove={(e) =>{
                      const newMarkerPoints = Object.assign({}, markerPointList);
                      newMarkerPoints[value.controlPoint2.name] = {
                        name: value.controlPoint2.name,
                        x: e.target.x(),
                        y: e.target.y()
                      };
                      dispatch(setMarkerPoints(newMarkerPoints))
                      setMarkerPointList(newMarkerPoints);
                    }}
                  />
                </React.Fragment>
              }
              <Group visible={selectedCurve === curveModel.name}>
                <RegularPolygon
                  sides={4}
                  radius={6/scale}
                  x={markerPointList[value.startPoint].x}
                  y={markerPointList[value.startPoint].y}
                  fill="red" 
                  draggable={roleDoctor}
                  onMouseOver={(event) => {
                    setHoverNameCircle(value.startPoint)
                    const regularPolygon = event.target;
                    regularPolygon.fill('#ffad00')
                  }}
                  onMouseLeave={event => {
                    setHoverNameCircle(null)
                    const regularPolygon = event.target;
                    regularPolygon.fill('red')
                  }}
                  onDragEnd={(e) =>{
                    const newMarkerPoints = Object.assign({}, markerPointList);
                    newMarkerPoints[value.startPoint] = {
                      x: e.target.x(),
                      y: e.target.y()
                    };
                    dispatch(setMarkerPoints(newMarkerPoints))
                    setMarkerPointList(newMarkerPoints);
                  }}
                  onDragMove={(e) =>{
                    const newMarkerPoints = Object.assign({}, markerPointList);
                    newMarkerPoints[value.startPoint] = {
                      x: e.target.x(),
                      y: e.target.y()
                    };
                    dispatch(setMarkerPoints(newMarkerPoints))
                    setMarkerPointList(newMarkerPoints);
                  }}
                />
                <Text 
                  visible={curveModel.markerPoints[value.startPoint]?.isShow}
                  x={markerPointList[value.startPoint].x + 7/scale}
                  y={markerPointList[value.startPoint].y + 7/scale}
                  draggable={false}
                  scaleX={scale.x}
                  scaleY={scale.y}
                  text={value.startPoint}
                  fill="#EEB422"
                  fontSize={13/scale}
                />
              </Group> 
            </React.Fragment>
          )
        }
      })
    }
    return allPointsAndLineFromModel
  },[markerPointList,selectedCurve,scale])

  const drawHeightAndWidthCustomShape = useMemo(() => {
    if(!selectedCurve) return null
    let heightAndWidthShape = [];
    const curveModel = getModelCurve(selectedCurve)
    if(checkAllPointsExist(curveModel,markerPointList) && markerPointList['C1'] && markerPointList['C2'] && selectedCurve){
      const heightShape = <Ruler 
        key={curveModel.heightOfShape(markerPointList).pointStart?.x + curveModel.heightOfShape(markerPointList).pointStart?.y + Math.random()}
        c1={{
          x: curveModel.heightOfShape(markerPointList).pointStart?.x,
          y: curveModel.heightOfShape(markerPointList).pointStart?.y
        }}
        c2={{
          x: curveModel.heightOfShape(markerPointList).pointEnd?.x,
          y: curveModel.heightOfShape(markerPointList).pointEnd?.y
        }}
        scale={scale}
        lengthOfRuler={distanceFromTwoPoint(curveModel.heightOfShape(markerPointList).pointStart,curveModel.heightOfShape(markerPointList).pointEnd,markerPointList['C1'],markerPointList['C2'],lengthOfRuler)}
      />
      const widthShape = <Ruler 
        key={curveModel.widthOfShape(markerPointList).pointStart?.x - curveModel.widthOfShape(markerPointList).pointStart?.y + Math.random()}
        c1={{
          x: curveModel.widthOfShape(markerPointList).pointStart?.x,
          y: curveModel.widthOfShape(markerPointList).pointStart?.y
        }}
        c2={{
          x: curveModel.widthOfShape(markerPointList).pointEnd?.x,
          y: curveModel.widthOfShape(markerPointList).pointEnd?.y
        }}
        scale={scale}
        lengthOfRuler={distanceFromTwoPoint(curveModel.widthOfShape(markerPointList).pointStart,curveModel.widthOfShape(markerPointList).pointEnd,markerPointList['C1'],markerPointList['C2'],lengthOfRuler)}
      />
      heightAndWidthShape.push(heightShape,widthShape)
    }
    return heightAndWidthShape
  },[markerPointList,scale,lengthOfRuler,selectedCurve])

  const drawCustomShape = useMemo(()=>{
    let allCustomShapeFromModel = [];
    for (const curveModel of ALL_MODEL_CURVES) {
      if(checkAllPointsExist(curveModel,markerPointList)){
        const customShape =  <Shape
          key={curveModel.id+markerPointList[curveModel.controlPoints[0].startPoint].x+markerPointList[curveModel.controlPoints[0].startPoint].y}
          x={0}
          y={0}
          strokeWidth={2/scale}
          sceneFunc={(context,shape) => {
            context.beginPath();
            context.moveTo(markerPointList[curveModel.controlPoints[0].startPoint].x, markerPointList[curveModel.controlPoints[0].startPoint].y);
            curveModel.controlPoints.forEach((value) => {
              context.bezierCurveTo(
                value.controlPoint1.positionDefault(markerPointList).x,
                value.controlPoint1.positionDefault(markerPointList).y,
                value.controlPoint2.positionDefault(markerPointList).x,
                value.controlPoint2.positionDefault(markerPointList).y,
                markerPointList[value.endPoint].x,
                markerPointList[value.endPoint].y,
              )
            })
            context.closePath();
            context.fillStrokeShape(shape);
          }}
          opacity={1}
          stroke="#99f6a3"
        />
        if(curveModel.lines.length > 0){
          for (const line of curveModel.lines) {
            const lineShape = <Line
            key={markerPointList[line.startPoint].x+markerPointList[line.endPoint].y}
            x={0}
            y={0}
            stroke={line.lineColor}
            points={[
              markerPointList[line.startPoint].x, 
              markerPointList[line.startPoint].y, 
              markerPointList[line.endPoint].x,
              markerPointList[line.endPoint].y
            ]}
            strokeWidth={2/scale}
            opacity={1}
            />
            allCustomShapeFromModel.push(lineShape)
          }
        }
        allCustomShapeFromModel.push(customShape);
      }
    }
    return allCustomShapeFromModel;
  },[markerPointList,scale])

  const drawCustomShapeHover = useMemo(()=>{
    let allCustomShapeFromModel = [];
    for (const curveModel of ALL_MODEL_CURVES) {
      if(checkAllPointsExist(curveModel,markerPointList)){
        const customShape =  <Shape
          key={curveModel.id+markerPointList[curveModel.controlPoints[0].startPoint].x}
          x={0}
          y={0}
          strokeWidth={0}
          onMouseDown={() => {
            if(!currentMarkerPoint){
              if(selectedCurve !== curveModel.name){
                dispatch(setSelectedCurve(curveModel.name))
              }else dispatch(setSelectedCurve(null)) 
            }
          }}
          draggable={roleDoctor}
          onDragStart={(event) => {
            dispatch(setSelectedCurve(null))
            const shape = event.target;
            shape.fill('#0c1780');
          }}
          onDragEnd={e=>{         
            const newMarkerPoints = Object.assign({}, markerPointList);
            for (const markerPoint of curveModel.allPointsCurve) {
              if(newMarkerPoints[markerPoint]){
                const prePos = newMarkerPoints[markerPoint]
                newMarkerPoints[markerPoint] = {
                  x: prePos.x + e.target.x(),
                  y: prePos.y + e.target.y()
                };
              }
            }
            setMarkerPointList(newMarkerPoints);
            dispatch(setMarkerPoints(newMarkerPoints))
          }}
          onMouseOver={(event) => {
            const shape = event.target;
            setHoverCurve(curveModel.name)
            shape.fill('#0c1780');
          }}
          onMouseOut={event => {
            const shape = event.target;
            setHoverCurve(null)
            shape.fill(null)
          }}
          sceneFunc={(context,shape) => {
            context.beginPath();
            context.moveTo(markerPointList[curveModel.controlPoints[0].startPoint].x, markerPointList[curveModel.controlPoints[0].startPoint].y);
            curveModel.controlPoints.forEach((value) => {
              context.bezierCurveTo(
                value.controlPoint1.positionDefault(markerPointList).x,
                value.controlPoint1.positionDefault(markerPointList).y,
                value.controlPoint2.positionDefault(markerPointList).x,
                value.controlPoint2.positionDefault(markerPointList).y,
                markerPointList[value.endPoint].x,
                markerPointList[value.endPoint].y,
              )
            })
            context.closePath();
            context.fillStrokeShape(shape);
          }}
          opacity={0.4}
        />
        allCustomShapeFromModel.push(customShape);
      }
    }
    return allCustomShapeFromModel;
  },[markerPointList,selectedCurve,scale,currentMarkerPoint,markerPoints,roleDoctor])

  const drawMarkerPointsMultiCurve = useMemo(()=>{
    let allPointsAndLineFromModel = [];
    for (const curveModel of ALL_MODEL_MULTI_CURVES) {
      curveModel.multiCurves.map((subCurve,index) => {
        if(markerPointList[subCurve.controlPoints.startPoint]){
          allPointsAndLineFromModel.push(
            <React.Fragment key={subCurve.controlPoints.startPoint}>
              <Line 
                x={0}
                y={0}
                lineCap="round"
                lineJoin="round"
                visible={selectedCurve === curveModel.name && checkAllPointsExist(curveModel,markerPointList) && !subCurve.controlPoints.controlPoint1?.hide}
                dash={[5/scale, 5/scale, 0.2/scale, 5/scale]}
                points={[
                  markerPointList[subCurve.controlPoints.startPoint].x, 
                  markerPointList[subCurve.controlPoints.startPoint].y, 
                  subCurve.controlPoints.controlPoint1.positionDefault(markerPointList).x,
                  subCurve.controlPoints.controlPoint1.positionDefault(markerPointList).y
                ]}
                stroke="#FF1493"
                strokeWidth={2/scale}
                opacity={1}
              />
              <Circle 
                x={subCurve.controlPoints.controlPoint1.positionDefault(markerPointList).x}
                y={subCurve.controlPoints.controlPoint1.positionDefault(markerPointList).y}
                radius={4/scale}
                fill="blue" 
                onMouseOver={(event) => {
                  const circle = event.target;
                  circle.fill('#ffad00')
                }}
                onMouseLeave={event => {
                  const circle = event.target;
                  circle.fill('blue')
                }}
                visible={selectedCurve === curveModel.name && checkAllPointsExist(curveModel,markerPointList) && !subCurve.controlPoints.controlPoint1?.hide}
                draggable={roleDoctor}
                onDragEnd={(e) =>{
                  const newMarkerPoints = Object.assign({}, markerPointList);
                  newMarkerPoints[subCurve.controlPoints.controlPoint1.name] = {
                    name: subCurve.controlPoints.controlPoint1.name,
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  dispatch(setMarkerPoints(newMarkerPoints))
                  setMarkerPointList(newMarkerPoints);
                }}
                onDragMove={(e) =>{
                  const newMarkerPoints = Object.assign({}, markerPointList);
                  newMarkerPoints[subCurve.controlPoints.controlPoint1.name] = {
                    name: subCurve.controlPoints.controlPoint1.name,
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  dispatch(setMarkerPoints(newMarkerPoints))
                  setMarkerPointList(newMarkerPoints);
                }}
              />
              {
                markerPointList[subCurve.controlPoints.endPoint] && 
                <React.Fragment>
                  <Line 
                    x={0}
                    y={0}
                    lineCap="round"
                    lineJoin="round"
                    visible={selectedCurve === curveModel.name && checkAllPointsExist(curveModel,markerPointList) && !subCurve.controlPoints.controlPoint2?.hide}
                    dash={[5/scale, 5/scale, 0.2/scale, 5/scale]}
                    points={[
                      markerPointList[subCurve.controlPoints.endPoint].x, 
                      markerPointList[subCurve.controlPoints.endPoint].y, 
                      subCurve.controlPoints.controlPoint2.positionDefault(markerPointList).x,
                      subCurve.controlPoints.controlPoint2.positionDefault(markerPointList).y
                    ]}
                    stroke="#FF1493"
                    strokeWidth={2/scale}
                    opacity={1}
                  />
                  <Circle 
                    x={subCurve.controlPoints.controlPoint2.positionDefault(markerPointList).x}
                    y={subCurve.controlPoints.controlPoint2.positionDefault(markerPointList).y}
                    radius={4/scale}
                    fill="blue" 
                    onMouseOver={(event) => {
                      const circle = event.target;
                      circle.fill('#ffad00')
                    }}
                    onMouseLeave={event => {
                      const circle = event.target;
                      circle.fill('blue')
                    }}
                    visible={selectedCurve === curveModel.name && checkAllPointsExist(curveModel,markerPointList) && !subCurve.controlPoints.controlPoint2?.hide}
                    draggable={roleDoctor}
                    onDragEnd={(e) =>{
                      const newMarkerPoints = Object.assign({}, markerPointList);
                      newMarkerPoints[subCurve.controlPoints.controlPoint2.name] = {
                        name: subCurve.controlPoints.controlPoint2.name,
                        x: e.target.x(),
                        y: e.target.y()
                      };
                      dispatch(setMarkerPoints(newMarkerPoints))
                      setMarkerPointList(newMarkerPoints);
                    }}
                    onDragMove={(e) =>{
                      const newMarkerPoints = Object.assign({}, markerPointList);
                      newMarkerPoints[subCurve.controlPoints.controlPoint2.name] = {
                        name: subCurve.controlPoints.controlPoint2.name,
                        x: e.target.x(),
                        y: e.target.y()
                      };
                      dispatch(setMarkerPoints(newMarkerPoints))
                      setMarkerPointList(newMarkerPoints);
                    }}
                  />
                </React.Fragment>
              }
              <Group visible={selectedCurve === curveModel.name}>
                <RegularPolygon
                  sides={4}
                  radius={6/scale}
                  x={markerPointList[subCurve.controlPoints.startPoint].x}
                  y={markerPointList[subCurve.controlPoints.startPoint].y}
                  fill="red" 
                  draggable={roleDoctor}
                  onMouseOver={(event) => {
                    setHoverNameCircle(subCurve.controlPoints.startPoint)
                    const regularPolygon = event.target;
                    regularPolygon.fill('#ffad00')
                  }}
                  onMouseLeave={event => {
                    setHoverNameCircle(null)
                    const regularPolygon = event.target;
                    regularPolygon.fill('red')
                  }}
                  onDragEnd={(e) =>{
                    const newMarkerPoints = Object.assign({}, markerPointList);
                    newMarkerPoints[subCurve.controlPoints.startPoint] = {
                      x: e.target.x(),
                      y: e.target.y()
                    };
                    dispatch(setMarkerPoints(newMarkerPoints))
                    setMarkerPointList(newMarkerPoints);
                  }}
                  onDragMove={(e) =>{
                    const newMarkerPoints = Object.assign({}, markerPointList);
                    newMarkerPoints[subCurve.controlPoints.startPoint] = {
                      x: e.target.x(),
                      y: e.target.y()
                    };
                    dispatch(setMarkerPoints(newMarkerPoints))
                    setMarkerPointList(newMarkerPoints);
                  }}
                />
                <Text 
                  visible={curveModel.markerPoints[subCurve.controlPoints.startPoint]?.isShow}
                  x={markerPointList[subCurve.controlPoints.startPoint].x + 7/scale}
                  y={markerPointList[subCurve.controlPoints.startPoint].y + 7/scale}
                  draggable={false}
                  scaleX={scale.x}
                  scaleY={scale.y}
                  text={subCurve.controlPoints.startPoint}
                  fill="#EEB422"
                  fontSize={13/scale}
                />
              </Group> 
            </React.Fragment>
          )
        }
        if((index === curveModel.multiCurves.length - 1) && markerPointList[subCurve.controlPoints.endPoint]){
          allPointsAndLineFromModel.push(
            <Group visible={selectedCurve === curveModel.name} key={subCurve.controlPoints.endPoint+'lastPoint'}>
              <RegularPolygon
                sides={4}
                radius={6/scale}
                x={markerPointList[subCurve.controlPoints.endPoint].x}
                y={markerPointList[subCurve.controlPoints.endPoint].y}
                fill="red" 
                draggable={roleDoctor}
                onMouseOver={(event) => {
                  setHoverNameCircle(subCurve.controlPoints.endPoint)
                  const regularPolygon = event.target;
                  regularPolygon.fill('#ffad00')
                }}
                onMouseLeave={event => {
                  setHoverNameCircle(null)
                  const regularPolygon = event.target;
                  regularPolygon.fill('red')
                }}
                onDragEnd={(e) =>{
                  const newMarkerPoints = Object.assign({}, markerPointList);
                  newMarkerPoints[subCurve.controlPoints.endPoint] = {
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  dispatch(setMarkerPoints(newMarkerPoints))
                  setMarkerPointList(newMarkerPoints);
                }}
                onDragMove={(e) =>{
                  const newMarkerPoints = Object.assign({}, markerPointList);
                  newMarkerPoints[subCurve.controlPoints.endPoint] = {
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  dispatch(setMarkerPoints(newMarkerPoints))
                  setMarkerPointList(newMarkerPoints);
                }}
              />
              <Text 
                visible={curveModel.markerPoints[subCurve.controlPoints.endPoint]?.isShow}
                x={markerPointList[subCurve.controlPoints.endPoint].x + 7/scale}
                y={markerPointList[subCurve.controlPoints.endPoint].y + 7/scale}
                draggable={false}
                scaleX={scale.x}
                scaleY={scale.y}
                text={subCurve.controlPoints.endPoint}
                fill="#EEB422"
                fontSize={13/scale}
              />
            </Group>
          )
        }
      })
    }
    return allPointsAndLineFromModel
  },[markerPointList,selectedCurve,scale,roleDoctor])

  const drawMultiCurves = useMemo(()=>{
    const allCurveFromMultiModel = [];
    for(const multiModalCurve of ALL_MODEL_MULTI_CURVES){
      if(checkAllPointsExist(multiModalCurve,markerPointList)){
        for(const subCurve of multiModalCurve.multiCurves){
          const customLine = <Line 
            key={subCurve.key}
            x={0}
            y={0}
            bezier
            points={[
              markerPointList[subCurve.controlPoints.startPoint].x,
              markerPointList[subCurve.controlPoints.startPoint].y,
              subCurve.controlPoints.controlPoint1.positionDefault(markerPointList).x,
              subCurve.controlPoints.controlPoint1.positionDefault(markerPointList).y,
              subCurve.controlPoints.controlPoint2.positionDefault(markerPointList).x,
              subCurve.controlPoints.controlPoint2.positionDefault(markerPointList).y,
              markerPointList[subCurve.controlPoints.endPoint].x,
              markerPointList[subCurve.controlPoints.endPoint].y
            ]}
            stroke={hoverLine===subCurve.key ? "#54c0ff" : "#99f6a3"}
            strokeWidth={2/scale}
            opacity={1}
          />
          allCurveFromMultiModel.push(customLine);
        }
        if(multiModalCurve.lines.length > 0){
          for (const line of multiModalCurve.lines) {
            const lineShape = <Line
            key={line.key}
            x={0}
            y={0}
            stroke={hoverLine===line.key ? "#54c0ff" : "#99f6a3"}
            points={[
              markerPointList[line.startPoint].x, 
              markerPointList[line.startPoint].y, 
              markerPointList[line.endPoint].x,
              markerPointList[line.endPoint].y
            ]}
            strokeWidth={2/scale}
            opacity={1}
            />
            allCurveFromMultiModel.push(lineShape)
          }
        }
      }
    }
    return allCurveFromMultiModel;
  },[markerPointList,scale,hoverLine])

  const drawMultiCurvesHover = useMemo(()=>{
    const allCurveFromMultiModel = [];
    for(const multiModalCurve of ALL_MODEL_MULTI_CURVES){
      if(checkAllPointsExist(multiModalCurve,markerPointList)){
        for(const subCurve of multiModalCurve.multiCurves){
          const customLine = <Line 
            key={subCurve.key+'highlight'}
            x={0}
            y={0}
            bezier
            onMouseDown={() => {
              if(!currentMarkerPoint){
                if(selectedCurve !== multiModalCurve.name){
                  dispatch(setSelectedCurve(multiModalCurve.name))
                }else dispatch(setSelectedCurve(null)) 
              }
            }}
            onMouseOver={()=>{
              setHoverCurve(multiModalCurve.name)
              setHoverLine(subCurve.key)
            }}
            onMouseLeave={()=>{
              setHoverCurve(null)
              setHoverLine(null)
            }}
            points={[
              markerPointList[subCurve.controlPoints.startPoint].x,
              markerPointList[subCurve.controlPoints.startPoint].y,
              subCurve.controlPoints.controlPoint1.positionDefault(markerPointList).x,
              subCurve.controlPoints.controlPoint1.positionDefault(markerPointList).y,
              subCurve.controlPoints.controlPoint2.positionDefault(markerPointList).x,
              subCurve.controlPoints.controlPoint2.positionDefault(markerPointList).y,
              markerPointList[subCurve.controlPoints.endPoint].x,
              markerPointList[subCurve.controlPoints.endPoint].y
            ]}
            stroke={"#54c0ff"}
            strokeWidth={13/scale}
            opacity={0}
          />
          allCurveFromMultiModel.push(customLine);
        }
        if(multiModalCurve.lines.length > 0){
          for (const line of multiModalCurve.lines) {
            const lineShape = <Line
            key={line.key}
            x={0}
            y={0}
            onMouseDown={() => {
              if(!currentMarkerPoint){
                if(selectedCurve !== multiModalCurve.name){
                  dispatch(setSelectedCurve(multiModalCurve.name))
                }else dispatch(setSelectedCurve(null)) 
              }
            }}
            onMouseOver={()=>{
              setHoverLine(line.key)
            }}
            onMouseLeave={()=>{
              setHoverLine(null)
            }}
            stroke={"#54c0ff"}
            points={[
              markerPointList[line.startPoint].x, 
              markerPointList[line.startPoint].y, 
              markerPointList[line.endPoint].x,
              markerPointList[line.endPoint].y
            ]}
            strokeWidth={13/scale}
            opacity={0}
            />
            allCurveFromMultiModel.push(lineShape)
          }
        }
      }
    }
    return allCurveFromMultiModel;
  },[markerPointList,scale,selectedCurve,currentMarkerPoint])

  return <div className="d-flex flex-column justify-content-start align-items-center" style={{height:window.innerHeight}}>
    <NavbarComponent />
    {
      isMobile ? 
      <div className="d-flex flex-column w-100 h-100 justify-content-start align-items-center text-capitalize">
        <img alt={t('page not found')} src="/assets/images/page-not-found.png" style={{
          height: '20%',
          backgroundSize: 'cover',
        }}/>
        <h3 className="text-uppercase text-center mc-color fw-bold">
          {t('page not found')}
        </h3>
        <span className="text-capitalize text-center text-gray mt-2">
          {t("Sorry, this page isn't available!")}
        </span>
      </div>
      :
      <React.Fragment>
        <div className="d-flex flex-column container my-1">
          <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-1" style={{minHeight:`${selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
            <SelectPatientComponent condition={selectPatientOnMode === SELECT_PATIENT_MODE.CLINIC_PATIENT} showSelectedPatient={true}/>
            <SoftWareListComponent />
          </div>
        </div>
        <div className="row container-fluid h-100 mb-4">
          <div className="col-md-3 h-100 border-start border-top border-bottom p-0" style={{borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px"}}>
            <ResultAnalysisTable imageObject={imageObject} lengthOfRuler={lengthOfRuler} onSetHighLightIndicator={value=>setHighLightIndicator(value)}/>
          </div>
          <div className="col-md-9 h-100 border p-0" style={{borderTopRightRadius:"5px",borderBottomRightRadius:"5px"}}>
            <div className="d-flex flex-column w-100 h-100 p-0">
              <div className="row p-0 d-flex flex-grow-1"> 
                <div className="col-md-9 d-flex flex-column flex-grow-1 pe-0">
                  <div className="py-1 mc-background px-2 d-flex justify-content-between align-items-center" style={{borderBottomLeftRadius:"5px",borderBottomRightRadius:"5px"}}>
                    <div>
                      <span className="text-white fw-bold text-capitalize" style={{fontSize:FONT_SIZE_HEAD}}>{t('radiography')}</span>
                      {
                        imageObject && <span className="ms-2 text-white text-capitalize" style={{fontSize:FONT_SIZE}}>{`( ${t('X-ray')}: ${imageObject?.height*2}px x ${imageObject?.width*2}px )`}</span>
                      }
                    </div>
                    <div className="text-white d-flex">
                      <span className="text-white fw-bold text-capitalize" style={{fontSize:FONT_SIZE_HEAD}}>{t('mode')}:</span>
                      <span className="text-white fw-bold text-capitalize ms-2" style={{fontSize:FONT_SIZE_HEAD}}>{stageMode === 0?t('line analysis'):t('curve')}</span>
                    </div>
                  </div>
                  <div className="d-flex flex-grow-1 flex-row">
                    <ControlSection 
                      onZoomInHandle={onZoomInHandle}
                      onZoomOutHandle={onZoomOutHandle}
                      onChangeContrast={value=>handleChange('contrast', value)}
                      onChangeBrightness={value=>handleChange('brightness', value)}
                      onRotation={value=>setRotation(value)}
                      onSetCurrentMarkerPoint={point=>setCurrentMarkerPoint(point)}
                      currentMarkerPoint={currentMarkerPoint}
                      onSetMarkerPointList={markerPoints=>setMarkerPointList(markerPoints)}
                      stageMode={stageMode}
                      rotation={rotation}
                      imageObject={imageObject}
                      isDragImage={isDragImage}
                      onDragImage={value=>setIsDragImage(value)}
                    />
                    <div className="d-flex flex-column flex-grow-1 border-0">
                      <div className="d-flex justify-content-between align-items-center bg-white border-0 me-2">
                        <div className="d-flex flex-row justify-content-center align-items-center">
                          <span className="px-2 text-capitalize d-md-block d-none fw-bold mc-color" style={{fontSize:FONT_SIZE}}>
                            {t('consultation date')}:
                          </span>
                          {
                            consultationDate && <input 
                              style={{outline:"none",maxWidth:"120px",fontSize:FONT_SIZE}} 
                              type={"date"} 
                              className="border-0 rounded w-auto text-gray px-2"
                              value={consultationDate}
                              disabled
                            />
                          }
                        </div>
                        <div>
                          <button className={`btn ${stageMode===0 ? 'btn-outline-success':'btn-outline-primary'} p-0 border-0 my-1 ms-2`} type="button" onClick={()=>setStageMode(0)} disabled={stageMode===0}>
                            <span className="material-symbols-outlined mt-1 mx-1" style={{fontSize:"25px"}}>
                              polyline
                            </span>
                          </button>
                          <span className="vr mx-2"></span>
                          <button className={`btn ${stageMode===1 ? 'btn-outline-success':'btn-outline-primary'} p-0 border-0 my-1`} type="button" onClick={()=>setStageMode(1)} disabled={stageMode===1}>
                            <span className="material-symbols-outlined mt-1 mx-1" style={{fontSize:"25px"}}>
                              shape_line
                            </span>
                          </button>
                        </div>
                      </div>
                      <div 
                        className="h-100 d-flex flex-grow-1 border-0"
                        style={{outline:"none"}} 
                        ref={contentAnalysisRef} 
                        tabIndex={0}
                        onKeyDown={handleDragImageKeyDown} 
                        onKeyUp={handleDragImageKeyUp}
                      >
                        <Stage 
                          ref={stageRef} 
                          onWheel={handleWheel} 
                          height={heightStage} 
                          width={widthStage} 
                          className={`${isVisitableImageAnalysis?'':'bg-secondary'} ${(isDragImage && isGrab) ? 'cursor-grabbing' : (isDragImage && 'cursor-grab')} ${currentMarkerPoint && 'cursor-crosshair'} border-start border-end m-0 position-relative`} 
                          x={0} 
                          y={0} 
                          offsetX={0} 
                          offsetY={0}
                          onDragStart={()=>setIsGrab(true)}
                          onDragMove={()=>setIsGrab(true)}
                          onDragEnd={()=>setIsGrab(false)}
                          draggable={isDragImage}
                          rotation={rotation}
                          onMouseMove={handleMouseMove}
                          onClick={handleClickStage}
                        >
                          <Layer>
                            {
                              imageObject &&
                              <Image
                                ref={imageRef} 
                                image={imageObject}
                                filters={filterFuncs}
                                visible={isVisitableImageAnalysis}
                                {...filterVals}
                                offsetX={0}
                                offsetY={0}
                                x={0}
                                y={0}
                              />
                            }
                            {currentMarkerPoint && !isDragImage &&
                              <React.Fragment>
                                <Line
                                  ref={crosshairVerticalRef}
                                  x={crosshairPos.x}
                                  y={0}
                                  points={[0, -window.innerHeight, 0, window.innerHeight]}
                                  stroke="red"
                                  strokeWidth={1.1/scale}
                                />
                                <Line
                                  ref={crosshairHorizontalRef}
                                  x={0}
                                  y={crosshairPos.y}
                                  points={[-window.innerWidth, 0, window.innerWidth, 0]}
                                  stroke="red"
                                  strokeWidth={1.1/scale}
                                />
                                <Text 
                                  x={crosshairPos.x + 10}
                                  y={crosshairPos.y + 10}
                                  text={currentMarkerPoint}
                                  fill="#AAFF00"
                                  fontSize={15/scale}
                                  fontStyle={'bold'}
                                />
                              </React.Fragment>
                            }
                            {
                              markerPoints['C1'] && markerPoints['C2'] && imageObject &&
                              <Ruler key={markerPoints['C1'].x + markerPoints['C2'].y} c1={markerPoints['C1']} c2={markerPoints['C2']} scale={scale} lengthOfRuler={lengthOfRuler}/>
                            }
                            {
                              markerPoints && imageObject && drawCustomShape
                            }
                            {
                              markerPoints && imageObject && drawMultiCurves
                            }
                            {
                              markerPoints && imageObject && stageMode === 0 && drawLines
                            }
                            {
                              markerPoints && imageObject && highLightIndicator?.length>0 && stageMode === 0 && hightLightLines
                            }
                            {
                              markerPoints && imageObject && stageMode === 0 && drawMarkerPoints
                            }
                            {
                              markerPoints && imageObject && stageMode === 1 && drawHeightAndWidthCustomShape
                            }
                            {
                              markerPoints && imageObject && stageMode === 1 && drawCustomShapeHover
                            }
                            {
                              markerPoints && imageObject && stageMode === 1 && drawMarkerPointsCurve
                            }
                            {
                              markerPoints && imageObject && stageMode === 1 && drawMultiCurvesHover
                            }
                            {
                              markerPoints && imageObject && stageMode === 1 && drawMarkerPointsMultiCurve
                            }
                            {
                              markerPointToolTip 
                            }
                          </Layer>
                        </Stage>
                      </div>
                    </div>
                  </div>
                </div>
                <UtilitiesAnalysis col='col-md-3 ps-0' currentMarkerPoint={currentMarkerPoint} stageMode={stageMode}/>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    }
  </div>
}