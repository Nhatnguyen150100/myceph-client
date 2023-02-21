import React from "react"

export default function SelectFieldInput(props){
  return <fieldset className={`border rounded ${props.className ? props.className : '' }`} style={props.style}>
    <legend style={{ fontSize: '1rem'}} className={`${props.classNameLegend?props.classNameLegend:'mx-auto mb-0 float-none w-auto px-1 text-capitalize mc-color fw-bold'}`}>
      {props.legend}
    </legend>
    <select className={`form-select border-0 ${props.classNameInput}`} style={{fontSize:props.fontSize}} defaultValue={props.defaultValue} value={props.value} onChange={e =>props.onChange(e.target.value)} disabled={props.disabled}>
      {props.children}
    </select>
  </fieldset>
}