import { createSlice } from "@reduxjs/toolkit";
import { ANALYSIS, PREDEFINED_NORMS } from "../pages/lateralCephalometricAnalysis/LateralCephalometricUtility.jsx";

export const LateralCephSlice = createSlice({
  name: 'LateralCeph',
  initialState: {
    markerPoints: {},
    currentAnalysis: ANALYSIS.STEINER.name,
    currentNorm: PREDEFINED_NORMS.VIETNAM,
    listImageFontSide: [],
    currentImageAnalysis: null
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
    clearLateralCephSlice: (state) => {
      state.markerPoints = {};
      state.currentAnalysis = ANALYSIS.STEINER.name;
      state.currentNorm = PREDEFINED_NORMS.VIETNAM;
      state.listImageFontSide = [];
      state.currentImageAnalysis =  null;
    }
  }
})

export const {
  setCurrentAnalysis, setCurrentNorm, clearLateralCephSlice,setMarkerPoints,setListImageFontSide,setCurrentImageAnalysis
} = LateralCephSlice.actions;

export default LateralCephSlice.reducer;