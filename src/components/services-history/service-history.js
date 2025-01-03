import '../../App.css';
import '../../css/service-history/service-history.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { get } from '../common/api';
import { ConvertPeriod } from '../common/date-convertor';
import { encryptData } from '../common/encryption-decryption';

function ServiceHistory() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [listItems, setListItems] = useState([]); // Store API data
    const [uan, setUan] = useState('');
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
                console.log(uan)
                localStorage.setItem('data-raw-' + localStorage.getItem('user_uan'),encryptData(JSON.stringify(response?.rawData?.data)))
                setListItems(response?.rawData?.data?.serviceHistory);
                setProfileData(response?.rawData?.data?.profile);
                setHome(response?.rawData?.data?.home)
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
                                <div className="col-md-8 offset-md-2 pfRiskheading text-center">Please Confirm Service History</div>
                            </div>

                            <div className='row'>
                                <div className='col-md-8 offset-md-2 pfRiskSubHeading text-center'>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceHistory;