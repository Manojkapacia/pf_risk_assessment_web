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
import ActivateUan from './components/static/activate-uan';
import DonotKnowUan from './components/static/donot-know-uan';
import EpfoDown from './components/static/epfo-down';
import ForgotPassword from './components/static/forgot-password';
import WelcomeBack from './components/static/welcome-back';
import ViewDetailsByUan from './admin/components/view-details-by-uan';
import AdminLogin from './admin/components/admin-login';
import AuthGuardAdmin from './components/guards/auth-guard-admin';
import AdminGuestGuard from './components/guards/guest-guard-admin';
import KycDetails from './components/kyc/kyc-details';
import ReportRegistation from './components/report/report-registation';
import ReportOtp from './components/report/report-otp';
import ReportSubmit from "./components/report/report-submit"
import PageNotFound from './components/static/page-not-found'
import Layout from './components/common/layout';

function App() {
  return (
    <div className='flex-grow-1 overflow-auto setBackGround'>
      <Router>
      {/* <Logo /> */}
      <Layout>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/otpAssessment" element={<OtpComponent />} />
        <Route path="/doc-scan" element={<AuthGuard><DocumentScanning /></AuthGuard>} />
        <Route path="/service-history" element={<AuthGuard><ServiceHistory /></AuthGuard>} />
        <Route path="/select-organization" element={<AuthGuard><SelectOrganization /></AuthGuard>} />
        <Route path="/create-account" element={<AuthGuard><CreateAccount /></AuthGuard>} />
        <Route path="/create-account-otp" element={<AuthGuard><OtpCreateAccount /></AuthGuard>} />
        <Route path="/activate-uan" element={<GuestGuard><ActivateUan /></GuestGuard>} />
        <Route path="/donot-know-uan" element={<GuestGuard><DonotKnowUan /></GuestGuard>} />
        <Route path="/epfo-down" element={<EpfoDown/>} />
        <Route path="/forgot-password" element={<GuestGuard><ForgotPassword /></GuestGuard>} />
        <Route path="/welcome-back" element={<AuthGuard><WelcomeBack /></AuthGuard>} />
        <Route path="/operation/login" element={<AdminGuestGuard><AdminLogin /></AdminGuestGuard>} />
        <Route path="/operation/view-details" element={<AuthGuardAdmin><ViewDetailsByUan /></AuthGuardAdmin>} />
        <Route path="/kyc-details" element={<AuthGuard><KycDetails/></AuthGuard>}/>
        <Route path="/report-registation" element={<AuthGuard><ReportRegistation/></AuthGuard>}/>
        <Route path="/report-otp" element={<AuthGuard><ReportOtp/></AuthGuard>}/>
        <Route path="/report-submit" element={<AuthGuard><ReportSubmit/></AuthGuard>}/>
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
      </Layout>
      
    </Router>
    </div>
  );
}

export default App;
