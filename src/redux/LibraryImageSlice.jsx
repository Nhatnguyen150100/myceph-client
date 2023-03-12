import { createSlice } from "@reduxjs/toolkit";

export const LibraryImageSlice = createSlice({
  name: 'libraryImage',
  initialState:{
    currentImage: null
  },
  reducers:{
    setCurrentImage: (state,action) => {
      state.currentImage = action.payload;
    },
    clearImageSlice: (state) => {
      state.currentImage = null;
    }
  }
})

export const {
    setCurrentImage,clearImageSlice
} = LibraryImageSlice.actions;

export default LibraryImageSlice.reducer;