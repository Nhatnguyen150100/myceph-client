import { createSlice } from "@reduxjs/toolkit";

export const CalendarSlice = createSlice({
  name: 'doctor',
  initialState:{
    viewCalendar: 'BY_DATE',
    view: 'day',
    propertiesClinic: null,
    listAppointmentDate: []
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
    setListAppointmentDate: (state,action) => {
      state.listAppointmentDate = action.payload;
    },
    clearCalendarSlice: (state) => {
      state.listAppointmentDate = [];
      state.propertiesClinic = null;
      state.viewCalendar = 'BY_DATE';
      state.view = 'day';
    }
  }
})

export const {
  setView,setViewCalendar,setPropertiesClinic,clearCalendarSlice,setListAppointmentDate
} = CalendarSlice.actions;

export default CalendarSlice.reducer;