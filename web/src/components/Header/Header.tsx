"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlockEvent, ConnectionState, Meta } from "@/lib/types";
import { fmtInt, shortAddr } from "@/lib/format";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import styles from "./Header.module.css";

export interface HeaderProps {
  meta: Meta | null;
  latest: BlockEvent | null;
  connection: ConnectionState;
}

const OFFLINE_LABEL: Partial<Record<ConnectionState, string>> = {
  connecting: "connecting",
  reconnecting: "reconnecting",
};

export default function Header({ meta, latest, connection }: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const wallet = meta?.wallet ?? null;

  const onCopy = useCallback(() => {
    if (!wallet) return;
    try {
      void navigator.clipboard?.writeText(wallet)?.catch(() => {});
    } catch {
      /* clipboard unavailable, still flash "copied" so the click feels alive */
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1200);
  }, [wallet]);

  const model = meta?.model ?? null;
  const isJev = (model ?? "").toLowerCase().startsWith("jev");
  const offline = OFFLINE_LABEL[connection] ?? null;
  const isLive = connection === "live";

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.brand}>
          <span className={styles.brandIcon}>‖</span>
          <span className={styles.brandText}>JEV TRADER</span>
        </span>

        <div className={styles.status}>
          <span className={`${styles.dot} ${isLive ? styles.live : ""}`} />
          <span className={styles.statusText}>
            {offline || "live"}
          </span>
        </div>
      </div>

      <div className={styles.center}>
        <span className={styles.block}>
          <span className={styles.blockLabel}>BLOCK</span>
          <span className={styles.blockNumber}>
            {latest ? fmtInt(latest.block) : "–"}
          </span>
        </span>
      </div>

      <div className={styles.right}>
        <ThemeSwitcher />

        <button
          type="button"
          className={styles.wallet}
          onClick={onCopy}
          disabled={!wallet}
          title={wallet ?? "no wallet, dry run"}
          aria-label={wallet ? `Copy wallet address ${wallet}` : "Dry run"}
        >
          {copied ? "COPIED" : wallet ? shortAddr(wallet) : "DRY RUN"}
        </button>

        {model ? (
          <span
            className={`${styles.badge} ${isJev ? styles.badgeJev : styles.badgeStandin}`}
          >
            {model}
          </span>
        ) : null}
      </div>
    </header>
  );
}
