import React, { useState, useEffect } from 'react';
import '../../css/scanning/doc-scan.css';
import '../../App.css';
import CircularProgress from '../common/circular-progress'
import { BsCheck2Circle, BsClock, BsExclamationOctagon, BsExclamationCircle, BsChevronCompactRight } from "react-icons/bs";
import { toTitleCase } from '../common/titlecase';
import ScanResult from '../scanning/scan-result'
import { useNavigate } from 'react-router-dom';

const DocumentScanning = () => {
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(true);
    const [isViewingResult, setIsViewingResult] = useState(false);

    const navigate = useNavigate()

    const tasks = [
        { taskName: 'Service History Scan', status: 'success', issuesCount: 0 },
        { taskName: 'EPS Membership Check', status: 'error', issuesCount: 3 },
        { taskName: 'Check DOE & DOJ', status: 'error', issuesCount: 3 },
        { taskName: 'Fund Consolidation', status: 'pending', issuesCount: 0 },
        { taskName: 'Contribution Record Check', status: 'pending', issuesCount: 0 },
        { taskName: 'Matching KYC', status: 'error', issuesCount: 1 },
        { taskName: 'Match Transfers', status: 'success', issuesCount: 0 }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 1;
                } else {
                    setIsProcessing(false); // Stop processing once complete
                    clearInterval(interval); // Stop the interval
                    return prev;
                }
            });
        }, 200); // Adjust the speed here
        return () => clearInterval(interval);
    }, []);

    // Calculate current task based on progress
    const taskIndex = Math.floor(progress / (100 / tasks.length));
    const currentTask = tasks[taskIndex] || tasks[tasks.length - 1];

    const viewScanResult = () => {
        setIsViewingResult(true)
    }

    const handleScanResultBack = () => {
        setIsViewingResult(false)
    }
    
    return (
        <div className="container-fluid">
            <div className="row mx-sm-2 d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 offset-lg-1 mt-5 mt-lg-0">
                    {isProcessing && <div className="row mx-0 progress-card d-flex justify-content-center align-items-center">
                        <div className="col-7">
                            <div className="progress-details">
                                <span className="fw-boldHeading">{currentTask.taskName}</span><br></br>
                                <span className='subText'>Checking {currentTask.taskName.toLowerCase()} details</span>
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
                    {!isProcessing &&
                        <div className="row mx-1 py-3 progress-card-scan-done d-flex justify-content-center align-items-center">
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

                            <span className="warning-message mt-1" style={{ fontSize: '0.95rem' }}>
                                Solving these issues will take <span
                                    className='months'>2 months</span> or more.<br></br>
                                <span className="act-now">Act Now!</span>
                            </span>
                        </div>
                    }
                </div>

                {!isViewingResult &&
                    <div className="col-lg-7 mt-3">
                        <div className="pfRiskheading text-center">{isProcessing ? "Scanning Your PF" : "Scan Complete"}</div>
                        {isProcessing && <p className="text-center">Lorem ipsum dolor sit amet consectetur.
                            Lorem rhoncus vitae ullamcorper non.Lorem rhoncus vitae ullamcorper non.
                            Lorem rhoncus vitae ullamcorper non.</p>}
                        <div className="tasks mb-2 mb-md-0">
                            {tasks.map((task, index) => (
                                <div key={index} className="task">
                                    {task.status === 'success' &&
                                        <div>
                                            <span className='d-flex flex-start align-items-center'><BsCheck2Circle className='success smaller-icon' /> &nbsp;{task.taskName}</span>
                                            <span className="success issue-count">No Issue Found</span>
                                        </div>
                                    }
                                    {task.status === 'error' && task.issuesCount > 1 &&
                                        <div className='d-flex justify-content-between align-items-center w-100'>
                                            <span className=''>
                                                <span className='d-flex align-items-center'><BsExclamationCircle className='error smaller-icon' /> &nbsp;{task.taskName}</span>
                                                <span className="error issue-count">2 Critical Issues Found</span>
                                            </span>
                                            {!isProcessing && <BsChevronCompactRight className='chevron-icon error cursor-pointer' onClick={viewScanResult} />}
                                        </div>
                                    }
                                    {task.status === 'error' && task.issuesCount <= 1 &&
                                        <div className='d-flex justify-content-between align-items-center w-100'>
                                            <span>
                                                <span className='d-flex align-items-center'><BsExclamationCircle className='pending smaller-icon' /> &nbsp;{task.taskName}</span>
                                                <span className="pending issue-count">1 Medium Issues Found</span>
                                            </span>
                                            {!isProcessing && <BsChevronCompactRight className='chevron-icon pending cursor-pointer' onClick={viewScanResult} />}
                                        </div>
                                    }
                                    {task.status === 'pending' &&
                                        <>
                                            <span className='d-flex flex-start align-items-center'><BsClock className='smaller-icon' /> &nbsp;{task.taskName}</span>
                                            <span className="pending">{toTitleCase(task.status)}</span>
                                        </>
                                    }
                                </div>
                            ))}
                        </div>
                        {!isProcessing && <div className="row my-2 mt-lg-4">
                            <p className="text-center fw-bold">Lorem ipsum dolor sit amet consectetur.</p>  
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
                        <ScanResult backButtonClicked={handleScanResultBack }/>
                    </div>
                }
            </div>
        </div>
    );
};

export default DocumentScanning;
