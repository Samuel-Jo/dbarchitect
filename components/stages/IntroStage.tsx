import React, { useState } from 'react';
import { Button } from '../Button';
import { ApiProvider } from '../../types';

interface IntroStageProps {
  onComplete: (name: string, apiKey: string, provider: ApiProvider) => void;
}

export const IntroStage: React.FC<IntroStageProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<ApiProvider>('GEMINI');

  return (
    <div className="flex flex-col h-full justify-center items-center text-center space-y-6 animate-fade-in w-full max-w-md mx-auto">
      <div className="bg-brand-100 p-4 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">데이터베이스 설계 입문</h2>
        <p className="text-slate-600">
          DB 기초 실전 과정에 오신 것을 환영합니다.<br/>
          총 5개의 미션을 통해 데이터베이스의 핵심 개념을 마스터하세요.
        </p>
      </div>

      <div className="w-full space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 text-left">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">참가자 이름</label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="pt-2 border-t border-slate-200">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">AI 설정 (필수)</label>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setProvider('GEMINI')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${
                provider === 'GEMINI' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700' 
                  : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
              }`}
            >
              Google Gemini
            </button>
            <button
              onClick={() => setProvider('OPENAI')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${
                provider === 'OPENAI' 
                  ? 'bg-green-50 border-green-500 text-green-700' 
                  : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
              }`}
            >
              OpenAI (GPT)
            </button>
          </div>
          <input
            type="password"
            placeholder={`${provider === 'GEMINI' ? 'Gemini' : 'OpenAI'} API Key 입력`}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm font-mono"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1">
            * 12명 동시 접속 시 오류 방지를 위해 개인 API Key를 사용합니다.
          </p>
        </div>
      </div>

      <Button 
        className="w-full shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5" 
        onClick={() => onComplete(name || 'Architect', apiKey, provider)}
        disabled={name.length === 0 || apiKey.length < 10}
      >
        미션 시작하기
      </Button>
    </div>
  );
};