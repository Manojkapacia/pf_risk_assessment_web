import '../../App.css';
import '../../css/service-history/service-history.css';
import React, { useState, useEffect } from 'react';
import serchHistoryImg from '../../assets/images/serch_history.png';
import { useNavigate } from 'react-router-dom';
import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import SearchComponent from '../common/search';
import { get } from '../common/api';
import { ConvertPeriod } from '../common/date-convertor';

function ServiceHistory() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [listItems, setListItems] = useState([]); // Store API data
    const [uan, setUan] = useState('')

    const navigate = useNavigate();

    // Function to fetch data
    const fetchData = async () => {
        try {
            const response = await get('auth/data?filter=serviceHistory');
            if (response.status === 401) {
                setIsLoading(false); 
                localStorage.clear()
                navigate('/');
            } else {
                setListItems(response.serviceHistory.history);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false); // Stop showing the loading screen
        }
    };

    useEffect(() => {
        localStorage.setItem("current_page", "service-history")
        setUan(localStorage.getItem('user_uan'))
        fetchData(); // Call API when component loads
    }, []);

    const handleItemClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
        setIsOpen(activeIndex === index ? false : true);
    };

    const handleButtonClick = (type) => {
        navigate("/select-organization", { state: {listItems, uan, type}})
    };

    if (isLoading) {
        return <SearchComponent />;
    }

    return (
        <div className="container-fluid">
            <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-8 offset-lg-1">
                    <div className='row'>
                        <div className='col-md-12 mt-2 mt-sm-0'>
                            <img src={serchHistoryImg} alt="Service History" className='serviceImage' />
                        </div>
                    </div>

                    <div className='row'>
                        <div className='uanNumber text-center'>UAN No</div>
                    </div>

                    <div className='row mt-1'>
                        <div className='uanNumberDigit text-center'>{uan}</div>
                    </div>
                </div>

                {/* Second column  */}

                <div className="col-lg-5 col-md-8 offset-lg-1">
                    <div className='row'>
                        <div className="pfRiskheading text-center">Please Confirm Service History</div>
                    </div>

                    <div className='row'>
                        <div className='pfRiskSubHeading text-center'>
                            Verify if all information regarding your service history is correct before moving ahead
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-8 offset-md-2">
                            <div className="overflow-auto sideBar" style={{ maxHeight: '15rem' }}>
                                <ul className='list-group' >
                                    {listItems.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {/* List Item */}
                                            <li
                                                className="list-group-item collapsHeading"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleItemClick(index)}
                                            >
                                                {item.company}
                                                <span className='ms-2' style={{ marginLeft: 'auto' }}>{isOpen && activeIndex === index ? <BsChevronCompactDown /> : <BsChevronCompactUp />}</span><br></br>

                                                <span className='timeDuration'>
                                                    {ConvertPeriod(item.period)}
                                                </span>
                                            </li>

                                            {/* Dropdown Details */}
                                            {activeIndex === index && (
                                                <li className='list-group-item bg-light'>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <span className='dropdownLabel'>Member Id :</span><br></br>
                                                            <span className='dropdownLabel'>NCP Days :</span><br></br>
                                                            <span className='dropdownLabel'>Joining Date :</span><br></br>
                                                            <span className='dropdownLabel'>Exit Date :</span><br></br>
                                                        </div>
                                                        <div className="col-6">
                                                            <span className='dropdownSublabel'>{item.details['Member Id']}</span><br></br>
                                                            <span className='dropdownSublabel'>{item.details['NCP Days']}</span><br></br>
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
    )
}

export default ServiceHistory;