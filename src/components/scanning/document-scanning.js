import React, { useState, useEffect } from 'react';
import '../../css/scanning/doc-scan.css';
import '../../App.css';
import CircularProgress from '../common/circular-progress'
import { BsClock, BsCheck2Circle, BsExclamationOctagon, BsExclamationCircle, BsChevronCompactRight, BsShieldCheck } from "react-icons/bs";
import ScanResult from '../scanning/scan-result'
import { useLocation, useNavigate } from 'react-router-dom';
import { post } from '../common/api';
import Loader from '../common/loader';
import ToastMessage from '../common/toast-message';

const DocumentScanning = () => {
    const location = useLocation();

    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(true);
    const [isViewingResult, setIsViewingResult] = useState(false);
    const [categories, setCategories] = useState([])
    const [currentCategory, setCurrentCategory] = useState([])
    const [loading, setLoading] = useState(false);
    const [currentViewResultCategory, setCurrentViewResultCategory] = useState(null);
    const [totalCount, setTotalCounts] = useState({ totalSuccess: 0, totalCritical: 0, totalMedium: 0 });
    const [isFetched, setIsFetched] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });

    const { selectedOrg, type } = location.state || {};

    const navigate = useNavigate()

    const fetchReport = async () => {
        if (isFetched) return;
        setLoading(true);
        try {
            const dataToSend = {
                userEmpHistoryCorrect: type && type.toLowerCase() === 'correct',
                userStillWorkingInOrganization: !!selectedOrg,
                currentOrganizationMemberId: selectedOrg?.details?.["Member Id"] || "",
            };

            const response = await post('withdrawability-check', dataToSend);
            if (response.status === 401) {
                setLoading(false);                
                localStorage.removeItem('user_uan')
                navigate('/');
                return;
            }

            setCategories(response || []); // Ensure categories is always an array

            if (Array.isArray(response) && response.length) {
                const totals = response.reduce((acc, category) => {
                    acc.totalSuccess += category.totalSuccess || 0;
                    acc.totalCritical += category.totalCritical || 0;
                    acc.totalMedium += category.totalMedium || 0;
                    return acc;
                }, { totalSuccess: 0, totalCritical: 0, totalMedium: 0 });
                setTotalCounts(totals);
            }

            setIsFetched(true); // Mark as fetched
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage({ type: "error", content: error.message });
        } finally {
            setLoading(false); // Ensure loading is turned off after operation
        }
    };

    useEffect(() => {
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan'); ; 
        let value = "doc-scan";   
        localStorage.setItem(dynamicKey, value); 
        if (!isFetched) {
            fetchReport();
        }
    }, [isFetched]); // Depend only on isFetched

    useEffect(() => {
        if (categories.length === 0) return;

        const timeoutId = setTimeout(() => {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev < 100) {
                        return prev + 1;
                    } else {
                        setIsProcessing(false);
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 100);

            return () => clearInterval(interval);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [categories]);

    useEffect(() => {
        if (categories.length === 0 || progress === 0) return;

        const categoryIndex = Math.floor(progress / (100 / categories.length));
        setCurrentCategory(categories[categoryIndex] || categories[categories.length - 1]);
    }, [progress, categories]);

    const viewScanResult = (category) => {
        setIsViewingResult(true);
        setCurrentViewResultCategory(category)
    };

    const handleScanResultBack = () => {
        setIsViewingResult(false);
        setCurrentViewResultCategory(null)
    };

    return (
        <>
            {loading && (
                <Loader
                    type="dots"
                    size="large"
                    color="#28a745"
                    message="Scanning Documents, please wait..."
                    overlay={true}
                />
            )}
            {message.type && <ToastMessage message={message.content} type={message.type} />}
            <div className="container-fluid">
                <div className="row mx-sm-2 d-flex justify-content-center align-items-center vh-100">
                    <div className="col-lg-4 col-md-8 mt-5 mt-lg-0">
                        {isProcessing && <div className="row mx-0 progress-card d-flex justify-content-center align-items-center">
                            <div className="col-7">
                                <div className="progress-details">
                                    <span className="fw-boldHeading">{currentCategory.category}</span><br></br>
                                    <span className='subText'>Checking {currentCategory?.category} details</span>
                                </div>
                            </div>
                            <div className="col-5">
                                <div className="progress-bar float-end">
                                    <div className="progress-circle">
                                        <CircularProgress progress={progress} />
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {!isProcessing && totalCount.totalCritical > 0 &&
                            <div className="row mx-1 py-3 progress-card-scan-done-critical d-flex justify-content-center align-items-center">
                                <div className="col-7">
                                    <div className="progress-details-scan-done">
                                        <span className='progressText'>Your PF is at</span><br></br>
                                        <span className='progressHeading'>HIGH RISK</span><br></br>
                                        <span className='progressText'>of getting stuck</span>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="scan-done-para float-end">
                                        <BsExclamationOctagon className="bigger-icon" />
                                    </div>
                                </div>

                                <span className="warning-message mt-1" style={{ fontSize: '1rem' }}>
                                    Solving these issues will take <span
                                        className='months'>2 months</span> or more.<br></br>
                                    <span className="act-now">Act Now!</span>
                                </span>
                            </div>
                        }
                        {!isProcessing && totalCount.totalCritical === 0 && totalCount.totalMedium > 0 &&
                            <div className="row mx-1 py-3 progress-card-scan-done-medium d-flex justify-content-center align-items-center">
                                <div className="col-7">
                                    <div className="progress-details-scan-done">
                                        <span className='progressText'>Your PF is at</span><br></br>
                                        <span className='progressHeading'>Medium RISK</span><br></br>
                                        <span className='progressText'>of getting stuck</span>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="scan-done-para float-end">
                                        <BsExclamationOctagon className="bigger-icon" />
                                    </div>
                                </div>

                                <span className="warning-message mt-1" style={{ fontSize: '1rem' }}>
                                    Solving these issues will take <span
                                        className='months'>2 months</span> or more.<br></br>
                                    <span className="act-now">Act Now!</span>
                                </span>
                            </div>
                        }
                        {!isProcessing && totalCount.totalCritical === 0 && totalCount.totalMedium === 0 &&
                            <div className="row mx-1 py-3 progress-card-scan-done-success d-flex justify-content-center align-items-center">
                                <div className="col-7">
                                    <div className="progress-details-scan-done">
                                        <span className='progressText'>Your PF is at</span><br></br>
                                        <span className='progressHeading'>NO RISK</span><br></br>
                                        <span className='progressText'>of getting stuck</span>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="scan-done-para float-end">
                                        <BsShieldCheck className="bigger-icon" />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    {!isViewingResult &&
                        <div className="col-lg-7 mt-3">
                            <div className='row'>
                                <div className='col-md-8 offset-md-2'>
                                    <div className="pfRiskheading text-center">{isProcessing ? "Scanning Your PF" : "Scan Complete"}</div>
                                    {isProcessing && <p className="pfRiskSubHeading text-center">
                                        Last year 25% of EPF claims got rejected and people were blocked from accessing their own money when they needed it the most</p>}
                                </div>
                            </div>

                            <div className="tasks mb-2 mb-md-0">
                                {categories && categories.map((category, index) => (
                                    <div key={index} className="task">
                                        {/* When processing is ongoing for current category */}
                                        {isProcessing && currentCategory?.category === category.category && (
                                            <>
                                                <span className='d-flex flex-start align-items-center'>
                                                    <BsClock className='smaller-icon' /> &nbsp;{category.category}
                                                </span>
                                                <span className="pending">Processing...</span>
                                            </>
                                        )}
                                        {/* When processing is done for current category */}
                                        {isProcessing && index < Math.floor(progress / (100 / categories.length)) && (
                                            <>
                                                <span className='d-flex flex-start align-items-center'>
                                                    <BsCheck2Circle className='smaller-icon' /> &nbsp;{category.category}
                                                </span>
                                                <span className="success">Done</span>
                                            </>
                                        )}
                                        {/* When processing is ongoing but others category are still yet to processed */}
                                        {isProcessing && currentCategory?.category !== category.category && index >= Math.floor(progress / (100 / categories.length)) && (
                                            <>
                                                <span className='d-flex flex-start align-items-center'>
                                                    <BsClock className='smaller-icon' /> &nbsp;{category.category}
                                                </span>
                                                <span className="pending">Pending</span>
                                            </>
                                        )}

                                        {/* After processing is complete and no critical/medium issues */}
                                        {!isProcessing && (category.totalCritical === 0 && category.totalMedium === 0) &&
                                            <div>
                                                <span className='d-flex flex-start align-items-center'><BsCheck2Circle className='success smaller-icon' /> &nbsp;{category.category}</span>
                                                <span className="success issue-count">No Issue Found</span>
                                            </div>
                                        }

                                        {/* After processing is complete and only critical issues */}
                                        {!isProcessing && (category.totalCritical > 0 && category.totalMedium === 0) &&
                                            <div className='d-flex justify-content-between align-items-center w-100'>
                                                <span className=''>
                                                    <span className='d-flex align-items-center'><BsExclamationCircle className='error smaller-icon' /> &nbsp;{category.category}</span>
                                                    <span className="error issue-count">{category.totalCritical} Critical Issues Found</span>
                                                </span>
                                                {<BsChevronCompactRight className='chevron-icon error cursor-pointer' onClick={() => { viewScanResult(category) }} />}
                                            </div>
                                        }

                                        {/* After processing is complete and only medium issues */}
                                        {!isProcessing && (category.totalCritical === 0 && category.totalMedium > 0) &&
                                            <div className='d-flex justify-content-between align-items-center w-100'>
                                                <span>
                                                    <span className='d-flex align-items-center'><BsExclamationCircle className='pending smaller-icon' /> &nbsp;{category.category}</span>
                                                    <span className="pending issue-count">{category.totalMedium} Medium Issues Found</span>
                                                </span>
                                                {<BsChevronCompactRight className='chevron-icon pending cursor-pointer' onClick={() => { viewScanResult(category) }} />}
                                            </div>
                                        }

                                        {/* After processing is complete and both critical and medium issues */}
                                        {!isProcessing && (category.totalCritical > 0 && category.totalMedium > 0) &&
                                            <div className='d-flex justify-content-between align-items-center w-100'>
                                                <span className=''>
                                                    <span className='d-flex align-items-center'><BsExclamationCircle className='error smaller-icon' /> &nbsp;{category.category}</span>
                                                    <span className="error issue-count">{category.totalCritical} Critical & {category.totalMedium} Medium Issues Found</span>
                                                </span>
                                                {<BsChevronCompactRight className='chevron-icon error cursor-pointer' onClick={() => { viewScanResult(category) }} />}
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>
                            {!isProcessing && (totalCount.totalCritical > 0 || totalCount.totalMedium > 0) && <div className="row my-2 mt-lg-4">
                                <p className="text-center fw-bold">Don’t wait till its too late, protect your PF now</p>
                                <div className="col-md-10 offset-md-1">
                                    <button type="submit" className="btn col-12 pfRiskButtons" onClick={() => navigate("/create-account")}>
                                        Resolve My PF Issues
                                    </button>
                                </div>
                            </div>}
                        </div>
                    }
                    {isViewingResult &&
                        <div className="col-lg-7 d-flex flex-column justify-content-center align-items-center">
                            <ScanResult backButtonClicked={handleScanResultBack} selectedCategory={currentViewResultCategory} />
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default DocumentScanning;
