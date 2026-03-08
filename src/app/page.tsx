import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🏠 Shelter Games</h1>
          <p className="text-lg text-gray-600 mb-2">
            Safe, fun activities for families during shelter time
          </p>
          <p className="text-sm text-gray-500">
            Zero-friction games • No signup required • Works offline
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <GameCard
            title="Memory Match"
            description="Classic card matching game to train memory and focus"
            icon="🧠"
            href="/memory"
            color="bg-green-100 hover:bg-green-200"
          />
          
          <GameCard
            title="Word Play"
            description="Simple word puzzles and vocabulary games"
            icon="📚"
            href="/words"
            color="bg-yellow-100 hover:bg-yellow-200"
          />
          
          <GameCard
            title="Draw & Color"
            description="Digital coloring book and drawing canvas"
            icon="🎨"
            href="/draw"
            color="bg-purple-100 hover:bg-purple-200"
          />
          
          <GameCard
            title="Breathing Buddy"
            description="Guided breathing exercises for calm and relaxation"
            icon="🌸"
            href="/breathe"
            color="bg-blue-100 hover:bg-blue-200"
          />
          
          <GameCard
            title="Rhythm Tap"
            description="Musical rhythm games and sound activities"
            icon="🎵"
            href="/rhythm"
            color="bg-pink-100 hover:bg-pink-200"
          />
          
          <GameCard
            title="Story Time"
            description="Interactive stories and reading activities"
            icon="📖"
            href="/stories"
            color="bg-orange-100 hover:bg-orange-200"
          />
        </div>

        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-600">All games work offline</span>
          </div>
        </div>

        <footer className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-200">
          <p>Made with ❤️ for families everywhere</p>
        </footer>
      </div>
    </div>
  );
}

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

function GameCard({ title, description, icon, href, color }: GameCardProps) {
  return (
    <Link href={href} className="block">
      <div className={`${color} p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 border border-gray-200`}>
        <div className="text-3xl mb-3 text-center">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}