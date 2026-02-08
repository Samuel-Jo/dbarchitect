import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { IntroStage } from './components/stages/IntroStage';
import { PersistenceStage } from './components/stages/PersistenceStage';
import { TerminologyStage } from './components/stages/TerminologyStage';
import { KeyIndexStage } from './components/stages/KeyIndexStage';
import { ScenarioStage } from './components/stages/ScenarioStage';
import { CompletionStage } from './components/stages/CompletionStage';
import { GameState, StageType, ReviewItem, ApiProvider } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentStage: StageType.INTRO,
    score: 0,
    maxScore: 100,
    userName: '',
    reviewItems: [],
    difficultyLevel: 1, // Start at Level 1
    apiKey: '',
    apiProvider: 'GEMINI'
  });

  const handleIntroComplete = (name: string, apiKey: string, provider: ApiProvider) => {
    setGameState(prev => ({
      ...prev,
      userName: name,
      apiKey: apiKey,
      apiProvider: provider,
      currentStage: StageType.PERSISTENCE,
      difficultyLevel: 1
    }));
  };

  const handleStageComplete = (scoreToAdd: number, nextStage: StageType, newReviewItems: ReviewItem[] = []) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + scoreToAdd,
      currentStage: nextStage,
      reviewItems: [...prev.reviewItems, ...newReviewItems]
    }));
  };

  const handleRestart = () => {
    setGameState(prev => {
      // Increase difficulty, capped at 4
      const nextLevel = Math.min(prev.difficultyLevel + 1, 4);
      
      return {
        currentStage: StageType.PERSISTENCE, // Skip Intro on restart
        score: 0,
        maxScore: 100,
        userName: prev.userName, // Keep name, key, and provider
        apiKey: prev.apiKey,
        apiProvider: prev.apiProvider,
        reviewItems: [],
        difficultyLevel: nextLevel
      };
    });
  };

  const renderStage = () => {
    switch (gameState.currentStage) {
      case StageType.INTRO:
        return <IntroStage onComplete={handleIntroComplete} />;
      case StageType.PERSISTENCE:
        return <PersistenceStage 
                  level={gameState.difficultyLevel} 
                  apiKey={gameState.apiKey || ''}
                  apiProvider={gameState.apiProvider || 'GEMINI'}
                  onComplete={(s, items) => handleStageComplete(s, StageType.TERMINOLOGY, items)} 
               />;
      case StageType.TERMINOLOGY:
        return <TerminologyStage 
                  level={gameState.difficultyLevel}
                  onComplete={(s, items) => handleStageComplete(s, StageType.KEYS_INDEX, items)} 
               />;
      case StageType.KEYS_INDEX:
        return <KeyIndexStage 
                  level={gameState.difficultyLevel}
                  onComplete={(s, items) => handleStageComplete(s, StageType.SCENARIOS, items)} 
               />;
      case StageType.SCENARIOS:
        return <ScenarioStage 
                  level={gameState.difficultyLevel}
                  onComplete={(s, items) => handleStageComplete(s, StageType.COMPLETION, items)} 
               />;
      case StageType.COMPLETION:
        return <CompletionStage 
          score={gameState.score} 
          userName={gameState.userName} 
          reviewItems={gameState.reviewItems}
          onRestart={handleRestart}
          difficultyLevel={gameState.difficultyLevel}
        />;
      default:
        return <div>Unknown Stage</div>;
    }
  };

  return (
    <Layout gameState={gameState}>
      {renderStage()}
    </Layout>
  );
}

export default App;