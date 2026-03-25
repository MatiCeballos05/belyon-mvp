"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, MapPin } from "lucide-react"
import Image from "next/image"

interface Country {
  id: string
  name: string
  flag: string
  description: string
}

const COUNTRIES: Country[] = [
  {
    id: "uruguay",
    name: "Uruguay",
    flag: "https://flagcdn.com/w320/uy.png",
    description: "Estabilidad política y económica",
  },
  {
    id: "chile",
    name: "Chile",
    flag: "https://flagcdn.com/w320/cl.png",
    description: "Economía desarrollada y mercado maduro",
  },
  {
    id: "paraguay",
    name: "Paraguay",
    flag: "https://flagcdn.com/w320/py.png",
    description: "Bajos costos operativos",
  },
  {
    id: "brasil",
    name: "Brasil",
    flag: "https://flagcdn.com/w320/br.png",
    description: "Mercado más grande de la región",
  },
  {
    id: "bolivia",
    name: "Bolivia",
    flag: "https://flagcdn.com/w320/bo.png",
    description: "Mercado emergente con potencial",
  },
]

interface TargetCountriesSelectorProps {
  onComplete: (countries: string[]) => void
}

export function TargetCountriesSelector({ onComplete }: TargetCountriesSelectorProps) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  const toggleCountry = (id: string) => {
    if (selectedCountries.includes(id)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== id))
    } else if (selectedCountries.length < 5) {
      setSelectedCountries([...selectedCountries, id])
    }
  }

  const handleContinue = () => {
    if (selectedCountries.length >= 2) {
      onComplete(selectedCountries)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500/10 via-background to-amber-500/10 flex items-center justify-center p-4">
      <Card className="max-w-5xl w-full p-8 md:p-12 shadow-2xl border-2 border-orange-500/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            ¿A qué países te interesa expandir tu empresa?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Selecciona de 2 a 5 países donde te gustaría explorar oportunidades de expansión. Analizaremos cada mercado
            en detalle.
          </p>
          <p className="text-sm font-semibold text-orange-600">{selectedCountries.length} de 5 países seleccionados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {COUNTRIES.map((country) => {
            const isSelected = selectedCountries.includes(country.id)
            const canSelect = selectedCountries.length < 5 || isSelected

            return (
              <button
                key={country.id}
                onClick={() => toggleCountry(country.id)}
                disabled={!canSelect}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300
                  ${
                    isSelected
                      ? "bg-gradient-to-br from-orange-500 to-amber-500 border-transparent text-white shadow-lg scale-105"
                      : canSelect
                        ? "bg-card border-border hover:border-orange-500/50 hover:shadow-md hover:scale-102"
                        : "bg-card border-border opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div
                    className={`relative w-24 h-16 rounded-md overflow-hidden ring-2 ${
                      isSelected ? "ring-white" : "ring-orange-500/30"
                    }`}
                  >
                    <Image
                      src={country.flag || "/placeholder.svg"}
                      alt={`Bandera de ${country.name}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{country.name}</h3>
                    <p className={`text-sm ${isSelected ? "text-white/90" : "text-muted-foreground"}`}>
                      {country.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-orange-500" />
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
            disabled={selectedCountries.length < 2}
            className="px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            Continuar con {selectedCountries.length} {selectedCountries.length === 1 ? "país" : "países"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
