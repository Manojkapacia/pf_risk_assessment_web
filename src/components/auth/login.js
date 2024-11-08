import React, { useState, useEffect } from 'react';
import '../../css/auth/login.css';
import '../../App.css';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import { useNavigate } from 'react-router-dom';
import ValidationError from '../common/validate-error';
import ToastMessage from '../common/toast-message';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MESSAGES from '../constants/messages'

function LoginComponent() {
    const [uan, setUan] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ uan: '', password: '' });
    const [isFormValid, setIsFormValid] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the form is valid
        setIsFormValid(!errors.uan && !errors.password && uan && password);
    }, [errors, uan, password]);

    const validateUan = (value) => {
        const uanPattern = /^[0-9]{12}$/;
        if (!value) return MESSAGES.required.requiredField('UAN');
        if (!uanPattern.test(value)) return MESSAGES.error.uanInvalidLength;
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return MESSAGES.required.requiredField('Password');
        if (password.length < 8) return MESSAGES.error.password.length;
        if (!/[A-Z]/.test(password)) return MESSAGES.error.password.upperCase;
        if (!/[a-z]/.test(password)) return MESSAGES.error.password.lowerCase;
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return MESSAGES.error.password.specialCharacter;
        return ''; // No error
    };

    const handleUanChange = (e) => {
        const value = e.target.value;
        setUan(value);
        setErrors((prevErrors) => ({ ...prevErrors, uan: validateUan(value) }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setErrors((prevErrors) => ({ ...prevErrors, password: validatePassword(value) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const uanError = validateUan(uan);
        const passwordError = validatePassword(password);

        if (!uanError && !passwordError) {
            setIsFormValid(true); // Set form as valid
            setShowSuccessToast(true); // Trigger the toast message
            setTimeout(() => {
                navigate("/otpAssessment");
            }, 2000);
        } else {
            setErrors({ uan: uanError, password: passwordError });
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            {showSuccessToast && <ToastMessage message={MESSAGES.success.otpSent} type="success" />}
            <div className="row w-100 mx-2 align-items-center">
                <div className="col-lg-1"></div>
                <div className="col-lg-4 d-flex justify-content-center">
                    <img src={pfRiskImage} alt="Risk Assessment" style={{ maxHeight: "450px", width: "100%" }} />
                </div>
                <div className="col-lg-7 d-flex flex-column justify-content-center align-items-center">
                    <div className="pfRiskheading text-center">PF Risk Assessment</div>
                    <div className="pfRiskSubHeading text-center mb-4">
                        Check if your PF is at risk of getting stuck
                    </div>
                    <form className="w-100 d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                        <div className="row mt-4 w-100 justify-content-center">
                            <div className="col-8">
                                <div className="d-flex justify-content-between">
                                    <div className="labelHeading">UAN number:</div>
                                    <div className="labelSubHeading text-end">Activate UAN</div>
                                </div>
                                <input
                                    className="form-control mt-2"
                                    type="text"
                                    placeholder="Enter your 12 digit UAN number"
                                    value={uan}
                                    onChange={handleUanChange}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                        if (e.target.value.length > 12) {
                                            e.target.value = e.target.value.slice(0, 12); // Limit to 12 digits
                                        }
                                    }}
                                    required
                                />
                                <ValidationError message={errors.uan} />
                                <div className="text-end labelSubHeading mt-2">
                                    I don't know my UAN
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 w-100 justify-content-center">
                            <div className="col-8">
                                <div className="labelHeading">Password:</div>
                                <div className="position-relative">
                                    <input
                                        className="form-control mt-2"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your EPFO password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <span
                                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                                        style={{ cursor: 'pointer', zIndex: 1 }}
                                        onClick={togglePasswordVisibility}
                                    >
                                        {!showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <ValidationError message={errors.password} />
                                <div className="text-end labelSubHeading mt-2">
                                    Forgot Password?
                                </div>
                            </div>
                        </div>


                        <div className="row mt-4 w-100 justify-content-center">
                            <div className="col-8">
                                <button type="submit" className="btn col-12 pfRiskButtons" disabled={!isFormValid}>
                                    Continue
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;