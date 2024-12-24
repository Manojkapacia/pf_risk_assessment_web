import logo from '../../assets/images/finright_logo.png';
import React, { useState } from "react";
import ToastMessage from "./toast-message";
import { useNavigate, useLocation } from "react-router-dom";
import FinRightlogo from './../../assets/images/FinRightlogo.png'
import { logout } from './api'

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const noButtonPaths = ["/", "/activate-uan", "/donot-know-uan", "/forgot-password",
    "/operation/login"
  ];
  const shouldHideButtons = noButtonPaths.includes(location.pathname);
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
      {!shouldHideButtons && (
        <header style={headerStyle}>
           <img src={FinRightlogo} alt="Logo" className="logo" />
          <span
            className="text-end"
            style={{ cursor: 'pointer', color: "blue" }} onClick={handleLogout}>
            Log out
          </span>
        </header>
      )}
    </div>

  );
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1.5rem 0.9rem",
  backgroundColor: "#ffffff",
  borderBottom: "2px solid #ddd",
};

export default Logo;
