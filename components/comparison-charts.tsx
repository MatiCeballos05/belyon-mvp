"use client"

import { Card } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts"
import type { SimulationResult } from "@/types/simulation"
import { TrendingUp, DollarSign, MapPin } from "lucide-react"

interface ComparisonChartsProps {
  results: SimulationResult[]
}

export function ComparisonCharts({ results }: ComparisonChartsProps) {
  // Datos para gráfico de burbujas (Score vs ROI vs Inversión)
  const bubbleData = results.map((r) => ({
    country: r.country,
    score: r.overallScore,
    roi: Math.max(r.roi, 0),
    investment: r.initialInvestment,
    success: r.successProbability,
  }))

  // Datos para proyección de crecimiento (simulación de 5 años)
  const growthProjectionData = Array.from({ length: 5 }, (_, year) => {
    const yearData: any = { year: `Año ${year + 1}` }
    results.forEach((r) => {
      // Proyección de crecimiento basada en ROI
      const growthRate = r.roi / 100
      yearData[r.country] = Number((r.initialInvestment * Math.pow(1 + growthRate, year + 1)).toFixed(0))
    })
    return yearData
  })

  // Datos para comparación de métricas clave
  const metricsData = results.map((r) => ({
    country: r.country,
    "Score General": r.overallScore,
    "Prob. Éxito": r.successProbability,
    "ROI (%)": Math.max(r.roi, 0),
  }))

  // Datos para análisis de riesgo-retorno
  const riskReturnData = results.map((r) => ({
    country: r.country,
    riesgo: 100 - r.successProbability, // Inverso de probabilidad de éxito
    retorno: Math.max(r.roi, 0),
    score: r.overallScore,
  }))

  const colors = [
    "#3B82F6", // Azul brillante
    "#8B5CF6", // Violeta vibrante
    "#10B981", // Verde esmeralda
    "#F59E0B", // Ámbar cálido
    "#EC4899", // Rosa fucsia
  ]

  const pyramidLevels = [
    { name: "MUY BUENO", range: "51-100", color: "#10B981", countries: results.filter((r) => r.overallScore >= 51) },
    {
      name: "REGULAR",
      range: "21-50",
      color: "#F59E0B",
      countries: results.filter((r) => r.overallScore >= 21 && r.overallScore < 51),
    },
    { name: "BAJO", range: "0-20", color: "#EC4899", countries: results.filter((r) => r.overallScore < 21) },
  ]

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
          Análisis Comparativo Avanzado
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Visualizaciones interactivas para comparar oportunidades de expansión en Latinoamérica
        </p>
      </div>

      <Card className="p-8 border-2 border-primary/10 shadow-2xl bg-gradient-to-br from-background via-primary/5 to-accent/5 backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Ranking Piramidal de Oportunidades</h3>
            <p className="text-sm text-muted-foreground">
              Países agrupados por nivel de score • Los mejores en la cima
            </p>
          </div>
        </div>

        {/* Leyenda de niveles */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {pyramidLevels.map((level) => (
            <div key={level.name} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: level.color }} />
              <span className="text-sm font-medium">
                {level.name} ({level.range})
              </span>
            </div>
          ))}
        </div>

        {/* Pirámide de ranking */}
        <div className="relative w-full max-w-5xl mx-auto">
          <div className="space-y-4">
            {pyramidLevels.map((level, levelIndex) => {
              // Calcular ancho de cada nivel (más estrecho arriba, más ancho abajo)
              const widthPercentage = 40 + levelIndex * 15
              const hasCountries = level.countries.length > 0

              return (
                <div key={level.name} className="flex flex-col items-center gap-3">
                  {/* Barra del nivel */}
                  <div
                    className="relative rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 group"
                    style={{
                      width: `${widthPercentage}%`,
                      backgroundColor: level.color,
                      minHeight: hasCountries ? "120px" : "80px",
                      boxShadow: `0 10px 40px ${level.color}40`,
                    }}
                  >
                    {/* Efecto glow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                      style={{ backgroundColor: level.color }}
                    />

                    {/* Contenido del nivel */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-center">
                      {/* Título del nivel */}
                      <div className="text-center mb-3">
                        <h4 className="text-2xl font-black text-white drop-shadow-lg mb-1">{level.name}</h4>
                        <p className="text-sm font-bold text-white/90 uppercase tracking-wider">{level.range} puntos</p>
                      </div>

                      {/* Países en este nivel */}
                      {hasCountries ? (
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                          {level.countries.map((country) => (
                            <div
                              key={country.country}
                              className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-white/30 hover:bg-white/30 transition-all duration-200 cursor-pointer group/country"
                            >
                              <div className="text-center">
                                <div className="text-white font-black text-lg drop-shadow-md">{country.country}</div>
                                <div className="text-white/90 font-bold text-sm mt-1">
                                  Score: {country.overallScore.toFixed(1)}
                                </div>
                                <div className="text-white/80 text-xs mt-1">
                                  ROI: {country.roi.toFixed(1)}% • Éxito: {country.successProbability}%
                                </div>
                              </div>

                              {/* Tooltip detallado */}
                              <div className="absolute left-1/2 top-full transform -translate-x-1/2 mt-4 opacity-0 group-hover/country:opacity-100 transition-all duration-300 pointer-events-none z-50 scale-95 group-hover/country:scale-100">
                                <div className="bg-background/98 backdrop-blur-xl border-2 border-border rounded-2xl shadow-2xl p-5 min-w-[280px]">
                                  <div className="font-bold text-lg mb-4 pb-3 border-b-2 border-border flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: level.color }} />
                                    {country.country}
                                  </div>
                                  <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground font-semibold">Score General:</span>
                                      <span className="font-black text-lg" style={{ color: level.color }}>
                                        {country.overallScore.toFixed(1)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground font-medium">Mercado:</span>
                                      <span className="font-bold text-base">{country.marketScore.toFixed(1)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground font-medium">Regulatorio:</span>
                                      <span className="font-bold text-base">{country.regulatoryScore.toFixed(1)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground font-medium">Financiero:</span>
                                      <span className="font-bold text-base">{country.financialScore.toFixed(1)}</span>
                                    </div>
                                    <div className="h-px bg-border my-2" />
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground font-medium">ROI Anual:</span>
                                      <span className="font-bold text-primary text-base">
                                        {country.roi.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground font-medium">Inversión:</span>
                                      <span className="font-bold text-base text-chart-3">
                                        USD {(country.initialInvestment / 1000).toFixed(0)}K
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground font-medium">Recuperación:</span>
                                      <span className="font-bold text-base">
                                        {country.paybackPeriod > 100 ? "N/A" : `${country.paybackPeriod}m`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-white/70 text-sm font-medium italic mt-2">
                          No hay países en este nivel
                        </div>
                      )}

                      {/* Contador de países */}
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center border-2 border-white/30">
                        <span className="text-white font-black text-lg">{level.countries.length}</span>
                      </div>
                    </div>

                    {/* Borde decorativo */}
                    <div className="absolute inset-0 rounded-2xl border-4 border-white/20 pointer-events-none" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Indicador de dirección */}
          <div className="text-center mt-8 space-y-2">
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              ↑ Mejores Oportunidades
            </div>
            <div className="text-xs text-muted-foreground">
              Los países en la cima tienen el mayor potencial de éxito
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-2 border-chart-3/10 shadow-2xl bg-gradient-to-br from-background via-chart-3/5 to-background backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-chart-3 to-chart-1 shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Proyección de Crecimiento a 5 Años</h3>
            <p className="text-sm text-muted-foreground">Valor estimado de la inversión basado en ROI proyectado</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={500}>
          <AreaChart data={growthProjectionData} margin={{ top: 30, right: 40, left: 50, bottom: 30 }}>
            <defs>
              {results.map((result, index) => (
                <linearGradient key={result.country} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.9} />
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="5 5" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis
              dataKey="year"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 700 }}
              axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 2 }}
              stroke="hsl(var(--border))"
            />
            <YAxis
              tick={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 600 }}
              axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 2 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              stroke="hsl(var(--border))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "2px solid hsl(var(--border))",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}
              formatter={(value: any) => [`USD ${Number(value).toLocaleString()}`, ""]}
            />
            <Legend wrapperStyle={{ paddingTop: "30px", fontSize: 14, fontWeight: 600 }} iconType="rect" />
            {results.map((result, index) => (
              <Area
                key={result.country}
                type="monotone"
                dataKey={result.country}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                fill={`url(#gradient-${index})`}
                name={result.country}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-8 border-2 border-chart-4/10 shadow-2xl bg-gradient-to-br from-background via-chart-4/5 to-background backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-chart-4 to-chart-2 shadow-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Comparación de Métricas Clave</h3>
            <p className="text-sm text-muted-foreground">Score, probabilidad de éxito y ROI por país</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={metricsData} margin={{ top: 30, right: 40, left: 30, bottom: 30 }}>
            <CartesianGrid strokeDasharray="5 5" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis
              dataKey="country"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 700 }}
              axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 2 }}
              stroke="hsl(var(--border))"
            />
            <YAxis
              tick={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 600 }}
              axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 2 }}
              stroke="hsl(var(--border))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "2px solid hsl(var(--border))",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}
            />
            <Legend wrapperStyle={{ paddingTop: "30px", fontSize: 14, fontWeight: 600 }} iconType="rect" />
            <Bar dataKey="Score General" fill={colors[0]} radius={[10, 10, 0, 0]} />
            <Bar dataKey="Prob. Éxito" fill={colors[1]} radius={[10, 10, 0, 0]} />
            <Line
              type="monotone"
              dataKey="ROI (%)"
              stroke={colors[2]}
              strokeWidth={4}
              dot={{ fill: colors[2], r: 8, strokeWidth: 3, stroke: "#fff" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-8 border-2 shadow-2xl bg-gradient-to-br from-background to-muted/10">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Resumen Ejecutivo</h3>
          <p className="text-sm text-muted-foreground">Comparación detallada de todos los indicadores clave</p>
        </div>
        <div className="overflow-x-auto rounded-xl border-2 border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b-2 border-border">
                <th className="text-left py-5 px-6 font-bold text-base">País</th>
                <th className="text-center py-5 px-4 font-bold">Score</th>
                <th className="text-center py-5 px-4 font-bold">Mercado</th>
                <th className="text-center py-5 px-4 font-bold">Regulatorio</th>
                <th className="text-center py-5 px-4 font-bold">Financiero</th>
                <th className="text-center py-5 px-4 font-bold">Inversión</th>
                <th className="text-center py-5 px-4 font-bold">ROI %</th>
                <th className="text-center py-5 px-4 font-bold">Recuperación</th>
                <th className="text-center py-5 px-4 font-bold">Éxito %</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={result.country}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors duration-200"
                  style={{
                    backgroundColor: index === 0 ? "hsl(var(--primary) / 0.08)" : undefined,
                  }}
                >
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-lg"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      >
                        {index + 1}
                      </span>
                      <span className="font-bold text-base">{result.country}</span>
                    </div>
                  </td>
                  <td className="text-center py-5 px-4">
                    <span className="font-black text-xl text-primary">{result.overallScore.toFixed(1)}</span>
                  </td>
                  <td className="text-center py-5 px-4 font-semibold text-base">{result.marketScore.toFixed(1)}</td>
                  <td className="text-center py-5 px-4 font-semibold text-base">{result.regulatoryScore.toFixed(1)}</td>
                  <td className="text-center py-5 px-4 font-semibold text-base">{result.financialScore.toFixed(1)}</td>
                  <td className="text-center py-5 px-4 font-bold text-base text-chart-3">
                    ${(result.initialInvestment / 1000).toFixed(0)}K
                  </td>
                  <td className="text-center py-5 px-4">
                    <span className="font-black text-lg text-accent">{result.roi.toFixed(1)}%</span>
                  </td>
                  <td className="text-center py-5 px-4 font-semibold text-base">
                    {result.paybackPeriod > 100 ? (
                      <span className="text-muted-foreground">N/A</span>
                    ) : (
                      <span>{result.paybackPeriod}m</span>
                    )}
                  </td>
                  <td className="text-center py-5 px-4">
                    <span className="font-black text-lg">{result.successProbability}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
