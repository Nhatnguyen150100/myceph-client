import React from "react";
import { Routes, Route } from 'react-router-dom';
import ForgotPassword from "./auth/ForgotPassword.jsx";
import Login from "./auth/login.jsx";
import Register from "./auth/Register.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
