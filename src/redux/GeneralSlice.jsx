import { createSlice } from "@reduxjs/toolkit";

export const GeneralSlice = createSlice({
  name: 'general',
  initialState:{
    appName: 'Myceph',
    loading: false,
    language: 'vi',
    settingTab: 0,
    doctorSettingTab: 0,
    clinicSettingTab: 0
  },
  reducers:{
    setAppName: (state,action) => {
      state.appName = action.payload;
    },
    setLoadingModal: (state,action) => {
      state.loading = action.payload;
    },
    setLanguage: (state,action) => {
      state.language = action.payload;
    },
    setSettingTab: (state,action) => {
      state.settingTab = action.payload;
    },
    setDoctorSettingTab: (state,action) => {
      state.doctorSettingTab = action.payload;
    },
    setClinicSettingTab: (state,action) => {
      state.clinicSettingTab = action.payload;
    },
    clearGeneralSlice: (state) => {
      state.settingTab = 0;
      state.doctorSettingTab = 0;
      state.clinicSettingTab = 0;
    }
  }
})

export const {
  setLoadingModal,setLanguage,setAppName,setSettingTab,setDoctorSettingTab,setClinicSettingTab,clearGeneralSlice
} = GeneralSlice.actions;

export default GeneralSlice.reducer;