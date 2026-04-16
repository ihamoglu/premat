"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const SYMBOLS: Array<{
  symbol: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}> = [
  { symbol: "π",  x: 6,  y: 10, size: 200, opacity: 0.055, delay: 0,   duration: 7   },
  { symbol: "∑",  x: 80, y: 6,  size: 150, opacity: 0.045, delay: 0.9, duration: 8   },
  { symbol: "√",  x: 88, y: 52, size: 180, opacity: 0.05,  delay: 0.4, duration: 6   },
  { symbol: "∞",  x: 4,  y: 65, size: 130, opacity: 0.045, delay: 1.4, duration: 9   },
  { symbol: "∫",  x: 44, y: 4,  size: 110, opacity: 0.04,  delay: 1.8, duration: 7.5 },
  { symbol: "Δ",  x: 62, y: 86, size: 120, opacity: 0.04,  delay: 0.6, duration: 8.5 },
  { symbol: "θ",  x: 22, y: 80, size: 90,  opacity: 0.035, delay: 2.2, duration: 6.5 },
  { symbol: "≈",  x: 75, y: 78, size: 100, opacity: 0.04,  delay: 1.1, duration: 10  },
  { symbol: "∠",  x: 14, y: 36, size: 80,  opacity: 0.035, delay: 0.2, duration: 8   },
  { symbol: "±",  x: 55, y: 15, size: 70,  opacity: 0.03,  delay: 3,   duration: 7   },
];

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 100;
        }
        return current + 0.95;
      });
    }, 34);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 300);
    const t2 = setTimeout(() => setPhase("exit"), 3200);
    const t3 = setTimeout(() => onFinish?.(), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <>
      <style>{`
        /* ── CONTAINER ── */
        .ps {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 18% 28%, rgba(47, 110, 183, 0.38) 0%, transparent 48%),
            radial-gradient(ellipse at 82% 22%, rgba(234, 88, 12, 0.30) 0%, transparent 42%),
            radial-gradient(ellipse at 55% 85%, rgba(249, 115, 22, 0.18) 0%, transparent 36%),
            linear-gradient(148deg,
              #050e1c   0%,
              #091728  12%,
              #0f2d5c  38%,
              #1d4f91  58%,
              #2f6eb7  72%,
              #c44e14  88%,
              #ea580c 100%
            );
        }

        .ps--exit {
          animation: psExit 0.82s cubic-bezier(0.4, 0, 1, 1) forwards !important;
        }

        /* ── AMBIENT GLOW BEHIND CARD ── */
        .ps__ambient {
          position: absolute;
          left: 50%;
          top: 48%;
          transform: translate(-50%, -50%);
          width: 52rem;
          height: 52rem;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(29, 79, 145, 0.40) 0%, transparent 65%);
          pointer-events: none;
        }

        /* ── MATH SYMBOLS ── */
        .ps__sym {
          position: absolute;
          font-weight: 900;
          line-height: 1;
          pointer-events: none;
          user-select: none;
          font-size: var(--s);
          color: rgba(255, 255, 255, var(--o));
          animation: psFloat var(--d) ease-in-out var(--dl) infinite;
        }

        /* ── GLASS CARD ── */
        .ps__card {
          position: relative;
          z-index: 2;
          width: min(90vw, 28rem);
          padding: 2.8rem 2.2rem 2.2rem;
          border-radius: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(8, 22, 48, 0.58);
          box-shadow:
            0 48px 128px rgba(0, 0, 0, 0.50),
            inset 0 1px 0 rgba(255, 255, 255, 0.10),
            inset 0 -1px 0 rgba(0, 0, 0, 0.20);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          text-align: center;
          animation: psCardIn 0.62s cubic-bezier(0.18, 0.88, 0.32, 1.02) both;
          overflow: hidden;
        }

        /* Brand-gradient top accent strip */
        .ps__card::before {
          content: "";
          position: absolute;
          inset-x: 0;
          top: 0;
          height: 3px;
          background: linear-gradient(90deg, #1d4f91 0%, #60a5fa 40%, #f97316 72%, #ea580c 100%);
          opacity: 0.9;
        }

        /* Subtle bottom radial glow inside card */
        .ps__card::after {
          content: "";
          position: absolute;
          inset-x: 0;
          bottom: 0;
          height: 60%;
          background: radial-gradient(ellipse at 50% 120%, rgba(234, 88, 12, 0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── LOGO ── */
        .ps__logo {
          display: inline-flex;
          margin-bottom: 1.6rem;
          filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.35));
          animation: psLogoFloat 3.2s ease-in-out infinite;
        }

        /* ── TEXT ── */
        .ps__title {
          margin: 0;
          font-size: clamp(1.45rem, 3.2vw, 1.9rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #ffffff;
        }

        .ps__sub {
          margin: 0.55rem auto 0;
          max-width: 20rem;
          font-size: 0.875rem;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.56);
          letter-spacing: 0.005em;
        }

        /* ── PROGRESS ── */
        .ps__progress {
          margin-top: 2.2rem;
        }

        .ps__bar {
          width: 100%;
          height: 3px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.10);
          overflow: hidden;
        }

        .ps__bar-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #2f6eb7 0%, #60a5fa 35%, #f97316 75%, #ea580c 100%);
          box-shadow: 0 0 14px rgba(249, 115, 22, 0.55);
          transition: width 0.12s linear;
        }

        .ps__bar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.7rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
        }

        /* ── KEYFRAMES ── */
        @keyframes psCardIn {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes psExit {
          0%   { opacity: 1; transform: scale(1);     }
          100% { opacity: 0; transform: scale(1.022); visibility: hidden; }
        }

        @keyframes psFloat {
          0% {
            opacity: 0;
            transform: translateY(18px) rotate(-3deg);
          }
          18% {
            opacity: var(--o);
          }
          54% {
            opacity: var(--o);
            transform: translateY(-12px) rotate(4deg);
          }
          82% {
            opacity: var(--o);
          }
          100% {
            opacity: 0;
            transform: translateY(-34px) rotate(-2deg);
          }
        }

        @keyframes psLogoFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 480px) {
          .ps__card {
            padding: 2.2rem 1.6rem 1.8rem;
            border-radius: 1.75rem;
          }
        }

        /* ── REDUCED MOTION ── */
        @media (prefers-reduced-motion: reduce) {
          .ps__sym,
          .ps__logo,
          .ps__card {
            animation: none !important;
          }
          .ps__bar-fill {
            transition: none;
          }
        }
      `}</style>

      <div className={`ps${phase === "exit" ? " ps--exit" : ""}`}>
        <div className="ps__ambient" aria-hidden="true" />

        {SYMBOLS.map(({ symbol, x, y, size, opacity, delay, duration }, i) => (
          <span
            key={i}
            className="ps__sym"
            aria-hidden="true"
            style={
              {
                left: `${x}%`,
                top: `${y}%`,
                "--s": `${size}px`,
                "--o": opacity,
                "--d": `${duration}s`,
                "--dl": `${delay}s`,
              } as CSSProperties
            }
          >
            {symbol}
          </span>
        ))}

        <div className="ps__card">
          <div className="ps__logo">
            <Image
              src="/brand/logo-horizontal.png"
              alt="premat"
              width={210}
              height={70}
              priority
            />
          </div>

          <h1 className="ps__title">Hoş geldin</h1>
          <p className="ps__sub">
            Matematik için düzenli ve güvenilir dökümanlar
          </p>

          <div className="ps__progress" aria-hidden="true">
            <div className="ps__bar">
              <div
                className="ps__bar-fill"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="ps__bar-row">
              <span>Yükleniyor</span>
              <span>%{Math.round(Math.min(progress, 100))}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
