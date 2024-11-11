import '../../App.css';
import '../../css/service-history/service-history.css';
import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import { useNavigate } from 'react-router-dom';
import serchHistoryImg from '../../assets/images/serch_history.png';
// import ToastMessage from '../common/toast-message';
// import MESSAGES from '../constants/messages'

// let isOpen =true;

function ServiceHistory() {

    const [isOpen, setIsOpen] = useState(null);

    const toggleDropdown = () => setIsOpen(!isOpen);


    // State to keep track of the selected item
    const [activeIndex, setActiveIndex] = useState(null);

    // Sample data for list items and details
    const listItems = [
        {
            id: 1, title: "Morningstar India Private Limited", details: {
                Member_Id: '65456465', NCP_Days: '5 Days', Joining_Date: '23ed Dec 2014',
                Exit_Date: '11th july 2018'
            }
        },
        {
            id: 2, title: "Morningstar India Private Limited", details: {
                Member_Id: '65456465', NCP_Days: '5 Days', Joining_Date: '23ed Dec 2014',
                Exit_Date: '11th july 2018'
            }
        },
        {
            id: 3, title: "Morningstar India Private Limited", details: {
                Member_Id: '65456465', NCP_Days: '5 Days', Joining_Date: '23ed Dec 2014',
                Exit_Date: '11th july 2018'
            }
        },
        {
            id: 4, title: "Morningstar India Private Limited", details: {
                Member_Id: '65456465', NCP_Days: '5 Days', Joining_Date: '23ed Dec 2014',
                Exit_Date: '11th july 2018'
            }
        },
    ];

    // Function to toggle the dropdown for a specific item
    const handleItemClick = (index) => {

        // If the same item is clicked, close the dropdown
        setActiveIndex(activeIndex === index ? null : index);
        // {toggleDropdown()}
    };

    return (
        <div className="container-fluid">
            <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 offset-lg-1">
                    <div className='row'>
                        <div className='col-md-12 mt-5 mt-sm-0'>
                            <img src={serchHistoryImg} alt="Service History" style={{ height: "22rem", width: "100%" }} />
                        </div>
                    </div>

                    <div className='row'>
                        <div className='uanNumber text-center'>UAN No</div>
                    </div>

                    <div className='row mt-1'>
                        <div className='uanNumberDigit text-center'>123654789365</div>
                    </div>
                </div>

                {/* Second column  */}

                <div className="col-lg-5 offset-lg-1">
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
                                        <React.Fragment key={item.id}>
                                            {/* List Item */}
                                            <li
                                                className="list-group-item collapsHeading"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleItemClick(index)}
                                            >
                                                {item.title}
                                                <span className={`ms-2 ${isOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'}`} style={{ marginLeft: 'auto' }}></span><br></br>

                                                <span className='timeDuration'>
                                                    12/05/15 - 15/10/20
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
                                                            <span className='dropdownSublabel'>{item.details.Member_Id}</span><br></br>
                                                            <span className='dropdownSublabel'>{item.details.NCP_Days}</span><br></br>
                                                            <span className='dropdownSublabel'>{item.details.Joining_Date}</span><br></br>
                                                            <span className='dropdownSublabel'>{item.details.Exit_Date}</span><br></br>
                                                        </div>

                                                    </div>
                                                </li>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </ul>
                            </div>

                            <div className="form-check mt-4 ps-0 d-flex justify-content-start">
                                <input className="large-checkbox me-3" type="checkbox" value="" />
                                <div className="form-check-label checkboxLabel">
                                    Still working here
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='row mt-4'>
                        <div className='col-md-6 col-sm-6'>
                            <button className='btn incorrectButton w-100'>This is incorrect</button>
                        </div>
                        <div className='col-md-6 col-sm-6 mt-3 mt-sm-0'>
                            <button className='btn correctButton w-100'>This is correct</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ServiceHistory;