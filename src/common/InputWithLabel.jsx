import React, { useEffect, useState } from "react";
import { FONT_SIZE } from "./Utility.jsx";

export default function InputWithLabel(props){
  return <div className='d-flex mb-3 pb-1 border-bottom align-items-center flex-grow-1'>
    <label className="text-capitalize mc-color fw-bold ms-2" style={props.style}>{props.label}:</label>
    {
      props.editMode ? 
      <input 
        className="text-gray border-0 rounded btn-hover-bg flex-grow-1 px-2 py-1" 
        type={props.type} 
        onKeyDown={e=>{if(e.key === "Enter") props.onUpdate(e) ; if(e.key === "Escape") props.onCancel()}} 
        style={{outline:"none",fontSize:FONT_SIZE,...props.styleInput}} 
        onChange={e=>props.onChange(e.target.value)} 
        value={props.value?props.value:''}
        placeholder={props.placeholder}
      />
      :
      <span 
        className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" 
        style={{fontSize:FONT_SIZE,...props.styleSpan}}
      >
        {props.result}
      </span>
    }
  </div>
}