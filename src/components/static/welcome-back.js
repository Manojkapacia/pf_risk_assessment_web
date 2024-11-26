import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';

const WelcomeBack = () => {
    return(
        <div className="container-fluid">
            <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-4 offset-lg-2 offset-md-1 mt-2 mt-md-0">
                    <img src={pfRiskImage} alt="Risk Assessment" className='pfRiskLoginImage' />
                </div>
                <div className="col-lg-6 col-md-7 ">
                    <div className='row'>
                        <div className='col-md-8 offset-md-1'>
                            <span className='welcomeLabel'>Welcome Back!</span><br></br>
                            <span className='labelText'>Choose an option to continue</span>
                        </div>
                        <div className='col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-4'>
                            <button className='w-100 border-0 mb-3 py-1 welcomeButton'>Resume from where you left</button>
                            <button className='w-100 border-0 py-1 welcomeButton'>Take a fresh assessment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeBack;