import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import SelectFieldInput from "../common/SelectFieldInput.jsx";
import { FONT_SIZE, splitFirst, splitLast } from "../common/Utility.jsx";
import { setIdClinicDefault, setRoleOfDoctor } from "../redux/ClinicSlice.jsx";

export default function SelectClinicComponent(props) {
  const clinic = useSelector(state=>state.clinic);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  return <>
    {
      clinic.idClinicDefault && (props.condition) && 
      <div style={{height:"85px",maxWidth:"350px"}}>
        <React.Fragment>
          <SelectFieldInput 
            legend={t('select clinic')} 
            defaultValue={clinic.idClinicDefault+'_'+clinic.roleOfDoctor} 
            value={clinic.idClinicDefault+'_'+clinic.roleOfDoctor}
            onChange={value=>{
              dispatch(setIdClinicDefault(splitFirst(value)));
              dispatch(setRoleOfDoctor(splitLast(value)))
            }}
          >
            {
              clinic.arrayClinic?.map(clinic=>{
                return <option className={`${clinic.roleOfDoctor === 'admin'?'text-success':'text-warning'} border-0`} value={clinic.id+'_'+clinic.roleOfDoctor} key={clinic.id}>
                  {clinic.nameClinic}
                </option>
              })
            }
          </SelectFieldInput>
          <div className="d-flex flex-row justify-content-start align-items-center ms-1">
            <span className="text-capitalize mc-color fw-bold me-2" style={{fontSize:FONT_SIZE}}>{t('you are')}: </span>
            <span className={`text-uppercase fw-bold ${clinic.roleOfDoctor==='admin'?'text-success':'text-warning'}`} style={{fontSize:FONT_SIZE}}>{clinic.roleOfDoctor}</span>
          </div>
        </React.Fragment>
      </div>
    }
  </>
}