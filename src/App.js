import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/auth/login';
import OtpComponent from './components/auth/otp-verification';
import ServiceHistory from './components/services-history/service-history';
import SelectOrganization from './components/services-history/select-organization';
import Logo from './components/common/logo';
import DocumentScanning from './components/scanning/document-scanning';
import CreateAccount from './components/create-account/create-account';
import OtpCreateAccount from './components/create-account/otp-create-account'
import AuthGuard from "./components/guards/auth-guard";
import GuestGuard from "./components/guards/guest-guard";

function App() {
  return (
    <Router>
      <Logo />
      <Routes>
        <Route path="/" element={<GuestGuard><LoginComponent /></GuestGuard>} />
        <Route path="/otpAssessment" element={<GuestGuard><OtpComponent /></GuestGuard>} />
        <Route path="/doc-scan" element={<AuthGuard><DocumentScanning /></AuthGuard>} />
        <Route path="/service-history" element={<AuthGuard><ServiceHistory /></AuthGuard>} />
        <Route path="/select-organization" element={<AuthGuard><SelectOrganization /></AuthGuard>} />
        <Route path="/create-account" element={<AuthGuard><CreateAccount /></AuthGuard>} />
        <Route path="/create-account-otp" element={<AuthGuard><OtpCreateAccount /></AuthGuard>} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
    
  );
}

export default App;
