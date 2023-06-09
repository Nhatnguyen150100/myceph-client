import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { findNextObject, SELECT_PATIENT_MODE, SOFT_WARE_LIST } from '../../common/Utility.jsx'
import NavbarComponent from '../../components/NavbarComponent.jsx'
import SelectPatientComponent from '../../components/SelectPatientComponent.jsx'
import SoftWareListComponent from '../../components/SoftWareListComponent.jsx'
import { setAppName } from '../../redux/GeneralSlice.jsx'
import { Stage, Layer, Rect, Transformer, Line, Circle, Shape, Ring, RegularPolygon, Group, Text } from 'react-konva';
import { setMarkerPointsOfCurve, setSelectedCurve } from '../../redux/CurveSlice.jsx'
import { UPPER_JAW_BONE_CURVE } from './CalculatorToothUtility.jsx'
import { useMemo } from 'react'

const Square = (props) => {
  const selectedCurve = useSelector(state=>state.curve.selectedCurve);

  const dispatch = useDispatch();
  const drawCustomShape = useMemo(()=>{
    if(props.markerPointList?.PNS && props.markerPointList?.ANS && props.markerPointList?.TNS && props.markerPointList?.UNS && props.markerPointList?.Pr){
      return <Shape
        strokeWidth={3}
        height={250}
        width={300}
        onMouseDown={() => {
          if(selectedCurve === props.curveModel.name){
            dispatch(setSelectedCurve(null))
          }else dispatch(setSelectedCurve(props.curveModel.name))
        }}
        onMouseOver={(event) => {
          const shape = event.target;
          shape.fill('#27a9f1');
        }}
        onMouseOut={event => {
          const shape = event.target;
          shape.fill(null)
        }}
        sceneFunc={(context,shape) => {
          context.beginPath();
          context.moveTo(props.markerPointList[props.curveModel.controlPoints[0].startPoint].x, props.markerPointList[props.curveModel.controlPoints[0].startPoint].y);
          props.curveModel.controlPoints.forEach((value) => {
            context.bezierCurveTo(
              value.controlPoint1.positionDefault(props.markerPointList).x,
              value.controlPoint1.positionDefault(props.markerPointList).y,
              value.controlPoint2.positionDefault(props.markerPointList).x,
              value.controlPoint2.positionDefault(props.markerPointList).y,
              props.markerPointList[value.endPoint].x,
              props.markerPointList[value.endPoint].y,
            )
          })
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        opacity={0.4}
        stroke="#ffc0eb"
        hitStrokeWidth={5}
      />
    }else return null;
  },[props.markerPointList,selectedCurve])

  const customShape = useMemo(()=>{
    let customShapeArray = [];
    if(props.markerPointList?.PNS && props.markerPointList?.ANS && props.markerPointList?.TNS && props.markerPointList?.UNS){
      props.curveModel.controlPoints.map((value,index) => {
        customShapeArray.push(
          <React.Fragment key={index}>
            <Line 
              x={0}
              y={0}
              lineCap="round"
              lineJoin="round"
              visible={selectedCurve !=null && true}
              dash={[10, 10, 0.2, 10]}
              points={[
                props.markerPointList[value.startPoint].x, 
                props.markerPointList[value.startPoint].y, 
                value.controlPoint1.positionDefault(props.markerPointList).x,
                value.controlPoint1.positionDefault(props.markerPointList).y
              ]}
              stroke="#00FF7F"
              strokeWidth={2}
              opacity={0.8}
            />
            <Line 
              x={0}
              y={0}
              lineCap="round"
              lineJoin="round"
              visible={selectedCurve !=null && true}
              dash={[10, 10, 0.2, 10]}
              points={[
                props.markerPointList[value.endPoint].x, 
                props.markerPointList[value.endPoint].y, 
                value.controlPoint2.positionDefault(props.markerPointList).x,
                value.controlPoint2.positionDefault(props.markerPointList).y
              ]}
              stroke="#00FF7F"
              strokeWidth={2}
              opacity={0.8}
            />
            <Circle 
              x={value.controlPoint1.positionDefault(props.markerPointList).x}
              y={value.controlPoint1.positionDefault(props.markerPointList).y}
              radius={5}
              fill="blue" 
              onMouseOver={(event) => {
                const circle = event.target;
                circle.fill('#ffad00')
              }}
              onMouseLeave={event => {
                const circle = event.target;
                circle.fill('blue')
              }}
              visible={selectedCurve !=null && true}
              draggable
              onDragEnd={(e) =>{
                const newMarkerPoints = Object.assign({}, props.markerPointList);
                newMarkerPoints[value.controlPoint1.name] = {
                  name: value.controlPoint1.name,
                  x: e.target.x(),
                  y: e.target.y()
                };
                dispatch(setMarkerPointsOfCurve(newMarkerPoints))
                props.setMarkerPointList(newMarkerPoints);
              }}
              onDragMove={(e) =>{
                const newMarkerPoints = Object.assign({}, props.markerPointList);
                newMarkerPoints[value.controlPoint1.name] = {
                  name: value.controlPoint1.name,
                  x: e.target.x(),
                  y: e.target.y()
                };
                dispatch(setMarkerPointsOfCurve(newMarkerPoints))
                props.setMarkerPointList(newMarkerPoints);
              }}
            />
            <Circle 
              x={value.controlPoint2.positionDefault(props.markerPointList).x}
              y={value.controlPoint2.positionDefault(props.markerPointList).y}
              radius={5}
              fill="blue" 
              onMouseOver={(event) => {
                const circle = event.target;
                circle.fill('#ffad00')
              }}
              onMouseLeave={event => {
                const circle = event.target;
                circle.fill('blue')
              }}
              visible={selectedCurve !=null && true}
              draggable
              onDragEnd={(e) =>{
                const newMarkerPoints = Object.assign({}, props.markerPointList);
                newMarkerPoints[value.controlPoint2.name] = {
                  name: value.controlPoint2.name,
                  x: e.target.x(),
                  y: e.target.y()
                };
                dispatch(setMarkerPointsOfCurve(newMarkerPoints))
                props.setMarkerPointList(newMarkerPoints);
              }}
              onDragMove={(e) =>{
                const newMarkerPoints = Object.assign({}, props.markerPointList);
                newMarkerPoints[value.controlPoint2.name] = {
                  name: value.controlPoint2.name,
                  x: e.target.x(),
                  y: e.target.y()
                };
                dispatch(setMarkerPointsOfCurve(newMarkerPoints))
                props.setMarkerPointList(newMarkerPoints);
              }}
            />
            <Group visible={selectedCurve !=null && true}>
              <RegularPolygon
                sides={4}
                x={props.markerPointList[value.startPoint].x}
                y={props.markerPointList[value.startPoint].y}
                fill="red" 
                draggable={selectedCurve}
                onMouseOver={(event) => {
                  const regularPolygon = event.target;
                  regularPolygon.fill('#ffad00')
                }}
                onMouseLeave={event => {
                  const regularPolygon = event.target;
                  regularPolygon.fill('red')
                }}
                onDragEnd={(e) =>{
                  const newMarkerPoints = Object.assign({}, props.markerPointList);
                  newMarkerPoints[value.startPoint] = {
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  dispatch(setMarkerPointsOfCurve(newMarkerPoints))
                  props.setMarkerPointList(newMarkerPoints);
                }}
                onDragMove={(e) =>{
                  const newMarkerPoints = Object.assign({}, props.markerPointList);
                  newMarkerPoints[value.startPoint] = {
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  dispatch(setMarkerPointsOfCurve(newMarkerPoints))
                  props.setMarkerPointList(newMarkerPoints);
                }}
              />
              <Text 
                x={props.markerPointList[value.startPoint].x + 5}
                y={props.markerPointList[value.startPoint].y + 5}
                draggable={false}
                text={value.startPoint}
                fill="#00FF7F"
                fontSize={13}
              />
            </Group> 
            <Group visible={selectedCurve !=null && true}>
              <RegularPolygon
                sides={4}
                x={props.markerPointList[value.endPoint].x}
                y={props.markerPointList[value.endPoint].y}
                radius={6}
                fill="red"
                onMouseOver={(event) => {
                  const regularPolygon = event.target;
                  regularPolygon.fill('#ffad00')
                }}
                onMouseLeave={event => {
                  const regularPolygon = event.target;
                  regularPolygon.fill('red')
                }} 
                draggable={selectedCurve}
                onDragEnd={(e) =>{
                  const newMarkerPoints = Object.assign({}, props.markerPointList);
                  newMarkerPoints[value.endPoint] = {
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  dispatch(setMarkerPointsOfCurve(newMarkerPoints))
                  props.setMarkerPointList(newMarkerPoints);
                }}
                onDragMove={(e) =>{
                  const newMarkerPoints = Object.assign({}, props.markerPointList);
                  newMarkerPoints[value.endPoint] = {
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  dispatch(setMarkerPointsOfCurve(newMarkerPoints))
                  props.setMarkerPointList(newMarkerPoints);
                }}
              />
              <Text 
                x={props.markerPointList[value.endPoint].x + 5}
                y={props.markerPointList[value.endPoint].y + 5}
                draggable={false}
                text={value.endPoint}
                fill="#00FF7F"
                fontSize={13}
              />
            </Group>
          </React.Fragment>
        ) 
      })
    }
    return customShapeArray
  },[props.markerPointList,selectedCurve])

  return (
    <>
      {drawCustomShape}
      {customShape}
    </>
  );
};

export default function CalculatorToothMovement(props){
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {t} = useTranslation();
  const doctor = useSelector(state=>state.doctor);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const markerPointsOfCurve = useSelector(state=>state.curve.markerPointsOfCurve);

  const [markerPointList,setMarkerPointList] = useState(markerPointsOfCurve);
  const [currentMarkerPoint, setCurrentMarkerPoint] = useState();
  
  const stageRef = useRef(null);

  useEffect(()=>{
    if(!doctor.data?.id) nav('/login');
    dispatch(setAppName(`Myceph - ${t(SOFT_WARE_LIST.CALCULATOR_TOOTH_MOVEMENT)}`));
  },[])

  const onAddMarkerPoint = event => {
    if (event.target === stageRef.current) {
      dispatch(setSelectedCurve(null))
    }
    if(currentMarkerPoint){
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };
      const newMarkerPoints = {...markerPointsOfCurve,...{
        [currentMarkerPoint]: {
          ...UPPER_JAW_BONE_CURVE.markerPoints[currentMarkerPoint],
          x: mousePointTo.x,
          y: mousePointTo.y
        }
      }}
      dispatch(setMarkerPointsOfCurve(newMarkerPoints));
      setMarkerPointList(newMarkerPoints);
      const nextPoint = findNextObject(currentMarkerPoint,Object.keys(UPPER_JAW_BONE_CURVE.markerPoints),markerPointsOfCurve);
      setCurrentMarkerPoint(nextPoint);
    }
  }

  return <div className="d-flex flex-column justify-content-start align-items-center" style={{height:window.innerHeight}}>
    <NavbarComponent />
    <div className="d-flex flex-column container my-1">
      <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-1" style={{minHeight:`${selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
        <SelectPatientComponent condition={selectPatientOnMode === SELECT_PATIENT_MODE.CLINIC_PATIENT} showSelectedPatient={true}/>
        <SoftWareListComponent />
      </div>
    </div>
    <div className='container-fluid h-100'>
      calculator tooth
      <button type='button' className='btn btn-primary p-1' onClick={()=>setCurrentMarkerPoint('PNS')}>
        start
      </button>
      <Stage 
        ref={stageRef}
        width={window.innerWidth} 
        height={window.innerHeight} 
        onClick={onAddMarkerPoint}
      >
        <Layer>
          <Square markerPointList={markerPointList} curveModel={UPPER_JAW_BONE_CURVE} setMarkerPointList={points=>setMarkerPointList(points)}/>
        </Layer>
      </Stage>
    </div>
  </div>
}