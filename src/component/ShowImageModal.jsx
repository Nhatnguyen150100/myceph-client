import React, { useEffect, useRef, useState } from "react";
import * as bootstrap from 'bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { setCurrentImage } from "../redux/LibraryImageSlice.jsx";
import { useTranslation } from "react-i18next";
import { Image, Layer, Rect, Stage } from "react-konva";
import Konva from "konva";
import { Slider } from "@mui/material";
import { toast } from "react-toastify";
import IconButtonComponent from "../common/IconButtonComponent.jsx";
import { FONT_SIZE, settingForImage } from "../common/Utility.jsx";

const filterMap = {
  contrast: Konva.Filters.Contrast,
  brightness: Konva.Filters.Brighten
}

const stagePos = {x:0, y: 0}

const WIDTH = 30;
const HEIGHT = 30;

export default function ShowImageModal(props) {
  const imageModalRef = useRef();
  const imageModal = useRef();
  const stageRef = useRef();
  const imageRef = useRef();
  const contentModelRef = useRef();

  const [filtersMap, setFiltersMap] = useState(new Map());
  const [openGrid,setOpenGrid] = useState(false);

  const [imageObject,setimageObject] = useState(null);
  const [isGrab,setIsGrab] = useState(false);
  const [stateImage,setStateImage] = useState({
    isDragging: false,
    x: 0,
    y: 0,
  });

  const currentImage = useSelector(state=>state.libraryImage.currentImage);
  const dispatch = useDispatch();
  const {t} = useTranslation();

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
    imageModal.current = new bootstrap.Modal(imageModalRef.current, {});
  }, [])

  useEffect(() => {
    if (currentImage){
      const stage = stageRef.current;
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });
      stage.batchDraw();
      let image = new window.Image();
      image.src = currentImage;
      image.setAttribute("crossOrigin","anonymous");
      image.onload = () => {
        if (image.width > 0 && image.height > 0) {
          const scale = image.height/(window.innerHeight-50-(105*2));
          image.width = image.width/scale;
          image.height = image.height/scale;
          setimageObject(image);
        } else {
          toast.error(t('Error loading image'));
        }
      };
    }else imageModal.current.hide();
  }, [currentImage])

  useEffect(()=>{
    if(imageObject){
      applyCache();
      imageModal.current.show();
    } 
  },[imageObject])

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
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
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
  }

  const onSetOldPositionHandle = () => {
    const image = imageRef.current;
    const stage = stageRef.current;
    image.position({x: 0, y: 0});
    stage.scale({x: 1, y: 1});
    stage.position({ x: 0, y: 0 });
  }

  return <div className="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" ref={imageModalRef} style={{height:window.innerHeight-50}}>
    <div className="modal-dialog modal-dialog-centered modal-xl justify-content-center ">
      <div className="modal-content" ref={contentModelRef}>
        <div className="modal-header py-2 px-3 d-flex justify-content-between">
          <span className="text-uppercase fw-bold mc-color ms-2">{t('preview image')}</span>
          <div className="dropdown">
            <button className="btn btn-outline-secondary d-flex justify-content-start align-items-center px-2 py-0 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="transform-hover material-symbols-outlined mt-1 me-1" style={{fontSize:"25px"}}>
                contact_support
              </span>
              <span className="text-uppercase" style={{fontSize:FONT_SIZE}}>{t('guide')}</span>
            </button>
            <ul className="dropdown-menu" style={{minWidth:"250px"}}>
              <span className="fw-bold mc-color text-uppercase fs-6 text-center d-flex justify-content-center">{t('Shortcut list')}</span>
              <table className="table table-sm mb-0">
                <tbody>
                  <tr>
                    <td className="fw-bold">
                      {t('Move view zone')}
                    </td>
                    <td>
                      {t('Drag mouse using left button')}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">
                      {t('Zoom in/Zoom out')}
                    </td>
                    <td>
                      {t('Move pointer to the focus position then scroll up or down')}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-danger">
                      {t('Grid status')}
                    </td>
                    <td>
                      {t('can not drag image while grid is open')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </ul>
          </div>
        </div>
        <div className="modal-body position-ralative h-100 w-100 d-flex justify-content-center align-items-center py-0">
          <div className="position-absolute rounded top-0 start-0 d-flex flex-row justify-content-center align-items-center" style={{zIndex:"3", backgroundColor:"#E8E8E8"}}>
            <IconButtonComponent 
              className="btn-outline-info border-0 p-0 ms-1" 
              icon="zoom_in" 
              FONT_SIZE_ICON={"25px"} 
              title={t("zoom in")}
              onClick={e=>onZoomInHandle()}
            />
            <IconButtonComponent 
              className="btn-outline-info border-0 p-0 ms-1" 
              icon="zoom_out" 
              FONT_SIZE_ICON={"25px"} 
              title={t("zoom out")}
              onClick={e=>onZoomOutHandle()}
            />
            <IconButtonComponent 
              className="btn-outline-info border-0 p-0 ms-1" 
              icon="reset_image" 
              FONT_SIZE_ICON={"25px"} 
              title={t("reset position image")}
              onClick={e=>onSetOldPositionHandle()}
            />
            <div className="dropdown ms-1">
              <button className="btn btn-outline-info border-0 p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span className="transform-hover material-symbols-outlined mt-1 mx-1" style={{fontSize:"25px"}} title={t('contrast')}>
                  contrast
                </span>
              </button>
              <ul className="dropdown-menu">
                <Slider
                  className="py-1"
                  size="small"
                  defaultValue={0}
                  min={-100}
                  max={100}
                  step={10}
                  marks
                  onChange={e=>handleChange('contrast', e.target.value)}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                />
              </ul>
            </div>
            <div className="dropdown mx-1">
              <button className="btn btn-outline-info border-0 p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span className="transform-hover material-symbols-outlined mt-1 mx-1" style={{fontSize:"25px"}} title={t('brightness')}>
                  brightness_medium
                </span>
              </button>
              <ul className="dropdown-menu">
                <Slider
                  className="py-1"
                  size="small"
                  defaultValue={0}
                  min={-1}
                  max={1}
                  step={0.1}
                  marks
                  onChange={e=>handleChange('brightness', e.target.value)}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                />
              </ul>
            </div>
            <IconButtonComponent 
              className={`${openGrid?'btn-info':'btn-outline-info'} border-0 p-0 ms-1`} 
              icon="grid_4x4" 
              FONT_SIZE_ICON={"25px"} 
              title={t("open grid")}
              onClick={e=>setOpenGrid(openGrid?false:true)}
            />
            <a href={`${settingForImage('/fl_attachment',currentImage)}`}>
              <IconButtonComponent 
                className='btn-outline-info border-0 p-0 ms-1' 
                icon="download" 
                FONT_SIZE_ICON={"25px"} 
                title={t("down image")}
              />
            </a>
          </div>
          <Stage 
            ref={stageRef} 
            onWheel={handleWheel} 
            height={window.innerHeight-50-(110*2)} 
            width={contentModelRef.current?.clientWidth-2} 
            className={`${isGrab && 'cursor-grabbing'} border-start border-end m-0`} 
            x={0} 
            y={0} 
            offsetX={0} 
            offsetY={0}
          >
            <Layer>
              {imageObject &&
               <Image
                ref={imageRef} 
                image={imageObject}
                filters={filterFuncs}
                {...filterVals}
                offsetX={-((contentModelRef.current?.clientWidth-2)/2-imageObject.width/2)}
                x={stateImage.x}
                y={stateImage.y}
                draggable
                onMouseDown={()=>setIsGrab(true)}
                onDragStart={()=>setStateImage(true,stateImage.x,stateImage.y)}
                onDragEnd={(e) => {
                  setStateImage({
                    isDragging: false,
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
                onMouseUp={(e) =>setIsGrab(false)}
              />
              }
              {openGrid && gridComponents}
            </Layer>
          </Stage>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={e=>dispatch(setCurrentImage(null))}>Close</button>
        </div>
      </div>
    </div>
  </div >
}