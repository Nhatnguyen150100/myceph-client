import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { cookies } from "../common/Utility.jsx";

export const DoctorSlice = createSlice({
  name: 'doctor',
  initialState:{
    data: null,
    otherEmailDoctor: null,
    encryptKey: null
  },
  reducers:{
    setDataDoctor: (state,action) => {
      state.data = action.payload;
    },
    setEncryptKey: (state,action) => {
      state.encryptKey = action.payload;
    },
    logOutDoctor: (state) => {
      storage.removeItem('persist:root');
      cookies.remove('accessToken', {path: '/'});
      cookies.remove('refreshToken', {path: '/'});
      state.data = null;
      state.otherEmailDoctor = null;
      state.encryptKey = null;
    },
    setOtherEmailDoctor: (state,action) => {
      state.otherEmailDoctor = action.payload
    }
  }
})

export const {
  setDataDoctor,logOutDoctor,setOtherEmailDoctor,setEncryptKey
} = DoctorSlice.actions;

export default DoctorSlice.reducer;