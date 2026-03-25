"use client"

import { Card } from "@/components/ui/card"
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calculator,
  Clock,
  BarChart3,
  Building2,
  FileText,
  Target,
} from "lucide-react"
import type { SimulationResult } from "@/types/simulation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CountryDetailCardProps {
  result: SimulationResult
  rank: number
}

export function CountryDetailCard({ result, rank }: CountryDetailCardProps) {
  const [showAllRisks, setShowAllRisks] = useState(false)
  const [showAllOpportunities, setShowAllOpportunities] = useState(false)
  const [showInvestmentBreakdown, setShowInvestmentBreakdown] = useState(false)
  const [showROIBreakdown, setShowROIBreakdown] = useState(false)
  const [showPaybackBreakdown, setShowPaybackBreakdown] = useState(false)
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [showMarketBreakdown, setShowMarketBreakdown] = useState(false)
  const [showRegulatoryBreakdown, setShowRegulatoryBreakdown] = useState(false)
  const [showFinancialBreakdown, setShowFinancialBreakdown] = useState(false)
  const [showSuccessProbabilityBreakdown, setShowSuccessProbabilityBreakdown] = useState(false)

  const displayedRisks = showAllRisks ? result.risks : result.risks.slice(0, 2)
  const displayedOpportunities = showAllOpportunities ? result.opportunities : result.opportunities.slice(0, 2)

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500 to-yellow-600"
    if (rank === 2) return "from-gray-400 to-gray-500"
    if (rank === 3) return "from-orange-600 to-orange-700"
    return "from-primary to-accent"
  }

  const annualNetProfit = (result.initialInvestment * result.roi) / 100
  const monthlyNetProfit = annualNetProfit / 12

  return (
    <Card className="p-6 hover:shadow-xl transition-shadow duration-300 border-2">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRankColor(rank)} flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg`}
          >
            {rank}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{result.country}</h3>
              <div className="flex items-center gap-6 text-sm flex-wrap">
                <button
                  onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
                  className="flex items-center gap-2 hover:bg-primary/10 px-2 py-1 rounded-lg transition-colors"
                >
                  <span className="text-muted-foreground">Score General:</span>
                  <span className="font-bold text-xl text-primary">{result.overallScore.toFixed(2)}/100</span>
                  <BarChart3 className="w-4 h-4 text-primary" />
                </button>
                <button
                  onClick={() => setShowSuccessProbabilityBreakdown(!showSuccessProbabilityBreakdown)}
                  className="flex items-center gap-2 hover:bg-accent/10 px-2 py-1 rounded-lg transition-colors"
                >
                  <span className="text-muted-foreground">Probabilidad de Éxito:</span>
                  <span className="font-bold text-xl text-accent">{result.successProbability}%</span>
                  <Target className="w-4 h-4 text-accent" />
                </button>
              </div>
            </div>

            {showScoreBreakdown && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-muted animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span>Desglose del Score General</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  El score general se calcula como un promedio ponderado de tres dimensiones principales, ajustado según
                  tus prioridades seleccionadas
                </div>
                <div className="space-y-3">
                  <div className="bg-background/50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Score de Mercado:</span>
                      <span className="font-bold text-primary">{result.marketScore.toFixed(2)}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Score Regulatorio:</span>
                      <span className="font-bold text-accent">{result.regulatoryScore.toFixed(2)}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Score Financiero:</span>
                      <span className="font-bold text-chart-3">{result.financialScore.toFixed(2)}/100</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">Pesos aplicados según tus prioridades:</p>
                    <ul className="space-y-1 pl-4">
                      <li>• Los pesos se ajustan automáticamente según las prioridades que seleccionaste</li>
                      <li>• Si priorizaste "Gran mercado", el peso del score de mercado aumenta</li>
                      <li>• Si priorizaste "Bajos impuestos", el peso del score financiero aumenta</li>
                      <li>• Si priorizaste "Buena logística", el peso del score regulatorio aumenta</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {showSuccessProbabilityBreakdown && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-muted animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="w-4 h-4 text-accent" />
                  <span>Desglose de la Probabilidad de Éxito</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  La probabilidad de éxito se calcula considerando múltiples factores ponderados que determinan la
                  viabilidad real del proyecto
                </div>

                <div className="space-y-2 text-sm">
                  <div className="bg-background/50 rounded-lg p-3 space-y-2">
                    <div className="font-semibold text-accent mb-2">Componentes del cálculo:</div>

                    <div className="space-y-3">
                      <div className="border-l-2 border-primary pl-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">Score General del País</span>
                          <span className="text-xs font-bold text-primary">35% del peso</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Evaluación integral del mercado, ambiente regulatorio y viabilidad financiera
                        </p>
                        <div className="mt-1 text-xs">
                          Score: <span className="font-semibold">{result.overallScore.toFixed(2)}/100</span>
                        </div>
                      </div>

                      <div className="border-l-2 border-chart-2 pl-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">ROI Proyectado</span>
                          <span className="text-xs font-bold text-chart-2">45% del peso</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Factor más importante: retorno sobre inversión determina viabilidad económica
                        </p>
                        <div className="mt-1 text-xs space-y-1">
                          <div>
                            ROI: <span className="font-semibold">{result.roi.toFixed(2)}%</span>
                          </div>
                          <div className="text-muted-foreground">
                            {result.roi > 25 && "✓ Excelente (>25%): +45 puntos"}
                            {result.roi > 20 && result.roi <= 25 && "✓ Muy bueno (20-25%): +38 puntos"}
                            {result.roi > 15 && result.roi <= 20 && "✓ Bueno (15-20%): +30 puntos"}
                            {result.roi > 10 && result.roi <= 15 && "⚠ Moderado (10-15%): +22 puntos"}
                            {result.roi > 5 && result.roi <= 10 && "⚠ Bajo (5-10%): +15 puntos"}
                            {result.roi <= 5 && "⚠ Muy bajo (<5%): +8 puntos"}
                          </div>
                        </div>
                      </div>

                      <div className="border-l-2 border-destructive pl-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">Factores de Riesgo del País</span>
                          <span className="text-xs font-bold text-destructive">20% del peso</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Ajustes por condiciones específicas del mercado objetivo
                        </p>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>• Complejidad regulatoria y facilidad de hacer negocios</li>
                          <li>• Nivel de competencia en el mercado gastronómico</li>
                          <li>• Estabilidad política y calidad institucional</li>
                          <li>• Inflación y crecimiento económico</li>
                          <li>• Similitud cultural y adaptación requerida</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="font-semibold mb-2">Interpretación del resultado:</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {result.successProbability >= 75 && (
                        <p className="text-accent font-medium">
                          ✓ Probabilidad Alta ({result.successProbability}%): Proyecto con fundamentos sólidos y alto
                          potencial de éxito. Condiciones favorables en múltiples dimensiones.
                        </p>
                      )}
                      {result.successProbability >= 60 && result.successProbability < 75 && (
                        <p className="text-primary font-medium">
                          ✓ Probabilidad Buena ({result.successProbability}%): Proyecto viable con buenos fundamentos.
                          Requiere ejecución cuidadosa y monitoreo de riesgos identificados.
                        </p>
                      )}
                      {result.successProbability >= 45 && result.successProbability < 60 && (
                        <p className="text-yellow-600 font-medium">
                          ⚠ Probabilidad Moderada ({result.successProbability}%): Proyecto factible pero con desafíos
                          significativos. Requiere estrategia robusta y mitigación activa de riesgos.
                        </p>
                      )}
                      {result.successProbability < 45 && (
                        <p className="text-destructive font-medium">
                          ⚠ Probabilidad Baja ({result.successProbability}%): Proyecto de alto riesgo. Considerar
                          ajustes al modelo de negocio o explorar mercados alternativos.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-muted flex justify-between items-center font-bold">
                  <span>Probabilidad de Éxito Final:</span>
                  <span className="text-accent text-lg">{result.successProbability}%</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setShowMarketBreakdown(!showMarketBreakdown)}
                className="space-y-2 text-left hover:bg-primary/5 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Mercado</p>
                  <Building2 className="w-3 h-3 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                      style={{ width: `${result.marketScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-12">{result.marketScore.toFixed(2)}</span>
                </div>
              </button>

              <button
                onClick={() => setShowRegulatoryBreakdown(!showRegulatoryBreakdown)}
                className="space-y-2 text-left hover:bg-accent/5 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Regulatorio</p>
                  <FileText className="w-3 h-3 text-accent" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500"
                      style={{ width: `${result.regulatoryScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-12">{result.regulatoryScore.toFixed(2)}</span>
                </div>
              </button>

              <button
                onClick={() => setShowFinancialBreakdown(!showFinancialBreakdown)}
                className="space-y-2 text-left hover:bg-chart-3/5 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Financiero</p>
                  <DollarSign className="w-3 h-3 text-chart-3" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-chart-3 to-chart-3/80 rounded-full transition-all duration-500"
                      style={{ width: `${result.financialScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-12">{result.financialScore.toFixed(2)}</span>
                </div>
              </button>
            </div>

            {showMarketBreakdown && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-muted animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>Detalle del Score de Mercado</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Evalúa el potencial del mercado gastronómico considerando tamaño, crecimiento, competencia y
                  características demográficas
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-background/50 rounded-lg p-3 space-y-2">
                    <div className="font-semibold mb-2">Factores evaluados:</div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Tamaño del mercado (población y urbanización)</li>
                      <li>• Desarrollo del mercado gastronómico local</li>
                      <li>• Tasa de crecimiento económico</li>
                      <li>• Nivel de competencia existente</li>
                      <li>• Sector turístico y flujo de visitantes</li>
                      <li>• Conectividad digital y penetración de internet</li>
                    </ul>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">Interpretación:</p>
                    {result.marketScore >= 75 && (
                      <p className="text-primary">✓ Mercado excelente con alto potencial de crecimiento</p>
                    )}
                    {result.marketScore >= 60 && result.marketScore < 75 && (
                      <p className="text-accent">✓ Mercado bueno con oportunidades sólidas</p>
                    )}
                    {result.marketScore >= 45 && result.marketScore < 60 && (
                      <p className="text-yellow-600">⚠ Mercado moderado, requiere estrategia específica</p>
                    )}
                    {result.marketScore < 45 && (
                      <p className="text-destructive">⚠ Mercado desafiante, considerar nicho específico</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showRegulatoryBreakdown && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-muted animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="w-4 h-4 text-accent" />
                  <span>Detalle del Score Regulatorio</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Evalúa la facilidad para operar considerando regulaciones, estabilidad política, calidad institucional
                  y similitud cultural
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-background/50 rounded-lg p-3 space-y-2">
                    <div className="font-semibold mb-2">Factores evaluados:</div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Facilidad para hacer negocios (permisos, licencias)</li>
                      <li>• Complejidad regulatoria del sector gastronómico</li>
                      <li>• Similitud cultural y adaptación requerida</li>
                      <li>• Estabilidad política y previsibilidad</li>
                      <li>• Calidad de las instituciones regulatorias</li>
                      <li>• Apertura comercial y facilidad de importación</li>
                    </ul>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">Interpretación:</p>
                    {result.regulatoryScore >= 75 && (
                      <p className="text-primary">✓ Ambiente regulatorio muy favorable</p>
                    )}
                    {result.regulatoryScore >= 60 && result.regulatoryScore < 75 && (
                      <p className="text-accent">✓ Ambiente regulatorio favorable</p>
                    )}
                    {result.regulatoryScore >= 45 && result.regulatoryScore < 60 && (
                      <p className="text-yellow-600">⚠ Complejidad regulatoria moderada</p>
                    )}
                    {result.regulatoryScore < 45 && (
                      <p className="text-destructive">⚠ Alta complejidad, requiere asesoría especializada</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showFinancialBreakdown && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-muted animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <DollarSign className="w-4 h-4 text-chart-3" />
                  <span>Detalle del Score Financiero</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Evalúa la viabilidad financiera considerando costos operativos, tributación, poder adquisitivo y
                  estabilidad económica
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-background/50 rounded-lg p-3 space-y-2">
                    <div className="font-semibold mb-2">Factores evaluados:</div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Eficiencia de costos (laboral, alquiler, operativos)</li>
                      <li>• Poder adquisitivo de la población (PIB per cápita)</li>
                      <li>• Carga tributaria y sistema impositivo</li>
                      <li>• Estabilidad de precios (inflación)</li>
                      <li>• Flujo de inversión extranjera directa</li>
                    </ul>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">Interpretación:</p>
                    {result.financialScore >= 75 && <p className="text-primary">✓ Excelente viabilidad financiera</p>}
                    {result.financialScore >= 60 && result.financialScore < 75 && (
                      <p className="text-accent">✓ Buena viabilidad financiera</p>
                    )}
                    {result.financialScore >= 45 && result.financialScore < 60 && (
                      <p className="text-yellow-600">⚠ Viabilidad moderada, optimizar costos</p>
                    )}
                    {result.financialScore < 45 && (
                      <p className="text-destructive">⚠ Costos elevados, requiere modelo de alto margen</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-2">
              <button
                onClick={() => setShowInvestmentBreakdown(!showInvestmentBreakdown)}
                className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 rounded-xl p-4 border border-chart-2/20 hover:border-chart-2/40 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-muted-foreground">Inversión Inicial</p>
                  <DollarSign className="w-3 h-3 text-chart-2" />
                </div>
                <p className="text-2xl font-bold text-chart-2">USD {(result.initialInvestment / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground mt-1">clic para desglose</p>
              </button>

              <button
                onClick={() => setShowROIBreakdown(!showROIBreakdown)}
                className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20 hover:border-primary/40 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-muted-foreground">ROI Proyectado</p>
                  <Calculator className="w-3 h-3 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">{result.roi.toFixed(2)}%</p>
                <p className="text-xs text-muted-foreground mt-1">clic para cálculo</p>
              </button>

              <button
                onClick={() => setShowPaybackBreakdown(!showPaybackBreakdown)}
                className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20 hover:border-accent/40 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-muted-foreground">Recuperación</p>
                  <Clock className="w-3 h-3 text-accent" />
                </div>
                <p className="text-2xl font-bold text-accent">
                  {result.paybackPeriod > 100 ? "N/A" : result.paybackPeriod}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.paybackPeriod > 100 ? "no viable" : "clic para detalles"}
                </p>
              </button>
            </div>

            {showInvestmentBreakdown && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-muted animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <DollarSign className="w-4 h-4 text-chart-2" />
                  <span>Desglose de Inversión Inicial</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Cálculo basado en datos del mercado gastronómico, complejidad regulatoria y costos operativos de{" "}
                  {result.country}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Establecimiento y Legal:</span>
                    <span className="font-semibold">USD {result.investmentBreakdown.setupCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Equipamiento:</span>
                    <span className="font-semibold">USD {result.investmentBreakdown.equipment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Inventario Inicial:</span>
                    <span className="font-semibold">
                      USD {result.investmentBreakdown.initialInventory.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Marketing y Lanzamiento:</span>
                    <span className="font-semibold">USD {result.investmentBreakdown.marketing.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Capital de Trabajo (3 meses):</span>
                    <span className="font-semibold">
                      USD {result.investmentBreakdown.workingCapital.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Fondo de Contingencia (10%):</span>
                    <span className="font-semibold">USD {result.investmentBreakdown.contingency.toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-muted flex justify-between items-center font-bold">
                  <span>Total Inversión Inicial:</span>
                  <span className="text-chart-2 text-lg">USD {result.initialInvestment.toLocaleString()}</span>
                </div>
              </div>
            )}

            {showROIBreakdown && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-muted animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Calculator className="w-4 h-4 text-primary" />
                  <span>Cálculo del ROI Proyectado</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Basado en márgenes netos típicos de la industria gastronómica (3-5%), ajustados por competencia,
                  costos operativos y poder adquisitivo de {result.country}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="bg-background/50 rounded-lg p-3 space-y-2">
                    <div className="font-semibold text-primary">Fórmula del ROI:</div>
                    <div className="font-mono text-xs bg-muted/50 p-2 rounded">
                      ROI = (Ganancia Neta Anual / Inversión Inicial) × 100
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Inversión Inicial:</span>
                      <span className="font-semibold">USD {result.initialInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Ganancia Neta Anual Estimada:</span>
                      <span className="font-semibold">
                        USD {annualNetProfit.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="pl-4">→ Ganancia Neta Mensual:</span>
                      <span>USD {monthlyNetProfit.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="font-semibold mb-2">Factores considerados:</div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Ingresos mensuales estimados según tamaño y mercado</li>
                      <li>• Costos operativos (personal, alquiler, insumos, servicios)</li>
                      <li>• Margen neto ajustado por competencia y tributación</li>
                      <li>• Poder adquisitivo y desarrollo del mercado gastronómico</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-muted flex justify-between items-center font-bold">
                  <span>ROI Proyectado Anual:</span>
                  <span className="text-primary text-lg">{result.roi.toFixed(2)}%</span>
                </div>
              </div>
            )}

            {showPaybackBreakdown && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-muted animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>Cálculo del Período de Recuperación</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Tiempo estimado para recuperar la inversión inicial basado en la ganancia neta mensual proyectada
                </div>

                <div className="space-y-2 text-sm">
                  <div className="bg-background/50 rounded-lg p-3 space-y-2">
                    <div className="font-semibold text-accent">Fórmula del Período de Recuperación:</div>
                    <div className="font-mono text-xs bg-muted/50 p-2 rounded">
                      Meses = Inversión Inicial / Ganancia Neta Mensual
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Inversión Inicial:</span>
                      <span className="font-semibold">USD {result.initialInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Ganancia Neta Mensual:</span>
                      <span className="font-semibold">
                        USD {monthlyNetProfit.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="pl-4">→ Ganancia Neta Anual:</span>
                      <span>USD {annualNetProfit.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="font-semibold mb-2">Interpretación:</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {result.paybackPeriod <= 24 && (
                        <p className="text-accent">✓ Excelente: Recuperación rápida en menos de 2 años</p>
                      )}
                      {result.paybackPeriod > 24 && result.paybackPeriod <= 36 && (
                        <p className="text-primary">✓ Bueno: Recuperación en 2-3 años, típico del sector</p>
                      )}
                      {result.paybackPeriod > 36 && result.paybackPeriod <= 60 && (
                        <p className="text-yellow-600">⚠ Moderado: Recuperación en 3-5 años, requiere paciencia</p>
                      )}
                      {result.paybackPeriod > 60 && result.paybackPeriod <= 100 && (
                        <p className="text-destructive">⚠ Alto riesgo: Recuperación mayor a 5 años</p>
                      )}
                      {result.paybackPeriod > 100 && (
                        <p className="text-destructive">✗ No viable: Ganancia insuficiente para recuperar inversión</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-muted flex justify-between items-center font-bold">
                  <span>Período de Recuperación:</span>
                  <span className="text-accent text-lg">
                    {result.paybackPeriod > 100 ? "No viable" : `${result.paybackPeriod} meses`}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <span>Insights Clave</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-primary mt-1 font-bold">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span>Riesgos Principales</span>
                    </div>
                    {result.risks.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllRisks(!showAllRisks)}
                        className="h-7 px-2 text-xs hover:bg-destructive/10"
                      >
                        {showAllRisks ? (
                          <>
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Menos
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 mr-1" />
                            Ver todos ({result.risks.length})
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {displayedRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-destructive mt-1 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <span>Oportunidades Clave</span>
                    </div>
                    {result.opportunities.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllOpportunities(!showAllOpportunities)}
                        className="h-7 px-2 text-xs hover:bg-accent/10"
                      >
                        {showAllOpportunities ? (
                          <>
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Menos
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 mr-1" />
                            Ver todas ({result.opportunities.length})
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {displayedOpportunities.map((opp, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-accent mt-1 font-bold">•</span>
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
