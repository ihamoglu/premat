"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  symbol: string;
}

const SYMBOLS = [
  "π",
  "√",
  "∑",
  "∞",
  "Δ",
  "∫",
  "θ",
  "λ",
  "μ",
  "≠",
  "≈",
  "±",
  "÷",
  "×",
  "∠",
  "⊥",
  "∥",
  "ℕ",
  "ℤ",
  "ƒ",
  "%",
  "∴",
];

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [progress, setProgress] = useState(0);
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 24 }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 30 + Math.random() * 26,
      duration: 3.2 + Math.random() * 2.6,
      delay: Math.random() * 2.2,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    }))
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 100;
        }

        return current + 0.95;
      });
    }, 34);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("hold"), 300);
    const exitTimer = setTimeout(() => setPhase("exit"), 3200);
    const finishTimer = setTimeout(() => onFinish?.(), 4000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <>
      <style>{`
        .premat-splash {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(circle at 14% 18%, rgba(255,255,255,0.18), transparent 24%),
            radial-gradient(circle at 82% 82%, rgba(249,115,22,0.22), transparent 28%),
            linear-gradient(
              135deg,
              #0f4c97 0%,
              #1d66b7 18%,
              #2f7fca 34%,
              #3b82f6 46%,
              #f59e0b 68%,
              #f97316 84%,
              #ea580c 100%
            );
          background-size: 220% 220%;
          animation: prematSplashBg 3.6s ease-in-out infinite alternate;
        }

        .premat-splash--exit {
          animation: prematSplashFade 0.75s ease forwards !important;
        }

        .premat-splash__glow {
          position: absolute;
          width: 42rem;
          height: 42rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          filter: blur(90px);
          transform: scale(0.9);
          animation: prematSplashPulse 2.8s ease-in-out infinite;
        }

        .premat-splash__particle {
          position: absolute;
          font-size: var(--particle-size);
          font-weight: 800;
          color: rgba(255,255,255,0.78);
          opacity: 0;
          text-shadow: 0 10px 24px rgba(15, 23, 42, 0.2);
          animation: prematSplashFloat var(--particle-duration) ease-in-out var(--particle-delay) infinite;
          user-select: none;
          pointer-events: none;
        }

        .premat-splash__card {
          position: relative;
          z-index: 2;
          width: min(92vw, 35rem);
          padding: 2rem 1.4rem;
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 2rem;
          background: rgba(255,255,255,0.14);
          box-shadow: 0 25px 80px rgba(15, 23, 42, 0.22);
          backdrop-filter: blur(14px);
          text-align: center;
          color: white;
          transform: translateY(0) scale(1);
          animation: prematSplashCardIn 0.55s cubic-bezier(.2,.8,.2,1);
        }

        .premat-splash__logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          animation: prematSplashLogoFloat 2.6s ease-in-out infinite;
        }

        .premat-splash__logo-image {
          filter: drop-shadow(0 12px 28px rgba(15, 23, 42, 0.2));
          animation: prematSplashLogoIn 0.6s ease;
        }

        .premat-splash__title {
          margin: 0;
          font-size: clamp(1.55rem, 3vw, 2.2rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #ffffff;
        }

        .premat-splash__text {
          margin: 0.65rem auto 0;
          max-width: 26rem;
          font-size: clamp(0.95rem, 2vw, 1.05rem);
          line-height: 1.65;
          color: rgba(255,255,255,0.88);
        }

        .premat-splash__bar {
          margin-top: 1.5rem;
          width: 100%;
          height: 0.72rem;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,0.2);
          box-shadow: inset 0 1px 2px rgba(15,23,42,0.18);
        }

        .premat-splash__bar-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #ffffff 0%, #dbeafe 20%, #fde68a 60%, #fed7aa 100%);
          box-shadow: 0 0 18px rgba(255,255,255,0.4);
          transition: width 0.12s linear;
        }

        .premat-splash__footer {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          color: rgba(255,255,255,0.88);
          font-size: 0.9rem;
          font-weight: 700;
        }

        .premat-splash__dots {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .premat-splash__dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.72);
          animation: prematSplashDot 1.2s ease-in-out infinite;
        }

        .premat-splash__dot:nth-child(2) {
          animation-delay: 0.18s;
        }

        .premat-splash__dot:nth-child(3) {
          animation-delay: 0.36s;
        }

        @keyframes prematSplashBg {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        @keyframes prematSplashCardIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes prematSplashFade {
          to {
            opacity: 0;
            visibility: hidden;
            transform: translateY(-4%) scale(1.02);
          }
        }

        @keyframes prematSplashPulse {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.72;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes prematSplashFloat {
          0% {
            opacity: 0;
            transform: translate3d(0, 22px, 0) scale(0.86) rotate(0deg);
          }
          18% {
            opacity: 0.78;
          }
          52% {
            opacity: 1;
            transform: translate3d(12px, -20px, 0) scale(1.08) rotate(8deg);
          }
          100% {
            opacity: 0;
            transform: translate3d(-8px, -52px, 0) scale(0.96) rotate(-8deg);
          }
        }

        @keyframes prematSplashLogoIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes prematSplashLogoFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes prematSplashDot {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .premat-splash__card {
            padding: 1.6rem 1rem;
            border-radius: 1.6rem;
          }

          .premat-splash__footer {
            flex-direction: column;
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .premat-splash,
          .premat-splash__glow,
          .premat-splash__particle,
          .premat-splash__card,
          .premat-splash__logo,
          .premat-splash__logo-image,
          .premat-splash__dot {
            animation: none !important;
          }

          .premat-splash__bar-fill {
            transition: none;
          }
        }
      `}</style>

      <div className={`premat-splash ${phase === "exit" ? "premat-splash--exit" : ""}`}>
        <div className="premat-splash__glow" />

        {particles.map((particle) => (
          <span
            key={particle.id}
            className="premat-splash__particle"
            style={
              {
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                "--particle-size": `${particle.size}px`,
                "--particle-duration": `${particle.duration}s`,
                "--particle-delay": `${particle.delay}s`,
              } as CSSProperties
            }
          >
            {particle.symbol}
          </span>
        ))}

        <div className="premat-splash__card">
          <div className="premat-splash__logo">
            <Image
              src="/brand/logo-horizontal.png"
              alt="premat logo"
              width={260}
              height={86}
              priority
              className="premat-splash__logo-image"
            />
          </div>

          <h1 className="premat-splash__title">Hoş geldin</h1>
          <p className="premat-splash__text">
            Düzenli ve güvenilir matematik dökümanlarına hazırlanıyor.
          </p>

          <div className="premat-splash__bar" aria-hidden="true">
            <div
              className="premat-splash__bar-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="premat-splash__footer">
            <span>%{Math.round(Math.min(progress, 100))}</span>

            <div className="premat-splash__dots" aria-hidden="true">
              <span className="premat-splash__dot" />
              <span className="premat-splash__dot" />
              <span className="premat-splash__dot" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
