import React from "react";

/**
 * FullScreenLoader
 * props:
 *  - show: boolean
 *  - text: string
 *  - colorClass: tailwind background for bars (ex: 'bg-cyan-400')
 */
export default function FullScreenLoader({
  show = false,
  text = "Loading...",
  colorClass = "bg-cyan-400",
}) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-6">
        {/* logo or app name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-black rounded-full bg-white/90">
            {/* replace with <img/> if you have logo */}
            VP
          </div>
          <div className="text-xl font-semibold text-white">VuongFlix</div>
        </div>

        {/* animated bars */}
        <div className="relative w-[280px] h-6 bg-white/6 rounded-full overflow-hidden">
          {/* three sliding bars at different speeds for depth */}
          <div
            className={`absolute left-0 top-0 h-full w-1/2 rounded-full ${colorClass} opacity-80 animate-slide-bar`}
            style={{ animationDuration: "1.1s" }}
          />
          <div
            className={`absolute left-0 top-0 h-full w-1/3 rounded-full ${colorClass} opacity-60 animate-slide-bar`}
            style={{ animationDuration: "1.55s" }}
          />
          <div
            className={`absolute left-0 top-0 h-full w-2/5 rounded-full ${colorClass} opacity-40 animate-slide-bar`}
            style={{ animationDuration: "2s" }}
          />
        </div>

        <div className="flex items-center gap-3 text-sm text-white/90">
          <div className="w-3 h-3 rounded-full bg-white/90 animate-pulse-dot" />
          <div>{text}</div>
        </div>
      </div>
    </div>
  );
}
