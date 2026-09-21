"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number | string;
  className?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedNumber({
  value,
  className,
  decimals = 0,
  prefix = "",
  suffix = "",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const prev = prevValueRef.current;
    if (prev === value) return;

    const numericPrev = typeof prev === "number" ? prev : 0;
    const numericValue = typeof value === "number" ? value : 0;
    const duration = 400;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }
      
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = numericPrev + (numericValue - numericPrev) * eased;
      setDisplayValue(typeof value === "number" ? current : value);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = value;
        startTimeRef.current = undefined;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value]);

  const formatted =
    typeof displayValue === "number"
      ? displayValue.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : displayValue;

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
