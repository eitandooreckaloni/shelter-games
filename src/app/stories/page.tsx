'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  emoji: string;
  scenes: Scene[];
}

interface Scene {
  text: string;
  image: string;
  choices?: Choice[];
}

interface Choice {
  text: string;
  nextScene: number;
}

const stories: Story[] = [
  {
    id: 'magical-garden',
    title: 'The Magical Garden',
    emoji: '🌺',
    scenes: [
      {
        text: "Once upon a time, there was a little seed that lived in a dark place underground. The seed was very small and felt lonely.",
        image: '🌱',
        choices: [
          { text: 'The seed decides to try growing', nextScene: 1 },
          { text: 'The seed stays comfortable in the dark', nextScene: 2 }
        ]
      },
      {
        text: "The brave little seed pushed up through the soil. It was hard work, but soon it felt warm sunshine on its tiny green leaves!",
        image: '🌿',
        choices: [
          { text: 'Keep growing toward the sun', nextScene: 3 },
          { text: 'Make friends with nearby plants', nextScene: 4 }
        ]
      },
      {
        text: "The seed decided to stay cozy underground. But after a while, it heard beautiful sounds from above - birds singing and children laughing.",
        image: '🌰',
        choices: [
          { text: 'Get curious about the sounds above', nextScene: 1 },
          { text: 'Listen to the underground earthworm stories', nextScene: 5 }
        ]
      },
      {
        text: "The little plant grew bigger and stronger each day. Soon it had beautiful flowers that attracted butterflies and bees!",
        image: '🌸',
        choices: [
          { text: 'Share nectar with the butterflies', nextScene: 6 },
          { text: 'Grow even taller to see further', nextScene: 7 }
        ]
      },
      {
        text: "The plant made friends with a wise old oak tree and cheerful daisies. They all grew together in harmony.",
        image: '🌳',
        choices: [
          { text: 'Learn from the oak tree', nextScene: 8 },
          { text: 'Play with the daisies', nextScene: 9 }
        ]
      },
      {
        text: "Underground, the friendly earthworms told stories of all the seeds they'd helped grow into beautiful plants.",
        image: '🪱',
        choices: [
          { text: 'Decide to be brave and grow up', nextScene: 1 },
          { text: 'Ask for help from earthworms', nextScene: 10 }
        ]
      },
      {
        text: "By sharing with the butterflies, the plant helped create the most beautiful garden in the whole world!",
        image: '🦋',
      },
      {
        text: "Growing tall, the plant could see the entire magical garden and all the happy children playing in it.",
        image: '🌻',
      },
      {
        text: "The wise oak tree taught the plant about patience, kindness, and the importance of deep roots.",
        image: '🌳',
      },
      {
        text: "Playing with the daisies, the plant learned that joy and laughter make everything grow better!",
        image: '🌼',
      },
      {
        text: "With help from the earthworms, the seed found the courage to grow and eventually became the garden's most beloved flower.",
        image: '🌺',
      }
    ]
  },
  {
    id: 'brave-little-star',
    title: 'The Brave Little Star',
    emoji: '⭐',
    scenes: [
      {
        text: "High up in the night sky lived a little star who was afraid to shine. All the other stars sparkled brightly, but our little star felt too small.",
        image: '✨',
        choices: [
          { text: 'Try to shine a little bit', nextScene: 1 },
          { text: 'Hide behind a cloud', nextScene: 2 }
        ]
      },
      {
        text: "The little star took a deep breath and let out a tiny twinkle. A child on Earth saw it and made a wish!",
        image: '🌟',
        choices: [
          { text: 'Shine brighter with happiness', nextScene: 3 },
          { text: 'Wonder what the child wished for', nextScene: 4 }
        ]
      },
      {
        text: "Behind the fluffy cloud, the star felt safe but also sad. The cloud noticed and asked, 'Why are you hiding, little one?'",
        image: '☁️',
        choices: [
          { text: 'Tell the cloud about being afraid', nextScene: 5 },
          { text: 'Ask the cloud to be friends', nextScene: 6 }
        ]
      },
      {
        text: "Feeling proud, the little star shone brighter and brighter, lighting up the whole sky with beautiful colors!",
        image: '🌈',
        choices: [
          { text: 'Inspire other shy stars to shine', nextScene: 7 },
          { text: 'Dance across the sky', nextScene: 8 }
        ]
      },
      {
        text: "The star learned that the child had wished for courage to make new friends at school, just like the star needed courage to shine!",
        image: '🏫',
        choices: [
          { text: 'Shine extra bright for the child', nextScene: 9 },
          { text: 'Visit the child in their dreams', nextScene: 10 }
        ]
      },
      {
        text: "The kind cloud listened and said, 'Every star is important, no matter how small. Your light might be exactly what someone needs!'",
        image: '💫',
        choices: [
          { text: 'Believe the cloud and try shining', nextScene: 1 },
          { text: 'Ask how to be a good star', nextScene: 11 }
        ]
      },
      {
        text: "The cloud and star became best friends, and together they created the most beautiful nights - clouds with silver linings!",
        image: '🌙',
        choices: [
          { text: 'Travel the sky together', nextScene: 12 },
          { text: 'Help other stars and clouds', nextScene: 13 }
        ]
      },
      {
        text: "Soon, all the shy stars began to shine, creating the most magnificent light show the universe had ever seen!",
        image: '🌌',
      },
      {
        text: "The little star danced across the sky, trailing sparkles and bringing joy to everyone who looked up.",
        image: '💃',
      },
      {
        text: "By shining brightly, the star gave the child courage, and both learned that being small doesn't mean being less important!",
        image: '❤️',
      },
      {
        text: "In the child's dreams, the star and child became friends and went on magical adventures together.",
        image: '🚀',
      },
      {
        text: "The cloud taught the star that kindness and patience help everyone shine their brightest.",
        image: '🤝',
      },
      {
        text: "Together, the cloud and star traveled the world, bringing beautiful weather and hope to everyone below.",
        image: '🌍',
      },
      {
        text: "The star and cloud started a help group for shy stars and lonely clouds, making the whole sky a happier place!",
        image: '🌠',
      }
    ]
  }
];

export default function StoriesGame() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [storyHistory, setStoryHistory] = useState<number[]>([]);

  const startStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentScene(0);
    setStoryHistory([]);
  };

  const makeChoice = (nextScene: number) => {
    setStoryHistory(prev => [...prev, currentScene]);
    setCurrentScene(nextScene);
  };

  const goBack = () => {
    if (storyHistory.length > 0) {
      const previousScene = storyHistory[storyHistory.length - 1];
      setStoryHistory(prev => prev.slice(0, -1));
      setCurrentScene(previousScene);
    }
  };

  const resetStory = () => {
    setSelectedStory(null);
    setCurrentScene(0);
    setStoryHistory([]);
  };

  if (!selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-4">
        <div className="max-w-3xl mx-auto">
          <header className="text-center py-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Back to Games
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">📖 Story Time</h1>
            <p className="text-gray-600 mb-4">Choose your own adventure stories</p>
          </header>

          <div className="grid md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-6xl mb-4">{story.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{story.title}</h3>
                  <p className="text-gray-600 mb-4">
                    An interactive story where you choose what happens next!
                  </p>
                  <button
                    onClick={() => startStory(story)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Start Story
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">📚 About Interactive Stories:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Choose your own adventure - every decision matters!</li>
              <li>• Stories teach valuable lessons about courage, friendship, and kindness</li>
              <li>• You can go back and try different choices</li>
              <li>• Each story has multiple endings to discover</li>
              <li>• Perfect for reading together as a family</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const scene = selectedStory.scenes[currentScene];
  const isEndingScene = !scene.choices || scene.choices.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Games
          </Link>
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={resetStory}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Choose Different Story
            </button>
            {storyHistory.length > 0 && (
              <button
                onClick={goBack}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Go Back
              </button>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {selectedStory.emoji} {selectedStory.title}
          </h1>
        </header>

        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          {/* Scene illustration */}
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">{scene.image}</div>
          </div>

          {/* Scene text */}
          <div className="text-lg leading-relaxed text-gray-800 mb-8 text-center">
            {scene.text}
          </div>

          {/* Choices or ending */}
          {isEndingScene ? (
            <div className="text-center">
              <div className="text-2xl mb-4">🎉</div>
              <p className="text-lg font-semibold text-green-700 mb-6">The End!</p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCurrentScene(0);
                    setStoryHistory([]);
                  }}
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Over
                </button>
                <button
                  onClick={resetStory}
                  className="block w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Choose Another Story
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-gray-600 mb-4">What happens next?</p>
              {scene.choices?.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => makeChoice(choice.nextScene)}
                  className="block w-full bg-orange-100 hover:bg-orange-200 text-orange-800 px-6 py-3 rounded-lg font-medium transition-colors border border-orange-200"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Story progress */}
        <div className="text-center text-sm text-gray-500">
          <p>Scene {currentScene + 1} • Choices made: {storyHistory.length}</p>
        </div>
      </div>
    </div>
  );
}