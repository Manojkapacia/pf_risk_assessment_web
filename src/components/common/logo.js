import logo from '../../assets/images/finright_logo.png';
import React ,{useState} from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import ToastMessage from "./toast-message";
import { useNavigate ,useLocation  } from "react-router-dom";
import {logout} from './api'

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const noButtonPaths = ["/", "/otpAssessment","/activate-uan","/donot-know-uan","/forgot-password"];
  const shouldHideButtons = noButtonPaths.includes(location.pathname);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleLogout = async() => {
    const adminLogin = localStorage.getItem('admin_logged_in');
    if(adminLogin){
      localStorage.removeItem('admin_logged_in');
      navigate('/');
    }else{
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
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      {!shouldHideButtons && (
      <div className="col d-flex justify-content-end">
        <button className="btn me-2" onClick={handleLogout}>
          <ArrowLeft size={17} className="me-1" />Back to Assessment</button>
      </div>
      )}
    </div>

  );
};

export default Logo;
