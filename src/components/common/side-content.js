import React,{ useState, useEffect }  from 'react';
import '../../css/common/side-content.css'
import multiFactor from "../../assets/images/multifactor.png"
import IPData from "../../assets/images/PIdata.png";
import Encryption from "../../assets/images/encryption.png";
import DPDP from "../../assets/images/DPDP.png";
import cloud from "../../assets/images/cloud.png";
import dataProtect from "../../assets/images/dataProtect.png";


function SideContent() {
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 770);

  const checkScreenSize = () => {
    setIsMobile(window.innerWidth < 770);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleText = () => {
    if (isMobile) setIsTextVisible(!isTextVisible);
  };
    return (
        <>
            <div className='welcomeLabelLogin mt-3 mt-md-0'>
                {/* Welcome to India's First<br></br> Digital PF check up */}
                India’s First AI based Provident<br></br>Fund (PF) Check up
            </div>
            {(!isMobile  &&
                <div className='EpfText mt-4 mb-3'>
                {/* Please login using your EPF UAN and<br></br> Password to begin the check up */}
                Login with your EPF UAN and Password​
            </div>
            )}
            
            
            <div className="d-flex justify-content-center mt-2 mt-md-0">
                <span className='securityText py-2 px-3 d-flex align-items-center' 
                onClick={toggleText} style={{cursor: "pointer"}}>
                    <img src={dataProtect} alt="Risk Assessment" className='dataImage me-1' />
                    {/* We have implemented 5 tier security to keep your data protected */}
                    Your privacy is our priority. We take data security seriously
                    </span>
            </div>
            {(isTextVisible || !isMobile) && (
                <div className="d-flex justify-content-center mt-3">
                <div className='d-flex flex-column  align-items-center text-center'>
                    <img src={multiFactor} alt="Risk Assessment" className='iconImage ' />
                    <span className="iconText">
                        {/* Multi Factor Authentication */}
                        Two-Factor Auth​
                    </span>
                </div>
                <div className='d-flex flex-column align-items-center text-center mx-5'>
                    <img src={Encryption} alt="Risk Assessment" className='iconImage' />
                    <span className="iconText">
                        {/* End to End Encryption */}
                        End-to-End Encryption​
                    </span>
                </div>
                <div className='d-flex flex-column align-items-center text-center'>
                    <img src={IPData} alt="Risk Assessment" className='iconImage' />
                    <span className="iconText">
                        Masking of PI data
                    </span>
                </div>
                {/* <div className='d-flex flex-column align-items-center text-center'>
                    <img src={DPDP} alt="Risk Assessment" className='iconImage' />
                    <span className="iconText">Adherence to DPDP Act 2024</span>
                </div> */}
                {/* <div className='d-flex flex-column align-items-center text-center'>
                    <img src={cloud} alt="Risk Assessment" className='iconImage' />
                    <span className="iconText">Highly Secure cloud infrastructure</span>
                </div> */}

            </div>
            )}
        </>
    );
}

export default SideContent;