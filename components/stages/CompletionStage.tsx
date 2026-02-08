import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../Button';
import { ReviewItem } from '../../types';

interface CompletionStageProps {
  score: number;
  userName: string;
  reviewItems: ReviewItem[];
  onRestart: () => void;
  difficultyLevel: number;
}

// Simple particle system for confetti
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;

  constructor(x: number, y: number, colors: string[]) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 2; // Initial upward burst
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.size = Math.random() * 5 + 2;
    this.life = 1.0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2; // Gravity
    this.vx *= 0.96; // Friction
    this.life -= 0.01;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

export const CompletionStage: React.FC<CompletionStageProps> = ({ score, userName, reviewItems, onRestart, difficultyLevel }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Filter state: 'all' | 'incorrect' | 'correct'
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>(() => {
    // If there are errors, default to showing errors. If perfect, show correct (or all).
    return reviewItems.some(item => !item.isCorrect) ? 'incorrect' : 'all';
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const incorrectItems = reviewItems.filter(item => !item.isCorrect);
  const correctItems = reviewItems.filter(item => item.isCorrect);
  
  const incorrectCount = incorrectItems.length;
  const correctCount = correctItems.length;

  // Filter items for display
  const displayedItems = reviewItems.filter(item => {
    if (filter === 'incorrect') return !item.isCorrect;
    if (filter === 'correct') return item.isCorrect;
    return true;
  });

  // Determine Tier
  let tierInfo = {
    emoji: '🌱',
    title: '수습 연구원',
    message: '시작이 반입니다! 다시 도전해보세요.',
    colorClass: 'text-slate-600',
    bgClass: 'bg-slate-100',
    showConfetti: false
  };

  if (score === 100) {
    tierInfo = {
      emoji: '👑',
      title: '전설의 아키텍트',
      message: '완벽합니다! 데이터베이스 마스터시군요!',
      colorClass: 'text-purple-600',
      bgClass: 'bg-purple-50 border-purple-200',
      showConfetti: true
    };
  } else if (score >= 90) {
    tierInfo = {
      emoji: '🥇',
      title: '수석 연구원',
      message: '탁월한 실력입니다! 거의 완벽해요.',
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-50 border-amber-200',
      showConfetti: true
    };
  } else if (score >= 80) {
    tierInfo = {
      emoji: '🥈',
      title: '선임 연구원',
      message: '훌륭합니다! 안정적인 지식을 갖추셨네요.',
      colorClass: 'text-slate-500', // Silver feel
      bgClass: 'bg-slate-100 border-slate-300',
      showConfetti: false
    };
  } else if (score >= 70) {
    tierInfo = {
      emoji: '🥉',
      title: '전임 연구원',
      message: '기본기가 탄탄하시네요. 조금만 더 힘내세요!',
      colorClass: 'text-orange-700', // Bronze feel
      bgClass: 'bg-orange-50 border-orange-200',
      showConfetti: false
    };
  }

  // Confetti Effect
  useEffect(() => {
    if (!tierInfo.showConfetti || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 300;
      canvas.height = canvas.parentElement?.offsetHeight || 300;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];

    // Initial burst
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(canvas.width / 2, canvas.height / 2 + 50, colors));
    }

    // Continuous small bursts for 100 points
    let frameId: number;
    let tick = 0;

    const animate = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (score === 100 && tick % 20 === 0 && tick < 200) {
         // Add more particles periodically for perfect score
         for (let i = 0; i < 10; i++) {
            particles.push(new Particle(Math.random() * canvas.width, canvas.height, colors));
         }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0 || tick < 200) {
        frameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, [tierInfo.showConfetti, score]);

  return (
    <div className="relative h-full flex flex-col text-center animate-fade-in">
      {/* Confetti Canvas Overlay */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-10" 
      />

      {/* Result Header */}
      <div className={`py-6 rounded-2xl mb-6 border-2 ${tierInfo.bgClass} transition-all duration-500`}>
        <div className="text-6xl mb-2 animate-bounce inline-block">
            {tierInfo.emoji}
        </div>
        <h2 className={`text-2xl font-black mb-1 ${tierInfo.colorClass}`}>
            {tierInfo.title}
        </h2>
        <p className="text-slate-600 text-sm font-medium px-4">
            {userName}님, {tierInfo.message}
        </p>
      </div>

      {/* Score Card */}
      <div className="flex justify-center items-center gap-6 mb-6">
        <div className="text-right">
             <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Score</div>
             <div className={`text-5xl font-black ${score === 100 ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' : 'text-slate-800'}`}>
                 {score}
             </div>
        </div>
        <div className="h-10 w-px bg-slate-300"></div>
        <div className="text-left space-y-1">
           <div className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
              <span className="mr-2">O</span> {correctCount} 정답
           </div>
           <div className="flex items-center text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
              <span className="mr-2">X</span> {incorrectCount} 오답
           </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="flex-1 overflow-hidden flex flex-col border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-3 mb-3 px-1">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 text-left">
                  <span>📝 학습 리포트</span>
              </h3>
              
              <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-bold w-full">
                  <button 
                      onClick={() => setFilter('all')}
                      className={`flex-1 py-2 rounded-md transition-all ${filter === 'all' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      전체 ({reviewItems.length})
                  </button>
                  <button 
                      onClick={() => setFilter('incorrect')}
                      disabled={incorrectCount === 0}
                      className={`flex-1 py-2 rounded-md transition-all ${filter === 'incorrect' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'} ${incorrectCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                      오답 노트 ({incorrectCount})
                  </button>
                  <button 
                      onClick={() => setFilter('correct')}
                      disabled={correctCount === 0}
                      className={`flex-1 py-2 rounded-md transition-all ${filter === 'correct' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'} ${correctCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                      정답 노트 ({correctCount})
                  </button>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-left pb-4 custom-scrollbar">
              {displayedItems.map(item => (
                  <div 
                      key={item.id} 
                      className={`border rounded-xl transition-all cursor-pointer overflow-hidden ${
                          expandedId === item.id 
                              ? (item.isCorrect ? 'bg-green-50 border-green-200 shadow-md' : 'bg-red-50 border-red-200 shadow-md')
                              : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                      <div className="p-4">
                          <div className="flex justify-between items-start gap-3">
                              <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                  {item.isCorrect ? 'O' : 'X'}
                              </div>
                              <div className="flex-1">
                                  <div className="text-xs text-slate-500 font-semibold mb-1 opacity-75">{item.stage}</div>
                                  <div className="font-medium text-slate-800 leading-snug">{item.question}</div>
                              </div>
                              <div className={`text-slate-300 transition-transform duration-200 ${expandedId === item.id ? 'rotate-180' : ''}`}>▼</div>
                          </div>
                          
                          {expandedId === item.id && (
                              <div className={`mt-3 pt-3 border-t text-sm animate-fade-in ${item.isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                                  <div className="flex gap-4 mb-3">
                                      <div className="flex-1">
                                          <span className="text-xs text-slate-400 block mb-1">내 답변</span>
                                          <span className={`font-bold block ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{item.userAnswer}</span>
                                      </div>
                                      <div className="flex-1">
                                          <span className="text-xs text-slate-400 block mb-1">정답</span>
                                          <span className="font-bold text-green-600 block">{item.correctAnswer}</span>
                                      </div>
                                  </div>
                                  <div className={`p-3 rounded-lg leading-relaxed ${item.isCorrect ? 'bg-green-50 text-green-900 border border-green-100' : 'bg-blue-50 text-blue-900 border border-blue-100'}`}>
                                      <span className="font-bold mr-1">💡 해설:</span>
                                      {item.explanation}
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              ))}
              
              {displayedItems.length === 0 && (
                  <div className="text-center py-10 text-slate-400">
                      표시할 항목이 없습니다.
                  </div>
              )}
          </div>
      </div>

      <div className="pt-4 mt-auto z-20 relative">
        <Button onClick={onRestart} variant="outline" className="w-full hover:bg-slate-50 border-slate-300 text-slate-600">
          {difficultyLevel < 4 ? `⚔️ 다음 레벨 도전하기 (Level ${difficultyLevel + 1})` : '↺ 처음부터 다시 하기 (Level 1)'}
        </Button>
      </div>
    </div>
  );
};