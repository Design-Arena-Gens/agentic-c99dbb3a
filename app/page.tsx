'use client'

import { useState } from 'react'
import TextToSpeechModule from '@/components/TextToSpeechModule'
import VideoComposer from '@/components/VideoComposer'
import { Film, Mic } from 'lucide-react'

export default function Home() {
  const [activeModule, setActiveModule] = useState<'tts' | 'video'>('tts')
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Produção Audiovisual Pro
          </h1>
          <p className="text-gray-400 text-lg">
            Plataforma completa de conversão texto-para-áudio e edição de vídeo profissional
          </p>
        </header>

        {/* Module Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveModule('tts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeModule === 'tts'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Mic className="w-5 h-5" />
            Texto para Áudio
          </button>
          <button
            onClick={() => setActiveModule('video')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeModule === 'video'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Film className="w-5 h-5" />
            Editor de Vídeo
          </button>
        </div>

        {/* Active Module */}
        <div className="w-full">
          {activeModule === 'tts' ? (
            <TextToSpeechModule onAudioGenerated={setGeneratedAudio} />
          ) : (
            <VideoComposer initialAudio={generatedAudio} />
          )}
        </div>
      </div>
    </main>
  )
}
