import React, { useRef } from "react";
import HighRisk from './../../assets/images/highRiskImage.svg';
import Moderate from './../../assets/images/moderateImage.svg';
import LowRisk from './../../assets/images/lowRiskImage.svg';
import NoRisk from './../../assets/images/NoRiskImage.svg';
import { formatCurrency } from "../../helper/data-transform";

function ClaimRejection(reportData) {

    const riskProbability = reportData?.reportData?.reportData?.claimRejectionProbability.toLowerCase();
    return (
        <div className="card rejection-card text-white px-4 mt-3" >
            <div className="row">
                <div className="col-xl-7  pe-xl-0">
                    <div className="d-flex justify-content-center justify-content-xl-start mt-3">
                        <p className='mb-0' style={{ fontSize: '1rem', fontWeight: '500', lineHeight: '1.1' }}>
                            Your claim rejection <br /> probability
                        </p>
                    </div>
                    <div className="d-flex justify-content-center justify-content-xl-end align-items-end mt-4 mt-xl-0" style={{ height: '6rem' }}>
                        {riskProbability === 'high' ? (
                            <img
                                className="img-fluid"
                                src={HighRisk}
                                alt="High Risk"
                                style={{
                                    width: '16rem',
                                    height: '8rem',
                                }}
                            />
                        ) : riskProbability === 'moderate' ? (
                            <img
                                className="img-fluid"
                                src={Moderate}
                                alt="Moderate"
                                style={{
                                    width: '14rem',
                                    height: '7rem',
                                }}
                            />
                        ) : riskProbability === 'low' ? (
                            <img
                                className="img-fluid"
                                src={LowRisk}
                                alt="Low Risk"
                                style={{
                                    width: '14rem',
                                    height: '7rem',
                                }}
                            />
                        ) : (
                            <img
                                className="img-fluid"
                                src={NoRisk}
                                alt="No Risk"
                                style={{
                                    width: '14rem',
                                    height: '7rem',
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className="col-xl-5 mt-2 mb-2 mt-lg-0 d-flex align-items-center justify-content-center justify-content-xl-start">
                    <div className="text-center text-xl-start">
                        <p className="mb-0" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                            {
                                reportData?.reportData?.reportData?.totalAmountStuck > 0
                                    ? formatCurrency(reportData?.reportData?.reportData?.totalAmountStuck)
                                    : formatCurrency(reportData?.reportData?.reportData?.amountWithdrawableWithin30Days)
                            }
                        </p>
                        <p className="mb-0" style={{ fontSize: '1rem', fontWeight: '600', lineHeight: '1.1' }}>
                            {reportData?.reportData?.reportData?.totalAmountStuck > 0 ? 'Stuck due to identified Issues' : 'Amount Withdrawable within 30 Days'}
                        </p>
                        {/* <button className="resolveButton mt-2 py-1" >Resolve My Issues</button> */}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ClaimRejection;