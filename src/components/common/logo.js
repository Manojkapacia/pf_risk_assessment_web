import logo from '../../assets/images/finright_logo.png';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login state on component mount
  useEffect(() => {
    const loginData = localStorage.getItem(""); // Example key
    if (loginData) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is logged out
    }
  }, []);

  const handleLogout = () => {
    // Clear local storage and cookies
    localStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Update login state and navigate to login page
    setIsLoggedIn(false);
    navigate("/");
  };
  return (
    <div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      {isLoggedIn ? (
        <button className='btn pfRiskButtons float-end me-3 mt-2' onClick={handleLogout}>Logout</button>
         ) : ('')}

    </div>

  );
};

export default Logo;
