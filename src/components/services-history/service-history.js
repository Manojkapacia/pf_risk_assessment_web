import '../../App.css';
import '../../css/service-history/service-history.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { get } from '../common/api';
import { ConvertPeriod } from '../common/date-convertor';
import { encryptData } from '../common/encryption-decryption';
import { logout } from './../common/api'

function ServiceHistory() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [listItems, setListItems] = useState([]); // Store API data
    const [uan, setUan] = useState('');
    const [errorKey, setErrorKey] = useState(null);
    const [profileData, setProfileData] = useState({});
    const [home, setHome] = useState({});
    const [reportUpdatedAtVar, setreportUpdatedAt] = useState("");

    const navigate = useNavigate();

    // Function to fetch data
    const fetchData = async () => {
        try {
            const response = await get('auth/data');
            setreportUpdatedAt(response.rawData.meta.createdTime);
            if (response.status === 401) {
                localStorage.removeItem('user_uan')
                navigate('/');
            } else {
                console.log(response?.rawData?.data?.error)
                localStorage.setItem('data-raw-' + localStorage.getItem('user_uan'), encryptData(JSON.stringify(response?.rawData?.data)))
                setListItems(response?.rawData?.data?.serviceHistory);
                setProfileData(response?.rawData?.data?.profile);
                setHome(response?.rawData?.data?.home);
                setErrorKey(response?.rawData?.data?.error);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
        }
    };

    // Accessing the state
    useEffect(() => {
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan');
        let value = "service-history";
        localStorage.setItem(dynamicKey, value);
        setUan(localStorage.getItem('user_uan'))
        fetchData(); // Call API when component loads
    }, []);

    const handleItemClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
        setIsOpen(activeIndex === index ? false : true);
    };

    const handleButtonClick = (type) => {
        const data = { listItems, uan, type, reportUpdatedAtVar, profileData };
        const encodedData = encryptData(JSON.stringify(data));
        localStorage.setItem('data-for-org-' + uan, encodedData);
        navigate("/select-organization", { state: { listItems, uan, type, reportUpdatedAtVar, profileData, home } })
    };

    const errorPasswordNewTab = async () => {
        const url = "https://unifiedportal-mem.epfindia.gov.in/memberinterface/no-auth/forgotPassword/forgotPasswordMain?HDIV_STATE=4-10-B8FAADE21B490611BBD0D64858C96FF8";
        window.open(url, "_blank");
        const adminLogin = localStorage.getItem('admin_logged_in');
        if (adminLogin) {
            localStorage.removeItem('admin_logged_in');
            navigate('/');
        } else {
            try {
                const result = await logout();
                localStorage.removeItem('user_uan');
                navigate('/');
            } catch (error) {
                console.error('Unexpected error during logout:', error);
            }
        }
    };
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
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                {/* <div className="col-lg-4 col-md-8">
                        <div className='row'>
                            <div className='col-md-8 offset-md-2 mt-2 mt-sm-0'>
                                <div className='welcomeLabelLogin mb-md-4'>
                                    Step 1
                                </div>
                                <span className='EpfText'>Please confirm if the service history captured by EPF portal is correct?</span>
                                <ul>
                                    <li className="EpfText my-md-3">Check if all your previous and current employments are listed here</li>
                                    <li className="EpfText">Verify if ‘Date of Joining’ and ‘Date of Exit’ is marked correctly for each organization </li>
                                </ul>
                            </div>
                        </div>
                    </div> */}

                {/* Second column  */}

                <div className="col-lg-6 col-md-8">
                    <div className='row'>
                        <div className="col-lg-11">
                            <div className='row'>
                                {errorKey !== null ?
                                    <div style={overlayStyle}>
                                        <div className="modal modal-overlay fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered">
                                                <div className="modal-content">
                                                    {/* <div className="modal-header">
                                                    <p className="modal-title" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Your report genration is in progress</p>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModel}></button>
                                                </div> */}
                                                    <div className="modal-body">
                                                        <div className="container">
                                                            <div className="row d-flex justify-content-center align-items-center">

                                                                <div className="col-lg-12 mt-3 mt-lg-0">
                                                                    <p style={{ fontSize: '1.2rem', fontWeight: '300', lineHeight: '1.3',color:'red' }}>
                                                                        Your account password has expired, Please reset it using EPFO member portal
                                                                    </p>
                                                                    <div className='text-center mt-5'>
                                                                        <button className="pfRiskButtons py-2 px-5" data-bs-dismiss="modal" aria-label="Close" type='button' onClick={errorPasswordNewTab}>
                                                                            Go to EPFO
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
                                    :
                                    <>
                                        <div className='row'>
                                            <div className='col-md-8 offset-md-2 pfRiskSubHeading text-center'>
                                                <div className="pfRiskheading text-center">Please Confirm Service History</div>
                                                Verify if all information regarding your service history is correct before moving ahead
                                            </div>
                                        </div>

                                        <div className="row mt-4">
                                            <div className="col-md-10 offset-md-1">
                                                <div className="overflow-auto sideBar" style={{ maxHeight: '15rem' }}>
                                                    <ul className='list-group' >
                                                        {listItems?.history?.map((item, index) => (
                                                            <React.Fragment key={index}>
                                                                {/* List Item */}
                                                                <li
                                                                    className="list-group-item collapsHeading"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => handleItemClick(index)}
                                                                >
                                                                    {item.company === "-"
                                                                        ? "NA"
                                                                        : item.company.length > 34
                                                                            ? item.company.substring(0, 34) + "..."
                                                                            : item.company}
                                                                    <span className='ms-2' style={{ marginLeft: 'auto' }}>{isOpen && activeIndex === index ? <BsChevronCompactUp /> : <BsChevronCompactDown />}</span><br></br>

                                                                    <span className='timeDuration'>
                                                                        {ConvertPeriod(item.period)}
                                                                    </span>
                                                                </li>

                                                                {/* Dropdown Details */}
                                                                {activeIndex === index && (
                                                                    <li className='list-group-item bg-light'>
                                                                        <div className="row">
                                                                            <div className="col-5">
                                                                                <span className='dropdownLabel'>Member ID :</span><br></br>
                                                                                {/* <span className='dropdownLabel'>NCP Days :</span><br></br> */}
                                                                                <span className='dropdownLabel'>Joining Date :</span><br></br>
                                                                                <span className='dropdownLabel'>Exit Date :</span><br></br>
                                                                            </div>
                                                                            <div className="col-7 ps-0">
                                                                                <span className='dropdownSublabel'>{item.details['Member Id']}</span><br></br>
                                                                                {/* <span className='dropdownSublabel'>{item.details['NCP Days']}</span><br></br> */}
                                                                                <span className='dropdownSublabel'>{item.details['Joining Date']}</span><br></br>
                                                                                <span className='dropdownSublabel'>{item.details['Exit Date']}</span><br></br>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row my-3 mt-lg-5'>
                                            <div className='col-md-6 col-sm-6'>
                                                <button className='btn incorrectButton w-100' onClick={() => handleButtonClick('incorrect')}>This is incorrect</button>
                                            </div>
                                            <div className='col-md-6 col-sm-6 mt-3 mt-sm-0'>
                                                <button className='btn correctButton w-100' onClick={() => handleButtonClick('correct')}>This is correct</button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceHistory;