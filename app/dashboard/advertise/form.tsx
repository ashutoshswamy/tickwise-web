"use client";
import { useState } from "react";
import { AmountInput, Counter, FloatingInput, JellySlider, RadioCards } from "@ashutoshswamy/smoui";
import { createCampaign } from "../actions";

const MAX = 48;

export default function CampaignForm() {
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [where, setWhere] = useState<"terminal" | "extension" | "both">("both");
  const [cpm, setCpm] = useState(4);
  const [budget, setBudget] = useState(50);
  const est = cpm > 0 ? Math.floor((budget / cpm) * 1000) : 0;
  const ok = text.trim().length > 0 && link.trim().length > 0 && budget >= 5 && cpm >= 2;

  return (
    <form action={createCampaign} className="grid gap-6">
      {/* Live preview: the line on a matchbook cover, as developers will see it. */}
      <div className="cover" style={{ ["--c" as string]: "var(--sun)", ["--fg" as string]: "var(--ink)" }} aria-label="Ad preview">
        <div className="cover-flap" />
        <div className="px-5 py-5">
          <p className="num text-[11px] font-semibold tracking-[0.14em] opacity-70">AD</p>
          <p className="display mt-3 min-h-[3.6rem] text-[1.6rem]">{text || "Your line shows up here"}</p>
        </div>
        <div className="striker !h-8" />
      </div>

      <RadioCards
        label="Where to show it"
        columns={1}
        value={where}
        onChange={(v) => setWhere(v as typeof where)}
        options={[
          { value: "terminal", label: "Terminal", description: "Claude Code in a terminal. The link is Cmd/Ctrl+clickable." },
          { value: "extension", label: "VS Code extension", description: "Claude Code chat panel in VS Code. Text only, the panel cannot open links." },
          { value: "both", label: "Both", description: "Most reach." },
        ]}
      />
      <input type="hidden" name="placement" value={where} />

      {/* Where it really shows: Claude Code's spinner line. */}
      <div className="grid gap-2 text-xs" aria-label="Where your ad appears">
        {where !== "extension" && (
          <>
            <p className="font-semibold">In the terminal, while Claude is thinking{link.trim() ? ". Cmd/Ctrl+click opens your link" : ""}</p>
            <p className="num overflow-x-auto whitespace-nowrap rounded-lg bg-ink px-3 py-2 font-mono text-[#e8e8e0]">
              <span className="text-sun">✻</span> <span className={link.trim() ? "underline decoration-sun underline-offset-2" : ""}>Ad: {text || "Your line shows up here"}</span>… <span className="opacity-50">(12s)</span>
            </p>
          </>
        )}
        {where !== "terminal" && (
          <>
            <p className="font-semibold">In the VS Code extension chat panel</p>
            <p className="num overflow-x-auto whitespace-nowrap rounded-lg bg-ink px-3 py-2 font-mono text-[#e8e8e0]">
              <span className="text-sun">✻</span> Ad: {text || "Your line shows up here"}… <span className="opacity-50">(12s)</span>
            </p>
          </>
        )}
      </div>

      <FloatingInput label="Ad text" name="text" required maxLength={MAX} value={text} onChange={(e) => setText(e.target.value)} hint={`${text.length}/${MAX}. Plain text only, no links in the text.`} />
      <FloatingInput label="Link" name="link" required inputMode="url" autoComplete="off" maxLength={300} value={link} onChange={(e) => setLink(e.target.value)} hint="Developers Cmd/Ctrl+click it in the terminal spinner. Every click is counted, with UTM tags added." />

      <div className="field">
        <span className="text-sm font-semibold">CPM</span>
        <JellySlider label="CPM in US dollars" value={cpm} onChange={setCpm} min={2} max={20} step={0.5} format={(v) => `$${v.toFixed(2)}`} />
        <small>Per 1,000 impressions. Higher CPM shows first.</small>
        <input type="hidden" name="cpm" value={cpm} />
      </div>

      <div className="field">
        <span className="text-sm font-semibold">Budget</span>
        <AmountInput label="Budget in US dollars" currency="USD" value={budget} onChange={setBudget} quick={[25, 50, 100]} />
        <small className="num">Minimum $5. About <Counter to={est} duration={0.5} tabular={false} /> impressions.</small>
        <input type="hidden" name="budget" value={budget} />
      </div>

      <button className="btn w-full" disabled={!ok}>Pay and launch</button>
    </form>
  );
}
