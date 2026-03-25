"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Pizza, Sandwich, UtensilsCrossed, Coffee, Flame, IceCream, Package, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"

interface BusinessType {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

const BUSINESS_TYPES: BusinessType[] = [
  {
    id: "pizzeria",
    label: "Pizzería",
    icon: <Pizza className="w-6 h-6" />,
    color: "from-cyan-500 to-teal-500",
  },
  {
    id: "sangucheria",
    label: "Sanguchería",
    icon: <Sandwich className="w-6 h-6" />,
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "rotiseria",
    label: "Rotisería",
    icon: <UtensilsCrossed className="w-6 h-6" />,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "cafeteria",
    label: "Cafetería",
    icon: <Coffee className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "parrilla",
    label: "Parrilla",
    icon: <Flame className="w-6 h-6" />,
    color: "from-cyan-600 to-teal-600",
  },
  {
    id: "hamburgueseria",
    label: "Hamburguesería",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11h18M3 11c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2M3 11v2c0 3.3 2.7 6 6 6h6c3.3 0 6-2.7 6-6v-2M5 9V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2" />
        <circle cx="8" cy="14" r="1" fill="currentColor" />
        <circle cx="12" cy="14" r="1" fill="currentColor" />
        <circle cx="16" cy="14" r="1" fill="currentColor" />
      </svg>
    ),
    color: "from-teal-500 to-blue-500",
  },
  {
    id: "heladeria",
    label: "Heladería",
    icon: <IceCream className="w-6 h-6" />,
    color: "from-cyan-400 to-blue-400",
  },
  {
    id: "viandas",
    label: "Viandas",
    icon: <Package className="w-6 h-6" />,
    color: "from-teal-500 to-cyan-600",
  },
]

interface BusinessTypeSelectorProps {
  onComplete: (businessType: string) => void
}

export function BusinessTypeSelector({ onComplete }: BusinessTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [otherType, setOtherType] = useState("")

  const selectType = (id: string) => {
    setSelectedType(id)
  }

  const handleAddOther = () => {
    if (otherType.trim()) {
      setSelectedType(`other:${otherType}`)
    }
  }

  const handleContinue = () => {
    if (selectedType) {
      onComplete(selectedType)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500/10 via-background to-teal-500/10 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-8 md:p-12 shadow-2xl border-2 border-cyan-500/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">
            ¿Qué tipo de negocio gastronómico tienes?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecciona el tipo de negocio que mejor describe tu pyme gastronómica. Esto nos ayudará a personalizar la
            simulación según las características específicas de tu industria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {BUSINESS_TYPES.map((type) => {
            const isSelected = selectedType === type.id

            return (
              <button
                key={type.id}
                onClick={() => selectType(type.id)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300
                  ${
                    isSelected
                      ? `bg-gradient-to-br ${type.color} border-transparent text-white shadow-lg scale-105`
                      : "bg-card border-border hover:border-cyan-500/50 hover:shadow-md hover:scale-102"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`p-3 rounded-full ${isSelected ? "bg-white/20" : "bg-cyan-500/10"}`}>{type.icon}</div>
                  <span className="font-semibold text-sm leading-tight">{type.label}</span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-cyan-500" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Opción "Otros" */}
        <div className="mb-6">
          {!showOtherInput ? (
            <button
              onClick={() => setShowOtherInput(true)}
              className="w-full p-6 rounded-xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 rounded-full bg-cyan-500/10">
                  <Plus className="w-6 h-6 text-cyan-500" />
                </div>
                <span className="font-semibold">Otro tipo de negocio</span>
              </div>
            </button>
          ) : (
            <div className="p-4 rounded-xl border-2 border-cyan-500 bg-cyan-500/5">
              <Input
                value={otherType}
                onChange={(e) => setOtherType(e.target.value)}
                placeholder="Escribe el tipo de negocio..."
                className="mb-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddOther()
                  }
                }}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddOther} className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                  Seleccionar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowOtherInput(false)
                    setOtherType("")
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedType}
            className="px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
          >
            Continuar
          </Button>
        </div>
      </Card>
    </div>
  )
}
