import { createSlice } from "@reduxjs/toolkit";

export const PatientSlice = createSlice({
  name: 'patient',
  initialState:{
    currentPatient: null,
    arrayPatients: [],
    selectPatientOnMode: null,
    getAllPatientDoctor: false,
    getAllPatientClinic: false,
    arrayEncryptKeySharePatient: [],
    encryptKeySharePatient: null
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
    setArrayPatient: (state,action) => {
      state.arrayPatients = action.payload;
    },
    setArrayEncryptKeySharePatient: (state,action) => {
      state.arrayEncryptKeySharePatient = action.payload;
    },
    setEncryptKeySharePatient: (state,action) => {
      state.encryptKeySharePatient = action.payload;
    },
    clearPatientSlice: (state) => {
      state.arrayPatients = [];
      state.selectPatientOnMode = null;
      state.currentPatient = null;
      state.getAllPatientDoctor = false;
      state.getAllPatientClinic = false;
      state.arrayEncryptKeySharePatient = [];
      state.encryptKeySharePatient = null;
    }
  }
})

export const {
  setCurrentPatient,setGetAllPatientDoctor,setGetAllPatientClinic,setArrayEncryptKeySharePatient,
  clearPatientSlice,setSelectPatientOnMode,setArrayPatient,setEncryptKeySharePatient
} = PatientSlice.actions;

export default PatientSlice.reducer;