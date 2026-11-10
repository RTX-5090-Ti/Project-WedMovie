import { useRef } from "react";
import useCanvasCursor from "./useCanvasCursor";

export default function CanvasCursor() {
  const canvasRef = useRef(null);
  useCanvasCursor(canvasRef);
  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 pointer-events-none" />;
}
