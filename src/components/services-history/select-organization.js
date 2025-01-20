import '../../App.css';
import '../../css/service-history/service-history.css';
import '../../css/service-history/select-organization.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConvertPeriod } from '../common/date-convertor';
import { encryptData } from '../common/encryption-decryption';

function SelectOrganization() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showlistOrganization, setlistOrganization] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const { listItems, uan, type, reportUpdatedAtVar, profileData, home } = location.state || {};

    useEffect(() => {
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan');;
        let value = "select-organization";
        localStorage.setItem(dynamicKey, value);
    }, []);

    // Ensure listItems is an array before applying map
    const updatedListItems = listItems?.history ? listItems?.history?.map(item => ({
        ...item,
        checked: false
    })) : [];

    // Handle checkbox change
    const handleCheckboxChange = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

    const generateReportClick = () => {
        const selectedOrg = selectedId !== null ? updatedListItems[selectedId] : null;
        navigate("/kyc-details", { state: { listItems, selectedOrg, uan, type, reportUpdatedAtVar, profileData, home } });
    }


    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-5 col-md-8">
                    {/* <div className='row'>
                        <div className="col-lg-11">
                            <div className='row'>
                                <div className="col-md-10 offset-md-1 pfRiskheading text-center">Select Current Organization</div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-md-8 offset-md-2">
                                    <div className="overflow-auto selectsideBar" style={{ maxHeight: '15rem' }}>
                                        <form>
                                            {updatedListItems.map((item, index) => (
                                                <div key={index}>
                                                    <ul className='list-group ms-4' >
                                                        <li><span className='selectHeading'>{item.company}</span><br></br>
                                                            <span className='selectTime px-2'>{ConvertPeriod(item.period)}</span>
                                                            <div className="form-check mt-2 ps-0 d-flex justify-content-start">
                                                                <input className="large-checkbox me-3" type="radio" value=""
                                                                    checked={selectedId === index} onChange={() => handleCheckboxChange(index)} />
                                                                <div className="form-check-label checkboxText">
                                                                    Still working here
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            ))}
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className='row mt-4'>
                                <div className='col-md-12 my-3 my-lg-0'>
                                    <button className='btn correctButton w-100' onClick={generateReportClick}>
                                        {selectedId !== null ? 'Continue' : "Not working in any of these"}</button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className='row'>
                        <div className='col-md-12'>
                            {showlistOrganization ? (
                                <>
                                    <p className='headingCurrentEmp'>Is this your current Employer?</p>
                                    <div className="card shadow-sm py-3 px-lg-4 mx-4 px-3" style={{ marginBottom: '7rem', marginTop: '5rem' }}>
                                        {updatedListItems?.length > 0 && (
                                            <div key={0}>
                                                <p className="currentOrgText mb-0">{updatedListItems[0].company}</p>
                                                <p className="currentOrgsubText">{updatedListItems[0].period}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className='row my-3'>
                                        <div className='col-md-6 col-sm-6'>
                                            <button className='btn NoButton w-100 py-3' onClick={() => setlistOrganization(false)}>No</button>
                                        </div>
                                        <div className='col-md-6 col-sm-6 mt-3 mt-sm-0'>
                                            <button className='btn yesButton w-100 py-3' onClick={generateReportClick}>Yes</button>
                                        </div>
                                    </div>
                                </>) : (
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <p className='headingCurrentEmp'>Choose your current Employer</p>
                                        {updatedListItems.map((item, index) => (
                                            <div key={index}>
                                                <div className="card shadow-sm py-3 px-lg-4 mt-3 mx-4">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <p className='currentOrgText mb-0'>{item.company}</p>
                                                            <p className='currentOrgsubText'>{item.period}</p>
                                                        </div>
                                                        <div>
                                                            <input className='selectOrgRadioBtn' type="radio" name="currentEmployer"
                                                                id="currentEmployer" checked={selectedId === index} onChange={() => handleCheckboxChange(index)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className='text-center mb-3'>
                                            <button className='btn yesButton w-50 py-3 mt-3' onClick={generateReportClick}>{selectedId !== null ? 'Continue' : "Not working in any of these"}</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default SelectOrganization;