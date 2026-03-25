"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, BarChart3, Target } from "lucide-react"
import type { SimulationResult, BusinessData } from "@/types/simulation"
import { ComparisonCharts } from "@/components/comparison-charts"
import { CountryDetailCard } from "@/components/country-detail-card"
import { generateSimulationPDF } from "@/lib/pdf-generator"

interface SimulationResultsProps {
  results: SimulationResult[]
  businessData: BusinessData
}

export function SimulationResults({ results, businessData }: SimulationResultsProps) {
  const [selectedView, setSelectedView] = useState<"ranking" | "comparison">("ranking")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true)
    try {
      generateSimulationPDF(results, businessData)
    } catch (error) {
      console.error("Error al generar PDF:", error)
      alert("Hubo un error al generar el PDF. Por favor, intenta nuevamente.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 px-4">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
          Resultados de tu Simulación
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
          Análisis comparativo de {results.length} estados para {businessData.businessType}
        </p>
      </div>

      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as "ranking" | "comparison")}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14 p-1 bg-muted/50 backdrop-blur">
          <TabsTrigger
            value="ranking"
            className="flex items-center gap-2 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
          >
            <Target className="w-5 h-5" />
            Ranking
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            className="flex items-center gap-2 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
          >
            <BarChart3 className="w-5 h-5" />
            Comparación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-6 mt-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Ranking de Oportunidades</h2>
            <p className="text-muted-foreground">Estados ordenados por score general de viabilidad</p>
          </div>
          <div className="grid gap-6">
            {results.map((result, index) => (
              <CountryDetailCard key={result.country} result={result} rank={index + 1} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-10 mt-10">
          <ComparisonCharts results={results} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-center gap-6 pt-8 pb-12">
        <Button
          variant="outline"
          size="lg"
          className="h-14 px-8 text-base font-semibold border-2 hover:border-primary hover:bg-primary/5 bg-transparent"
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
        >
          <Download className="mr-2 w-5 h-5" />
          {isGeneratingPDF ? "Generando PDF..." : "Descargar Reporte PDF"}
        </Button>
        <Button
          size="lg"
          onClick={() => window.location.reload()}
          className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
        >
          Nueva Simulación
        </Button>
      </div>
    </div>
  )
}
