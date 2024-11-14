import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/auth/login';
import OtpComponent from './components/auth/otp-verification';
import SearchComponent from './components/common/search';
// import ServiceHistory from './components/services-history/service-history';
// import SelectOrganization from './components/services-history/select-organization';
import Logo from './components/common/logo';
import DocumentScanning from './components/scanning/document-scanning';
// import CreateAccount from './components/create-account/create-account';
// import OtpCreateAccount from './components/create-account/otp-create-account'

function App() {
  return (
    // <div>
    //   <Logo></Logo>
    //   <CreateAccount></CreateAccount>
    //   <OtpCreateAccount></OtpCreateAccount>
    // </div>
    <Router>
      <Logo />
      {/* <serviceHistory></serviceHistory> */}
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/otpAssessment" element={<OtpComponent />} />
        <Route path="/search" element={<SearchComponent />} />
        <Route path="/doc-scan" element={<DocumentScanning />} />
        <Route path="/service-history" element={<ServiceHistory />} />
        <Route path="/select-organization" element={<SelectOrganization />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
    
  );
}

export default App;
