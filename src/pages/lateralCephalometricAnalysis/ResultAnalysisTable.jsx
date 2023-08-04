import React, { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { deCryptData } from "../../common/Crypto.jsx";
import { FONT_SIZE, FONT_SIZE_HEAD, getKeyByNameValue, getKeyByValue, SELECT_PATIENT_MODE } from "../../common/Utility.jsx";
import { setCurrentAnalysis, setCurrentNorm } from "../../redux/LateralCephSlice.jsx";
import { ANALYSIS } from "./LateralCephalometricUtility.jsx";
import PREDEFINED_NORMS from '../../mocks/Norms.json';

export default function ResultAnalysisTable(props) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const markerPoints = useSelector(state=>state.lateralCeph.markerPoints);
  const currentNorm = useSelector(state=>state.lateralCeph.currentNorm);
  const currentAnalysis = useSelector(state=>state.lateralCeph.currentAnalysis);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const encryptKeyClinic = useSelector(state=>state.clinic.encryptKeyClinic);
  const encryptKeyDoctor = useSelector(state=>state.doctor.encryptKeyDoctor);
  const encryptKeySharePatient = useSelector(state=>state.patient.encryptKeySharePatient);
  const selectPatientOnMode = useSelector(state=>state.patient.selectPatientOnMode);

  const resultRef = useRef();
  const partOneElementRef = useRef();

  const [heightTable, setHeightTable] = useState(0);

  useEffect(() => {
    setHeightTable(resultRef.current?.clientHeight - partOneElementRef.current?.clientHeight);
  }, [])

  const isEncrypted = currentPatient?.isEncrypted;
  const modeKey = useMemo(()=>{
    if(selectPatientOnMode===SELECT_PATIENT_MODE.MY_PATIENT) return encryptKeyDoctor;
    else if(selectPatientOnMode===SELECT_PATIENT_MODE.CLINIC_PATIENT) return encryptKeyClinic;
    else return encryptKeySharePatient;
  },[selectPatientOnMode])


  const genderPatient = isEncrypted ? deCryptData(modeKey.key,modeKey.iv,JSON.parse(currentPatient.gender).tag,JSON.parse(currentPatient.gender).encrypted):currentPatient?.gender;

  return <div className="m-0 p-0 h-100" ref={resultRef}>
    <div ref={partOneElementRef}>
      <div className="py-1 px-3 mc-background" style={{borderBottomLeftRadius:"5px",borderBottomRightRadius:"5px"}}>
        <span className="text-white fw-bold text-capitalize" style={{fontSize:FONT_SIZE_HEAD}}>{t('result analysis')}</span>
      </div>
      <div className="py-1 px-3 border-bottom d-flex justify-content-start align-items-center">
        <label className="text-gray fw-bold text-uppercase" style={{fontSize:FONT_SIZE,width:"150px"}}>
          {t('norm set')}:
        </label>
        <select className="flex-grow-1 ms-2 form-select rounded text-capitalize" value={getKeyByValue(PREDEFINED_NORMS,currentNorm)} onChange={e=>dispatch(setCurrentNorm(PREDEFINED_NORMS[e.target.value]))}>
          {
            Object.keys(PREDEFINED_NORMS).map((norm,index) => {
              return <option key={index+Math.random(0,1000)} value={norm}>
                {PREDEFINED_NORMS[norm].name}
              </option>
            })
          }
        </select>
      </div>
      <div className="py-1 px-3 border-bottom d-flex justify-content-start align-items-center">
        <label className="text-gray fw-bold text-uppercase" style={{fontSize:FONT_SIZE,width:"150px"}}>
          {t('analysis')}:
        </label>
        <select className="flex-grow-1 ms-2 form-select rounded text-capitalize" value={currentAnalysis} onChange={e=>dispatch(setCurrentAnalysis(e.target.value))}>
          {
            Object.keys(ANALYSIS).map((analysis,index) => {
              return <option key={index+Math.random(0,1000)} value={ANALYSIS[analysis].name}>
                {ANALYSIS[analysis].name}
              </option>
            })
          }
        </select>
      </div>
    </div>
    <div className="tableFixHead" style={{height:`${heightTable}px`}}>
      <table className="table table-striped table-bordered text-center">
        <thead className="mc-pale-background text-white text-uppercase">
          <tr>
            <th className="align-middle mc-heading-middle d-lg-table-cell text-capitalize fw-bold mc-pale-background" style={{fontSize:FONT_SIZE}}>
              {t('indicator')}
            </th>
            <th className="align-middle mc-heading-middle d-lg-table-cell text-capitalize fw-bold mc-pale-background" style={{fontSize:FONT_SIZE}}>
              {t('value')}
            </th>
            <th className="align-middle mc-heading-middle d-lg-table-cell text-capitalize fw-bold mc-pale-background" style={{fontSize:FONT_SIZE}}>
              {t('min')}
            </th>
            <th className="align-middle mc-heading-middle d-lg-table-cell text-capitalize fw-bold mc-pale-background" style={{fontSize:FONT_SIZE}}>
              {t('max')}
            </th>
            <th className="align-middle mc-heading-middle d-lg-table-cell text-capitalize fw-bold mc-pale-background" style={{fontSize:FONT_SIZE}}>
              {t('unit')}
            </th>
          </tr>
        </thead>
        <tbody style={{overflowY:"auto",height:"300px"}}>
          {
            ANALYSIS[getKeyByNameValue(ANALYSIS,currentAnalysis)]?.arrayListValue.map((value,index) => {
              return  <React.Fragment key={index+Math.random(1,1000)}
              > 
                {
                  value.group && <tr className="align-middle">
                    <td className="fw-bold" colSpan={5} style={{backgroundColor:"rgb(181, 239, 253)",fontSize:"13px"}}>
                      {t(value.group)}
                    </td>
                  </tr>
                }
                {
                  value.arrayIndicatorValue.map((indicator,indexI)=>{
                    return <tr className="align-middle" key={indexI+Math.random(1,1000)}>
                      <td              
                        onMouseEnter={()=>{
                          if(indicator.valueFn && markerPoints && props.imageObject){
                            props.onSetHighLightIndicator(
                              indicator.highLightFn(...indicator.markerArray?.map(element => {
                                return markerPoints[element] ? markerPoints[element] : null;
                              }))
                            )
                          }
                        }}
                        onMouseLeave={()=>props.onSetHighLightIndicator([])}
                        onMouseOut={()=>props.onSetHighLightIndicator([])} 
                        className="text-gray hover-table" 
                        style={{fontSize:FONT_SIZE,cursor:"pointer"}}
                      >
                        {
                          indicator.indicator
                        }
                      </td>
                      <td 
                        style={{fontSize:FONT_SIZE,cursor:"pointer"}} 
                        className={`${
                          indicator.valueFn(...indicator.markerArray?.map(element => {
                            return markerPoints[element] ? markerPoints[element] : null;
                          }), props.lengthOfRuler) && indicator.valueFn(...indicator.markerArray?.map(element => {
                            return markerPoints[element] ? markerPoints[element] : null;
                          }), props.lengthOfRuler) < currentNorm?.data[indicator.normName]?.data[genderPatient==='male'?'M':'F'].MIN 
                          ?
                          'text-primary'
                          :
                          (
                            indicator.valueFn(...indicator.markerArray?.map(element => {
                              return markerPoints[element] ? markerPoints[element] : null;
                            }), props.lengthOfRuler) && indicator.valueFn(...indicator.markerArray?.map(element => {
                              return markerPoints[element] ? markerPoints[element] : null;
                            }), props.lengthOfRuler) > currentNorm?.data[indicator.normName]?.data[genderPatient==='male'?'M':'F'].MAX 
                            ?
                            'text-danger'
                            :
                            ''
                          )
                        }`}
                      >
                        {
                          indicator.valueFn && markerPoints && props.imageObject && indicator.valueFn(...indicator.markerArray?.map(element => {
                            return markerPoints[element] ? markerPoints[element] : null;
                          }), props.lengthOfRuler)
                        }
                      </td>
                      <td style={{fontSize:FONT_SIZE}}>
                        {
                          t(currentNorm?.data[indicator.normName]?.data[genderPatient==='male'?'M':'F'].MIN)
                        }
                      </td>
                      <td style={{fontSize:FONT_SIZE}}>
                        {
                          t(currentNorm?.data[indicator.normName]?.data[genderPatient==='male'?'M':'F'].MAX)
                        }
                      </td>
                      <td className="text-gray" style={{fontSize:FONT_SIZE}}>
                        {
                          t(indicator.unit)
                        }
                      </td>
                    </tr>
                  })
                }
              </React.Fragment>
            })
          }
        </tbody>
      </table>
    </div>
  </div>
}