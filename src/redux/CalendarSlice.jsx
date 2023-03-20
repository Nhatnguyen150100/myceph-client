import { createSlice } from "@reduxjs/toolkit";
import { Views } from "react-big-calendar";

export const CalendarSlice = createSlice({
  name: 'doctor',
  initialState:{
    view: Views.DAY
  },
  reducers:{
    setView: (state,action) => {
      state.view = action.payload;
    },
    clearCalendarSlice: (state) => {
      state.view = Views.DAY;
    }
  }
})

export const {
  setView
} = CalendarSlice.actions;

export default CalendarSlice.reducer;