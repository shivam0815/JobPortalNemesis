const card =
  "rounded-3xl border border-white/10 bg-white/6 shadow-card p-6 md:p-7";

export default function Terms() {
  return (
    <main className="container-x py-10 space-y-6">
      {/* Header */}
      <section className={card}>
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Terms & Conditions – Nemesis Group
        </h1>
        <p className="text-white/70 mt-2">
          These Terms & Conditions govern the access to and use of all services,
          platforms, websites, job portals, training programs, and HR services
          provided by Nemesis Group.
        </p>
        <p className="text-white/60 mt-1 text-sm">
          Last Updated: 02/01/2026
        </p>
      </section>

      {/* Content */}
      <section className={card}>
        <div className="space-y-6 text-sm text-white/80 leading-relaxed">
          <div>
            <div className="font-extrabold text-white">
              1. About Nemesis Group
            </div>
            <p className="mt-1 text-white/75">
              Nemesis Group is a staffing and workforce solutions firm based in
              India, providing executive search, permanent recruitment,
              temporary staffing, payroll & compliance management, HR
              consulting, and job-oriented training programs.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">2. Applicability</div>
            <p className="mt-1 text-white/75">
              These Terms apply to website users, job applicants, trainees,
              associate employees, consultants, employers, clients, and
              business partners.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              3. Use of Website & Platforms
            </div>
            <p className="mt-1 text-white/75">
              Users must provide accurate and updated information. Fake
              profiles, impersonation, or misuse of data is strictly
              prohibited. Nemesis Group may suspend or terminate access without
              prior notice in case of violations.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              4. Recruitment & Staffing Services
            </div>
            <p className="mt-1 text-white/75">
              Registration does not guarantee job placement. Final hiring
              decisions rest solely with the client or employer. Nemesis Group
              acts only as a facilitator and is not responsible for employer
              decisions, salary changes, or job discontinuation.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              5. Training Programs
            </div>
            <p className="mt-1 text-white/75">
              Training programs are skill-development initiatives. Completion
              of training does not guarantee employment. Placement assistance,
              if any, depends on performance and eligibility. Nemesis Group may
              discontinue training for misconduct without refund.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              6. Fees, Payments & Refunds
            </div>
            <p className="mt-1 text-white/75">
              All fees are non-refundable and non-transferable unless stated
              otherwise in writing. Delayed or failed payments may result in
              suspension of services.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              7. Associate Employees & Consultants
            </div>
            <p className="mt-1 text-white/75">
              Engagement terms are governed by separate contracts or offer
              letters. Violations of company, client, or statutory policies
              may lead to disciplinary action or termination.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              8. Payroll & Compliance Services
            </div>
            <p className="mt-1 text-white/75">
              Payroll processing depends on accurate data provided by clients
              and associates. Nemesis Group is not responsible for errors
              arising from incorrect or delayed information.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              9. Intellectual Property
            </div>
            <p className="mt-1 text-white/75">
              All logos, content, training material, and documents are the
              intellectual property of Nemesis Group. Unauthorized use may
              result in legal action.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              10. Data Privacy & Confidentiality
            </div>
            <p className="mt-1 text-white/75">
              Personal data is handled as per our Privacy Policy. Any breach of
              confidentiality may result in legal consequences.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              11. Limitation of Liability
            </div>
            <p className="mt-1 text-white/75">
              Services are provided on an “as-is” basis. Nemesis Group is not
              liable for job loss, salary disputes, employer actions, or
              indirect or consequential damages.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              12. Governing Law & Jurisdiction
            </div>
            <p className="mt-1 text-white/75">
              These Terms are governed by the laws of India. All disputes shall
              be subject to Indian courts only.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              13. Contact Details
            </div>
            <p className="mt-1 text-white/75">
              For any queries related to these Terms, contact:
              <br />
              <span className="font-semibold text-white">
                Nemesis Group
              </span>
              <br />
              Email:{" "}
              <a
                href="mailto:flexicare@nemesisgroup.in"
                className="underline text-white"
              >
                flexicare@nemesisgroup.in
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
