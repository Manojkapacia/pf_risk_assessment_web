import logo from '../../assets/images/finright_logo.png';
import React from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate ,useLocation  } from "react-router-dom";

const Logo = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const noButtonPaths = ["/", "/otpAssessment"];
  const shouldHideButtons = noButtonPaths.includes(location.pathname);

  // Check login state on component mount
  // useEffect(() => {
  //   const loginData = localStorage.getItem(""); 
  //   if (loginData) {
  //     setIsLoggedIn(true); 
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Update login state and navigate to login page
    // setIsLoggedIn(false);
    navigate("/");
  };
  return (
    <div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      {/* {isLoggedIn ? (
        <button className='btn pfRiskButtons float-end me-3 mt-2' onClick={handleLogout}>Logout</button>
         ) : ('')} */}
      {!shouldHideButtons && (
      <div className="col d-flex justify-content-end">
        <button className="btn me-2" onClick={handleLogout}>
        {/* <p>{`You are at: ${location.pathname}`}</p> */}
          <ArrowLeft size={17} className="me-1" /> Back to Assessment</button>
        {/* <button className="btn me-3"
          style={{ cursor: 'pointer' }}>Logout</button> */}
      </div>
      )}
    </div>

  );
};

export default Logo;
