import React, { useState } from 'react';
import './../../css/summary/pf-balance-analysis.css';
import { BsCircleFill } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


// Register required elements
ChartJS.register(ArcElement, Tooltip, Legend);

function PfBalanceAnalysis() {
    const [activeCard, setActiveCard] = useState("main");
    const data = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
        datasets: [
            {
                label: "Votes",
                data: [12, 19, 3, 5],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    // "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    // "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };
    const options = {
        // cutout: "60%",
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: "bottom",
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <>
            {activeCard === "main" && (
                <div className="card pf-card shadow-sm setCardHeight py-3 mt-3">
                    <p className='pfAnalysisText'>PF Balance Analysis</p>
                    <div className="d-flex align-items-center bg-light position-relative mt-4 border-top border-bottom">
                        <div className="totalCorpusChart"></div>
                        <div className="text-end totalCorpusText mt-0  d-flex justify-content-between align-items-center">
                            <div className='ms-2'>
                                <span className="pfAmountAnalysis mb-0">₹ 22,50,000</span>
                                <div className='pfTextanalysis'>Total Corpus</div>
                            </div>
                            <div className="position-absolute end-0 top-50 translate-middle-y" onClick={() => setActiveCard("toalCorpus")}>
                                <FaChevronRight style={{ cursor: 'pointer' }} size={20} className="me-2" />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center bg-light position-relative border-top border-bottom">
                        <div className="withdrawalLimit"></div>
                        <div className="mt-0  d-flex justify-content-between align-items-center"
                            style={{ width: '50%' }}>
                            <div className='ms-2'>
                                <span className="pfAmountAnalysis mb-0">₹ 15,50,000</span>
                                <div className='pfTextanalysis'>Maximum withdrawal Limit</div>
                            </div>
                            <div className="position-absolute end-0 top-50 translate-middle-y" onClick={() => setActiveCard("withdrawalLimit")}>
                                {/* <i className="bi bi-chevron-right me-2" style={{ fontSize: '1.3rem', fontWeight: '800', cursor: 'pointer' }}></i> */}
                                <FaChevronRight style={{ cursor: 'pointer' }} size={20} className="me-2" />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center bg-light position-relative border-top border-bottom">
                        <div className="blockAmountChart"></div>
                        <div className="blockAmountText mt-0  d-flex justify-content-between align-items-center">
                            <div className='ms-2'>
                                <span className="pfAmountAnalysis mb-0">₹ 12,13,456</span>
                                <div className='pfTextanalysis'>Blocked Amount</div>
                            </div>
                            <div className="position-absolute end-0 top-50 translate-middle-y" onClick={() => setActiveCard("blockAmount")}>
                                <FaChevronRight style={{ cursor: 'pointer' }} size={20} className="me-2" />
                            </div>
                        </div>
                    </div>
                    <span className="text-danger pfAnalysisText mt-3">
                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                        54% of your total PF Corpus is stuck due to Issues
                    </span>
                </div>
            )}

            {activeCard === "toalCorpus" && (
                <div className="card shadow-sm setCardHeight p-3 mt-3">
                    <div className="d-flex align-items-center">
                        <FaChevronLeft style={{ cursor: 'pointer' }} size={20} onClick={() => setActiveCard("main")} />
                        <p className="mb-0 pfAnalysisText w-100">Total Corpus</p>
                    </div>
                    <div className="row align-items-center mt-4">
                        <div className="col-lg-5 d-flex justify-content-center">
                            <div className="doughnut-chart">
                                <Doughnut data={data} options={options} />
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='pfTabelheading'>Particular</th>
                                        <th className='pfTabelheading'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='pfTabeltext'>
                                            <BsCircleFill style={{ color: "#27DEBF" }} /> &nbsp;&nbsp;Employee Share
                                        </td>
                                        <td className='pfTabeltext'>5000</td>
                                    </tr>
                                    <tr>
                                        <td className='pfTabeltext'>
                                            <BsCircleFill style={{ color: "#00124F" }} /> &nbsp;&nbsp;Employer Share
                                        </td>
                                        <td className='pfTabeltext'>4000</td>
                                    </tr>
                                    <tr>
                                        <td className='pfTabeltext'>
                                            <BsCircleFill style={{ color: "#4880FF" }} /> &nbsp;&nbsp;Pension Share
                                        </td>
                                        <td className='pfTabeltext'>1000</td>
                                    </tr>
                                    <tr>
                                        <td className='pfTabeltext'>
                                            <BsCircleFill style={{ color: "#ABD5FD" }} /> &nbsp;&nbsp;Interest Earned
                                        </td>
                                        <td className='pfTabeltext'>2500</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeCard === "withdrawalLimit" && (
                <div className="card shadow-sm setCardHeight p-2 p-lg-3 mt-3">
                    <div className="d-flex align-items-center">
                        <FaChevronLeft style={{ cursor: 'pointer' }} size={20} onClick={() => setActiveCard("main")} />
                        <h5 className="mb-0 pfAnalysisText w-100">Maximum Withdrawal Limit</h5>
                    </div>
                    <div className='px-lg-4 mt-2 mt-lg-3 withdrawalText'>
                        <p className="">
                            For employees who are still working, Maximum Withdrawal Limit is calculated as lowest of the following:
                        </p>
                        <ul>
                            <li>Total Fund Balance</li>
                            <li>Total Employee share + 36 times Last EPF wages drawn</li>
                            <li>Total Employee share + 80% of Total employer share</li>
                        </ul>
                        <p className="">
                            If you are retired or currently not working, then you can withdraw your entire fund.
                        </p>
                    </div>
                </div>
            )}

            {activeCard === "blockAmount" && (
                <div className="card shadow-sm p-3 mt-3" style={{ height: '19rem' }}>
                    <div className="d-flex align-items-center">
                        <FaChevronLeft style={{ cursor: 'pointer' }} size={20} onClick={() => setActiveCard("main")} />
                        <p className="mb-0 pfAnalysisText w-100">Blocked Amount</p>
                    </div>
                    <p className='px-lg-4 mt-2 mt-lg-3 withdrawalText'>Blocked amount is total of employer and pension share of companies where issues are found,
                        but if there is an issue in your KYC then your entire Fund balance gets blocked
                    </p>
                </div>
            )}
        </>

    )
}

export default PfBalanceAnalysis;