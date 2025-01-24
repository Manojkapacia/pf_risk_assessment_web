import React, { useState } from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import { Telephone } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { zohoRequest } from "./../common/api";
import ToastMessage from '../common/toast-message'
import { FaExclamationCircle } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';

const EpfoDown = () => {
    const [message, setMessage] = useState({ type: "", content: "" });
    const [isDisabled, setIsDisabled] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleClick = () => {
        setIsDisabled(true);
        setTimeout(() => {
            setIsDisabled(false);
        }, 5000);
    };
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        handleClick();
        const formData = {
            ...data,
            Wants_To: "Check Withdraw-ability",
            Lead_Status: "Open",
            Campaign_Id: "6329452000003870254"
        };
        try {
            const result = await zohoRequest(formData);
            if (result.data.data[0].status === "success") {
                const newTabUrl = "https://www.finright.in/submitted-successfully";
                window.open(newTabUrl, "_blank", "noopener,noreferrer");
            } else {
                setMessage({ type: "error", content: result.message });
                setTimeout(() => setMessage({ type: "", content: "" }), 2000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage({ type: "error", content: error.message });
            setTimeout(() => setMessage({ type: "", content: "" }), 2000);
        }
    };

    return (
        <div className="container">
            {message.type && <ToastMessage message={message.content} type={message.type} />}
            <div className="row d-flex justify-content-center align-items-center my-3">
                <div className="col-md-7 col-lg-5">
                    <p className='oppsHeading'>Sir ji on a chai break..</p>
                    <p className='oppsText mb-0'>Looks Like our saheb in EPFO just got up for a Chai.
                        Don’t worry, just retry again, he takes very short breaks
                    </p>
                    <div className='d-flex justify-content-center my-4'>
                        <button className='btn text-center w-50 oppsTryAgainBtn py-2 py-lg-3' onClick={() => navigate("/")}>Try Again!</button>
                    </div>
                    <p className='oppsText' style={{ fontWeight: '300' }}>Or leave your contact with us here and
                        we shall ring you once sirji is back
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            className="form-control oppsInputField"
                            placeholder="Enter Name" autoComplete='off' name="Last_Name"
                            {...register("Last_Name", { required: "Name is required" })} />
                        {errors.Last_Name && <span className="text-danger">{errors.Last_Name.message}</span>}

                        <input
                            type="text"
                            className="form-control oppsInputField mt-3"
                            placeholder="Mobile Number" autoComplete='off' maxLength={10} inputMode="numeric"
                            name="Mobile"
                            {...register("Mobile", {
                                required: "Mobile Number is required",
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Number must be exactly 10 digits",
                                }
                            })}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                            }} />
                        {errors.Mobile && <span className="text-danger">{errors.Mobile.message}</span>}


                        <input
                            type="email"
                            className="form-control oppsInputField mt-3"
                            placeholder="Email" autoComplete='off' name='Email'
                            {...register("Email", {
                                // required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Enter a valid Email" },
                            })} />
                        {errors.Email && <span className="text-danger">{errors.Email.message}</span>}
                        <div className='col-md-12 mt-2 mt-md-3'>
                            <label className='oppsRedioButton'>Where did you hear about us?<span style={{ color: "red" }}>*</span></label>
                            <div className='d-flex flex-wrap justify-content-start mt-1'>
                                <div className="form-check  d-flex aling-item">
                                    <input className="form-check-input custom-radio" type="radio" id="google" value="google"
                                        {...register("Lead_Source", { required: "Please select button" })} />
                                    <label className="form-check-label oppsRedioButton mx-2" htmlFor="google">Google</label>
                                </div>
                                <div className="form-check  d-flex aling-item">
                                    <input className="form-check-input custom-radio" type="radio" id="linkedIn" value="linkedin"
                                        {...register("Lead_Source", { required: "Please select button" })} />
                                    <label className="form-check-label oppsRedioButton mx-2" htmlFor="linkedIn">LinkedIn</label>
                                </div>
                                <div className="form-check d-flex aling-item">
                                    <input className="form-check-input custom-radio" type="radio" id="twitter" value="twitter/X"
                                        {...register("Lead_Source", { required: "Please select button" })} />
                                    <label className="form-check-label oppsRedioButton mx-2" htmlFor="twitter">Twitter/X</label>
                                </div>
                                <div className="form-check  d-flex aling-item">
                                    <input className="form-check-input custom-radio" type="radio" id="justDial" value="justdial"
                                        {...register("Lead_Source", { required: "Please select button" })} />
                                    <label className="form-check-label oppsRedioButton mx-2" htmlFor="justDial">Just Dial</label>
                                </div>
                                <div className="form-check d-flex aling-item">
                                    <input className="form-check-input custom-radio" type="radio" id="youtube" value="youtube"
                                        {...register("Lead_Source", { required: "Please select button" })} />
                                    <label className="form-check-label oppsRedioButton mx-2" htmlFor="youtube">You Tube</label>
                                </div>
                                <div className="form-check d-flex aling-item">
                                    <input className="form-check-input custom-radio" type="radio" id="referred" value="reffered"
                                        {...register("Lead_Source", { required: "Please select button" })} />
                                    <label className="form-check-label oppsRedioButton mx-2" htmlFor="referred">Referred by a Friend</label>
                                </div>
                            </div>
                            {errors.Lead_Source && (
                                <span className="text-danger">{errors.Lead_Source.message}</span>
                            )}


                        </div>
                        <div className="d-flex justify-content-center mt-4">
                            <button className="btn oppsReqCallBtn py-2 py-lg-3"
                               disabled={isDisabled} >
                                {isDisabled ? "Please Wait..." : "Request Call Back"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EpfoDown;