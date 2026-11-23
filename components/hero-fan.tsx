"use client";
import { useEffect, useState } from "react";

// $4 CPM x 70% developer share = $0.0028 per impression (real arithmetic, shown as an example).
const PER = 0.0028;

const COVERS = [
  { line: "Foldwise turns your README into docs", bg: "var(--sun)", fg: "var(--ink)" },
  { line: "Tidebase: Postgres that branches like git", bg: "var(--pine)", fg: "var(--sun)" },
  { line: "Plumbline catches errors before users do", bg: "#ffffff", fg: "var(--ink)" },
];
// slot 0 faces front, slot 1 leans right, slot 2 leans left
const SLOT = [
  "translate(-50%, 34px) rotate(-3deg)",
  "translate(-8%, 0px) rotate(9deg)",
  "translate(-92%, 12px) rotate(-11deg)",
];

// A fan of three matchbook covers. Every few seconds the next one comes to the front, like an impression being counted.
export default function HeroFan() {
  const [front, setFront] = useState(0);
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => { setFront((f) => (f + 1) % 3); setCount((c) => c + 1); }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[34rem]" role="img" aria-label="Example: three sponsor lines on matchbook covers. Each impression is worth $0.0028 to the developer.">
      <div className="relative h-[27rem]" aria-hidden>
        {COVERS.map((c, i) => {
          const slot = (i - front + 3) % 3;
          return (
            <div
              key={c.line}
              className="fan-cover cover"
              style={{ ["--c" as string]: c.bg, ["--fg" as string]: c.fg, transform: SLOT[slot], zIndex: 3 - slot, filter: slot === 0 ? "none" : "brightness(0.96)" }}
            >
              <div className="cover-flap" />
              <div className="flex min-h-[15.5rem] flex-col justify-between gap-6 px-5 pb-5 pt-5">
                <p className="num text-[11px] font-semibold tracking-[0.14em] opacity-70">AD</p>
                <p className="display text-[1.7rem]">{c.line}</p>
                <p className="num text-sm font-semibold opacity-80">+${PER.toFixed(4)} to you</p>
              </div>
              <div className="striker" />
            </div>
          );
        })}
      </div>
      <p className="num -mt-1 text-center text-sm font-semibold" aria-live="off">
        {count} impressions, ${(count * PER).toFixed(4)} earned
      </p>
    </div>
  );
}
