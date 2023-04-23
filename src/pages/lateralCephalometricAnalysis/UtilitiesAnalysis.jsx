import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Circle, Image, Layer, Stage } from "react-konva";
import { FONT_SIZE, FONT_SIZE_HEAD } from "../../common/Utility.jsx";

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
  }
}

export default function UtilitiesAnalysis(props){
  const {t} = useTranslation();
  const stageRef = useRef();
  const circleRef = useRef();
  const [heightStage,setHeightStage] = useState(0);
  const [widthStage,setWidthStage] = useState(0);

  useEffect(()=>{
    if(stageRef && (!heightStage || !widthStage)){
      setHeightStage(stageRef.current.clientHeight);
      setWidthStage(stageRef.current.clientWidth);
    }
  },[stageRef])

  const drawCircleNode = useMemo(()=>{
    if(props.currentMarkerPoint && MARKER_POINT_LIST[props.currentMarkerPoint]){
      return <Circle 
        ref={circleRef}
        x={MARKER_POINT_LIST[props.currentMarkerPoint].x}
        y={MARKER_POINT_LIST[props.currentMarkerPoint].y}
        fill="red"
        radius={4}
        opacity={1}
      />
    }else return null;
  },[props.currentMarkerPoint])

  
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
    <div style={{height:"50%"}}>
      <textarea className="form-control h-100 text-gray" placeholder={t('Enter note for analysis')} rows={5} style={{fontSize:FONT_SIZE}}/>
    </div>
    <div className="d-flex flex-grow-1 flex-column justify-content-start" ref={stageRef}>
      <div className="py-1 px-3 mc-pale-background" style={{borderBottomLeftRadius:"5px",borderBottomRightRadius:"5px"}}>
        <span className="text-white fw-bold text-capitalize" style={{fontSize:FONT_SIZE_HEAD}}>{t('image helper for analysis')}</span>
      </div>
      <Stage
        x={0}
        y={0} 
        height={heightStage}
        width={widthStage}
        offsetX={0}
        offsetY={0}
      >
        <Layer>
          <Image
            x={0}
            y={0}
            height={heightStage-10}
            width={widthStage-10}
            image={imageHelper} 
          />
          {props.currentMarkerPoint && drawCircleNode}
        </Layer>
      </Stage>
    </div>
  </div>
}