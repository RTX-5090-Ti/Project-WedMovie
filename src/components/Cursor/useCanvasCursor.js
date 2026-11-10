import { useEffect } from "react";

export default function useCanvasCursor(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;

    const settings = { friction: 0.5, trails: 20, size: 50, dampening: 0.25, tension: 0.98 };
    const position = { x: 0, y: 0 };
    let lines = [];
    let frameId = null;
    let focused = document.hasFocus();
    let disposed = false;

    function createLines() {
      lines = Array.from({ length: settings.trails }, (_, index) => ({
        spring: 0.4 + (index / settings.trails) * 0.025 + 0.1 * Math.random() - 0.02,
        friction: settings.friction + 0.01 * Math.random() - 0.002,
        nodes: Array.from({ length: settings.size }, () => ({ ...position, vx: 0, vy: 0 })),
      }));
    }

    function updateLine(line) {
      let spring = line.spring;
      const head = line.nodes[0];
      head.vx += (position.x - head.x) * spring;
      head.vy += (position.y - head.y) * spring;
      line.nodes.forEach((node, index) => {
        if (index > 0) {
          const previous = line.nodes[index - 1];
          node.vx += (previous.x - node.x) * spring + previous.vx * settings.dampening;
          node.vy += (previous.y - node.y) * spring + previous.vy * settings.dampening;
        }
        node.vx *= line.friction;
        node.vy *= line.friction;
        node.x += node.vx;
        node.y += node.vy;
        spring *= settings.tension;
      });
    }

    function drawLine(line) {
      const nodes = line.nodes;
      context.beginPath();
      context.moveTo(nodes[0].x, nodes[0].y);
      for (let index = 1; index < nodes.length - 2; index++) {
        const current = nodes[index];
        const next = nodes[index + 1];
        context.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
      }
      const previous = nodes[nodes.length - 2];
      const last = nodes[nodes.length - 1];
      context.quadraticCurveTo(previous.x, previous.y, last.x, last.y);
      context.stroke();
      context.closePath();
    }

    function render() {
      frameId = null;
      if (disposed || !focused || !lines.length) return;
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = "rgba(255, 255, 255, 0.5)";
      context.lineWidth = 1;
      lines.forEach((line) => { updateLine(line); drawLine(line); });
      frameId = window.requestAnimationFrame(render);
    }
    function start() {
      if (!disposed && focused && lines.length && frameId === null) frameId = window.requestAnimationFrame(render);
    }
    function stop() {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
    }
    function move(event) {
      const pointer = event.touches?.[0] || event;
      if (typeof pointer.clientX !== "number") return;
      position.x = pointer.clientX;
      position.y = pointer.clientY;
      if (!lines.length) createLines();
      start();
    }
    function resize() { canvas.width = Math.max(1, window.innerWidth - 20); canvas.height = window.innerHeight; }
    function focus() { focused = true; start(); }
    function blur() { focused = false; stop(); }

    document.addEventListener("mousemove", move);
    document.addEventListener("touchstart", move, { passive: true });
    document.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    window.addEventListener("focus", focus);
    window.addEventListener("blur", blur);
    resize();
    return () => {
      disposed = true;
      stop();
      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchstart", move);
      document.removeEventListener("touchmove", move);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      window.removeEventListener("focus", focus);
      window.removeEventListener("blur", blur);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [canvasRef]);
}
