/**
 * DESIGN: «Супергерой безопасности»
 * Comic Book style, bold colors, interactive scenarios for 4-year-old child
 * Colors: Deep Blue, Yellow, Red — comic book palette
 * Fonts: Fredoka One (headings), Nunito (body)
 * Features: Sound effects, progress tracking, quiz mode
 */

import { useState, useEffect, useRef } from "react";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";

// ─── Asset URLs ────────────────────────────────────────────────────────────────
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663470554599/C8x83niLz74d5Eamwjtmva/hero-banner-Ku2cQgRHGfhtzVRerE5mJ2.webp";
const IMG_STRANGER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663470554599/C8x83niLz74d5Eamwjtmva/rule-stranger-ST7ETN6fi4eBeAUczGLHES.webp";
const IMG_SECRET = "https://d2xsxph8kpxj0f.cloudfront.net/310519663470554599/C8x83niLz74d5Eamwjtmva/rule-secret-4yRm7airQ38aSE6UH3DsdP.webp";
const IMG_LOST = "https://d2xsxph8kpxj0f.cloudfront.net/310519663470554599/C8x83niLz74d5Eamwjtmva/rule-lost-edkzRDoCM8kvXPAsKPuNwc.webp";
const IMG_RUN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663470554599/C8x83niLz74d5Eamwjtmva/rule-run-gKGwTmuXwgyCnG4t4opvcV.webp";

// ─── Data ──────────────────────────────────────────────────────────────────────
interface Rule {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  image: string;
  situation: string;
  question: string;
  options: { text: string; correct: boolean; feedback: string }[];
  superpower: string;
  steps: string[];
}

const rules: Rule[] = [
  {
    id: 1,
    emoji: "🚶",
    title: "Чужие взрослые",
    subtitle: "Суперсила: Умею уходить!",
    color: "#1A237E",
    bgColor: "#E8EAF6",
    borderColor: "#3949AB",
    image: IMG_STRANGER,
    situation: "К тебе подходит незнакомый дядя и говорит: «Помоги мне найти мою собачку!»",
    question: "Что ты сделаешь?",
    options: [
      { text: "Пойду помогать искать собачку", correct: false, feedback: "Нет! Незнакомым взрослым не нужна помощь детей. Это может быть опасно!" },
      { text: "Быстро уйду к своим взрослым и крикну «Я вас не знаю!»", correct: true, feedback: "Молодец! Ты настоящий супергерой! Всегда уходи к своим взрослым!" },
    ],
    superpower: "Суперсила: УЙТИ И КРИКНУТЬ!",
    steps: ["Повернись и быстро уходи к маме или папе", "Кричи: «Я вас не знаю!»", "Беги к другим людям (лучше к маме с ребёнком)", "Расскажи взрослым что случилось"],
  },
  {
    id: 2,
    emoji: "🤫",
    title: "Секреты от мамы",
    subtitle: "Суперсила: Рассказываю маме!",
    color: "#E65100",
    bgColor: "#FFF3E0",
    borderColor: "#F57C00",
    image: IMG_SECRET,
    situation: "Знакомый говорит тебе: «Давай это будет наш секрет, не говори маме!»",
    question: "Что ты сделаешь?",
    options: [
      { text: "Соглашусь хранить секрет", correct: false, feedback: "Нет! Плохие секреты — это опасно! Всегда рассказывай маме и папе!" },
      { text: "Сразу расскажу маме или папе!", correct: true, feedback: "Отлично! Хорошие секреты — это сюрпризы (подарки). Плохие — когда просят молчать!" },
    ],
    superpower: "Суперсила: РАССКАЗАТЬ МАМЕ!",
    steps: ["Хорошие секреты (подарок) — можно рассказать позже", "Плохие секреты (молчи!) — рассказывай СРАЗУ", "Иди к маме, папе или воспитателю", "Ты не предаёшь — ты защищаешь себя!"],
  },
  {
    id: 3,
    emoji: "🗿",
    title: "Если потерялся",
    subtitle: "Суперсила: Стою столбиком!",
    color: "#1B5E20",
    bgColor: "#E8F5E9",
    borderColor: "#388E3C",
    image: IMG_LOST,
    situation: "Ты в магазине и вдруг не видишь маму рядом. Ты потерялся!",
    question: "Что ты сделаешь?",
    options: [
      { text: "Побегу искать маму по всему магазину", correct: false, feedback: "Нет! Если побежишь — мама не найдёт тебя на месте. Стой как столбик!" },
      { text: "Остановлюсь на месте и громко крикну «Мама! Папа!»", correct: true, feedback: "Супер! Стой на месте как столбик! Мама вернётся туда, где ты был!" },
    ],
    superpower: "Суперсила: СТОЯТЬ СТОЛБИКОМ!",
    steps: ["Остановись на месте — не беги!", "Кричи: «Мама! Папа!» 3 раза громко", "Если не приходят — подойди к тёте с ребёнком", "Скажи: «Я потерялся, помогите!»"],
  },
  {
    id: 4,
    emoji: "🍬",
    title: "Чужое угощение",
    subtitle: "Суперсила: Говорю НЕТ!",
    color: "#880E4F",
    bgColor: "#FCE4EC",
    borderColor: "#C2185B",
    image: IMG_SECRET,
    situation: "Незнакомый человек протягивает тебе конфету и говорит: «Это наш секрет!»",
    question: "Что ты сделаешь?",
    options: [
      { text: "Возьму конфету, она выглядит вкусно!", correct: false, feedback: "Нет! Никогда не бери еду от незнакомых! Это может быть опасно!" },
      { text: "Отступлю на 3 шага и громко скажу «НЕТ!», потом убегу к своим", correct: true, feedback: "Молодец! Ты самый смелый! Говорить НЕТ — это твоя суперсила!" },
    ],
    superpower: "Суперсила: СКАЗАТЬ НЕТ!",
    steps: ["Отойди на 3 шага назад", "Громко скажи: «НЕТ!»", "Быстро беги к своему взрослому", "Расскажи маме или папе что случилось"],
  },
  {
    id: 5,
    emoji: "🏃",
    title: "Кричи и убегай",
    subtitle: "Суперсила: Кричу и бегу!",
    color: "#B71C1C",
    bgColor: "#FFEBEE",
    borderColor: "#D32F2F",
    image: IMG_RUN,
    situation: "Тебе страшно — кто-то пытается взять тебя за руку и куда-то вести!",
    question: "Что ты сделаешь?",
    options: [
      { text: "Буду молчать, чтобы не быть невежливым", correct: false, feedback: "Нет! Когда страшно — кричи! Быть невежливым — не страшно, когда ты в опасности!" },
      { text: "Громко кричу «Помогите! Я не знаю этого человека!» и убегаю!", correct: true, feedback: "Браво! Ты настоящий супергерой безопасности! Кричать — это правильно!" },
    ],
    superpower: "Суперсила: КРИЧАТЬ И БЕЖАТЬ!",
    steps: ["Кричи: «Помогите! Я не знаю этого человека!»", "Убегай в безопасное место (магазин, к людям)", "Не бойся быть «невежливым» — твоя безопасность важнее!", "Расскажи взрослым что произошло"],
  },
];

// ─── Confetti Component ────────────────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ["#FFC107", "#1A237E", "#E53935", "#4CAF50", "#9C27B0"][Math.floor(Math.random() * 5)],
    size: 8 + Math.random() * 8,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl z-10">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `confetti-fall 1.2s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Rule Card Component ───────────────────────────────────────────────────────
function RuleCard({ rule, index, onComplete }: { rule: Rule; index: number; onComplete: (ruleId: number, correct: boolean) => void }) {
  const { playSound } = useSound();
  const [phase, setPhase] = useState<"intro" | "question" | "result">("intro");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleAnswer = (idx: number) => {
    const isCorrect = rule.options[idx].correct;
    playSound(isCorrect ? 'correct' : 'incorrect');
    setSelectedOption(idx);
    setPhase("result");
    
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }

    onComplete(rule.id, isCorrect);
  };

  const reset = () => {
    setPhase("intro");
    setSelectedOption(null);
    setShowConfetti(false);
  };

  const isCorrect = selectedOption !== null && rule.options[selectedOption].correct;

  return (
    <div
      ref={ref}
      className="comic-panel relative overflow-hidden bg-white"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        borderColor: rule.borderColor,
        boxShadow: `8px 8px 0px ${rule.borderColor}`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Header */}
      <div
        className="flex items-center gap-4 p-5 pb-4"
        style={{ backgroundColor: rule.bgColor }}
      >
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl text-4xl flex-shrink-0 border-4"
          style={{ borderColor: rule.borderColor, backgroundColor: "white" }}
        >
          {rule.emoji}
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: rule.color }}>
            Правило {rule.id}
          </div>
          <h3 className="text-2xl leading-tight" style={{ fontFamily: "'Fredoka One', cursive", color: rule.color }}>
            {rule.title}
          </h3>
          <div className="text-sm font-bold mt-0.5" style={{ color: rule.borderColor }}>
            {rule.subtitle}
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        <img
          src={rule.image}
          alt={rule.title}
          className="w-full h-full object-cover"
          style={{ objectPosition: "center top" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{ background: `linear-gradient(to top, white, transparent)` }}
        />
      </div>

      {/* Content */}
      <div className="p-5 pt-2">
        {/* Situation */}
        <div
          className="rounded-xl p-4 mb-4 border-2"
          style={{ backgroundColor: rule.bgColor, borderColor: rule.borderColor }}
        >
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: rule.color }}>
            📖 Ситуация
          </div>
          <p className="text-base font-bold leading-snug text-gray-800">{rule.situation}</p>
        </div>

        {/* Question Phase */}
        {phase === "intro" && (
          <div className="animate-slide-up">
            <p className="text-lg font-extrabold text-gray-800 mb-3">{rule.question}</p>
            <div className="space-y-3">
              {rule.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full text-left p-4 rounded-xl border-3 font-bold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    borderWidth: "3px",
                    borderColor: rule.borderColor,
                    backgroundColor: "white",
                    color: "#1a1a2e",
                    boxShadow: `3px 3px 0px ${rule.borderColor}`,
                  }}
                >
                  {idx === 0 ? "❌ " : "✅ "}{opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Phase */}
        {phase === "result" && selectedOption !== null && (
          <div className="animate-bounce-in">
            {/* Feedback */}
            <div
              className="rounded-xl p-4 mb-4 border-3"
              style={{
                borderWidth: "3px",
                backgroundColor: isCorrect ? "#E8F5E9" : "#FFEBEE",
                borderColor: isCorrect ? "#388E3C" : "#D32F2F",
              }}
            >
              <div className="text-2xl mb-1">{isCorrect ? "🎉" : "😅"}</div>
              <p className="font-extrabold text-base" style={{ color: isCorrect ? "#1B5E20" : "#B71C1C" }}>
                {rule.options[selectedOption].feedback}
              </p>
            </div>

            {/* Superpower steps */}
            {isCorrect && (
              <div
                className="rounded-xl p-4 mb-4 border-3"
                style={{ borderWidth: "3px", backgroundColor: rule.bgColor, borderColor: rule.borderColor }}
              >
                <div
                  className="text-base font-black mb-3 uppercase tracking-wide"
                  style={{ fontFamily: "'Fredoka One', cursive", color: rule.color }}
                >
                  ⚡ {rule.superpower}
                </div>
                <ol className="space-y-2">
                  {rule.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-800">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
                        style={{ backgroundColor: rule.borderColor }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl font-black text-white text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: rule.color,
                  boxShadow: `4px 4px 0px ${rule.borderColor}`,
                }}
              >
                {isCorrect ? "🔄 Повторить" : "💪 Попробуй снова!"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressStars({ total }: { total: number }) {
  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="text-3xl animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
          ⭐
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
  const { progress, completeRule, getCompletionPercentage } = useProgress();
  const completionPercentage = getCompletionPercentage();

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRuleComplete = (ruleId: number, correct: boolean) => {
    completeRule(ruleId, correct);
  };

  return (
    <div className="min-h-screen halftone-bg">
      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A237E 0%, #283593 50%, #1565C0 100%)" }}
      >
        {/* Comic dots overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container relative z-10 py-10 pb-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Text */}
            <div
              className="flex-1 text-center lg:text-left"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateX(0)" : "translateX(-40px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              {/* Badge */}
              <div
                className="inline-block px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest mb-4 border-2"
                style={{ backgroundColor: "#FFC107", color: "#1A237E", borderColor: "#F57F17" }}
              >
                ⚡ Обучение для супергероев
              </div>

              <h1
                className="text-5xl lg:text-6xl text-white leading-tight mb-4"
                style={{ fontFamily: "'Fredoka One', cursive", textShadow: "3px 3px 0px rgba(0,0,0,0.3)" }}
              >
                Правила
                <br />
                <span style={{ color: "#FFC107" }}>Безопасности</span>
                <br />
                Супергероя!
              </h1>

              <p className="text-lg text-blue-200 font-bold mb-6 max-w-md mx-auto lg:mx-0">
                5 суперсил, которые защитят тебя в любой ситуации 🛡️
              </p>

              <ProgressStars total={5} />
            </div>

            {/* Hero Image */}
            <div
              className="flex-shrink-0"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "scale(1)" : "scale(0.7)",
                transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
              }}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: "radial-gradient(circle, #FFC107 0%, transparent 70%)",
                    transform: "scale(1.2)",
                    opacity: 0.3,
                  }}
                />
                <img
                  src={HERO_IMG}
                  alt="Супергерой безопасности"
                  className="relative z-10 animate-float"
                  style={{ width: "280px", height: "280px", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <svg viewBox="0 0 1440 60" className="w-full block" style={{ marginBottom: "-2px" }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="oklch(0.97 0.01 260)" />
        </svg>
      </section>

      {/* ── Progress Section ── */}
      <section className="container py-6 bg-gradient-to-b from-blue-50 to-transparent">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-1">📊 Твой прогресс</div>
            <div className="text-3xl font-black" style={{ fontFamily: "'Fredoka One', cursive", color: "#1A237E" }}>
              {completionPercentage}% завершено
            </div>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, i) => {
              const completed = progress.completedRules.some(r => r.ruleId === i + 1 && r.completed);
              return (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-3 transition-all"
                  style={{
                    backgroundColor: completed ? "#FFC107" : "#E8EAF6",
                    borderColor: completed ? "#F57F17" : "#3949AB",
                    color: completed ? "#1A237E" : "#3949AB",
                  }}
                >
                  {completed ? "✅" : i + 1}
                </div>
              );
            })}
          </div>
          <a
            href="/quiz"
            className="px-6 py-3 rounded-xl font-black text-white text-base transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] whitespace-nowrap"
            style={{
              backgroundColor: "#E53935",
              boxShadow: "4px 4px 0px #B71C1C",
            }}
          >
            🧪 Режим проверки
          </a>
        </div>
      </section>

      {/* ── Intro Banner ── */}
      <section className="container py-8">
        <div
          className="comic-panel p-6 text-center"
          style={{ backgroundColor: "#FFF8E1", borderColor: "#F57F17", boxShadow: "6px 6px 0px #F57F17" }}
        >
          <div className="text-4xl mb-3">👨‍👩‍👦</div>
          <h2
            className="text-2xl text-gray-800 mb-2"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Привет, маленький супергерой!
          </h2>
          <p className="text-base font-bold text-gray-700 max-w-xl mx-auto">
            Сейчас мы с тобой вместе изучим <span style={{ color: "#E65100" }}>5 важных правил</span>, которые помогут тебе оставаться в безопасности. В каждом правиле — задание: выбери правильный ответ и получи суперсилу! 💪
          </p>
        </div>
      </section>

      {/* ── Rules Grid ── */}
      <section className="container pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {rules.map((rule, i) => (
            <RuleCard key={rule.id} rule={rule} index={i} onComplete={handleRuleComplete} />
          ))}

          {/* Final card — Super Algorithm */}
          <div
            className="comic-panel md:col-span-2 xl:col-span-3"
            style={{
              background: "linear-gradient(135deg, #1A237E 0%, #283593 100%)",
              borderColor: "#FFC107",
              boxShadow: "8px 8px 0px #F57F17",
            }}
          >
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h2
                className="text-3xl text-white mb-2"
                style={{ fontFamily: "'Fredoka One', cursive" }}
              >
                Алгоритм Супергероя!
              </h2>
              <p className="text-blue-200 font-bold mb-8 text-lg">
                Запомни эти 4 шага — они всегда тебя защитят!
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { step: "1", icon: "👁️", label: "Увидел опасность", color: "#E53935" },
                  { step: "2", icon: "✋", label: "Сказал «НЕТ»", color: "#FFC107" },
                  { step: "3", icon: "🏃", label: "Убежал", color: "#4CAF50" },
                  { step: "4", icon: "💬", label: "Рассказал маме", color: "#29B6F6" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl p-4 border-3 flex flex-col items-center gap-2"
                    style={{
                      borderWidth: "3px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: item.color,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg border-2"
                      style={{ backgroundColor: item.color, borderColor: "white" }}
                    >
                      {item.step}
                    </div>
                    <div className="text-3xl">{item.icon}</div>
                    <div className="text-white font-black text-sm text-center leading-tight">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-8 inline-block px-6 py-3 rounded-2xl border-3 font-black text-lg"
                style={{
                  borderWidth: "3px",
                  backgroundColor: "#FFC107",
                  color: "#1A237E",
                  borderColor: "#F57F17",
                  boxShadow: "4px 4px 0px #F57F17",
                }}
              >
                🌟 Ты — Супергерой Безопасности! 🌟
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer for parents ── */}
      <footer
        className="border-t-4 py-8"
        style={{ borderColor: "#1A237E", backgroundColor: "#E8EAF6" }}
      >
        <div className="container">
          <div
            className="comic-panel p-6"
            style={{ backgroundColor: "white", borderColor: "#3949AB", boxShadow: "5px 5px 0px #3949AB" }}
          >
            <h3
              className="text-xl text-center mb-4"
              style={{ fontFamily: "'Fredoka One', cursive", color: "#1A237E" }}
            >
              📋 Советы для родителей
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm font-bold text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-xl">🎮</span>
                <span>Повторяйте правила в игровой форме: «А что, если…?»</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🧸</span>
                <span>Моделируйте ситуации с игрушками — так ребёнок запомнит лучше</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">⭐</span>
                <span>Хвалите за правильные ответы — рефлекс формируется через повторение</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
