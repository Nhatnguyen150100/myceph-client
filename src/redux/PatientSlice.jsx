import { createSlice } from "@reduxjs/toolkit";

export const PatientSlice = createSlice({
  name: 'patient',
  initialState:{
    currentPatient: null,
    getAllPatientDoctor: false,
    getAllPatientClinic: false
  },
  reducers:{
    setCurrentPatient: (state,action) => {
      state.currentPatient = action.payload;
    },
    setGetAllPatientDoctor: (state,action) => {
      state.getAllPatientDoctor = action.payload;
    },
    setGetAllPatientClinic: (state,action) => {
      state.getAllPatientClinic = action.payload;
    },
    clearPatientSlice: (state,action) => {
      state.currentPatient = null;
      state.getAllPatientDoctor = false;
      state.getAllPatientClinic = false
    }
  }
})

export const {
  setCurrentPatient,setGetAllPatientDoctor,setGetAllPatientClinic,clearPatientSlice
} = PatientSlice.actions;

export default PatientSlice.reducer;