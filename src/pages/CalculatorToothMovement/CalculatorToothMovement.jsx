import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SELECT_PATIENT_MODE, SOFT_WARE_LIST } from '../../common/Utility.jsx'
import NavbarComponent from '../../components/NavbarComponent.jsx'
import SelectPatientComponent from '../../components/SelectPatientComponent.jsx'
import SoftWareListComponent from '../../components/SoftWareListComponent.jsx'
import { setAppName } from '../../redux/GeneralSlice.jsx'
import { Stage, Layer, Rect, Transformer, Line, Circle, Shape, Ring, RegularPolygon } from 'react-konva';
import CustomShape from './CustomShape.jsx'

const Square = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const transformerRef = useRef(null);
  const shapeRef = useRef(null);
  const shapeRef2 = useRef(null);
  const curveShapeRef = useRef(null);

  const [ANSPoint,setANSPoint] = useState({
    x: 50,
    y: 50
  })

  const [PNSPoint,setPNSPoint] = useState({
    x: 350,
    y: 350
  })

  const [PrPoint,setPrPoint] = useState({
    x: 270,
    y: 160
  })

  const [CrPoint,setCrPoint] = useState({
    x: 190,
    y: 380
  })


  
  const [ANSPoint2,setANSPoint2] = useState({
    x: 350,
    y: 250
  })

  const [PrPoint2,setPrPoint2] = useState({
    x: 180,
    y: 30
  })

  const [CrPoint2,setCrPoint2] = useState({
    x: 290,
    y: 180
  })

  const [ANSPoint3,setANSPoint3] = useState({
    x: 40,
    y: 150
  })

  const [PrPoint3,setPrPoint3] = useState({
    x: 170,
    y: 110
  })

  const [CrPoint3,setCrPoint3] = useState({
    x: 390,
    y: 180
  })


  const [points, setPoints] = useState([
    50, 50, // điểm đầu
    100, 50, // điểm điều khiển 1
    150, 150, // điểm điều khiển 2
    200, 150 // điểm cuối
  ]);

  const handleDrag = (i, x, y) => {
    const newPoints = [...points];
    newPoints[i] = x;
    newPoints[i + 1] = y;
    setPoints(newPoints);
  };

  const renderControlPoints = () => {
    const controlPoints = [];
    for (let i = 0; i < 4; i++) {
      controlPoints.push(
        <Circle
          key={i}
          x={points[i * 2]}
          y={points[i * 2 + 1]}
          radius={5}
          fill="blue" 
          draggable
          onDragMove={(e) =>
            handleDrag(i * 2, e.target.x(), e.target.y())
          }
        />
      );
    }
    return controlPoints;
  };

  useEffect(()=>{
    if (isSelected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  },[isSelected])

  const handleSelect = () => {
    setIsSelected(true);
  };

  const handleDeselect = () => {
    setIsSelected(false);
  };

  const handleDragEnd = e => {
    setPosition({ x: e.target.x(), y: e.target.y() });
  };

  const handleTransform = e => {
    const node = transformerRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // limit scale
    if (scaleX < 0.1 || scaleY < 0.1) {
      return;
    }

    setPosition({ x: node.x(), y: node.y() });
    setRotation(node.rotation());
    setScale({ x: scaleX, y: scaleY });
  };

  return (
    <>
      <Shape
        strokeWidth={3}
        ref={curveShapeRef}
        sceneFunc={(context,shape) => {
          context.beginPath();
          context.moveTo(ANSPoint.x, ANSPoint.y);
          context.bezierCurveTo(
            PrPoint.x,
            PrPoint.y,
            CrPoint.x,
            CrPoint.y,
            PNSPoint.x,
            PNSPoint.y,
          )
          context.fillStrokeShape(shape);
          context.closePath();
        }}
        onClick={()=>alert("click shape")}
        fill="#00D2FF"
        stroke="black"
      />
      <RegularPolygon
        sides={4}
        x={ANSPoint.x}
        y={ANSPoint.y}
        radius={5}
        fill="red" 
        draggable
        onDragMove={(e) =>
          setANSPoint({
            x: e.target.x(),
            y: e.target.y()
          })
        }
      />
      <Circle 
        x={ANSPoint2.x}
        y={ANSPoint2.y}
        radius={5}
        fill="red" 
        draggable
        onDragMove={(e) =>
          setANSPoint2({
            x: e.target.x(),
            y: e.target.y()
          })
        }
      />
            <Circle 
        x={ANSPoint3.x}
        y={ANSPoint3.y}
        radius={5}
        fill="red" 
        draggable
        onDragMove={(e) =>
          setANSPoint3({
            x: e.target.x(),
            y: e.target.y()
          })
        }
      />
      <Circle 
        x={PrPoint.x}
        y={PrPoint.y}
        radius={5}
        fill="blue" 
        draggable
        onDragMove={(e) =>
          setPrPoint({
            x: e.target.x(),
            y: e.target.y()
          })
        }
      />
      <Circle 
        x={CrPoint.x}
        y={CrPoint.y}
        radius={5}
        fill="blue" 
        draggable
        onDragMove={(e) =>
          setCrPoint({
            x: e.target.x(),
            y: e.target.y()
          })
        }
      />
      <RegularPolygon
        sides={4}
        x={PNSPoint.x}
        y={PNSPoint.y}
        radius={5}
        fill="red" 
        draggable
        onDragMove={(e) =>
          setPNSPoint({
            x: e.target.x(),
            y: e.target.y()
          })
        }
      />
            <Circle 
        x={PrPoint2.x}
        y={PrPoint2.y}
        radius={5}
        fill="blue" 
        draggable
        onDragMove={(e) =>
          setPrPoint2({
            x: e.target.x(),
            y: e.target.y()
          })
        }
      />
      <Circle 
        x={CrPoint2.x}
        y={CrPoint2.y}
        radius={5}
        fill="blue" 
        draggable
        onDragMove={(e) =>
          setCrPoint2({
            x: e.target.x(),
            y: e.target.y()
          })
        }
      />
            <Circle 
        x={PrPoint3.x}
        y={PrPoint3.y}
        radius={5}
        fill="blue" 
        draggable
        onDragMove={(e) =>
          setPrPoint3({
            x: e.target.x(),
            y: e.target.y()
          })
        }
      />
      <Circle 
        x={CrPoint3.x}
        y={CrPoint3.y}
        radius={5}
        fill="blue" 
        draggable
        onDragMove={(e) =>
          setCrPoint3({
            x: e.target.x(),
            y: e.target.y()
          })
        }
      />
      {/* <Line
        points={[ANSPoint.x,ANSPoint.y,PrPoint.x,PrPoint.y]} 
        stroke="#8B008B"
        opacity={0.8}
        strokeWidth={3}
        lineJoin={'round'}
        dash={[33, 10]}
      /> */}
      {/* <Rect
        x={position.x}
        y={position.y}
        width={100}
        height={100}
        ref={shapeRef}
        fill="red"
        draggable
        onDragEnd={handleDragEnd}
        onClick={handleSelect}
        onTap={handleSelect}
        onDblClick={handleDeselect}
        onDblTap={handleDeselect}
        rotation={rotation}
        scaleX={scale.x}
        scaleY={scale.y}
      />
      <Rect
        x={position.x+320}
        y={position.y+20}
        width={100}
        height={100}
        ref={shapeRef2}
        fill="geen"
        draggable
        onDragEnd={handleDragEnd}
        onClick={handleSelect}
        onTap={handleSelect}
        onDblClick={handleDeselect}
        onDblTap={handleDeselect}
        rotation={rotation}
        scaleX={scale.x}
        scaleY={scale.y}
      /> */}
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
          onTransform={handleTransform}
        />
      )}
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

  useEffect(()=>{
    if(!doctor.data?.id) nav('/login');
    dispatch(setAppName(`Myceph - ${t(SOFT_WARE_LIST.CALCULATOR_TOOTH_MOVEMENT)}`));
  },[])

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
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Square />
        </Layer>
      </Stage>
    </div>
  </div>
}