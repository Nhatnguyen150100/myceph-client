import React from "react"

export default function TextAreaFieldInput(props){
  return <fieldset className={`border rounded ${props.className ? props.className : '' }`} style={props.style}>
    <legend style={{ fontSize: '1rem'}} className={`${props.classNameLegend?props.classNameLegend:'mx-auto mb-0 float-none w-auto px-1 text-capitalize mc-color fw-bold'}`}>
      {props.legend}
    </legend>
    <textarea className={`${props.classNameInput?props.classNameInput:'border-0 px-2 py-1 '}`} style={{ width:'100%',height:'100%',outline:'none',fontSize:props.fontSize,resize:"vertical"}} type={props.type} value={props.value} onChange={e=>props.onChange(e.target.value)} onBlur={props.onBlur} disabled={props.disabled}
    placeholder={props.placeholder}/>
  </fieldset>
}