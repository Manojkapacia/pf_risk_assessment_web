import React, {useState} from "react";
import './../../css/auth/select-service.css';
import { useNavigate } from 'react-router-dom';
import { FaHandshake } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FaBuilding } from 'react-icons/fa';  
import MESSAGES from "../constants/messages";


function SelectService() {
    const [isClickedFirst, setIsClickedFirst] = useState(false);
    
    const navigate = useNavigate();

    const handleClickFirst = () => {
        console.log(isClickedFirst)
        if(!isClickedFirst){
            setIsClickedFirst(true);
            window.open(MESSAGES.api.baseUrl, '_blank'); 
        } else {
            navigate('/')
        }
    };

    return (
        <div className="container text-center my-5">
            <h2 className="fw-bold text-primary ">Select a Service based on your EPF issue</h2>
            <p className="text-muted mb-5" style={{ fontSize: "1.2rem" }}>10K+ professionals have successfully resolved their EPF issues with FinRight</p>

            <div className="row g-4">
                {/* Instant PF Check-up */}
                <div className="col-md-3">
                    <div className="card epf-card shadow-sm">
                        <div className="card-header border-0 epf-header" style={{backgroundColor: "#ff6600"}}></div>
                        <div className="card-body text-center setMarginTopBtm mt-0 mt-sm-3">
                            <div className="text-center mb-2">
                                <FaHandshake size={50} color="gray" />
                            </div>
                            <h5 className="card-title text-primary fw-bold">Instant PF<br></br> Check-up</h5>
                            <p className="card-text text-muted small">
                                An AI Agent to auto-detect issues in your EPF account. Instantly check if your PF Balance is withdrawable and insights on potential issues.
                            </p>
                            <div className="pricing mt-lg-5 mt-3">
                                <span className="old-price">₹499</span>
                                <span className="new-price">₹99</span>
                            </div>
                            {/* <button className="btn w-75 mt-lg-5 mt-3" style={{backgroundColor: "#001a6d", color:"#ffffff"}}>Check Now</button> */}
                            <button
                                className="btn w-75 mt-lg-5 mt-3"
                                onClick={() => {navigate('/')}} 
                                style={{
                                    backgroundColor: isClickedFirst ? '#28a745' : '#001a6d',
                                    color: '#ffffff',
                                }}
                            >
                                Check Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* EPF Expert Consultation */}
                <div className="col-md-3">
                <div className="card epf-card shadow-sm">
                        <div className="card-header border-0 epf-header" style={{backgroundColor: "#0D6EE9 "}}></div>
                        <div className="card-body text-center setMarginTopBtm mt-0 mt-sm-3">
                            <div className="text-center mb-2">
                                <FaUsers size={50} color="gray" />
                            </div>
                            <h5 className="card-title text-primary fw-bold">EPF Expert<br></br> Consultation</h5>
                            <p className="card-text text-muted small">
                            Connect with our EPF Experts over a video call and get unbiased guidance on resolving your Provident Fund withdrawal and PF Transfer related issues.
                            </p>
                            <div className="pricing mt-lg-5 mt-3">
                                <span className="new-price">₹499 </span>
                                <span className="old-price"> + GST</span>
                            </div>
                            <button className="btn w-75 mt-lg-5 mt-3" onClick={() => window.open("https://finright.in/", "_blank")}
                             style={{backgroundColor: "#28a745", color:"#ffffff"}}>
                                Connect Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* PF Withdrawal Assistance */}
                <div className="col-md-3">
                <div className="card epf-card shadow-sm">
                        <div className="card-header border-0 epf-header" style={{backgroundColor: "#001a6d"}}></div>
                        <div className="card-body text-center setMarginTopBtm mt-0 mt-sm-3">
                            <div className="text-center mb-2">
                                <FaBuilding size={50} color="gray" />
                            </div>
                            <h5 className="card-title text-primary fw-bold">PF Withdrawal <br></br> Assistance</h5>
                            <p className="card-text text-muted small">
                            Experience Hassel-free and faster  Provident withdrawal ensuring you get maximum eligible PF Balance. 100% refund on EPF claim rejections.
                            </p>
                            {/* <p className="mb-0">Starting From</p> */}
                            <div className="pricing mt-lg-5 mt-3">
                                <span className="new-price">₹ 2099 </span>
                                <span className="old-price"> + GST</span>
                            </div>
                            <button className="btn w-75 mt-lg-5 mt-3" onClick={() => window.open("https://finright.in/", "_blank")}
                            style={{backgroundColor: "#28a745", color:"#ffffff"}}>
                                Connect Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* EPF Issue Resolution */}
                <div className="col-md-3">
                <div className="card epf-card shadow-sm">
                        <div className="card-header border-0 epf-header" style={{backgroundColor: "#ff6600"}}></div>
                        <div className="card-body text-center setMarginTopBtm mt-0 mt-sm-3">
                            <div className="text-center mb-2">
                                <FaHandshake size={50} color="gray" />
                            </div>
                            <h5 className="card-title text-primary fw-bold">PF Withdrawal <br></br> Assistance</h5>
                            <p className="card-text text-muted small">
                            Our expert team is committed to hand hold you through the complexities of PF issues. Relax while our expert resolves your PF withdrawal issues end to end.
                            </p>
                            <div className="pricing mt-lg-5 mt-3">
                                <span className="new-price">Custom </span>
                            </div>
                            <button className="btn w-75 mt-lg-5 mt-3" onClick={() => window.open("https://finright.in/", "_blank")}
                            style={{backgroundColor: "#28a745", color:"#ffffff"}}>
                                Connect Now
                            </button>
                            {/* <button
                                className="btn w-75 mt-lg-5 mt-3"
                                onClick={handleClickForth}
                                style={{
                                    backgroundColor: isClickedForth ? '#28a745' : '#001a6d',
                                    color: '#ffffff',
                                }}
                            >
                                {isClickedForth ? 'Connect Now' : 'Check Now'}
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectService;