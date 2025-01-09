import React, { useState } from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import { Telephone } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { zohoRequest } from "./../common/api";
import ToastMessage from '../common/toast-message'
import { FaExclamationCircle } from "react-icons/fa";

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

    const onSubmit = async (data) => {
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
        <div className="container-fluid">
            {message.type && <ToastMessage message={message.content} type={message.type} />}
            <div className="row mx-2 d-flex justify-content-center align-items-center">
                {/* <div className="col-md-4 col-lg-4 text-center  mt-2 mt-md-0 mb-3 mb-lg-0">
                    <SideContent></SideContent>
                </div> */}
                <div className="col-md-7 col-lg-6">
                    <div className='row'>
                        <div className='col-md-10'>
                            <card className="card bg-white p-3 shadow-sm">
                                <div className='d-flex align-items-center'>
                                    <FaExclamationCircle className='text-danger' style={{ fontSize: '1.2rem', marginRight: '0.7rem' }} />
                                    <span className="text-danger">Looks like EPFO Servers are down. </span>
                                </div>
                                <p className="text-danger mt-4" style={{ marginLeft: '1.8rem' }}>​Please try again after sometime or you can share your contact
                                    details and our expert will call you back.
                                </p>
                            </card>
                            {/* <span className='epfoLabel'>Oops! Looks like EPF servers are down,</span><br></br>
                            <span className='epfoLabel ' style={{ color: '#2460DA' }}>FinRight is still Up</span><br></br>
                            <span className='labelText '>Leave your Details with us and we will call back to discuss your case</span> */}
                        </div>
                    </div>
                    <div className='row mt-md-4 mt-2'>
                        <div className='col-md-10'>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <label className='epfoFormlabel'>Name<span style={{ color: "red" }}>*</span></label>
                                        <input type='text' className='form-control' placeholder='Eg-Robert' autoComplete='off'
                                            name="Last_Name"
                                            {...register("Last_Name", { required: "Name is required" })} />
                                        {errors.Last_Name && <span className="text-danger">{errors.Last_Name.message}</span>}
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='epfoFormlabel'>Mobile number<span style={{ color: "red" }}>*</span></label>
                                        <input type='tel' className='form-control' placeholder='Eg-00000 00000'
                                            autoComplete='off' maxLength={10} inputMode="numeric"
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
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='epfoFormlabel'>Email</label>
                                        <input type='email' className='form-control' placeholder='loramid@gmail.com'
                                            autoComplete='off' name='Email'
                                            {...register("Email", {
                                                // required: "Email is required",
                                                pattern: { value: /^\S+@\S+$/i, message: "Enter a valid Email" },
                                            })} />
                                        {errors.Email && <span className="text-danger">{errors.Email.message}</span>}
                                    </div>
                                    {/* <div className='col-md-12 mt-2 mt-md-4'>
                                    <label className='epfoFormlabel'>I want to :</label><br></br>
                                    <select className="form-select-sm w-100" style={{border:'1px solid #dee2e6'}} aria-label="Default select example">
                                        <option className='epfoFormlabel'>Select an option</option>
                                        <option className='epfoFormlabel' value="1">Withdraw PF(Partial)</option>
                                        <option className='epfoFormlabel' value="2">Withdraw PF(Full)</option>
                                        <option className='epfoFormlabel' value="3">Transfer and Accumulate</option>
                                        <option className='epfoFormlabel' value="4">Check Withdraw-ability</option>
                                    </select>
                                </div> */}
                                    <div className='col-md-12 mt-2 mt-md-4'>
                                        <label className='iconHeading'>Where did you hear about us?<span style={{ color: "red" }}>*</span></label>
                                        <div className='d-flex flex-wrap justify-content-start mt-1'>
                                            <div className="form-check  d-flex aling-item">
                                                <input className="form-check-input custom-radio" type="radio" id="google" value="google"
                                                    {...register("Lead_Source", { required: "Please select button" })} />
                                                <label className="form-check-label iconHeading mx-2" htmlFor="google">Google</label>
                                            </div>
                                            <div className="form-check  d-flex aling-item">
                                                <input className="form-check-input custom-radio" type="radio" id="linkedIn" value="linkedin"
                                                    {...register("Lead_Source", { required: "Please select button" })} />
                                                <label className="form-check-label iconHeading mx-2" htmlFor="linkedIn">LinkedIn</label>
                                            </div>
                                            <div className="form-check d-flex aling-item">
                                                <input className="form-check-input custom-radio" type="radio" id="twitter" value="twitter/X"
                                                    {...register("Lead_Source", { required: "Please select button" })} />
                                                <label className="form-check-label iconHeading mx-2" htmlFor="twitter">Twitter/X</label>
                                            </div>
                                            <div className="form-check  d-flex aling-item">
                                                <input className="form-check-input custom-radio" type="radio" id="justDial" value="justdial"
                                                    {...register("Lead_Source", { required: "Please select button" })} />
                                                <label className="form-check-label iconHeading mx-2" htmlFor="justDial">Just Dial</label>
                                            </div>
                                            <div className="form-check d-flex aling-item">
                                                <input className="form-check-input custom-radio" type="radio" id="youtube" value="youtube"
                                                    {...register("Lead_Source", { required: "Please select button" })} />
                                                <label className="form-check-label iconHeading mx-2" htmlFor="youtube">You Tube</label>
                                            </div>
                                            <div className="form-check d-flex aling-item">
                                                <input className="form-check-input custom-radio" type="radio" id="referred" value="reffered"
                                                    {...register("Lead_Source", { required: "Please select button" })} />
                                                <label className="form-check-label iconHeading mx-2" htmlFor="referred">Referred by a Friend</label>
                                            </div>
                                        </div>
                                        {errors.Lead_Source && (
                                            <span className="text-danger">{errors.Lead_Source.message}</span>
                                        )}


                                    </div>
                                    <div className='col-md-12 mt-md-4 my-2 d-md-flex justify-content-md-start d-flex justify-content-center'>
                                        <button className='requestButton px-3 py-1' type="submit"
                                            disabled={isDisabled} onClick={handleClick}>
                                            <Telephone className='me-2 mb-1' size={13} title="Phone Icon" />
                                            {isDisabled ? "Please Wait..." : "Request a call"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EpfoDown;