import React from "react";
import { Routes, Route } from 'react-router-dom';
import ForgotPassword from "./auth/ForgotPassword.jsx";
import Login from "./auth/login.jsx";
import Register from "./auth/Register.jsx";
import HomePage from "./pages/HomePage.jsx";
import LibraryImages from "./pages/libraryImages/LibraryImages.jsx";
import MedicalRecord from "./pages/medicalRecord/MedicalRecord.jsx";
import NotFoundPgae from "./pages/NotFoundPage.jsx";
import PatientList from "./pages/patientList/PatientList.jsx";
import Setting from "./pages/setting/Setting.jsx";

function App() {

  return (
    <Routes>
      <Route path="*" element={<NotFoundPgae />} />
      <Route path="/" exact element={<HomePage />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/register" exact element={<Register />} />
      <Route path="/forgotPassword" exact element={<ForgotPassword />} />
      <Route path="/setting" exact element={<Setting />} />
      <Route path="/patientListManagement" exact element={<PatientList />}/>
      <Route path="/medicalRecord" exact element={<MedicalRecord />} />
      <Route path="/libraryImagesManagement" exact element={<LibraryImages />} />
    </Routes>
  );
}

export default App;
