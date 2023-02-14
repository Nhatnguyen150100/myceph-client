import { createSlice } from "@reduxjs/toolkit";

export const ClinicSlice = createSlice({
  name: 'clinic',
  initialState:{
    data: null
  },
  reducers:{
    setDataClinic: (state,action) => {
      state.data = action.payload;
    }
  }
})

export const {
  setDataClinic
} = ClinicSlice.actions;

export default ClinicSlice.reducer;