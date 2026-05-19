import { use } from "react";

import { sleep } from "../../../_components/delay";

export interface Stats {
  label: string;
  value: string;
}

const HOME_STATS: Stats[] = [
  { label: "Visits today", value: "1,284" },
  { label: "Sign-ups", value: "37" },
  { label: "Error rate", value: "0.4%" },
];

const SETTINGS_STATS: Stats[] = [
  { label: "Theme", value: "system" },
  { label: "Email digest", value: "weekly" },
  { label: "Beta features", value: "off" },
];

const promises = new Map<string, Promise<Stats[]>>();

function loadStats(key: "home" | "settings", fail: boolean): Promise<Stats[]> {
  const cacheKey = `${key}:${fail ? "fail" : "ok"}`;
  let p = promises.get(cacheKey);
  if (!p) {
    p = sleep(600).then(() => {
      if (fail) {
        throw new Error(`Boom — failed to load ${key} analytics.`);
      }
      return key === "home" ? HOME_STATS : SETTINGS_STATS;
    });
    promises.set(cacheKey, p);
  }
  return p;
}

export function useStats(key: "home" | "settings", fail: boolean): Stats[] {
  return use(loadStats(key, fail));
}
