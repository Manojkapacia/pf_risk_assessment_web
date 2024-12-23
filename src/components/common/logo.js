import logo from '../../assets/images/finright_logo.png';
import React ,{useState} from "react";
import ToastMessage from "./toast-message";
import { useNavigate ,useLocation  } from "react-router-dom";
import {logout} from './api'

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const noButtonPaths = ["/","/activate-uan","/donot-know-uan","/forgot-password",
    "/operation/login"
  ];
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
        {/* <img src={logo} alt="Logo" className="logo" /> */}
      </div>
      {!shouldHideButtons && (
      // <div className="col d-flex justify-content-end">
      //   <button className="btn btn-info me-2 mt-2" onClick={handleLogout}>
      //     Log out
      //   </button>
      // </div>
      <span
                className="position-absolute top-0 end-0 m-3 text-end backAssesment"
                style={{ cursor: 'pointer' }} onClick={handleLogout}>
                Log out
            </span>
      )}
    </div>

  );
};

export default Logo;
