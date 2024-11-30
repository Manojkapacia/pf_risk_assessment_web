import React, { useState, useEffect, useCallback } from "react";
import '../../css/auth/login.css';
import '../../App.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ValidationError from '../../components/common/validate-error';
import ToastMessage from '../../components/common/toast-message';
import MESSAGES from '../../components/constants/messages';
import Loader from '../../components/common/loader';
// import { login } from '../../components/common/api';
import staticData from '../helper/raw-data.json';

function AdminLogin() {

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors,setErrors] = useState({});
    const [,setError] = useState();
    const [isFormValid, setIsFormValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message] = useState({ type: "", content: "" });
    const [loading] = useState(false);

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setIsFormValid(Object.values(errors).every((err) => !err) && formData.email && formData.password);
        
        const timer = setTimeout(() => {
            setShowModal(false);
          }, 700);
      
          return () => clearTimeout(timer);
    }, [errors, formData]);

    const validateField = useCallback((field, value) => {
        if (field === "email") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) return MESSAGES.required.requiredField("Email");
            if (!emailPattern.test(value)) return MESSAGES.error.correctEmail;
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
            email: validateField("email", formData.email),
            password: validateField("password", formData.password),
        };

          if (formData.email === staticData.userData.email &&
            formData.password === staticData.userData.password
          ) {
            navigate("/user-details"); 
          } 
          else {
            // Show error message
            setShowModal(true)
            setError("Invalid email or password.");
          }

        setErrors(newErrors);

        // if (Object.values(newErrors).every((err) => !err)) {
        //     try {
        //         setLoading(true);
        //         const result = await login(formData.email, formData.password);
        //         setLoading(false);

        //         if (result.status === 400) {
        //             setMessage({ type: "error", content: result.message });
        //             setTimeout(() => setMessage({ type: "", content: "" }), 2500);
        //         } else {
        //             setMessage({ type: "success", content: MESSAGES.success.otpSent });
        //             setTimeout(() => {
        //                 // navigate("/otpAssessment", { state: { uan: formData.uan } });
        //             }, 2000);
        //         }
        //     } catch (error) {
        //         setLoading(false);
        //         setMessage({ type: "error", content: error.message });
        //         setTimeout(() => setMessage({ type: "", content: "" }), 3000);
        //     }
        // }
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    return (
        <>
            {loading && (
                <Loader
                    type="dots"
                    size="large"
                    color="#28a745"
                    message="Checking credentials, please wait..."
                    overlay={true}
                />
            )}
            <div className="container">
                {message.type && <ToastMessage message={message.content} type={message.type} />}
                <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                    <div className="col-md-5">
                        <div className="pfRiskheading text-center">PF Risk Assessment</div>
                        <div className="pfRiskSubHeading text-center">
                            Check if your PF is at risk of getting stuck
                        </div>

                        <form onSubmit={handleSubmit}
                        >
                            <div className="row mt-2 mt-lg-4">
                                <div className="col-md-12">
                                    <div className="d-flex justify-content-between">
                                        <div className="labelHeading">Email:</div>
                                    </div>
                                    <input
                                        className="form-control mt-2"
                                        type="email"
                                        placeholder="Enter your email id"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <ValidationError message={errors.email} />
                                </div>
                            </div>
                            <div className="row mt-lg-3">
                                <div className="col-md-12">
                                    <div className="labelHeading">Password:</div>
                                    <div className="position-relative">
                                        <input
                                            className="form-control mt-2"
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
                                            aria-label="Toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                                        </span>
                                    </div>
                                    <ValidationError message={errors.password} />
                                </div>
                            </div>
                            {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
                            <div className="row my-2 mt-lg-4">
                                <div className="col-md-12">
                                    <button type="submit" className="btn col-12 pfRiskButtons" disabled={!isFormValid}>
                                        Login
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>

                {showModal && (
                    <div
                        className="modal show d-block"
                        tabIndex="-1"
                        role="dialog"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-body my-4 text-center">
                                    <strong style={{ color: "red" }}>Please Enter the Currect Email 
                                        and Password</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminLogin;