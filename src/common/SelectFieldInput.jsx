import React from "react"

export default function SelectFieldInput(props){
  return <fieldset className={`border rounded ${props.className ? props.className : '' } ${props.error?'border-danger':''}`} >
    <legend style={{ fontSize: '1rem', color: 'darkgray' }} className="mx-auto mb-0 float-none w-auto px-1 text-capitalize">
      {props.legend}
    </legend>
    <select className="form-select border-0" value={props.value} onChange={e =>props.onChange(e.target.value)} disabled={props.disabled}>
      {props.children}
    </select>
  </fieldset>
}