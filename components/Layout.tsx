import React from 'react';
import { GameState, StageType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  gameState: GameState;
}

export const Layout: React.FC<LayoutProps> = ({ children, gameState }) => {
  const getProgress = () => {
    const stages = Object.values(StageType);
    const currentIndex = stages.indexOf(gameState.currentStage);
    return ((currentIndex) / (stages.length - 1)) * 100;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 font-sans">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <header className="mb-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2">
               <h1 className="text-2xl font-bold text-slate-800">DB Architect</h1>
               {gameState.currentStage !== StageType.INTRO && (
                 <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full border border-brand-200">
                   Level {gameState.difficultyLevel}
                 </span>
               )}
            </div>
            <p className="text-slate-500 text-sm">ClapCampus Module 1</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-brand-600">
              Score: {gameState.score} XP
            </div>
            <div className="text-xs text-slate-400">
              Player: {gameState.userName || 'Guest'}
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-200 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-brand-500 transition-all duration-500 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        {/* Content Card */}
        <main className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 min-h-[400px] flex flex-col relative overflow-hidden">
           {children}
        </main>
      </div>
    </div>
  );
};