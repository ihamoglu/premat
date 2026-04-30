"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type ToolKey = "pomodoro" | "study" | "countdown" | "exam";
type Phase = "work" | "break" | "single";
type TimerStatus = "idle" | "running" | "paused" | "done";
type ThemeKey = "blue" | "pink" | "night" | "forest" | "sunset" | "lavender";

type TimerState = {
  remainingSeconds: number;
  phase: Phase;
  status: TimerStatus;
  completedCycles: number;
  targetCycles: number;
  workSeconds: number;
  breakSeconds: number;
};

type PersistedKronometreState = {
  activeTool: ToolKey;
  activeThemeKey: ThemeKey;
  timers: Record<ToolKey, TimerState>;
  countdownHours: string;
  countdownMinutes: string;
  examPreset: (typeof examPresets)[number]["key"];
  examCustomMinutes: string;
  savedAt: number;
};

type ToolConfig = {
  key: ToolKey;
  label: string;
  description: string;
  icon: IconName;
};

type TimerTheme = {
  key: ThemeKey;
  label: string;
  background: string;
  ring: string;
  button: string;
  glow: string;
  dot: string;
  soft: string;
  surface: string;
  textMuted: string;
};

type IconName =
  | "pomodoro"
  | "study"
  | "countdown"
  | "exam"
  | "play"
  | "pause"
  | "reset"
  | "fullscreen";

const tools: ToolConfig[] = [
  {
    key: "pomodoro",
    label: "Pomodoro",
    description: "25 dakika odak, 5 dakika mola",
    icon: "pomodoro",
  },
  {
    key: "study",
    label: "Etüt",
    description: "50 dakika çalışma, 10 dakika mola",
    icon: "study",
  },
  {
    key: "countdown",
    label: "Geri Sayım",
    description: "Saat ve dakika seç, süreyi başlat",
    icon: "countdown",
  },
  {
    key: "exam",
    label: "Sınav Sayacı",
    description: "Hazır deneme süreleri veya özel süre",
    icon: "exam",
  },
];

const examPresets = [
  { key: "lgs-verbal", label: "LGS Sözel", minutes: 75 },
  { key: "lgs-numeric", label: "LGS Sayısal", minutes: 80 },
  { key: "tyt", label: "TYT", minutes: 165 },
  { key: "ayt", label: "AYT", minutes: 180 },
  { key: "ydt", label: "YDT", minutes: 120 },
  { key: "kpss", label: "KPSS Genel", minutes: 130 },
  { key: "custom", label: "Özel Süre", minutes: 45 },
] as const;

const timerThemes: TimerTheme[] = [
  {
    key: "blue",
    label: "Mavi",
    background:
      "radial-gradient(circle at 18% 16%, rgba(56,189,248,0.22), transparent 28%), radial-gradient(circle at 82% 24%, rgba(234,88,12,0.13), transparent 26%), linear-gradient(135deg, #071326 0%, #0b1c35 54%, #0f2d5c 100%)",
    ring: "#22a9e8",
    button: "linear-gradient(135deg, #20aeea 0%, #0284c7 100%)",
    glow: "rgba(34,169,232,0.22)",
    dot: "rgba(56,189,248,0.68)",
    soft: "rgba(34,169,232,0.14)",
    surface: "rgba(5, 19, 38, 0.54)",
    textMuted: "rgba(226, 242, 255, 0.68)",
  },
  {
    key: "pink",
    label: "Pembe",
    background:
      "radial-gradient(circle at 50% 52%, rgba(236,72,153,0.18), transparent 30%), linear-gradient(135deg, #33051b 0%, #451029 52%, #210514 100%)",
    ring: "#ec4899",
    button: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    glow: "rgba(236,72,153,0.22)",
    dot: "rgba(244,114,182,0.65)",
    soft: "rgba(236,72,153,0.16)",
    surface: "rgba(36, 5, 22, 0.56)",
    textMuted: "rgba(255, 228, 241, 0.68)",
  },
  {
    key: "night",
    label: "Gece",
    background:
      "radial-gradient(circle at 16% 16%, rgba(129,140,248,0.18), transparent 24%), radial-gradient(circle at 84% 76%, rgba(99,102,241,0.14), transparent 25%), linear-gradient(135deg, #030712 0%, #070b18 58%, #111827 100%)",
    ring: "#6366f1",
    button: "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
    glow: "rgba(99,102,241,0.22)",
    dot: "rgba(199,210,254,0.72)",
    soft: "rgba(99,102,241,0.15)",
    surface: "rgba(3, 7, 18, 0.58)",
    textMuted: "rgba(224, 231, 255, 0.68)",
  },
  {
    key: "forest",
    label: "Orman",
    background:
      "radial-gradient(circle at 82% 22%, rgba(34,197,94,0.2), transparent 27%), radial-gradient(circle at 14% 84%, rgba(16,185,129,0.13), transparent 25%), linear-gradient(135deg, #052e16 0%, #073b1d 52%, #021c10 100%)",
    ring: "#22c55e",
    button: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    glow: "rgba(34,197,94,0.22)",
    dot: "rgba(74,222,128,0.62)",
    soft: "rgba(34,197,94,0.15)",
    surface: "rgba(3, 36, 18, 0.56)",
    textMuted: "rgba(220, 252, 231, 0.68)",
  },
  {
    key: "sunset",
    label: "Gün Batımı",
    background:
      "radial-gradient(circle at 54% 60%, rgba(251,146,60,0.18), transparent 28%), linear-gradient(135deg, #6b210b 0%, #7c2d12 56%, #431407 100%)",
    ring: "#fb923c",
    button: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
    glow: "rgba(251,146,60,0.24)",
    dot: "rgba(253,186,116,0.7)",
    soft: "rgba(251,146,60,0.15)",
    surface: "rgba(67, 20, 7, 0.54)",
    textMuted: "rgba(255, 237, 213, 0.7)",
  },
  {
    key: "lavender",
    label: "Lavanta",
    background:
      "radial-gradient(circle at 52% 52%, rgba(167,139,250,0.2), transparent 32%), linear-gradient(135deg, #221a56 0%, #2b2463 56%, #161339 100%)",
    ring: "#818cf8",
    button: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
    glow: "rgba(129,140,248,0.22)",
    dot: "rgba(196,181,253,0.68)",
    soft: "rgba(129,140,248,0.16)",
    surface: "rgba(22, 19, 57, 0.56)",
    textMuted: "rgba(237, 233, 254, 0.68)",
  },
];

const floatingDots = [
  { left: "5%", top: "78%", size: 10, className: "premat-float" },
  { left: "12%", top: "21%", size: 5, className: "premat-float-fast" },
  { left: "29%", top: "68%", size: 18, className: "premat-float-slow" },
  { left: "38%", top: "34%", size: 6, className: "premat-float" },
  { left: "62%", top: "66%", size: 8, className: "premat-float-fast" },
  { left: "77%", top: "29%", size: 34, className: "premat-float-slow" },
  { left: "88%", top: "18%", size: 26, className: "premat-float" },
  { left: "91%", top: "72%", size: 9, className: "premat-float-fast" },
  { left: "18%", top: "88%", size: 12, className: "premat-float-slow" },
  { left: "70%", top: "82%", size: 6, className: "premat-float" },
];

const initialTimers: Record<ToolKey, TimerState> = {
  pomodoro: {
    remainingSeconds: 25 * 60,
    phase: "work",
    status: "idle",
    completedCycles: 0,
    targetCycles: 4,
    workSeconds: 25 * 60,
    breakSeconds: 5 * 60,
  },
  study: {
    remainingSeconds: 50 * 60,
    phase: "work",
    status: "idle",
    completedCycles: 0,
    targetCycles: 3,
    workSeconds: 50 * 60,
    breakSeconds: 10 * 60,
  },
  countdown: {
    remainingSeconds: 30 * 60,
    phase: "single",
    status: "idle",
    completedCycles: 0,
    targetCycles: 1,
    workSeconds: 30 * 60,
    breakSeconds: 0,
  },
  exam: {
    remainingSeconds: 75 * 60,
    phase: "single",
    status: "idle",
    completedCycles: 0,
    targetCycles: 1,
    workSeconds: 75 * 60,
    breakSeconds: 0,
  },
};

const KRONOMETRE_STORAGE_KEY = "premat:kronometre:v1";

export default function KronometreToolClient() {
  const [activeTool, setActiveTool] = useState<ToolKey>("pomodoro");
  const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>("blue");
  const [timers, setTimers] = useState(initialTimers);
  const [countdownHours, setCountdownHours] = useState("0");
  const [countdownMinutes, setCountdownMinutes] = useState("30");
  const [examPreset, setExamPreset] = useState<(typeof examPresets)[number]["key"]>(
    "lgs-verbal"
  );
  const [examCustomMinutes, setExamCustomMinutes] = useState("45");
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentClock, setCurrentClock] = useState("--:--");
  const timerCardRef = useRef<HTMLDivElement>(null);
  const hasLoadedStorageRef = useRef(false);

  const activeTheme =
    timerThemes.find((theme) => theme.key === activeThemeKey) ?? timerThemes[0];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFullscreenSupported(Boolean(document.fullscreenEnabled));
    }, 0);

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      setCurrentClock(formatClock(new Date()));
    };
    const timeoutId = window.setTimeout(updateClock, 0);
    const intervalId = window.setInterval(updateClock, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const persistedState = readPersistedKronometreState();

      if (persistedState) {
        setActiveTool(persistedState.activeTool);
        setActiveThemeKey(persistedState.activeThemeKey);
        setCountdownHours(persistedState.countdownHours);
        setCountdownMinutes(persistedState.countdownMinutes);
        setExamPreset(persistedState.examPreset);
        setExamCustomMinutes(persistedState.examCustomMinutes);
        setTimers(
          applyElapsedToTimers(persistedState.timers, persistedState.savedAt)
        );
      }

      hasLoadedStorageRef.current = true;
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorageRef.current) {
      return;
    }

    persistKronometreState({
      activeTool,
      activeThemeKey,
      timers,
      countdownHours,
      countdownMinutes,
      examPreset,
      examCustomMinutes,
      savedAt: Date.now(),
    });
  }, [
    activeTool,
    activeThemeKey,
    timers,
    countdownHours,
    countdownMinutes,
    examPreset,
    examCustomMinutes,
  ]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimers((current) => {
        let shouldPlayBell = false;
        const next = { ...current };

        tools.forEach((tool) => {
          const timer = current[tool.key];

          if (timer.status !== "running") {
            return;
          }

          if (timer.remainingSeconds > 1) {
            next[tool.key] = {
              ...timer,
              remainingSeconds: timer.remainingSeconds - 1,
            };
            return;
          }

          shouldPlayBell = true;
          next[tool.key] = advanceTimer(timer);
        });

        if (shouldPlayBell) {
          playBell();
        }

        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const activeTimer = timers[activeTool];
  const activeConfig = tools.find((tool) => tool.key === activeTool)!;
  const phaseDuration =
    activeTimer.phase === "break"
      ? activeTimer.breakSeconds
      : activeTimer.workSeconds;
  const progress = phaseDuration
    ? 1 - activeTimer.remainingSeconds / phaseDuration
    : 1;

  function startTimer() {
    setTimers((current) => {
      const timer = current[activeTool];
      const nextTimer =
        timer.status === "done" || timer.remainingSeconds <= 0
          ? resetState(activeTool, timer)
          : timer;

      return {
        ...current,
        [activeTool]: {
          ...nextTimer,
          status: "running",
        },
      };
    });
  }

  function pauseTimer() {
    setTimers((current) => {
      const timer = current[activeTool];

      if (timer.status !== "running") {
        return current;
      }

      return {
        ...current,
        [activeTool]: {
          ...timer,
          status: "paused",
        },
      };
    });
  }

  function resetTimer() {
    setTimers((current) => ({
      ...current,
      [activeTool]: resetState(activeTool, current[activeTool]),
    }));
  }

  function updateTargetCycles(tool: "pomodoro" | "study", value: string) {
    const parsed = Math.max(1, Math.min(12, Number(value) || 1));
    setTimers((current) => ({
      ...current,
      [tool]: {
        ...current[tool],
        targetCycles: parsed,
      },
    }));
  }

  function updateCountdownDuration(hours: string, minutes: string) {
    setCountdownHours(hours);
    setCountdownMinutes(minutes);

    const seconds =
      Math.max(0, Number(hours) || 0) * 3600 +
      Math.max(1, Number(minutes) || 1) * 60;

    setTimers((current) => {
      if (current.countdown.status === "running") {
        return current;
      }

      return {
        ...current,
        countdown: {
          ...current.countdown,
          remainingSeconds: seconds,
          workSeconds: seconds,
          status: "idle",
        },
      };
    });
  }

  function updateExamPreset(value: (typeof examPresets)[number]["key"]) {
    setExamPreset(value);

    const preset = examPresets.find((item) => item.key === value)!;
    const minutes =
      value === "custom"
        ? Math.max(1, Number(examCustomMinutes) || 1)
        : preset.minutes;

    updateExamDuration(minutes);
  }

  function updateExamCustomMinutes(value: string) {
    setExamCustomMinutes(value);

    if (examPreset === "custom") {
      updateExamDuration(Math.max(1, Number(value) || 1));
    }
  }

  function updateExamDuration(minutes: number) {
    const seconds = minutes * 60;

    setTimers((current) => {
      if (current.exam.status === "running") {
        return current;
      }

      return {
        ...current,
        exam: {
          ...current.exam,
          remainingSeconds: seconds,
          workSeconds: seconds,
          status: "idle",
        },
      };
    });
  }

  async function toggleFullscreen() {
    if (!timerCardRef.current || !fullscreenSupported) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await timerCardRef.current.requestFullscreen();
  }

  return (
    <main
      className="kronometre-page min-h-[100svh] bg-slate-950 p-0 md:p-5"
      style={{ background: activeTheme.background }}
    >
      <section
        ref={timerCardRef}
        className="kronometre-shell relative isolate h-[100svh] min-h-[100svh] overflow-x-hidden overflow-y-auto overscroll-contain bg-slate-950 text-white shadow-2xl shadow-slate-950/30 md:h-[calc(100svh-2.5rem)] md:min-h-[calc(100svh-2.5rem)] md:rounded-[2rem] md:border md:border-white/10 fullscreen:h-[100svh] fullscreen:min-h-[100svh] fullscreen:rounded-none fullscreen:border-0"
        style={{ background: activeTheme.background }}
      >
        <FloatingLayer theme={activeTheme} />

        <div className="kronometre-layout relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col px-3 py-3 sm:px-5 sm:py-4 md:min-h-[calc(100svh-2.5rem)] md:px-7 fullscreen:min-h-[100svh]">
          <header className="kronometre-topbar flex items-center justify-between gap-2">
            <div className="inline-flex min-w-0 items-center gap-3">
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-base font-black text-white shadow-lg sm:h-11 sm:w-11"
                style={{ background: activeTheme.button }}
              >
                P
              </span>
              <div className="min-w-0">
                <div className="hidden text-xs font-black uppercase tracking-[0.18em] text-white/55 sm:block">
                  Premat Araçları
                </div>
                <h1 className="truncate text-lg font-black text-white sm:text-xl">
                  Kronometre
                </h1>
              </div>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <div className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 px-3 text-left text-white shadow-lg backdrop-blur sm:min-h-12 sm:px-4" style={{ background: activeTheme.surface }}>
                <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/78 sm:inline-flex">
                  <ClockIcon />
                </span>
                <span className="leading-none">
                  <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/42">
                    Şu an
                  </span>
                  <span className="mt-1 block text-base font-black tabular-nums text-white/86">
                    {currentClock}
                  </span>
                </span>
              </div>

              {fullscreenSupported ? (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 text-sm font-black text-white/90 shadow-lg backdrop-blur transition duration-200 hover:bg-white/15 sm:min-h-12 sm:px-4"
                >
                  <ToolIcon name="fullscreen" />
                  <span className="hidden sm:inline">
                    {isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekran"}
                  </span>
                </button>
              ) : null}
            </div>
          </header>

          <div className="kronometre-tabs mx-auto mt-3 grid w-full max-w-[34rem] grid-cols-2 gap-2 rounded-[1.35rem] border border-white/10 p-1.5 shadow-xl backdrop-blur-md sm:mt-5 sm:grid-cols-4" style={{ background: activeTheme.surface }}>
            {tools.map((tool) => {
              const active = activeTool === tool.key;

              return (
                <button
                  key={tool.key}
                  type="button"
                  onClick={() => setActiveTool(tool.key)}
                  className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl px-2.5 py-2 text-xs font-black transition duration-200 sm:min-h-11 sm:px-3 sm:text-sm ${
                    active
                      ? "bg-white/24 text-white shadow-lg shadow-black/20"
                      : "text-white/62 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <ToolIcon name={tool.icon} />
                  {tool.label}
                </button>
              );
            })}
          </div>

          <div className="kronometre-stage flex flex-1 flex-col items-center justify-center py-3 sm:py-5 md:py-6">
            <div className="text-center">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                {getPhaseLabel(activeTimer)}
              </div>
              <p className="mt-1 hidden max-w-[32rem] px-3 text-sm font-semibold leading-6 sm:block" style={{ color: activeTheme.textMuted }}>
                {activeConfig.description}
              </p>
            </div>

            <TimerCircle
              progress={progress}
              theme={activeTheme}
              timer={activeTimer}
            />

            <div className="relative z-20 mt-4 grid w-full max-w-md grid-cols-2 justify-center gap-2 sm:mt-6 sm:gap-3">
              <ControlButton
                onClick={resetTimer}
                icon="reset"
                theme={activeTheme}
                secondary
              >
                Sıfırla
              </ControlButton>

              {activeTimer.status === "running" ? (
                <ControlButton
                  onClick={pauseTimer}
                  icon="pause"
                  theme={activeTheme}
                >
                  Duraklat
                </ControlButton>
              ) : (
                <ControlButton
                  onClick={startTimer}
                  icon="play"
                  theme={activeTheme}
                >
                  {activeTimer.status === "paused" ? "Devam" : "Başlat"}
                </ControlButton>
              )}
            </div>

            <div className="mt-4 w-full max-w-4xl sm:mt-5">
              {(activeTool === "pomodoro" || activeTool === "study") ? (
                <CycleSettings
                  timer={activeTimer}
                  tool={activeTool}
                  onTargetChange={updateTargetCycles}
                />
              ) : null}

              {activeTool === "countdown" ? (
                <CountdownSettings
                  hours={countdownHours}
                  minutes={countdownMinutes}
                  disabled={activeTimer.status === "running"}
                  onChange={updateCountdownDuration}
                />
              ) : null}

              {activeTool === "exam" ? (
                <ExamSettings
                  preset={examPreset}
                  customMinutes={examCustomMinutes}
                  disabled={activeTimer.status === "running"}
                  onPresetChange={updateExamPreset}
                  onCustomMinutesChange={updateExamCustomMinutes}
                />
              ) : null}
            </div>

            <div className="kronometre-theme-status mt-3 grid w-full max-w-4xl gap-3 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <ThemePicker
                activeThemeKey={activeThemeKey}
                onThemeChange={setActiveThemeKey}
              />

              <div className="grid grid-cols-3 gap-2">
                <StatusCard
                  label="Durum"
                  value={getStatusLabel(activeTimer.status)}
                />
                <StatusCard label="Aşama" value={getPhaseLabel(activeTimer)} />
                <StatusCard
                  label="Tur"
                  value={`${activeTimer.completedCycles}/${activeTimer.targetCycles}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function advanceTimer(timer: TimerState): TimerState {
  if (timer.phase === "single") {
    return {
      ...timer,
      remainingSeconds: 0,
      status: "done",
    };
  }

  if (timer.phase === "work") {
    return {
      ...timer,
      phase: "break",
      remainingSeconds: timer.breakSeconds,
      status: "running",
    };
  }

  const completedCycles = timer.completedCycles + 1;
  const done = completedCycles >= timer.targetCycles;

  return {
    ...timer,
    completedCycles,
    phase: "work",
    remainingSeconds: done ? 0 : timer.workSeconds,
    status: done ? "done" : "running",
  };
}

function resetState(tool: ToolKey, timer: TimerState): TimerState {
  const base = initialTimers[tool];
  return {
    ...timer,
    remainingSeconds: timer.phase === "single" ? timer.workSeconds : base.workSeconds,
    phase: base.phase,
    status: "idle",
    completedCycles: 0,
  };
}

function applyElapsedToTimers(
  timers: Record<ToolKey, TimerState>,
  savedAt: number
): Record<ToolKey, TimerState> {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - savedAt) / 1000));

  if (elapsedSeconds <= 0) {
    return timers;
  }

  return {
    pomodoro: applyElapsedToTimer(timers.pomodoro, elapsedSeconds),
    study: applyElapsedToTimer(timers.study, elapsedSeconds),
    countdown: applyElapsedToTimer(timers.countdown, elapsedSeconds),
    exam: applyElapsedToTimer(timers.exam, elapsedSeconds),
  };
}

function applyElapsedToTimer(timer: TimerState, elapsedSeconds: number): TimerState {
  if (timer.status !== "running" || elapsedSeconds <= 0) {
    return timer;
  }

  let nextTimer = { ...timer };
  let remainingElapsed = elapsedSeconds;
  let guard = 0;

  while (remainingElapsed > 0 && nextTimer.status === "running" && guard < 1000) {
    if (nextTimer.remainingSeconds > remainingElapsed) {
      return {
        ...nextTimer,
        remainingSeconds: nextTimer.remainingSeconds - remainingElapsed,
      };
    }

    remainingElapsed -= Math.max(1, nextTimer.remainingSeconds);
    nextTimer = advanceTimer(nextTimer);
    guard += 1;
  }

  return nextTimer;
}

function persistKronometreState(state: PersistedKronometreState) {
  try {
    window.localStorage.setItem(KRONOMETRE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Depolama kapalıysa sayaç normal şekilde çalışmaya devam eder.
  }
}

function readPersistedKronometreState(): PersistedKronometreState | null {
  try {
    const rawState = window.localStorage.getItem(KRONOMETRE_STORAGE_KEY);

    if (!rawState) {
      return null;
    }

    const parsed: unknown = JSON.parse(rawState);

    if (!isRecord(parsed)) {
      return null;
    }

    return {
      activeTool: isToolKey(parsed.activeTool) ? parsed.activeTool : "pomodoro",
      activeThemeKey: isThemeKey(parsed.activeThemeKey)
        ? parsed.activeThemeKey
        : "blue",
      timers: coerceTimers(parsed.timers),
      countdownHours:
        typeof parsed.countdownHours === "string" ? parsed.countdownHours : "0",
      countdownMinutes:
        typeof parsed.countdownMinutes === "string"
          ? parsed.countdownMinutes
          : "30",
      examPreset: isExamPresetKey(parsed.examPreset)
        ? parsed.examPreset
        : "lgs-verbal",
      examCustomMinutes:
        typeof parsed.examCustomMinutes === "string"
          ? parsed.examCustomMinutes
          : "45",
      savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

function coerceTimers(value: unknown): Record<ToolKey, TimerState> {
  const source = isRecord(value) ? value : {};

  return {
    pomodoro: coerceTimer(source.pomodoro, initialTimers.pomodoro),
    study: coerceTimer(source.study, initialTimers.study),
    countdown: coerceTimer(source.countdown, initialTimers.countdown),
    exam: coerceTimer(source.exam, initialTimers.exam),
  };
}

function coerceTimer(value: unknown, fallback: TimerState): TimerState {
  if (!isRecord(value)) {
    return fallback;
  }

  return {
    remainingSeconds: coerceNumber(value.remainingSeconds, fallback.remainingSeconds),
    phase: isPhase(value.phase) ? value.phase : fallback.phase,
    status: isTimerStatus(value.status) ? value.status : fallback.status,
    completedCycles: coerceNumber(value.completedCycles, fallback.completedCycles),
    targetCycles: coerceNumber(value.targetCycles, fallback.targetCycles),
    workSeconds: coerceNumber(value.workSeconds, fallback.workSeconds),
    breakSeconds: coerceNumber(value.breakSeconds, fallback.breakSeconds),
  };
}

function coerceNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isToolKey(value: unknown): value is ToolKey {
  return tools.some((tool) => tool.key === value);
}

function isThemeKey(value: unknown): value is ThemeKey {
  return timerThemes.some((theme) => theme.key === value);
}

function isExamPresetKey(
  value: unknown
): value is (typeof examPresets)[number]["key"] {
  return examPresets.some((preset) => preset.key === value);
}

function isPhase(value: unknown): value is Phase {
  return value === "work" || value === "break" || value === "single";
}

function isTimerStatus(value: unknown): value is TimerStatus {
  return (
    value === "idle" ||
    value === "running" ||
    value === "paused" ||
    value === "done"
  );
}

function playBell() {
  try {
    const AudioContextConstructor: typeof AudioContext | undefined =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.7);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.75);
  } catch {
    // Tarayıcı ses başlatmayı engellerse sayaç çalışmaya devam eder.
  }
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function formatClock(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusLabel(status: TimerStatus) {
  if (status === "running") return "Çalışıyor";
  if (status === "paused") return "Duraklatıldı";
  if (status === "done") return "Tamamlandı";
  return "Hazır";
}

function getPhaseLabel(timer: TimerState) {
  if (timer.status === "done") return "Tamamlandı";
  if (timer.phase === "break") return "Mola";
  if (timer.phase === "work") return "Çalışma";
  return "Tek süre";
}

function FloatingLayer({ theme }: { theme: TimerTheme }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl sm:h-[34rem] sm:w-[34rem]"
        style={{ background: theme.glow }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.14)_64%,rgba(0,0,0,0.34)_100%)]" />
      {floatingDots.map((dot, index) => (
        <span
          key={`${dot.left}-${dot.top}`}
          className={`${dot.className} absolute rounded-full`}
          style={
            {
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              backgroundColor: theme.dot,
              opacity: 0.2 + (index % 4) * 0.12,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function TimerCircle({
  progress,
  theme,
  timer,
}: {
  progress: number;
  theme: TimerTheme;
  timer: TimerState;
}) {
  const safeProgress = Math.max(0, Math.min(100, progress * 100));
  const isLongTime = timer.remainingSeconds >= 3600;
  const circleStyle: CSSProperties = {
    height: "clamp(174px, min(62vw, 43svh), 370px)",
    width: "clamp(174px, min(62vw, 43svh), 370px)",
  };
  const timeStyle: CSSProperties = {
    fontSize: isLongTime
      ? "clamp(2rem, min(10vw, 8.5svh), 4.65rem)"
      : "clamp(3rem, min(16vw, 12svh), 6.1rem)",
  };

  return (
    <div
      className={`kronometre-timer-circle pointer-events-none relative mt-3 flex items-center justify-center sm:mt-5 ${
        timer.status === "running" ? "kronometre-ring-breathe" : ""
      } ${timer.status === "done" ? "kronometre-ring-complete" : ""}`}
      style={circleStyle}
    >
      <div
        className="absolute inset-[-14%] rounded-full opacity-35 blur-2xl"
        style={{ background: theme.soft }}
      />
      <div
        className="absolute inset-0 rounded-full p-[8px] sm:p-[12px]"
        style={{
          background: `conic-gradient(${theme.ring} ${safeProgress}%, rgba(255,255,255,0.12) 0)`,
          boxShadow: `0 0 46px ${theme.soft}`,
        }}
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center rounded-full border border-white/10 text-center shadow-inner shadow-black/30 backdrop-blur-md"
          style={{ background: theme.surface }}
        >
          <div
            className="font-black leading-none tracking-[-0.06em] text-white drop-shadow-sm"
            style={timeStyle}
            aria-live="polite"
          >
            {formatTime(timer.remainingSeconds)}
          </div>
          <div className="mt-2 text-sm font-black sm:mt-4 sm:text-xl" style={{ color: theme.textMuted }}>
            {getPhaseLabel(timer)}
          </div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/38 sm:mt-2 sm:text-xs">
            %{Math.round(safeProgress)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  icon,
  onClick,
  theme,
  secondary = false,
}: {
  children: ReactNode;
  icon: IconName;
  onClick: () => void;
  theme: TimerTheme;
  secondary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-12 w-full touch-manipulation select-none items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition duration-200 sm:min-h-14 sm:px-6 sm:py-3 sm:text-base ${
        secondary
          ? "border border-white/18 bg-black/12 text-white/88 backdrop-blur hover:bg-white/12 active:scale-[0.99]"
          : "text-white shadow-2xl hover:-translate-y-0.5"
      }`}
      style={secondary ? undefined : { background: theme.button }}
    >
      <ToolIcon name={icon} />
      {children}
    </button>
  );
}

function CycleSettings({
  timer,
  tool,
  onTargetChange,
}: {
  timer: TimerState;
  tool: "pomodoro" | "study";
  onTargetChange: (tool: "pomodoro" | "study", value: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-[1.25rem] border border-white/10 bg-black/16 p-2.5 backdrop-blur-md sm:p-3">
      <InfoPill label="Çalışma" value={`${timer.workSeconds / 60} dk`} />
      <InfoPill label="Mola" value={`${timer.breakSeconds / 60} dk`} />
      <NumberField
        label="Hedef döngü"
        value={String(timer.targetCycles)}
        min="1"
        max="12"
        disabled={false}
        onChange={(value) => onTargetChange(tool, value)}
      />
    </div>
  );
}

function CountdownSettings({
  hours,
  minutes,
  disabled,
  onChange,
}: {
  hours: string;
  minutes: string;
  disabled: boolean;
  onChange: (hours: string, minutes: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-[1.25rem] border border-white/10 bg-black/16 p-2.5 backdrop-blur-md sm:p-3">
      <NumberField
        label="Saat"
        value={hours}
        min="0"
        max="12"
        disabled={disabled}
        onChange={(value) => onChange(value, minutes)}
      />
      <NumberField
        label="Dakika"
        value={minutes}
        min="1"
        max="720"
        disabled={disabled}
        onChange={(value) => onChange(hours, value)}
      />
    </div>
  );
}

function ExamSettings({
  preset,
  customMinutes,
  disabled,
  onPresetChange,
  onCustomMinutesChange,
}: {
  preset: (typeof examPresets)[number]["key"];
  customMinutes: string;
  disabled: boolean;
  onPresetChange: (value: (typeof examPresets)[number]["key"]) => void;
  onCustomMinutesChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 rounded-[1.25rem] border border-white/10 bg-black/16 p-2.5 backdrop-blur-md sm:p-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {examPresets.map((item) => {
          const active = preset === item.key;

          return (
            <button
              key={item.key}
              type="button"
              disabled={disabled}
              onClick={() => onPresetChange(item.key)}
              className={`min-h-12 min-w-0 rounded-2xl border px-2 py-2 text-center transition duration-200 sm:min-h-14 ${
                active
                  ? "border-white/40 bg-white/22 text-white shadow-lg"
                  : "border-white/10 bg-white/7 text-white/64 hover:bg-white/12 hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-55`}
            >
              <span className="block truncate text-xs font-black sm:text-sm">
                {item.label}
              </span>
              <span className="mt-0.5 block text-[11px] font-bold text-white/58 sm:mt-1 sm:text-xs">
                {item.minutes} dk
              </span>
            </button>
          );
        })}
      </div>

      <div className={`${preset === "custom" ? "block" : "hidden"} max-w-xs`}>
        <NumberField
          label="Özel dakika"
          value={customMinutes}
          min="1"
          max="360"
          disabled={disabled || preset !== "custom"}
          onChange={onCustomMinutesChange}
        />
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  min: string;
  max: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-white/50 sm:text-[11px]">
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-2xl border border-white/12 bg-white/10 px-3 text-sm font-black text-white outline-none transition placeholder:text-white/30 focus:border-white/35 focus:ring-4 focus:ring-white/10 disabled:bg-white/5 disabled:text-white/42 sm:h-12 sm:px-4"
      />
    </label>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 sm:px-4 sm:py-3">
      <div className="truncate text-[10px] font-black uppercase tracking-[0.1em] text-white/50 sm:text-[11px]">
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-black text-white sm:mt-1 sm:text-lg">
        {value}
      </div>
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/14 px-2 py-2 text-center backdrop-blur-md sm:px-4 sm:py-3">
      <div className="truncate text-[9px] font-black uppercase tracking-[0.1em] text-white/45 sm:text-[11px]">
        {label}
      </div>
      <div className="mt-0.5 truncate text-xs font-black text-white sm:mt-1 sm:text-base">
        {value}
      </div>
    </div>
  );
}

function ThemePicker({
  activeThemeKey,
  onThemeChange,
}: {
  activeThemeKey: ThemeKey;
  onThemeChange: (theme: ThemeKey) => void;
}) {
  const activeTheme =
    timerThemes.find((theme) => theme.key === activeThemeKey) ?? timerThemes[0];

  return (
    <div className="text-center lg:text-left">
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45 sm:text-xs">
        Tema Seç
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        {timerThemes.map((theme) => {
          const active = theme.key === activeThemeKey;

          return (
            <button
              key={theme.key}
              type="button"
              onClick={() => onThemeChange(theme.key)}
              aria-label={`${theme.label} tema`}
              className={`h-9 w-9 rounded-2xl border transition duration-200 hover:-translate-y-0.5 sm:h-10 sm:w-10 ${
                active
                  ? "border-white bg-white/14 p-1 shadow-lg"
                  : "border-white/8 p-0 hover:border-white/26"
              }`}
            >
              <span
                className="block h-full w-full rounded-xl"
                style={{ background: theme.button }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-1 text-xs font-black text-white/58 sm:text-sm">
        {activeTheme.label}
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function ToolIcon({ name }: { name: IconName }) {
  if (name === "play") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M8 5.5v13l10-6.5-10-6.5Z" />
      </svg>
    );
  }

  if (name === "pause") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" />
      </svg>
    );
  }

  if (name === "reset") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      >
        <path d="M4 7v5h5" />
        <path d="M5.5 15.5A7 7 0 1 0 7 6.7L4 12" />
      </svg>
    );
  }

  if (name === "fullscreen") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      >
        <path d="M8 3H4v4" />
        <path d="M16 3h4v4" />
        <path d="M8 21H4v-4" />
        <path d="M16 21h4v-4" />
      </svg>
    );
  }

  if (name === "pomodoro") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      >
        <path d="M12 8c4.5 0 7.5 2.4 7.5 6.2 0 3.7-3.2 6.3-7.5 6.3s-7.5-2.6-7.5-6.3C4.5 10.4 7.5 8 12 8Z" />
        <path d="M12 8c-.2-2 1-3.5 3-4" />
        <path d="M12 8c-1.4-1.5-3-1.8-5-1" />
      </svg>
    );
  }

  if (name === "study") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      >
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15H6.5A2.5 2.5 0 0 1 4 16.5v-10Z" />
        <path d="M8 4v15" />
        <path d="M11 8h5" />
        <path d="M11 12h4" />
      </svg>
    );
  }

  if (name === "exam") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      >
        <path d="M7 3h10v4H7V3Z" />
        <path d="M5 7h14v14H5V7Z" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.1"
    >
      <circle cx="12" cy="13" r="7" />
      <path d="M12 13V9" />
      <path d="M12 13l3 2" />
      <path d="M9 2h6" />
    </svg>
  );
}
