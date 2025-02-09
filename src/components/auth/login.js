import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../../css/auth/login.css';
import '../../App.css';
import './../../css/common/side-content.css';
import './../common/loader.css';
import { useNavigate } from 'react-router-dom';
import ValidationError from '../common/validate-error';
import ToastMessage from '../common/toast-message';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MESSAGES from '../constants/messages'
import { login } from '../common/api';
import loaderGif from './../../assets/images/login.gif';
import { ExtractMobile } from '../common/extract-mobile';
import multiFactor from '../../assets/images/multifactor.png';
import IPData from '../../assets/images/PIdata.png';
import Encryption from '../../assets/images/encryption.png';
import dataProtect from '../../assets/images/dataProtect.png';
import { encryptData } from '../common/encryption-decryption';
import { AiOutlineFileProtect } from "react-icons/ai";
import finRightLogo from './../../assets/images/finRight.png';
import backgroundImage from './../../assets/images/backgroundLogin.svg';
import footerImage from '../../assets/images/footerImage.jpg'
import thumbPrimary from './../../assets/images/thumbPrimary.svg';
import thumbSuccess from './../../assets/images/thumbSuccess.svg'
import thumbError from './../../assets/images/thumbError.svg'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function LoginComponent() {
    const [formData, setFormData] = useState({ uan: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [loading, setLoading] = useState(false);
    const isMessageActive = useRef(false); // Prevents multiple messages from being displayed at the same time.
    const [isVisible, setIsVisible] = useState(false);
    const [showIframe, setShowIframe] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);
    const [color, setColor] = useState("#004B9A");
    const [imageSrc, setImageSrc] = useState(thumbPrimary);

    const toggleText = () => {
        setIsVisible(!isVisible);
    };
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    useEffect(() => {
        setIsFormValid(Object.values(errors).every((err) => !err) && formData.uan && formData.password);
    }, [errors, formData]);

    const termsCondition = () => {
        setShowIframe(true);
    }
    const handleCloseIframe = () => {
        setShowIframe(false);
    };

    // Toast Message Auto Clear
    useEffect(() => {
        if (message.type) {
            isMessageActive.current = true; // Set active state when a message is displayed
            const timer = setTimeout(() => {
                setMessage({ type: "", content: "" });
                isMessageActive.current = false; // Reset active state
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const validateField = useCallback((field, value) => {
        if (field === "uan") {
            const uanPattern = /^[0-9]{12}$/;
            if (!value) return MESSAGES.required.requiredField("UAN");
            if (!uanPattern.test(value)) return MESSAGES.error.uanInvalidLength;
        }

        if (field === "password") {
            if (!value) return MESSAGES.required.requiredField("Password");
            if (value.length < 8) return MESSAGES.error.password.length;
            if (!/[A-Z]/.test(value)) return MESSAGES.error.password.upperCase;
            if (!/[a-z]/.test(value)) return MESSAGES.error.password.lowerCase;
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return MESSAGES.error.password.specialCharacter;
        }

        return "";
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            uan: validateField("uan", formData.uan),
            password: validateField("password", formData.password),
        };
        setErrors(newErrors);

        if (Object.values(newErrors).every((err) => !err)) {
            try {
                setLoading(true);
                startProgress();
                const result = await login(formData.uan, formData.password.trim());
                if (result.status === 400) {
                    setColor('#FF0000');
                    setImageSrc(thumbError);
                    setTimeout(() => {
                        setLoading(false);
                    }, 3000);
                    setMessage({ type: "error", content: result.message });
                } else {

                    if (result.message === "User Successfully Verified") setMessage({ type: "success", content: result.message });
                    setColor('green');
                    setImageSrc(thumbSuccess);
                    setTimeout(() => {
                        if (result.message === "User Successfully Verified") {
                            localStorage.setItem("user_uan", formData.uan);
                            localStorage.setItem('data_cred_' + formData.uan, encryptData(formData.password))
                            navigate("/service-history");
                        } else {
                            const regMobileNumber = ExtractMobile(result.message)
                            navigate("/otpAssessment", { state: { UAN: formData.uan, Pws: formData.password, type: "", regMobileNumber } });
                        }
                        setLoading(false);
                    }, 3000);
                }
            } catch (error) {
                setColor('#FF0000');
                setImageSrc(thumbError);
                setTimeout(() => {
                    setLoading(false);
                }, 3000);
                if (error.status === 401) {
                    setMessage({ type: "error", content: MESSAGES.error.invalidEpfoCredentials });
                } else if (error.status >= 500) {
                    navigate("/epfo-down")
                } else {
                    setMessage({ type: "error", content: error.message });
                    // navigate("/epfo-down");
                }
            }
        }
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const startProgress = () => {
        setProgress(0); // Reset progress
        setImageSrc(thumbPrimary);
        setColor("#004B9A");
        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    //   clearInterval(intervalRef.current);
                    //   intervalRef.current = null;
                    return 0;
                }
                return prev + 1;
            });
        }, 100);
    };

    return (
        <>
            {loading && (
                // <div className="loader-overlay">
                //     <div className="loader-container">
                //         <img className='loader-img' src={loaderGif} alt="Loading..." />
                //         <p className="loader-text">Verifying UAN Number and Password</p>
                //     </div>
                // </div>
                <div className="loader-overlay vh-100">
                    <div className="loader-container">
                        <div style={{ position: "relative", width: "9rem", height: "9rem" }}>
                            <CircularProgressbar
                                value={progress}
                                strokeWidth={5}
                                styles={buildStyles({
                                    pathColor: color,
                                    trailColor: "#d6d6d6",
                                    strokeLinecap: "round",
                                })}
                            />
                            <img
                                className="loader-img"
                                src={imageSrc}
                                alt="Loading..."
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: "6rem",
                                    height: "6rem",
                                }}
                            />
                        </div>
                        <p className="loader-text">
                            {imageSrc === thumbPrimary &&
                                <span>Verifying Credentials, Please Wait...</span>
                            }
                            {imageSrc === thumbSuccess &&
                                <span>Success!</span>
                            }
                            {imageSrc === thumbError &&
                                <span>Login Failed</span>
                            }
                        </p>
                    </div>
                </div>
            )}
            <div className="container-fluid"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100vh',
                    width: '100%',
                }}
            >
                {message.type && <ToastMessage message={message.content} type={message.type} />}
                <div className="row d-flex justify-content-center align-items-center h-100" style={{ marginTop: '5rem' }}>
                    <div className="col-lg-5 col-md-8">
                        {/* <div className="loader-container">
                            <div className="loader">
                                <img
                                    src={thumbPrimary}
                                    alt="Loader Icon"
                                    className="loader-image"
                                />
                            </div>
                        </div> */}

                        <div className='card shadow-sm position-relative'>
                            <img
                                src={finRightLogo}
                                alt="FinRight Logo"
                                className="rounded-circle finRightImage position-absolute start-50 translate-middle"
                            />
                            <p className="pfRiskheading text-center" style={{ marginTop: '4rem' }}>
                                Check if Your Provident Fund (PF) is <br></br>Accessible and Withdrawable
                            </p>
                            <p className="pfRiskSubHeading text-center">
                                Login with your EPF UAN and Password
                            </p>
                            <form className='px-3' onSubmit={handleSubmit}>
                                <div className='row'>
                                    <div className='col-md-10 offset-md-1'>
                                        <label className="loginLabel">UAN Number:</label>
                                        <input className="form-control uanNumber mt-2"
                                            type="number"
                                            placeholder="Enter your 12 digit UAN number"
                                            name="uan"
                                            autoComplete='off'
                                            value={formData.uan}
                                            onChange={handleInputChange}
                                            maxLength={12}
                                            required />
                                        <ValidationError message={errors.uan} />
                                        <div className="text-end labelSubHeading mt-2" >
                                            <span style={{ cursor: 'pointer' }}
                                                onClick={() => navigate("/donot-know-uan")}>I don't know my UAN
                                            </span>
                                        </div>

                                        <label className="loginLabel">Password:</label>
                                        <div className="position-relative">
                                            <input
                                                className="form-control uanNumber mt-2"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your EPFO password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <span
                                                className="position-absolute top-50 end-0  translate-middle-y me-3"
                                                style={{ cursor: 'pointer', zIndex: 1 }}
                                                onClick={togglePasswordVisibility}
                                                aria-label="Toggle password visibility"
                                            >
                                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                        </div>
                                        <ValidationError message={errors.password} />
                                        <div className="text-end labelSubHeading mt-2" >
                                            <span style={{ cursor: 'pointer' }}
                                                onClick={() => navigate("/forgot-password")}>Forgot Password?
                                            </span>
                                        </div>

                                        <div className="d-flex justify-content-center mt-3">
                                            <button
                                                type="submit" style={{ fontSize: '1rem', padding: '0.5rem 5rem' }}
                                                className="btn btn-lg pfRiskButtons" disabled={!isFormValid}>
                                                Login
                                            </button>
                                        </div>

                                        <div className='text-center'>
                                            <span className='d-inline-block termCondition mt-1'>
                                                By Log in, you agree to our
                                                <span style={{ color: '#304DFF', cursor: 'pointer' }} onClick={termsCondition}> Terms & Conditions</span>
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-center mt-3 mb-4">
                                            <span className='securityText py-2 px-3 d-flex align-items-center' onClick={toggleText} style={{ cursor: "pointer"}}>
                                                <AiOutlineFileProtect style={{ fontSize: "1.2rem", marginRight: "0.4rem" }} />
                                                Your Data is SHA256 Protected
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </form>

                        </div>
                    </div>
                    {showIframe && (
                        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                            <div className="modal-dialog modal-xl modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Terms & Conditions</h5>
                                        <button type="button" className="btn-close" onClick={handleCloseIframe}></button>
                                    </div>
                                    <div className="modal-body">
                                        <iframe
                                            src="https://www.finright.in/terms-conditions"
                                            style={{
                                                width: "100%",
                                                height: "30rem",
                                                border: "none",
                                            }}
                                            title="Iframe Example"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

{!loading && <footer className="gradient-footer text-white pt-4 mt-4">
                        <div className="container mb-3">
                            <div className="mb-3 border-bottom pb-4">
                                <div className="mx-4 d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
                                    <p className="mb-2 mb-md-0">
                                        Get connected with us on social networks:
                                    </p>
                                    <div>
                                        <a
                                            href="https://www.facebook.com/people/Finright/61550330213881/?mibextid=ZbWKwL"
                                            target="_blank"
                                            className="text-white me-3"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="bi bi-facebook"></i>
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/company/finright-technologies/"
                                            target="_blank"
                                            className="text-white me-3"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="bi bi-linkedin"></i>
                                        </a>
                                        <a
                                            href="https://www.instagram.com/askfinright/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D#"
                                            target="_blank"
                                            className="text-white me-3"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="bi bi-instagram"></i>
                                        </a>
                                        <a
                                            href="https://www.youtube.com/@FinRight"
                                            target="_blank"
                                            className="text-white me-3"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="bi bi-youtube"></i>
                                        </a>
                                        <a
                                            href="https://x.com/FinRight"
                                            target="_blank"
                                            className="text-white"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="bi bi-twitter"></i>
                                        </a>
                                    </div>
                                </div>

                            </div>

                            <div className="row d-flex justify-content-center">
                                <div className="col-md-3 mb-3">
                                    <h5>FINRIGHT TECHNOLOGIES PVT LTD.</h5>
                                    <p>One-stop destination for all your financial queries and troubles</p>
                                    <p>CIN: U62099MH2024PTC418141</p>
                                    <img className='rounded mb-2' src={footerImage} />
                                    <p>Certificate No: DIPP167516</p>
                                </div>
                                <div className="col-md-2 mb-3">
                                    <h5>SERVICES</h5>
                                    <ul className="list-unstyled">
                                        <li>
                                            <a href="https://finright.in/service" target="_blank" className="text-white" style={{ textDecoration: 'none' }}>
                                                Provident Fund
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://finright.in/service" target="_blank" className="text-white" style={{ textDecoration: 'none' }}>
                                                Health Insurance
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://finright.in/service" target="_blank" className="text-white" style={{ textDecoration: 'none' }}>
                                                Term Insurance
                                            </a></li>
                                        <li>
                                            <a href="https://finright.in/service" target="_blank" className="text-white" style={{ textDecoration: 'none' }}>
                                                Taxation
                                            </a></li>
                                    </ul>
                                </div>
                                <div className="col-md-2 mb-3">
                                    <h5>USEFUL LINKS</h5>
                                    <ul className="list-unstyled">
                                        <li>
                                            <a href="http://finright.in" target="_blank" className="text-white" style={{ textDecoration: 'none' }}>
                                                Home
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://finright.in/about-us" target="_blank" className="text-white" style={{ textDecoration: 'none' }}>
                                                About Us
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://finright.in/terms-conditions" className="text-white" target="_blank" style={{ textDecoration: 'none' }}>
                                                Terms & Conditions
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://finright.in/privacy-policy" className="text-white" target="_blank" style={{ textDecoration: 'none' }}>
                                                Privacy Policy
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://finright.in/refund-policy" className="text-white" target="_blank" style={{ textDecoration: 'none' }}>
                                                Refund Policy
                                            </a>
                                        </li>
                                        <li>
                                            <a onClick={() => navigate("/pricing")} target="_blank" className="text-white" style={{ textDecoration: 'none',cursor:'pointer' }}>
                                                 Pricing 
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <h5>CONTACT</h5>
                                    <p className="d-flex align-items-start">
                                        <i className="bi bi-geo-alt-fill me-2"></i>
                                        <span>201, Ehsan House, Above ICICI Bank, Off Chandavarkar Road, R C Patel Road, Borivali (West), Mumbai 400092</span>
                                    </p>
                                    <p className="d-flex align-items-start">
                                        <i className="bi bi-envelope-fill me-2"></i>
                                        <span>support@finright.in</span>
                                    </p>
                                    <p className="d-flex align-items-start">
                                        <i className="bi bi-telephone-fill me-2"></i>
                                        <span>+91 95134 46193</span>
                                    </p>
                                </div>

                            </div>

                            <div className="d-flex justify-content-center align-items-center mt-4">
                                <p className="mb-0">
                                    &copy; {currentYear} Copyright: FINRIGHT TECHNOLOGIES PVT LTD.
                                </p>
                            </div>
                        </div>
                    </footer>} 
                    

                </div>
            </div>


        </>
    );
}

export default LoginComponent;