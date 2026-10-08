'use client';

import { useRef, useEffect } from "react";

export type AgentState = "idle" | "listening" | "thinking" | "speaking";
// getFrequencies is accepted for compatibility but intentionally unused: the motion follows the state, not the voice.
type Props = { state: AgentState; getFrequencies?: () => Uint8Array | null; complexity?: number };

// Five petals, evenly spread around the centre (72° apart) with small natural differences,
// so nothing is left empty. Bends alternate to keep the hand-folded feel.
const SLOT = (Math.PI * 2) / 5;
const PETALS = [
  { angle: -Math.PI / 2 + SLOT * 0 + .03, length: 1.04, width: .40, bend: -.14 },
  { angle: -Math.PI / 2 + SLOT * 1 - .04, length: .98, width: .42, bend: .12 },
  { angle: -Math.PI / 2 + SLOT * 2 + .05, length: 1.08, width: .38, bend: -.16 },
  { angle: -Math.PI / 2 + SLOT * 3 - .03, length: .94, width: .41, bend: .13 },
  { angle: -Math.PI / 2 + SLOT * 4 + .02, length: 1.00, width: .39, bend: -.10 },
];

// Colour blobs that drift inside every petal: [colour, how far along the petal they roam (from, to), size, speed]
const BLOBS = [
  { c: "tip", lo: .50, hi: 1.00, r: .95, s: .31 },
  { c: "tip", lo: .55, hi: 1.05, r: .70, s: .47 },
  { c: "fold", lo: .20, hi: .75, r: .90, s: .38 },
  { c: "fold", lo: .10, hi: .90, r: .70, s: .55 },
  { c: "light", lo: .00, hi: .45, r: .85, s: .27 },
] as const;

// amp: how far the flower breathes (+ grows, - shrinks) · hz: breaths per second · spin: radians per second
// flow: how fast the colour drifts inside the petals
const MODES = {
  idle: { amp: .05, hz: .16, spin: 0, flow: .35 },
  listening: { amp: .12, hz: .24, spin: 0, flow: .70 },
  speaking: { amp: .18, hz: .34, spin: 0, flow: 1.0 },
  thinking: { amp: -.17, hz: .36, spin: .60, flow: 1.5 },
} as const;

const TAU = Math.PI * 2;
const Q = .5; // painted at half resolution then blurred once: smooth, and cheap
const follow = (cur: number, target: number, dt: number, rate: number) => cur + (target - cur) * (1 - Math.exp(-dt * rate));

export function FlowerVisualizer({ state, complexity = .5 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  const cxRef = useRef(complexity);
  stateRef.current = state;
  cxRef.current = complexity;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const css = getComputedStyle(canvas);
    const pick = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
    // any CSS colour (oklch included) -> [r,g,b], so blobs can fade out without a dark halo
    const probe = document.createElement("canvas"); probe.width = probe.height = 1;
    const pctx = probe.getContext("2d", { willReadFrequently: true })!;
    const rgb = (color: string): [number, number, number] => {
      pctx.clearRect(0, 0, 1, 1); pctx.fillStyle = color; pctx.fillRect(0, 0, 1, 1);
      const d = pctx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]];
    };
    const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const P = {
      tip: rgb(pick('--petal-tip', 'oklch(0.5693 0.0673 288.22)')),
      fold: rgb(pick('--petal-fold', 'oklch(0.7387 0.0644 318.34)')),
      blush: rgb(pick('--petal-blush', 'oklch(0.83 0.065 21)')),
      light: rgb(pick('--petal-light', 'oklch(0.91 0.10 80)')),
    };
   const mk = () => document.createElement("canvas");
    const layerA = mk(), layerB = mk();
    const a = layerA.getContext("2d")!, b = layerB.getContext("2d")!;
    const canFilter = "filter" in ctx;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0, previous = 0, t = 0, phase = 0, spin = 0, flow = 0, dpr = 1;
    const m = { amp: .05, hz: .16, spin: 0, flow: .35 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      layerA.width = layerB.width = Math.ceil(canvas.clientWidth * Q);
      layerA.height = layerB.height = Math.ceil(canvas.clientHeight * Q);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = previous ? Math.min((now - previous) / 1000, .05) : .016;
      previous = now;
      const calm = reduced.matches ? .45 : 1; // reduced motion: slower, never frozen
      const k = .6 + cxRef.current * .8;      // "complexity" scales how far it breathes

      // ease into the state's character (about half a second), so switching never jumps
      const mode = MODES[stateRef.current] ?? MODES.idle;
      for (const key of Object.keys(mode) as (keyof typeof mode)[]) m[key] = follow(m[key], mode[key], dt, 1.6);
      t += dt * calm;
      phase += dt * m.hz * TAU * calm;
      spin += dt * m.spin * calm;
      flow += dt * m.flow * calm;

      const w = canvas.clientWidth, h = canvas.clientHeight;
      const size = Math.min(w, h) * .32;
      const place = (c: CanvasRenderingContext2D) => {
        c.setTransform(Q, 0, 0, Q, 0, 0);
        c.clearRect(0, 0, w, h);
        c.save();
        c.translate(w * .5, h * .5);
        c.rotate(-.11 + Math.sin(t * .065) * .035 + spin);
      };
      place(a); place(b);

      PETALS.forEach((p, i) => {
        // a breath is 0 -> 1 -> 0; each petal trails its neighbour, so the flower unfolds rather than inflates
        const breath = .5 - .5 * Math.cos(phase - i * .5);
        const grow = 1 + m.amp * k * breath;
        const wp = t * .16 + i * 1.6;
        const wilt = Math.sin(wp) * .08;
        const length = size * p.length * (1 + Math.cos(wp) * .03);
        const width = size * p.width;
        const bend = p.bend * size + wilt * size;
        const path = new Path2D();
        path.moveTo(-size * .09, 0);
        path.bezierCurveTo(length * .28, -width * .12, length * .43, -width + bend, length * .78, -width * .83 + bend);
        path.bezierCurveTo(length * 1.19, -width * .80 + bend, length * 1.20, width * .63 + bend, length * .78, width * .78 + bend);
        path.bezierCurveTo(length * .44, width * .82 + bend, length * .30, width * .12, -size * .09, 0);

        // the petal's own colour field: a soft blush ground with a gradient that keeps morphing across it
        a.save(); a.rotate(p.angle + wilt); a.scale(grow, grow); a.clip(path);
        const ground = a.createLinearGradient(0, 0, length, bend);
        ground.addColorStop(0, rgba(P.light, .9)); ground.addColorStop(.3, rgba(P.blush, .88)); ground.addColorStop(1, rgba(P.blush, .8));
        a.fillStyle = ground; a.fillRect(-size, -size * 1.5, size * 3, size * 3);
        BLOBS.forEach((bl, j) => {
          const u = .5 + .5 * Math.sin(flow * bl.s * 2.1 + i * 1.7 + j * 2.3);
          const x = length * (bl.lo + (bl.hi - bl.lo) * u);
          const y = bend * (x / length) + width * .5 * Math.sin(flow * bl.s * 2.9 + i * 2.9 + j * 1.3);
          const r = width * bl.r * (1 + .3 * Math.sin(flow * bl.s * 1.7 + i + j * 3));
          const g = a.createRadialGradient(x, y, 0, x, y, r), col = P[bl.c];
          g.addColorStop(0, rgba(col, .85)); g.addColorStop(.55, rgba(col, .45)); g.addColorStop(1, rgba(col, 0));
          a.fillStyle = g; a.fillRect(x - r, y - r, r * 2, r * 2);
        });
        a.restore();

        // a single soft crease carries the warmth into each petal
        b.save(); b.rotate(p.angle + wilt); b.scale(grow, grow); b.globalAlpha = .3;
        const crease = b.createLinearGradient(0, 0, length * .72, 0);
        crease.addColorStop(0, rgba(P.light, 1)); crease.addColorStop(.4, rgba(P.fold, 1)); crease.addColorStop(1, rgba(P.fold, 0));
        b.fillStyle = crease; b.beginPath(); b.moveTo(0, 0);
        b.bezierCurveTo(length * .2, -width * .22, length * .46, bend - width * .22, length * .82, bend);
        b.bezierCurveTo(length * .45, bend + width * .08, length * .15, width * .04, 0, 0);
        b.fill(); b.restore();
      });
      a.restore(); b.restore();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canFilter) ctx.filter = `blur(${Math.max(9, size * .05) * dpr}px)`;
      ctx.drawImage(layerA, 0, 0, canvas.width, canvas.height);
      if (canFilter) ctx.filter = `blur(${Math.max(7, size * .035) * dpr}px)`;
      ctx.drawImage(layerB, 0, 0, canvas.width, canvas.height);
      ctx.filter = "none";
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, []);
  
  return (
    <canvas
      ref={ref}
      className="w-full h-full block  "
      aria-label='Slowly breathing gradient flower'
    />
  );
}
