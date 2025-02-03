import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/auth/login';
import OtpComponent from './components/auth/otp-verification';
import ServiceHistory from './components/services-history/service-history';
import SelectOrganization from './components/services-history/select-organization';
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
import KycDetailsBank from './components/kyc/kyc-details-stubs';
import ReportRegistation from './components/report/report-registation';
import ReportOtp from './components/report/report-otp';
import ReportSubmit from "./components/report/report-submit"
import PageNotFound from './components/static/page-not-found'
import Layout from './components/common/layout';
import AccountSummary from './components/report/summary';
import TotalSummary from './components/summary/total-summary';
import AccountDetails from './components/summary/account-details';
import FundDetails from './components/summary/fund-details';
import ScrollToTop from "./components/common/ScrollToTop";
import UserMobileRegistation from './components/summary/user-mobile-registation';

function App() {
  return (
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<GuestGuard><LoginComponent /></GuestGuard>} />
            <Route path="/otpAssessment" element={<GuestGuard><OtpComponent /></GuestGuard>} />
            <Route path="/doc-scan" element={<AuthGuard><DocumentScanning /></AuthGuard>} />
            <Route path="/service-history" element={<ServiceHistory />} />
            <Route path="/select-organization" element={<SelectOrganization />} />
            <Route path="/create-account" element={<AuthGuard><CreateAccount /></AuthGuard>} />
            <Route path="/create-account-otp" element={<AuthGuard><OtpCreateAccount /></AuthGuard>} />
            <Route path="/activate-uan" element={<GuestGuard><ActivateUan /></GuestGuard>} />
            <Route path="/donot-know-uan" element={<GuestGuard><DonotKnowUan /></GuestGuard>} />
            <Route path="/epfo-down" element={<EpfoDown />} />
            <Route path="/forgot-password" element={<GuestGuard><ForgotPassword /></GuestGuard>} />
            <Route path="/operation/login" element={<AdminGuestGuard><AdminLogin /></AdminGuestGuard>} />
            <Route path="/operation/view-details" element={<AuthGuardAdmin><ViewDetailsByUan /></AuthGuardAdmin>} />
            <Route path="/kyc-details" element={<AuthGuard><KycDetails /></AuthGuard>} />
            <Route path="/kyc-details/bank" element={<AuthGuard><KycDetailsBank /></AuthGuard>} />
            <Route path="/report-registation" element={<AuthGuard><ReportRegistation /></AuthGuard>} />
            <Route path="/report-otp" element={<AuthGuard><ReportOtp /></AuthGuard>} />
            <Route path="/report-submit" element={<AuthGuard><ReportSubmit /></AuthGuard>} />
            <Route path="/account-summary" element={<AuthGuard><AccountSummary /></AuthGuard>} />
            <Route path='/full-summary' element={<AuthGuard><TotalSummary /></AuthGuard>} />
            <Route path='/account-details' element={<AuthGuard><AccountDetails /></AuthGuard>} />
            <Route path='/fund-details' element={<AuthGuard><FundDetails /></AuthGuard>} />
            <Route path='/user-registation' element={<UserMobileRegistation/>} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Layout>
      </Router>
  );
}





export default App;
