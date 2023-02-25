import { createSlice } from "@reduxjs/toolkit";

export const PatientSlice = createSlice({
  name: 'patient',
  initialState:{
    currentPatient: null,
    selectPatientOnMode: null,
    getAllPatientDoctor: false,
    getAllPatientClinic: false
  },
  reducers:{
    setCurrentPatient: (state,action) => {
      state.currentPatient = action.payload;
    },
    setSelectPatientOnMode: (state,action) => {
      state.selectPatientOnMode = action.payload;
    },
    setGetAllPatientDoctor: (state,action) => {
      state.getAllPatientDoctor = action.payload;
    },
    setGetAllPatientClinic: (state,action) => {
      state.getAllPatientClinic = action.payload;
    },
    clearPatientSlice: (state,action) => {
      state.selectPatientOnMode = null;
      state.currentPatient = null;
      state.getAllPatientDoctor = false;
      state.getAllPatientClinic = false
    }
  }
})

export const {
  setCurrentPatient,setGetAllPatientDoctor,setGetAllPatientClinic,clearPatientSlice,setSelectPatientOnMode
} = PatientSlice.actions;

export default PatientSlice.reducer;