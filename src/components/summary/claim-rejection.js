import React from "react";
import HighRisk from './../../assets/images/highRiskImage.svg';
import Moderate from './../../assets/images/moderateImage.svg';
import LowRisk from './../../assets/images/lowRiskImage.svg';
import NoRisk from './../../assets/images/NoRiskImage.svg';
import { formatCurrency } from "../../helper/data-transform";

function ClaimRejection(reportData) {
    const riskProbability = reportData?.reportData?.reportData?.claimRejectionProbability.toLowerCase();
    return (
        // <div className="card rejection-card text-white px-4 mt-3">
        //     <div className="row">
        //         <div className="col-lg-7">
        //             <div className="d-flex justify-content-center justify-content-lg-start mt-3">
        //                 <p className='mb-0' style={{ fontSize: '1rem', fontWeight: '500', lineHeight: '1.1' }}>
        //                     Your claim rejection <br></br> probability
        //                 </p>
        //             </div>
        //             <div className="d-flex justify-content-center justify-content-lg-end">
        //                 {riskProbability === 'high' ?
        //                     (
        //                         <img
        //                             src={HighRisk}
        //                             alt="High Risk"
        //                             style={{
        //                                 width: '12rem',
        //                                 height: '6rem',
        //                             }} />
        //                     )

        //                     : riskProbability === 'moderate' ?
        //                         (<img
        //                             src={Moderate}
        //                             alt="Moderate"
        //                             style={{
        //                                 width: '12rem',
        //                                 height: '6rem'
        //                             }} />
        //                         ) : riskProbability === 'low' ? (
        //                             <img
        //                                 src={LowRisk}
        //                                 alt="Low Risk"
        //                                 style={{
        //                                     width: '12rem',
        //                                     height: '6rem',
        //                                 }} />
        //                         ) : (
        //                             <img
        //                                 src={NoRisk}
        //                                 alt="No Risk"
        //                                 style={{
        //                                     width: '12rem',
        //                                     height: '6rem'
        //                                 }} />
        //                         )
        //                 }

        //             </div>
        //         </div>
        //         <div className="col-lg-5 mt-2 mb-2 mt-lg-0 d-flex align-items-center justify-content-center justify-content-lg-start">
        //             <div className="text-center text-lg-start">
        //                 <p className="mb-0" style={{ fontSize: '1.5rem', fontWeight: '700' }}>{formatCurrency(reportData?.reportData?.reportData?.totalAmountStuck)}</p>
        //                 <p className="mb-0" style={{ fontSize: '1rem', fontWeight: '600', lineHeight: '1.1' }}>
        //                     Stuck due to identified Issues
        //                 </p>
        //                 <button className="resolveButton mt-2 py-1">Resolve My Issues</button>
        //             </div>
        //         </div>

        //     </div>
        // </div>
        <div className="card rejection-card text-white px-4 mt-3">
    <div className="row">
        <div className="col-xl-7  pe-xl-0">
            <div className="d-flex justify-content-center justify-content-xl-start mt-3">
                <p className='mb-0' style={{ fontSize: '1rem', fontWeight: '500', lineHeight: '1.1' }}>
                    Your claim rejection <br /> probability
                </p>
            </div>
            <div className="d-flex justify-content-center justify-content-xl-end align-items-end mt-3 mt-xl-0" style={{ height: '6rem' }}>
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
                            width: '16rem',
                            height: '8rem',
                        }}
                    />
                ) : riskProbability === 'low' ? (
                    <img 
                        className="img-fluid"
                        src={LowRisk}
                        alt="Low Risk"
                        style={{
                            width: '16rem',
                            height: '8rem',
                        }}
                    />
                ) : (
                    <img
                        className="img-fluid"
                        src={NoRisk}
                        alt="No Risk"
                        style={{
                            width: '16rem',
                            height: '8rem',
                        }}
                    />
                )}
            </div>
        </div>
        <div className="col-xl-5 mt-2 mb-2 mt-lg-0 d-flex align-items-center justify-content-center justify-content-xl-start">
            <div className="text-center text-xl-start">
                <p className="mb-0" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    {formatCurrency(reportData?.reportData?.reportData?.totalAmountStuck)}
                </p>
                <p className="mb-0" style={{ fontSize: '1rem', fontWeight: '600', lineHeight: '1.1' }}>
                    Stuck due to identified Issues
                </p>
                <button className="resolveButton mt-2 py-1">Resolve My Issues</button>
            </div>
        </div>
    </div>
</div>

    );
}

export default ClaimRejection;