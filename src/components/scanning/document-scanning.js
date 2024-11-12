import React, { useState, useEffect } from 'react';
import '../../css/scanning/doc-scan.css';
import CircularProgress from '../common/circular-progress'
import { BsCheck2Circle, BsClock, BsExclamationOctagon, BsExclamationCircle, BsChevronCompactRight } from "react-icons/bs";
import { toTitleCase } from '../common/titlecase';
import ScanResult from '../scanning/scan-result'

const DocumentScanning = () => {
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(true);
    const [isViewingResult, setIsViewingResult] = useState(false);

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

    const handleScanResultBack  = () => {
        setIsViewingResult(false)
    }
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="row w-100 mx-2 align-items-center">
                <div className="col-lg-1"></div>
                <div className="col-lg-4 d-flex justify-content-center">
                    {isProcessing && <div className="progress-card">
                        <div className="progress-details">
                            <h2 className="fw-bold">{currentTask.taskName}</h2>
                            <p>Checking {currentTask.taskName.toLowerCase()} details</p>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-circle">
                                <CircularProgress progress={progress}/>
                            </div>
                        </div>
                    </div>}
                    {!isProcessing && 
                        <div className="progress-card-scan-done">
                            <div className="progress-details-scan-done">
                                <p>Your PF is at</p>
                                <h1>HIGH RISK</h1>
                                <p>of getting stuck</p>
                            </div>
                            <div className="scan-done-para">
                                <BsExclamationOctagon className="bigger-icon" />
                            </div>
                            <p className="warning-message">
                                Solving these issues will take <span style={{'color': '#fff', fontWeight: 'bold'}}>2 months</span> or more. <span className="act-now">Act Now!</span>
                            </p>
                        </div>
                    }
                </div>
                {!isViewingResult &&
                    <div className="col-lg-7 d-flex flex-column justify-content-center align-items-center">
                        <h3>{isProcessing ? "Scanning Your PF" : "Scan Complete"}</h3>
                        {isProcessing && <p className="text-center">Lorem ipsum dolor sit amet consectetur. Lorem rhoncus vitae ullamcorper non.Lorem rhoncus vitae ullamcorper non.Lorem rhoncus vitae ullamcorper non.</p>}
                        <div className="tasks">
                            {tasks.map((task, index) => (
                                <div key={index} className="task">                                
                                    {task.status === 'success' && 
                                    <div>
                                        <span className='d-flex flex-start align-items-center'><BsCheck2Circle className='success smaller-icon'/> &nbsp;{task.taskName}</span>
                                        <span className="success issue-count">No Issue Found</span>
                                    </div>
                                    }
                                    {task.status === 'error' && task.issuesCount > 1 && 
                                        <div className='d-flex justify-content-between align-items-center w-100'>
                                            <span className=''>
                                                <span className='d-flex align-items-center'><BsExclamationCircle className='error smaller-icon'/> &nbsp;{task.taskName}</span>
                                                <span className="error issue-count">2 Critical Issues Found</span>
                                            </span>
                                            {!isProcessing && <BsChevronCompactRight className='chevron-icon error' onClick={viewScanResult}/>}
                                        </div>
                                    }
                                    {task.status === 'error' && task.issuesCount <= 1 && 
                                        <div className='d-flex justify-content-between align-items-center w-100'>
                                            <span>
                                                <span className='d-flex align-items-center'><BsExclamationCircle className='pending smaller-icon'/> &nbsp;{task.taskName}</span>
                                                <span className="pending issue-count">1 Medium Issues Found</span>
                                            </span>                                        
                                            {!isProcessing && <BsChevronCompactRight className='chevron-icon pending' onClick={viewScanResult}/>}
                                        </div>
                                    }
                                    {task.status === 'pending' && 
                                    <>
                                        <span className='d-flex flex-start align-items-center'><BsClock className='smaller-icon'/> &nbsp;{task.taskName}</span>
                                        <span className="pending">{toTitleCase(task.status)}</span>
                                    </>
                                    }
                                </div>
                            ))}
                        </div>
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
