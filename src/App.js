import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/auth/login';
import OtpComponent from './components/auth/otp-verification';
import SearchComponent from './components/common/search';
import Logo from './components/common/logo';

function App() {
  return (
    <Router>
      <Logo />
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/otpAssessment" element={<OtpComponent />} />
        <Route path="/search" element={<SearchComponent />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
