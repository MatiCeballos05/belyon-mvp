"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, TrendingDown, Users, Truck, DollarSign, Building2, Coins, Wifi, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Priority {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

const PRIORITIES: Priority[] = [
  {
    id: "low-taxes",
    label: "Bajos impuestos",
    icon: <TrendingDown className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "large-market",
    label: "Gran mercado",
    icon: <Users className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "good-logistics",
    label: "Buena logística",
    icon: <Truck className="w-6 h-6" />,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "low-labor-cost",
    label: "Menor costo laboral",
    icon: <DollarSign className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "infrastructure",
    label: "Mejor infraestructura",
    icon: <Building2 className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "monetary-stability",
    label: "Estabilidad monetaria y cambiaria",
    icon: <Coins className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: "digital-connectivity",
    label: "Conectividad digital",
    icon: <Wifi className="w-6 h-6" />,
    color: "from-cyan-500 to-teal-500",
  },
]

interface PrioritiesSelectorProps {
  onComplete: (priorities: string[]) => void
}

export function PrioritiesSelector({ onComplete }: PrioritiesSelectorProps) {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [otherPriority, setOtherPriority] = useState("")

  const togglePriority = (id: string) => {
    if (selectedPriorities.includes(id)) {
      setSelectedPriorities(selectedPriorities.filter((p) => p !== id))
    } else if (selectedPriorities.length < 3) {
      setSelectedPriorities([...selectedPriorities, id])
    }
  }

  const handleAddOther = () => {
    if (otherPriority.trim() && selectedPriorities.length < 3) {
      setSelectedPriorities([...selectedPriorities, `other:${otherPriority}`])
      setOtherPriority("")
      setShowOtherInput(false)
    }
  }

  const handleContinue = () => {
    if (selectedPriorities.length > 0) {
      onComplete(selectedPriorities)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-8 md:p-12 shadow-2xl border-2 border-primary/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
            ¿Cuáles son tus prioridades?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Como pyme, ¿cuáles son tus mayores prioridades a la hora de pensar en expandirte? Vamos a utilizar estos
            datos para entregarte el mejor escenario adaptado a tu empresa.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-sm font-medium text-primary">Selecciona hasta 3 prioridades</span>
            <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">
              {selectedPriorities.length}/3
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {PRIORITIES.map((priority) => {
            const isSelected = selectedPriorities.includes(priority.id)
            const isDisabled = !isSelected && selectedPriorities.length >= 3

            return (
              <button
                key={priority.id}
                onClick={() => togglePriority(priority.id)}
                disabled={isDisabled}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300
                  ${
                    isSelected
                      ? `bg-gradient-to-br ${priority.color} border-transparent text-white shadow-lg scale-105`
                      : isDisabled
                        ? "bg-muted/50 border-border/50 text-muted-foreground cursor-not-allowed opacity-50"
                        : "bg-card border-border hover:border-primary/50 hover:shadow-md hover:scale-102"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`p-3 rounded-full ${isSelected ? "bg-white/20" : "bg-primary/10"}`}>
                    {priority.icon}
                  </div>
                  <span className="font-semibold text-sm leading-tight">{priority.label}</span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}

          {/* Opción "Otras" */}
          {!showOtherInput ? (
            <button
              onClick={() => setShowOtherInput(true)}
              disabled={selectedPriorities.length >= 3}
              className={`
                p-6 rounded-xl border-2 border-dashed transition-all duration-300
                ${
                  selectedPriorities.length >= 3
                    ? "bg-muted/50 border-border/50 text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-card border-primary/30 hover:border-primary hover:bg-primary/5 hover:shadow-md"
                }
              `}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <span className="font-semibold text-sm">Otras</span>
              </div>
            </button>
          ) : (
            <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
              <Input
                value={otherPriority}
                onChange={(e) => setOtherPriority(e.target.value)}
                placeholder="Escribe tu prioridad..."
                className="mb-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddOther()
                  }
                }}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddOther} className="flex-1">
                  Agregar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowOtherInput(false)} className="flex-1">
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
            disabled={selectedPriorities.length === 0}
            className="px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continuar con la simulación
          </Button>
        </div>
      </Card>
    </div>
  )
}
