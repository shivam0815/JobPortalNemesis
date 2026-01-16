import { Globe, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-white/10 bg-white/5">
      <div className="container-x py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="text-lg font-extrabold tracking-wide">Nemesis Group</div>
            <p className="mt-2 text-sm text-white/75 max-w-sm">
              Job Portal & HR Services platform providing recruitment, payroll, compliance,
              staffing, and training solutions across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-sm font-semibold text-white mb-3">Quick Links</div>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <Link to="/jobs" className="hover:text-white transition">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/candidate" className="hover:text-white transition">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link to="/employer" className="hover:text-white transition">
                  Employer / HR Portal
                </Link>
              </li>
              <li>
                <Link to="/services/hr-consulting" className="hover:text-white transition">
                  HR Services
                </Link>
              </li>
              <li>
  <Link to="/nemesis" className="hover:text-white transition">
    Nemesis
  </Link>
</li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-sm font-semibold text-white mb-3">Contact</div>
            <div className="space-y-2 text-sm text-white/75">
             
              <div className="flex items-center gap-2">
                <Mail size={16} />
                flexicare@nemesisgroup.in
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} />
                www.nemesisgroup.in
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link
                to="/contact"
                className="px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition text-white/85"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-white/65">
          <div>© {new Date().getFullYear()} Nemesis Group. All rights reserved.</div>

          <div className="flex flex-wrap gap-4">
            <Link to="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
