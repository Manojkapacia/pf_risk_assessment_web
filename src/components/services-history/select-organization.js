import '../../App.css';
import '../../css/service-history/service-history.css';
import '../../css/service-history/select-organization.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SelectOrganization() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showlistOrganization, setlistOrganization] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { listItems, uan, type, reportUpdatedAtVar, profileData, home } = location.state || {};

    // Ensure listItems is an array before applying map
    const updatedListItems = listItems?.history ? listItems?.history?.map(item => ({
        ...item,
        checked: false
    })) : [];

    // Handle checkbox change
    const handleCheckboxChange = (id) => {
        setSelectedIndex(id === selectedIndex ? null : id);
    };

    const generateReportClick = () => {
        const selectedOrg = selectedIndex !== null ? updatedListItems[selectedIndex] : null;
        navigate("/kyc-details", { state: { listItems, selectedOrg, uan, type, reportUpdatedAtVar, profileData, home } });
    }


    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-5 col-md-8">
                    <div className='row'>
                        <div className='col-md-12'>
                            {showlistOrganization ? (
                                <>
                                    <p className='headingCurrentEmp mt-3'>Is this your current Employer?</p>
                                    <div className="card shadow-sm p-3 px-lg-4 mx-lg-4 setMarginTopBtm">
                                        {updatedListItems?.length > 0 && (
                                            <div key={0}>
                                                <p className="currentOrgText mb-0">{updatedListItems[0].company}</p>
                                                <p className="currentOrgsubText">{updatedListItems[0].period}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col-md-6 col-sm-6'>
                                            <button className='btn NoButton w-100 py-2 py-md-3' onClick={() => setlistOrganization(false)}>No</button>
                                        </div>
                                        <div className='col-md-6 col-sm-6 mt-3 mt-sm-0'>
                                            <button className='btn yesButton w-100 py-2 py-md-3' onClick={generateReportClick}>Yes</button>
                                        </div>
                                    </div>
                                </>) : (
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <p className='headingCurrentEmp mt-3'>Choose your current Employer</p>
                                        <div className='setMarginTopBtm'>
                                            {updatedListItems.map((item, index) => (
                                                <div key={index}>
                                                    <div className="card shadow-sm p-3  px-lg-4 mt-3 mx-lg-4">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <p className='currentOrgText mb-0'>{item.company}</p>
                                                                <p className='currentOrgsubText'>{item.period}</p>
                                                            </div>
                                                            <div>
                                                                <input className='selectOrgRadioBtn' type="radio" name="currentEmployer"
                                                                    id="currentEmployer" checked={selectedIndex === index} onChange={() => handleCheckboxChange(index)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-center mb-3">
                                            <button
                                                className="btn selectOrgBtn yesButton w-100 w-md-50 py-2 py-md-3"
                                                onClick={generateReportClick}
                                            >
                                                {selectedIndex !== null ? 'Next' : 'Not working in any of these'}
                                            </button>
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