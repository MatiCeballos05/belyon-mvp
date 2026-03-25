import jsPDF from "jspdf"
import type { SimulationResult, BusinessData } from "@/types/simulation"

export function generateSimulationPDF(results: SimulationResult[], businessData: BusinessData) {
  const doc = new jsPDF()
  let yPosition = 20

  // Configuración de colores
  const primaryColor: [number, number, number] = [99, 102, 241] // Indigo
  const accentColor: [number, number, number] = [236, 72, 153] // Pink
  const textColor: [number, number, number] = [31, 41, 55] // Gray-800

  // Función auxiliar para agregar nueva página si es necesario
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > 280) {
      doc.addPage()
      yPosition = 20
      return true
    }
    return false
  }

  // Función auxiliar para agregar texto con wrap
  const addWrappedText = (text: string, x: number, maxWidth: number, fontSize = 10) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, yPosition)
    yPosition += lines.length * (fontSize * 0.5)
  }

  // PORTADA
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 80, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(32)
  doc.setFont("helvetica", "bold")
  doc.text("BELYON", 105, 35, { align: "center" })

  doc.setFontSize(20)
  doc.text("Reporte de Simulación", 105, 50, { align: "center" })

  doc.setFontSize(14)
  doc.text("Expansión Internacional", 105, 65, { align: "center" })

  yPosition = 100

  // INFORMACIÓN DEL NEGOCIO
  doc.setTextColor(...textColor)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("Información del Negocio", 20, yPosition)
  yPosition += 10

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Empresa: ${businessData.companyName}`, 20, yPosition)
  yPosition += 7
  doc.text(`Tipo de negocio: ${businessData.businessType}`, 20, yPosition)
  yPosition += 7
  doc.text(`Tamaño: ${businessData.companySize}`, 20, yPosition)
  yPosition += 7
  doc.text(`Modelo de expansión: ${businessData.expansionModel}`, 20, yPosition)
  yPosition += 7
  doc.text(`Países de interés: ${businessData.targetCountries.join(", ")}`, 20, yPosition)
  yPosition += 15

  // RESUMEN EJECUTIVO
  checkPageBreak(40)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("Resumen Ejecutivo", 20, yPosition)
  yPosition += 10

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  const bestCountry = results[0]
  addWrappedText(
    `Basado en el análisis de ${results.length} países, ${bestCountry.country} presenta la mejor oportunidad de expansión con un score general de ${bestCountry.overallScore.toFixed(1)}/100 y un ROI proyectado de ${bestCountry.roi.toFixed(2)}%.`,
    20,
    170,
  )
  yPosition += 10

  // RESULTADOS POR PAÍS
  results.forEach((result, index) => {
    checkPageBreak(80)

    // Encabezado del país
    doc.setFillColor(...primaryColor)
    doc.rect(15, yPosition - 5, 180, 12, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(`${index + 1}. ${result.country}`, 20, yPosition + 3)
    yPosition += 15

    doc.setTextColor(...textColor)
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")

    // Métricas principales
    doc.setFont("helvetica", "bold")
    doc.text("Métricas Financieras:", 20, yPosition)
    yPosition += 7

    doc.setFont("helvetica", "normal")
    doc.text(`• Inversión inicial: USD ${result.initialInvestment.toLocaleString()}`, 25, yPosition)
    yPosition += 6
    doc.text(`• ROI proyectado: ${result.roi.toFixed(2)}% anual`, 25, yPosition)
    yPosition += 6
    doc.text(`• Período de recuperación: ${result.paybackPeriod} meses`, 25, yPosition)
    yPosition += 6
    doc.text(`• Probabilidad de éxito: ${result.successProbability.toFixed(1)}%`, 25, yPosition)
    yPosition += 10

    // Scores
    doc.setFont("helvetica", "bold")
    doc.text("Evaluación por Categorías:", 20, yPosition)
    yPosition += 7

    doc.setFont("helvetica", "normal")
    doc.text(`• Score general: ${result.overallScore.toFixed(1)}/100`, 25, yPosition)
    yPosition += 6
    doc.text(`• Score de mercado: ${result.marketScore.toFixed(1)}/100`, 25, yPosition)
    yPosition += 6
    doc.text(`• Score regulatorio: ${result.regulatoryScore.toFixed(1)}/100`, 25, yPosition)
    yPosition += 6
    doc.text(`• Score financiero: ${result.financialScore.toFixed(1)}/100`, 25, yPosition)
    yPosition += 10

    // Insights
    if (result.insights && result.insights.length > 0) {
      checkPageBreak(30)
      doc.setFont("helvetica", "bold")
      doc.text("Insights clave:", 20, yPosition)
      yPosition += 7

      doc.setFont("helvetica", "normal")
      result.insights.slice(0, 3).forEach((insight) => {
        checkPageBreak(15)
        addWrappedText(`• ${insight}`, 25, 165, 10)
        yPosition += 3
      })
      yPosition += 5
    }

    // Riesgos
    if (result.risks && result.risks.length > 0) {
      checkPageBreak(30)
      doc.setFont("helvetica", "bold")
      doc.text("Riesgos principales:", 20, yPosition)
      yPosition += 7

      doc.setFont("helvetica", "normal")
      result.risks.slice(0, 3).forEach((risk) => {
        checkPageBreak(15)
        addWrappedText(`• ${risk}`, 25, 165, 10)
        yPosition += 3
      })
      yPosition += 5
    }

    // Oportunidades
    if (result.opportunities && result.opportunities.length > 0) {
      checkPageBreak(30)
      doc.setFont("helvetica", "bold")
      doc.text("Oportunidades:", 20, yPosition)
      yPosition += 7

      doc.setFont("helvetica", "normal")
      result.opportunities.slice(0, 3).forEach((opportunity) => {
        checkPageBreak(15)
        addWrappedText(`• ${opportunity}`, 25, 165, 10)
        yPosition += 3
      })
      yPosition += 5
    }

    yPosition += 10
  })

  // PIE DE PÁGINA EN TODAS LAS PÁGINAS
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(128, 128, 128)
    doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" })
    doc.text("Generado por BELYON - Simulador de Expansión Internacional", 105, 285, { align: "center" })
  }

  // Descargar el PDF
  const fileName = `BELYON_Simulacion_${businessData.companyName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
  doc.save(fileName)
}
