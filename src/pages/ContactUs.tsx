import { Mail, Phone, Globe, MapPin } from "lucide-react";

const card = "rounded-3xl border border-white/10 bg-white/6 shadow-card p-6 md:p-7";

const inputBase =
  "h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
const textareaBase =
  "min-h-[120px] w-full rounded-2xl bg-white border border-white/20 px-4 py-3 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";

export default function ContactUs() {
  return (
    <main className="container-x py-10">
      <div className={card}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Contact Us</h1>
        <p className="text-white/70 mt-2 max-w-3xl">
          For HR services, recruitment, training programs, or job portal support — contact Nemesis Group.
        </p>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <section className={card}>
          <h2 className="text-xl font-extrabold">Send a Message</h2>
          <p className="text-white/70 text-sm mt-1">This is UI only (backend integration later).</p>

          <div className="mt-5 grid gap-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input className={inputBase} placeholder="Full Name" />
              <input className={inputBase} placeholder="Mobile Number" />
            </div>
            <input className={inputBase} placeholder="Email Address" />
            <input className={inputBase} placeholder="Subject" />
            <textarea className={textareaBase} placeholder="Write your message..." />
            <button className="h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition">
              Submit (UI)
            </button>
          </div>
        </section>

        {/* Contact details */}
        <section className={card}>
          <h2 className="text-xl font-extrabold">Reach Us</h2>
          <p className="text-white/70 text-sm mt-1">All Over India • Remote + On-site (as needed)</p>

          <div className="mt-5 grid gap-3">
            <div className="rounded-3xl bg-white/6 border border-white/10 p-4 flex items-start gap-3">
              <Phone size={18} className="mt-0.5" />
              <div>
                <div className="font-semibold">Phone</div>
                <div className="text-sm text-white/75">02269718673</div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/6 border border-white/10 p-4 flex items-start gap-3">
              <Mail size={18} className="mt-0.5" />
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-white/75">flexicare@nemesisgroup.in</div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/6 border border-white/10 p-4 flex items-start gap-3">
              <Globe size={18} className="mt-0.5" />
              <div>
                <div className="font-semibold">Website</div>
                <div className="text-sm text-white/75">www.nemesisgroup.in</div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/6 border border-white/10 p-4 flex items-start gap-3">
              <MapPin size={18} className="mt-0.5" />
              <div>
                <div className="font-semibold">Service Area</div>
                <div className="text-sm text-white/75">All Over India</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-white/6 border border-white/10 p-5">
            <div className="font-extrabold">Support Note</div>
            <div className="text-sm text-white/75 mt-1">
              Candidates: use your dashboard for application status. Employers: post jobs via Employer portal.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
