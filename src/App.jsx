import React from "react";
import { Routes, Route } from 'react-router-dom';
import ForgotPassword from "./auth/ForgotPassword.jsx";
import Login from "./auth/login.jsx";
import Register from "./auth/Register.jsx";
import HomePage from "./pages/HomePage.jsx";
import MedicalRecord from "./pages/medicalRecord/MedicalRecord.jsx";
import PatientList from "./pages/patientList/PatientList.jsx";
import Setting from "./pages/setting/Setting.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="/patientList" element={<PatientList />} />
      <Route path="/medicalRecord" element={<MedicalRecord />} />
    </Routes>
  );
}

export default App;
