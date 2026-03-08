'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Beat {
  id: number;
  active: boolean;
  hit: boolean | null;
}

const rhythmPatterns = {
  simple: { beats: [1, 0, 1, 0, 1, 0, 1, 0], name: 'Simple Beat', bpm: 120 },
  complex: { beats: [1, 0, 1, 1, 0, 1, 0, 1], name: 'Complex Pattern', bpm: 110 },
  waltz: { beats: [1, 0, 0, 1, 0, 0, 1, 0, 0], name: 'Waltz (3/4)', bpm: 100 },
  syncopated: { beats: [1, 0, 1, 0, 0, 1, 1, 0], name: 'Syncopated', bpm: 130 },
};

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

export default function RhythmGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<keyof typeof rhythmPatterns>('simple');
  const [gameMode, setGameMode] = useState<'practice' | 'challenge'>('practice');
  const [userBeats, setUserBeats] = useState<Beat[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [round, setRound] = useState(1);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pattern = rhythmPatterns[selectedPattern];

  // Initialize user beats based on pattern
  useEffect(() => {
    const beats = pattern.beats.map((_, index) => ({
      id: index,
      active: false,
      hit: null,
    }));
    setUserBeats(beats);
  }, [selectedPattern, pattern.beats]);

  // Game timer for challenge mode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && gameMode === 'challenge' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, gameMode, timeLeft]);

  // Beat progression
  useEffect(() => {
    if (isPlaying) {
      const beatDuration = (60 / pattern.bpm) * 1000; // Convert BPM to milliseconds
      
      intervalRef.current = setInterval(() => {
        setCurrentBeat(prev => {
          const nextBeat = (prev + 1) % pattern.beats.length;
          
          // Complete pattern cycle - check score in challenge mode
          if (nextBeat === 0 && gameMode === 'challenge') {
            checkPatternScore();
            setRound(r => r + 1);
          }
          
          return nextBeat;
        });
      }, beatDuration);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, pattern.bpm, pattern.beats.length, gameMode]);

  const checkPatternScore = () => {
    let correct = 0;
    pattern.beats.forEach((shouldBeat, index) => {
      if (shouldBeat === 1 && userBeats[index]?.hit === true) {
        correct++;
      } else if (shouldBeat === 0 && userBeats[index]?.hit !== true) {
        correct++;
      }
    });

    const accuracy = correct / pattern.beats.length;
    if (accuracy >= 0.8) {
      const points = Math.round(accuracy * 100);
      setScore(s => s + points);
      setStreak(s => s + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
    } else {
      setStreak(0);
    }

    // Reset user beats for next pattern
    setUserBeats(beats => beats.map(beat => ({ ...beat, hit: null })));
  };

  const playSound = (frequency: number) => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        // Audio context might not be available
        console.warn('Audio not available');
      }
    }
  };

  const handleBeatTap = (beatIndex: number) => {
    setUserBeats(prev => prev.map(beat => 
      beat.id === beatIndex 
        ? { ...beat, hit: true }
        : beat
    ));

    // Play different sounds for different beats
    playSound(beatIndex === currentBeat ? 800 : 400);
  };

  const startGame = () => {
    setIsPlaying(true);
    setCurrentBeat(0);
    setScore(0);
    setStreak(0);
    setRound(1);
    setTimeLeft(30);
    setUserBeats(beats => beats.map(beat => ({ ...beat, hit: null })));
  };

  const stopGame = () => {
    setIsPlaying(false);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setCurrentBeat(0);
    setScore(0);
    setStreak(0);
    setRound(1);
    setTimeLeft(30);
    setUserBeats(beats => beats.map(beat => ({ ...beat, hit: null })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Games
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎵 Rhythm Tap</h1>
          <p className="text-gray-600 mb-4">Follow the beat and tap along to the rhythm</p>
        </header>

        {/* Mode Selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setGameMode('practice')}
              disabled={isPlaying}
              className={`px-6 py-2 rounded-md transition-colors ${
                gameMode === 'practice' ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => setGameMode('challenge')}
              disabled={isPlaying}
              className={`px-6 py-2 rounded-md transition-colors ${
                gameMode === 'challenge' ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Challenge
            </button>
          </div>
        </div>

        {/* Pattern Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Choose rhythm pattern:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(rhythmPatterns).map(([key, pattern]) => (
              <button
                key={key}
                onClick={() => setSelectedPattern(key as keyof typeof rhythmPatterns)}
                disabled={isPlaying}
                className={`p-3 rounded-lg text-sm transition-colors ${
                  selectedPattern === key
                    ? 'bg-pink-100 ring-2 ring-pink-500 text-pink-800'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-medium">{pattern.name}</div>
                <div className="text-xs opacity-75">{pattern.bpm} BPM</div>
              </button>
            ))}
          </div>
        </div>

        {/* Score Display */}
        {gameMode === 'challenge' && (
          <div className="flex justify-center gap-6 mb-6">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-center">
              <div className="text-sm text-gray-600">Score</div>
              <div className="font-bold text-lg text-pink-600">{score}</div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-center">
              <div className="text-sm text-gray-600">Streak</div>
              <div className="font-bold text-lg text-purple-600">{streak}</div>
            </div>
            {isPlaying && (
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-center">
                <div className="text-sm text-gray-600">Time</div>
                <div className="font-bold text-lg text-red-600">{timeLeft}s</div>
              </div>
            )}
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-center">
              <div className="text-sm text-gray-600">Round</div>
              <div className="font-bold text-lg text-blue-600">{round}</div>
            </div>
          </div>
        )}

        {/* Beat Pattern Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-center">Rhythm Pattern</h3>
          
          {/* Pattern beats (what should be played) */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Pattern to follow:</div>
            <div className="flex justify-center gap-2">
              {pattern.beats.map((beat, index) => (
                <div
                  key={`pattern-${index}`}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    beat === 1 ? 'bg-pink-400 border-pink-600' : 'bg-gray-200 border-gray-300'
                  } ${
                    index === currentBeat && isPlaying ? 'ring-4 ring-yellow-400 scale-125' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* User input beats */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Your taps:</div>
            <div className="flex justify-center gap-2 mb-4">
              {userBeats.map((beat, index) => (
                <button
                  key={`user-${beat.id}`}
                  onClick={() => handleBeatTap(index)}
                  disabled={!isPlaying}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    beat.hit === true 
                      ? 'bg-green-400 border-green-600' 
                      : beat.hit === false
                      ? 'bg-red-400 border-red-600'
                      : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                  } ${
                    !isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: beat.hit === true ? colors[index % colors.length] : undefined }}
                >
                  {beat.hit === true ? '✓' : beat.hit === false ? '✗' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="text-center space-y-4">
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
            >
              Start Playing
            </button>
          ) : (
            <button
              onClick={stopGame}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Stop
            </button>
          )}

          <div>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-2">🎵 How to Play:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Watch the pattern - filled circles should be tapped</li>
            <li>• Tap the buttons below to match the rhythm</li>
            <li>• The yellow ring shows the current beat position</li>
            <li>• In challenge mode, score points for accuracy</li>
            <li>• Practice mode lets you learn without pressure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}