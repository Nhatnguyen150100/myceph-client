import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Circle, Group, Image, Layer, Stage, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { FONT_SIZE, FONT_SIZE_HEAD, SELECT_PATIENT_MODE } from "../../common/Utility.jsx";
import { setNoteAnalysis } from "../../redux/LateralCephSlice.jsx";
import { getModelCurve } from "../CalculatorToothMovement/CalculatorToothUtility.jsx";

const MARKER_POINT_LIST = {
  Co:{
    x: 10,
    y: 15
  },
  A:{
    x: 245,
    y: 191.5
  },
  B:{
    x: 234,
    y: 282.5
  },
  Cm:{
    x: 307,
    y: 178.5
  },
  D:{
    x: 230,
    y: 301.5
  },
  Gn:{
    x: 238,
    y: 311.5
  },
  L1A:{
    x: 223,
    y: 275.5
  },
  L1E:{
    x: 243,
    y: 239.5
  },
  Li: {
    x: 268,
    y: 264.5
  },
  Ls: {
    x: 276,
    y: 232.5
  },
  Me:{
    x: 226,
    y: 316.5
  },
  Mo:{
    x: 180,
    y: 227.5
  },
  N:{
    x: 246,
    y: 60.5
  },
  "Pog'": {
    x: 256,
    y: 313.5
  },
  U1E:{
    x: 247,
    y: 246.5
  },
  U1A:{
    x: 237,
    y: 199.5
  },
  S:{
    x: 98,
    y: 91.5
  },  
  Go:{
    x: 83,
    y: 231.5
  },
  Po:{
    x: 50,
    y: 140
  },
  Pt: {
    x: 136,
    y: 121
  },
  Or: {
    x: 221,
    y: 133
  },
  DC:{
    x: 83,
    y: 153
  },
  R1: {
    x: 139,
    y: 207
  },
  R2:{
    x: 81,
    y: 202
  },
  R3:{
    x: 121,
    y: 170
  },
  R4:{
    x: 115,
    y: 263
  },
  Ba:{
    x: 52,
    y: 167
  },
  PNS:{
    x: 142,
    y: 183
  },
  Pog:{
    x: 240,
    y: 302
  },
  Pm:{
    x: 236,
    y: 287
  },
  Prn:{
    x: 312,
    y: 162
  },
  ANS:{
    x: 253,
    y: 182
  },
  Mx6D:{
    x: 164,
    y: 217
  },
  Md6O:{
    x: 175,
    y: 225
  },
  PreM:{
    x: 216,
    y: 233
  },
  TNS:{
    x: 225,
    y: 179
  },
  UNS:{
    x: 229,
    y: 213
  },
  Pr: {
    x: 245,
    y: 213
  },
  U1L:{
    x: 229,
    y: 213
  },
  U1R:{
    x: 245,
    y: 213
  },
  L1L:{
    x: 227,
    y: 251
  },
  L1R:{
    x: 237,
    y: 259
  },
  IdL:{
    x: 227,
    y: 251
  },
  Id:{
    x: 237,
    y: 259
  },
  UP_M1:{
    x: 175,
    y: 190
  },
  UP_M2:{
    x: 178,
    y: 202
  },
  UMR:{
    x: 187,
    y: 192
  },
  UP_M3:{
    x: 186,
    y: 210
  },
  UP_M4:{
    x: 186,
    y: 218
  },
  UO:{
    x: 180,
    y: 227
  },
  UP_M5:{
    x: 175,
    y: 221
  },
  UP_M6:{
    x: 166,
    y: 224
  },
  UP_M7:{
    x: 170,
    y: 204
  },
  L_M1:{
    x: 184,
    y: 228
  },
  LO:{
    x: 193,
    y: 231
  },
  Md6M:{
    x: 193,
    y: 240
  },
  L_M2:{
    x: 187,
    y: 248
  },
  LMR:{
    x: 169,
    y: 265
  },
  L_M3:{
    x: 178,
    y: 250
  },
  L_M4:{
    x: 160,
    y: 260
  },
  L_M5:{
    x: 166,
    y: 244
  },
  L_M6:{
    x: 168,
    y: 231
  },
  sCo:{
    x: 168,
    y: 231
  },
  Pcc:{
    x: 168,
    y: 231
  },
  Ar:{
    x: 168,
    y: 231
  },
  Sg:{
    x: 168,
    y: 231
  },
  mGo:{
    x: 168,
    y: 231
  }
}

export default function UtilitiesAnalysis(props){
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const circleRef = useRef();
  const noteAnalysis = useSelector(state=>state.lateralCeph.noteAnalysis);
  const currentImageAnalysis = useSelector(state=>state.lateralCeph.currentImageAnalysis);
  const isVisitableHelper = useSelector(state=>state.lateralCeph.isVisitableHelper);
  const selectedCurve = useSelector(state=>state.curve.selectedCurve);
  const roleOfDoctorOnPatient = useSelector(state=>state.doctor.roleOfDoctorOnPatient);

  let roleDoctor = roleOfDoctorOnPatient === 'edit' ? true : false;

  const stageRef = useRef();

  const [note,setNote] = useState();

  useEffect(()=>{
    if(!noteAnalysis) setNote('')
    else setNote(noteAnalysis);
  },[noteAnalysis,currentImageAnalysis])

  const drawCircleNode = useMemo(()=>{
    if(props.currentMarkerPoint && props.currentMarkerPoint!=='C1' && props.currentMarkerPoint!=='C2' && isVisitableHelper && MARKER_POINT_LIST[props.currentMarkerPoint]){
      return <Circle 
        ref={circleRef}
        x={MARKER_POINT_LIST[props.currentMarkerPoint].x}
        y={MARKER_POINT_LIST[props.currentMarkerPoint].y}
        fill="red"
        radius={3}
        opacity={1}
      />
    }else return null;
  },[props.currentMarkerPoint,isVisitableHelper])

  const drawCircleCurve = useMemo(()=>{
    let listPoint = [];
    if(!selectedCurve) return null;
    const listTemp = Object.keys(getModelCurve(selectedCurve)?.markerPoints).filter(markerPoint => markerPoint !== props.currentMarkerPoint)
    for (const point of listTemp) {
      const circle = <Circle
        key={Math.random()}
        x={MARKER_POINT_LIST[point].x + 1}
        y={MARKER_POINT_LIST[point].y + 1}
        fill="red"
        radius={3}
        opacity={1}
      />
      listPoint.push(circle)
    }
    return listPoint
  },[selectedCurve,props.currentMarkerPoint])
  
  useEffect(()=>{
    if(!drawCircleNode) return;
    const circleNode = circleRef.current;
    const anim = new Konva.Animation((frame)=>{
      const opacity = Math.sin(frame.time * 2 * Math.PI / 1000) + 1 / 2;
      circleNode.opacity(opacity);
    },circleNode.getLayer());
    anim.start();
    return () => anim.stop();
  },[drawCircleNode])

  const imageHelper = new window.Image();
  imageHelper.src = '/assets/images/lateral_ceph_example.jpg'

  return <div className={`${props.col} border-start d-flex flex-column justify-content-start`}>
    <div className="py-1 px-3 mc-pale-background" style={{borderBottomLeftRadius:"5px",borderBottomRightRadius:"5px"}}>
      <span className="text-white fw-bold text-capitalize" style={{fontSize:FONT_SIZE_HEAD}}>{t('Note for analysis')}</span>
    </div>
    <div className="h-100">
      <textarea 
        disabled={!roleDoctor} 
        onMouseLeave={()=>dispatch(setNoteAnalysis(note))} 
        className="form-control h-100 text-gray" 
        value={note} 
        onChange={e=>setNote(e.target.value)} 
        placeholder={t('Enter note for analysis')} 
        rows={5} 
        style={{fontSize:FONT_SIZE}}
      />
    </div>
   
    {
      props.currentMarkerPoint && props.currentMarkerPoint!=='C1' && props.currentMarkerPoint!=='C2' && isVisitableHelper && 
      <div className="d-flex flex-grow-1 flex-column justify-content-start position-absolute end-0 bottom-0 mb-1 border me-1 bg-white">
        <Stage
          x={0}
          y={0} 
          ref={stageRef}
          height={346}
          width={360}
          offsetX={0}
          offsetY={0}
        >
          <Layer>
            <Image
              x={0}
              y={0}
              height={348}
              width={335}
              image={imageHelper} 
            />
            <Group>
              {drawCircleNode}
              {
                props.currentMarkerPoint && MARKER_POINT_LIST[props.currentMarkerPoint] && 
                <Text
                  x={MARKER_POINT_LIST[props.currentMarkerPoint].x + 5}
                  y={MARKER_POINT_LIST[props.currentMarkerPoint].y + 5}
                  visible={props.stageMode === 1 && getModelCurve(selectedCurve)?.markerPoints[props.currentMarkerPoint].isShow}
                  fill="red"
                  text={props.currentMarkerPoint}
                  fontSize={10}
                />
              }
              {
                props.stageMode === 1 && props.currentMarkerPoint && drawCircleCurve
              }
            </Group>
          </Layer>
        </Stage>
      </div>
    }
  </div>
}