import React, { useState, useEffect } from 'react';
import '../../css/scanning/doc-scan.css';
import CircularProgress from '../common/circular-progress'
import { BsCheck2Circle, BsClock } from "react-icons/bs";
import { toTitleCase } from '../common/titlecase';

const DocumentScanning = () => {
    const [progress, setProgress] = useState(0);
    const tasks = [
        { taskName: 'Service History Scan', status: 'success', issuesCount: 0 },
        { taskName: 'EPS Membership Check', status: 'error', issuesCount: 1 },
        { taskName: 'Check DOE & DOJ', status: 'pending', issuesCount: 3 },
        { taskName: 'Fund Consolidation', status: 'pending', issuesCount: 0 },
        { taskName: 'Contribution Record Check', status: 'pending', issuesCount: 0 },
        { taskName: 'Matching KYC', status: 'error', issuesCount: 1 },
        { taskName: 'Match Transfers', status: 'success', issuesCount: 0 }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 1 : prev));
        }, 100); // Adjust the speed here
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="row w-100 mx-2 align-items-center">
                <div className="col-lg-1"></div>
                <div className="col-lg-4 mt-5 mt-lg-0 d-flex justify-content-center">
                    <div className="progress-card">
                        <div className="progress-details">
                            <h2 className="fw-bold">Checking DOE & DOJ</h2>
                            <p>Looking up for EPF account details</p>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-circle">
                                <CircularProgress progress={progress}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7 mb-2 d-flex flex-column justify-content-center align-items-center">
                    <h3>Scanning Your PF</h3>
                    <p className="text-center">Lorem ipsum dolor sit amet consectetur. Lorem rhoncus vitae ullamcorper non.Lorem rhoncus vitae ullamcorper non.Lorem rhoncus vitae ullamcorper non.</p>
                    <div className="tasks">
                        {tasks.map((task, index) => (
                            <div key={index} className="task">                                
                                {task.status === 'success' && 
                                <div>
                                    <span><BsCheck2Circle className='success'/> {task.taskName}</span>
                                    <span className="success issue-count">No Issue Found</span>
                                </div>
                                }
                                {task.status === 'error' && 
                                <div>
                                    <span><BsCheck2Circle className='success'/> {task.taskName}</span>
                                    <span className="error issue-count">2 Critical Issues Found</span>
                                </div>
                                }
                                {task.status === 'pending' && 
                                <>
                                    <span><BsClock className=''/> {task.taskName}</span>
                                    <span className="pending">{toTitleCase(task.status)}</span>
                                </>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentScanning;
