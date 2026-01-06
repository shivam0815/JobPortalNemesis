import { Headset } from "lucide-react";

const companies = [
  "LIC Housing Finance",
  "PNB Housing Finance",
  "Bajaj Finance",
  "Bajaj Finserv",
  "Tata Capital",
  "American Express",
  "Urban Company",
  "Frankfinn Aviation Services",
  "Axis Max Life Insurance",
  "Vertex Global Services",
  "EaseMyTrip.com",
  "SirionLabs",
  "Oberoi Hotels & Resorts",
  "FabHotels",
  "Jet Airways",
  "Chegg",
  "OLX Group",
  "Amazon Fresh",
  "BigBasket",
    "CRED",
    "Blue Dart Express",
    "Zomato",
"Swiggy",
];

export default function CustomerCareCompaniesStrip() {
  // duplicate list for smooth infinite loop
  const items = [...companies, ...companies];

  return (
    <section className="mt-6">
      {/* HEADING */}
      <h3 className="text-white font-extrabold text-lg mb-3">
          <span className="text-[#EAF2FF]">Customer Care</span>
      </h3>

      <div className="cc-viewport">
        <div className="cc-track">
          {items.map((name, i) => (
            <div className="cc-pill" key={`${name}-${i}`}>
              <Headset size={16} className="cc-ic" />
              <span className="cc-name">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .cc-viewport{
          overflow:hidden;
          width:100%;
          position:relative;
        }

        /* fade edges */
        .cc-viewport::before,
        .cc-viewport::after{
          content:"";
          position:absolute;
          top:0; bottom:0;
          width:56px;
          z-index:2;
          pointer-events:none;
        }
        .cc-viewport::before{
          left:0;
          background:linear-gradient(to right, rgba(31,79,143,1), rgba(31,79,143,0));
        }
        .cc-viewport::after{
          right:0;
          background:linear-gradient(to left, rgba(31,79,143,1), rgba(31,79,143,0));
        }

        .cc-track{
          display:flex;
          gap:16px;
          width:max-content;
          white-space:nowrap;
          will-change:transform;
          animation: ccMarqueeLTR 30s linear infinite;

        }

        /* pause on hover */
        .cc-viewport:hover .cc-track{
          animation-play-state: paused;
        }

        .cc-pill{
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

        .cc-ic{
          color:rgba(255,255,255,0.85);
        }

        .cc-name{
          white-space:nowrap;
        }

        /* RIGHT → LEFT */
        @keyframes ccMarqueeLTR{
  0%{
    transform: translateX(-50%);
  }
  100%{
    transform: translateX(0);
  }
}


        @media (prefers-reduced-motion: reduce){
          .cc-track{ animation:none; }
        }
      `}</style>
    </section>
  );
}
