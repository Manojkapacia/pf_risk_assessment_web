import '../../App.css';
import '../../css/report/report-registation.css';
import React, { useEffect, useState } from 'react';
import ReportCard from "../common/report-card";
import { useLocation, useNavigate } from 'react-router-dom';
import { Whatsapp } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { post } from '../common/api';
import loaderGif from './../../assets/images/login.gif';
import ToastMessage from './../common/toast-message';

function ReportRegistation() {
    const location = useLocation();
    const { profileData, home, listItems, reportUpdatedAtVar} = location.state || {};
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

  
    useEffect(() => {
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan');;
        let value = "report-registation";
        localStorage.setItem(dynamicKey, value);
    }, []);

    
    const onSubmit = async (mobileNumber) => {
        const transformedNumber = {
            ...mobileNumber,
            phoneNumber: `91${mobileNumber.phoneNumber}`,
        };
        try {
            setLoading(true);
            const response = await post('/auth/generate-otp', transformedNumber);
            setLoading(false);
            if (response.status === 401) {
                setLoading(false);
                localStorage.removeItem('user_uan');
                setMessage({ type: "error", content: response.message });
                setTimeout(() => setMessage({ type: "", content: "" }), 2000);
                navigate('/');
            } else {
                setLoading(false);
                setMessage({ type: "success", content: response.message });
                setTimeout(() => setMessage({ type: "", content: "" }), 2000);
                navigate('/report-otp', { state: { profileData, home, mobileNumber, listItems, reportUpdatedAtVar} });
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    }

    return (
        <>
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-container">
                        <img className='loader-img' src={loaderGif} alt="Loading..." />
                        <p className="loader-text">Verifying Mobile Number</p>
                    </div>
                </div>
            )}
            <div className="container">
                {message.type && <ToastMessage message={message.content} type={message.type} />}
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-lg-5 col-md-8 mt-3 mt-lg-0">
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='row'>
                                    <div className='col-md-10 offset-md-1'>
                                        <ReportCard profileData={profileData} homeData={home}></ReportCard>
                                    </div>
                                </div>
                                <div className="text-center mb-4 mt-3">
                                    <p className="welcomeLabelLogin">Your report regeneration is in progress</p>
                                    <p className="pfRiskSubHeading">
                                        Thank you for providing your information, we<br></br> have started preparing your report.
                                    </p>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your WhatsApp number"
                                            autoComplete='off' maxLength={10} inputMode="numeric"
                                            {...register("phoneNumber", {
                                                required: "Whatsapp Number is required",
                                                pattern: {
                                                    value: /^\d{10}$/,
                                                    message: "Number must be exactly 10 digits",
                                                }
                                            })}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                            }}
                                        />
                                        <span className="input-group-text bg-white">
                                            <Whatsapp className="text-success" />
                                        </span>
                                    </div>
                                    {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber.message}</span>}
                                    <div className='text-center mt-3'>
                                        <button className="pfRiskButtons py-2 px-5" type='submit'>
                                            Verify Number
                                        </button>
                                    </div>
                                </form>
                                <div className="text-center mt-4">
                                    <p className="reportWhatsappText">
                                        Please share your Whatsapp number to get report
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Second column  */}
                    <div className="col-lg-4 col-md-8 mt-2 mt-lg-0 ms-0 ms-lg-5 d-none d-md-block">
                        <div className='row'>
                            <div className='col-md-12 bg-image p-0'>
                                <div className='overlayImage text-white'>
                                    <p> Evaluate your provident fund across 25 checks done by EPFO</p>
                                    <p className='my-4'>Know if your money is at risk of getting stuck</p>
                                    <p className='mb-4'>Identify how much of your corpus is blocked by issues</p>
                                    <p>Get an estimated time to resolve these issues</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReportRegistation;