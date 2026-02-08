import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { MatchingPair, ReviewItem } from '../../types';
import { TERMINOLOGY_POOL } from '../../data/gameData';

interface TerminologyStageProps {
  onComplete: (score: number, reviewItems: ReviewItem[]) => void;
  level: number;
}

export const TerminologyStage: React.FC<TerminologyStageProps> = ({ onComplete, level }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [pairs, setPairs] = useState<MatchingPair[]>([]);
  const [rightItems, setRightItems] = useState<{id: string, text: string}[]>([]);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  // Initialize randomized pairs based on level
  useEffect(() => {
    // 1. Filter by level
    let filtered = TERMINOLOGY_POOL.filter(item => item.difficulty === level);
    // 2. Fallback
    if (filtered.length < 4) {
       const remaining = TERMINOLOGY_POOL.filter(item => item.difficulty < level);
       filtered = [...filtered, ...remaining];
    }
    
    // Shuffle and pick 4 pairs
    const shuffledPairs = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 4);
    setPairs(shuffledPairs);

    // Shuffle right side items specifically
    const shuffledRight = [...shuffledPairs]
      .sort(() => 0.5 - Math.random())
      .map(p => ({ id: p.id, text: p.right }));
    setRightItems(shuffledRight);
  }, [level]);

  const handleLeftClick = (id: string) => {
    if (matches.has(id)) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (matches.has(id)) return;
    if (!selectedLeft) return;

    if (selectedLeft === id) {
      // Correct match
      setMatches(prev => new Set([...prev, id]));
      if (!errors.has(id)) {
        setScore(s => s + 15);
      }
      setSelectedLeft(null);
    } else {
      // Wrong match
      setErrors(prev => new Set([...prev, selectedLeft]));
      setSelectedLeft(null);
    }
  };

  const handleComplete = () => {
    const reviewItems: ReviewItem[] = pairs.map(pair => {
      const isWrong = errors.has(pair.id);
      return {
        id: `t-${pair.id}`,
        stage: 'Mission 2: 용어 매칭',
        question: `엑셀의 '${pair.left}'에 해당하는 DB 용어는?`,
        userAnswer: isWrong ? '(오답 선택)' : pair.right,
        correctAnswer: pair.right,
        isCorrect: !isWrong,
        explanation: `${pair.left}은(는) 데이터베이스에서 ${pair.right}라고 부릅니다.`
      };
    });

    onComplete(score, reviewItems);
  };

  const isComplete = pairs.length > 0 && matches.size === pairs.length;

  if (pairs.length === 0) return <div>Loading...</div>;

  return (
    <div className="h-full flex flex-col">
       <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wider">Mission 2: 용어 매칭 (Level {level})</h3>
        <p className="text-sm text-slate-400">엑셀 용어를 DB 용어로 번역하세요.</p>
        <p className="text-xs text-brand-600 mt-2 font-medium bg-brand-50 inline-block px-3 py-1 rounded-full border border-brand-100">
            👆 왼쪽(엑셀) 항목을 먼저 클릭 후, 오른쪽(DB) 정답을 클릭하여 짝을 맞추세요!
        </p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <h4 className="text-center text-sm font-semibold text-green-600 mb-2">Excel (엑셀)</h4>
          {pairs.map(item => (
            <button
              key={item.id}
              onClick={() => handleLeftClick(item.id)}
              disabled={matches.has(item.id)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                matches.has(item.id) 
                  ? 'bg-slate-100 border-slate-200 text-slate-400'
                  : selectedLeft === item.id
                    ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-md ring-2 ring-brand-200'
                    : 'bg-white border-slate-200 hover:border-brand-300 text-slate-700'
              }`}
            >
              {item.left}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="text-center text-sm font-semibold text-blue-600 mb-2">Database (DB)</h4>
          {rightItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleRightClick(item.id)}
              disabled={matches.has(item.id)}
              className={`w-full p-4 rounded-lg border-2 text-right transition-all ${
                matches.has(item.id)
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'bg-white border-slate-200 hover:border-brand-300 text-slate-700'
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        {isComplete && (
          <Button onClick={handleComplete} variant="success" className="animate-bounce">
            다음 단계로 이동
          </Button>
        )}
      </div>
    </div>
  );
};