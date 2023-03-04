import React from "react";
import { useTranslation } from "react-i18next";
import { FONT_SIZE } from "./Utility.jsx";

export default function RadioWithLabel(props) {
  const {t} = useTranslation();
  return <div className='d-flex mb-3 pb-1 border-bottom align-items-center flex-grow-1 flex-wrap' style={{minHeight:"35px"}}>
    <label className="text-capitalize mc-color fw-bold ms-2" style={props.style}>{props.label}:</label>
    {
      props.editMode ?
      <div className="d-flex flex-grow-1 flex-row ps-2 rounded btn-hover-bg">
        {
          props.arrayRadios.map((radio,index) => {
            return <div className="form-check me-3" key={index}>
              <input 
                className="form-check-input" 
                type="radio" 
                style={{cursor:"pointer"}}
                onKeyDown={e=>{if(e.key === "Enter") props.onUpdate(e) ; if(e.key === "Escape") props.onCancel()}} 
                value={radio} 
                onChange={e=>props.onChange(e.target.value)}
                checked={radio===props.value}
              />
              <label className="form-check-label ms-1" style={{fontSize:FONT_SIZE}}>
                {t(radio)}
              </label>
            </div>
          })
        }
      </div>
      :
      <div className="d-flex flex-grow-1 flex-row px-2 py-1 rounded rounded mc-background-color-white">
      {
        props.arrayRadios.map((radio,index) => {
          return <div className="form-check me-3" key={index}>
            <input 
              disabled={true}
              className="form-check-input" 
              type="radio" 
              style={{cursor:"pointer"}}
              value={radio} 
              checked={radio===props.value}
            />
            <label className="ms-1 text-gray text-capitalize" style={{fontSize:FONT_SIZE}}>
              {t(radio)}
            </label>
          </div>
        })
      }
    </div>
      // <span 
      //   className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" 
      //   style={{fontSize:FONT_SIZE,...props.styleSpan}}
      // >
      //   {props.result}
      // </span>
    }
  </div>
}