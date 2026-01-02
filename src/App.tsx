import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Auth from "./pages/Auth";

import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import CandidateShell from "./components/CandidateShell";
import CandidateHome from "./pages/candidate/CandidateHome";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateApplications from "./pages/candidate/CandidateApplications";
import About from "./pages/About";
import Services from "./pages/Services";

import ServiceDetail from "./pages/services/ServiceDetail";
import HRConsulting from "./pages/services/HRConsulting"; 
import TrainingDevelopment from "./pages/services/TrainingDevelopment";
// ✅ file name same rakho
import ContactUs from "./pages/ContactUs";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CustomerTraining from "./pages/services/CustomerCareTraining";
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B4FA8] to-[#083B7E]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/auth" element={<Auth />} />
<Route path="/contact" element={<ContactUs />} />
<Route path="/terms" element={<Terms />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
<Route path="/services/training-development" element={<TrainingDevelopment />} />
        {/* Candidate (Nested) ✅ */}
        <Route path="/candidate" element={<CandidateShell />}>
          <Route index element={<CandidateHome />} />
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="applications" element={<CandidateApplications />} />
        </Route>

        {/* Employer + Admin */}
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
<Route path="/services/customer-care-training" element={<CustomerTraining />} />
        {/* Services */}
        <Route path="/services/:slug" element={<ServiceDetail />} />

        {/* Optional: Dedicated HR Consulting page (if you want custom design) */}
        <Route path="/services/hr-consulting" element={<HRConsulting />} />
      </Routes>

      <Footer />
    </div>
  );
}
