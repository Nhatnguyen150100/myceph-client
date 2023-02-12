import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { cookies } from "../common/Utility.jsx";

export const DoctorSlice = createSlice({
  name: 'doctor',
  initialState:{
    data: null
  },
  reducers:{
    setDataDoctor: (state,action) => {
      state.data = action.payload;
    },
    logOutDoctor: (state) => {
      storage.removeItem('persist:root');
      cookies.remove('accessToken', {path: '/'});
      state.data = null;
    }
  }
})

export const {
  setDataDoctor,logOutDoctor
} = DoctorSlice.actions;

export default DoctorSlice.reducer;