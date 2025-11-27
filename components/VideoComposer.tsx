'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Image as ImageIcon, Video, Trash2, Play, Download, Layers, Sparkles } from 'lucide-react'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  name: string
  duration?: number
}

interface TimelineItem {
  id: string
  mediaId: string
  startTime: number
  duration: number
  transition: string
}

const TRANSITIONS = [
  { id: 'none', name: 'Nenhuma' },
  { id: 'fade', name: 'Fade' },
  { id: 'slide-left', name: 'Deslizar Esquerda' },
  { id: 'slide-right', name: 'Deslizar Direita' },
  { id: 'zoom', name: 'Zoom' },
  { id: 'dissolve', name: 'Dissolver' },
]

interface Props {
  initialAudio: string | null
}

export default function VideoComposer({ initialAudio }: Props) {
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple')
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([])
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudio)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [defaultTransition, setDefaultTransition] = useState('fade')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      const type = file.type.startsWith('image') ? 'image' : 'video'

      const newMedia: MediaItem = {
        id: Math.random().toString(36).substring(7),
        type,
        url,
        name: file.name,
        duration: type === 'video' ? 5 : undefined, // Default 5s for videos
      }

      setMediaLibrary((prev) => [...prev, newMedia])
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleAudioUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setAudioUrl(url)

    if (audioInputRef.current) {
      audioInputRef.current.value = ''
    }
  }, [])

  const addToTimeline = useCallback((mediaId: string) => {
    const media = mediaLibrary.find((m) => m.id === mediaId)
    if (!media) return

    const lastItem = timeline[timeline.length - 1]
    const startTime = lastItem ? lastItem.startTime + lastItem.duration : 0

    const newItem: TimelineItem = {
      id: Math.random().toString(36).substring(7),
      mediaId,
      startTime,
      duration: media.type === 'video' ? media.duration || 5 : 3, // Default 3s for images
      transition: defaultTransition,
    }

    setTimeline((prev) => [...prev, newItem])
  }, [mediaLibrary, timeline, defaultTransition])

  const removeFromTimeline = useCallback((id: string) => {
    setTimeline((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const applyImageToWholeAudio = useCallback(() => {
    if (!selectedMedia || !audioUrl) return

    // Clear existing timeline
    setTimeline([])

    // Add single image for entire duration (estimate 60s)
    const newItem: TimelineItem = {
      id: Math.random().toString(36).substring(7),
      mediaId: selectedMedia,
      startTime: 0,
      duration: 60, // Placeholder duration
      transition: 'none',
    }

    setTimeline([newItem])
  }, [selectedMedia, audioUrl])

  const generateVideo = useCallback(async () => {
    if (timeline.length === 0) return

    setIsProcessing(true)

    // Simulate video processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    alert('Vídeo gerado com sucesso! (Simulação)')
  }, [timeline])

  const totalDuration = timeline.reduce((sum, item) => sum + item.duration, 0)

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Video className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl font-bold text-white">Editor de Vídeo</h2>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setMode('simple')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              mode === 'simple'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Modo Simples
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              mode === 'advanced'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Modo Avançado
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Media Library */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Biblioteca
            </h3>

            {/* Upload Buttons */}
            <div className="space-y-2 mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Mídia
              </button>

              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
              <button
                onClick={() => audioInputRef.current?.click()}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Áudio
              </button>
            </div>

            {/* Audio Display */}
            {audioUrl && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Áudio carregado</p>
                <audio src={audioUrl} controls className="w-full" />
              </div>
            )}

            {/* Media Items */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {mediaLibrary.map((media) => (
                <div
                  key={media.id}
                  onClick={() => setSelectedMedia(media.id)}
                  className={`p-3 bg-gray-800 rounded-lg cursor-pointer transition-all hover:bg-gray-750 ${
                    selectedMedia === media.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {media.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Video className="w-4 h-4 text-purple-400" />
                    )}
                    <span className="text-sm text-white truncate flex-1">
                      {media.name}
                    </span>
                  </div>
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.name}
                      className="w-full h-20 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="w-full h-20 object-cover rounded"
                    />
                  )}
                  {mode === 'advanced' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addToTimeline(media.id)
                      }}
                      className="w-full mt-2 bg-purple-600 text-white py-1 rounded text-xs hover:bg-purple-700 transition-all"
                    >
                      Adicionar à Timeline
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Simple Mode */}
          {mode === 'simple' && (
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Modo Simples
              </h3>
              <p className="text-gray-400 mb-6">
                Selecione uma imagem e aplique-a ao longo de todo o áudio
              </p>
              <button
                onClick={applyImageToWholeAudio}
                disabled={!selectedMedia || !audioUrl}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Aplicar Imagem ao Áudio
              </button>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Timeline</h3>
              <div className="text-sm text-gray-400">
                Duração total: {totalDuration.toFixed(1)}s
              </div>
            </div>

            {mode === 'advanced' && (
              <div className="mb-4">
                <label className="text-sm text-gray-300 mb-2 block">
                  Transição Padrão
                </label>
                <select
                  value={defaultTransition}
                  onChange={(e) => setDefaultTransition(e.target.value)}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600"
                >
                  {TRANSITIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Timeline Items */}
            <div className="space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto">
              {timeline.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum item na timeline</p>
                </div>
              ) : (
                timeline.map((item, index) => {
                  const media = mediaLibrary.find((m) => m.id === item.mediaId)
                  if (!media) return null

                  return (
                    <div
                      key={item.id}
                      className="bg-gray-800 rounded-lg p-4 flex items-center gap-4"
                    >
                      <div className="text-gray-400 font-mono text-sm">
                        #{index + 1}
                      </div>

                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-20 h-12 object-cover rounded"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="w-20 h-12 object-cover rounded"
                        />
                      )}

                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">
                          {media.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {item.startTime.toFixed(1)}s - {(item.startTime + item.duration).toFixed(1)}s
                          {' • '}
                          Transição: {TRANSITIONS.find((t) => t.id === item.transition)?.name}
                        </div>
                      </div>

                      {mode === 'advanced' && (
                        <button
                          onClick={() => removeFromTimeline(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={generateVideo}
              disabled={timeline.length === 0 || isProcessing}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>Processando...</>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Gerar Vídeo
                </>
              )}
            </button>
            <button
              disabled={timeline.length === 0}
              className="px-8 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exportar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
