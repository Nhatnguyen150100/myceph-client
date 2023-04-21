import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Arrow, Circle, Group, Image, Label, Layer, Line, Rect, Stage, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { findNextObject, FONT_SIZE, FONT_SIZE_HEAD, getKeyByNameValue, SELECT_PATIENT_MODE, SOFT_WARE_LIST } from "../../common/Utility.jsx";
import NavbarComponent from "../../components/NavbarComponent.jsx";
import SelectPatientComponent from "../../components/SelectPatientComponent.jsx";
import SoftWareListComponent from "../../components/SoftWareListComponent.jsx";
import { setAppName } from "../../redux/GeneralSlice.jsx";
import { setLengthOfRuler, setMarkerPoints, setScaleImage } from "../../redux/LateralCephSlice.jsx";
import ControlSection from "./ControlSection.jsx";
import CustomIndicator from "./CustomIndicator.jsx";
import { ANALYSIS } from "./LateralCephalometricUtility.jsx";
import ResultAnalysisTable from "./ResultAnalysisTable.jsx";
import Ruler from "./Ruler.jsx";

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
  const currentAnalysis = useSelector(state=>state.lateralCeph.currentAnalysis);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const markerPoints = useSelector(state=>state.lateralCeph.markerPoints);
  const currentImageAnalysis = useSelector(state=>state.lateralCeph.currentImageAnalysis);
  const scaleImage = useSelector(state=>state.lateralCeph.scaleImage);
  const lengthOfRuler = useSelector(state=>state.lateralCeph.lengthOfRuler);
  const [prevPatient,setPrevPatient] = useState(currentPatient?.id);

  const stageRef = useRef();
  const imageRef = useRef();
  const contentAnalysisRef = useRef();

  const [markerPointList,setMarkerPointList] = useState(markerPoints);
  const [filtersMap, setFiltersMap] = useState(new Map());
  const [openGrid,setOpenGrid] = useState(false);

  const [imageObject,setImageObject] = useState(null);
  const [isGrab,setIsGrab] = useState(false);
  const [isDragImage,setIsDragImage] = useState(false);
  const [heightStage,setHeightStage] = useState(0);
  const [widthStage,setWidthStage] = useState(0);
  const [rotation,setRotation] = useState(0);
  const [scale,setScale] = useState(1);

  const [crosshairPos, setCrosshairPos] = useState({ x: 0, y: 0 });
  const [currentMarkerPoint, setCurrentMarkerPoint] = useState();

  const crosshairVerticalRef = useRef();
  const crosshairHorizontalRef = useRef();
  

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
    if (currentImageAnalysis && prevPatient===currentPatient?.id){
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
  }, [currentImageAnalysis,scaleImage,currentPatient])

  useEffect(()=>{
    if(imageObject){
      applyCache();
    } 
  },[imageObject])

  const onAddMarkerPoint = () => {
    if(currentMarkerPoint){
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
      const nextPoint = findNextObject(currentMarkerPoint,ANALYSIS[getKeyByNameValue(ANALYSIS,currentAnalysis)]?.markerPoints,markerPoints);
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

  const drawLines = useMemo(()=>{
    let linesArray = [];
    for (const lines of ANALYSIS[getKeyByNameValue(ANALYSIS,currentAnalysis)]?.lines) {
      if(markerPoints[lines[0]] && markerPoints[lines[1]]){
        linesArray.push(
          <Line
            key={markerPoints[lines[0]].x+markerPoints[lines[0]].y+markerPoints[lines[1]].x+markerPoints[lines[1]].y+Math.random(1,1000)}
            x={0}
            y={0}
            points={[markerPoints[lines[0]].x, markerPoints[lines[0]].y, markerPoints[lines[1]].x, markerPoints[lines[1]].y]}
            stroke="#8B008B"
            strokeWidth={1.5/scale}
            opacity={0.8}
          />
        )
      }
    }
    return linesArray;
  },[markerPoints,currentAnalysis,scale])

  const drawMarkerPoints = useMemo(()=>{
    let circleWithTextArray = [];
    for (const key of Object.keys(markerPointList)) {
      if(markerPointList[key] && ANALYSIS[getKeyByNameValue(ANALYSIS,currentAnalysis)]?.markerPoints.find(point => point === key)){
        circleWithTextArray.push(
          <Group>
            <Circle
              key={markerPointList[key].x+markerPointList[key].y}
              fill={'red'}
              draggable={true}
              opacity={1}
              radius={4/scale}
              x={markerPointList[key].x}
              y={markerPointList[key].y}
              onDragStart={(event) => {
                const circle = event.target;
                circle.fill('#27a9f1');
              }}
              onMouseOver={(event) => {
                const circle = event.target;
                circle.fill('#27a9f1');
              }}
              onMouseLeave={(event) => {
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
  },[markerPointList,currentAnalysis,scale])

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
        <ResultAnalysisTable lengthOfRuler={lengthOfRuler}/>
      </div>
      <div className="col-md-9 h-100 border p-0" style={{borderTopRightRadius:"5px",borderBottomRightRadius:"5px"}}>
        <div className="d-flex flex-column w-100 h-100 p-0">
          <div className="row p-0 d-flex flex-grow-1">
            <div className="col-md-9 d-flex flex-column flex-grow-1 pe-0">
              <div className="py-1 mc-background px-2" style={{borderBottomLeftRadius:"5px",borderBottomRightRadius:"5px"}}>
                <span className="text-white fw-bold text-capitalize" style={{fontSize:FONT_SIZE_HEAD}}>{t('radiography')}</span>
                {
                  imageObject && <span className="ms-2 text-white text-capitalize" style={{fontSize:FONT_SIZE}}>( X-ray: {imageObject?.height*2}px x {imageObject?.width*2}px )</span>
                }
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
                  rotation={rotation}
                  imageObject={imageObject}
                  isDragImage={isDragImage}
                  onDragImage={value=>setIsDragImage(value)}
                />
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
                    className={`${(isDragImage && isGrab) ? 'cursor-grabbing' : (isDragImage && 'cursor-grab')} ${currentMarkerPoint && 'cursor-crosshair'} border-start border-end m-0 position-relative`} 
                    x={0} 
                    y={0} 
                    offsetX={0} 
                    offsetY={0}
                    onDragStart={()=>setIsGrab(true)}
                    onDragMove={()=>setIsGrab(true)}
                    onDragEnd={()=>setIsGrab(false)}
                    draggable={isDragImage}
                    onMouseMove={handleMouseMove}
                    onClick={onAddMarkerPoint}
                  >
                    <Layer>
                      {
                        imageObject &&
                        <Image
                          ref={imageRef} 
                          image={imageObject}
                          filters={filterFuncs}
                          {...filterVals}
                          offsetX={0}
                          offsetY={0}
                          x={0}
                          y={0}
                          rotation={rotation}
                        />
                      }
                      {openGrid && gridComponents}
                      {currentMarkerPoint && !isDragImage &&
                        <React.Fragment>
                          <Line
                            ref={crosshairVerticalRef}
                            x={crosshairPos.x}
                            y={0}
                            points={[0, -window.innerHeight, 0, window.innerHeight]}
                            stroke="red"
                            strokeWidth={1/scale}
                            opacity={1/scale}
                          />
                          <Line
                            ref={crosshairHorizontalRef}
                            x={0}
                            y={crosshairPos.y}
                            points={[-window.innerWidth, 0, window.innerWidth, 0]}
                            stroke="red"
                            strokeWidth={1/scale}
                            opacity={1/scale}
                          />
                        </React.Fragment>
                      }
                      {
                        currentMarkerPoint && !isDragImage &&
                        <Text 
                          x={crosshairPos.x + 10}
                          y={crosshairPos.y + 10}
                          text={currentMarkerPoint}
                          fill="#AAFF00"
                          fontSize={15/scale}
                          fontStyle={'bold'}
                        />
                      }
                      {
                        markerPoints['C1'] && markerPoints['C2'] && imageObject &&
                        <Ruler c1={markerPoints['C1']} c2={markerPoints['C2']} scale={scale} lengthOfRuler={lengthOfRuler}/>
                      }
                      {
                        markerPoints && imageObject && drawLines
                      }
                      {
                        markerPoints && imageObject && drawMarkerPoints
                      }
                    </Layer>
                  </Stage>
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