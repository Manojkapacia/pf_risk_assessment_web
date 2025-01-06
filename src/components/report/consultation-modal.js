import React from "react";
import consaltanceImage from './../../assets/images/consaltance.png'

function ConsultationModal({ isOpen, onClose }) {
    const afternoonTime = ['12:00 PM', '12:30 PM', '01:00 PM',
        '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM']
    const eveningTime = ['04:00 PM', '04:30 PM', '05:00 PM',
        '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM']
    const closeModel = () => {
        onClose();
    }
    if (!isOpen) return null; // Don't render the modal if it's not open
    const overlayStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    return (
        <div style={overlayStyle}>
            <div className="modal modal-overlay fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-title" style={{ fontSize: '1.5rem', fontWeight: '600' }}>The Provident Fund Support You Deserve</p>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModel}></button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row d-flex justify-content-center align-items-center">

                                    <div className="col-lg-6 mt-3 mt-lg-0">
                                        <div className="card p-4 shadow-lg" style={{
                                            backgroundColor: "#002366", borderRadius: "1.5rem",
                                            color: "#ffffff", border: "0.3rem solid black"
                                        }}>
                                            <h3 className="text-center mb-4">Talk To Top PF Experts</h3>
                                            <div className="row align-items-center">
                                                <div className="col-md-5 text-center">
                                                    <img
                                                        src={consaltanceImage}
                                                        alt="Experts Illustration" height={'170rem'} width={'170rem'}
                                                    />
                                                </div>
                                                <div className="col-md-7">
                                                    <ul className="list-unstyled">
                                                        <li className="d-flex align-items-center mb-3">
                                                            <i className="bi bi-patch-check-fill fs-4 me-3 text-success"></i>
                                                            <span>Get quick resolution on your PF issue</span>
                                                        </li>
                                                        <li className="d-flex align-items-center mb-3">
                                                            <i className="bi bi-speedometer2 fs-4 me-3 text-warning"></i>
                                                            <span>Get help on faster withdrawal process</span>
                                                        </li>
                                                        <li className="d-flex align-items-center mb-3">
                                                            <i className="bi bi-chat-square-dots-fill fs-4 me-3 text-info"></i>
                                                            <span>Talk to expert and avoid claim rejections</span>
                                                        </li>
                                                        <li className="d-flex align-items-center">
                                                            <i className="bi bi-shield-exclamation fs-4 me-3 text-danger"></i>
                                                            <span>Uncover hidden issues in your PF account</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mt-3 mt-lg-0">
                                        <h4 className="mb-4">Book A Slot</h4>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="datePicker">Choose A Date</label>
                                            <div className="input-group">
                                                {/* <span className="input-group-text">
                                                    <i className="bi bi-calendar-event"></i>
                                                </span> */}
                                                <input
                                                    type="date"
                                                    id="datePicker"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Select Time</label>
                                            <div className="mb-2">
                                                <p>Afternoon</p>
                                                <div className="d-flex flex-wrap mt-2">
                                                    {afternoonTime.map((time, index) => (
                                                        <button key={index} className='btn border border-1 m-1' >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mb-2">
                                                <p>Evening</p>
                                                <div className="d-flex flex-wrap mt-2">
                                                    {eveningTime.map((time, index) => (
                                                        <button key={index} className="btn border border-1 m-1">
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className="btn btn-dark">
                                                Schedule Appointment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConsultationModal;