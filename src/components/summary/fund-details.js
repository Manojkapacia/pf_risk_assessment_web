import React, { useState } from "react";
import SummaryCard from "./summary-card";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { BsCircleFill } from "react-icons/bs";
import ClaimRejection from "./claim-rejection";
import './../../css/summary/fund-details.css';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title, Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title, Filler);

function FundDetails() {
    const [fundRoi, setFundRoi] = useState(true);
    const [pension, setPension] = useState(true);
    const FundRoiDetails = () => {
        if (fundRoi) {
            setFundRoi(false);
        }
        else {
            setFundRoi(true);
        }
    }
    const pensionDetails = () => {
        if (pension) {
            setPension(false);
        }
        else {
            setPension(true);
        }
    }
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

    const data1 = {
        labels: ["FY15", "FY16", "FY17", "FY18", "FY19", "FY20"], // X-axis labels
        datasets: [
            {
                label: "Category A",
                data: [1000, 3000, 7000, 12000, 20000, 30000],
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.5)",
                fill: true,
            },
            {
                label: "Category B",
                data: [2000, 4000, 9000, 15000, 25000, 35000],
                borderColor: "#28a745",
                backgroundColor: "rgba(40, 167, 69, 0.5)",
                fill: true,
            },
            {
                label: "Category C",
                data: [500, 2000, 4000, 8000, 12000, 18000],
                borderColor: "#ffc107",
                backgroundColor: "rgba(255, 193, 7, 0.5)",
                fill: true,
            },
        ],
    };

    // Chart options
    const options1 = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                display: false
            },
            //   title: {
            //     display: true,
            //     text: "Stacked Area Chart Example",
            //   },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className='col-md-7 col-lg-5 my-4'>
                    <SummaryCard></SummaryCard>

                    <div className="card shadow-sm px-2 px-lg-4 py-3 my-3 d-flex flex-column">
                        <p className="text-center fundDistribution">Fund Distribution</p>
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="doughnut-chart">
                                <Doughnut data={data} options={options} />
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="fundTabelHeading">Particular</th>
                                    <th className="fundTabelHeading">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="fundTabelText"><BsCircleFill style={{ 'color': '#27DEBF' }} />&nbsp;&nbsp;Employee Share </td>
                                    <td className="fundTabelText">10000</td>
                                </tr>
                                <tr>
                                    <td className="fundTabelText"><BsCircleFill style={{ 'color': '#00124F' }} />&nbsp;&nbsp;Employer Share</td>
                                    <td className="fundTabelText">8000</td>
                                </tr>
                                <tr>
                                    <td className="fundTabelText"><BsCircleFill style={{ 'color': '#4880FF' }} />&nbsp;&nbsp;Pension Share</td>
                                    <td className="fundTabelText">6000</td>
                                </tr>
                                <tr>
                                    <td className="fundTabelText"><BsCircleFill style={{ 'color': '#ABD5FD' }} />&nbsp;&nbsp;Interest Earned</td>
                                    <td className="fundTabelText">4000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="card shadow-sm px-lg-2 py-3 my-3">
                        <h5 className="text-center fundDistribution">Fund Growth</h5>
                        <Line data={data1} options={options1} />
                        <h5 className="text-center fundDistribution mt-3">Fund Contributions</h5>
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th style={{ fontSize: '0.63rem', fontWeight: '400' }}>Particular</th>
                                    <th style={{ fontSize: '0.63rem', fontWeight: '400' }}>FY15</th>
                                    <th style={{ fontSize: '0.63rem', fontWeight: '400' }}>FY16</th>
                                    <th style={{ fontSize: '0.63rem', fontWeight: '400' }}>FY17</th>
                                    <th style={{ fontSize: '0.63rem', fontWeight: '400' }}>FY18</th>
                                    <th style={{ fontSize: '0.63rem', fontWeight: '400' }}>FY19</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="" style={{ fontSize: '0.67rem', fontWeight: '300' }}>
                                        Amount You Contributed
                                    </td>
                                    <td style={{ fontSize: '0.65rem', fontWeight: '300' }}> ₹ 21,11,5000</td>
                                    <td style={{ fontSize: '0.65rem', fontWeight: '300' }}>₹ 21,11,5000</td>
                                    <td style={{ fontSize: '0.65rem', fontWeight: '300' }}>₹ 21,11,5000</td>
                                    <td style={{ fontSize: '0.65rem', fontWeight: '300' }}>₹ 21,11,5000</td>
                                    <td style={{ fontSize: '0.65rem', fontWeight: '300' }}>₹ 21,11,5000</td>
                                </tr>
                                <tr>
                                    <td style={{ fontSize: '0.67rem', fontWeight: '300' }}>
                                        Amount Contributed by Employer
                                    </td>
                                    <td style={{ fontSize: '0.45rem', fontWeight: '300' }}>
                                        <div className="d-flex align-items-center mt-1">
                                            <span
                                                className="dot me-1"
                                                style={{
                                                    backgroundColor: "#4880FF",
                                                    width: "0.7rem",
                                                    height: "0.7rem",
                                                    display: "inline-block",
                                                    borderRadius: "50%",
                                                }}
                                            ></span>
                                            ₹ 21,11,5000
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.45rem', fontWeight: '300' }}>₹ 21,11,5000</td>
                                    <td style={{ fontSize: '0.45rem', fontWeight: '300' }}>₹ 21,11,5000</td>
                                    <td style={{ fontSize: '0.45rem', fontWeight: '300' }}>₹ 21,11,5000</td>
                                    <td style={{ fontSize: '0.45rem', fontWeight: '300' }}>₹ 21,11,5000</td>
                                </tr>
                                {/* <tr>
                                    <td>
                                        <span
                                            className="dot me-2"
                                            style={{
                                                backgroundColor: "#ABD5FD",
                                                width: "12px",
                                                height: "12px",
                                                display: "inline-block",
                                                borderRadius: "50%",
                                            }}
                                        ></span>
                                        Pension Accumulated
                                    </td>
                                    <td>₹ 21,11,5000</td>
                                    <td>₹ 21,11,5000</td>
                                    <td>₹ 21,11,5000</td>
                                    <td>₹ 21,11,5000</td>
                                    <td>₹ 21,11,5000</td>
                                </tr> */}
                                {/* <tr>
                                    <td>
                                        <span
                                            className="dot me-2"
                                            style={{
                                                backgroundColor: "#27DEBF",
                                                width: "12px",
                                                height: "12px",
                                                display: "inline-block",
                                                borderRadius: "50%",
                                            }}
                                        ></span>
                                        Interest Earned
                                    </td>
                                    <td>₹ 21,11,5000</td>
                                    <td>₹ 21,11,5000</td>
                                    <td>₹ 21,11,5000</td>
                                    <td>₹ 21,11,5000</td>
                                    <td>₹ 21,11,5000</td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                    {fundRoi ?
                        (
                            <div className="card shadow-sm mx-auto py-3 my-3">
                                <div className="text-center">
                                    <p className="fundDistribution">Fund ROI</p>
                                </div>

                                <div className="d-flex align-items-center">
                                    <div className="w-100 px-2 px-lg-4">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="fundTabelHeading">Particular</th>
                                                    <th className="fundTabelHeading">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="fundTabelText">Total Amount Contributed by You</td>
                                                    <td className="fundTabelText">₹ 21,11,5000</td>
                                                </tr>
                                                <tr>
                                                    <td className="fundTabelText">PF Interest Rate</td>
                                                    <td className="fundTabelText">8.5%</td>
                                                </tr>
                                                <tr>
                                                    <td className="fundTabelText">TDS on Withdrawal</td>
                                                    <td className="fundTabelText">₹ 12,500</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Right Side - Chevron Icon */}
                                    <div className="me-1 me-lg-3">
                                        <FaChevronRight style={{ cursor: 'pointer' }} size={20} className="text-muted" onClick={FundRoiDetails} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="card shadow-sm mx-auto py-3 my-3">
                                <div className="text-center">
                                    <p className="fundDistribution">Fund ROI</p>
                                </div>

                                <div className="d-flex align-items-center">
                                    <div className="mx-2 mx-lg-3">
                                        <FaChevronLeft size={20} style={{ cursor: 'pointer' }} className="text-muted" onClick={FundRoiDetails} />
                                    </div>
                                    <div className="w-100 px-2 px-lg-4 fundRoiCardText">
                                        <ul className="list-group">
                                            <li>If the user is employed for more than 5 years
                                                throughout all the employments under this UAN then TDS will not be deducted
                                            </li>
                                            <li >If employment is less than 5 years then TDS is applicable
                                                at the rate of 10% on total PF balance</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {pension ? (
                        <div className="card shadow-sm py-3 my-3">
                            <div className="text-center">
                                <p className="fundDistribution">Pension</p>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="w-100 px-2 px-lg-4">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="fundTabelHeading">Particular</th>
                                                <th className="fundTabelHeading">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="fundTabelText">Total Pension Balance</td>
                                                <td className="fundTabelText">₹ 21,11,5000</td>
                                            </tr>
                                            <tr>
                                                <td className="fundTabelText">Lump sum Pension Withdrawal limit</td>
                                                <td className="fundTabelText">₹ 12,5000</td>
                                            </tr>
                                            <tr>
                                                <td className="fundTabelText">Monthly Pension Amount at Retirement</td>
                                                <td className="fundTabelText">₹ 12,500</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="me-lg-3 me-1">
                                    <FaChevronRight style={{ cursor: 'pointer' }} size={20} className="text-muted" onClick={pensionDetails} />
                                </div>
                            </div>
                        </div>
                    ) : (

                        <div className="card shadow-sm mx-auto py-3 my-3">
                            <div className="text-center">
                                <p className="fundDistribution">Pension</p>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="mx-2 mx-lg-3">
                                    <FaChevronLeft style={{ cursor: 'pointer' }} size={20} className="text-muted" onClick={pensionDetails} />
                                </div>
                                <div className="w-100 px-2 px-lg-4">
                                    <ul className="list-group fundRoiCardText">
                                        <li>Employee can withdraw entire pension share as lump sum if
                                            total employment history is less than 5 years
                                        </li>
                                        <li >If employment history is more than 5 years can pension will be
                                            available post retirement at the age of 58 years as per below calculation
                                        </li>
                                        <p className="my-2 text-center mb-0" style={{ fontFamily: 'italic' }}>Monthly Pension = Total Service x (15000/70) </p>
                                        <li >This pension calculation is indicative in nature, EPFO as full controlover your
                                            final pension value
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <ClaimRejection></ClaimRejection>
                </div>
            </div>
        </div>
    )
}
export default FundDetails;