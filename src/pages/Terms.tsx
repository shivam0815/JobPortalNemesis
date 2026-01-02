const card = "rounded-3xl border border-white/10 bg-white/6 shadow-card p-6 md:p-7";

export default function Terms() {
  return (
    <main className="container-x py-10">
      <section className={card}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Terms & Conditions</h1>
        <p className="text-white/70 mt-2">
          These Terms govern the use of Nemesis Group Job Portal & HR Services website.
        </p>
      </section>

      <section className={"mt-6 " + card}>
        <div className="space-y-5 text-sm text-white/80 leading-relaxed">
          <div>
            <div className="font-extrabold text-white">1. Platform Use</div>
            <div className="mt-1 text-white/75">
              Users must provide accurate information while creating accounts, applying for jobs, or posting jobs.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">2. Candidate Responsibilities</div>
            <div className="mt-1 text-white/75">
              Candidates are responsible for the correctness of their profile, resume, and application details.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">3. Employer Responsibilities</div>
            <div className="mt-1 text-white/75">
              Employers must post genuine job requirements and use candidate data only for hiring purposes.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">4. Prohibited Content</div>
            <div className="mt-1 text-white/75">
              No false postings, misleading claims, illegal activities, or misuse of user information.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">5. Interview / Placement Disclaimer</div>
            <div className="mt-1 text-white/75">
              Interviews/placement assistance depend on eligibility, employer requirements, and internal policies.
              Nemesis Group does not guarantee job placement for every user.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">6. Account Suspension</div>
            <div className="mt-1 text-white/75">
              We may suspend or restrict accounts for policy violations or suspicious activity.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">7. Updates</div>
            <div className="mt-1 text-white/75">
              Terms may be updated. Continued use of the platform means acceptance of updated terms.
            </div>
          </div>

          <div className="text-white/60">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </section>
    </main>
  );
}
