import '../../App.css';
import '../../css/service-history/service-history.css';
import '../../css/service-history/select-organization.css';
import React, { useEffect, useState } from 'react';
import serchHistoryImg from '../../assets/images/serch_history.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConvertPeriod } from '../common/date-convertor';

function SelectOrganization() {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedId, setSelectedId] = useState(null);
    const { listItems, uan, type } = location.state || {};

    useEffect(() => {
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan'); ; 
        let value = "select-organization";   
        localStorage.setItem(dynamicKey, value); 
    }, []);

    // Ensure listItems is an array before applying map
    const updatedListItems = listItems ? listItems.map(item => ({
        ...item,
        checked: false
    })) : [];

    // Handle checkbox change
    const handleCheckboxChange = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

    const generateReportClick = () => {
        const selectedOrg = selectedId !== null ? updatedListItems[selectedId] : null;
        localStorage.removeItem('data-org-' + uan)
        const data = { selectedOrg, uan, type };
        const encodedData = btoa(JSON.stringify(data));
        localStorage.setItem('data-scan-' + uan, encodedData);
        navigate("/doc-scan", { state: { selectedOrg, uan, type } })
    }

    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-8">
                    <div className='row'>
                        <div className='col-md-8 offset-md-2 mt-2 mt-sm-0'>
                        <div className='welcomeLabelLogin mb-md-4'>
                            Step 2
                        </div>
                        <span className='EpfText'>Please choose if your are currently working in any of the companies listed here</span>
                        </div>
                    </div>
                </div>


                <div className="col-lg-6 col-md-8">
                    <div className='row'>
                        <div className="col-lg-11 offset-lg-1">
                            <div className='row'>
                                <div className="col-md-10 offset-md-1 pfRiskheading text-center">Select Current Organization</div>
                            </div>

                            {/* <div className='row'>
                                <div className='col-md-10 offset-md-1 pfRiskSubHeading text-center'>
                                    Lorem ipsum dolor sit amet consectetur.
                                    Lorem rhoncus vitae ullamcorper non.Lorem rhoncus vitae ullamcorper non.
                                    Lorem rhoncus vitae ullamcorper non.
                                </div>
                            </div> */}

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
                                                                <input className="large-checkbox me-3" type="checkbox" value=""
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
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SelectOrganization;