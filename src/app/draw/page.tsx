'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#AED6F1'
];

const coloringTemplates = [
  // Simple house
  'M 50 150 L 150 50 L 250 150 L 230 150 L 230 200 L 70 200 L 70 150 Z M 90 180 L 120 180 L 120 200 L 90 200 Z M 160 170 L 190 170 L 190 190 L 160 190 Z M 200 170 L 210 170 L 210 190 L 200 190 Z',
  // Simple flower
  'M 150 100 C 130 80, 110 80, 100 100 C 80 120, 80 140, 100 150 C 120 170, 140 170, 150 150 C 170 170, 190 170, 200 150 C 220 130, 220 110, 200 100 C 180 80, 160 80, 150 100 Z M 145 145 L 155 145 L 155 200 L 145 200 Z',
  // Simple sun
  'M 150 150 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0 M 150 50 L 150 90 M 150 210 L 150 250 M 250 150 L 210 150 M 90 150 L 50 150 M 220 80 L 190 110 M 110 190 L 80 220 M 220 220 L 190 190 M 110 110 L 80 80',
  // Simple tree
  'M 150 200 L 150 120 M 100 120 C 100 80, 140 60, 150 80 C 160 60, 200 80, 200 120 M 80 140 C 80 100, 120 80, 150 100 C 180 80, 220 100, 220 140 M 120 100 L 180 100',
];

export default function DrawGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(5);
  const [mode, setMode] = useState<'draw' | 'color'>('draw');
  const [currentTemplate, setCurrentTemplate] = useState(0);

  useEffect(() => {
    if (mode === 'color') {
      loadTemplate();
    }
  }, [mode, currentTemplate]);

  const loadTemplate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw template
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'none';

    const path = new Path2D(coloringTemplates[currentTemplate]);
    ctx.stroke(path);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (mode === 'color') {
      loadTemplate();
    }
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(e);

    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.beginPath();
      }
    }
    setIsDrawing(false);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'my-artwork.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Games
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎨 Draw & Color</h1>
          <p className="text-gray-600 mb-4">Create beautiful artwork and color templates</p>
        </header>

        {/* Mode toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setMode('draw')}
              className={`px-6 py-2 rounded-md transition-colors ${
                mode === 'draw' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Free Draw
            </button>
            <button
              onClick={() => setMode('color')}
              className={`px-6 py-2 rounded-md transition-colors ${
                mode === 'color' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Coloring
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Canvas */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="border border-gray-200 rounded cursor-crosshair w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ touchAction: 'none' }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="lg:w-64 space-y-4">
            {/* Color palette */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Colors</h3>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      currentColor === color ? 'ring-4 ring-gray-400 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-2">Custom Color:</label>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-full h-10 rounded border border-gray-200"
                />
              </div>
            </div>

            {/* Brush size */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Brush Size</h3>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center mt-2 text-sm text-gray-600">
                {brushSize}px
              </div>
              <div className="flex justify-center mt-2">
                <div
                  className="rounded-full bg-gray-800"
                  style={{
                    width: `${brushSize}px`,
                    height: `${brushSize}px`,
                  }}
                />
              </div>
            </div>

            {/* Coloring templates */}
            {mode === 'color' && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Templates</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['🏠', '🌸', '☀️', '🌳'].map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTemplate(index)}
                      className={`p-3 text-2xl rounded-lg transition-colors ${
                        currentTemplate === index
                          ? 'bg-purple-100 ring-2 ring-purple-500'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                <button
                  onClick={clearCanvas}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Clear Canvas
                </button>
                <button
                  onClick={downloadImage}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
                >
                  Save Drawing
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>💡 Tip: Use different brush sizes and colors to create amazing artwork!</p>
        </div>
      </div>
    </div>
  );
}