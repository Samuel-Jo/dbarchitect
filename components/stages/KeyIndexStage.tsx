import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { ReviewItem, TableScenario } from '../../types';
import { PK_SCENARIOS } from '../../data/gameData';

interface KeyIndexStageProps {
  onComplete: (score: number, reviewItems: ReviewItem[]) => void;
  level: number;
}

export const KeyIndexStage: React.FC<KeyIndexStageProps> = ({ onComplete, level }) => {
  const [scenario, setScenario] = useState<TableScenario | null>(null);
  const [step, setStep] = useState<'PK' | 'INDEX'>('PK');
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [indexSimulated, setIndexSimulated] = useState(false);
  const [searchTime, setSearchTime] = useState<{ with: number, without: number } | null>(null);
  const [pkAttempts, setPkAttempts] = useState<string[]>([]);

  // Pick random scenario on mount based on level
  useEffect(() => {
    let pool = PK_SCENARIOS.filter(s => s.difficulty === level);
    if (pool.length === 0) pool = PK_SCENARIOS.filter(s => s.difficulty < level); // Fallback
    if (pool.length === 0) pool = PK_SCENARIOS; // Ultimate fallback

    const randomScenario = pool[Math.floor(Math.random() * pool.length)];
    setScenario(randomScenario);
  }, [level]);
  
  const handlePkSelect = (colId: string) => {
    setSelectedCol(colId);
  };

  const confirmPk = () => {
    if (!scenario || !selectedCol) return;

    const col = scenario.columns.find(c => c.id === selectedCol);
    if (col && col.isPk) {
      setStep('INDEX');
    } else {
      if (selectedCol) setPkAttempts(prev => [...prev, selectedCol]);
      alert("선택한 컬럼은 중복될 수 있거나, 값이 변경될 가능성이 있어 기본 키(PK)로 부적합합니다.\n(유일하고 변하지 않는 값을 찾아보세요)");
    }
  };

  const handleComplete = () => {
    if (!scenario) return;

    // Report results
    const reviewItems: ReviewItem[] = [];
    const hadWrongAttempt = pkAttempts.length > 0;
    const correctCol = scenario.columns.find(c => c.isPk);

    reviewItems.push({
      id: 'pk-select',
      stage: 'Mission 3: PK 선정',
      question: `${scenario.title}의 기본 키(PK)로 가장 적절한 것은?`,
      userAnswer: hadWrongAttempt ? '오답 선택 후 정답 맞춤' : (correctCol?.label || ''),
      correctAnswer: correctCol?.label || '',
      isCorrect: !hadWrongAttempt,
      explanation: '기본 키(Primary Key)는 중복되지 않아야 하며(Unique), 시간이 지나도 변하지 않는(NotNull/Immutable) 속성을 가져야 합니다.'
    });

    onComplete(20, reviewItems);
  };

  const runIndexSimulation = () => {
    setIndexSimulated(true);
    setTimeout(() => {
        setSearchTime({ without: 1200, with: 5 });
    }, 1500);
  };

  if (!scenario) return <div>Loading...</div>;

  if (step === 'PK') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-500 uppercase">Mission 3: 기본 키(PK) 선정 (Level {level})</h3>
          <p className="text-sm text-slate-400">아래 <strong>{scenario.title}</strong> 데이터에서 유일하게 식별 가능한 컬럼을 선택하세요.</p>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                {scenario.columns.map(col => (
                  <th 
                    key={col.id} 
                    onClick={() => handlePkSelect(col.id)}
                    className={`px-6 py-4 cursor-pointer hover:bg-slate-100 border-b-4 transition-colors ${selectedCol === col.id ? 'border-brand-500 bg-brand-50' : 'border-transparent'}`}
                  >
                    <div className="flex items-center gap-2">
                       {col.label}
                       {selectedCol === col.id && <span className="text-brand-600">✓</span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Sample Row 1 */}
              <tr className="bg-white border-b hover:bg-slate-50">
                {scenario.columns.map(col => (
                    <td key={col.id} className="px-6 py-4 font-medium text-slate-900">{col.value}</td>
                ))}
              </tr>
              {/* Sample Row 2 (Dummy for visualization) */}
              <tr className="bg-white border-b hover:bg-slate-50 opacity-50">
                 {scenario.columns.map(col => (
                    <td key={col.id} className="px-6 py-4 font-medium">...</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <Button onClick={confirmPk} disabled={!selectedCol}>
            선택 완료
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-center">
      <div>
        <h3 className="text-lg font-bold text-slate-500 uppercase">Mission 3.5: 인덱스(Index)의 힘</h3>
        <p className="text-sm text-slate-400">
            10만 개의 데이터에서 <strong>'{scenario.searchTarget}'</strong>을(를) 찾는데 걸리는 시간을 비교합니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-4">인덱스 없음 (Full Scan)</h4>
          <div className="h-24 flex items-center justify-center">
            {indexSimulated && !searchTime && <span className="animate-pulse text-4xl">🔍...</span>}
            {searchTime && <span className="text-4xl font-bold text-red-500">{searchTime.without}ms</span>}
            {!indexSimulated && <span className="text-4xl opacity-20">🐢</span>}
          </div>
          <p className="text-xs text-slate-400 mt-2">1페이지부터 끝까지 다 뒤짐</p>
        </div>

        <div className="bg-brand-50 p-6 rounded-xl border border-brand-200">
          <h4 className="font-bold text-brand-700 mb-4">인덱스 적용 (B-Tree)</h4>
          <div className="h-24 flex items-center justify-center">
            {indexSimulated && !searchTime && <span className="animate-pulse text-4xl">🚀</span>}
            {searchTime && <span className="text-4xl font-bold text-brand-600">{searchTime.with}ms</span>}
            {!indexSimulated && <span className="text-4xl opacity-20">⚡</span>}
          </div>
          <p className="text-xs text-slate-400 mt-2">책 뒤의 '찾아보기' 색인 활용</p>
        </div>
      </div>

      {!indexSimulated ? (
        <Button onClick={runIndexSimulation} className="mx-auto w-full max-w-xs">
          시뮬레이션 시작
        </Button>
      ) : (
         <Button onClick={handleComplete} variant="success" className="mx-auto" disabled={!searchTime}>
          다음 미션으로
        </Button>
      )}
    </div>
  );
};