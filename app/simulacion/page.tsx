"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import { ChatMessage } from "@/components/chat-message"
import { SimulationResults } from "@/components/simulation-results"
import { WelcomeScreen } from "@/components/welcome-screen"
import { BusinessTypeSelector } from "@/components/business-type-selector"
import { PrioritiesSelector } from "@/components/priorities-selector"
import { CompanySizeSelector } from "@/components/company-size-selector"
import { ExpansionModelSelector } from "@/components/expansion-model-selector"
import { TargetCountriesSelector } from "@/components/target-countries-selector"
import { FinalConfirmation } from "@/components/final-confirmation"
import type { Message, BusinessData, SimulationResult } from "@/types/simulation"
import { SimulationEngine } from "@/lib/simulation-engine"

const VALIDATION_PHRASES = [
  "Entendemos perfectamente tu preocupación, es completamente válida y muchos empresarios comparten ese mismo temor. En BELYON, hemos desarrollado estrategias específicas que ayudan a abordar este tipo de desafíos de manera efectiva, minimizando riesgos y maximizando oportunidades. ¿Hay algún otro miedo que quieras compartirnos?",
  "Tu temor es muy comprensible y refleja una preocupación legítima que enfrentan muchas empresas al expandirse. En BELYON, trabajamos constantemente en crear soluciones innovadoras que permiten superar estos obstáculos de forma estructurada y segura, adaptándonos a las necesidades específicas de cada negocio. ¿Hay algún otro miedo que quieras compartirnos?",
  "Apreciamos mucho que compartas esta inquietud con nosotros. Es un temor muy real y justificado en el contexto de expansión internacional. En BELYON, nos especializamos en diseñar estrategias personalizadas que transforman estos desafíos en oportunidades, brindando el soporte necesario en cada etapa del proceso. ¿Hay algún otro miedo que quieras compartirnos?",
  "Gracias por compartir esto con nosotros. Es una preocupación totalmente válida y que requiere atención especial. En BELYON, contamos con metodologías probadas que ayudan a mitigar estos riesgos de manera proactiva, asegurando que cada paso de tu expansión esté respaldado por análisis profundos y estrategias sólidas. ¿Hay algún otro miedo que quieras compartirnos?",
  "Valoramos tu transparencia al expresar este temor. Es una inquietud que muchos emprendedores experimentan y que merece ser abordada con seriedad. En BELYON, hemos desarrollado herramientas y enfoques estratégicos que facilitan la navegación de estos desafíos complejos, proporcionando claridad y confianza en el proceso de expansión. ¿Hay algún otro miedo que quieras compartirnos?",
  "Tu preocupación es absolutamente comprensible y demuestra una visión realista del proceso de expansión. En BELYON, entendemos la importancia de abordar estos temores con soluciones concretas y efectivas, por eso desarrollamos estrategias integrales que te acompañan en cada desafío, convirtiendo la incertidumbre en oportunidades de crecimiento. ¿Hay algún otro miedo que quieras compartirnos?",
  "Reconocemos la validez de tu inquietud, es un aspecto crucial que no debe tomarse a la ligera. En BELYON, nos dedicamos a crear planes de acción específicos que abordan precisamente este tipo de desafíos, combinando experiencia, análisis de datos y estrategias personalizadas para garantizar una expansión exitosa y sostenible. ¿Hay algún otro miedo que quieras compartirnos?",
]

export default function SimulacionPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [businessData, setBusinessData] = useState<Partial<BusinessData>>({})
  const [currentStep, setCurrentStep] = useState<"intake" | "simulation" | "results">("intake")
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])
  const [showWelcome, setShowWelcome] = useState(true)
  const [showBusinessType, setShowBusinessType] = useState(false)
  const [showPriorities, setShowPriorities] = useState(false)
  const [showCompanySize, setShowCompanySize] = useState(false)
  const [showExpansionModel, setShowExpansionModel] = useState(false)
  const [showTargetCountries, setShowTargetCountries] = useState(false)
  const [companyName, setCompanyName] = useState<string>("")
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("")
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedCompanySize, setSelectedCompanySize] = useState<string>("")
  const [selectedExpansionModel, setSelectedExpansionModel] = useState<string>("")
  const [selectedTargetCountries, setSelectedTargetCountries] = useState<string[]>([])
  const [isCollectingFears, setIsCollectingFears] = useState(false)
  const [collectedFears, setCollectedFears] = useState<string[]>([])
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const isNegativeResponse = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim()
    const negativePatterns = [
      "no",
      "no gracias",
      "no, gracias",
      "por ahora no",
      "ahora no",
      "no tengo",
      "no tengo más",
      "no hay más",
      "eso es todo",
      "nada más",
      "ninguno más",
      "ya no",
      "suficiente",
    ]
    return negativePatterns.some((pattern) => lowerText === pattern || lowerText.includes(pattern))
  }

  const getRandomValidationPhrase = (): string => {
    const randomIndex = Math.floor(Math.random() * VALIDATION_PHRASES.length)
    return VALIDATION_PHRASES[randomIndex]
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      if (isCollectingFears) {
        // Verificar si el usuario quiere dejar de compartir temores
        if (isNegativeResponse(userInput)) {
          // Usuario no quiere compartir más temores
          const finalMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Perfecto, agradecemos mucho tu sinceridad al compartir tus inquietudes con nosotros.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, finalMessage])
          setIsCollectingFears(false)
          setIsLoading(false)

          // Mostrar el bloque de confirmación final después de un breve delay
          setTimeout(() => {
            setShowFinalConfirmation(true)
          }, 1500)
        } else {
          // Usuario compartió un nuevo temor
          setCollectedFears((prev) => [...prev, userInput])

          // Responder con una frase de validación aleatoria
          const validationPhrase = getRandomValidationPhrase()
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: validationPhrase,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)
        }
      } else {
        // No debería llegar aquí en el flujo normal
        setIsLoading(false)
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleStartSimulation = async (data: Partial<BusinessData>) => {
    setCurrentStep("simulation")

    try {
      const engine = new SimulationEngine(data as BusinessData)
      const results = await engine.runSimulation()
      setSimulationResults(results)
      setCurrentStep("results")
    } catch (error) {
      console.error("[v0] Error en simulación:", error)
      setCurrentStep("intake")
    }
  }

  const handleWelcomeComplete = (name: string) => {
    setCompanyName(name)
    setShowWelcome(false)
    setShowBusinessType(true)
  }

  const handleBusinessTypeComplete = (businessType: string) => {
    setSelectedBusinessType(businessType)
    setShowBusinessType(false)
    setShowPriorities(true)
  }

  const handlePrioritiesComplete = (priorities: string[]) => {
    setSelectedPriorities(priorities)
    setShowPriorities(false)
    setShowCompanySize(true)
  }

  const handleCompanySizeComplete = (size: string) => {
    setSelectedCompanySize(size)
    setShowCompanySize(false)
    setShowExpansionModel(true)
  }

  const handleExpansionModelComplete = (model: string) => {
    setSelectedExpansionModel(model)
    setShowExpansionModel(false)
    setShowTargetCountries(true)
  }

  const handleTargetCountriesComplete = (countries: string[]) => {
    setSelectedTargetCountries(countries)
    setShowTargetCountries(false)

    // Formatear el tipo de negocio
    const businessTypeText = selectedBusinessType.startsWith("other:")
      ? selectedBusinessType.replace("other:", "")
      : selectedBusinessType

    // Formatear las prioridades
    const prioritiesText = selectedPriorities
      .map((p) => {
        if (p.startsWith("other:")) {
          return p.replace("other:", "")
        }
        const priority = p.replace(/-/g, " ")
        return priority
      })
      .join(", ")

    // Formatear el tamaño de empresa
    const sizeLabels: Record<string, string> = {
      micro: "microempresa (1-9 empleados)",
      small: "pequeña empresa (10-50 empleados)",
      medium: "mediana empresa (51-200 empleados)",
      large: "gran empresa (más de 200 empleados)",
    }
    const sizeText = sizeLabels[selectedCompanySize] || selectedCompanySize

    // Formatear el modelo de expansión
    const modelLabels: Record<string, string> = {
      "single-location": "abrir un solo local",
      "multiple-locations": "abrir 3 o más sucursales",
      "pilot-franchise": "abrir un local piloto para luego franquiciar",
      "digital-delivery": "lanzar operación digital y/o delivery",
    }
    const modelText = modelLabels[selectedExpansionModel] || selectedExpansionModel

    const countryLabels: Record<string, string> = {
      uruguay: "Uruguay",
      chile: "Chile",
      paraguay: "Paraguay",
      brasil: "Brasil",
      bolivia: "Bolivia",
    }
    const countriesText = countries.map((c) => countryLabels[c] || c).join(", ")

    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `¡Hola ${companyName}! Soy tu asistente de expansión internacional. 

He registrado la siguiente información sobre tu negocio:
• Tipo de negocio: ${businessTypeText}
• Tamaño de empresa: ${sizeText}
• Modelo de expansión: ${modelText}
• Prioridades: ${prioritiesText}
• Países de interés: ${countriesText}

Sabemos que hay muchas barreras y procesos complicados al momento de pensar en expandirse internacionalmente (como la parte legal, burocrática, impositiva, etc). Es por esto que nos parece sumamente importante que nos pueda contar cuáles son sus mayores temores al momento de pensar en ejecutar esta expansión.`,
        timestamp: new Date(),
      },
    ])

    // Activar el modo de recolección de temores
    setIsCollectingFears(true)

    // Guardar los datos en businessData
    setBusinessData({
      companyName,
      businessType: businessTypeText,
      priorities: selectedPriorities,
      companySize: selectedCompanySize,
      expansionModel: selectedExpansionModel,
      targetCountries: countries, // Array de códigos de países
    })
  }

  const handleFinalConfirmation = () => {
    setShowFinalConfirmation(false)

    const businessTypeText = mapBusinessTypeToText(selectedBusinessType)
    const companySizeText = mapCompanySizeToText(selectedCompanySize)
    const expansionModelText = mapExpansionModelToText(selectedExpansionModel)

    console.log("[v0] Datos enviados al motor de simulación:")
    console.log("  - businessType:", businessTypeText)
    console.log("  - companySize:", companySizeText)
    console.log("  - expansionModel:", expansionModelText)
    console.log("  - targetCountries:", selectedTargetCountries)
    console.log("  - priorities:", selectedPriorities)

    handleStartSimulation({
      companyName,
      businessType: businessTypeText,
      priorities: selectedPriorities,
      companySize: companySizeText,
      expansionModel: expansionModelText,
      targetCountries: selectedTargetCountries,
      fears: collectedFears,
    })
  }

  const mapBusinessTypeToText = (code: string): string => {
    const mapping: Record<string, string> = {
      pizzeria: "Pizzería",
      sangucheria: "Sanguchería",
      rotiseria: "Rotisería",
      cafeteria: "Cafetería",
      parrilla: "Parrilla",
      hamburgueseria: "Hamburguesería",
      heladeria: "Heladería",
      viandas: "Viandas",
    }

    // Si empieza con "other:", devolver el texto personalizado
    if (code.startsWith("other:")) {
      return code.replace("other:", "")
    }

    return mapping[code.toLowerCase()] || "Otros"
  }

  const mapCompanySizeToText = (code: string): string => {
    const mapping: Record<string, string> = {
      micro: "De 1 a 9 empleados",
      small: "De 10 a 50 empleados",
      medium: "De 51 a 200 empleados",
      large: "Más de 200 empleados",
    }
    return mapping[code] || "De 10 a 50 empleados"
  }

  const mapExpansionModelToText = (code: string): string => {
    const mapping: Record<string, string> = {
      "single-location": "Abrir un solo local",
      "multiple-locations": "Abrir 3 o más sucursales",
      "pilot-franchise": "Abrir un local piloto para luego franquiciar",
      "digital-delivery": "Lanzar operación digital y/o delivery",
    }
    return mapping[code] || "Abrir un solo local"
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  if (showBusinessType) {
    return <BusinessTypeSelector onComplete={handleBusinessTypeComplete} />
  }

  if (showPriorities) {
    return <PrioritiesSelector onComplete={handlePrioritiesComplete} />
  }

  if (showCompanySize) {
    return <CompanySizeSelector onComplete={handleCompanySizeComplete} />
  }

  if (showExpansionModel) {
    return <ExpansionModelSelector onComplete={handleExpansionModelComplete} />
  }

  if (showTargetCountries) {
    return <TargetCountriesSelector onComplete={handleTargetCountriesComplete} />
  }

  if (showFinalConfirmation) {
    return <FinalConfirmation companyName={companyName} onConfirm={handleFinalConfirmation} />
  }

  if (currentStep === "simulation") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
        <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Generando tu simulación...</h2>
            <p className="text-muted-foreground">
              Estamos analizando los mercados y generando proyecciones personalizadas
            </p>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
        <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <SimulationResults results={simulationResults} businessData={businessData as BusinessData} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Cuéntanos sobre tus inquietudes</h1>
          <p className="text-muted-foreground">
            Queremos conocer tus temores para ayudarte de la mejor manera en tu expansión
          </p>
        </div>

        <Card className="flex flex-col h-[600px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-4 inline-block">
                    <p className="text-sm text-muted-foreground">Escribiendo...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border/40 p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe tu respuesta aquí..."
                className="flex-1 resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px] max-h-[120px]"
                rows={2}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
