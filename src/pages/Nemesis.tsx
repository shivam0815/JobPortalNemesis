import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  Users,
  UserPlus,
  Settings,
} from "lucide-react";

export default function Nemesis() {
  return (
    <div className="container-x py-14">
      <h1 className="text-2xl font-extrabold mb-2">Nemesis Platform</h1>
      <p className="text-white/70 max-w-xl mb-8">
        Internal HR & administration modules under Nemesis Group.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Attendance */}
        <Link
          to="/nemesis/attendance"
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
          <ClipboardCheck className="mb-3" />
          <h3 className="font-semibold">Attendance</h3>
          <p className="text-sm text-white/70 mt-1">
            Employee attendance & shift tracking
          </p>
        </Link>

        {/* Lead Manager */}
        <Link
          to="/nemesis/lead-manager"
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
          <Users className="mb-3" />
          <h3 className="font-semibold">Lead Manager</h3>
          <p className="text-sm text-white/70 mt-1">
            Manage HR & sales leads
          </p>
        </Link>

        {/* HR Recruiter */}
        <Link
          to="/nemesis/hr-recruiter"
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
          <UserPlus className="mb-3" />
          <h3 className="font-semibold">HR Recruiter</h3>
          <p className="text-sm text-white/70 mt-1">
            Hiring & candidate pipeline
          </p>
        </Link>

        {/* Administration */}
        <Link
          to="/nemesis/administration"
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
          <Settings className="mb-3" />
          <h3 className="font-semibold">Administration</h3>
          <p className="text-sm text-white/70 mt-1">
            Roles, permissions & system control
          </p>
        </Link>
      </div>
    </div>
  );
}
