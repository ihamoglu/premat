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

const SYMBOLS = ["⭐", "✨", "🌟", "💫", "🔢", "📐", "🎯", "➕", "✖️", "➗"];

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 18 + Math.random() * 18,
        duration: 3 + Math.random() * 3,
        delay: Math.random() * 2,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      }))
    );
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 100;
        }

        return current + 1.2;
      });
    }, 24);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("hold"), 250);
    const exitTimer = setTimeout(() => setPhase("exit"), 2200);
    const finishTimer = setTimeout(() => onFinish?.(), 2800);

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
            radial-gradient(circle at top left, rgba(255,255,255,0.2), transparent 32%),
            radial-gradient(circle at bottom right, rgba(249,115,22,0.18), transparent 28%),
            linear-gradient(135deg, #1d4f91 0%, #2f6eb7 32%, #3b82c4 55%, #f59e0b 78%, #ea580c 100%);
          background-size: 160% 160%;
          animation: prematSplashBg 9s ease-in-out infinite;
        }

        .premat-splash--exit {
          animation: prematSplashFade 0.55s ease forwards;
        }

        .premat-splash__glow {
          position: absolute;
          width: 36rem;
          height: 36rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          filter: blur(80px);
          transform: scale(0.9);
          animation: prematSplashPulse 3s ease-in-out infinite;
        }

        .premat-splash__particle {
          position: absolute;
          font-size: var(--particle-size);
          opacity: 0;
          filter: drop-shadow(0 10px 18px rgba(15, 23, 42, 0.16));
          animation: prematSplashFloat var(--particle-duration) ease-in-out var(--particle-delay) infinite;
          user-select: none;
          pointer-events: none;
        }

        .premat-splash__card {
          position: relative;
          z-index: 2;
          width: min(92vw, 34rem);
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
          background: linear-gradient(90deg, #ffffff 0%, #dbeafe 28%, #fde68a 68%, #fed7aa 100%);
          box-shadow: 0 0 18px rgba(255,255,255,0.4);
          transition: width 0.18s linear;
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
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
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
            transform: scale(1.02);
          }
        }

        @keyframes prematSplashPulse {
          0%, 100% { transform: scale(0.9); opacity: 0.75; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes prematSplashFloat {
          0% {
            opacity: 0;
            transform: translate3d(0, 18px, 0) scale(0.92) rotate(0deg);
          }
          15% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
            transform: translate3d(10px, -18px, 0) scale(1.05) rotate(6deg);
          }
          100% {
            opacity: 0;
            transform: translate3d(-6px, -44px, 0) scale(0.96) rotate(-6deg);
          }
        }

        @keyframes prematSplashDot {
          0%, 100% { transform: scale(0.9); opacity: 0.45; }
          50% { transform: scale(1.3); opacity: 1; }
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