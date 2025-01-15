import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../../css/auth/login.css';
import '../../App.css';
import './../../css/common/side-content.css'
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
                            localStorage.setItem('data-cred-' + formData.uan, encryptData(formData.password))
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
            <div className="container">
                {message.type && <ToastMessage message={message.content} type={message.type} />}
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-lg-5 col-md-8 mt-3 mt-lg-0 ms-0 ms-lg-3">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="pfRiskheading text-center" style={{ fontWeight: "700" }}>
                                    Check if Your Provident Fund (PF) is Accessible and Withdrawable</div>
                                <div className="pfRiskSubHeading text-center" style={{ color: "#000000" }}>
                                    Login with your EPF UAN and Password
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row mt-2 mt-lg-4">
                                <div className="col-md-12">
                                    <div className="d-flex justify-content-between">
                                        <div className="loginLabel">UAN Number:</div>
                                        <div className="labelSubHeading text-end">
                                            <span style={{ cursor: 'pointer' }}
                                                onClick={() => navigate("/activate-uan")}>Activate UAN
                                            </span>
                                        </div>
                                    </div>
                                    <input
                                        className="form-control uanNumber mt-2"
                                        type="number"
                                        placeholder="Enter your 12 digit UAN number"
                                        name="uan"
                                        autoComplete='off'
                                        value={formData.uan}
                                        onChange={handleInputChange}
                                        maxLength={12}
                                        required
                                    />
                                    <ValidationError message={errors.uan} />
                                    <div className="text-end labelSubHeading mt-2" >
                                        <span style={{ cursor: 'pointer' }}
                                            onClick={() => navigate("/donot-know-uan")}>I don't know my UAN
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-lg-3">
                                <div className="col-md-12">
                                    <div className="loginLabel">Password:</div>
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
                                            className="position-absolute top-50 end-0 translate-middle-y me-3"
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
                                            onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
                                    </div>
                                </div>
                            </div>


                            <div className="row my-2 mt-lg-4">
                                <div className="col-md-12">
                                    <button type="submit" className="btn col-12 pfRiskButtons" disabled={!isFormValid}>
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className='text-center'>
                            <span className='d-inline-block mt-1' style={{ fontSize: '1rem' }}>
                                By clicking continue, you agree to our
                                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={termsCondition}> Terms & Conditions</span>
                            </span>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <span className='securityText py-2 px-3 d-flex align-items-center' onClick={toggleText} style={{ cursor: "pointer" }}>
                               <AiOutlineFileProtect style={{ fontSize: "1.2rem", marginRight: "0.4rem" }} />
                                Your data is 100% safe and secure
                            </span>
                        </div>
                        {isVisible &&
                            <div className="d-flex justify-content-center mt-3">
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

                </div>
            </div>
        </>
    );
}

export default LoginComponent;