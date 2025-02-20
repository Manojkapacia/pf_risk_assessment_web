import '../../App.css';
import '../../css/report/account-summary.css';
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { BsCircleFill, BsCheck } from "react-icons/bs";
import { useLocation, useNavigate } from 'react-router-dom';
import { Stepper } from 'react-form-stepper';
import { decryptData } from '../common/encryption-decryption';
import { useEffect, useState } from 'react';
import { getClosingBalance, getLastContribution } from '../../helper/data-transform';
import moment from "moment";
import ModalComponent from './registration-modal';
import ConsultationModal from './consultation-modal'

// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function AccountSummary() {
    const location = useLocation();
    const navigate = useNavigate()
    const [reportModalOpen, setReportModal] = useState(false);
    const [consultationModal, setConsultationModal] = useState(false);

    // Function to close the modal
    const closeReportModal = () => {
        setReportModal(false);
    };

    const consultationModalClose= () =>{
        setConsultationModal(false);
    }
    
    const { profileData, home, listItems, reportUpdatedAtVar } = location.state || {};
    const [balanceDetails, setBalanceDetails] = useState(null)
    const [recentContribution, setRecentContribution] = useState(null)
    const [totalBalance, setTotalBalance] = useState("N/A")

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
        cutout: "60%",
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
        const isUserVerified = decryptData(localStorage.getItem('finright-reg-verified-' + localStorage.getItem('user_uan')))
        if(!(Boolean(isUserVerified))) setReportModal(true);
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan');
        let value = "account-summary";
        localStorage.setItem(dynamicKey, value);

        const data = JSON.parse(decryptData(localStorage.getItem('data-raw-' + localStorage.getItem('user_uan'))))

        if (data) {
            const parseCurrency = (value) => Number(value.replace(/[₹,]/g, ""));
            const formatCurrency = (value) => `₹ ${value.toLocaleString("en-IN")}`;

            const balances = getClosingBalance(data?.passbooks)
            setBalanceDetails(balances)

            const lastContribution = getLastContribution(data)
            setRecentContribution(lastContribution)

            // set total balance 
            const totalBalance = data?.home?.memberWiseBalances.reduce((accu, item) => {
                return accu + parseCurrency(item.balance || "0");
            }, 0)
            setTotalBalance(formatCurrency(totalBalance))

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
    }, [])

    const handleDownload = () => {
        const pdfPath = "/Sample PF Health Report.pdf";
        const link = document.createElement("a");
        link.href = pdfPath;
        link.download = "PF-Check-up-Report.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRefresh = () => {
        const UAN = localStorage.getItem('user_uan')
        const Pws = decryptData(localStorage.getItem('data-cred-' + UAN))
        navigate("/otpAssessment", { state: { UAN, Pws, type: "back-screen" } });
    }

    const getMemberWiseBalance = (memberId) => {
        const memberDetails = home?.memberWiseBalances.find((item) => item.memberId === memberId)
        if (!memberDetails) return 'N/A'
        return memberDetails?.balance.replace(/[₹]/g, "")
    }

    return (
        <div className='container'>
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-12 col-md-12">
                    <div className='row'>
                        <div className='col-lg-8 offset-lg-2'>
                            <div className="app-container">
                                <div className='row mt-3 mt-lg-5'>
                                    <div className='col-md-6'>
                                        <div className="card text-white p-3 h-100" style={{ backgroundColor: "#04184a", borderRadius: "1rem" }}>
                                            <div className="d-flex flex-column align-items-center">
                                                {/* <PersonCircle className="fs-1" /> */}
                                                <span className='reportUserName mb-0'>{profileData?.fullName}</span>
                                                <span className='reportUANno mb-0'>{`UAN: ${profileData?.UAN}`}</span>
                                            </div>
                                            <div className="row d-flex justify-content-between mt-3">
                                                <div className="col-4">
                                                    <p className="reportValueText">Current Value</p>
                                                    <span className='reportValueAmountSub'>{totalBalance}</span>
                                                </div>
                                                <div className="col-4">
                                                    <p className="reportValueTextSub">Last Contribution</p>
                                                    <span className='reportValueAmountSub'>{recentContribution}</span>
                                                </div>
                                                <div className="col-4">
                                                    <p className="reportValueTextSub">{balanceDetails?.year} Interest</p>
                                                    <span className='reportValueAmountSub'>{balanceDetails?.currentYearInterestShare}</span>
                                                </div>
                                            </div>
                                            <div className="row d-flex justify-content-between mt-3">
                                                <div className="col-4">
                                                    <p className="reportValueTextSub">Total Service</p>
                                                    <span className='reportValueAmountSub'>{listItems?.overview?.['Total Experience'].replace(/\b\d+\s*Days\b/i, "").trim()}</span>
                                                </div>
                                                <div className="col-4">
                                                    <p className="reportValueTextSub"># of Employers</p>
                                                    <span className='reportValueAmountSub'>{listItems?.history.length}</span>
                                                </div>
                                                <div className="col-4">
                                                    <p className="reportValueTextSub">Current Employer</p>
                                                    <span className='reportValueAmountSub' title={listItems?.history[0]?.company}>{listItems?.history[0]?.company.length > 10 ? listItems?.history[0]?.company.slice(0, 10) + "..." : listItems?.history[0]?.company}</span>
                                                </div>
                                            </div>
                                            {/* <div className="text-center mt-4" onClick={handleRefresh}>
                                                <p className="refreshBtn">Refresh Data</p>
                                            </div> */}
                                            <div className="row mt-3 mt-lg-4">
                                                <div className="updatedDate">Last updated on {moment(reportUpdatedAtVar).format("DD-MM-YYYY")}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-3 mt-md-0 ">
                                        <div className="card shadow-sm p-3 h-100 d-flex flex-column">
                                            <h5 className="text-primary">Provident Fund Risk Score</h5>
                                            <div className="report-main-text mt-2">
                                                See if your PF is at a risk of getting stuck
                                            </div>
                                            {/* <p className="report-subheading-text mt-2">You will get your report on registered<br></br> number {reportMessage}</p> */}
                                            <div className="text-center mt-auto">
                                                <p className="download-sample-btn mb-0" onClick={handleDownload} >Download Sample Report</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row my-3'>
                                    <div className="col-md-6">
                                        <div className="card shadow-sm p-3">
                                            <h5 className="text-primary">Personal Details</h5>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="mb-3">
                                                        <strong className="personal-heading">Fathers Name:</strong>
                                                        <div className="personal-value">{profileData?.basicDetails?.fatherHusbandName}</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong className="personal-heading">Gender:</strong>
                                                        <div className="personal-value">{profileData?.basicDetails?.gender === "M" ? "Male" : "Female"}</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong className="personal-heading">Physically Handicapped:</strong>
                                                        <div className="personal-value">{profileData?.basicDetails?.physicallyHandicapped === "N" ? "NONE" : "Yes"}</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong className="personal-heading">Bank A/C Number:</strong>
                                                        <div className="personal-value">{profileData?.kycDetails?.bankAccountNumber}</div>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="mb-3">
                                                        <strong className="personal-heading">Date of Birth:</strong>
                                                        <div className="personal-value">{profileData?.basicDetails?.dateOfBirth}</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong className="personal-heading">Aadhaar Number:</strong>
                                                        <div className="personal-value">{profileData?.kycDetails?.aadhaar}</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong className="personal-heading">PAN Number:</strong>
                                                        <div className="personal-value">{profileData?.kycDetails?.pan}</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong className="personal-heading">IFSC Number:</strong>
                                                        <div className="personal-value">{profileData?.kycDetails?.bankIFSC}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card shadow-sm p-3 mt-3">
                                            <h5 className="text-primary">Employment History</h5>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ paddingLeft: 0 }}>Employer</th>
                                                        <th>Tenure</th>
                                                        <th>Experience</th>
                                                        <th>Balance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {listItems?.history.length !== 0 ? listItems?.history?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td style={{ paddingLeft: 0 }}>{item?.company}</td>
                                                            <td>{item?.period}</td>
                                                            <td>{item?.details?.['Total Service'].replace(/\b\d+\s*Days\b/i, "").trim()}</td>
                                                            <td>{getMemberWiseBalance(item?.details?.['Member Id'])}</td>
                                                        </tr>
                                                    )) : <tr key={0}>
                                                        <td colSpan={3}>No Employement History</td>
                                                    </tr>}
                                                </tbody>
                                            </table>
                                            <p className="text-end text-muted">Last updated on 28-12-2024</p>
                                        </div>
                                        <div className="card shadow-sm p-3 mt-3" style={{ height: "25rem", position: "relative" }}>
                                            <h5 className="text-primary">Fund Performance</h5>
                                            <p className="coming-soon">Coming Soon...</p>
                                            <div className='d-flex justify-content-center align-items-center placeholder-container-performance' style={{ height: '100%' }}>
                                                {/* <BsExclamationOctagonFill
                                                    style={{
                                                        fontSize: "5rem",
                                                        color: "rgba(255, 0, 0, 0.2)",
                                                    }}
                                                /> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-2 mt-md-0">
                                        <div className="card shadow-sm p-3 d-flex flex-column">
                                            <h5 className="text-primary">Fund Distribution</h5>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <div className="doughnut-chart">
                                                    <Doughnut data={graphData} options={options} />
                                                </div>
                                            </div>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Particular</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><BsCircleFill style={{ 'color': '#27DEBF' }} />&nbsp;&nbsp;Employee Share </td>
                                                        <td>{balanceDetails?.employeeShare}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><BsCircleFill style={{ 'color': '#00124F' }} />&nbsp;&nbsp;Employer Share</td>
                                                        <td>{balanceDetails?.employerShare}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><BsCircleFill style={{ 'color': '#4880FF' }} />&nbsp;&nbsp;Pension Share</td>
                                                        <td>{balanceDetails?.pensionShare}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><BsCircleFill style={{ 'color': '#ABD5FD' }} />&nbsp;&nbsp;Interest Earned</td>
                                                        <td>{balanceDetails?.interestShare}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="text-right">
                                                <div className="updatedDateChart">Last updated on {moment(reportUpdatedAtVar).format("DD-MM-YYYY")}</div>
                                            </div>
                                        </div>
                                        <div className="card shadow-sm p-3 mt-3" style={{ height: "22rem" }}>
                                            <h5 className="text-primary">Fund ROI</h5>
                                            <p className="coming-soon">Coming Soon...</p>
                                            <div className='d-flex justify-content-center align-items-center placeholder-container-roi' style={{ height: '100%' }}>
                                                {/* <BsExclamationOctagonFill
                                                    style={{
                                                        fontSize: "5rem",
                                                        color: "rgba(255, 0, 0, 0.2)",
                                                    }}
                                                /> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row my-3">
                                    <div className="col-mg-12">
                                        <div className="card shadow-sm p-3">
                                            <h5 className="text-primary">Next Steps</h5>
                                            <div className="" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                <Stepper
                                                    steps={[
                                                        { label: 'Take Assessment' },
                                                        { label: 'Get Risk Report' },
                                                        { label: 'Book Consultation' },
                                                        { label: 'Issue Resolution' },
                                                        { label: 'Tension Free Withdrawal' }
                                                    ]}
                                                    activeStep={1}
                                                    styleConfig={{
                                                        activeBgColor: '#FF9500',
                                                        completedBgColor: '#34C759',
                                                        inactiveBgColor: '#e0e0e0',
                                                        completedTextColor: '#fff',
                                                        activeTextColor: '#fff',
                                                        inactiveTextColor: '#999',
                                                    }}
                                                    stepstyleconfig={{
                                                        completedIcon: <BsCheck color="#fff" />,
                                                        activeIcon: '•',
                                                        inactiveIcon: '○',
                                                    }}
                                                />
                                                {/* <div className="d-flex align-items-center justify-content-center">
                                                    <p className="download-sample-btn mb-0" onClick={consultationModalOpen}>Book Consultation Now</p>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ModalComponent profileData={profileData} isOpen={reportModalOpen} onClose={closeReportModal} />
                    <ConsultationModal isOpen={consultationModal} onClose={consultationModalClose}></ConsultationModal>
                </div>
            </div>
        </div>

    );
}

export default AccountSummary;