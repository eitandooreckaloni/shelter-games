'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const emojis = ['🌸', '🌺', '🌻', '🌷', '🦋', '🐝', '🌈', '⭐', '🎈', '🎀', '🍎', '🍊'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameEmojis = emojis.slice(0, 8); // Use 8 different emojis
    const cardPairs = [...gameEmojis, ...gameEmojis]; // Create pairs
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameComplete(false);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Flip the card
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    // Check for match after second card is flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [firstCard, secondCard] = newFlippedCards;
        if (cards[firstCard].emoji === cards[secondCard].emoji) {
          // Match found
          setCards(prev => prev.map(card => 
            card.id === firstCard || card.id === secondCard
              ? { ...card, isMatched: true }
              : card
          ));
          setMatchedPairs(prev => prev + 1);
          
          // Check if game is complete
          if (matchedPairs + 1 === 8) {
            setGameComplete(true);
          }
        } else {
          // No match, flip cards back
          setCards(prev => prev.map(card => 
            card.id === firstCard || card.id === secondCard
              ? { ...card, isFlipped: false }
              : card
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Games
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🧠 Memory Match</h1>
          <p className="text-gray-600 mb-4">Find matching pairs by flipping cards</p>
          
          <div className="flex justify-center gap-6 mb-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600">Moves: </span>
              <span className="font-semibold">{moves}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600">Pairs: </span>
              <span className="font-semibold">{matchedPairs}/8</span>
            </div>
          </div>
          
          <button
            onClick={initializeGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            New Game
          </button>
        </header>

        {gameComplete && (
          <div className="text-center mb-6 p-4 bg-yellow-100 rounded-lg border border-yellow-200">
            <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Congratulations!</h2>
            <p className="text-gray-700">You completed the game in {moves} moves!</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center text-3xl
                ${card.isFlipped || card.isMatched
                  ? 'bg-white shadow-md transform scale-105'
                  : 'bg-green-200 hover:bg-green-300 shadow-sm'
                }
                ${card.isMatched ? 'ring-4 ring-green-400' : ''}
              `}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>💡 Tip: Try to remember the positions of cards you've seen!</p>
        </div>
      </div>
    </div>
  );
}