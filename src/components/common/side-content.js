import React from 'react';
import '../../css/common/side-content.css'
import multiFactor from "../../assets/images/multifactor.png"
import IPData from "../../assets/images/PIdata.png";
import Encryption from "../../assets/images/encryption.png";
import DPDP from "../../assets/images/DPDP.png";
import cloud from "../../assets/images/cloud.png";
import dataProtect from "../../assets/images/dataProtect.png";

function SideContent() {
    return (
        <>
            <div className='welcomeLabelLogin'>
                Welcome to India's First<br></br> Digital PF check up
            </div>
            <div className='EpfText mt-4 mb-3'>
                Please login using your EPF UAN and<br></br> Password to begin the check up
            </div>
            <div className="d-flex justify-content-start">
                <span className='securityText py-2 px-3 d-flex align-items-center'>
                    <img src={dataProtect} alt="Risk Assessment" className='dataImage me-1' />
                    We have implemented 5 tier security to keep youe data protected</span>
            </div>
            <div className="d-flex justify-content-start mt-3">
                <div className='d-flex flex-column  align-items-center text-center'>
                    <img src={multiFactor} alt="Risk Assessment" className='iconImage ' />
                    <span className="iconText">Multi Factor Authentication</span>
                </div>
                <div className='d-flex flex-column align-items-center text-center'>
                    <img src={IPData} alt="Risk Assessment" className='iconImage' />
                    <span className="iconText">Encrypting and Masking PI Data</span>
                </div>
                <div className='d-flex flex-column align-items-center text-center'>
                    <img src={Encryption} alt="Risk Assessment" className='iconImage' />
                    <span className="iconText">End to End Encryption</span>
                </div>
                <div className='d-flex flex-column align-items-center text-center'>
                    <img src={DPDP} alt="Risk Assessment" className='iconImage' />
                    <span className="iconText">Adherence to DPDP Act 2024</span>
                </div>
                <div className='d-flex flex-column align-items-center text-center'>
                    <img src={cloud} alt="Risk Assessment" className='iconImage' />
                    <span className="iconText">Highly Secure cloud infrastructure</span>
                </div>

            </div>
        </>
    );
}

export default SideContent;