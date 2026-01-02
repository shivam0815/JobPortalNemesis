import { Building2, MapPin, ShieldCheck, Users } from "lucide-react";

const stats = [
  { k: "All India Coverage", v: "Pan India", icon: MapPin },
  { k: "HR Services", v: "8+ Services", icon: ShieldCheck },
  { k: "Employers", v: "Verified", icon: Building2 },
  { k: "Candidates", v: "Fast Apply", icon: Users },
];

export default function StatPills() {
  return (
    <section className="grid md:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.k}
            className="rounded-3xl border border-white/15 bg-home/85 shadow-card p-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-white/15 border border-white/20 grid place-items-center">
                <Icon size={18} className="text-white" />
              </div>

              <div>
                <div className="text-sm text-white/80">{s.k}</div>
                <div className="text-xl font-extrabold text-white">
                  {s.v}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
