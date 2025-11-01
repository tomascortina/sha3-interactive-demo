"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SpongeConstruction() {
  const [phase, setPhase] = useState<"idle" | "absorb" | "squeeze" | "complete">("idle")
  const [explanation, setExplanation] = useState(getInitialExplanation())

  function getInitialExplanation() {
    return {
      title: "¿Cómo funciona?",
      content: (
        <>
          <p>
            La construcción Sponge tiene un estado interno de <strong className="text-blue-400">b = r + c bits</strong>:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>
              <strong className="text-blue-400">Rate (r)</strong>: Parte que interactúa con los datos
            </li>
            <li>
              <strong className="text-green-400">Capacity (c)</strong>: Parte secreta que garantiza la seguridad
            </li>
          </ul>
          <p className="mt-2">Para SHA3-256: r = 1088 bits, c = 512 bits (total: 1600 bits)</p>
        </>
      ),
    }
  }

  async function handleAbsorb() {
    setPhase("absorb")
    setExplanation({
      title: "🧽 Absorbiendo el mensaje...",
      content: (
        <>
          <p>
            Los bloques del mensaje entran por la parte <strong className="text-blue-400">rate</strong>.
          </p>
          <p>Se hace XOR con el estado y se aplica la permutación Keccak-f.</p>
          <p className="mt-2">
            La parte <strong className="text-green-400">capacity</strong> permanece intacta, garantizando la seguridad.
          </p>
        </>
      ),
    })

    await new Promise((resolve) => setTimeout(resolve, 3000))
    setPhase("idle")
  }

  async function handleSqueeze() {
    setPhase("squeeze")
    setExplanation({
      title: "💧 Exprimiendo el hash...",
      content: (
        <>
          <p>
            Extraemos bits de la parte <strong className="text-blue-400">rate</strong> del estado.
          </p>
          <p>Si necesitamos más bits, aplicamos Keccak-f y continuamos.</p>
          <p className="mt-2">El hash final tiene la longitud deseada (256 bits para SHA3-256).</p>
        </>
      ),
    })

    await new Promise((resolve) => setTimeout(resolve, 3000))
    setPhase("idle")
  }

  async function handleComplete() {
    // Initialization
    setPhase("idle")
    setExplanation({
      title: "📝 Preparando el estado...",
      content: <p>El estado se inicializa con 1600 bits en cero.</p>,
    })
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Absorb
    setPhase("absorb")
    setExplanation({
      title: "🧽 Absorbiendo bloques...",
      content: <p>Procesando el mensaje bloque por bloque.</p>,
    })
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Squeeze
    setPhase("squeeze")
    setExplanation({
      title: "💧 Generando el hash...",
      content: <p>Extrayendo 256 bits del estado.</p>,
    })
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Complete
    setPhase("complete")
    setExplanation({
      title: "✅ Hash SHA3-256 generado",
      content: <p>El proceso completo garantiza alta seguridad y resistencia a ataques.</p>,
    })
  }

  function handleReset() {
    setPhase("idle")
    setExplanation(getInitialExplanation())
  }

  return (
    <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl p-6 mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold text-white mr-3">Construcción Sponge: El Corazón de SHA-3</h2>
        <Badge className="bg-green-500 text-white">✓ INNOVACIÓN CLAVE</Badge>
      </div>
      <p className="text-gray-400 mb-6">
        SHA-3 utiliza la construcción Sponge, una arquitectura revolucionaria que funciona como una esponja: absorbe
        datos y los exprime para generar el hash.
      </p>

      <div className="bg-gray-950 rounded-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* SVG Visualization */}
          <div className="flex-1 flex justify-center">
            <svg width="300" height="350" viewBox="0 0 300 350" className="max-w-full">
              {/* Rate section */}
              <rect
                x="50"
                y="50"
                width="200"
                height="120"
                rx="20"
                fill="#3B82F6"
                stroke="#60A5FA"
                strokeWidth="3"
                opacity={phase === "absorb" ? "1" : "0.8"}
                className="transition-opacity duration-500"
              />

              {/* Divider line */}
              <line x1="50" y1="170" x2="250" y2="170" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="5,5" />

              {/* Capacity section */}
              <rect
                x="50"
                y="170"
                width="200"
                height="130"
                rx="20"
                fill="#10B981"
                stroke="#34D399"
                strokeWidth="3"
                opacity="0.8"
              />

              {/* Pores in rate */}
              {[
                { cx: 90, cy: 90, r: 8 },
                { cx: 150, cy: 110, r: 10 },
                { cx: 210, cy: 95, r: 7 },
                { cx: 120, cy: 130, r: 9 },
                { cx: 180, cy: 140, r: 6 },
              ].map((pore, i) => (
                <circle key={`rate-${i}`} {...pore} fill="#1E40AF" opacity="0.6" />
              ))}

              {/* Pores in capacity */}
              {[
                { cx: 100, cy: 210, r: 8 },
                { cx: 160, cy: 230, r: 10 },
                { cx: 200, cy: 200, r: 7 },
                { cx: 130, cy: 260, r: 9 },
              ].map((pore, i) => (
                <circle key={`capacity-${i}`} {...pore} fill="#047857" opacity="0.6" />
              ))}

              {/* Labels */}
              <text x="150" y="110" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16">
                RATE (r bits)
              </text>
              <text x="150" y="130" textAnchor="middle" fill="white" fontSize="12">
                Parte pública
              </text>
              <text x="150" y="235" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16">
                CAPACITY (c bits)
              </text>
              <text x="150" y="255" textAnchor="middle" fill="white" fontSize="12">
                Seguridad
              </text>

              {/* Input flow */}
              {phase === "absorb" && (
                <g opacity="1" className="animate-pulse">
                  <rect x="10" y="100" width="30" height="20" fill="#F59E0B" rx="3" />
                  <text x="25" y="115" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    M
                  </text>
                </g>
              )}

              {/* Output flow */}
              {(phase === "squeeze" || phase === "complete") && (
                <g opacity="1" className="animate-pulse">
                  <rect x="260" y="100" width="30" height="20" fill="#8B5CF6" rx="3" />
                  <text x="275" y="115" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    H
                  </text>
                </g>
              )}

              {/* Phase indicator */}
              <text
                x="150"
                y="30"
                textAnchor="middle"
                fill={phase === "complete" ? "#10B981" : "#60A5FA"}
                fontSize="18"
                fontWeight="bold"
                opacity={phase !== "idle" ? "1" : "0"}
                className="transition-opacity duration-300"
              >
                {phase === "absorb" && "FASE DE ABSORCIÓN"}
                {phase === "squeeze" && "FASE DE EXPRIMIDO"}
                {phase === "complete" && "¡COMPLETADO!"}
              </text>
            </svg>
          </div>

          {/* Control Panel */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-3">{explanation.title}</h3>
              <div className="text-sm text-gray-300 space-y-2">{explanation.content}</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Demostración Interactiva</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleAbsorb}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={phase !== "idle"}
                >
                  🧽 Fase de Absorción
                </Button>
                <Button
                  onClick={handleSqueeze}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={phase !== "idle"}
                >
                  💧 Fase de Exprimido
                </Button>
                <Button
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={phase !== "idle"}
                >
                  ▶️ Proceso Completo
                </Button>
                <Button onClick={handleReset} variant="secondary" className="w-full">
                  🔄 Reiniciar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Process */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
          <h4 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
            <span className="text-2xl mr-2">🧽</span> Fase de Absorción
          </h4>
          <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
            <li>El mensaje se divide en bloques de r bits</li>
            <li>Cada bloque se XOR con la parte rate del estado</li>
            <li>Se aplica la función de permutación Keccak-f[1600]</li>
            <li>Se repite hasta procesar todo el mensaje</li>
          </ol>
        </div>

        <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/50">
          <h4 className="text-lg font-semibold text-purple-400 mb-2 flex items-center">
            <span className="text-2xl mr-2">💧</span> Fase de Exprimido
          </h4>
          <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
            <li>Se extraen r bits del estado como salida</li>
            <li>Si necesitamos más bits, aplicamos Keccak-f[1600]</li>
            <li>Repetimos hasta obtener el tamaño de hash deseado</li>
            <li>Para SHA3-256, solo necesitamos 256 bits</li>
          </ol>
        </div>
      </div>

      {/* Advantages */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-yellow-400 mb-3">⭐ Ventajas de la Construcción Sponge</h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            { label: "Simplicidad", desc: "Un solo algoritmo para cualquier tamaño de salida" },
            { label: "Seguridad", desc: "Resistente a ataques de extensión de longitud" },
            { label: "Flexibilidad", desc: "Salida de longitud variable (XOF)" },
            { label: "Paralelizable", desc: "Se puede implementar eficientemente en hardware" },
          ].map((advantage, i) => (
            <div key={i} className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-gray-300">
                <strong>{advantage.label}:</strong> {advantage.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
