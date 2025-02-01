import React, { useEffect, useRef, useState } from "react";
import SummaryCard from "./summary-card";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { BsCircleFill } from "react-icons/bs";
import ClaimRejection from "./claim-rejection";
import './../../css/summary/fund-details.css';
import ReportPaymentModal from "./reportPaymentModal";
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title, Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import { formatCurrency, getClosingBalance } from "../../helper/data-transform";
import { get } from "../common/api";
import MESSAGES from "../constants/messages";
import ToastMessage from "../common/toast-message";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title, Filler);

function FundDetails() {
    const location = useLocation()
    const { summaryData, mobileNumber} = location.state || {};

    const [fundRoi, setFundRoi] = useState(true);
    const [pension, setPension] = useState(true);
    const [balanceDetails, setBalanceDetails] = useState(null)
    const [fundYears, setFundYears] = useState(null)
    const [isBlurred, setIsBlurred] = useState(true)
    const [message, setMessage] = useState({ type: "", content: "" });
    const isMessageActive = useRef(false); // Prevents multiple messages from being displayed at the same time.

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

    // Doughnut Chart for Fund Distribution
    const [fundDistributionChartData, setFundDistributionChartData] = useState({
        labels: ["Employee Share", "Employer Share", "Pension Share", "Interest Earned"],
        datasets: [
            {
                label: "Amount",
                data: [0, 0, 0, 0],
                backgroundColor: ["#27DEBF", "#00124F", "#4880FF", "#ABD5FD"],
                hoverOffset: 4,
            },
        ],
    });

    const options = {
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
    // End

    // Line Chart for Fund Growth
    const [fundGrowthChartData, setFundGrowthChartData] = useState({
        labels: ["FY22", "FY23", "FY24"], // X-axis labels
        datasets: [
            {
                label: "Employee Share",
                data: [0, 0, 0],
                borderColor: "#27DEBF",
                // backgroundColor: "rgba(39, 222, 191, 0.4)",
                fill: false
            },
            {
                label: "Employer Share",
                data: [0, 0, 0],
                borderColor: "#00124F",
                // backgroundColor: "rgba(0, 18, 79, 0.4)",
                fill: false
            },
            {
                label: "Pension Share",
                data: [0, 0, 0],
                borderColor: "#4880FF",
                // backgroundColor: "rgba(72, 128, 255, 0.4)",
                fill: false
            },
            {
                label: "Interest Share",
                data: [0, 0, 0],
                borderColor: "#ABD5FD",
                // backgroundColor: "rgba(171, 213, 253, 0.4)",
                fill: false
            }
        ],
    });

    const optionsFundGrowth = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                display: false
            }
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                // stacked: true,
                // suggestedMax: 100000,
                ticks: {
                    callback: function (value) {
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(0) + 'M'; // Million
                        } else if (value >= 1000) {
                            return (value / 1000).toFixed(0) + 'K'; // Thousand
                        } else {
                            return value; // Direct number
                        }
                    }
                }
            },
        },
    };
    // End

    const generateChartData = (data) => {
        const labels = Object.keys(data).map(year => `FY'${year.slice(-2)}`);

        const datasets = [
            {
                label: "Employee Share",
                data: Object.values(data).map(item => item.totalEmployeeShare),
                borderColor: "#27DEBF",
                // backgroundColor: "rgba(39, 222, 191, 0.4)",
                fill: false
            },
            {
                label: "Employer Share",
                data: Object.values(data).map(item => item.totalEmployerShare),
                borderColor: "#00124F",
                // backgroundColor: "rgba(0, 18, 79, 0.4)",
                fill: false
            },
            {
                label: "Pension Share",
                data: Object.values(data).map(item => item.totalPensionShare),
                borderColor: "#4880FF",
                // backgroundColor: "rgba(72, 128, 255, 0.4)",
                fill: false
            },
            {
                label: "Interest Share",
                data: Object.values(data).map(item => item.totalInterestShare),
                borderColor: "#ABD5FD",
                // backgroundColor: "rgba(171, 213, 253, 0.4)",
                fill: false
            }
        ];

        return { labels, datasets };
    };

    // call the api to fetch the user report
    const fetchData = async () => {
        try {
            const result = await get('/data/report/fetchByUan');
            // check if payment done or not
            if (result?.data) {
                const isPaymentDone = result?.data?.userProfile?.isPaymentDone
                if (isPaymentDone) setIsBlurred(false);
            }
        } catch (error) {
        }
    }
    
    useEffect(() => {
        if (summaryData?.rawData) {
            const parseCurrency = (value) => Number(value.replace(/[₹,]/g, ""));

            const balances = getClosingBalance(summaryData?.rawData?.data?.passbooks)
            setBalanceDetails(balances)

            // set fund distribution chart data
            const { employeeShare, employerShare, pensionShare, interestShare } = balances;

            setFundDistributionChartData((prevData) => ({
                ...prevData,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: [
                            parseCurrency(employeeShare),
                            parseCurrency(employerShare),
                            parseCurrency(pensionShare),
                            parseCurrency(interestShare)
                        ],
                    },
                ],
            }));

            // set fund growth chart data
            const chartData = generateChartData(summaryData?.reportData?.fundValues);
            setFundGrowthChartData(chartData)

            // set FY years from Fund Values 
            setFundYears(Object.keys(summaryData?.reportData?.fundValues));
        }
    }, [summaryData])

    useEffect(() => {        
        fetchData()
    }, [])
    
    const paymentModalClose = (isSuccess) => {
        if(isSuccess) {
            setIsBlurred(false)
        }else {
            setIsBlurred(true)
        }
    }

    return (
        <div className="container">
            {message.type && <ToastMessage message={message.content} type={message.type} />}
            <div className="row d-flex justify-content-center align-items-center">
                <div className='col-md-7 col-lg-5 my-4'>
                    <SummaryCard
                        summaryData={summaryData} 
                        setBlurEffect={isBlurred}
                        mobileNumber={mobileNumber}
                    ></SummaryCard>

                    {/* Fund Distribution Chart  */}
                    <div className="card shadow-sm px-2 px-lg-4 py-3 my-3 d-flex flex-column">
                        <p className="text-center fundDistribution">Fund Distribution</p>
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="doughnut-chart">
                                <Doughnut data={fundDistributionChartData} options={options} />
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
                                    <td className="fundTabelText">{balanceDetails?.employeeShare}</td>
                                </tr>
                                <tr>
                                    <td className="fundTabelText"><BsCircleFill style={{ 'color': '#00124F' }} />&nbsp;&nbsp;Employer Share</td>
                                    <td className="fundTabelText">{balanceDetails?.employerShare}</td>
                                </tr>
                                <tr>
                                    <td className="fundTabelText"><BsCircleFill style={{ 'color': '#4880FF' }} />&nbsp;&nbsp;Pension Share</td>
                                    <td className="fundTabelText">{balanceDetails?.pensionShare}</td>
                                </tr>
                                <tr>
                                    <td className="fundTabelText"><BsCircleFill style={{ 'color': '#ABD5FD' }} />&nbsp;&nbsp;Interest Earned</td>
                                    <td className="fundTabelText">{balanceDetails?.interestShare}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Fund Growth Chart */}
                    <div className="card shadow-sm px-lg-2 py-3 my-3">
                        <h5 className="text-center fundDistribution">Fund Growth</h5>
                        <Line data={fundGrowthChartData} options={optionsFundGrowth} />
                        <h5 className="text-center fundDistribution mt-3">Fund Contributions</h5>
                        <div
                            className="table-responsive"
                            style={{
                                overflowX: "auto",
                                whiteSpace: "nowrap",
                                maxWidth: "100%",
                            }}
                        >
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ fontSize: '0.80rem', fontWeight: '400' }}>Particular</th>
                                        {fundYears?.map(year => (
                                            <th key={year} style={{ fontSize: '0.80rem', fontWeight: '400' }}>FY'{year.slice(-2)}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ fontSize: '0.85rem', fontWeight: '300' }}>Amount You Contributed</td>
                                        {fundYears?.map(year => (
                                            <td key={year} style={{ fontSize: '0.80rem', fontWeight: '300' }}>
                                                ₹ {summaryData?.reportData?.fundValues[year].totalEmployeeShare.toLocaleString()}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '0.85rem', fontWeight: '300' }}>Amount Contributed by Employer</td>
                                        {fundYears?.map(year => (
                                            <td key={year} style={{ fontSize: '0.80rem', fontWeight: '300' }}>
                                                ₹ {summaryData?.reportData?.fundValues[year].totalEmployerShare.toLocaleString()}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '0.85rem', fontWeight: '300' }}>Pension Accumulated</td>
                                        {fundYears?.map(year => (
                                            <td key={year} style={{ fontSize: '0.80rem', fontWeight: '300' }}>
                                                ₹ {summaryData?.reportData?.fundValues[year].totalPensionShare.toLocaleString()}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '0.85rem', fontWeight: '300' }}>Interest Earned</td>
                                        {fundYears?.map(year => (
                                            <td key={year} style={{ fontSize: '0.80rem', fontWeight: '300' }}>
                                                ₹ {summaryData?.reportData?.fundValues[year].totalInterestShare.toLocaleString()}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                    {fundRoi ?
                        (
                            <div className="card shadow-sm mx-auto py-3 my-3">
                                <div className="text-center">
                                    <p className="fundDistribution">Fund ROI</p>
                                </div>
                                <div className={`${isBlurred ? 'blur-content' : ''}`}>
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
                                                        <td className="fundTabelText" style={{ minWidth: '5rem' }}>{formatCurrency(summaryData?.reportData?.amountContributed?.totalEmployeeShare) || "-"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fundTabelText">PF Interest Rate</td>
                                                        <td className="fundTabelText" style={{ minWidth: '5rem' }}>8.5%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fundTabelText">TDS on Withdrawal</td>
                                                        <td className="fundTabelText" style={{ minWidth: '5rem' }}>{formatCurrency(summaryData?.reportData?.tdsOnWithdrawal) || "-"}</td>
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
                                {isBlurred && (
                                    <div className="center-button">
                                        <button className="btn" data-bs-toggle="modal"
                                            data-bs-target="#exampleModal" style={{ color: '#ffffff', backgroundColor: 'green' }}>Access Full Report <br></br>Just ₹99/-</button>
                                    </div>
                                )}
                                <ReportPaymentModal onClose={paymentModalClose} mobileNumber={mobileNumber}></ReportPaymentModal>
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
                            <div className={`${isBlurred ? 'blur-content' : ''}`}>
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
                                                    <td className="fundTabelText" style={{ minWidth: '5rem' }}>{formatCurrency(summaryData?.reportData?.amountContributed?.totalPensionShare) || "-"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fundTabelText">Lump sum Pension Withdrawal limit</td>
                                                    <td className="fundTabelText" style={{ minWidth: '5rem' }}>{formatCurrency(summaryData?.reportData?.pensionWithdrability?.withdrawableAmount) || "-"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fundTabelText">Monthly Pension Amount at Retirement</td>
                                                    {summaryData?.reportData?.pensionWithdrability?.message === "" && <td className="fundTabelText" style={{ minWidth: '5rem' }}>{formatCurrency(summaryData?.reportData?.pensionWithdrability?.pensionAmountPerMonth) || "-"}</td>}
                                                    {summaryData?.reportData?.pensionWithdrability?.message !== "" && <td className="fundTabelText" style={{ minWidth: '5rem' }}>{summaryData?.reportData?.pensionWithdrability?.message}</td>}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="me-lg-3 me-1">
                                        <FaChevronRight style={{ cursor: 'pointer' }} size={20} className="text-muted" onClick={pensionDetails} />
                                    </div>
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

                    <ClaimRejection reportData={summaryData}></ClaimRejection>
                </div>
            </div>
        </div>
    )
}
export default FundDetails;