import { UserPlus, Building2, BadgeCheck } from "lucide-react";

export default function CompanyCard({
  company,
}: {
  company: { name: string; industry: string; location: string; verified?: boolean };
}) {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/12 p-5 hover:bg-white/7 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
            <Building2 size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="font-bold">{company.name}</div>
              {company.verified && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/10 border border-white/12">
                  <BadgeCheck size={14} /> Verified
                </span>
              )}
            </div>
            <div className="text-sm text-white/70 mt-0.5">
              {company.industry} • {company.location}
            </div>
          </div>
        </div>

        <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#061433] font-semibold text-sm hover:opacity-95 transition">
          <UserPlus size={16} /> Follow
        </button>
      </div>
    </div>
  );
}
