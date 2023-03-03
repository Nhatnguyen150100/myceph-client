import React from "react";
import { FONT_SIZE } from "./Utility.jsx";

export default function SelectWithLabel(props){
  return <div className='d-flex mb-3 pb-1 border-bottom flex-grow-1'>
    <label className="text-capitalize mc-color fw-bold ms-2" style={props.style}>{props.label}:</label>
    {
      props.editMode ? 
      <select 
        className="text-gray border-0 rounded btn-hover-bg px-1 py-1 text-capitalize flex-grow-1" 
        onKeyDown={e=>{if(e.key === "Enter") props.onUpdate(e) ; if(e.key === "Escape") props.onCancel()}} 
        style={{outline:"none",fontSize:FONT_SIZE,...props.styleInput}} 
        value={props.value} 
        onChange={e=>props.onChange(e.target.value)}>
        {
          !props.value && <option selected disabled={true}>no data</option>
        }
        {props.children}
      </select>
      :
      <span 
        className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded d-flex align-items-center" 
        style={{fontSize:FONT_SIZE}}>{props.value?props.value:'no data'}
      </span>
    }
  </div>
}