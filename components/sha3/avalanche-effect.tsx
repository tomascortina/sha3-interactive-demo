"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AvalancheEffect() {
  const [inputType, setInputType] = useState<"text" | "file">("text")
  const [textInput, setTextInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    hash1: string
    hash2: string
    input1: string
    input2: string
    bitsChanged: number
    percentage: number
    bits1: string
    bits2: string
  } | null>(null)

  async function processHash() {
    setLoading(true)

    try {
      let data: Uint8Array
      let inputSnippet = ""

      if (inputType === "text") {
        data = new TextEncoder().encode(textInput)
        inputSnippet = textInput.length > 50 ? textInput.substring(0, 50) + "..." : textInput
      } else {
        if (!file) {
          alert("Por favor, selecciona un archivo.")
          return
        }
        data = new Uint8Array(await file.arrayBuffer())
        inputSnippet = file.name
      }

      // Import sha3 library dynamically
      const { sha3_256 } = await import("js-sha3")

      // Calculate original hash
      const hash1 = sha3_256(data)

      // Modify data slightly (flip one bit)
      const modifiedData = new Uint8Array(data)
      if (modifiedData.length > 0) {
        modifiedData[0] ^= 1
      }

      // Calculate modified hash
      const hash2 = sha3_256(modifiedData)

      // Convert to binary
      const bits1 = hexToBinary(hash1)
      const bits2 = hexToBinary(hash2)

      // Count differences
      let bitsChanged = 0
      for (let i = 0; i < bits1.length; i++) {
        if (bits1[i] !== bits2[i]) bitsChanged++
      }

      const percentage = ((bitsChanged / bits1.length) * 100).toFixed(2)

      setResults({
        hash1,
        hash2,
        input1: inputSnippet,
        input2: inputSnippet + " (1 bit modificado)",
        bitsChanged,
        percentage: Number.parseFloat(percentage),
        bits1,
        bits2,
      })
    } catch (error) {
      console.error("Error:", error)
      alert("Ocurrió un error al procesar los hashes.")
    } finally {
      setLoading(false)
    }
  }

  function hexToBinary(hex: string): string {
    return hex
      .split("")
      .map((char) => Number.parseInt(char, 16).toString(2).padStart(4, "0"))
      .join("")
  }

  function renderColoredBits(bits1: string, bits2: string) {
    return bits1.split("").map((bit, i) => {
      const match = bit === bits2[i]
      return (
        <span key={i} className={match ? "text-green-400" : "text-red-400"}>
          {bit}
        </span>
      )
    })
  }

  return (
    <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl p-6 mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold text-white mr-3">1. Efecto Avalancha</h2>
        <Badge className="bg-green-500 text-white">✓ FORTALEZA</Badge>
      </div>
      <p className="text-gray-400 mb-4">
        Un pequeño cambio en la entrada produce un cambio drástico e impredecible en el hash.
      </p>

      <Tabs value={inputType} onValueChange={(v) => setInputType(v as "text" | "file")} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Escribir Texto</TabsTrigger>
          <TabsTrigger value="file">Subir Archivo</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={6}
            placeholder="Escribe tu texto aquí..."
            className="bg-gray-700 border-gray-600 text-gray-200"
          />
        </TabsContent>
        <TabsContent value="file">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors duration-200 cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-2">El archivo se procesará localmente en tu navegador.</p>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button onClick={processHash} disabled={loading} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
          {loading ? "Procesando..." : "Calcular y Comparar Hashes"}
        </Button>
      </div>

      {results && (
        <div className="mt-6 space-y-6">
          <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
            Resultados de la Comparación
          </h3>

          {/* Hashes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-green-400 mb-2">Hash Original</h4>
              <p className="text-sm text-gray-400 mb-2 break-words">{results.input1}</p>
              <code className="text-sm text-gray-200 break-all block">{results.hash1}</code>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-red-400 mb-2">Hash Modificado</h4>
              <p className="text-sm text-gray-400 mb-2 break-words">{results.input2}</p>
              <code className="text-sm text-gray-200 break-all block">{results.hash2}</code>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">Análisis de Avalancha</h4>
            <p className="text-lg text-gray-200">
              <strong>{results.bitsChanged}</strong> de 256 bits cambiaron ({results.percentage}%)
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Un buen efecto avalancha debe cambiar aproximadamente el 50% de los bits.
            </p>
          </div>

          {/* Bit Comparison */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Comparación Visual Bit a Bit</h4>
            <p className="text-sm text-gray-400 mb-4">
              <span className="text-green-400 font-bold">Verde</span> = bits idénticos.{" "}
              <span className="text-red-400 font-bold">Rojo</span> = bits diferentes.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-950 p-4 rounded-lg overflow-x-auto">
                <h5 className="text-lg font-semibold text-green-400 mb-3">Bits del Hash Original</h5>
                <code className="font-mono text-xs leading-relaxed break-all whitespace-pre-wrap">
                  {renderColoredBits(results.bits1, results.bits2)}
                </code>
              </div>
              <div className="bg-gray-950 p-4 rounded-lg overflow-x-auto">
                <h5 className="text-lg font-semibold text-red-400 mb-3">Bits del Hash Modificado</h5>
                <code className="font-mono text-xs leading-relaxed break-all whitespace-pre-wrap">
                  {renderColoredBits(results.bits2, results.bits1)}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
