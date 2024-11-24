import '../../App.css';
import '../../css/service-history/service-history.css';
import '../../css/service-history/select-organization.css';
import React, { useState } from 'react';
import serchHistoryImg from '../../assets/images/serch_history.png';
import { useNavigate } from 'react-router-dom';

function SelectOrganization() {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);

    const checkboxes = [
        {
            id: 1, label: "Morningstar India Private Limited",
            checked: false, joiningDate: '12/05/15', currentWorking: 'Still working here'
        },
        {
            id: 2, label: "Morningstar India Private Limited",
            checked: false, joiningDate: '12/05/15', currentWorking: 'Still working here'
        },
        {
            id: 3, label: "Morningstar India Private Limited",
            checked: false, joiningDate: '12/05/15', currentWorking: 'Still working here'
        },
        {
            id: 4, label: "Morningstar India Private Limited",
            checked: false, joiningDate: '12/05/15', currentWorking: 'Still working here'
        },
    ];

    // Handle checkbox change
    const handleCheckboxChange = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

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
                                <form>
                                    {checkboxes.map((checkbox) => (
                                        <div key={checkbox.id}>
                                            <ul className='list-group ms-4' >
                                                <li><span className='selectHeading'>{checkbox.label}</span><br></br>
                                                    <span className='selectTime px-2'>{checkbox.joiningDate} </span>
                                                    <div className="form-check mt-2 ps-0 d-flex justify-content-start">
                                                        <input className="large-checkbox me-3" type="checkbox" value=""
                                                            checked={selectedId === checkbox.id} onChange={() => handleCheckboxChange(checkbox.id)} />
                                                        <div className="form-check-label checkboxText">
                                                            {checkbox.currentWorking}
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
                            <button className='btn correctButton w-100' onClick={() => navigate("/doc-scan")}>
                                {selectedId ? 'Continue' : "Not working in any of these"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectOrganization;