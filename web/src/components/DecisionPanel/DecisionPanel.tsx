"use client";

import type { BlockEvent } from "@/lib/types";
import { fmtPct } from "@/lib/format";
import styles from "./DecisionPanel.module.css";

export interface DecisionPanelProps {
  latest: BlockEvent | null;
}

type Chosen = "buy" | "sell" | null;

interface BarRowProps {
  label: string;
  active: boolean;
  value: number;
  pct: string;
  side: "buy" | "sell";
}

function BarRow({ label, active, value, pct, side }: BarRowProps) {
  return (
    <div className={`${styles.row} ${active ? styles.active : ""}`}>
      <span className={styles.label}>{label}</span>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${side === "buy" ? styles.fillBuy : styles.fillSell}`}
          style={{
            width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          }}
        />
      </div>
      <span className={styles.pct}>{pct}</span>
    </div>
  );
}

export default function DecisionPanel({ latest }: DecisionPanelProps) {
  const decision = latest?.decision ?? null;
  const late = decision ? decision.late : true;
  const chosen: Chosen =
    decision && !decision.late && decision.action !== "hold" ? decision.action : null;

  const probs = decision?.probabilities ?? { buy: 0, sell: 0, hold: 0 };
  const decided = decision !== null && !late && chosen !== null;
  const pctOf = (p: number) => (decided ? fmtPct(p) : "–");

  const headline = chosen ? (chosen === "buy" ? "BUY" : "SELL") : "LATE";
  const headlineClass = chosen
    ? chosen === "buy"
      ? styles.headlineBuy
      : styles.headlineSell
    : styles.headlineLate;
  const headlinePct = chosen ? fmtPct(probs[chosen]) : "";

  return (
    <div className={styles.panel}>
      <section className={styles.section}>
        <div className={styles.sectionLabel}>STANDING ORDER</div>
        <div className={styles.order}>
          Post a bid or an ask on Kuru's MON/USDC book. Every block. No abstaining.
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>WHICH SIDE THIS BLOCK?</div>

        <div className={`${styles.headline} ${headlineClass}`} key={`${latest?.block}-${headline}`}>
          <span className={styles.headlineWord}>{headline}</span>
          {headlinePct ? <span className={styles.headlinePct}>{headlinePct}</span> : null}
        </div>

        <div className={styles.bars}>
          <BarRow label="BUY" active={chosen === "buy"} value={probs.buy} pct={pctOf(probs.buy)} side="buy" />
          <BarRow label="SELL" active={chosen === "sell"} value={probs.sell} pct={pctOf(probs.sell)} side="sell" />
        </div>
      </section>

      <section className={styles.blockStrip}>
        <div className={styles.stripLabel}>LAST 60 BLOCKS</div>
        <div className={styles.cells}>
          {/* The chart component will inject a 60-cell strip here or we render placeholder */}
          {Array.from({ length: 60 }, (_, i) => (
            <div key={i} className={styles.cell} />
          ))}
        </div>
      </section>
    </div>
  );
}
