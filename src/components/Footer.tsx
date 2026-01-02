import { Phone, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-white/10 bg-white/5">
      <div className="container-x py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="text-lg font-extrabold tracking-wide">
              Nemesis Group
            </div>
            <p className="mt-2 text-sm text-white/75 max-w-sm">
              Job Portal & HR Services platform providing recruitment,
              payroll, compliance, staffing, and training solutions
              across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-sm font-semibold text-white mb-3">
              Quick Links
            </div>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <a href="/jobs" className="hover:text-white transition">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="/candidate" className="hover:text-white transition">
                  Candidate Dashboard
                </a>
              </li>
              <li>
                <a href="/employer" className="hover:text-white transition">
                  Employer / HR Portal
                </a>
              </li>
              <li>
                <a href="/services/hr-consulting" className="hover:text-white transition">
                  HR Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-sm font-semibold text-white mb-3">
              Contact Us
            </div>
            <div className="space-y-2 text-sm text-white/75">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                +91-8808062698
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                flexicare@nemesisgroup.in
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} />
                www.nemesisgroup.in
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-white/65">
          <div>
            © {new Date().getFullYear()} Nemesis Group. All rights reserved.
          </div>
          <div>
            Serving Clients & Candidates All Over India
          </div>
        </div>
      </div>
    </footer>
  );
}
