"use client";
import { useState } from "react";
import { JellySlider, NumberStepper } from "@ashutoshswamy/smoui";

// Assumptions are printed under the figure, so the number is an estimate and says so.
const CPM = 4;            // advertiser CPM in USD
const IMP_PER_HOUR = 80;  // one billable impression per 45s of agent time
const SHARE = 0.7;
const DAYS = 22;
const MIN = 1, MAX = 10;

export function Estimator() {
  const [hours, setHours] = useState(3);
  const impressions = hours * IMP_PER_HOUR * DAYS;
  const spend = (impressions * CPM) / 1000;
  const month = spend * SHARE;

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="panel p-7 md:p-10">
        <p className="display text-[clamp(3.75rem,10vw,7.5rem)] text-serial" aria-live="polite">
          ${month.toFixed(2)}
          <span className="ml-3 font-sans text-xl font-semibold tracking-normal text-muted">per month</span>
        </p>

        <div className="mt-10 max-w-xl">
          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-semibold">Agent time per day</span>
            <NumberStepper key={hours} defaultValue={hours} min={MIN} max={MAX} onChange={setHours} />
          </div>
          <div className="mt-5">
            <JellySlider label="Hours of agent time per day" value={hours} onChange={setHours} min={MIN} max={MAX} step={1} format={(v) => `${v}h`} />
          </div>
          <div className="num mt-2 flex justify-between text-xs text-muted" aria-hidden><span>{MIN}h</span><span>{MAX}h</span></div>
        </div>
      </div>

      <div className="cover" style={{ ["--c" as string]: "var(--pine)", ["--fg" as string]: "#f3f5ef" }}>
        <div className="cover-flap" />
        <dl className="num grid flex-1 content-center gap-5 p-7 text-sm">
          <div className="flex justify-between"><dt className="opacity-70">Impressions</dt><dd className="font-semibold">{impressions.toLocaleString()}</dd></div>
          <div className="flex justify-between"><dt className="opacity-70">Advertisers pay</dt><dd className="font-semibold">${spend.toFixed(2)}</dd></div>
          <div className="flex items-baseline justify-between"><dt className="opacity-70">Your 70%</dt><dd className="text-3xl font-semibold text-sun">${month.toFixed(2)}</dd></div>
          <p className="font-sans text-xs opacity-70">{hours} hours a day, {DAYS} working days, $4 CPM, one impression per 45 seconds of agent time.</p>
        </dl>
        <div className="striker" />
      </div>
    </div>
  );
}
