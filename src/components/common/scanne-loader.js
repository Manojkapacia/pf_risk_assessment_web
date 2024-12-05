import React from 'react';
import '../../css/common/scanner-loader.css'; // Import the CSS for the loader

const ScannerLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="document-icon">
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
          <div className="line4"></div>
          <div className="line5"></div>
        </div>
      </div>
      <p>Verifying OTP and Fetching details</p>
    </div>
  );
};

export default ScannerLoader;