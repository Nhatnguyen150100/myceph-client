import moment from "moment";
import React, { useState } from "react";
import { Views } from "react-big-calendar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FONT_SIZE } from "../../common/Utility.jsx";
import { setView } from "../../redux/CalendarSlice.jsx";

function RBCToolbar(props) {
  const {t} = useTranslation();
  const viewCalendar = useSelector(state => state.calendar.view);
  const dispatch = useDispatch();

  const getCustomToolbar = () => {
    const goToDayView = () => {
      props.onView("day");
      dispatch(setView(Views.DAY))
    };
    const goToWeekView = () => {
      props.onView("week");
      dispatch(setView(Views.WEEK))
    };
    const goToMonthView = () => {
      props.onView("month");
      dispatch(setView(Views.MONTH))
    };

    const goToBack = () => {
      let view = viewCalendar;
      let mDate = props.date;
      let newDate;
      if (view === "month") {
        newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1);
      } else if (view === "week") {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() - 7,
          1
        );
      } else {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() - 1,
          1
        );
      }
      props.onNavigate("prev", newDate);
    };
    const goToNext = () => {
      let view = viewCalendar;
      let mDate = props.date;
      let newDate;
      if (view === "month") {
        newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1);
      } else if (view === "week") {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() + 7,
          1
        );
      } else {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() + 1,
          1
        );
      }
      props.onNavigate("next", newDate);
    };

    const goToToday = () => {
      const now = new Date();
      props.date.setMonth(now.getMonth());
      props.date.setYear(now.getFullYear());
      props.date.setDate(now.getDate());
      props.onNavigate("current",now);
    };

    const month = () => {
      const date = moment(props.date);
      let month = date.format("MMMM");
      let day = date.format("D");

      return (
        <span className="rbc-toolbar-label rbc-date">
          <i className="far fa-calendar"></i> <span>{`${month} ${day}`}</span>
        </span>
      );
    };

    return (
      <div className="w-100 mb-1">
        <div className="rbc-toolbar-item-2 w-100 d-flex flex-row align-items-center justify-content-between">
          <span className="rbc-btn-group d-flex flex-row">
            <button type="button" className="btn btn-primary py-1 px-2 rounded d-flex align-items-center" onClick={goToBack}>
              <span className="material-symbols-outlined me-2 text-white">
                keyboard_double_arrow_left
              </span>
              <span className="fw-bold text-capitalize text-white" style={{fontSize:FONT_SIZE}}>
                {t('Back')}
              </span>
            </button>
            <button type="button" className="btn btn-success py-1 px-2 rounded d-flex align-items-center mx-2" onClick={goToToday}>
              <span className="material-symbols-outlined me-2">
                today
              </span>
              <span className="fw-bold text-capitalize" style={{fontSize:FONT_SIZE}}>
                {t('Today')}
              </span>
            </button>
            <button type="button" className="btn btn-primary py-1 px-2 rounded d-flex align-items-center" onClick={goToNext}>
              <span className="material-symbols-outlined me-2 text-white">
              keyboard_double_arrow_right
              </span>
              <span className="fw-bold text-capitalize text-white" style={{fontSize:FONT_SIZE}}>
                {t('Next')}
              </span>
            </button>
          </span>
          <span className="text-uppercase fw-bold mc-color fs-3">{month()}</span>
          <span className="rbc-btn-group d-flex flex-row">
            <button type="button" disabled={viewCalendar===Views.MONTH} className={`btn ${viewCalendar===Views.MONTH?'mc-pale-background border-0':'btn-primary'} py-1 px-2 rounded d-flex align-items-center`} onClick={goToMonthView}>
              <span className="material-symbols-outlined me-2 text-white">
                calendar_month
              </span>
              <span className="fw-bold text-capitalize text-white" style={{fontSize:FONT_SIZE}}>
                {t('View Month')}
              </span>
            </button>
            <button type="button" disabled={viewCalendar===Views.WEEK} className={`btn ${viewCalendar===Views.WEEK?'mc-pale-background border-0':'btn-primary'} py-1 px-2 rounded d-flex align-items-center mx-2`} onClick={goToWeekView}>
              <span className="material-symbols-outlined me-2 text-white">
                date_range
              </span>
              <span className="fw-bold text-capitalize text-white" style={{fontSize:FONT_SIZE}}>
                {t('View Week')}
              </span>
            </button>
            <button type="button" disabled={viewCalendar===Views.DAY} className={`btn ${viewCalendar===Views.DAY?'mc-pale-background border-0':'btn-primary'} py-1 px-2 rounded d-flex align-items-center`} onClick={goToDayView}>
              <span className="material-symbols-outlined me-2 text-white">
                calendar_today
              </span>
              <span className="fw-bold text-capitalize text-white" style={{fontSize:FONT_SIZE}}>
                {t('View Day')}
              </span>
            </button>
          </span>
        </div>
      </div>
    );
  };

  return <>{getCustomToolbar()}</>;
}

export default RBCToolbar;