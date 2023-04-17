import React from "react";
import { useTranslation } from "react-i18next";
import IconButtonComponent from "../../common/IconButtonComponent.jsx";
import { FONT_SIZE } from "../../common/Utility.jsx";

export default function CustomIndicator(props){
  const {t} = useTranslation();

  return <div className={`${props.col} border-start d-flex flex-column justify-content-between`}>
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
            {t('unit')}
          </th>
          <th className="align-middle mc-heading-middle d-lg-table-cell text-capitalize fw-bold mc-pale-background" style={{fontSize:FONT_SIZE}}>
            {t('action')}
          </th>
        </tr>
      </thead>
      <tbody style={{overflowY:"auto",height:"auto"}}>
        <tr>
          <td className="align-middle" colSpan={3}>
            <select className="form-select text-capitalize text-gray" style={{fontSize:FONT_SIZE}}>
              <option hidden=""></option>
              <option className="text-gray text-capitalize" style={{fontSize:FONT_SIZE}}>
                {t('distance between 2 landmarks')}
              </option>
              <option className="text-gray text-capitalize" style={{fontSize:FONT_SIZE}}>
                {t('angle between 2 lines')}
              </option>
            </select>
          </td>
          <td className="align-middle">
            <IconButtonComponent 
              className='btn-success border rounded-circle h-100' 
              icon="add" 
              FONT_SIZE_ICON={"25px"} 
              title={t("add indicator")}
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div className="form-floating">
      <textarea className="form-control" id="noteArea" placeholder={t('Enter note for analysis')} rows={5}/>
      <label htmlFor="noteArea" className="text-capitalize text-gray fw-bold" style={{fontSize:FONT_SIZE}}>{t('note for analysis')}</label>
    </div>
  </div>
}