import React, { useState } from "react";
import ToastMessage from "./toast-message";
import { useNavigate, useLocation } from "react-router-dom";
import FinRightlogo from './../../assets/images/FinRightlogo.png'
import { logout } from './api'

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoutButton = ["/", "/activate-uan", "/donot-know-uan", "/forgot-password",
    "/operation/login", "/otpAssessment","/epfo-down"
  ];
  const loginPage= ['/']
  const backToAssessmentButton = ["/activate-uan", "/donot-know-uan", "/forgot-password","/epfo-down"];
  const HideLogoutButtons = logoutButton.includes(location.pathname);
  const backToAssessment = backToAssessmentButton.includes(location.pathname);
  const hideLoginHeader = loginPage.includes(location.pathname);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleLogout = async () => {
    const adminLogin = localStorage.getItem('admin_logged_in');
    if (adminLogin) {
      localStorage.removeItem('admin_logged_in');
      navigate('/');
    } else {
      try {
        const result = await logout();
        localStorage.removeItem('user_uan');
        setMessage({ type: "success", content: result.message });
        setTimeout(() => setMessage({ type: "", content: "" }), 2000);
        navigate('/');
      } catch (error) {
        console.error('Unexpected error during logout:', error);
      }
    }
  };
  return (
    <div>
      {message.type && <ToastMessage message={message.content} type={message.type} />}
      {!hideLoginHeader ? 
        <nav className="d-flex justify-content-between align-items-center p-2 p-md-3" style={{ backgroundColor: "#ffffff" }}>
        <img src={FinRightlogo} alt="Logo" className="logo" />
        <div className="d-flex align-items-center">
          {!HideLogoutButtons && (
            <span
              className="text-end"
              style={{ cursor: 'pointer', color: "blue" }}
              onClick={handleLogout} >
              Log out
            </span>
          )}
          {backToAssessment && (
            <span
              className="text-end"
              style={{ cursor: 'pointer', color: "blue" }}
              onClick={() => navigate("/")}>
              Back
            </span>
          )}
        </div>
      </nav> : ''
      }
      
    </div>
  );
};

export default Logo;
