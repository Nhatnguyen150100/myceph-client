import React from "react";
import {useDropzone} from 'react-dropzone'

export default function UploadImage(props){
  const {getRootProps, getInputProps} = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles,rejectedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onabort = () => alert('file reading was aborted')
        reader.onerror = () => alert('file reading has failed')
        reader.onload = () => {
          const binaryStr = reader.result
          props.getUrlImage(binaryStr);
          props.getImage(file);
        }
        reader.readAsDataURL(file)
      })
    }
  })

  return (
    <button type="btn" {...getRootProps({className:`dropzone border btn p-0 m-0 ${props.className}`})} style={props.style}>
      <input {...getInputProps()} />
      {
        props.icon && <span className="material-symbols-outlined mt-1" style={{fontSize:"30px"}}>
        {props.icon}
      </span>
      }
      {
        props.imageIcon && <img src={props.imageIcon} alt={props.alt} className={props.classNameImage} style={props.styleImage}/>
      }
    </button>
  );
}