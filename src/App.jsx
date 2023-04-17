import React, { lazy, Suspense } from "react";
import { Routes, Route } from 'react-router-dom';
import Discussion from "./pages/discussion/Discussion.jsx";
import LateralCeph from "./pages/lateralCephalometricAnalysis/LateralCeph.jsx";
const ForgotPassword = lazy(() => import('./auth/ForgotPassword.jsx'));
const Login = lazy(() => import('./auth/login.jsx'));
const Register = lazy(() => import('./auth/Register.jsx'));
const BigCalendar = lazy(() => import('./pages/calendar/BigCalendar.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LibraryImages = lazy(() => import('./pages/libraryImages/LibraryImages.jsx'));
const MedicalRecord = lazy(() => import('./pages/medicalRecord/MedicalRecord.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))
const PatientList = lazy(() => import('./pages/patientList/PatientList.jsx'));
const Setting = lazy(() => import('./pages/setting/Setting.jsx'));

function App() {
  return (
    <Suspense fallback={
      <div className="h-100 w-100 d-flex justify-content-center align-items-center">
        <span className='loader'></span>
      </div>
    }>
      <Routes>
        <Route path="*" element={<NotFoundPage />}/>
        <Route path="/" exact element={<HomePage />}/>
        <Route path="/login" exact element={<Login />}/>
        <Route path="/register" exact element={<Register />}/>
        <Route path="/forgotPassword" exact element={<ForgotPassword />}/>
        <Route path="/setting" exact element={<Setting />}/>
        <Route path="/patientListManagement" exact element={<PatientList />}/>
        <Route path="/medicalRecord" exact element={<MedicalRecord />}/>
        <Route path="/libraryImagesManagement" exact element={<LibraryImages />}/>
        <Route path="/schedule" exact element={<BigCalendar />}/>
        <Route path="/discussion" exact element={<Discussion />}/>
        <Route path="/lateralCeph" exact element={<LateralCeph />}/>
      </Routes>
    </Suspense>
    
  );
}

export default App;
