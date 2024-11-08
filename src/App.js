import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/auth/login';
import OtpComponent from './components/auth/login-otp';
import SearchComponent from './components/common/search';

function App() {
  const MESSAGES = {
  searchHeading : "Searching For Your Documents",
  seachSubHeading : "Check if your PF is at risk of getting stuck"
}
  return (

    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/otpAssessment" element={<OtpComponent />} />
        <Route path="/search" element={<SearchComponent MESSAGES={MESSAGES}/>} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
