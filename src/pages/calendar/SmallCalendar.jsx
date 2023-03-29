import React from 'react';
import { useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FONT_SIZE } from '../../common/Utility.jsx';

export default function SmallCalendar(props) {
  const {t} = useTranslation();
  const listAppointmentDate = useSelector(state => state.calendar.listAppointmentDate);

  const checkDateIsEvent = (date) => {
    for (let index = 0; index < listAppointmentDate.length; index++) {
      const element = listAppointmentDate[index];
      const date1 = new Date(element.appointmentDate);
      const date2 = new Date(date);
      if(date1.toDateString() === date2.toDateString()) return true;
    }
  }

  const tileContent = useCallback(({date,activeStartDate}) => {
    return (checkDateIsEvent(date) || checkDateIsEvent(activeStartDate)) ? <img className='position-absolute top-0 end-0' src='/assets/icons/notification.png' alt='event' style={{height:"14px"}}/> : null 	
  },[listAppointmentDate])

  const tileClassName = useCallback(({date,activeStartDate})=>{
    return (checkDateIsEvent(date) || checkDateIsEvent(activeStartDate)) ? 'position-relative' : null;
  },[listAppointmentDate])

  return (
    <div className='w-100'>
      <Calendar
        tileContent={tileContent}
        tileClassName={tileClassName}
        navigationLabel={({label}) =>{
          return <span className='mc-color fw-bold text-capitalize' style={{fontSize:FONT_SIZE}}>
            {t(label)}
          </span>
        }}
        // activeStartDate={props.currentDay}
        className={'border-0 w-100'}
        onChange={date => props.setCurrentDay(date)}
        value={props.currentDay}
      />     
    </div>
  );
}