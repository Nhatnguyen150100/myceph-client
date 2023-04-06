import { createSlice } from "@reduxjs/toolkit";

export const ClinicSlice = createSlice({
  name: 'clinic',
  initialState:{
    idClinicDefault: null,
    roleOfDoctor: null,
    arrayClinic: null,
    encryptKeyClinic: null
  },
  reducers:{
    setArrayClinic: (state,action) => {
      state.arrayClinic = action.payload;
    },
    setIdClinicDefault: (state,action) => {
      state.idClinicDefault = action.payload;
    },
    setRoleOfDoctor: (state,action) => {
      state.roleOfDoctor = action.payload;
    },
    setEncryptKeyClinic: (state,action) => {
      state.encryptKeyClinic = action.payload;
    },
    clearClinicSlice: (state) => {
      state.encryptKeyClinic = null;
      state.arrayClinic = null;
      state.idClinicDefault = null;
      state.roleOfDoctor = null;
    }
  }
})

export const {
  setArrayClinic,setIdClinicDefault,setRoleOfDoctor,clearClinicSlice,setEncryptKeyClinic
} = ClinicSlice.actions;

export default ClinicSlice.reducer;