import React, {useState,useEffect} from 'react';

const ReportPaymentModal = ({ removeBlurEffect }) => {
    const handleBlurEffectClose = () => {
        removeBlurEffect(false); 
      };


    return (
        <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title w-100" id="exampleModalLabel">
                            Get Access to full report and much more
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <ul className="list-unstyled mb-4 ms-lg-5">
                            <li className=" mb-2">
                                <span className="me-2" style={{ color: '#00124F' }}>
                                    <i className="bi bi-check-circle-fill"></i>
                                </span>
                                <span>Uncover hidden issues in your PF account</span>
                            </li>
                            <li className=" mb-2">
                                <span className="me-2" style={{ color: '#00124F' }}>
                                    <i className="bi bi-check-circle-fill"></i>
                                </span>
                                <span>Get Physical Report on your WhatsApp Number</span>
                            </li>
                            <li className=" mb-4">
                                <span className="me-2" style={{ color: '#00124F' }}>
                                    <i className="bi bi-check-circle-fill"></i>
                                </span>
                                <span>Free 30 min consultation with PF Expert</span>
                            </li>
                        </ul>
                        <h2 className="fw-bold text-center mb-0 ms-5">₹99/-</h2>
                        <p className="text-muted text-center mb-0 ps-5 ms-5" style={{ fontSize: '0.6rem' }}>
                            Including Taxes
                        </p>
                        <div className='d-flex justify-content-center '>
                            <button
                                className="btn px-4 py-2"
                                // className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={handleBlurEffectClose}
                                style={{
                                    backgroundColor: '#00124F',
                                    color: '#ffffff',
                                    borderRadius: '2rem',
                                }}
                            >
                                Access Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ReportPaymentModal;