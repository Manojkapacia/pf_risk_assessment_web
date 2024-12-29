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
import { Stepper } from 'react-form-stepper';

// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function AccountSummary({ profileData, homeData }) {
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

    return (
        <div className="row d-flex justify-content-center align-items-center">
            <div className="col-lg-12 col-md-12">
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='row'>
                            <div className='col-md-10 offset-md-1'>
                                <div className="app-container">
                                    {/* Account Summary Section */}
                                    <div className='row d-flex align-items-stretch mt-4'>
                                        <hr />
                                        <h3 style={{ 'text-align': 'left', 'margin-bottom': '1rem' }}>Account Summary</h3>
                                        <hr />
                                        {/* Basic Account Information Section */}
                                        <div className='col-md-4'>
                                            <div className="card text-white p-2 h-100" style={{ backgroundColor: "#04184a", borderRadius: "1rem" }}>
                                                <div className="d-flex flex-column align-items-center">
                                                    <PersonCircle className="fs-1" />
                                                    <span className='reportUserName mb-0'>Ashirwad Tomar</span>
                                                    <span className='reportUANno mb-0'>{`UAN: 111111110556`}</span>
                                                </div>
                                                <div className="d-flex flex-row align-items-center justify-content-around mt-2">
                                                    <div className="text-center mt-3">
                                                        <p className="reportValueText">Current Value</p>
                                                        <span className='reportValueAmount'>₹22,50,000</span>
                                                    </div>
                                                    <div className="text-center mt-3">
                                                        <p className="reportValueText">Last Contribution</p>
                                                        <span className='reportValueAmount'>₹22,500</span>
                                                    </div>
                                                    <div className="text-center mt-3">
                                                        <p className="reportValueText">FY'24 Interest</p>
                                                        <span className='reportValueAmount'>₹1,22,500</span>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-row align-items-center justify-content-around mt-2">
                                                    <div className="text-center mt-3">
                                                        <p className="reportValueTextSub">Total Service</p>
                                                        <span className='reportValueAmountSub'>7 Years 3 Months</span>
                                                    </div>
                                                    <div className="text-center mt-3">
                                                        <p className="reportValueTextSub"># of Employers</p>
                                                        <span className='reportValueAmountSub'>3</span>
                                                    </div>
                                                    <div className="text-center mt-3">
                                                        <p className="reportValueTextSub">Current Employer</p>
                                                        <span className='reportValueAmountSub'>Morning Star</span>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-row align-items-center justify-content-around mt-2">
                                                    <div className="updatedDate">Last updated on 28-12-2024</div>
                                                </div>
                                                <div className="text-center mt-4">
                                                    <p className="refreshBtn">Refresh Data</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Personal Details Section */}
                                        <div className="col-md-4">
                                            <div className="card shadow-sm p-2 h-100">
                                                <h5 className="text-primary">Personal Details</h5>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="mb-3">
                                                            <strong className="personal-heading">Fathers Name:</strong>
                                                            <div className="personal-value">DARSHAN</div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <strong className="personal-heading">Gender:</strong>
                                                            <div className="personal-value">MALE</div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <strong className="personal-heading">Physically Handicapped:</strong>
                                                            <div className="personal-value">NONE</div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <strong className="personal-heading">Bank A/C Number:</strong>
                                                            <div className="personal-value">40XXXXXXXX2312</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="mb-3">
                                                            <strong className="personal-heading">Date of Birth:</strong>
                                                            <div className="personal-value">17/11/1993</div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <strong className="personal-heading">Aadhaar Number:</strong>
                                                            <div className="personal-value">808479258994</div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <strong className="personal-heading">PAN Number:</strong>
                                                            <div className="personal-value">AXOPT7789W</div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <strong className="personal-heading">IFSC Number:</strong>
                                                            <div className="personal-value">KKBK0000646</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Employment History Section */}
                                        <div className="col-md-4">
                                            <div className="card shadow-sm p-2 h-100">
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
                                                        <tr>
                                                            <td>Morningstar India Pvt. Ltd.</td>
                                                            <td>21 Feb'24 to Present</td>
                                                            <td>1 year 3 months</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Morningstar India Pvt. Ltd.</td>
                                                            <td>21 Feb'24 to Present</td>
                                                            <td>1 year 3 months</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Morningstar India Pvt. Ltd.</td>
                                                            <td>21 Feb'24 to Present</td>
                                                            <td>1 year 3 months</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p className="text-end text-muted">Last updated on 28-12-2024</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Provident Fund Checkup */}
                                    <div className='row d-flex align-items-stretch mt-4 mb-4'>
                                        <hr />
                                        <h3 style={{ 'text-align': 'left', 'margin-bottom': '1rem' }}>Provident Fund Checkup</h3>
                                        <hr />
                                        <div className="col-md-4">
                                            <div className="card shadow-sm p-2 h-100 d-flex flex-column">
                                                <h5 className="text-primary">Provident Fund Risk Score</h5>
                                                <div className="report-main-text mt-2">
                                                    Your report generation is in progress
                                                </div>
                                                <p className="report-subheading-text mt-2">You will get your report on registered number within 4 hours</p>
                                                <div className="text-center mt-auto">
                                                    <p className="download-sample-btn">Download Sample Report</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card shadow-sm p-2 h-50 mb-1">
                                                {/* Icon as background */}
                                                <BsExclamationOctagonFill
                                                    style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-50%, -50%)",
                                                        fontSize: "50px", // Adjust size
                                                        color: "rgba(255, 0, 0, 0.2)", // Transparent color
                                                    }}
                                                />
                                                <h5 className="text-primary">Issues Found</h5>
                                                <p className="coming-soon">Coming Soon...</p>
                                            </div>
                                            <div className="card shadow-sm p-2 h-50">
                                                {/* Icon as background */}
                                                <BsExclamationOctagonFill
                                                    style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-50%, -50%)",
                                                        fontSize: "50px", // Adjust size
                                                        color: "rgba(255, 0, 0, 0.2)", // Transparent color
                                                    }}
                                                />
                                                <h5 className="text-primary">Amount Stuck</h5>
                                                <p className="coming-soon">Coming Soon...</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card shadow-sm p-2 h-50 mb-1">
                                                {/* Icon as background */}
                                                <BsExclamationOctagonFill
                                                    style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-50%, -50%)",
                                                        fontSize: "50px", // Adjust size
                                                        color: "rgba(255, 0, 0, 0.2)", // Transparent color
                                                    }}
                                                />
                                                <h5 className="text-primary">Estimated Resolution Time</h5>
                                                <p className="coming-soon">Coming Soon...</p>
                                            </div>
                                            <div className="card shadow-sm p-2 h-50">
                                                {/* Icon as background */}
                                                <BsExclamationOctagonFill
                                                    style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-50%, -50%)",
                                                        fontSize: "50px", // Adjust size
                                                        color: "rgba(255, 0, 0, 0.2)", // Transparent color
                                                    }}
                                                />
                                                <h5 className="text-primary">Maximum Withdrawability Eligibility</h5>
                                                <p className="coming-soon">Coming Soon...</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Fund Performance Stats */}
                                    <div className='row d-flex align-items-stretch mt-4 mb-4'>
                                        <hr />
                                        <h3 style={{ 'text-align': 'left', 'margin-bottom': '1rem' }}>Fund Performance Stats</h3>
                                        <hr />
                                        <div className="col-md-4">
                                            <div className="card shadow-sm p-2 h-100 d-flex flex-column">
                                                <h5 className="text-primary">Fund Distribution</h5>
                                                <div className="doughnut-chart">
                                                    <Doughnut data={data} options={options} />
                                                </div>
                                                {/* Legend Table */}
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
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card shadow-sm p-2 h-100" style={{ position: "relative" }}>
                                                {/* Icon as background */}
                                                <BsExclamationOctagonFill
                                                    style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-50%, -50%)",
                                                        fontSize: "100px", // Adjust size
                                                        color: "rgba(255, 0, 0, 0.2)", // Transparent color
                                                    }}
                                                />
                                                <h5 className="text-primary">Issues Found</h5>
                                                <p className="coming-soon">Coming Soon...</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card shadow-sm p-2 h-100">
                                                {/* Icon as background */}
                                                <BsExclamationOctagonFill
                                                    style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-50%, -50%)",
                                                        fontSize: "100px", // Adjust size
                                                        color: "rgba(255, 0, 0, 0.2)", // Transparent color
                                                    }}
                                                />
                                                <h5 className="text-primary">Estimated Resolution Time</h5>
                                                <p className="coming-soon">Coming Soon...</p>
                                            </div>
                                        </div>
                                    </div>
                                    { /* Next Steps Stepper */}
                                    <div className='row d-flex align-items-stretch mt-4 mb-4'>
                                        <hr />
                                        <h3 style={{ 'text-align': 'left', 'margin-bottom': '1rem' }}>Next Steps</h3>
                                        <hr />
                                        <div className="stepper-container">
                                            <Stepper
                                                steps={[{ label: 'Take Assessment' }, { label: 'Get Risk Report' }, { label: 'Book Consultation' }, { label: 'Issue Resolution' }, { label: 'Tension Free Withdrawal' }]}
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