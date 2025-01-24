import React, { useEffect, useState } from 'react';
import './../../css/summary/pf-balance-analysis.css';
import { BsCircleFill } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { formatCurrency, getClosingBalance } from '../../helper/data-transform';


// Register required elements
ChartJS.register(ArcElement, Tooltip, Legend);

function PfBalanceAnalysis({ summaryData, setBlurEffect}) {
    const [activeCard, setActiveCard] = useState("main");
    const [withdrawalChartWidth, setWithdrawalChartWidth] = useState("");
    const [blockedChartWidth, setBlockedChartWidth] = useState("");
    const [amountWithdrawable30Days, setAmountWithdrawable30Days] = useState("");
    const [blockedAmountPercentage, setBlockedAmountPercentage] = useState("");
    const [balanceDetails, setBalanceDetails] = useState(null)

    const [graphData, setGraphData] = useState({
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

    useEffect(() => {
        // set width % for graph line
        if (summaryData?.reportData) setChartWidths()

        // set graph data
        if (summaryData?.rawData) {
            const parseCurrency = (value) => Number(value.replace(/[₹,]/g, ""));

            const balances = getClosingBalance(summaryData?.rawData?.data?.passbooks)
            setBalanceDetails(balances)

            const { employeeShare, employerShare, pensionShare, interestShare } = balances;
            setGraphData((prevData) => ({
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
        }
    }, [summaryData])

    const setChartWidths = () => {
        // set widthdrawal width 
        const withdrawalWidth = Number(Number((summaryData?.reportData?.maxWithdrawableLimit * 100) / summaryData?.reportData?.totalPfBalance).toFixed(0))
        const withdrawalFinalWidth = (withdrawalWidth * 0.60).toFixed(0); // 60% of the calculated width
        setWithdrawalChartWidth(withdrawalFinalWidth + '%')

        // set blocked amount width
        const blockedWidth = Number(Number((summaryData?.reportData?.totalAmountStuck * 100) / summaryData?.reportData?.totalPfBalance).toFixed(0))
        const blockedFinalWidth = (blockedWidth * 0.60).toFixed(0); // 60% of the calculated width
        setBlockedChartWidth(blockedFinalWidth + '%')

        // set widthable amount width
        const withdrawableAmount = Number(Number((summaryData?.reportData?.amountWithdrawableWithin30Days * 100) / summaryData?.reportData?.totalPfBalance).toFixed(0))
        const withdrawableAmountWidth = (withdrawableAmount * 0.60).toFixed(0); // 60% of the calculated width
        setAmountWithdrawable30Days(withdrawableAmountWidth + '%')
        // set original blocked amount width
        setBlockedAmountPercentage(blockedWidth  + "%")
    }

    return (
        <>
            {activeCard === "main" && (
                <div className="card pf-card shadow-sm setCardHeight py-3 mt-3">
                    <p className='pfAnalysisText'>PF Balance Analysis</p>
                    <div 
                    className={`${setBlurEffect ? 'blur-content' : ''}`}
                    >
                        <div className="d-flex align-items-center bg-light position-relative mt-4 border-top border-bottom">
                            <div className="totalCorpusChart"></div>
                            <div className="mt-0  d-flex justify-content-between align-items-center">
                                <div className='ms-2'>
                                    <span className="pfAmountAnalysis mb-0">{formatCurrency(summaryData?.reportData?.totalPfBalance)}</span>
                                    <div className='pfTextanalysis'>Total Corpus</div>
                                </div>
                                <div className="position-absolute end-0 top-50 translate-middle-y" onClick={() => setActiveCard("toalCorpus")}>
                                    <FaChevronRight style={{ cursor: 'pointer' }} size={20} className="me-2" />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center bg-light position-relative border-top border-bottom">
                            <div className="withdrawalLimit" style={{ width: withdrawalChartWidth }}></div>
                            <div className="mt-0  d-flex justify-content-between align-items-center"
                                style={{ width: '50%' }}>
                                <div className='ms-2'>
                                    <span className="pfAmountAnalysis mb-0">{formatCurrency(summaryData?.reportData?.maxWithdrawableLimit)}</span>
                                    <div className='pfTextanalysis'>Max withdrawal Limit</div>
                                </div>
                                <div className="position-absolute end-0 top-50 translate-middle-y" onClick={() => setActiveCard("withdrawalLimit")}>
                                    {/* <i className="bi bi-chevron-right me-2" style={{ fontSize: '1.3rem', fontWeight: '800', cursor: 'pointer' }}></i> */}
                                    <FaChevronRight style={{ cursor: 'pointer' }} size={20} className="me-2" />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center bg-light position-relative border-top border-bottom">
                            <div className="blockAmountChart" style={{ width:summaryData?.reportData?.totalAmountStuck > 0 ? blockedChartWidth :amountWithdrawable30Days}}></div>
                            <div className="blockAmountText mt-0  d-flex justify-content-between align-items-center">
                                <div className='ms-2'>
                                    <span className="pfAmountAnalysis mb-0">{formatCurrency(summaryData?.reportData?.totalAmountStuck > 0 ?summaryData?.reportData?.totalAmountStuck : summaryData?.reportData?.amountWithdrawableWithin30Days )}</span>
                                    <div className='pfTextanalysis'>{summaryData?.reportData?.totalAmountStuck > 0 ? 'Blocked Amount' : 'Withdrawable in 30 Days'}</div>
                                </div>
                                <div className="position-absolute end-0 top-50 translate-middle-y" onClick={() => setActiveCard("blockAmount")}>
                                    <FaChevronRight style={{ cursor: 'pointer' }} size={20} className="me-2" />
                                </div>
                            </div>
                        </div>
                        {summaryData?.reportData?.totalAmountStuck > 0 &&
                            <span className="text-danger d-flex justify-content-lg-center px-2 px-xl-0 mt-3" style={{fontSize: '1.20rem',fontWeight:'500'}}>
                                <i className="bi bi-exclamation-circle-fill me-2"></i>
                                {blockedAmountPercentage} of your total PF Corpus is stuck due to Issues
                            </span>
                        }
                        {summaryData?.reportData?.totalAmountStuck === 0 &&
                            <span className="text-success d-flex justify-content-lg-center px-2 px-xl-0 mt-3" style={{fontSize: '1.20rem',fontWeight:'500'}}>
                                <i className="bi bi-check-circle-fill me-2"></i>
                                Yay! you have complete access to your fund
                            </span>
                        }
                    </div>
                    {setBlurEffect && (
                            <div className="center-button">
                                <button className="btn" data-bs-toggle="modal"
                                    data-bs-target="#exampleModal" style={{ color: '#ffffff', backgroundColor: '#00124F' }}>Access Full Report<br></br> Just ₹99/-</button>
                            </div>
                        )}
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
                                <Doughnut data={graphData} options={options} />
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
                                        <td className='pfTabeltext'>{balanceDetails?.employeeShare}</td>
                                    </tr>
                                    <tr>
                                        <td className='pfTabeltext'>
                                            <BsCircleFill style={{ color: "#00124F" }} /> &nbsp;&nbsp;Employer Share
                                        </td>
                                        <td className='pfTabeltext'>{balanceDetails?.employerShare}</td>
                                    </tr>
                                    <tr>
                                        <td className='pfTabeltext'>
                                            <BsCircleFill style={{ color: "#4880FF" }} /> &nbsp;&nbsp;Pension Share
                                        </td>
                                        <td className='pfTabeltext'>{balanceDetails?.pensionShare}</td>
                                    </tr>
                                    <tr>
                                        <td className='pfTabeltext'>
                                            <BsCircleFill style={{ color: "#ABD5FD" }} /> &nbsp;&nbsp;Interest Earned
                                        </td>
                                        <td className='pfTabeltext'>{balanceDetails?.interestShare}</td>
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