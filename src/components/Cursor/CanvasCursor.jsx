import React from "react";
import useCanvasCursor from "./useCanvasCursor";

const CanvasCursor = () => {
  useCanvasCursor();
  return <canvas className="fixed inset-0 pointer-events-none" id="canvas" />;
};
export default CanvasCursor;
