import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import NavbarComponent from "../../component/NavbarComponent.jsx";
import SoftWareListComponent from "../../component/SoftWareListComponent.jsx";
import SelectPatientComponent from "../../component/SelectPatientComponent.jsx";
import { SELECT_PATIENT_MODE } from "../../common/Utility.jsx";
import { useTranslation } from "react-i18next";
import RBCToolbar from "./RBCToolbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setView } from "../../redux/CalendarSlice.jsx";


const localizer = momentLocalizer(moment);

export default function BigCalendar(props){
  const {t} = useTranslation();
  const clickRef = useRef(null);
  const view = useSelector(state => state.calendar.view);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      window.clearTimeout(clickRef?.current)
    }
  }, [])

  const onSelectSlot = useCallback(slotInfo => {
    window.clearTimeout(clickRef?.current)
    clickRef.current = window.setTimeout(() => {
      window.alert(slotInfo);
    }, 250)
  }, [])

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

  const slotGroupPropGetter = useCallback(
    () => ({
      style: {
        minHeight: 60
      },
    }),
    []
  )

  return <div>
    <NavbarComponent />
    <div className="d-flex flex-column h-100 container my-1">
      <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3" style={{minHeight:`${SELECT_PATIENT_MODE===SELECT_PATIENT_MODE.CLINIC_PATIENT?'100px':'0px'}`}}>
        <SelectPatientComponent />
        <SoftWareListComponent />
      </div>
    </div>
      <Calendar
        components={{
          toolbar: RBCToolbar
        }}
        min={new Date(1972, 0, 1, 8, 0, 0, 0)}
        max={new Date(1972, 0, 1, 18, 0, 0, 0)}
        popup={true}
        selectable={true}
        onSelectSlot={onSelectSlot}
        step={15}
        slotGroupPropGetter={slotGroupPropGetter}
        drilldownView={view}
        views={views}
        defaultView={view}
        defaultDate={defaultDate}
        formats={formats}
        messages={messages}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        className="mx-2"
        style={{height:"550px"}}
      />
  </div>
}