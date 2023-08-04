import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { cookies } from "../common/Utility.jsx";

export const DoctorSlice = createSlice({
  name: 'doctor',
  initialState:{
    data: null,
    otherEmailDoctor: null,
    encryptKeyDoctor: null,
    roleOfDoctorOnPatient: 'edit'
  },
  reducers:{
    setDataDoctor: (state,action) => {
      state.data = action.payload;
    },
    setEncryptKeyDoctor: (state,action) => {
      state.encryptKeyDoctor = action.payload;
    },
    setRoleOfDoctorOnPatient: (state,action) => {
      state.roleOfDoctorOnPatient = action.payload;
    },
    logOutDoctor: (state) => {
      storage.removeItem('persist:root');
      cookies.remove('accessToken', {path: '/'});
      cookies.remove('refreshToken', {path: '/'});
      state.data = null;
      state.otherEmailDoctor = null;
      state.encryptKeyDoctor = null;
      state.roleOfDoctorOnPatient = 'edit';
    },
    setOtherEmailDoctor: (state,action) => {
      state.otherEmailDoctor = action.payload
    }
  }
})

export const {
  setDataDoctor,logOutDoctor,setOtherEmailDoctor,setEncryptKeyDoctor,setRoleOfDoctorOnPatient
} = DoctorSlice.actions;

export default DoctorSlice.reducer;