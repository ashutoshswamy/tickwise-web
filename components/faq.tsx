"use client";
import { Accordion } from "@ashutoshswamy/smoui";
import { items } from "@/lib/faq";


export function Faq() {
  return <Accordion type="single" defaultOpen={["0"]} items={items.map(({ q, a }, i) => ({ id: String(i), title: q, content: <p className="max-w-[60ch] text-muted">{a}</p> }))} />;
}
