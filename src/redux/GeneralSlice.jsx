import { createSlice } from "@reduxjs/toolkit";

export const GeneralSlice = createSlice({
  name: 'general',
  initialState:{
    appName: 'Myceph',
    softWareSelectedTab: null,
    medicalRecordTab: "INFORMATION",
    libraryImagesTab: "RADIOGRAPHY",
    loading: false,
    language: 'vi',
    settingTab: 0,
    doctorSettingTab: 0,
    clinicSettingTab: 0,
    patientListTab: 0,
    isRefresh: false,
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
    setPatientListTab: (state,action) => {
      state.patientListTab = action.payload;
    },
    setSoftWareSelectedTab: (state,action) => {
      state.softWareSelectedTab = action.payload;
    },
    setMedicalRecordTab: (state,action) => {
      state.medicalRecordTab = action.payload;
    },
    setLibraryImagesTab: (state,action) => {
      state.libraryImagesTab = action.payload;
    },
    setIsRefresh: (state,action) => {
      state.isRefresh = action.payload;
    },
    clearGeneralSlice: (state) => {
      state.isRefresh = false;
      state.softWareSelectedTab = null;
      state.settingTab = 0;
      state.medicalRecordTab = "INFORMATION";
      state.doctorSettingTab = 0;
      state.clinicSettingTab = 0;
      state.patientListTab = 0;
      state.loading = false;
    }
  }
})

export const {
  setLoadingModal,setLanguage,setAppName,setSettingTab,setDoctorSettingTab,
  setClinicSettingTab,clearGeneralSlice,setPatientListTab,
  setSoftWareSelectedTab,setMedicalRecordTab,setIsRefresh,setLibraryImagesTab
} = GeneralSlice.actions;

export default GeneralSlice.reducer;