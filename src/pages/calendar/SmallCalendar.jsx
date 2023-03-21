import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FONT_SIZE } from '../../common/Utility.jsx';

export default function SmallCalendar(props) {
  const {t} = useTranslation();
  
  return (
    <div className='w-100'>
      <Calendar
        navigationLabel={({label}) =>{
          return <span className='mc-color fw-bold text-capitalize' style={{fontSize:FONT_SIZE}}>
            {t(label)}
          </span>
        }}
        activeStartDate={props.currentDay}
        className={'border-0 w-100'}
        onChange={date => props.setCurrentDay(date)}
        value={props.currentDay}
      />     
    </div>
  );
}