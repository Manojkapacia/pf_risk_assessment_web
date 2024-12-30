import '../../App.css';
import '../../css/report/account-summary.css';
import { PersonCircle } from 'react-bootstrap-icons';
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { BsCircleFill, BsExclamationOctagonFill, BsCheck } from "react-icons/bs";
import { useNavigate, useLocation } from 'react-router-dom';
import { Stepper } from 'react-form-stepper';

// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function AccountSummary( ) {
    const location = useLocation();
    const { profileData, home, mobileNumber, listItems} = location.state || {};
    // Sample data for the chart
    const data = {
        labels: ["Employee Share", "Employer Share", "Pension Share", "Interest Earned"],
        datasets: [
            {
                label: "Amount",
                data: [2250000, 2250000, 2250000, 2250000],
                backgroundColor: ["#27DEBF", "#00124F", "#4880FF", "#ABD5FD"],
                hoverOffset: 4,
            },
        ],
    }

    const options = {
        cutout: "50%",
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

    const handleDownload = () => {
        const pdfPath = "/PFCheck-up-Report.pdf";
        const link = document.createElement("a");
        link.href = pdfPath;
        link.download = "PF-Check-up-Report.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    return (
        <div className='container'>
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-12 col-md-12">
                    <div className='row'>
                        <div className='col-lg-8 offset-lg-2'>
                            <div className="app-container">
                                <div className='row mt-3 mt-lg-5'>
                                    <div className='col-md-6'>
                                        <div className="card text-white p-2 h-100" style={{ backgroundColor: "#04184a", borderRadius: "1rem" }}>
                                            <div className="d-flex flex-column align-items-center">
                                                <PersonCircle className="fs-1" />
                                                <span className='reportUserName mb-0'>{profileData.fullName}</span>
                                                <span className='reportUANno mb-0'>{`UAN: ${profileData?.UAN}`}</span>
                                            </div>
                                            <div className="row d-flex justify-content-between mt-3">
                                                <div className="col-4">
                                                    <p className="reportValueText">Current Value</p>
                                                    <span className='reportValueAmount'>₹{home?.totalBalance}</span>
                                                </div>
                                                <div className="col-4">
                                                    <p className="reportValueText">Last Contribution</p>
                                                    <span className='reportValueAmount'>₹22,500</span>
                                                </div>
                                                <div className="col-4">
                                                    <p className="reportValueText">FY'24 Interest</p>
                                                    <span className='reportValueAmount'>₹1,22,500</span>
                                                </div>
                                            </div>
                                            <div className="d-flex  justify-content-between mt-3">
                                                <div className="col-4">
                                                    <p className="reportValueTextSub">Total Service</p>
                                                    <span className='reportValueAmountSub'>{listItems?.overview?.['Total Experience']}</span>
                                                </div>
                                                <div className="col-4">
                                                    <p className="reportValueTextSub"># of Employers</p>
                                                    <span className='reportValueAmountSub'>{listItems?.history.length}</span>
                                                </div>
                                                <div className="col-4">
                                                    <p className="reportValueTextSub">Current Employer</p>
                                                    <span className='reportValueAmountSub'>{listItems?.history[0]?.company}</span>
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="updatedDate">Last updated on 28-12-2024</div>
                                            </div>
                                            <div className="text-center mt-4">
                                                <p className="refreshBtn">Refresh Data</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-3 mt-md-0 ">
                                        <div className="card shadow-sm p-2 h-100 d-flex flex-column">
                                            <h5 className="text-primary">Provident Fund Risk Score</h5>
                                            <div className="report-main-text mt-2">
                                                Your report generation is<br></br>in progress
                                            </div>
                                            <p className="report-subheading-text mt-2">You will get your report on registered<br></br> number within 4 hours</p>
                                            <div className="text-center mt-auto mx-3">
                                                <p className="download-sample-btn" onClick={handleDownload} >Download Sample Report</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row my-3'>
                                    <div className="col-md-6">
                                        <div className="card shadow-sm p-2">
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
                                        <div className="card shadow-sm p-2 mt-3">
                                            <h5 className="text-primary">Employment History</h5>
                                            <table className="table table-borderless">
                                                <thead>
                                                    <tr>
                                                        <th>Employer</th>
                                                        <th>Tenure</th>
                                                        <th>Experience</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {listItems?.history?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item?.company}</td>
                                                        <td>{item?.period}</td>
                                                        <td>{item?.details?.['Total Service']}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                            <p className="text-end text-muted">Last updated on 28-12-2024</p>
                                        </div>
                                        <div className="card shadow-sm p-2 mt-3" style={{ height: "25rem" }}>
                                            <h5 className="text-primary">Fund Performance</h5>
                                            <p className="coming-soon">Coming Soon...</p>
                                            <div className='d-flex justify-content-center align-items-center' style={{ height: '100%' }}>
                                                <BsExclamationOctagonFill
                                                    style={{
                                                        fontSize: "5rem",
                                                        color: "rgba(255, 0, 0, 0.2)",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-2 mt-md-0">
                                        <div className="card shadow-sm p-2 d-flex flex-column">
                                            <h5 className="text-primary">Fund Distribution</h5>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <div className="doughnut-chart">
                                                    <Doughnut data={data} options={options} />
                                                </div>
                                            </div>
                                            <table className="table table-borderless">
                                                <thead>
                                                    <tr>
                                                        <th>Particular</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Employee Share &nbsp;&nbsp;<BsCircleFill style={{ 'color': '#27DEBF' }} /></td>
                                                        <td>₹22,50,000</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Employer Share &nbsp;&nbsp;<BsCircleFill style={{ 'color': '#00124F' }} /></td>
                                                        <td>₹22,50,000</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Pension Share &nbsp;&nbsp;<BsCircleFill style={{ 'color': '#4880FF' }} /></td>
                                                        <td>₹22,50,000</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Interest Earned &nbsp;&nbsp;<BsCircleFill style={{ 'color': '#ABD5FD' }} /></td>
                                                        <td>₹22,50,000</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="text-right">
                                                <div className="updatedDateChart">Last updated on 28-12-2024</div>
                                            </div>
                                        </div>
                                        <div className="card shadow-sm p-2 mt-3" style={{ height: "27.9rem" }}>
                                            <h5 className="text-primary">Fund ROI</h5>
                                            <p className="coming-soon">Coming Soon...</p>
                                            <div className='d-flex justify-content-center align-items-center' style={{ height: '100%' }}>
                                                <BsExclamationOctagonFill
                                                    style={{
                                                        fontSize: "5rem",
                                                        color: "rgba(255, 0, 0, 0.2)",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row my-3 justify-content-center">
                                    <div className="col-12">
                                        <div className="stepper-container" style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
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
                                                    completedIcon: <BsCheck color="#fff" />, // Replace numbers with check icon
                                                    activeIcon: '•', // Dot for active step
                                                    inactiveIcon: '○', // Circle for inactive steps
                                                }}
                                            />
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