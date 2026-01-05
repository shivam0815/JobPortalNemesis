import { Mail } from "lucide-react";

export default function ForgotPassword() {
  return (
    <main className="container-x py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-white/12 bg-white/5 shadow-card p-6">
        <h1 className="text-2xl font-extrabold">Forgot Password</h1>
        <p className="text-white/75 mt-1 text-sm">
          We will send a reset link / OTP to your email.
        </p>

        <div className="mt-5 relative">
          <Mail className="absolute left-4 top-3.5 text-white/70" size={18} />
          <input
            className="h-12 w-full rounded-2xl bg-white/8 border border-white/12 pl-11 pr-4 text-sm outline-none"
            placeholder="Registered Email"
          />
        </div>

        <button className="mt-4 h-12 w-full rounded-full bg-white text-[#061433] font-extrabold">
          Send Reset Link
        </button>
      </div>
    </main>
  );
}
