import { useEffect, useRef, useState } from 'react';
import '../../App.css';
import '../../css/summary/total-summary.css';
import { FaRegClock } from "react-icons/fa";
import PfBalanceAnalysis from './pf-balance-analysis';
import NextStep from './next-step';
import SummaryCard from './summary-card';
import ClaimRejection from './claim-rejection';
import { useLocation, useNavigate } from 'react-router-dom';
import ConsultationModal from '../report/consultation-modal';
import ModalComponent from '../report/registration-modal';
import { get } from '../common/api';
import ToastMessage from '../common/toast-message';
import ReportPaymentModal from './reportPaymentModal';
import MESSAGES from '../constants/messages';


function TotalSummary() {
    const location = useLocation();
    const navigate = useNavigate();

    const [reportModalOpen, setReportModal] = useState(false);
    const [consultationModal, setConsultationModal] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [isBlurred, setIsBlurred] = useState(true);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [loading, setLoading] = useState(false);
    const [summaryData, setSummaryData] = useState(null)
    const [categoryDetailsFromReport, setCategoryDetailsFromReport] = useState([])
    const isMessageActive = useRef(false); // Prevents multiple messages from being displayed at the same time.
    let amountStuck= summaryData?.reportData?.totalAmountStuck;
    const { profileData } = location.state || {};

    const handleReportModal = (value) => {
        setIsBlurred(value);
    };

    const handleModalOpen = () => {
        setIsBlurred(true);
        setPaymentModal(true);
    };

    const closeReportModal = () => {
        setReportModal(false);
        fetchData();
    };

    const consultationModalClose = () => {
        setConsultationModal(false);
    }

    const paymentModalClose = (isSuccess) => {
        setPaymentModal(false);
        isSuccess ? setIsBlurred(false) : setIsBlurred(true)
    }

    const screenRef = useRef(null);

    // call the api to fetch the user report
    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await get('/data/report/fetchByUan');
            setLoading(false);

            if (result.status === 400) {
                setMessage({ type: "error", content: result.message });
            } else if (result.status === 401) {
                localStorage.clear()
                navigate('/');
            } else {
                // set data
                setSummaryData(result.data)

                // process data
                processReportData()               
        
                // check if user had registerd self with Finright & payment done or not
                const isUserReg = result?.data?.userProfile?.isFinrightRegisterd
                const isPaymentDone = result?.data?.userProfile?.isPaymentDone
                if (!isUserReg) setReportModal(true);
                if (isPaymentDone) setIsBlurred(false);
            }
        } catch (error) {
            setLoading(false);
            setMessage({ type: "error", content: error.message });
        }
    }

    useEffect(() => {
        // check if returned from phone pay screen 
        const queryParams = new URLSearchParams(window.location.search);
        const payParam = queryParams.get('pay'); // Get the `pay` query parameter

        if (payParam) {
          const decodedPay = atob(payParam); // Decode the Base64 value
          if (decodedPay === 'true') {
            setMessage({ type: "success", content: MESSAGES.success.paymentSuccess });
          }
          if (decodedPay === 'false') {
            setMessage({ type: "error", content: MESSAGES.error.paymentFailed });
          }
          setTimeout(() => {
            queryParams.delete('pay'); // Remove the `pay` parameter
            const newUrl = `${window.location.pathname}`; // Rebuild the URL
            window.history.replaceState(null, '', newUrl); // Update the URL without reloading the page
          }, 5000);
        }

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

    // function to check status for KYC 
    const isInvalid = (valueToCheck) => {
        const kycCategory = summaryData?.reportData?.withdrawabilityCheckupReport.find((item) => item.category.toUpperCase() === 'KYC')
        return kycCategory?.subCategory?.length && kycCategory?.subCategory[0].errorMessages.some(msg => msg.toLowerCase().includes(valueToCheck.toLowerCase()))
    }

    // Function to process data and set state
    const processReportData = () => {
        if (!summaryData?.reportData?.withdrawabilityCheckupReport) return;

        const processedData = summaryData?.reportData.withdrawabilityCheckupReport.map(category => {
            return category.subCategory.map(sub => ({
                category: category.category,
                subCategory: sub.name,
                criticalCount: sub.critical,
                mediumCount: sub.medium,
                totalErrorCount: sub.critical + sub.medium,
                consolidatedErrorMessage: sub?.errorMessages?.filter((msg) => msg)
                    ?.map((msg, index) => (
                        <span
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start'
                            }}
                        >
                            <span style={{ marginRight: '0.5rem' }}>{index + 1}.</span>
                            <span style={{ textAlign: 'left', flex: 1 }}>{msg}.</span>
                        </span>
                    ))
            }));
        }).flat(); // Flattening to avoid nested arrays

        setCategoryDetailsFromReport(processedData);
    };

    useEffect(() => {
        processReportData()
    }, [summaryData])

    const getSelectedCategoryData = (category) => {
        if (!summaryData?.reportData?.withdrawabilityCheckupReport) return;
        const categoryData = summaryData?.reportData?.withdrawabilityCheckupReport.find((item) => item.category.toUpperCase() === category.toUpperCase())

        return {
            totalCritical: categoryData?.totalCritical,
            totalMedium: categoryData?.totalMedium,
            consolidatedErrorMessage: categoryData?.subCategory
                ?.flatMap((sub) => sub.errorMessages)
                ?.filter((msg) => msg)
                ?.map((msg, index) => (
                    <span
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            //   marginBottom: '0.5rem',
                        }}
                    >
                        <span style={{ marginRight: '0.5rem' }}>{index + 1}.</span>
                        <span style={{ textAlign: 'left', flex: 1 }}>{msg}.</span>
                    </span>
                ))
        }
    }

    const maskAdharNumber = (number) => {
        if (number) {
            const lastFourDigits = number.slice(-4);
            return `XXXXXXXX${lastFourDigits}`;
        }
    };

    const maskPanNumber = (number) => {
        if (number) {
            const lastFourDigits = number.slice(-4);
            return `XXXXXX${lastFourDigits}`;
        }
    };

    const getSelectedSubCategoryData = (subCategory) => {
        return categoryDetailsFromReport && categoryDetailsFromReport.find((item) => item.subCategory.toUpperCase() === subCategory.toUpperCase())
    }

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
                <div className="row d-flex justify-content-center align-items-center" ref={screenRef}>
                    {/* <div className='col-12 text-center mt-3'>
                    <button className='btn downloadReport py-2 py-lg-3 px-5' onClick={handleDownloadPdf}>Download Report <i class="bi bi-download ms-2"></i></button>
                    </div> */}
                    <div className='col-lg-5 col-md-6 mt-3'>
                    
                        <SummaryCard 
                            summaryData={summaryData} 
                            screenRef={screenRef} 
                            setBlurEffect={isBlurred} 
                            mobileNumber={summaryData?.userProfile?.whatsAppPhoneNumber}
                        ></SummaryCard>
                        <ClaimRejection reportData={summaryData}></ClaimRejection>
                        <PfBalanceAnalysis summaryData={summaryData} setBlurEffect={isBlurred} isRegModalOpen={reportModalOpen} ></PfBalanceAnalysis>

                        {/* Resolution Time Section  */}
                        <div className="card resolution-card text-white px-4 py-3 my-3">
                            <div className='row'>
                                <div className='col-lg-4 d-flex align-items-center justify-content-center justify-content-lg-start'>
                                    <div className="">
                                        <p style={{ fontSize: '1.2rem', fontWeight: '600', lineHeight: '1.1' }}>{summaryData?.reportData?.totalAmountStuck > 0 ? 'Estimated Resolution Time': 'Estimated Withdrawal time'} </p>
                                    </div>
                                </div>
                                <div className='col-lg-4 d-flex align-items-center justify-content-center'>
                                    <div className="icon-container">
                                        <FaRegClock size={100} />
                                    </div>
                                </div>
                                <div className='col-lg-4 mt-2 mt-lg-0 d-flex align-items-center justify-content-center justify-content-lg-start'>
                                    <div className="mb-0">
                                        <p className="text-center text-lg-start" style={{ fontSize: '1.5rem', fontWeight: '700' }}>{summaryData?.reportData?.estimatedResolutionTime}</p>
                                        {/* <p className='resolveButton py-1 mt-1 mb-0' style={{ cursor: 'pointer' }} >Resolve My Issues</p> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KYC Details Check Section  */}
                        <div className="card shadow-sm px-4 py-3">
                            <div className="text-center">
                                <p className="KycHeading">KYC Verification</p>
                            </div>
                            <div className={`${isBlurred ? 'blur-content' : ''}`}>
                                <div className="row">
                                    <div className="col-xl-6">
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>
                                                <label className="d-block kycHeadText">{summaryData?.rawData?.data?.profile?.basicDetails?.relation.toUpperCase() === 'F' ? "Father's Name" : "Husband's Name"}:</label>
                                                <p className="mb-0 kycSubText">{summaryData?.rawData?.data?.profile?.basicDetails?.fatherHusbandName}</p>
                                            </div>
                                            {isInvalid(('Father/Husband Name')) &&
                                                <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                    Incorrect
                                                </span>
                                            }
                                            {!isInvalid(('Father/Husband Name')) &&
                                                <span className="d-flex align-items-start text-success me-2 kycDetailsCheck">
                                                    <i className="bi bi-check-circle-fill me-2"></i>
                                                    Verified
                                                </span>
                                            }
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>
                                                <label className="d-block kycHeadText">Gender:</label>
                                                <p className="mb-0 kycSubText">{summaryData?.rawData?.data?.profile?.basicDetails?.gender.toUpperCase() === "M" ? "Male" : "Female"}</p>
                                            </div>
                                            {isInvalid(('Gender')) &&
                                                <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                    Incorrect
                                                </span>
                                            }
                                            {!isInvalid(('Gender')) &&
                                                <span className="d-flex align-items-start text-success me-2 kycDetailsCheck">
                                                    <i className="bi bi-check-circle-fill me-2"></i>
                                                    Verified
                                                </span>
                                            }
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>
                                                <label className="d-block kycHeadText">Phy. Handicapped:</label>
                                                <p className="mb-0 kycSubText">{summaryData?.rawData?.data?.profile?.basicDetails?.physicallyHandicapped.toUpperCase() === "N" ? "None" : "Yes"}</p>
                                            </div>
                                            {isInvalid(('Physically Handicapped')) &&
                                                <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                    Incorrect
                                                </span>
                                            }
                                            {!isInvalid(('Physically Handicapped')) &&
                                                <span className="d-flex align-items-start text-success me-2 kycDetailsCheck">
                                                    <i className="bi bi-check-circle-fill me-2"></i>
                                                    Verified
                                                </span>
                                            }
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>
                                                <label className="d-block kycHeadText">Bank A/C Number:</label>
                                                <p className="mb-0 kycSubText">{summaryData?.rawData?.data?.profile?.kycDetails?.bankAccountNumber}</p>
                                            </div>
                                            {isInvalid(('Bank Account Number')) &&
                                                <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                    Incorrect
                                                </span>
                                            }
                                            {!isInvalid(('Bank Account Number')) &&
                                                <span className="d-flex align-items-start text-success me-2 kycDetailsCheck">
                                                    <i className="bi bi-check-circle-fill me-2"></i>
                                                    Verified
                                                </span>
                                            }
                                        </div>
                                    </div>

                                    <div className="col-xl-6">
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>
                                                <label className="d-block kycHeadText">Date of Birth:</label>
                                                <p className="mb-0 kycSubText">{summaryData?.rawData?.data?.profile?.basicDetails?.dateOfBirth}</p>
                                            </div>
                                            {isInvalid(('Date of Birth')) &&
                                                <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                    Incorrect
                                                </span>
                                            }
                                            {!isInvalid(('Date of Birth')) &&
                                                <span className="d-flex align-items-start text-success me-2 kycDetailsCheck">
                                                    <i className="bi bi-check-circle-fill me-2"></i>
                                                    Verified
                                                </span>
                                            }
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>
                                                <label className="d-block kycHeadText">Aadhaar Number:</label>
                                                <p className="mb-0 kycSubText">{maskAdharNumber(summaryData?.rawData?.data?.profile?.kycDetails?.aadhaar)}</p>
                                            </div>
                                            {isInvalid(('Aadhaar Number')) &&
                                                <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                    Incorrect
                                                </span>
                                            }
                                            {!isInvalid(('Aadhaar Number')) &&
                                                <span className="d-flex align-items-start text-success me-2 kycDetailsCheck">
                                                    <i className="bi bi-check-circle-fill me-2"></i>
                                                    Verified
                                                </span>
                                            }
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>
                                                <label className="d-block kycHeadText">PAN Number:</label>
                                                <p className="mb-0 kycSubText">{maskPanNumber(summaryData?.rawData?.data?.profile?.kycDetails?.pan)}</p>
                                            </div>
                                            {isInvalid(('Pan Number')) &&
                                                <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                    Incorrect
                                                </span>
                                            }
                                            {!isInvalid(('Pan Number')) &&
                                                <span className="d-flex align-items-start text-success me-2 kycDetailsCheck">
                                                    <i className="bi bi-check-circle-fill me-2"></i>
                                                    Verified
                                                </span>
                                            }
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>
                                                <label className="d-block kycHeadText">IFSC Number:</label>
                                                <p className="mb-0 kycSubText">{summaryData?.rawData?.data?.profile?.kycDetails?.bankIFSC}</p>
                                            </div>
                                            {isInvalid(('Bank IFSC')) &&
                                                <span className="d-flex align-items-start text-danger kycDetailsCheck">
                                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                    Incorrect
                                                </span>
                                            }
                                            {!isInvalid(('Bank IFSC')) &&
                                                <span className="d-flex align-items-start text-success me-2 kycDetailsCheck">
                                                    <i className="bi bi-check-circle-fill me-2"></i>
                                                    Verified
                                                </span>
                                            }
                                        </div>
                                    </div>

                                    {(getSelectedSubCategoryData('KYC')?.criticalCount > 0 || getSelectedSubCategoryData('KYC')?.mediumCount > 0) &&
                                        <div
                                            className={getSelectedSubCategoryData('KYC')?.criticalCount > 0 ? "text-danger mt-2" : "text-warning-custom mt-2"}>
                                            <p className='kycSubText mb-0 ' style={{ fontWeight: '400' }}>
                                                <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                <b>{getSelectedSubCategoryData('KYC')?.totalErrorCount} Issues Found: </b>{getSelectedSubCategoryData('KYC')?.consolidatedErrorMessage}
                                            </p>
                                        </div>
                                    }
                                    {(getSelectedSubCategoryData('KYC')?.criticalCount === 0 && getSelectedSubCategoryData('KYC')?.mediumCount === 0) &&
                                        <div className="text-success">
                                            <p className='mb-0 kycSubText' style={{ fontWeight: '400' }}>
                                                <i className="bi bi-check-circle-fill me-2"></i>
                                                <b>No Issue Found, </b> All Good! 1 less thing to worry about.
                                            </p>
                                        </div>
                                    }
                                </div>
                            </div>
                            {isBlurred && !reportModalOpen && (
                                <div className="center-button">
                                    <button className="btn" data-bs-toggle="modal" onClick={handleModalOpen}
                                        data-bs-target="#exampleModal" style={{ color: '#ffffff', backgroundColor: 'green' }}>Access Full Report<br></br> Just ₹99/-</button>
                                </div>
                            )}
                             <ReportPaymentModal onClose={paymentModalClose} mobileNumber={summaryData?.userProfile?.whatsAppPhoneNumber}></ReportPaymentModal>
                        </div>

                        {/* Employee History Check Section  */}
                        <div className={`card shadow-sm mt-3 px-4 py-3 blur-container position-relative`}>
                            <div className="text-center">
                                <p className="KycHeading mb-0">Employment History</p>
                            </div>
                            <div className={`${isBlurred ? 'blur-content' : ''}`}>
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
                                                <>
                                                    {(getSelectedSubCategoryData('Employement_Record')?.criticalCount > 0) &&
                                                        <span className="text-danger kycDetailsCheck">
                                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Employement_Record')?.criticalCount} critical issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Employement_Record')?.criticalCount === 0 && getSelectedSubCategoryData('Employement_Record')?.mediumCount > 0) &&
                                                        <span className="kycDetailsCheck" style={{ color: '#F56905' }}>
                                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Employement_Record')?.mediumCount} medium issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Employement_Record')?.criticalCount === 0 && getSelectedSubCategoryData('Employement_Record')?.mediumCount === 0) &&
                                                        <span className="text-success kycDetailsCheck">
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            No Issue Found
                                                        </span>
                                                    }
                                                </>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='kycSubText'>Full Withdraw-ability</td>
                                            <td>
                                                <>
                                                    {(getSelectedSubCategoryData('Full_Withdrawability')?.criticalCount > 0) &&
                                                        <span className="text-danger kycDetailsCheck">
                                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Full_Withdrawability')?.criticalCount} critical issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Full_Withdrawability')?.criticalCount === 0 && getSelectedSubCategoryData('Full_Withdrawability')?.mediumCount > 0) &&
                                                        <span className="kycDetailsCheck" style={{ color: '#F56905' }}>
                                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                            Not Eligible
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Full_Withdrawability')?.criticalCount === 0 && getSelectedSubCategoryData('Full_Withdrawability')?.mediumCount === 0) &&
                                                        <span className="text-success kycDetailsCheck">
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            No Issue Found
                                                        </span>
                                                    }
                                                </>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='kycSubText'>Date of Exit</td>
                                            <td>
                                                <>
                                                    {(getSelectedSubCategoryData('Date_Of_Exit')?.criticalCount > 0) &&
                                                        <span className="text-danger kycDetailsCheck">
                                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Date_Of_Exit')?.criticalCount} critical issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Date_Of_Exit')?.criticalCount === 0 && getSelectedSubCategoryData('Date_Of_Exit')?.mediumCount > 0) &&
                                                        <span className="kycDetailsCheck" style={{ color: '#F56905' }}>
                                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Date_Of_Exit')?.mediumCount} medium issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Date_Of_Exit')?.criticalCount === 0 && getSelectedSubCategoryData('Date_Of_Exit')?.mediumCount === 0) &&
                                                        <span className="text-success kycDetailsCheck">
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            No Issue Found
                                                        </span>
                                                    }
                                                </>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='kycSubText'>Service Overlap</td>
                                            <td>
                                                <>
                                                    {(getSelectedSubCategoryData('Service_Overlap')?.criticalCount > 0) &&
                                                        <span className="text-danger kycDetailsCheck">
                                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Service_Overlap')?.criticalCount} critical issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Service_Overlap')?.criticalCount === 0 && getSelectedSubCategoryData('Service_Overlap')?.mediumCount > 0) &&
                                                        <span className="kycDetailsCheck" style={{ color: '#F56905' }}>
                                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Service_Overlap')?.mediumCount} medium issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Service_Overlap')?.criticalCount === 0 && getSelectedSubCategoryData('Service_Overlap')?.mediumCount === 0) &&
                                                        <span className="text-success kycDetailsCheck">
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            No Issue Found
                                                        </span>
                                                    }
                                                </>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {(getSelectedCategoryData('Employment History')?.totalCritical > 0) &&
                                    <div
                                        className={getSelectedCategoryData('Employment History')?.totalCritical > 0 ? "text-danger" : "text-warning-custom"}>
                                        <p className='mb-0 kycSubText' style={{ fontWeight: '400' }}>
                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                            <b>{getSelectedCategoryData('Employment History')?.totalCritical + getSelectedCategoryData('Employment History')?.totalMedium} Issue Found:</b> {getSelectedCategoryData('Employment History')?.consolidatedErrorMessage}
                                        </p>
                                    </div>
                                }
                                {(getSelectedCategoryData('Employment History')?.totalCritical === 0) &&
                                    <div className="text-success">
                                        <p className='mb-0 kycSubText' style={{ fontWeight: '400' }}>
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            <b>No Issue Found, </b> All Good! 1 less thing to worry about.
                                        </p>
                                    </div>
                                }
                            </div>

                            {isBlurred && !reportModalOpen &&  (
                                <div className="center-button">
                                    <button className="btn" data-bs-toggle="modal" onClick={handleModalOpen}
                                        data-bs-target="#exampleModal" style={{ color: '#ffffff', backgroundColor: 'green' }}>Access Full Report <br></br>Just ₹99/-</button>
                                </div>
                            )}
                            <ReportPaymentModal  onClose={paymentModalClose} mobileNumber={summaryData?.userProfile?.whatsAppPhoneNumber}></ReportPaymentModal>
                        </div>

                        {/* Contribution Check Section */}
                        <div className="card shadow-sm mt-3 px-4 py-3">
                            <div className="text-center">
                                <p className="KycHeading mb-0">PF Contributions</p>
                            </div>
                            <div className={`${isBlurred ? 'blur-content' : ''}`}>
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
                                                <>
                                                    {(getSelectedSubCategoryData('Amount_Consolidation')?.criticalCount > 0) &&
                                                        <span className="text-danger kycDetailsCheck">
                                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Amount_Consolidation')?.criticalCount} critical issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Amount_Consolidation')?.criticalCount === 0 && getSelectedSubCategoryData('Amount_Consolidation')?.mediumCount > 0) &&
                                                        <span className="kycDetailsCheck" style={{ color: '#F56905' }}>
                                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Amount_Consolidation')?.mediumCount} medium issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Amount_Consolidation')?.criticalCount === 0 && getSelectedSubCategoryData('Amount_Consolidation')?.mediumCount === 0) &&
                                                        <span className="text-success kycDetailsCheck">
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            No Issue Found
                                                        </span>
                                                    }
                                                </>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='kycSubText'>Contribution Anomalies - DOE</td>
                                            <td>
                                                <>
                                                    {(getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.criticalCount > 0) &&
                                                        <span className="text-danger kycDetailsCheck">
                                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.criticalCount} critical issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.criticalCount === 0 && getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.mediumCount > 0) &&
                                                        <span className="kycDetailsCheck" style={{ color: '#F56905' }}>
                                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.mediumCount} medium issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.criticalCount === 0 && getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.mediumCount === 0) &&
                                                        <span className="text-success kycDetailsCheck">
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            No Issue Found
                                                        </span>
                                                    }
                                                </>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='kycSubText'>Contribution Anomalies - DOJ</td>
                                            <td>
                                                <>
                                                    {(getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.criticalCount > 0) &&
                                                        <span className="text-danger kycDetailsCheck">
                                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.criticalCount} critical issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.criticalCount === 0 && getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.mediumCount > 0) &&
                                                        <span className="kycDetailsCheck" style={{ color: '#F56905' }}>
                                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.mediumCount} medium issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.criticalCount === 0 && getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.mediumCount === 0) &&
                                                        <span className="text-success kycDetailsCheck">
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            No Issue Found
                                                        </span>
                                                    }
                                                </>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {(getSelectedCategoryData('PF Contributions')?.totalCritical > 0 || getSelectedCategoryData('PF Contributions')?.totalMedium > 0) &&
                                    <div
                                        className={getSelectedCategoryData('PF Contributions')?.totalCritical > 0 ? "text-danger" : "text-warning-custom"}>
                                        <p className='mb-0 kycSubText' style={{ fontWeight: '400' }}>
                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                            <b>{getSelectedCategoryData('PF Contributions')?.totalCritical + getSelectedCategoryData('PF Contributions')?.totalMedium} Issue Found:</b> {getSelectedCategoryData('PF Contributions')?.consolidatedErrorMessage}
                                        </p>
                                    </div>
                                }
                                {(getSelectedCategoryData('PF Contributions')?.totalCritical === 0 && getSelectedCategoryData('PF Contributions')?.totalMedium === 0) &&
                                    <div className="text-success">
                                        <p className='mb-0 kycSubText' style={{ fontWeight: '400' }}>
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            <b>No Issue Found, </b> All Good! 1 less thing to worry about.
                                        </p>
                                    </div>
                                }
                            </div>
                            {isBlurred && !reportModalOpen && (
                                <div className="center-button">
                                    <button className="btn" data-bs-toggle="modal" onClick={handleModalOpen}
                                        data-bs-target="#exampleModal" style={{ color: '#ffffff', backgroundColor: 'green' }}>Access Full Report <br></br>Just ₹99/-</button>
                                </div>
                            )}
                           <ReportPaymentModal onClose={paymentModalClose} mobileNumber={summaryData?.userProfile?.whatsAppPhoneNumber}></ReportPaymentModal>
                        </div>

                        {/* Pension Check Section */}
                        <div className="card shadow-sm mt-3 px-4 py-3">
                            <div className="text-center">
                                <p className="KycHeading mb-0">EPS Pension Records</p>
                            </div>
                            <div className={`${isBlurred ? 'blur-content' : ''}`}>
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
                                                <span className={getSelectedCategoryData('EPF Pension Records')?.isEpsMember === "N" ? "text-danger kycDetailsCheck" : "text-success kycDetailsCheck"}>{getSelectedCategoryData('EPF Pension Records')?.isEpsMember === "N" ? "Not a Member" : "Yes"}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='kycSubText'>EPS Contribution Anomalies</td>
                                            <td>
                                                <>
                                                    {(getSelectedSubCategoryData('Pension')?.criticalCount > 0 || getSelectedSubCategoryData('Pension')?.mediumCount > 0) &&
                                                        <span className="text-danger kycDetailsCheck">
                                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                            Critical Issue Found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Pension')?.criticalCount === 0 && getSelectedSubCategoryData('Pension')?.mediumCount === 0) &&
                                                        <span className="text-success kycDetailsCheck">
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            No Issue Found
                                                        </span>
                                                    }
                                                </>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {(getSelectedCategoryData('EPF Pension Records')?.totalCritical > 0 || getSelectedCategoryData('EPF Pension Records')?.totalMedium > 0) &&
                                    <div
                                        className={getSelectedCategoryData('EPF Pension Records')?.totalCritical > 0 ? "text-danger" : "text-warning-custom"}>
                                        <p className='mb-0 kycSubText' style={{ fontWeight: '400' }}>
                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                            <b>{getSelectedCategoryData('EPF Pension Records')?.totalCritical + getSelectedCategoryData('EPF Pension Records')?.totalMedium} Issue Found:</b> {getSelectedCategoryData('EPF Pension Records')?.consolidatedErrorMessage}
                                        </p>
                                    </div>
                                }
                                {(getSelectedCategoryData('EPF Pension Records')?.totalCritical === 0 && getSelectedCategoryData('EPF Pension Records')?.totalMedium === 0) &&
                                    <div className="text-success">
                                        <p className='mb-0 kycSubText' style={{ fontWeight: '400' }}>
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            <b>No Issue Found, </b> All Good! 1 less thing to worry about.
                                        </p>
                                    </div>
                                }
                            </div>
                            {!reportModalOpen && <ReportPaymentModal onClose={paymentModalClose} mobileNumber={summaryData?.userProfile?.whatsAppPhoneNumber}></ReportPaymentModal>}
                        </div>

                        <div className="card shadow-sm mt-3 px-4 py-3">
                            <div className="text-center">
                                <p className="KycHeading mb-0">Transfer Records</p>
                            </div>
                            <div className={`${isBlurred ? 'blur-content' : ''}`}>
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
                                                <>
                                                    {(getSelectedSubCategoryData('Transfer_Out')?.criticalCount > 0) &&
                                                        <span className="text-danger kycDetailsCheck">
                                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Transfer_Out')?.criticalCount} critical issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Transfer_Out')?.criticalCount === 0 && getSelectedSubCategoryData('Transfer_Out')?.mediumCount > 0) &&
                                                        <span className="kycDetailsCheck" style={{ color: '#F56905' }}>
                                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Transfer_Out')?.mediumCount} medium issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Transfer_Out')?.criticalCount === 0 && getSelectedSubCategoryData('Transfer_Out')?.mediumCount === 0) &&
                                                        <span className="text-success kycDetailsCheck">
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            No Issue Found
                                                        </span>
                                                    }
                                                </>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='kycSubText'>Transfer In Missing</td>
                                            <td>
                                                <>
                                                    {(getSelectedSubCategoryData('Transfer_In')?.criticalCount > 0) &&
                                                        <span className="text-danger kycDetailsCheck">
                                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Transfer_In')?.criticalCount} critical issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Transfer_In')?.criticalCount === 0 && getSelectedSubCategoryData('Transfer_In')?.mediumCount > 0) &&
                                                        <span className="kycDetailsCheck" style={{ color: '#F56905' }}>
                                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                            {getSelectedSubCategoryData('Transfer_In')?.mediumCount} medium issue found
                                                        </span>
                                                    }
                                                    {(getSelectedSubCategoryData('Transfer_In')?.criticalCount === 0 && getSelectedSubCategoryData('Transfer_In')?.mediumCount === 0) &&
                                                        <span className="text-success kycDetailsCheck">
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            No Issue Found
                                                        </span>
                                                    }
                                                </>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {(getSelectedCategoryData('Passbook Records')?.totalCritical > 0 || getSelectedCategoryData('Passbook Records')?.totalMedium > 0) &&
                                    <div
                                        className={getSelectedCategoryData('Passbook Records')?.totalCritical > 0 ? "text-danger" : "text-warning-custom"}>
                                        <p className='mb-0 kycSubText' style={{ fontWeight: '400' }}>
                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                            <b>{getSelectedCategoryData('Passbook Records')?.totalCritical + getSelectedCategoryData('Passbook Records')?.totalMedium} Issue Found:</b> {getSelectedCategoryData('Passbook Records')?.consolidatedErrorMessage}
                                        </p>
                                    </div>
                                }
                                {(getSelectedCategoryData('Passbook Records')?.totalCritical === 0 && getSelectedCategoryData('Passbook Records')?.totalMedium === 0) &&
                                    <div className="text-success">
                                        <p className='mb-0 kycSubText' style={{ fontWeight: '400' }}>
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            <b>No Issue Found, </b> All Good! 1 less thing to worry about.
                                        </p>
                                    </div>
                                }
                            </div>
                            {isBlurred && !reportModalOpen &&  (
                                <div className="center-button">
                                    <button className="btn" data-bs-toggle="modal" onClick={handleModalOpen}
                                        data-bs-target="#exampleModal" style={{ color: '#ffffff', backgroundColor: 'green' }}>Access Full Report<br></br> Just ₹99/-</button>
                                </div>
                            )}
                           <ReportPaymentModal onClose={paymentModalClose} mobileNumber={summaryData?.userProfile?.whatsAppPhoneNumber}></ReportPaymentModal> 
                        </div>
                        <NextStep setBlurEffect={isBlurred} amountStuck={amountStuck}></NextStep>

                    </div>
                    <ModalComponent profileData={profileData} isOpen={reportModalOpen} onClose={closeReportModal} />
                    <ConsultationModal isOpen={consultationModal} onClose={consultationModalClose} />
                </div>
            </div>
        </>
    )
}

export default TotalSummary;