import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { checkOpenEndedAnswer } from '../../services/geminiService';
import { ReviewItem, PersistenceEssay, ApiProvider } from '../../types';
import { PERSISTENCE_POOL, PERSISTENCE_ESSAYS } from '../../data/gameData';

interface PersistenceStageProps {
  onComplete: (score: number, reviewItems: ReviewItem[]) => void;
  level: number;
  apiKey: string;
  apiProvider: ApiProvider;
}

export const PersistenceStage: React.FC<PersistenceStageProps> = ({ onComplete, level, apiKey, apiProvider }) => {
  const [items, setItems] = useState<typeof PERSISTENCE_POOL>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [results, setResults] = useState<ReviewItem[]>([]);
  const [essayQuestion, setEssayQuestion] = useState<PersistenceEssay | null>(null);

  // Randomize questions on mount based on level
  useEffect(() => {
    // 1. Select items for current level
    let filtered = PERSISTENCE_POOL.filter(item => item.difficulty === level);
    
    // 2. If not enough items (less than 4), add items from previous levels
    if (filtered.length < 4) {
      const remaining = PERSISTENCE_POOL.filter(item => item.difficulty < level);
      filtered = [...filtered, ...remaining];
    }

    const shuffled = filtered.sort(() => 0.5 - Math.random());
    setItems(shuffled.slice(0, 4)); // Pick 4 random items

    // 3. Select Essay Question for current level
    let essayPool = PERSISTENCE_ESSAYS.filter(e => e.difficulty === level);
    // If empty (e.g., level 10), fallback
    if (essayPool.length === 0) {
        essayPool = PERSISTENCE_ESSAYS.filter(e => e.difficulty <= level);
    }
    // Ultimate fallback
    if (essayPool.length === 0) {
        essayPool = PERSISTENCE_ESSAYS;
    }
    
    const randomEssay = essayPool[Math.floor(Math.random() * essayPool.length)];
    setEssayQuestion(randomEssay);

  }, [level]);

  const handleSort = (selection: 'RAM' | 'DISK') => {
    const item = items[currentIndex];
    const isCorrect = item.type === selection;
    
    // Record result
    const newResult: ReviewItem = {
      id: `p-${item.id}`,
      stage: 'Mission 1: RAM vs DISK',
      question: item.text,
      userAnswer: selection,
      correctAnswer: item.type,
      isCorrect: isCorrect,
      explanation: item.explanation
    };

    setResults(prev => [...prev, newResult]);

    if (isCorrect) {
      setScore(s => s + 10);
    }
    
    if (currentIndex < items.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      setShowExplanation(true);
    }
  };

  const handleExplanationSubmit = async () => {
    if (!essayQuestion) return;

    setIsAiLoading(true);
    const result = await checkOpenEndedAnswer(
      essayQuestion.question,
      userAnswer,
      essayQuestion.context,
      apiKey,
      apiProvider
    );
    setIsAiLoading(false);
    setAiFeedback(result.feedback);
    
    // Add open-ended result to review items
    const openEndedResult: ReviewItem = {
      id: 'p-essay',
      stage: 'Mission 1: 심화 질문',
      question: essayQuestion.question,
      userAnswer: userAnswer,
      correctAnswer: essayQuestion.modelAnswer,
      isCorrect: result.isCorrect,
      explanation: result.feedback
    };
    
    setResults(prev => [...prev, openEndedResult]);

    if (result.isCorrect) setScore(s => s + 20);
  };

  if (items.length === 0 || !essayQuestion) return <div>Loading...</div>;

  if (showExplanation) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800">심화 질문: 영속성(Persistence)</h3>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-medium text-slate-700 mb-2">질문: {essayQuestion.question}</p>
          <textarea
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500"
            rows={3}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={!!aiFeedback}
            placeholder="자유롭게 작성해보세요..."
          />
        </div>
        
        {aiFeedback && (
           <div className={`p-4 rounded-lg text-sm ${aiFeedback.includes('오류') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
             <span className="font-bold">AI 피드백 ({apiProvider}):</span> {aiFeedback}
             <div className="mt-2 pt-2 border-t border-slate-200 text-slate-500 text-xs">
                <span className="font-bold">모범 답안:</span> {essayQuestion.modelAnswer}
             </div>
           </div>
        )}

        <div className="flex justify-end gap-2">
          {!aiFeedback ? (
            <Button onClick={handleExplanationSubmit} disabled={isAiLoading || userAnswer.length < 5}>
              {isAiLoading ? '분석 중...' : '제출 및 분석'}
            </Button>
          ) : (
            <Button onClick={() => onComplete(score, results)} variant="success">다음 미션으로</Button>
          )}
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const progress = ((currentIndex) / items.length) * 100;

  return (
    <div className="flex flex-col h-full justify-between py-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wider">Mission 1: 분류 작업 (Level {level})</h3>
        <p className="text-sm text-slate-400">데이터의 특성에 따라 저장소를 선택하세요.</p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
          <div className="bg-brand-500 h-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center my-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-slate-100 w-full max-w-sm text-center transform transition-all hover:scale-105">
          <span className="text-4xl block mb-4">💾</span>
          <h2 className="text-2xl font-bold text-slate-800">{currentItem.text}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleSort('RAM')}
          className="p-6 rounded-xl bg-orange-50 border-2 border-orange-200 hover:bg-orange-100 transition-colors text-orange-800 font-bold flex flex-col items-center gap-2"
        >
          <span>⚡ RAM</span>
          <span className="text-xs font-normal opacity-75">휘발성/빠름</span>
        </button>
        <button 
          onClick={() => handleSort('DISK')}
          className="p-6 rounded-xl bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 transition-colors text-blue-800 font-bold flex flex-col items-center gap-2"
        >
          <span>💿 DISK (DB)</span>
          <span className="text-xs font-normal opacity-75">영속성/안전</span>
        </button>
      </div>
    </div>
  );
};