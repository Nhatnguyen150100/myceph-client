import { createSlice } from "@reduxjs/toolkit";
import { ANALYSIS } from "../pages/lateralCephalometricAnalysis/LateralCephalometricUtility.jsx";
import PREDEFINED_NORMS from '../mocks/Norms.json'

export const LateralCephSlice = createSlice({
  name: 'LateralCeph',
  initialState: {
    markerPoints: {},
    currentAnalysis: ANALYSIS.STEINER.name,
    currentNorm: PREDEFINED_NORMS.VIETNAM,
    listImageFontSide: [],
    currentImageAnalysis: null,
    consultationDate: null,
    scaleImage: null,
    lengthOfRuler: 10,
    noteAnalysis: null,
    isVisitableImageAnalysis: true,
    isVisitableMarkerPoints: true,
    isVisitableAnalysisLines: true,
    isVisitableHelper: true
  },
  reducers: {
    setMarkerPoints: (state,action) => {
      state.markerPoints = action.payload;
    },
    setCurrentAnalysis: (state,action) => {
      state.currentAnalysis = action.payload;
    },
    setCurrentNorm: (state,action) => {
      state.currentNorm = action.payload;
    },
    setListImageFontSide: (state,action) => {
      state.listImageFontSide = action.payload;
    },
    setCurrentImageAnalysis: (state,action) => {
      state.currentImageAnalysis = action.payload;
    },
    setConsultationDate: (state,action) => {
      state.consultationDate = action.payload;
    },
    setScaleImage: (state,action) => {
      state.scaleImage = action.payload;
    },
    setLengthOfRuler: (state,action) => {
      state.lengthOfRuler = action.payload;
    },
    setNoteAnalysis: (state,action) => {
      state.noteAnalysis = action.payload;
    },
    setVisitableMarkerPoints: (state,action) => {
      state.isVisitableMarkerPoints = action.payload;
    },
    setVisitableAnalysisLines: (state,action) => {
      state.isVisitableAnalysisLines = action.payload;
    },
    setIsVisitableHelper: (state,action) => {
      state.isVisitableHelper = action.payload;
    },
    setIsVisitableImageAnalysis: (state,action) => {
      state.isVisitableImageAnalysis = action.payload;
    },
    clearLateralCephSlice: (state) => {
      state.markerPoints = {};
      state.currentAnalysis = ANALYSIS.STEINER.name;
      state.currentNorm = PREDEFINED_NORMS.VIETNAM;
      state.listImageFontSide = [];
      state.currentImageAnalysis =  null;
      state.scaleImage = null;
      state.lengthOfRuler = 10;
      state.noteAnalysis = null;
      state.consultationDate = null;
      state.isVisitableImageAnalysis = true;
      state.isVisitableMarkerPoints = true;
      state.isVisitableAnalysisLines = true;
      state.isVisitableHelper = true;
    }
  }
})

export const {
  setCurrentAnalysis, setCurrentNorm, clearLateralCephSlice,setMarkerPoints,
  setListImageFontSide,setCurrentImageAnalysis,setScaleImage,setLengthOfRuler,setNoteAnalysis,
  setVisitableMarkerPoints,setVisitableAnalysisLines,setIsVisitableHelper,setIsVisitableImageAnalysis,setConsultationDate
} = LateralCephSlice.actions;

export default LateralCephSlice.reducer;