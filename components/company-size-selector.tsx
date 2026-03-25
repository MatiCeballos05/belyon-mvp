"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Users, Building2, Building, Briefcase } from "lucide-react"

interface CompanySize {
  id: string
  label: string
  range: string
  icon: React.ReactNode
  color: string
}

const COMPANY_SIZES: CompanySize[] = [
  {
    id: "micro",
    label: "Microempresa",
    range: "1 a 9 empleados",
    icon: <Users className="w-6 h-6" />,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: "small",
    label: "Pequeña",
    range: "10 a 50 empleados",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-green-500 to-teal-500",
  },
  {
    id: "medium",
    label: "Mediana",
    range: "51 a 200 empleados",
    icon: <Building2 className="w-6 h-6" />,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "large",
    label: "Grande",
    range: "Más de 200 empleados",
    icon: <Building className="w-6 h-6" />,
    color: "from-cyan-500 to-blue-500",
  },
]

interface CompanySizeSelectorProps {
  onComplete: (size: string) => void
}

export function CompanySizeSelector({ onComplete }: CompanySizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")

  const selectSize = (id: string) => {
    setSelectedSize(id)
  }

  const handleContinue = () => {
    if (selectedSize) {
      onComplete(selectedSize)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500/10 via-background to-green-500/10 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-8 md:p-12 shadow-2xl border-2 border-emerald-500/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
            ¿Cuál es el tamaño de tu empresa?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecciona el rango que mejor describe el tamaño actual de tu empresa. Esto nos ayudará a ajustar las
            proyecciones y recomendaciones según tu capacidad operativa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {COMPANY_SIZES.map((size) => {
            const isSelected = selectedSize === size.id

            return (
              <button
                key={size.id}
                onClick={() => selectSize(size.id)}
                className={`
                  relative p-8 rounded-xl border-2 transition-all duration-300
                  ${
                    isSelected
                      ? `bg-gradient-to-br ${size.color} border-transparent text-white shadow-lg scale-105`
                      : "bg-card border-border hover:border-emerald-500/50 hover:shadow-md hover:scale-102"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`p-4 rounded-full ${isSelected ? "bg-white/20" : "bg-emerald-500/10"}`}>
                    {size.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{size.label}</h3>
                    <p className={`text-sm ${isSelected ? "text-white/90" : "text-muted-foreground"}`}>{size.range}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-500" />
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
            disabled={!selectedSize}
            className="px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
          >
            Continuar
          </Button>
        </div>
      </Card>
    </div>
  )
}
