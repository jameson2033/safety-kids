/**
 * Hook for managing user progress and localStorage persistence
 */

import { useState, useEffect } from 'react';

export interface RuleProgress {
  ruleId: number;
  completed: boolean;
  correctAnswers: number;
  attempts: number;
}

export interface ProgressData {
  completedRules: RuleProgress[];
  quizAttempts: number;
  quizBestScore: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'safety-kids-progress';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : getInitialProgress();
    } catch {
      return getInitialProgress();
    }
  });

  const saveProgress = (newProgress: ProgressData) => {
    try {
      setProgress(newProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const completeRule = (ruleId: number, correct: boolean) => {
    const newProgress = { ...progress };
    const existing = newProgress.completedRules.find(r => r.ruleId === ruleId);

    if (existing) {
      existing.attempts += 1;
      if (correct) existing.correctAnswers += 1;
      if (existing.correctAnswers > 0) existing.completed = true;
    } else {
      newProgress.completedRules.push({
        ruleId,
        completed: correct,
        correctAnswers: correct ? 1 : 0,
        attempts: 1,
      });
    }

    newProgress.lastUpdated = new Date().toISOString();
    saveProgress(newProgress);
  };

  const updateQuizScore = (score: number) => {
    const newProgress = { ...progress };
    newProgress.quizAttempts += 1;
    if (score > newProgress.quizBestScore) {
      newProgress.quizBestScore = score;
    }
    newProgress.lastUpdated = new Date().toISOString();
    saveProgress(newProgress);
  };

  const resetProgress = () => {
    saveProgress(getInitialProgress());
  };

  const getCompletionPercentage = () => {
    const completed = progress.completedRules.filter(r => r.completed).length;
    return Math.round((completed / 5) * 100);
  };

  return {
    progress,
    completeRule,
    updateQuizScore,
    resetProgress,
    getCompletionPercentage,
  };
}

function getInitialProgress(): ProgressData {
  return {
    completedRules: [],
    quizAttempts: 0,
    quizBestScore: 0,
    lastUpdated: new Date().toISOString(),
  };
}
