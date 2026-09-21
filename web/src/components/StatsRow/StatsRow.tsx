"use client";

import { useEffect, useState } from "react";
import type { BlockEvent, Meta } from "@/lib/types";
import { fmtInt, uptime } from "@/lib/format";
import styles from "./StatsRow.module.css";

const DASH = "–";

export default function StatsRow({
  latest,
  avgLatencyMs,
  meta,
}: {
  latest: BlockEvent | null;
  avgLatencyMs: number;
  meta: Meta | null;
}) {
  const startedAt = meta?.startedAt ?? null;
  const [up, setUp] = useState<string | null>(null);

  useEffect(() => {
    if (startedAt == null) {
      setUp(null);
      return;
    }
    const tick = () => setUp(uptime(startedAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const decision = latest?.decision ?? null;
  const last = decision && !decision.late ? `${decision.latencyMs}` : DASH;
  const avg = Number.isFinite(avgLatencyMs) && avgLatencyMs > 0 ? `${Math.round(avgLatencyMs)}` : DASH;
  const totals = latest?.totals ?? null;

  return (
    <div className={styles.stats}>
      <div className={styles.metric}>
        <span className={styles.label}>LAST</span>
        <span className={styles.value}>{last}<span className={styles.unit}>ms</span></span>
      </div>

      <div className={styles.metric}>
        <span className={styles.label}>AVG</span>
        <span className={styles.value}>{avg}<span className={styles.unit}>ms</span></span>
      </div>

      <div className={styles.metric}>
        <span className={styles.label}>CALLS</span>
        <span className={styles.value}>{totals ? fmtInt(totals.decisions) : DASH}</span>
      </div>

      <div className={styles.metric}>
        <span className={styles.label}>FILLS</span>
        <span className={styles.value}>{totals ? fmtInt(totals.fills) : DASH}</span>
      </div>

      <div className={styles.spacer} />

      <div className={styles.metric}>
        <span className={styles.label}>UPTIME</span>
        <span className={styles.value}>{up ?? "00:00:00"}</span>
      </div>
    </div>
  );
}
