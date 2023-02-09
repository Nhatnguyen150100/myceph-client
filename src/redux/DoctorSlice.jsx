import { createSlice } from "@reduxjs/toolkit";

export const DoctorSlice = createSlice({
  name: 'doctor',
  initialState:{
    data: {}
  },
  reducers:{
    setDataDoctor: (state,action) => {
      state.data = action.payload;
    } 
  }
})

export const {
  setDataDoctor
} = DoctorSlice.actions;

export default DoctorSlice.reducer;