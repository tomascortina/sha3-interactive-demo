"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function SpeedComparison() {
  const [text, setText] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  )
  const [iterations, setIterations] = useState(1000)
  const [results, setResults] = useState<{
    sha2Time: number
    sha3Time: number
    sha2Ops: number
    sha3Ops: number
    ratio: number
    percentSlower: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  async function runBenchmark() {
    setLoading(true)

    try {
      const data = new TextEncoder().encode(text)

      // Import libraries dynamically
      const [{ sha256 }, { sha3_256 }] = await Promise.all([import("js-sha256"), import("js-sha3")])

      // Benchmark SHA-256
      const sha2Start = performance.now()
      for (let i = 0; i < iterations; i++) {
        sha256(data)
      }
      const sha2End = performance.now()
      const sha2Time = sha2End - sha2Start

      // Benchmark SHA3-256
      const sha3Start = performance.now()
      for (let i = 0; i < iterations; i++) {
        sha3_256(data)
      }
      const sha3End = performance.now()
      const sha3Time = sha3End - sha3Start

      const sha2Ops = Math.round(iterations / (sha2Time / 1000))
      const sha3Ops = Math.round(iterations / (sha3Time / 1000))
      const ratio = sha3Time / sha2Time
      const percentSlower = ((sha3Time - sha2Time) / sha2Time) * 100

      setResults({
        sha2Time: Number.parseFloat(sha2Time.toFixed(2)),
        sha3Time: Number.parseFloat(sha3Time.toFixed(2)),
        sha2Ops,
        sha3Ops,
        ratio: Number.parseFloat(ratio.toFixed(2)),
        percentSlower: Number.parseFloat(percentSlower.toFixed(1)),
      })
    } catch (error) {
      console.error("Error:", error)
      alert("Ocurrió un error durante el benchmark.")
    } finally {
      setLoading(false)
    }
  }

  // Draw chart when results change
  useEffect(() => {
    if (!results || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simple bar chart
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const maxTime = Math.max(results.sha2Time, results.sha3Time)
    const barHeight = 60
    const spacing = 80

    // SHA-256 bar
    const sha2Width = (results.sha2Time / maxTime) * (canvas.width - 150)
    ctx.fillStyle = "rgba(59, 130, 246, 0.8)"
    ctx.fillRect(100, 50, sha2Width, barHeight)
    ctx.fillStyle = "#fff"
    ctx.font = "14px sans-serif"
    ctx.fillText("SHA-256", 10, 85)
    ctx.fillText(`${results.sha2Time} ms`, sha2Width + 110, 85)

    // SHA3-256 bar
    const sha3Width = (results.sha3Time / maxTime) * (canvas.width - 150)
    ctx.fillStyle = "rgba(168, 85, 247, 0.8)"
    ctx.fillRect(100, 50 + spacing, sha3Width, barHeight)
    ctx.fillStyle = "#fff"
    ctx.fillText("SHA3-256", 10, 85 + spacing)
    ctx.fillText(`${results.sha3Time} ms`, sha3Width + 110, 85 + spacing)
  }, [results])

  return (
    <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl p-6 mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold text-white mr-3">2. Comparación de Velocidad: SHA-2 vs SHA-3</h2>
        <Badge className="bg-red-500 text-white">✗ DESVENTAJA</Badge>
      </div>
      <p className="text-gray-400 mb-4">
        SHA-3 es generalmente más lento que SHA-2 en plataformas sin optimizaciones específicas. Esto se debe a su
        construcción <strong>sponge</strong> que requiere más operaciones por bloque comparado con la construcción{" "}
        <strong>Merkle-Damgård</strong> de SHA-2.
      </p>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2 font-semibold">Datos para el Benchmark:</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Escribe o pega texto aquí para medir velocidad..."
          className="bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2 font-semibold">Iteraciones:</label>
        <Input
          type="number"
          value={iterations}
          onChange={(e) => setIterations(Number.parseInt(e.target.value) || 1000)}
          min={100}
          max={100000}
          className="w-40 bg-gray-700 border-gray-600 text-gray-200"
        />
        <span className="text-sm text-gray-400 ml-2">Mayor número = medición más precisa</span>
      </div>

      <Button onClick={runBenchmark} disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3">
        {loading ? "Ejecutando..." : "Ejecutar Benchmark"}
      </Button>

      {results && (
        <div className="mt-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Resultados del Benchmark</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-4 rounded-lg border-2 border-blue-500">
              <h4 className="text-lg font-semibold text-blue-400 mb-2">SHA-256 (SHA-2)</h4>
              <p className="text-3xl font-bold text-white mb-2">{results.sha2Time} ms</p>
              <p className="text-sm text-gray-400">{results.sha2Ops.toLocaleString()} ops/seg</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border-2 border-purple-500">
              <h4 className="text-lg font-semibold text-purple-400 mb-2">SHA3-256</h4>
              <p className="text-3xl font-bold text-white mb-2">{results.sha3Time} ms</p>
              <p className="text-sm text-gray-400">{results.sha3Ops.toLocaleString()} ops/seg</p>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-orange-400 mb-2">Análisis</h4>
            <p className="text-gray-200">
              SHA3-256 fue <strong className="text-orange-400">{results.ratio}x más lento</strong> que SHA-256
              (aproximadamente <strong>{results.percentSlower}% más lento</strong>).
              <br />
              SHA-256 procesó <strong>{results.sha2Ops.toLocaleString()}</strong> operaciones/segundo vs{" "}
              <strong>{results.sha3Ops.toLocaleString()}</strong> de SHA3-256.
              <br />
              <br />
              <span className="text-sm">
                Esta diferencia se debe a que SHA-3 usa una construcción <em>sponge</em> que requiere más operaciones
                por bloque, mientras que SHA-2 usa Merkle-Damgård que está más optimizado en hardware y software
                convencional.
              </span>
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <canvas ref={canvasRef} width="600" height="250" className="w-full" />
          </div>

          <div className="p-4 bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-500 rounded">
            <p className="text-yellow-200 text-sm">
              <strong>Nota:</strong> Esta diferencia de velocidad es la razón por la cual SHA-2 sigue siendo el estándar
              de facto en muchos sistemas. Sin embargo, SHA-3 ofrece ventajas estructurales importantes (como
              resistencia al ataque de extensión de longitud) que justifican su uso en ciertos contextos.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
