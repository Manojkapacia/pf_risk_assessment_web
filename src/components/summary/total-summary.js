import { useEffect, useRef, useState } from 'react';
import '../../App.css';
import '../../css/summary/total-summary.css';
import { FaRegClock } from "react-icons/fa";
import PfBalanceAnalysis from './pf-balance-analysis';
import NextStep from './next-step';
import SummaryCard from './summary-card';
import ClaimRejection from './claim-rejection';
import { decryptData } from '../common/encryption-decryption';
import { getClosingBalance, getLastContribution } from '../../helper/data-transform';
import { useLocation } from 'react-router-dom';
import ConsultationModal from '../report/consultation-modal';
import ModalComponent from '../report/registration-modal';
import { get } from '../common/api';
import ToastMessage from '../common/toast-message';

function TotalSummary() {
    const location = useLocation();

    const [reportModalOpen, setReportModal] = useState(false);
    const [consultationModal, setConsultationModal] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [loading, setLoading] = useState(false);

    // Function to close the modal
    const closeReportModal = () => {
        setReportModal(false);
    };
    
    const consultationModalClose= () =>{
        setConsultationModal(false);
    }

    const { profileData } = location.state || {};
    const [summaryData, setSummaryData] = useState(null)
    const isMessageActive = useRef(false); // Prevents multiple messages from being displayed at the same time.

    // call the api to fetch the user report
    const fetchData = async() => {
        try {
            setLoading(true);
            const result = await get('/data/report/fetchByUan');
            setLoading(false);

            if (result.status === 400) {
                setMessage({ type: "error", content: result.message });
            } else {
                setSummaryData(result.data)
            }
        } catch (error) {
            setLoading(false);
            setMessage({ type: "error", content: error.message });
        }
    } 

    useEffect(() => {
        // check if user had registerd self with Finright 
        const isUserVerified = decryptData(localStorage.getItem('finright-reg-verified-' + localStorage.getItem('user_uan')))
        if(!(Boolean(isUserVerified))) setReportModal(true);

        // set the current page route
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan');
        let value = "full-summary";
        localStorage.setItem(dynamicKey, value);
        // call the function to get report and raw data by UAN
        fetchData()
    }, [])

    // Toast Message Auto Clear
    useEffect(() => {
        if (message.type) {
            isMessageActive.current = true; // Set active state when a message is displayed
            const timer = setTimeout(() => {
                setMessage({ type: "", content: "" });
                isMessageActive.current = false; // Reset active state
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    return (
        <>
        {loading && (
            <div className="loader-overlay">
                <div className="loader-container">
                    <p className="loader-text">Fetching Report, Please wait...</p>
                </div>
            </div>
        )}
        <div className="container">
            {message.type && <ToastMessage message={message.content} type={message.type} />}
            <div className="row d-flex justify-content-center align-items-center">
                <div className='col-lg-5 col-md-6 mt-4'>
                    <SummaryCard summaryData={summaryData}></SummaryCard>
                    <PfBalanceAnalysis></PfBalanceAnalysis>

                    <div className="card resolution-card text-white px-4 py-3 my-3">
                        <div className='row'>
                            <div className='col-lg-4 d-flex align-items-center justify-content-center justify-content-lg-start'>
                                <div className="">
                                    <p style={{ fontSize: '1.2rem', fontWeight: '600', lineHeight: '1.1' }}>Estimated Resolution Time</p>

                                </div>
                            </div>
                            <div className='col-lg-4 d-flex align-items-center justify-content-center'>
                                <div className="icon-container">
                                    <FaRegClock size={100} />
                                </div>
                            </div>
                            <div className='col-lg-4 mt-2 mt-lg-0 d-flex align-items-center justify-content-center justify-content-lg-start'>
                                <div className="mb-0">
                                    <p className="" style={{ fontSize: '1.5rem', fontWeight: '700' }}>4-6 Months</p>
                                    <p className='resolveButton py-1 mt-1 mb-0'>Resolve My Issues</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm px-4 py-3">
                        <div className="text-center">
                            <p className="KycHeading">KYC Verification</p>
                        </div>
                        <div className="row">
                            <div className="col-xl-6">
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <label className="d-block kycHeadText">Father's Name:</label>
                                        <p className="mb-0 kycSubText">DARSHAN</p>
                                    </div>
                                    <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                                        Incorrect
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <label className="d-block kycHeadText">Gender:</label>
                                        <p className="mb-0 kycSubText">MALE</p>
                                    </div>
                                    <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                                        Incorrect
                                    </span>
                                </div>
                                {/* <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <label className="d-block">Physical Handicap:</label>
                                        <p className="mb-0">None</p>
                                    </div>
                                    <span className="d-flex align-items-start text-danger">
                                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                                        Incorrect
                                    </span>
                                </div> */}
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <label className="d-block kycHeadText">Bank A/C Number:</label>
                                        <p className="mb-0 kycSubText">40XXXXXXXX2312</p>
                                    </div>
                                    <span className="d-flex align-items-start text-success me-2 kycDetailsCheck">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        Verified
                                    </span>
                                </div>
                            </div>

                            <div className="col-xl-6">
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <label className="d-block kycHeadText">Date of Birth:</label>
                                        <p className="mb-0 kycSubText">17/11/1993</p>
                                    </div>
                                    <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                                        Incorrect
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <label className="d-block kycHeadText">Aadhaar Number:</label>
                                        <p className="mb-0 kycSubText">808479258994</p>
                                    </div>
                                    <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                                        Incorrect
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <label className="d-block kycHeadText">PAN Number:</label>
                                        <p className="mb-0 kycSubText">AXOPT7789W</p>
                                    </div>
                                    <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                                        Incorrect
                                    </span>
                                </div>
                                {/* <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <label className="d-block">IFSC Number:</label>
                                        <p className="mb-0">KKBK0000646</p>
                                    </div>
                                    <span className="d-flex align-items-start text-danger">
                                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                                        Incorrect
                                    </span>
                                </div> */}
                            </div>
                            <div
                                className="text-danger mt-2">
                                <p className='kycSubText mb-0'>
                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                    <b>2 Issues Found:</b> Father's name & Bank Account IFSC number are
                                    an important factor for KYC verification. Incomplete KYC will result
                                    in Claim Rejections.
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className="card shadow-sm mt-3 px-4 py-3">
                        <div className="text-center">
                            <p className="KycHeading mb-0">Employment History</p>
                        </div>
                        <table className="table mt-2">
                            <thead>
                                <tr>
                                    <th className='kycDetailsCheck' scope="col">Check</th>
                                    <th className='kycDetailsCheck' scope="col">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='kycSubText'>Full Employment History</td>
                                    <td>
                                        <span className="text-danger kycDetailsCheck">
                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                            Missing Employment Record
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='kycSubText'>Full Withdraw-ability</td>
                                    <td>
                                        <span className="kycDetailsCheck" style={{ color: '#F56905' }}>
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            Not Eligible
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='kycSubText'>Date of Exit</td>
                                    <td>
                                        <span className="text-success kycDetailsCheck">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            Updated
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='kycSubText'>Service Overlap</td>
                                    <td>
                                        <span className="text-success kycDetailsCheck">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            Not Found
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{ color: '#F56905' }}>
                            <p className='mb-0 kycSubText'>
                                <i className="bi bi-exclamation-circle-fill me-2"></i>
                                <b>1 Issue Found:</b> You are not eligible for withdrawing the entire
                                PF amount as you’re currently working at Morningstar India Pvt. Ltd.
                            </p>
                        </div>
                    </div>

                    <div className="card shadow-sm mt-3 px-4 py-3">
                        <div className="text-center">
                            <p className="KycHeading mb-0">PF Contributions</p>
                        </div>

                        <table className="table mt-2">
                            <thead>
                                <tr>
                                    <th className='kycDetailsCheck' scope="col">Check</th>
                                    <th className='kycDetailsCheck' scope="col">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='kycSubText'>Amount Consolidation</td>
                                    <td>
                                        <span className="text-success kycDetailsCheck">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            No Issue Found
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='kycSubText'>Contribution Anomalies - DOE</td>
                                    <td>
                                        <span className="text-danger kycDetailsCheck">
                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                            Critical Issue Found
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='kycSubText'>Contribution Anomalies - DOJ</td>
                                    <td>
                                        <span className="text-success kycDetailsCheck">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            No Issue Found
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="text-danger">
                            <p className='mb-0  kycSubText'>
                                <i className="bi bi-exclamation-circle-fill me-2"></i>
                                <b>1 Issue Found:</b> Contribution anomalies lead to issues in Transfer/Withdrawal &amp; lead to unintended complications like Service Overlap.
                            </p>
                        </div>
                    </div>

                    <div className="card shadow-sm mt-3 px-4 py-3">
                        <div className="text-center">
                            <p className="KycHeading mb-0">EPS Pension Records</p>
                        </div>

                        <table className="table mt-2">
                            <thead>
                                <tr>
                                    <th className='kycDetailsCheck' scope="col">Check</th>
                                    <th className='kycDetailsCheck' scope="col">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='kycSubText'>Is EPS Member?</td>
                                    <td>
                                        {/* <span className="text-success fw-bold">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            No Issue Found
                                        </span> */}
                                        <span className='kycDetailsCheck'>Not a Member</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='kycSubText'>EPS Contribution Anomalies</td>
                                    <td>
                                        <span className="text-danger kycDetailsCheck">
                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                            Critical Issue Found
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="text-danger">
                            <p className='mb-0 kycSubText'>
                                <i className="bi bi-exclamation-circle-fill me-2"></i>
                                <b>1 Issue Found:</b> Majority of issues with EPF are related to EPS Membership.
                                Correcting EPS discrepancies often requires Employer support.
                            </p>
                        </div>
                    </div>

                    <div className="card shadow-sm mt-3 px-4 py-3">
                        <div className="text-center">
                            <p className="KycHeading mb-0">Transfer Records</p>
                        </div>

                        <table className="table mt-2">
                            <thead>
                                <tr>
                                    <th className='kycDetailsCheck' scope="col">Check</th>
                                    <th className='kycDetailsCheck' scope="col">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='kycSubText'>Transfer Out Missing</td>
                                    <td>
                                        <span className="text-success kycDetailsCheck">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            No Issue Found
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='kycSubText'>Transfer In Missing</td>
                                    <td>
                                        <span className="text-success kycDetailsCheck">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            No Issue Found
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="text-success">
                            <p className='mb-0 kycSubText'>
                                <i className="bi bi-check-circle-fill me-2"></i>
                                <b>No Issue Found, </b> All Good! 1 less thing to worry about.
                            </p>
                        </div>
                    </div>
                    
                    <ClaimRejection></ClaimRejection>
                    <NextStep></NextStep>

                </div>
                <ModalComponent profileData={profileData} isOpen={reportModalOpen} onClose={closeReportModal} />
                <ConsultationModal isOpen={consultationModal} onClose={consultationModalClose} />
            </div>
        </div>
        </>
    )
}

export default TotalSummary;