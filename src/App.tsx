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

import ServiceDetail from "./pages/services/ServiceDetail";
import HRConsulting from "./pages/services/HRConsulting"; // ✅ file name same rakho
import ContactUs from "./pages/ContactUs";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";

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

        {/* Candidate (Nested) ✅ */}
        <Route path="/candidate" element={<CandidateShell />}>
          <Route index element={<CandidateHome />} />
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="applications" element={<CandidateApplications />} />
        </Route>

        {/* Employer + Admin */}
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Services */}
        <Route path="/services/:slug" element={<ServiceDetail />} />

        {/* Optional: Dedicated HR Consulting page (if you want custom design) */}
        <Route path="/services/hr-consulting" element={<HRConsulting />} />
      </Routes>

      <Footer />
    </div>
  );
}
