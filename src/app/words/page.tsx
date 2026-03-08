'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const wordCategories = {
  animals: ['CAT', 'DOG', 'BIRD', 'FISH', 'RABBIT', 'HORSE', 'LION', 'ELEPHANT', 'MONKEY', 'TIGER'],
  colors: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'BLACK', 'WHITE', 'BROWN'],
  fruits: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'LEMON', 'CHERRY', 'PEACH', 'PEAR', 'MELON', 'BERRY'],
  family: ['MOM', 'DAD', 'SISTER', 'BROTHER', 'BABY', 'GRANDMA', 'GRANDPA', 'AUNT', 'UNCLE', 'COUSIN'],
  nature: ['TREE', 'FLOWER', 'GRASS', 'MOUNTAIN', 'RIVER', 'OCEAN', 'SUN', 'MOON', 'STAR', 'CLOUD'],
};

type Category = keyof typeof wordCategories;

export default function WordGame() {
  const [currentWord, setCurrentWord] = useState('');
  const [currentCategory, setCurrentCategory] = useState<Category>('animals');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [score, setScore] = useState(0);

  const maxWrongGuesses = 6;

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const categories = Object.keys(wordCategories) as Category[];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const words = wordCategories[randomCategory];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    setCurrentWord(randomWord);
    setCurrentCategory(randomCategory);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameWon(false);
    setGameLost(false);
  };

  const handleLetterGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || gameWon || gameLost) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!currentWord.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameLost(true);
      }
    } else {
      // Check if word is complete
      const wordCompleted = currentWord.split('').every(char => newGuessedLetters.includes(char));
      if (wordCompleted) {
        setGameWon(true);
        setScore(prev => prev + 10);
      }
    }
  };

  const displayWord = () => {
    return currentWord
      .split('')
      .map(letter => guessedLetters.includes(letter) ? letter : '_')
      .join(' ');
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Games
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Word Play</h1>
          <p className="text-gray-600 mb-4">Guess the word letter by letter</p>
          
          <div className="flex justify-center gap-6 mb-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600">Score: </span>
              <span className="font-semibold">{score}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600">Category: </span>
              <span className="font-semibold capitalize">{currentCategory}</span>
            </div>
          </div>
        </header>

        <div className="text-center mb-8">
          {/* Hangman visual */}
          <div className="text-6xl mb-4">
            {wrongGuesses === 0 && '😊'}
            {wrongGuesses === 1 && '😐'}
            {wrongGuesses === 2 && '😕'}
            {wrongGuesses === 3 && '😟'}
            {wrongGuesses === 4 && '😨'}
            {wrongGuesses === 5 && '😰'}
            {wrongGuesses >= 6 && '😵'}
          </div>

          {/* Word display */}
          <div className="text-3xl font-mono font-bold text-gray-800 mb-4 tracking-wide">
            {displayWord()}
          </div>

          {/* Game status */}
          {gameWon && (
            <div className="mb-6 p-4 bg-green-100 rounded-lg border border-green-200">
              <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Great job!</h2>
              <p className="text-gray-700">You guessed the word correctly!</p>
            </div>
          )}

          {gameLost && (
            <div className="mb-6 p-4 bg-red-100 rounded-lg border border-red-200">
              <h2 className="text-2xl font-bold text-red-700 mb-2">😔 Not this time</h2>
              <p className="text-gray-700">The word was: <span className="font-bold">{currentWord}</span></p>
            </div>
          )}

          <div className="text-sm text-gray-600 mb-4">
            Wrong guesses: {wrongGuesses}/{maxWrongGuesses}
          </div>
        </div>

        {/* Alphabet */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mb-6">
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => handleLetterGuess(letter)}
              disabled={guessedLetters.includes(letter)}
              className={`
                h-12 w-12 rounded-lg font-bold transition-all duration-200
                ${guessedLetters.includes(letter)
                  ? currentWord.includes(letter)
                    ? 'bg-green-200 text-green-800 cursor-not-allowed'
                    : 'bg-red-200 text-red-800 cursor-not-allowed'
                  : 'bg-white hover:bg-yellow-100 text-gray-800 shadow-sm hover:shadow-md'
                }
              `}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={startNewGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {gameWon || gameLost ? 'Next Word' : 'New Word'}
          </button>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>💡 Tip: Think about the category to help guess the word!</p>
        </div>
      </div>
    </div>
  );
}