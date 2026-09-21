"use client";

import type { BlockEvent } from "@/lib/types";
import AnimatedNumber from "@/components/AnimatedNumber/AnimatedNumber";
import styles from "./EquityBar.module.css";

const BANKROLL_USD = 500;

export interface EquityBarProps {
  latest: BlockEvent | null;
}

export default function EquityBar({ latest }: EquityBarProps) {
  const totals = latest?.totals ?? null;
  const pnlUsd = totals?.pnlUsd ?? 0;
  const pnlPct = totals?.pnlPct ?? 0;
  const equity = BANKROLL_USD + pnlUsd;

  const isPositive = pnlUsd >= 0;
  const pnlClass = isPositive ? styles.positive : styles.negative;
  const sign = isPositive ? "+" : "";

  return (
    <div className={styles.bar}>
      <div className={styles.section}>
        <span className={styles.label}>BANKROLL</span>
        <span className={styles.bankroll}>
          ${BANKROLL_USD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <div className={styles.arrow}>→</div>

      <div className={styles.section}>
        <span className={styles.label}>EQUITY</span>
        <AnimatedNumber
          value={equity}
          decimals={2}
          prefix="$"
          className={styles.equity}
        />
      </div>

      <div className={styles.divider} />

      <div className={`${styles.section} ${styles.pnlSection}`}>
        <span className={styles.label}>GAIN/LOSS VS $500 START</span>
        <div className={styles.pnl}>
          <AnimatedNumber
            value={pnlUsd}
            decimals={2}
            prefix={sign + "$"}
            className={`${styles.pnlUsd} ${pnlClass}`}
          />
          <AnimatedNumber
            value={pnlPct}
            decimals={2}
            prefix={`(${sign}`}
            suffix="%)"
            className={`${styles.pnlPct} ${pnlClass}`}
          />
        </div>
      </div>
    </div>
  );
}
