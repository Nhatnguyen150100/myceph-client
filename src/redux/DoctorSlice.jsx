import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { cookies } from "../common/Utility.jsx";

export const DoctorSlice = createSlice({
  name: 'doctor',
  initialState:{
    data: null,
    otherEmailDoctor: null
  },
  reducers:{
    setDataDoctor: (state,action) => {
      state.data = action.payload;
    },
    logOutDoctor: (state) => {
      storage.removeItem('persist:root');
      cookies.remove('accessToken', {path: '/'});
      cookies.remove('refreshToken', {path: '/'});
      state.data = null;
      state.otherEmailDoctor = null;
    },
    setOtherEmailDoctor: (state,action) => {
      state.otherEmailDoctor = action.payload
    }
  }
})

export const {
  setDataDoctor,logOutDoctor,setOtherEmailDoctor
} = DoctorSlice.actions;

export default DoctorSlice.reducer;