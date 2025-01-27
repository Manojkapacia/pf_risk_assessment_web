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
                const result = await login(formData.uan, formData.password.trim());

                if (result.status === 400) {
                    setLoading(false);
                    setMessage({ type: "error", content: result.message });
                } else {
                    if (result.message === "User Successfully Verified") setMessage({ type: "success", content: result.message });
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
                if (error.status === 401) {
                    setLoading(false);
                    setMessage({ type: "error", content: MESSAGES.error.invalidEpfoCredentials });
                } else if (error.status >= 500) {
                    navigate("/epfo-down")
                } else {
                    setLoading(false);
                    setMessage({ type: "error", content: error.message });
                    // navigate("/epfo-down");
                }
            }
        }
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);


    return (
        <>
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-container">
                        <img className='loader-img' src={loaderGif} alt="Loading..." />
                        <p className="loader-text">Verifying UAN Number and Password</p>
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
                                            <span className='securityText py-2 px-3 d-flex align-items-center' onClick={toggleText} style={{ cursor: "pointer" }}>
                                                <AiOutlineFileProtect style={{ fontSize: "1.2rem", marginRight: "0.4rem" }} />
                                                Your data is 100% safe and secure
                                            </span>
                                        </div>

                                        {isVisible &&
                                            <div className="d-flex justify-content-center my-3">
                                                <div className='d-flex flex-column  align-items-center text-center'>
                                                    <img src={multiFactor} alt="Risk Assessment" className='iconImage ' />
                                                    <span className="iconText">
                                                        Two-Factor Auth
                                                    </span>
                                                </div>
                                                <div className='d-flex flex-column align-items-center text-center mx-5'>
                                                    <img src={Encryption} alt="Risk Assessment" className='iconImage' />
                                                    <span className="iconText">
                                                        End-to-End Encryption
                                                    </span>
                                                </div>
                                                <div className='d-flex flex-column align-items-center text-center'>
                                                    <img src={IPData} alt="Risk Assessment" className='iconImage' />
                                                    <span className="iconText">
                                                        Masking of PI data
                                                    </span>
                                                </div>

                                            </div>
                                        }
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

                    {/* <footer className="gradient-footer text-white">
                        <div className="row d-flex justify-content-between align-items-center">
                            <div className="col-6">
                                <p>Get connected with us on social networks:</p>
                            </div>
                            <div className="col-6 text-end">
                                <a href="https://www.facebook.com" target="_blank" className="text-dark">
                                    <i className="bi bi-facebook" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                                </a>
                                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="mx-3">
                                    <i className="bi bi-twitter fs-1" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                                </a>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="mx-3">
                                    <i className="bi bi-instagram fs-1" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                                </a>
                                <a href="https://www.youtube.com" target="_blank" className="text-danger mx-3">
                                    <i className="bi bi-youtube" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                                </a>
                                <a href="https://www.linkedin.com" target="_blank" className="text-primary mx-3">
                                    <i className="bi bi-linkedin" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                                </a>
                            </div>
                        </div>
                        <hr></hr>
                        
                    </footer> */}

                    <footer className="gradient-footer text-white pt-4 mt-4">
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
                                        <li>Provident Fund</li>
                                        <li>Health Insurance</li>
                                        <li>Term Insurance</li>
                                        <li>Taxation</li>
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
                                            <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                                About Us
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                                Terms & Conditions
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                                Privacy Policy
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                                Refund Policy
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
                    </footer>

                </div>
            </div>


        </>
    );
}

export default LoginComponent;