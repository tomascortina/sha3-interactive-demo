"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type AnimationState = {
  colors: Array<{ r: number; g: number; b: number }>
  isAbsorbing: boolean
  isMixing: boolean
  isSqueezing: boolean
  drops: Array<{
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    color: { r: number; g: number; b: number }
    life: number
  }>
  outputDrops: Array<{
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    life: number
  }>
}

export function SpongeAnimated() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const [progress, setProgress] = useState(0)
  const [hash, setHash] = useState("")
  const [statusIcon, setStatusIcon] = useState("🎯")
  const [indicators, setIndicators] = useState({
    absorb: 0.5,
    transform: 0.5,
    squeeze: 0.5,
  })

  const stateRef = useRef<AnimationState>({
    colors: [],
    isAbsorbing: false,
    isMixing: false,
    isSqueezing: false,
    drops: [],
    outputDrops: [],
  })

  const inputColors = [
    { r: 239, g: 68, b: 68 }, // Red
    { r: 245, g: 158, b: 11 }, // Yellow
    { r: 34, g: 197, b: 94 }, // Green
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function drawSponge() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const state = stateRef.current

      // Calculate mixed color
      let avgR = 255,
        avgG = 248,
        avgB = 220

      if (state.colors.length > 0) {
        let totalR = avgR,
          totalG = avgG,
          totalB = avgB
        state.colors.forEach((color) => {
          totalR += color.r * 0.3
          totalG += color.g * 0.3
          totalB += color.b * 0.3
        })
        avgR = Math.min(255, totalR / (1 + state.colors.length * 0.3))
        avgG = Math.min(255, totalG / (1 + state.colors.length * 0.3))
        avgB = Math.min(255, totalB / (1 + state.colors.length * 0.3))
      }

      // Draw sponge with gradient
      const gradient = ctx.createLinearGradient(0, 50, 0, 300)
      gradient.addColorStop(0, `rgba(59, 130, 246, 0.8)`)
      gradient.addColorStop(0.4, `rgba(${avgR}, ${avgG}, ${avgB}, 1)`)
      gradient.addColorStop(0.6, `rgba(${avgR * 0.9}, ${avgG * 0.9}, ${avgB * 0.9}, 1)`)
      gradient.addColorStop(1, `rgba(34, 197, 94, 0.8)`)

      // Sponge body
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(100, 100)
      ctx.lineTo(300, 100)
      ctx.lineTo(320, 300)
      ctx.lineTo(80, 300)
      ctx.closePath()
      ctx.fill()

      // Divider line
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(90, 200)
      ctx.lineTo(310, 200)
      ctx.stroke()
      ctx.setLineDash([])

      // Labels
      ctx.fillStyle = "#fff"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("RATE (r)", 200, 150)
      ctx.font = "12px sans-serif"
      ctx.fillText("1088 bits", 200, 170)

      ctx.font = "bold 16px sans-serif"
      ctx.fillText("CAPACITY (c)", 200, 250)
      ctx.font = "12px sans-serif"
      ctx.fillText("512 bits (secreto)", 200, 270)

      // Draw input drops
      state.drops = state.drops.filter((drop) => {
        drop.x += drop.vx
        drop.y += drop.vy
        drop.life -= 0.02

        ctx.fillStyle = `rgba(${drop.color.r}, ${drop.color.g}, ${drop.color.b}, ${drop.life})`
        ctx.beginPath()
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2)
        ctx.fill()

        return drop.life > 0
      })

      // Draw output drops
      state.outputDrops = state.outputDrops.filter((drop) => {
        drop.x += drop.vx
        drop.y += drop.vy
        drop.life -= 0.01

        const dropGradient = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.radius)
        dropGradient.addColorStop(0, `rgba(139, 92, 246, ${drop.life})`)
        dropGradient.addColorStop(1, `rgba(168, 85, 247, ${drop.life * 0.5})`)

        ctx.fillStyle = dropGradient
        ctx.beginPath()
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2)
        ctx.fill()

        return drop.life > 0 && drop.x < canvas.width
      })
    }

    function animate() {
      drawSponge()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  async function addColors() {
    const state = stateRef.current
    if (state.isAbsorbing) return

    state.isAbsorbing = true
    setStatusIcon("🧽")
    setIndicators((prev) => ({ ...prev, absorb: 1 }))

    for (let colorIndex = 0; colorIndex < inputColors.length; colorIndex++) {
      state.colors.push(inputColors[colorIndex])

      // Create drops
      for (let i = 0; i < 10; i++) {
        state.drops.push({
          x: 50,
          y: 150 + Math.random() * 100,
          vx: 2 + Math.random() * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 5 + Math.random() * 10,
          color: inputColors[colorIndex],
          life: 1,
        })
      }

      setProgress(((colorIndex + 1) / inputColors.length) * 33)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    state.isAbsorbing = false
    setIndicators((prev) => ({ ...prev, absorb: 0.5 }))
  }

  async function mixWithKeccak() {
    const state = stateRef.current
    if (state.isMixing || state.colors.length === 0) return

    state.isMixing = true
    setStatusIcon("🌀")
    setIndicators((prev) => ({ ...prev, transform: 1 }))

    for (let i = 0; i < 5; i++) {
      setProgress(33 + ((i + 1) / 5) * 33)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    state.isMixing = false
    setIndicators((prev) => ({ ...prev, transform: 0.5 }))
  }

  async function squeezeHash() {
    const state = stateRef.current
    if (state.isSqueezing || state.colors.length === 0) return

    state.isSqueezing = true
    setStatusIcon("💦")
    setIndicators((prev) => ({ ...prev, squeeze: 1 }))

    const interval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        state.outputDrops.push({
          x: 320,
          y: 250 + Math.random() * 50,
          vx: 2 + Math.random() * 3,
          vy: (Math.random() - 0.5) * 2,
          radius: 5 + Math.random() * 8,
          life: 1,
        })
      }
    }, 100)

    await new Promise((resolve) => setTimeout(resolve, 3000))
    clearInterval(interval)

    // Generate hash
    const generatedHash = Array(64)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")

    setHash(generatedHash)
    setProgress(100)

    await new Promise((resolve) => setTimeout(resolve, 2000))
    state.isSqueezing = false
    setIndicators((prev) => ({ ...prev, squeeze: 0.5 }))
    setStatusIcon("✅")
  }

  async function runFullDemo() {
    resetAnimation()
    await addColors()
    await mixWithKeccak()
    await squeezeHash()
  }

  function resetAnimation() {
    stateRef.current = {
      colors: [],
      isAbsorbing: false,
      isMixing: false,
      isSqueezing: false,
      drops: [],
      outputDrops: [],
    }
    setProgress(0)
    setHash("")
    setStatusIcon("🎯")
    setIndicators({ absorb: 0.5, transform: 0.5, squeeze: 0.5 })
  }

  return (
    <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl p-6 mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold text-white mr-3">🧽 Construcción Sponge: Visualización Animada</h2>
        <Badge className="bg-green-500 text-white">✓ INNOVACIÓN CLAVE</Badge>
      </div>
      <p className="text-gray-400 mb-6">
        SHA-3 utiliza la construcción Sponge, que literalmente funciona como una esponja: absorbe datos como colores y
        los exprime para generar el hash.
      </p>

      <div className="bg-gray-950 rounded-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Canvas */}
          <div className="flex-1 flex justify-center">
            <canvas ref={canvasRef} width="400" height="450" className="rounded-lg" />
          </div>

          {/* Control Panel */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <span className="mr-2">{statusIcon}</span>
                Estado Actual
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-400">Rate (r):</span>
                  <span className="text-white font-mono">1088 bits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400">Capacity (c):</span>
                  <span className="text-white font-mono">512 bits</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">🎮 Demostración Interactiva</h3>
              <div className="space-y-3">
                <Button
                  onClick={addColors}
                  className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 hover:from-red-600 hover:via-yellow-600 hover:to-green-600"
                >
                  🎨 Agregar Colores (Mensajes)
                </Button>
                <Button onClick={mixWithKeccak} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  🌀 Mezclar con Keccak-f
                </Button>
                <Button
                  onClick={squeezeHash}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  💦 Exprimir Hash
                </Button>
                <Button
                  onClick={runFullDemo}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  ✨ Demostración Automática
                </Button>
              </div>

              {/* Process Indicators */}
              <div className="mt-4 flex justify-around">
                {[
                  { id: "absorb", label: "Absorber", opacity: indicators.absorb },
                  { id: "transform", label: "Transformar", opacity: indicators.transform },
                  { id: "squeeze", label: "Exprimir", opacity: indicators.squeeze },
                ].map((indicator, i) => (
                  <div
                    key={indicator.id}
                    className="text-center transition-opacity"
                    style={{ opacity: indicator.opacity }}
                  >
                    <div
                      className={`w-10 h-10 mx-auto mb-1 rounded-full flex items-center justify-center ${
                        i === 0 ? "bg-blue-500" : i === 1 ? "bg-indigo-500" : "bg-purple-500"
                      }`}
                    >
                      <span>{i + 1}</span>
                    </div>
                    <span className="text-xs">{indicator.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hash Output */}
        {hash && (
          <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-purple-500 transition-opacity duration-1000">
            <h4 className="text-purple-400 font-semibold mb-2">Hash SHA3-256 Generado:</h4>
            <code className="text-xs text-gray-300 font-mono break-all">{hash}</code>
          </div>
        )}
      </div>

      {/* Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/50">
          <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
            <span className="text-2xl mr-2">⚠️</span> SHA-2 (Merkle-Damgård)
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• Estado público visible</p>
            <p>• Vulnerable a ataques de extensión de longitud</p>
            <p>• Tamaño de salida fijo</p>
            <p>• Diseño más tradicional</p>
          </div>
        </div>

        <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/50">
          <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
            <span className="text-2xl mr-2">✅</span> SHA-3 (Sponge)
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• Capacity oculta (seguridad interna)</p>
            <p>• Inmune a ataques de extensión</p>
            <p>• Salida de longitud variable (XOF)</p>
            <p>• Diseño completamente diferente</p>
          </div>
        </div>
      </div>
    </section>
  )
}
