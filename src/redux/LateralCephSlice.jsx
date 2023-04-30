import { createSlice } from "@reduxjs/toolkit";
import { ANALYSIS, PREDEFINED_NORMS } from "../pages/lateralCephalometricAnalysis/LateralCephalometricUtility.jsx";

export const LateralCephSlice = createSlice({
  name: 'LateralCeph',
  initialState: {
    markerPoints: {},
    currentAnalysis: ANALYSIS.STEINER.name,
    currentNorm: PREDEFINED_NORMS.VIETNAM,
    listImageFontSide: [],
    currentImageAnalysis: null,
    scaleImage: null,
    lengthOfRuler: 10,
    noteAnalysis: null,
    isVisitableMarkerPoints: true,
    isVisitableAnalysisLines: true
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
    clearLateralCephSlice: (state) => {
      state.markerPoints = {};
      state.currentAnalysis = ANALYSIS.STEINER.name;
      state.currentNorm = PREDEFINED_NORMS.VIETNAM;
      state.listImageFontSide = [];
      state.currentImageAnalysis =  null;
      state.scaleImage = null;
      state.lengthOfRuler = 10;
      state.noteAnalysis = null;
      state.isVisitableMarkerPoints = true;
      state.isVisitableAnalysisLines = true;
    }
  }
})

export const {
  setCurrentAnalysis, setCurrentNorm, clearLateralCephSlice,setMarkerPoints,
  setListImageFontSide,setCurrentImageAnalysis,setScaleImage,setLengthOfRuler,setNoteAnalysis,
  setVisitableMarkerPoints,setVisitableAnalysisLines
} = LateralCephSlice.actions;

export default LateralCephSlice.reducer;