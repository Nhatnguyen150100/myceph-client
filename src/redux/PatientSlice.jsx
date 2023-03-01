import { createSlice } from "@reduxjs/toolkit";

export const PatientSlice = createSlice({
  name: 'patient',
  initialState:{
    currentPatient: null,
    arrayPatients: [],
    diagnosis: null,
    selectedPlan: null,
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
    setDiagnosis: (state,action) => {
      state.diagnosis = action.payload;
    },
    setSelectedPlan: (state,action) => {
      state.selectedPlan = action.payload
    },
    setArrayPatient: (state,action) => {
      state.arrayPatients = action.payload;
    },
    clearPatientSlice: (state,action) => {
      state.arrayPatients = [];
      state.diagnosis = null;
      state.selectedPlan = null;
      state.selectPatientOnMode = null;
      state.currentPatient = null;
      state.getAllPatientDoctor = false;
      state.getAllPatientClinic = false
    }
  }
})

export const {
  setCurrentPatient,setGetAllPatientDoctor,setGetAllPatientClinic,
  clearPatientSlice,setSelectPatientOnMode,setDiagnosis,
  setSelectedPlan,setArrayPatient
} = PatientSlice.actions;

export default PatientSlice.reducer;