import { SpongeConstruction } from "@/components/sha3/sponge-construction"
import { SpongeAnimated } from "@/components/sha3/sponge-animated"
import { AvalancheEffect } from "@/components/sha3/avalanche-effect"
import { SpeedComparison } from "@/components/sha3/speed-comparison"
import { LengthExtensionAttack } from "@/components/sha3/length-extension-attack"

export default function SHA3Page() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400">SHA-3: Análisis Comparativo Completo</h1>
          <p className="text-lg text-gray-400 mt-2">Demostraciones interactivas de fortalezas y debilidades</p>
        </header>

        <SpongeConstruction />
        <SpongeAnimated />
        <AvalancheEffect />
        <SpeedComparison />
        <LengthExtensionAttack />
      </div>
    </div>
  )
}
