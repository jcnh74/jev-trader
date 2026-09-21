"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeSwitcher.module.css";

const THEMES = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "bloomberg", label: "Terminal" },
  { id: "midnight", label: "Midnight" },
] as const;

type Theme = typeof THEMES[number]["id"];

const STORAGE_KEY = "jev-trader-theme";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.some((t) => t.id === stored)) return stored as Theme;
  } catch {
    // storage unavailable
  }
  return "dark";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage unavailable
  }
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  const handleChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) return <div className={styles.switcher} />;

  return (
    <div className={styles.switcher}>
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`${styles.option} ${theme === t.id ? styles.active : ""}`}
          onClick={() => handleChange(t.id)}
          aria-pressed={theme === t.id}
          aria-label={`Switch to ${t.label} theme`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
