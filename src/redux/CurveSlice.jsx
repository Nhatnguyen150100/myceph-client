import { createSlice } from "@reduxjs/toolkit";

export const CurveSlice = createSlice({
  name: "curve",
  initialState: {
    markerPointsOfCurve: {},
    selectedCurve: null
  },
  reducers: {
    setMarkerPointsOfCurve: (state, action) => {
      state.markerPointsOfCurve = action.payload;
    },
    setSelectedCurve: (state, action) => {
      state.selectedCurve = action.payload;
    }
  }
})

export const { setMarkerPointsOfCurve, setSelectedCurve } = CurveSlice.actions;

export default CurveSlice.reducer;