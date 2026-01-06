// src/components/BackofficeDeliveryWarehouseStrip.tsx
import { Package } from "lucide-react";

const companies = [
  "Zomato",
  "Swiggy",
  "Swiggy Instamart",
  "Blinkit",
  "EatSure",
  "Domino's",
  "Porter",
  "Dunzo",
  "Shadowfax",
  "Zepto",
  "Amazon Fresh",
  "BigBasket",
  "CRED",
  "Blue Dart Express",
];

export default function BackofficeDeliveryWarehouseStrip() {
  const items = [...companies, ...companies];

  return (
    <section className="mt-6">
      <h3 className="text-white font-extrabold text-lg mb-3">
        <span className="text-[#EAF2FF]">Backoffice • Delivery • Warehouse</span>
      </h3>

      <div className="bw-viewport">
        <div className="bw-track" aria-label="Backoffice, delivery and warehouse hiring marquee">
          {items.map((name, i) => (
            <div className="bw-pill" key={`${name}-${i}`}>
              <Package size={16} className="bw-ic" />
              <span className="bw-name">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .bw-viewport{
          overflow:hidden;
          width:100%;
          position:relative;
        }

        /* fade edges */
        .bw-viewport::before,
        .bw-viewport::after{
          content:"";
          position:absolute;
          top:0; bottom:0;
          width:56px;
          z-index:2;
          pointer-events:none;
        }
        .bw-viewport::before{
          left:0;
          background:linear-gradient(to right, rgba(31,79,143,1), rgba(31,79,143,0));
        }
        .bw-viewport::after{
          right:0;
          background:linear-gradient(to left, rgba(31,79,143,1), rgba(31,79,143,0));
        }

        .bw-track{
          display:flex;
          gap:16px;
          width:max-content;
          white-space:nowrap;
          will-change:transform;
          /* ✅ DIFFERENT ANIMATION: faster + slight "wave" feel */
          animation: bwMarquee 30s linear infinite;
        }

        .bw-viewport:hover .bw-track{
          animation-play-state: paused;
        }

        .bw-pill{
          flex:0 0 auto;
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:12px 18px;
          border-radius:999px;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.18);
          color:#fff;
          font-weight:800;
          font-size:14px;
          backdrop-filter: blur(10px);
          transform: translateY(0);
        }

        .bw-ic{ color:rgba(255,255,255,0.85); }
        .bw-name{ white-space:nowrap; }

        /* ✅ DIFFERENT: left → right + micro vertical drift */
        @keyframes bwMarquee{
          0%   { transform: translateX(-50%) translateY(0px); }
          50%  { transform: translateX(-25%) translateY(-2px); }
          100% { transform: translateX(0%) translateY(0px); }
        }

        @media (prefers-reduced-motion: reduce){
          .bw-track{ animation:none; }
        }
      `}</style>
    </section>
  );
}
