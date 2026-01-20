import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Auth from "./pages/Auth";
import PayrollServices from "./pages/services/Payroll";
import EmployerDashboard from "./pages/EmployerDashboard";
import ITStaffing from "./pages/services/ItStaffing";
import Recruitment from "./pages/services/Recruitment";
import StaffingSolutions from "./pages/services/StaffingSolutions";
import ForgotPassword from "./pages/ForgotPassword";
import CandidateShell from "./components/CandidateShell";
import CandidateHome from "./pages/candidate/CandidateHome";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateApplications from "./pages/candidate/CandidateApplications";
import About from "./pages/About";
import Services from "./pages/Services";
import Nemesis from "./pages/Nemesis";


import ServiceDetail from "./pages/services/ServiceDetail";
import HRConsulting from "./pages/services/HRConsulting";
import TrainingDevelopment from "./pages/services/TrainingDevelopment";
import ContactUs from "./pages/ContactUs";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CustomerTraining from "./pages/services/CustomerCareTraining";

/* ✅ Admin (new) */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import HrPage from "./pages/services/HrPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import ProtectedRoute from "./lib/ProtectedRoute";
import CandidateDashboard from "./pages/CandidateDashboard";
import AdminContactMessages from "./pages/admin/AdminContactMessages";
import EmailLogin from "./pages/auth/EmailLogin";
import EmailRegister from "./pages/auth/EmailRegister";
import EmailVerifyOtp from "./pages/auth/EmailVerifyOtp";
import EmailSetPassword from "./pages/auth/EmailSetPassword";


export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B4FA8] to-[#083B7E]">
      <Routes>
        {/* ✅ Admin routes OUTSIDE Navbar/Footer (clean admin UI) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/employees" element={<AdminEmployees />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
                             <Route path="/admin/contact-messages" element={<AdminContactMessages />} />

          </Route>
        </Route>

        {/* ✅ Public site routes WITH Navbar/Footer */}
        <Route
          path="*"
          element={
            <>
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
<Route path="/auth/login" element={<EmailLogin />} />
<Route path="/auth/register" element={<EmailRegister />} />
<Route path="/auth/verify-otp" element={<EmailVerifyOtp />} />
<Route path="/auth/set-password" element={<EmailSetPassword />} />

                {/* Candidate (Nested) ✅ */}
               <Route path="/candidate" element={<CandidateShell />}>
  {/* ✅ PUBLIC */}
  <Route index element={<CandidateHome />} />

  {/* ✅ PROTECTED (candidate only) */}
  <Route element={<ProtectedRoute allow="candidate" />}>
    <Route path="profile" element={<CandidateProfile />} />
    <Route path="applications" element={<CandidateApplications />} />
    {/* ✅ If dashboard is a route, protect it too */}
    <Route path="dashboard" element={<CandidateDashboard />} />
  </Route>
</Route>


                {/* Employer */}
                <Route path="/employer" element={<EmployerDashboard />} />
                <Route path="/nemesis" element={<Nemesis />} />

                {/* Services */}
                <Route path="/services/payroll" element={<PayrollServices />} />
                <Route path="/services/it-staffing" element={<ITStaffing />} />
                <Route path="/services/recruitment" element={<Recruitment />} />
                <Route path="/services/staffing-solutions" element={<StaffingSolutions />} />
                <Route path="/services/customer-care-training" element={<CustomerTraining />} />
                <Route path="/services/training-development" element={<TrainingDevelopment />} />
                <Route path="/services/hr-consulting" element={<HRConsulting />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
<Route path="/services/hr-training" element={<HrPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/chat" element={<ChatRoomPage />} />
<Route path="/chat/:roomId" element={<ChatRoomPage />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}
