const card = "rounded-3xl border border-white/10 bg-white/6 shadow-card p-6 md:p-7";

export default function PrivacyPolicy() {
  return (
    <main className="container-x py-10">
      <section className={card}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Privacy Policy</h1>
        <p className="text-white/70 mt-2">
          This policy explains how Nemesis Group collects and uses information on the platform.
        </p>
      </section>

      <section className={"mt-6 " + card}>
        <div className="space-y-5 text-sm text-white/80 leading-relaxed">
          <div>
            <div className="font-extrabold text-white">1. Information We Collect</div>
            <div className="mt-1 text-white/75">
              Candidate profile data, resumes, contact details, job applications; employer company data and job posts.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">2. How We Use Data</div>
            <div className="mt-1 text-white/75">
              To provide job matching, recruitment workflows, account management, and platform notifications.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">3. Sharing</div>
            <div className="mt-1 text-white/75">
              Candidate data may be shared with employers only for hiring purposes. We do not sell personal data.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">4. Security</div>
            <div className="mt-1 text-white/75">
              We use reasonable security practices to protect data. However, no method is 100% secure.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">5. Cookies</div>
            <div className="mt-1 text-white/75">
              Cookies may be used to improve user experience and basic session management.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-white">6. User Control</div>
            <div className="mt-1 text-white/75">
              Users can update profile information. For deletion requests, contact us at flexicare@nemesisgroup.in.
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
