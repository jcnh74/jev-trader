"use client";

import { useEffect, useRef, useState } from "react";
import type { BlockEvent } from "@/lib/types";
import { fmtInt, fmtPrice, shortTx, txUrl } from "@/lib/format";
import styles from "./Feed.module.css";

const ROW_H = 28;
const MAX_ROWS = 40;

type Kind = "buy" | "sell" | "late";

function kindOf(event: BlockEvent): Kind {
  const d = event.decision;
  if (!d || d.late) return "late";
  if (d.action === "buy") return "buy";
  if (d.action === "sell") return "sell";
  return "late";
}

function fmtSize(size: number): string {
  return size.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

const KIND_CLASS: Record<Kind, string> = {
  buy: styles.kindBuy,
  sell: styles.kindSell,
  late: styles.kindLate,
};

const WORD: Record<Kind, string> = { buy: "BUY", sell: "SELL", late: "LATE" };

export default function Feed({ events }: { events: BlockEvent[] }) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [capacity, setCapacity] = useState(MAX_ROWS);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const measure = () => {
      const fits = Math.max(1, Math.min(MAX_ROWS, Math.floor(el.clientHeight / ROW_H)));
      setCapacity((prev) => (prev === fits ? prev : fits));
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = events.slice(-capacity).reverse();

  return (
    <section className={styles.feed}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>TRADE TAPE</span>
      </div>
      <div className={styles.list} ref={listRef}>
        {rows.length === 0 ? (
          <div className={styles.empty}>No blocks yet</div>
        ) : (
          rows.map((event, i) => {
            const kind = kindOf(event);
            const decision = event.decision;
            const quote = event.quote;
            const fill = event.fill;
            const decided = kind !== "late";
            const kindClass = KIND_CLASS[kind];

            const conf =
              !decided || !decision
                ? ""
                : Math.max(
                    decision.probabilities.buy,
                    decision.probabilities.sell,
                    decision.probabilities.hold,
                  ).toFixed(2);

            const lat = !decided || !decision ? "" : `${decision.latencyMs}ms`;

            let detail = "";
            let detailMuted = false;
            if (fill && fill.size > 0) {
              detail = `FILL ${fmtSize(fill.size)} @ ${fmtPrice(fill.price)}`;
            } else if (decided && quote) {
              const word = quote.side === "buy" ? "bid" : "ask";
              detail = `${word} ${fmtSize(quote.size)} @ ${fmtPrice(quote.price)}${quote.capped ? " cap" : ""}`;
              detailMuted = quote.status === "reverted" || quote.status === "lost";
            } else if (decided) {
              detail = "no quote";
              detailMuted = true;
            }

            const rowClass = [
              styles.row,
              kindClass,
              i === 0 ? styles.newest : "",
              fill ? styles.filled : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div key={event.block} className={rowClass}>
                <span className={`${styles.cell} ${styles.block}`}>{fmtInt(event.block)}</span>
                <span className={`${styles.cell} ${styles.word}`}>{WORD[kind]}</span>
                <span className={`${styles.cell} ${styles.conf}`}>{conf}</span>
                <span className={`${styles.cell} ${styles.lat}`}>{lat}</span>
                <span className={`${styles.cell} ${styles.detail}${detailMuted ? ` ${styles.muted}` : ""}`}>
                  {detail}
                </span>
                <span className={`${styles.cell} ${styles.tx}`}>
                  {fill && !fill.simulated && fill.txHash ? (
                    <a href={txUrl(fill.txHash)} target="_blank" rel="noreferrer" title="Taker's transaction">
                      {shortTx(fill.txHash)}
                    </a>
                  ) : quote && quote.status === "sim" ? (
                    <span className={styles.muted}>sim</span>
                  ) : quote && quote.txHash ? (
                    <a
                      className={
                        quote.status === "sent"
                          ? styles.pending
                          : quote.status === "placed"
                            ? undefined
                            : styles.muted
                      }
                      title={quote.status}
                      href={txUrl(quote.txHash)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {quote.status === "reverted" ? "rev" : quote.status === "lost" ? "lost" : shortTx(quote.txHash)}
                    </a>
                  ) : null}
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
