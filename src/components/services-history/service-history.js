import '../../App.css';
import '../../css/service-history/service-history.css';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { get } from '../common/api';
import { ConvertPeriod } from '../common/date-convertor';
import { encryptData } from '../common/encryption-decryption';
import { logout } from './../common/api';
import loaderGif from './../../assets/images/Mobile-Payment.gif'

function ServiceHistory() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [listItems, setListItems] = useState([]); // Store API data
    const [uan, setUan] = useState('');
    const [errorKey, setErrorKey] = useState(null);
    const [profileData, setProfileData] = useState({});
    const [home, setHome] = useState({});
    const [reportUpdatedAtVar, setreportUpdatedAt] = useState("");
    const [loading, setLoading] = useState(false);
    const [loaderText, setLoaderText] = useState("Fetching Data, Please wait...");
     const location = useLocation();
    const navigate = useNavigate();

    // Function to fetch data
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await get('auth/data');
            console.log(response);
            if (response.status === 401) {
                localStorage.clear();
                setLoading(false);
                navigate("/data-not-found", { state: { apiEndpoint: "auth/data", previousPath: location.pathname } });

            } else {
                setreportUpdatedAt(response?.rawData?.meta?.createdTime);
                localStorage.setItem('data_raw_' + localStorage.getItem('user_uan'), encryptData(JSON.stringify(response?.rawData?.data)))
                setListItems(response?.rawData?.data?.serviceHistory);
                setProfileData(response?.rawData?.data?.profile);
                setHome(response?.rawData?.data?.home);
                setErrorKey(response?.rawData?.data?.error);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.log("navigate")
            navigate("/data-not-found", { state: { fetchFunction: 'auth/data' } });
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Accessing the state
    useEffect(() => {
        setUan(localStorage.getItem('user_uan'))
        fetchData(); // Call API when component loads
    }, []);

    const handleItemClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
        setIsOpen(activeIndex === index ? false : true);
    };

    const handleButtonClick = (type) => {
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
                await logout();
                localStorage.removeItem('user_uan');
                navigate('/');
            } catch (error) {
                console.error('Unexpected error during logout:', error);
            }
        }
    };
    const getYearsAndMonths = (data) => {
        if (data) {
            const match = data?.match(/(\d+)\s*Years?\s*(\d+)?\s*Months?/);
            if (match) {
                const years = parseInt(match[1], 10) || 0;
                const months = parseInt(match[2], 10) || 0;

                const yearString = years === 1 ? "1 Year" : `${years} Years`;
                const monthString = months === 1 ? "1 Month" : `${months} Months`;

                return `${yearString} ${monthString}`;
            }
            return "0 Years 0 Months"; // Default if no match
        }

    };
    function formatDuration(duration) {
        if (duration) {
            const parts = duration.split(" ");
            const years = parts[0] !== "0" ? `${parts[0]} Yr${parts[0] > 1 ? "s" : ""}` : "";
            const months = parts[2] !== "0" ? `${parts[2]} M` : "";
            return [years, months].filter(Boolean).join(" ");
        }
        return "";
    }
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
        <>
        {loading && (
                <div className="loader-overlay">
                    <div className="loader-container">
                         <div className='loader'></div>
                        <p className="loader-text">{loaderText}</p>
                    </div>
                </div>
                // <div className='loader'></div>
            )}
            <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-6 col-md-8">
                    <div className='row'>
                        <div className="col-lg-12">
                            <div className='row'>
                                {errorKey !== null ?
                                    <div style={overlayStyle}>
                                        <div className="modal modal-overlay fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered">
                                                <div className="modal-content">
                                                    <div className="modal-body">
                                                        <div className="container">
                                                            <div className="row d-flex justify-content-center align-items-center">

                                                                <div className="col-lg-12 mt-3 mt-lg-0">
                                                                    <p style={{ fontSize: '1.2rem', fontWeight: '300', lineHeight: '1.3', color: 'red' }}>
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
                                        <p className='confirmHistory'>Please Confirm Employement History</p>
                                        <div className='col-md-12'>
                                            <p className='capturedCorrect'>Verify if the below captured details are correct</p>
                                            <div className="card shadow-sm py-3 px-lg-5 mt-3">
                                                <p className="text-center employmentServiceHis">Employment History</p>
                                                <table className="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th className="employmentTabel">Employer</th>
                                                            <th className="employmentTabel">Tenure</th>
                                                            <th className="employmentTabel">Experience</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {listItems?.history?.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="employmentTabelData">{item.company}</td>
                                                                <td className="employmentTabelData">{item.period}</td>
                                                                <td className="employmentTabelData">{formatDuration(item.details?.['Total Service'])}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="text-center employmentService mt-2">
                                                    {formatDuration(listItems?.overview?.['Total Experience'])}
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-10 offset-md-1'>
                                                    <div className='row my-3 mt-lg-5'>
                                                        <div className='col-md-6 col-sm-6'>
                                                            <button className='btn incorrectButton w-100 py-2 py-md-3' onClick={() => handleButtonClick('incorrect')}>This is incorrect</button>
                                                        </div>
                                                        <div className='col-md-6 col-sm-6 mt-3 mt-sm-0'>
                                                            <button className='btn correctButton w-100 py-2 py-md-3' onClick={() => handleButtonClick('correct')}>This is correct</button>
                                                        </div>
                                                    </div>
                                                </div>
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
        </>
        
    )
}

export default ServiceHistory;