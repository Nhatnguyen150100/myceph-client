import React from "react";
import NavbarComponent from "../component/NavbarComponent.jsx";

export default function HomePage(props) {
  return <div className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
    
    <NavbarComponent />
    <div className="h-100 w-100" style={{
      height: '100%',
      backgroundImage: `url("/assets/images/background.jpg")`,
      backgroundSize: 'cover',
    }}>
      <div className="container h-100">
        <h1 className="utm-avo">Day la Homepage</h1>
      </div>
    </div>
    
  </div>
}