import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import { Telephone } from "react-bootstrap-icons";

const EpfoDown = () => {
    return (
        <div className="container">
            <div className="row mx-2">
                <div className="col-lg-4 col-md-8 offset-lg-1 mt-2 mt-lg-0 
                d-flex justify-content-center align-items-center vh-100">
                    <img src={pfRiskImage} alt="Risk Assessment" className='pfRiskLoginImage' />
                </div>
                <div className="col-lg-7 mt-4 mb-3">
                    <div className='row'>
                        <div className='col-md-9'>
                            <span className='epfoLabel'>Oops! Looks like EPF servers are down,</span><br></br>
                            <span className='epfoLabel' style={{ color: '#2460DA' }}>FinRight is still Up</span><br></br>
                            <span className='labelText'>Leave your Details with us and we will take your case via manual routes</span>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-10 offset-md-1'>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <label>Name</label>
                                    <input type='text' className='form-control' placeholder='Eg-Robert' />
                                </div>
                                <div className='col-md-6'>
                                    <label>Mobile number</label>
                                    <input type='text' className='form-control' placeholder='Eg-00000 00000' />
                                </div>
                                <div className='col-md-12 mt-4'>
                                    <label>I want to</label>
                                    <select class="form-select" aria-label="Default select example">
                                        <option selected>Select an option</option>
                                        <option value="1">Withdraw PF(Partial)</option>
                                        <option value="2">Withdraw PF(Full)</option>
                                        <option value="3">Transfer and Accumulate</option>
                                        <option value="4">Check Withdraw-ability</option>
                                    </select>
                                </div>
                                <div className='col-md-12 mt-4'>
                                    <label>Where did you hear about us?</label><br></br>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                        <label className="form-check-label" for="inlineRadio1">Google</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option2" />
                                        <label className="form-check-label" for="inlineRadio3">Twitter/X</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="option2" />
                                        <label className="form-check-label" for="inlineRadio4">Just Dial</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="option2" />
                                        <label className="form-check-label" for="inlineRadio5">You Tube</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio6" value="option2" />
                                        <label className="form-check-label" for="inlineRadio6">Referred by a Friend</label>
                                    </div>
                                </div>
                                <div className='col-md-12 mt-4'>
                                    <button className='requestButton px-3 py-1'>
                                    <Telephone className='me-2 mb-1'  size={13} title="Phone Icon" />Request a call</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EpfoDown;