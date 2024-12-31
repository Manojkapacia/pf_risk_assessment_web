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
import { getReportSubmissionMessage } from '../common/time-formatter';
import { zohoRequest } from '../common/api';
import moment from "moment";

// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function AccountSummary( ) {
    const location = useLocation();
    const navigate = useNavigate()

    const { profileData, home, mobileNumber, listItems, reportUpdatedAtVar} = location.state || {};
    const [balanceDetails, setBalanceDetails] = useState(null)
    const [recentContribution, setRecentContribution] = useState(null)
    const reportMessage = getReportSubmissionMessage()

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
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan');
        let value = "account-summary";
        localStorage.setItem(dynamicKey, value);
        
        const data = JSON.parse(decryptData(localStorage.getItem('data-raw'))) 
        if(data) {
            const parseCurrency = (value) => Number(value.replace(/[₹,]/g, ""));

            const balances = getClosingBalance(data?.passbooks)
            setBalanceDetails(balances)
            const lastContribution = getLastContribution(data)
            setRecentContribution(lastContribution)

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
        // zoho lead creation
        const formData = {
            Last_Name: profileData?.basicDetails?.fullName,
            Mobile: mobileNumber?.phoneNumber,
            Email: "",
            Wants_To: "Withdrawal Checkup",
            Lead_Status: "Open",
            Lead_Source: "",
            Campaign_Id: ""
        };
        const ZohoAPi = async (formData) => {
            try {
                const result = await zohoRequest(formData);
                if (result.data.data[0].status === "success") {
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
        ZohoAPi(formData);
    }, [])

    const handleDownload = () => {
        const pdfPath = "/PFCheck-up-Report.pdf";
        const link = document.createElement("a");
        link.href = pdfPath;
        link.download = "PF-Check-up-Report.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
 
    const handleRefresh = () => {
        const UAN = localStorage.getItem('user_uan')
        const Pws = localStorage.getItem('data-cred')
        navigate("/otpAssessment", { state: { UAN, Pws, type: "back-screen" } });
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
                                                    <span className='reportValueAmount'>{home?.totalBalance !== 'N/A' ? `${home?.totalBalance}` : 'N/A'}</span>
                                                </div>
                                                <div className="col-4">
                                                    <p className="reportValueText">Last Contribution</p>
                                                    <span className='reportValueAmount'>{recentContribution}</span>
                                                </div>
                                                <div className="col-4">
                                                    <p className="reportValueText">{balanceDetails?.year} Interest</p>
                                                    <span className='reportValueAmount'>{balanceDetails?.interestShare}</span>
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
                                                    <span className='reportValueAmountSub' title={listItems?.history[0]?.company}>{listItems?.history[0]?.company.length > 10 ? listItems?.history[0]?.company.slice(0, 10) + "..." : listItems?.history[0]?.company }</span>
                                                </div>
                                            </div>
                                            <div className="text-center mt-4" onClick={handleRefresh}>
                                                <p className="refreshBtn">Refresh Data</p>
                                            </div>                                            
                                            <div className="row">
                                                <div className="updatedDate">Last updated on {moment(reportUpdatedAtVar).format("DD-MM-YYYY")}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-3 mt-md-0 ">
                                        <div className="card shadow-sm p-3 h-100 d-flex flex-column">
                                            <h5 className="text-primary">Provident Fund Risk Score</h5>
                                            <div className="report-main-text mt-2">
                                                Your report generation is<br></br>in progress
                                            </div>
                                            <p className="report-subheading-text mt-2">You will get your report on registered<br></br> number {reportMessage}</p>
                                            <div className="text-center mt-auto">
                                                <p className="download-sample-btn" onClick={handleDownload} >Download Sample Report</p>
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
                                                        <div className="personal-value">{profileData?.basicDetails?.gender === "M" ? "Male": "Female"}</div>
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
                                                        <th style={{'padding-left': '0px'}}>Employer</th>
                                                        <th>Tenure</th>
                                                        <th>Experience</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {listItems?.history.length !== 0 ? listItems?.history?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td style={{'padding-left': '0px'}}>{item?.company}</td>
                                                        <td>{item?.period}</td>
                                                        <td>{item?.details?.['Total Service'].replace(/\b\d+\s*Days\b/i, "").trim()}</td>
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
                                                    stepStyleConfig={{
                                                        completedIcon: <BsCheck color="#fff" />,
                                                        activeIcon: '•', 
                                                        inactiveIcon: '○', 
                                                    }}
                                                />
                                                {/* <div className="d-flex align-items-center justify-content-center">
                                                    <p className="download-sample-btn">Book Consultation Now</p>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AccountSummary;