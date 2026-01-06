// src/components/TopCompaniesStrip.tsx
import { Building2 } from "lucide-react";

const companies = [
  "Airtel",
  "Muthoot Finance",
  "L&T Finance ",
  "MSME Shakti",
   "Purple Finance",
  "HDFC",
  "Axis Bank",
  "Kotak",
  "Utkarsh Bank",
  "SBI",
  "SBI Card",
  "SBI Life",
  "ICICI Prudential",
  "Exide Life",
  "Bank of America",
  "Alankrit"
];

export default function TopCompaniesStrip() {
  // ✅ same list twice for seamless loop
  const items = [...companies, ...companies];

  return (
    <section className="mt-6">
      <h3 className="text-white font-extrabold text-lg mb-3">Top Hiring Companies</h3>

      <div className="tc-viewport">
        <div className="tc-track" aria-label="Top hiring companies marquee">
          {items.map((name, i) => (
            <div className="tc-pill" key={`${name}-${i}`}>
              <Building2 size={16} className="tc-ic" />
              <span className="tc-name">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ DIRECT animation CSS inside component (no tailwind config needed) */}
      <style>{`
        .tc-viewport{
          overflow:hidden;
          width:100%;
          position:relative;
        }

        /* premium edge fade */
        .tc-viewport:before,
        .tc-viewport:after{
          content:"";
          position:absolute;
          top:0; bottom:0;
          width:56px;
          z-index:2;
          pointer-events:none;
        }
        .tc-viewport:before{
          left:0;
          background:linear-gradient(to right, rgba(31,79,143,1), rgba(31,79,143,0));
        }
        .tc-viewport:after{
          right:0;
          background:linear-gradient(to left, rgba(31,79,143,1), rgba(31,79,143,0));
        }

        .tc-track{
          display:flex;
          gap:16px;
          width:max-content;
          white-space:nowrap;
          will-change:transform;
          animation: tcMarquee 30s linear infinite;
        }

        /* pause on hover */
        .tc-viewport:hover .tc-track{
          animation-play-state: paused;
        }

        .tc-pill{
          flex:0 0 auto;
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:12px 18px;
          border-radius:999px;
          background:rgba(255,255,255,0.10);
          border:1px solid rgba(255,255,255,0.20);
          color:#fff;
          font-weight:700;
          font-size:14px;
          backdrop-filter: blur(10px);
        }

        .tc-ic{
          color:rgba(255,255,255,0.80);
        }

        .tc-name{
          white-space:nowrap;
        }

        /* ✅ move exactly half because we duplicated items */
        @keyframes tcMarquee{
          0%{ transform: translateX(0); }
          100%{ transform: translateX(-50%); }
        }

        /* respect reduced motion */
        @media (prefers-reduced-motion: reduce){
          .tc-track{ animation:none; }
        }
      `}</style>
    </section>
  );
}
