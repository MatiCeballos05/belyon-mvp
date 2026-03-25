"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, Users, DollarSign, Globe2, Target, TrendingUp, ArrowRight } from "lucide-react"
import type { BusinessData } from "@/types/simulation"

interface BusinessSummaryProps {
  businessData: BusinessData
  onStartSimulation: () => void
}

export function BusinessSummary({ businessData, onStartSimulation }: BusinessSummaryProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Resumen de tu negocio</h1>
        <p className="text-muted-foreground">Revisa la información antes de iniciar la simulación</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>Tipo de negocio</span>
            </div>
            <p className="text-lg font-semibold">{businessData.businessType || "No especificado"}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Años operando</span>
            </div>
            <p className="text-lg font-semibold">{businessData.yearsOperating || "No especificado"}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Empleados</span>
            </div>
            <p className="text-lg font-semibold">{businessData.employees || "No especificado"}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>Presupuesto</span>
            </div>
            <p className="text-lg font-semibold">{businessData.budget || "No especificado"}</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe2 className="w-4 h-4" />
              <span>Países objetivo</span>
            </div>
            <p className="text-lg font-semibold">{businessData.targetCountries || "No especificado"}</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>Motivación</span>
            </div>
            <p className="text-lg font-semibold">Expandir operaciones internacionalmente</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline" size="lg" onClick={() => window.history.back()}>
          Editar información
        </Button>
        <Button size="lg" onClick={onStartSimulation}>
          Iniciar Simulación
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
