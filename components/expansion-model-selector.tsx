"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Store, Building2, Rocket, Truck } from "lucide-react"

interface ExpansionModel {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
}

const EXPANSION_MODELS: ExpansionModel[] = [
  {
    id: "single-location",
    label: "Abrir un solo local",
    description: "Expansión controlada con un único punto de venta",
    icon: <Store className="w-6 h-6" />,
    color: "from-rose-500 to-pink-500",
  },
  {
    id: "multiple-locations",
    label: "Abrir 3 o más sucursales",
    description: "Expansión agresiva con múltiples puntos de venta",
    icon: <Building2 className="w-6 h-6" />,
    color: "from-pink-500 to-fuchsia-500",
  },
  {
    id: "pilot-franchise",
    label: "Local piloto para franquiciar",
    description: "Modelo de negocio escalable mediante franquicias",
    icon: <Rocket className="w-6 h-6" />,
    color: "from-fuchsia-500 to-purple-500",
  },
  {
    id: "digital-delivery",
    label: "Operación digital y/o delivery",
    description: "Modelo sin local físico, enfocado en delivery",
    icon: <Truck className="w-6 h-6" />,
    color: "from-purple-500 to-violet-500",
  },
]

interface ExpansionModelSelectorProps {
  onComplete: (model: string) => void
}

export function ExpansionModelSelector({ onComplete }: ExpansionModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<string>("")

  const selectModel = (id: string) => {
    setSelectedModel(id)
  }

  const handleContinue = () => {
    if (selectedModel) {
      onComplete(selectedModel)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500/10 via-background to-purple-500/10 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-8 md:p-12 shadow-2xl border-2 border-rose-500/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            ¿Cuál es tu modelo de expansión deseado?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecciona el modelo que mejor se adapte a tu visión de crecimiento. Esto nos ayudará a calcular inversiones
            y proyecciones específicas para tu estrategia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {EXPANSION_MODELS.map((model) => {
            const isSelected = selectedModel === model.id

            return (
              <button
                key={model.id}
                onClick={() => selectModel(model.id)}
                className={`
                  relative p-8 rounded-xl border-2 transition-all duration-300
                  ${
                    isSelected
                      ? `bg-gradient-to-br ${model.color} border-transparent text-white shadow-lg scale-105`
                      : "bg-card border-border hover:border-rose-500/50 hover:shadow-md hover:scale-102"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`p-4 rounded-full ${isSelected ? "bg-white/20" : "bg-rose-500/10"}`}>
                    {model.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{model.label}</h3>
                    <p className={`text-sm ${isSelected ? "text-white/90" : "text-muted-foreground"}`}>
                      {model.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-rose-500" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedModel}
            className="px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600"
          >
            Continuar
          </Button>
        </div>
      </Card>
    </div>
  )
}
