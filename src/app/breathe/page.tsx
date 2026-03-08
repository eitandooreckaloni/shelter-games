'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Phase = 'inhale' | 'hold' | 'exhale' | 'pause';

const breathingPatterns = {
  basic: {
    name: '4-4-4-4 Basic',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
  },
  calm: {
    name: '4-7-8 Calming',
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 2,
  },
  energy: {
    name: '6-2-6-2 Energizing',
    inhale: 6,
    hold: 2,
    exhale: 6,
    pause: 2,
  },
  focus: {
    name: '5-5-5-5 Focus',
    inhale: 5,
    hold: 5,
    exhale: 5,
    pause: 5,
  },
};

const phaseMessages = {
  inhale: 'Breathe in slowly...',
  hold: 'Hold your breath...',
  exhale: 'Breathe out gently...',
  pause: 'Rest and relax...',
};

const phaseColors = {
  inhale: 'from-blue-400 to-blue-600',
  hold: 'from-purple-400 to-purple-600',
  exhale: 'from-green-400 to-green-600',
  pause: 'from-gray-400 to-gray-500',
};

export default function BreatheGame() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [totalTime, setTotalTime] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<keyof typeof breathingPatterns>('basic');

  const pattern = breathingPatterns[selectedPattern];

  const getNextPhase = useCallback((phase: Phase): Phase => {
    switch (phase) {
      case 'inhale': return 'hold';
      case 'hold': return 'exhale';
      case 'exhale': return 'pause';
      case 'pause': return 'inhale';
      default: return 'inhale';
    }
  }, []);

  const getCurrentPhaseDuration = useCallback((phase: Phase): number => {
    switch (phase) {
      case 'inhale': return pattern.inhale;
      case 'hold': return pattern.hold;
      case 'exhale': return pattern.exhale;
      case 'pause': return pattern.pause;
      default: return 4;
    }
  }, [pattern]);

  const resetTimer = useCallback(() => {
    setCurrentPhase('inhale');
    setTimeLeft(pattern.inhale);
    setCycles(0);
    setTotalTime(0);
  }, [pattern.inhale]);

  useEffect(() => {
    resetTimer();
  }, [selectedPattern, resetTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const nextPhase = getNextPhase(currentPhase);
            setCurrentPhase(nextPhase);
            
            // Increment cycle when completing a full cycle
            if (currentPhase === 'pause') {
              setCycles(c => c + 1);
            }
            
            return getCurrentPhaseDuration(nextPhase);
          }
          return prev - 1;
        });

        setTotalTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentPhase, getNextPhase, getCurrentPhaseDuration]);

  const startStop = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    resetTimer();
  };

  const getCircleScale = () => {
    const progress = 1 - (timeLeft / getCurrentPhaseDuration(currentPhase));
    switch (currentPhase) {
      case 'inhale':
        return 0.5 + (progress * 0.5); // Scale from 50% to 100%
      case 'exhale':
        return 1 - (progress * 0.5); // Scale from 100% to 50%
      default:
        return currentPhase === 'hold' ? 1 : 0.5;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Games
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🌸 Breathing Buddy</h1>
          <p className="text-gray-600 mb-4">Guided breathing exercises for calm and relaxation</p>
        </header>

        {/* Pattern selection */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Choose a breathing pattern:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(breathingPatterns).map(([key, pattern]) => (
              <button
                key={key}
                onClick={() => setSelectedPattern(key as keyof typeof breathingPatterns)}
                disabled={isActive}
                className={`p-3 rounded-lg text-sm transition-colors ${
                  selectedPattern === key
                    ? 'bg-blue-100 ring-2 ring-blue-500 text-blue-800'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-medium">{pattern.name}</div>
                <div className="text-xs opacity-75">
                  In:{pattern.inhale}s - Hold:{pattern.hold}s - Out:{pattern.exhale}s - Pause:{pattern.pause}s
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main breathing circle */}
        <div className="text-center mb-8">
          <div className="relative mx-auto mb-6" style={{ width: '300px', height: '300px' }}>
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColors[currentPhase]} transition-all duration-1000 ease-in-out flex items-center justify-center shadow-2xl`}
              style={{
                transform: `scale(${getCircleScale()})`,
              }}
            >
              <div className="text-white text-center">
                <div className="text-2xl font-bold mb-2">{timeLeft}</div>
                <div className="text-lg opacity-90">{phaseMessages[currentPhase]}</div>
              </div>
            </div>
          </div>

          <div className="text-lg font-semibold text-gray-700 mb-4 capitalize">
            {currentPhase} Phase
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-center">
            <div className="text-sm text-gray-600">Cycles</div>
            <div className="font-semibold text-lg">{cycles}</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-center">
            <div className="text-sm text-gray-600">Total Time</div>
            <div className="font-semibold text-lg">{formatTime(totalTime)}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="text-center space-y-4">
          <button
            onClick={startStop}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
              isActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isActive ? 'Pause' : 'Start Breathing'}
          </button>

          <div>
            <button
              onClick={reset}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Breathing Tips:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Find a comfortable position, sitting or lying down</li>
            <li>• Focus on your breath and try to breathe with your diaphragm</li>
            <li>• Don't force it - if a pattern feels uncomfortable, try a different one</li>
            <li>• Start with just a few cycles and gradually increase</li>
            <li>• Regular practice helps reduce stress and anxiety</li>
          </ul>
        </div>
      </div>
    </div>
  );
}