import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import { Telephone } from "react-bootstrap-icons";

const EpfoDown = () => {
    return (
        <div className="container">
            <div className="row mx-2">
                <div className="col-md-4 col-lg-4 offset-lg-1 mt-2 mt-md-0 
                d-flex justify-content-center align-items-center custom-col">
                    <img src={pfRiskImage} alt="Risk Assessment" className='pfRiskLoginImage' />
                </div>
                <div className="col-md-8 col-lg-7 mt-md-4 mt-lg-5 mb-md-3">
                    <div className='row'>
                        <div className='col-md-9'>
                            <span className='epfoLabel'>Oops! Looks like EPF servers are down,</span><br></br>
                            <span className='epfoLabel ' style={{ color: '#2460DA' }}>FinRight is still Up</span><br></br>
                            <span className='labelText '>Leave your Details with us and we will take your case via manual routes</span>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-10 offset-md-1'>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <label className='epfoFormlabel'>Name</label>
                                    <input type='text' className='form-control' placeholder='Eg-Robert' />
                                </div>
                                <div className='col-md-6'>
                                    <label className='epfoFormlabel'>Mobile number</label>
                                    <input type='text' className='form-control' placeholder='Eg-00000 00000' />
                                </div>
                                <div className='col-md-12 mt-2 mt-md-4'>
                                    <label className='epfoFormlabel'>I want to :</label><br></br>
                                    <select className="form-select-sm w-100" style={{border:'1px solid #dee2e6'}} aria-label="Default select example">
                                        <option className='epfoFormlabel'>Select an option</option>
                                        <option className='epfoFormlabel' value="1">Withdraw PF(Partial)</option>
                                        <option className='epfoFormlabel' value="2">Withdraw PF(Full)</option>
                                        <option className='epfoFormlabel' value="3">Transfer and Accumulate</option>
                                        <option className='epfoFormlabel' value="4">Check Withdraw-ability</option>
                                    </select>
                                </div>
                                <div className='col-md-12 mt-2 mt-md-4'>
                                    <label className='iconHeading'>Where did you hear about us?</label>
                                    <div className='d-flex flex-wrap justify-content-start mt-1'>
                                        <div className="form-check  d-flex aling-item">
                                            <input className="form-check-input custom-radio" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                            <label className="form-check-label iconHeading mx-2" htmlFor="inlineRadio1">Google</label>
                                        </div>
                                        <div className="form-check  d-flex aling-item">
                                            <input className="form-check-input custom-radio" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option1" />
                                            <label className="form-check-label iconHeading mx-2" htmlFor="inlineRadio2">LinkedIn</label>
                                        </div>
                                        <div className="form-check d-flex aling-item">
                                            <input className="form-check-input custom-radio" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option2" />
                                            <label className="form-check-label iconHeading mx-2" htmlFor="inlineRadio3">Twitter/X</label>
                                        </div>
                                        <div className="form-check  d-flex aling-item">
                                            <input className="form-check-input custom-radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="option2" />
                                            <label className="form-check-label iconHeading mx-2" htmlFor="inlineRadio4">Just Dial</label>
                                        </div>
                                        <div className="form-check d-flex aling-item">
                                            <input className="form-check-input custom-radio" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="option2" />
                                            <label className="form-check-label iconHeading mx-2" htmlFor="inlineRadio5">You Tube</label>
                                        </div>
                                        <div className="form-check d-flex aling-item">
                                            <input className="form-check-input custom-radio" type="radio" name="inlineRadioOptions" id="inlineRadio6" value="option2" />
                                            <label className="form-check-label iconHeading mx-2" htmlFor="inlineRadio6">Referred by a Friend</label>
                                        </div>
                                    </div>


                                </div>
                                <div className='col-md-12 mt-md-4 my-2 d-md-flex justify-content-md-start d-flex justify-content-center'>
                                    <button className='requestButton px-3 py-1'>
                                        <Telephone className='me-2 mb-1' size={13} title="Phone Icon" />Request a call</button>
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