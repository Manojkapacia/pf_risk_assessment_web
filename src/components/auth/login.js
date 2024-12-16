import React, { useState, useEffect, useCallback } from 'react';
import '../../css/auth/login.css';
import '../../App.css';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import { useNavigate } from 'react-router-dom';
import ValidationError from '../common/validate-error';
import ToastMessage from '../common/toast-message';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MESSAGES from '../constants/messages'
import Loader from '../common/loader';
import { login } from '../common/api';
import loaderGif from './../../assets/images/scanner.gif';
import multiFactor from "../../assets/images/multifactor.png"
import IPData from "../../assets/images/PIdata.png";
import Encryption from "../../assets/images/encryption.png";
import DPDP from "../../assets/images/DPDP.png";
import cloud from "../../assets/images/cloud.png";
import dataProtect from "../../assets/images/dataProtect.png"

function LoginComponent() {
    const [formData, setFormData] = useState({ uan: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setIsFormValid(Object.values(errors).every((err) => !err) && formData.uan && formData.password);
    }, [errors, formData]);

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

        // setLoading(true);
        // setTimeout(() => {
        //     setLoading(false);
        // }, 2000);

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
                    setTimeout(() => setMessage({ type: "", content: "" }), 2500);
                } else {
                    setMessage({ type: "success", content: result.message });
                    setTimeout(() => {
                        setMessage({ type: "", content: "" });
                        if (result.message === "Login successful using local user profile.") {
                            const currentRoute = localStorage.getItem("current_page_" + formData.uan);
                            if (currentRoute == "doc-scan") {
                                navigate("/doc-scan", { state: { UAN: formData.uan } })
                            } else {
                                navigate("/service-history", { state: { UAN: formData.uan } });
                            }
                        } else {
                            navigate("/otpAssessment", { state: { UAN: formData.uan, Pws: formData.password } });
                        }
                    }, 2000);
                }
            } catch (error) {
                setLoading(false);
                setMessage({ type: "error", content: error.message });
                setTimeout(() => setMessage({ type: "", content: "" }), 3000);
            }
        }
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);


    return (
        <div>
            {/* {loading && (
                <Loader
                    type="dots"
                    size="large"
                    color="#28a745"
                    message="Checking credentials, please wait..."
                    overlay={true}
                />
            )} */}
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
                <div className="row d-flex justify-content-center align-items-center vh-100">
                    <div className="col-lg-4 col-md-6 mt-2 mt-lg-0">
                        {/* <img src={pfRiskImage} alt="Risk Assessment" className='pfRiskLoginImage' /> */}
                        <div className='welcomeLabelLogin'>
                            Welcome to India's First<br></br> Digital PF check up
                        </div>
                        <div className='EpfText mt-4 mb-3'>
                            Please login using your EPF UAN and<br></br> Password to begin the check up
                        </div>
                        <div className="d-flex justify-content-start">
                        <span className='securityText py-2 px-3 d-flex align-items-center'>
                        <img src={dataProtect} alt="Risk Assessment" className='dataImage me-1'/>
                            We have implemented 5 tier security to keep youe data protected</span>
                        </div>
                        <div className="d-flex justify-content-start mt-3">
                            <div className='d-flex flex-column  align-items-center text-center'>
                                <img src={multiFactor} alt="Risk Assessment" className='iconImage '/>
                                <span className="iconText">Multi Factor Authentication</span>
                            </div>
                            <div className='d-flex flex-column align-items-center text-center'>
                                <img src={IPData} alt="Risk Assessment" className='iconImage' />
                                <span className="iconText">Encrypting and Masking PI Data</span>
                            </div>
                            <div className='d-flex flex-column align-items-center text-center'>
                                <img src={Encryption} alt="Risk Assessment" className='iconImage' />
                                <span className="iconText">End to End Encryption</span>
                            </div>
                            <div className='d-flex flex-column align-items-center text-center'>
                                <img src={DPDP} alt="Risk Assessment" className='iconImage' />
                                <span className="iconText">Adherence to DPDP Act 2024</span>
                            </div>
                            <div className='d-flex flex-column align-items-center text-center'>
                                <img src={cloud} alt="Risk Assessment" className='iconImage' />
                                <span className="iconText">Highly Secure cloud infrastructure</span>
                            </div>

                        </div>

                    </div>
                    <div className="col-lg-6 col-md-8">
                        <div className="row">
                            <div className="col-md-11 offset-md-1">
                                <div className="pfRiskheading text-center">PF Risk Assessment</div>
                                <div className="pfRiskSubHeading text-center">
                                    Check if your PF is at risk of getting stuck
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row mt-2 mt-lg-4">
                                <div className="col-md-11 offset-md-1">
                                    <div className="d-flex justify-content-between">
                                        <div className="loginLabel">UAN number:</div>
                                        <div className="labelSubHeading text-end">
                                            <span style={{ cursor: 'pointer' }}
                                                onClick={() => navigate("/activate-uan")}>Activate UAN
                                            </span>
                                        </div>
                                    </div>
                                    <input
                                        className="form-control uanNumber mt-2"
                                        type="text"
                                        placeholder="Enter your 12 digit UAN number"
                                        name="uan"
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
                                <div className="col-md-11 offset-md-1">
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
                                    <span className='alreadyText'>Already have an account? <span className='loginText'> Login here</span></span>
                                </div>
                            </div>


                            <div className="row my-2 mt-lg-4">
                                <div className="col-md-11 offset-md-1">
                                    <button type="submit" className="btn col-12 pfRiskButtons" disabled={!isFormValid}>
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;