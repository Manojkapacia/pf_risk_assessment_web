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

function LoginComponent() {
    const [formData, setFormData] = useState({ uan: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [loading, setLoading] = useState(false);
    const isMessageActive = useRef(false); // Prevents multiple messages from being displayed at the same time.
    const [isVisible, setIsVisible] = useState(false);

    const toggleText = () => {
      setIsVisible(!isVisible);
    };
    const navigate = useNavigate();

    useEffect(() => {
        setIsFormValid(Object.values(errors).every((err) => !err) && formData.uan && formData.password);
    }, [errors, formData]);

    // Toast Message Auto Clear
    useEffect(() => {
        if (message.type) {
            isMessageActive.current = true; // Set active state when a message is displayed
            const timer = setTimeout(() => {
                setMessage({ type: "", content: "" });
                isMessageActive.current = false; // Reset active state
            }, 2500);
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
                setLoading(false);

                if (result.status === 400) {
                    setMessage({ type: "error", content: result.message });
                } else {
                    setMessage({ type: "success", content: result.message });
                    setTimeout(() => {
                        if (result.message === "User Successfully Verified") {
                            localStorage.setItem("user_uan", formData.uan);                            
                            localStorage.setItem('data-cred-' + formData.uan, encryptData(formData.password))  
                            navigate("/welcome-back", { state: { UAN: formData.uan, Pws: formData.password } })
                        } else {
                            const regMobileNumber = ExtractMobile(result.message)
                            navigate("/otpAssessment", { state: { UAN: formData.uan, Pws: formData.password, type: "", regMobileNumber } });
                        }
                    }, 2000);
                }
            } catch (error) {
                if (error.status === 401) {
                    setLoading(false);
                    setMessage({ type: "error", content: MESSAGES.error.invalidEpfoCredentials });
                } if (error.status >= 500) {
                    navigate("/epfo-down")
                } else {
                    setLoading(false);
                    setMessage({ type: "error", content: error.message });
                    navigate("/epfo-down");
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
                    {/* <div className="col-lg-4 col-md-8">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <SideContent></SideContent>
                            </div>
                        </div>
                    </div> */}
                    <div className="col-lg-5 col-md-8 mt-3 mt-lg-0 ms-0 ms-lg-3">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="pfRiskheading text-center" style={{ fontWeight: "700" }}>
                                    India’s First AI based Provident Fund (PF) Check up</div>
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
                                    {/* <span className='alreadyText'>Already have an account? <span className='loginText'> Login here</span></span> */}
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
                        <div className="d-flex justify-content-center mt-3">
                            <span className='securityText py-2 px-3 d-flex align-items-center' onClick={toggleText} style={{ cursor: "pointer" }}>
                                <img src={dataProtect} alt="Risk Assessment" className='dataImage me-1' />
                                Your privacy is our priority. We take data security seriously
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
                </div>
            </div>
        </>
    );
}

export default LoginComponent;