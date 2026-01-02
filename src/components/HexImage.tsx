export default function HexImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)",
      }}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div className="absolute inset-0 ring-4 ring-[#57C3E6]/60" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10" />
    </div>
  );
}
