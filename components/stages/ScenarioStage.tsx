import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { ReviewItem } from '../../types';
import { TECH_SCENARIOS } from '../../data/gameData';

interface ScenarioStageProps {
  onComplete: (score: number, reviewItems: ReviewItem[]) => void;
  level: number;
}

export const ScenarioStage: React.FC<ScenarioStageProps> = ({ onComplete, level }) => {
  const [questions, setQuestions] = useState<typeof TECH_SCENARIOS>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<ReviewItem[]>([]);

  // Randomize questions based on level
  useEffect(() => {
    // 1. Filter by level
    let filtered = TECH_SCENARIOS.filter(item => item.difficulty === level);
    // 2. Fallback if not enough
    if (filtered.length < 2) {
        const remaining = TECH_SCENARIOS.filter(item => item.difficulty < level);
        filtered = [...filtered, ...remaining];
    }

    // Pick 2 random scenarios
    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 2);
    setQuestions(shuffled);
  }, [level]);

  const handleAnswer = (optionLabel: string, isCorrect: boolean) => {
    const scenario = questions[currentQ];
    const newScore = score + (isCorrect ? 15 : 0);
    setScore(newScore);

    const result: ReviewItem = {
        id: `s-${scenario.id}`,
        stage: 'Final Mission: 기술 선정',
        question: scenario.desc,
        userAnswer: optionLabel,
        correctAnswer: scenario.options.find(o => o.correct)?.label || '',
        isCorrect: isCorrect,
        explanation: scenario.explanation
    };
    
    const newResults = [...results, result];
    setResults(newResults);

    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      onComplete(newScore, newResults);
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const scenario = questions[currentQ];

  return (
    <div className="h-full flex flex-col justify-center items-center space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wider mb-2">Final Mission: 기술 선정 (Level {level})</h3>
        <p className="text-slate-400">상황에 맞는 데이터베이스 기술을 선택하세요.</p>
        <div className="flex justify-center mt-2 gap-1">
            {questions.map((_, idx) => (
                <div key={idx} className={`h-2 w-2 rounded-full ${idx === currentQ ? 'bg-brand-500' : 'bg-slate-200'}`} />
            ))}
        </div>
      </div>

      <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg max-w-lg w-full text-center">
        <p className="text-lg leading-relaxed">"{scenario.desc}"</p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        {scenario.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt.label, opt.correct)}
            className="py-4 px-6 rounded-lg font-bold text-lg bg-white border-2 border-slate-200 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 transition-all shadow-sm"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};