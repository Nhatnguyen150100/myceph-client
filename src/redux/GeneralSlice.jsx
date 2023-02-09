import { createSlice } from "@reduxjs/toolkit";

export const GeneralSlice = createSlice({
  name: 'general',
  initialState:{
    loading: false,
    language: 'vi'
  },
  reducers:{
    setLoadingModal: (state,action) => {
      state.loading = action.payload;
    },
    setLanguage: (state,action) => {
      state.language = action.payload;
    }
  }
})

export const {
  setLoadingModal,setLanguage
} = GeneralSlice.actions;

export default GeneralSlice.reducer;