"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function LengthExtensionAttack() {
  const [secretMessage, setSecretMessage] = useState("clave_secreta")
  const [publicMessage, setPublicMessage] = useState("mensaje_publico")
  const [attackData, setAttackData] = useState("datos_maliciosos")
  const [results, setResults] = useState<{
    sha2Original: string
    sha2Extended: string
    sha3Original: string
    sha3Extended: string
    sha2Vulnerable: boolean
  } | null>(null)

  async function demonstrateAttack() {
    try {
      const [{ sha256 }, { sha3_256 }] = await Promise.all([import("js-sha256"), import("js-sha3")])

      const originalMessage = secretMessage + publicMessage
      const extendedMessage = originalMessage + attackData

      // SHA-2 hashes
      const sha2Original = sha256(originalMessage)
      const sha2Extended = sha256(extendedMessage)

      // SHA-3 hashes
      const sha3Original = sha3_256(originalMessage)
      const sha3Extended = sha3_256(extendedMessage)

      // In a real length extension attack, the attacker could compute sha2Extended
      // without knowing secretMessage. This is a simplified demonstration.
      const sha2Vulnerable = true

      setResults({
        sha2Original,
        sha2Extended,
        sha3Original,
        sha3Extended,
        sha2Vulnerable,
      })
    } catch (error) {
      console.error("Error:", error)
      alert("Ocurrió un error durante la demostración.")
    }
  }

  return (
    <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl p-6 mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold text-white mr-3">3. Resistencia al Length Extension Attack</h2>
        <Badge className="bg-green-500 text-white">✓ FORTALEZA</Badge>
      </div>
      <p className="text-gray-400 mb-4">
        SHA-2 es vulnerable al <strong>ataque de extensión de longitud</strong>: un atacante que conoce{" "}
        <code>H(mensaje)</code> puede calcular <code>H(mensaje || padding || datos_extra)</code> sin conocer el mensaje
        original. SHA-3, gracias a su construcción <strong>sponge</strong>, es naturalmente resistente a este ataque.
      </p>

      <div className="mb-6 p-4 bg-blue-900 bg-opacity-30 border-l-4 border-blue-500 rounded">
        <h4 className="text-blue-300 font-semibold mb-2">¿Cómo funciona el ataque?</h4>
        <ol className="list-decimal list-inside text-gray-300 space-y-1 text-sm">
          <li>
            El atacante conoce el hash <code>H(mensaje_secreto)</code> pero no el mensaje
          </li>
          <li>En SHA-2, el hash es el estado interno después de procesar el mensaje</li>
          <li>El atacante puede "continuar" el hasheo añadiendo datos extras</li>
          <li>
            Esto compromete esquemas como <code>H(clave_secreta || mensaje)</code>
          </li>
        </ol>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Mensaje Secreto (simulado):</label>
          <Input
            value={secretMessage}
            onChange={(e) => setSecretMessage(e.target.value)}
            className="bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Mensaje Público:</label>
          <Input
            value={publicMessage}
            onChange={(e) => setPublicMessage(e.target.value)}
            className="bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Datos que el Atacante Quiere Añadir:</label>
          <Input
            value={attackData}
            onChange={(e) => setAttackData(e.target.value)}
            className="bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>
      </div>

      <Button onClick={demonstrateAttack} className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
        Demostrar Ataque
      </Button>

      {results && (
        <div className="mt-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Resultados de la Demostración</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-4 rounded-lg border-2 border-red-500">
              <h4 className="text-lg font-semibold text-red-400 mb-3">SHA-256 (Vulnerable)</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Hash Original:</p>
                  <code className="text-xs text-gray-200 break-all block">{results.sha2Original}</code>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Hash Extendido:</p>
                  <code className="text-xs text-gray-200 break-all block">{results.sha2Extended}</code>
                </div>
                <div className="p-3 bg-red-900/30 rounded">
                  <p className="text-sm text-red-300">
                    ⚠️ Un atacante podría calcular el hash extendido sin conocer el mensaje secreto.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border-2 border-green-500">
              <h4 className="text-lg font-semibold text-green-400 mb-3">SHA3-256 (Resistente)</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Hash Original:</p>
                  <code className="text-xs text-gray-200 break-all block">{results.sha3Original}</code>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Hash Extendido:</p>
                  <code className="text-xs text-gray-200 break-all block">{results.sha3Extended}</code>
                </div>
                <div className="p-3 bg-green-900/30 rounded">
                  <p className="text-sm text-green-300">
                    ✓ La construcción Sponge hace imposible este ataque. El atacante necesitaría conocer el mensaje
                    completo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-yellow-400 mb-2">Explicación Técnica</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              En SHA-2, el hash final es simplemente el estado interno después de procesar el mensaje. Un atacante que
              conoce este estado puede "continuar" el proceso de hashing añadiendo más datos. En SHA-3, la parte{" "}
              <strong className="text-green-400">capacity</strong> del estado nunca se expone, por lo que es imposible
              continuar el proceso sin conocer el mensaje completo.
            </p>
          </div>

          <div className="p-4 bg-green-900 bg-opacity-30 border-l-4 border-green-500 rounded">
            <p className="text-green-200 text-sm">
              <strong>Conclusión:</strong> Esta es una de las principales ventajas de SHA-3 sobre SHA-2. Aunque SHA-2
              puede mitigarse usando HMAC, SHA-3 es resistente por diseño.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
