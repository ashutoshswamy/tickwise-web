"use client";
import { Heatmap } from "@ashutoshswamy/smoui";
import { DAYS, hourRange } from "@/lib/time";

// Client wrapper: the tooltip text is a function, and functions cannot cross from a server page.
export function WeekHeat({ data }: { data: number[] }) {
  return (
    <Heatmap
      data={data}
      rows={7}
      cell={16}
      gap={3}
      label="Impressions by weekday and hour"
      describe={(v, i) => `${DAYS[i % 7]} ${hourRange(Math.floor(i / 7))}: ${v} impressions`}
    />
  );
}
