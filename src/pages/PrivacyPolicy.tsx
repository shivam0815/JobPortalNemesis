const card =
  "rounded-3xl border border-white/10 bg-white/6 shadow-card p-6 md:p-7";

export default function PrivacyPolicy() {
  return (
    <main className="container-x py-10 space-y-6">
      {/* Header */}
      <section className={card}>
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Privacy Policy – Nemesis Group
        </h1>
        <p className="text-white/70 mt-2">
          This Privacy Policy explains how Nemesis Group collects, uses, stores,
          discloses, and protects personal information across its platforms and
          services.
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
              1. Scope of This Policy
            </div>
            <p className="mt-1 text-white/75">
              This Privacy Policy applies to website visitors, job applicants,
              candidates, trainees, associate employees, consultants, clients,
              business partners, and users of Nemesis Group’s recruitment,
              staffing, payroll, compliance, and training services.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              2. Information We Collect
            </div>
            <p className="mt-1 text-white/75">
              We may collect personal information including name, contact
              details, educational qualifications, employment history,
              resume/CV data, identity and KYC documents (where legally
              required), bank details for payroll or fee processing, training
              records, assessment results, and professional recruitment data.
            </p>
            <p className="mt-2 text-white/75">
              We also collect technical information such as IP address, browser
              type, device information, usage data, cookies, and encrypted
              login credentials.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              3. Purpose of Information Collection
            </div>
            <p className="mt-1 text-white/75">
              Personal information is collected and used for recruitment and
              staffing services, workforce placement, training program delivery,
              payroll processing, statutory compliance, candidate verification,
              client service delivery, communication, legal compliance, and
              improvement of our platforms and services.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">4. Consent</div>
            <p className="mt-1 text-white/75">
              By submitting personal information to Nemesis Group through any
              medium, you provide explicit consent for its collection,
              processing, storage, and use for legitimate business purposes.
              Consent may be withdrawn subject to legal and contractual
              obligations.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              5. Information Sharing & Disclosure
            </div>
            <p className="mt-1 text-white/75">
              Nemesis Group does not sell or rent personal data. Information may
              be shared with clients for hiring purposes, government or
              statutory authorities when required by law, payroll and
              background verification partners, technology service providers,
              and internal teams on a need-to-know basis. All third parties are
              bound by confidentiality obligations.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              6. Data Security Measures
            </div>
            <p className="mt-1 text-white/75">
              We implement reasonable technical, administrative, and
              organizational safeguards including secure servers, encrypted
              databases, access controls, and periodic security reviews.
              However, no system is completely secure.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">7. Data Retention</div>
            <p className="mt-1 text-white/75">
              Personal data is retained only as long as necessary to fulfill
              service obligations, comply with legal and regulatory
              requirements, or for legitimate business purposes. Data is
              securely deleted or anonymized once no longer required.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              8. Cookies & Tracking Technologies
            </div>
            <p className="mt-1 text-white/75">
              Cookies may be used to improve user experience, analyze traffic,
              and enhance platform performance. Users may disable cookies
              through browser settings, though some features may be affected.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">9. Rights of Users</div>
            <p className="mt-1 text-white/75">
              Users have the right to access, correct, update, or request
              deletion of personal data (subject to applicable laws), withdraw
              consent, and raise concerns regarding misuse of information.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              10. Training & Fresher Programs Data
            </div>
            <p className="mt-1 text-white/75">
              Information collected from trainees is used strictly for training,
              evaluation, certification, and placement assistance. Performance
              data may be shared with potential employers only with consent.
              Completion of training does not guarantee employment.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              11. Third-Party Links
            </div>
            <p className="mt-1 text-white/75">
              Our platforms may contain links to third-party websites. Nemesis
              Group is not responsible for their privacy practices or content.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">12. Policy Updates</div>
            <p className="mt-1 text-white/75">
              Nemesis Group may update this Privacy Policy at any time.
              Continued use of services constitutes acceptance of the revised
              policy.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white">
              13. Contact Information
            </div>
            <p className="mt-1 text-white/75">
              For any questions or requests regarding this Privacy Policy,
              please contact:
              <br />
              <span className="font-semibold text-white">Nemesis Group</span>
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

          <div className="border-t border-white/10 pt-4 text-white/70">
            <span className="font-semibold text-white">
              Commitment Statement
            </span>
            <br />
            At Nemesis Group, trust, transparency, and integrity are the
            foundation of everything we do. We are committed to safeguarding
            personal information while delivering ethical, compliant, and
            value-driven staffing and training solutions across India.
          </div>
        </div>
      </section>
    </main>
  );
}
