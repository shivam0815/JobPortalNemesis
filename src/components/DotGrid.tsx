export default function DotGrid({
  className = "",
  opacity = 0.22,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.2" fill="white" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#dots)" />
    </svg>
  );
}
