export default function ButtonLoader({ size = 4, colorClass = "bg-white" }) {
  // small three-dot loader
  return (
    <div className="flex items-center gap-1">
      <span
        className={`w-${size} h-${size} rounded-full ${colorClass} animate-pulse-dot inline-block`}
      />
      <span
        className={`w-${size} h-${size} rounded-full ${colorClass} animate-pulse-dot inline-block`}
        style={{ animationDelay: "0.12s" }}
      />
      <span
        className={`w-${size} h-${size} rounded-full ${colorClass} animate-pulse-dot inline-block`}
        style={{ animationDelay: "0.24s" }}
      />
    </div>
  );
}
