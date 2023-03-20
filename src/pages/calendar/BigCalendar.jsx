import React, { useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import NavbarComponent from "../../component/NavbarComponent.jsx";
import SoftWareListComponent from "../../component/SoftWareListComponent.jsx";
import SelectPatientComponent from "../../component/SelectPatientComponent.jsx";
import { SELECT_PATIENT_MODE } from "../../common/Utility.jsx";
import { useTranslation } from "react-i18next";

const localizer = momentLocalizer(moment);

export default function BigCalendar(props){
  const {t} = useTranslation();

  const { defaultDate, formats, messages, views} = useMemo(() => ({
    defaultDate: new Date(),
    messages: {
      week: t('Week'),
      day: t('Day'),
      month: t('Month'),
      previous: t('Previous'),
      next: t('Next'),
      today: t('Today'),

      showMore: (total) => `+${total} ${t('more')}`,
    },
    formats: {
        // the day of the week header in the 'month' view
        weekdayFormat: (date, culture, localizer) =>
          localizer.format(date, 'dddd DD/MM', culture),
        // the day header in the 'week' and 'day' (Time Grid) views
        dayFormat: (date, culture, localizer) =>
          localizer.format(date, 'dddd Do', culture),
        // the time in the gutter in the Time Grid views
        timeGutterFormat: (date, culture, localizer) =>
          localizer.format(date, 'hh:mm - A', culture),
        dayHeaderFormat: (date, culture, localizer) =>
          localizer.format(date, 'dddd DD/MM/YYYY', culture),
    },
    views: [Views.MONTH,Views.WEEK, Views.DAY]
  }), [])

  return <div>
    <NavbarComponent />
    <div className="d-flex flex-column h-100 container my-1">
      <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3" style={{minHeight:`${SELECT_PATIENT_MODE===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
        <SelectPatientComponent />
        <SoftWareListComponent />
      </div>
    </div>
    <Calendar 
      min={new Date(1972, 0, 1, 8, 0, 0, 0)}
      max={new Date(1972, 0, 1, 18, 30, 0, 0)}
      popup={true}
      step={15}
      drilldownView={Views.DAY}
      views={views}
      defaultView={Views.DAY}
      defaultDate={defaultDate}
      formats={formats}
      messages={messages}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      className="mx-2"
      style={{height:"600px"}}
    />
  </div>
}