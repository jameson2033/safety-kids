/**
 * DESIGN: «Супергерой безопасности»
 * Quiz mode: test knowledge with shuffled questions
 */

import { useState, useEffect } from "react";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";

interface QuizQuestion {
  ruleId: number;
  ruleTitle: string;
  question: string;
  options: { text: string; correct: boolean }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    ruleId: 1,
    ruleTitle: "Чужие взрослые",
    question: "Что ты сделаешь, если незнакомый взрослый подойдёт к тебе?",
    options: [
      { text: "Пойду с ним помогать", correct: false },
      { text: "Быстро уйду к маме и крикну «Я вас не знаю!»", correct: true },
    ],
  },
  {
    ruleId: 2,
    ruleTitle: "Секреты от мамы",
    question: "Если кто-то говорит «это наш секрет, не говори маме» — что делать?",
    options: [
      { text: "Буду хранить секрет", correct: false },
      { text: "Сразу расскажу маме или папе", correct: true },
    ],
  },
  {
    ruleId: 3,
    ruleTitle: "Если потерялся",
    question: "Ты потерялся в магазине. Что ты сделаешь?",
    options: [
      { text: "Побегу искать маму по всему магазину", correct: false },
      { text: "Остановлюсь на месте и громко крикну «Мама!»", correct: true },
    ],
  },
  {
    ruleId: 4,
    ruleTitle: "Чужое угощение",
    question: "Незнакомый человек предлагает тебе конфету. Что ты сделаешь?",
    options: [
      { text: "Возьму конфету", correct: false },
      { text: "Скажу «НЕТ!» и убегу к своим", correct: true },
    ],
  },
  {
    ruleId: 5,
    ruleTitle: "Кричи и убегай",
    question: "Тебе страшно, и кто-то пытается тебя куда-то вести. Что делать?",
    options: [
      { text: "Буду молчать, чтобы быть вежливым", correct: false },
      { text: "Громко кричу и убегаю в безопасное место", correct: true },
    ],
  },
];

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  answered: boolean;
  score: number;
  completed: boolean;
}

export default function Quiz() {
  const { playSound } = useSound();
  const { updateQuizScore } = useProgress();
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answered: false,
    score: 0,
    completed: false,
  });

  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    // Shuffle questions on mount
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  const currentQuestion = shuffledQuestions[state.currentQuestionIndex];
  const isCorrect = currentQuestion && state.selectedAnswer !== null && currentQuestion.options[state.selectedAnswer].correct;

  const handleAnswer = (optionIndex: number) => {
    if (state.answered) return;

    const correct = currentQuestion.options[optionIndex].correct;
    playSound(correct ? 'correct' : 'incorrect');

    setState(prev => ({
      ...prev,
      selectedAnswer: optionIndex,
      answered: true,
      score: prev.score + (correct ? 1 : 0),
    }));
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < shuffledQuestions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedAnswer: null,
        answered: false,
      }));
    } else {
      playSound('celebration');
      updateQuizScore(state.score + (isCorrect ? 1 : 0));
      setState(prev => ({
        ...prev,
        completed: true,
      }));
    }
  };

  const handleRestart = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setState({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answered: false,
      score: 0,
      completed: false,
    });
  };

  const handleBackHome = () => {
    window.location.href = '/';
  };

  if (shuffledQuestions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  const finalScore = state.completed ? (state.score + (isCorrect ? 1 : 0)) : state.score;
  const totalQuestions = shuffledQuestions.length;

  return (
    <div className="min-h-screen halftone-bg pb-12">
      {/* Header */}
      <div
        style={{ background: "linear-gradient(135deg, #1A237E 0%, #283593 100%)" }}
        className="text-white py-6"
      >
        <div className="container">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBackHome}
              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 font-bold text-sm transition-all"
            >
              ← Назад
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
                🧪 Режим Проверки
              </h1>
            </div>
            <div className="w-12" />
          </div>

          {/* Progress bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-yellow-400 h-full transition-all duration-300"
              style={{ width: `${((state.currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
          <div className="text-center text-sm font-bold mt-2">
            Вопрос {state.currentQuestionIndex + 1} из {totalQuestions}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {!state.completed ? (
          <div
            className="comic-panel max-w-2xl mx-auto"
            style={{
              backgroundColor: "white",
              borderColor: "#1A237E",
              boxShadow: "8px 8px 0px #1A237E",
            }}
          >
            {/* Question */}
            <div className="p-6 pb-4">
              <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: "#1A237E" }}>
                📋 {currentQuestion.ruleTitle}
              </div>
              <h2
                className="text-2xl font-black mb-6"
                style={{ fontFamily: "'Fredoka One', cursive", color: "#1A237E" }}
              >
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = state.selectedAnswer === idx;
                  const isAnswerCorrect = option.correct;
                  let bgColor = "white";
                  let borderColor = "#1A237E";

                  if (state.answered && isSelected) {
                    bgColor = isAnswerCorrect ? "#E8F5E9" : "#FFEBEE";
                    borderColor = isAnswerCorrect ? "#388E3C" : "#D32F2F";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={state.answered}
                      className="w-full text-left p-4 rounded-xl border-3 font-bold text-base transition-all duration-200"
                      style={{
                        borderWidth: "3px",
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        color: "#1a1a2e",
                        boxShadow: isSelected ? `4px 4px 0px ${borderColor}` : `3px 3px 0px #1A237E`,
                        opacity: state.answered && !isSelected ? 0.6 : 1,
                        cursor: state.answered ? "default" : "pointer",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {state.answered && isSelected && (
                          <span className="text-xl">{isAnswerCorrect ? "✅" : "❌"}</span>
                        )}
                        {option.text}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {state.answered && (
                <div
                  className="mt-6 p-4 rounded-xl border-2 animate-bounce-in"
                  style={{
                    backgroundColor: isCorrect ? "#E8F5E9" : "#FFEBEE",
                    borderColor: isCorrect ? "#388E3C" : "#D32F2F",
                  }}
                >
                  <div className="text-lg font-black" style={{ color: isCorrect ? "#1B5E20" : "#B71C1C" }}>
                    {isCorrect ? "🎉 Правильно!" : "😅 Неправильно!"}
                  </div>
                </div>
              )}
            </div>

            {/* Next button */}
            {state.answered && (
              <div className="p-6 pt-2 border-t-4" style={{ borderColor: "#1A237E" }}>
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl font-black text-white text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: "#1A237E",
                    boxShadow: "4px 4px 0px #3949AB",
                  }}
                >
                  {state.currentQuestionIndex === totalQuestions - 1 ? "Завершить 🏁" : "Далее →"}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Results Screen */
          <div
            className="comic-panel max-w-2xl mx-auto"
            style={{
              background: "linear-gradient(135deg, #1A237E 0%, #283593 100%)",
              borderColor: "#FFC107",
              boxShadow: "8px 8px 0px #F57F17",
            }}
          >
            <div className="p-8 text-center text-white">
              <div className="text-6xl mb-4 animate-celebration">🏆</div>

              <h2
                className="text-4xl mb-2"
                style={{ fontFamily: "'Fredoka One', cursive" }}
              >
                Отлично!
              </h2>

              <div className="text-5xl font-black mb-2" style={{ color: "#FFC107" }}>
                {finalScore}/{totalQuestions}
              </div>

              <p className="text-xl font-bold mb-8 text-blue-200">
                {finalScore === totalQuestions
                  ? "Ты идеальный супергерой! 🌟"
                  : finalScore >= 4
                  ? "Отличная работа! Ты почти готов! 💪"
                  : "Хороший результат! Повтори правила и попробуй снова! 📚"}
              </p>

              {/* Score breakdown */}
              <div className="bg-white/10 rounded-xl p-4 mb-6 border-2 border-white/30">
                <div className="text-sm font-bold text-blue-200 mb-3">Результаты по правилам:</div>
                <div className="space-y-2">
                  {shuffledQuestions.map((q, i) => {
                    const isAnsweredCorrectly = i < finalScore;
                    return (
                      <div key={q.ruleId} className="flex items-center gap-2 text-left">
                        <span className="text-lg">{isAnsweredCorrectly ? "✅" : "❌"}</span>
                        <span className="font-bold text-blue-100">{q.ruleTitle}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 rounded-xl font-black text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: "#FFC107",
                    color: "#1A237E",
                    boxShadow: "4px 4px 0px #F57F17",
                  }}
                >
                  🔄 Повторить тест
                </button>
                <button
                  onClick={handleBackHome}
                  className="flex-1 py-3 rounded-xl font-black text-lg text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderWidth: "2px",
                    borderColor: "white",
                  }}
                >
                  🏠 Домой
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
