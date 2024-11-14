import '../../App.css';
import '../../css/service-history/service-history.css';
import '../../css/service-history/select-organization.css';
// import React, { useState } from 'react';
import serchHistoryImg from '../../assets/images/serch_history.png';
import { useNavigate } from 'react-router-dom';

function SelectOrganization() {
    const navigate = useNavigate()
    
    return (
        <div className="container-fluid">
            <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-8 offset-lg-1">
                    <div className='row'>
                        <div className='col-md-12 mt-2 mt-sm-0'>
                            <img src={serchHistoryImg} alt="Service History" className='selectImage' />
                        </div>
                    </div>

                    <div className='row'>
                        <div className='selectUanNumber text-center'>UAN No</div>
                    </div>

                    <div className='row mt-1'>
                        <div className='selectDigit text-center'>123654789365</div>
                    </div>
                </div>


                <div className="col-lg-5 col-md-8 offset-lg-1">
                    <div className='row'>
                        <div className="pfRiskheading text-center">Select Current Organization</div>
                    </div>

                    <div className='row'>
                        <div className='pfRiskSubHeading text-center'>
                            Lorem ipsum dolor sit amet consectetur.
                            Lorem rhoncus vitae ullamcorper non.Lorem rhoncus vitae ullamcorper non.
                            Lorem rhoncus vitae ullamcorper non.
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-8 offset-md-2">
                            <div className="overflow-auto selectsideBar" style={{ maxHeight: '15rem' }}>
                                <ul className='list-group ms-4' >
                                    <li><span className='selectHeading'>Morningstar India Private Limited</span><br></br>
                                        <span className='selectTime px-2'>12/05/15 </span>
                                        <div className="form-check mt-2 ps-0 d-flex justify-content-start">
                                            <input className="large-checkbox me-3" type="checkbox" value="" />
                                            <div className="form-check-label checkboxText">
                                                Still working here
                                            </div>
                                        </div>
                                    </li>

                                    <li><span className='selectHeading'>Morningstar India Private Limited</span><br></br>
                                        <span className='timeDuration px-2'>12/05/15 </span>
                                        <div className="form-check mt-2 ps-0 d-flex justify-content-start">
                                            <input className="large-checkbox me-3" type="checkbox" value="" />
                                            <div className="form-check-label checkboxText">
                                                Still working here
                                            </div>
                                        </div>
                                    </li>

                                    <li><span className='selectHeading'>Morningstar India Private Limited</span><br></br>
                                        <span className='timeDuration px-2'>12/05/15 </span>
                                        <div className="form-check mt-2 ps-0 d-flex justify-content-start">
                                            <input className="large-checkbox me-3" type="checkbox" value="" />
                                            <div className="form-check-label checkboxText">
                                                Still working here
                                            </div>
                                        </div>
                                    </li>

                                    <li><span className='selectHeading'>Morningstar India Private Limited</span><br></br>
                                        <span className='timeDuration px-2'>12/05/15 </span>
                                        <div className="form-check mt-2 ps-0 d-flex justify-content-start">
                                            <input className="large-checkbox me-3" type="checkbox" value="" />
                                            <div className="form-check-label checkboxText">
                                                Still working here
                                            </div>
                                        </div>
                                    </li>
                               
                                </ul>

                            </div>

                        </div>
                    </div>

                    <div className='row mt-4'>
                        <div className='col-md-12 my-3 my-lg-0'>
                            <button className='btn correctButton w-100' onClick={() => navigate("/doc-scan")}>This is correct</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectOrganization;