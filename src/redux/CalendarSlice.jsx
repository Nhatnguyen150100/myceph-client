import { createSlice } from "@reduxjs/toolkit";
import { Views } from "react-big-calendar";

export const CalendarSlice = createSlice({
  name: 'doctor',
  initialState:{
    viewCalendar: 'BY_DATE',
    view: Views.DAY,
    propertiesClinic: null
  },
  reducers:{
    setView: (state,action) => {
      state.view = action.payload;
    },
    setViewCalendar: (state,action) => {
      state.viewCalendar = action.payload;
    },
    setPropertiesClinic: (state,action) => {
      state.propertiesClinic = action.payload;
    },
    clearCalendarSlice: (state) => {
      state.propertiesClinic = null;
      state.viewCalendar = 'BY_DATE';
      state.view = Views.DAY;
    }
  }
})

export const {
  setView,setViewCalendar,setPropertiesClinic,clearCalendarSlice
} = CalendarSlice.actions;

export default CalendarSlice.reducer;