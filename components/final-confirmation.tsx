"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, Sparkles } from "lucide-react"
import Image from "next/image"

interface FinalConfirmationProps {
  companyName: string
  onConfirm: () => void
}

export function FinalConfirmation({ companyName, onConfirm }: FinalConfirmationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500/10 via-background to-purple-500/10 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 md:p-12 shadow-2xl border-2 border-violet-500/20">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/belyon-logo-full.png"
            alt="BELYON"
            width={280}
            height={80}
            className="h-20 w-auto transition-transform hover:scale-105"
            priority
          />
        </div>

        {/* Iconos decorativos */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="p-3 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg animate-pulse delay-75">
            <Rocket className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="text-center mb-8">
          {/* Pregunta final */}
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Dicho esto, ¿{companyName} está list@ para conocer cómo se ve ese futuro tan prometedor del que venimos
            hablando?
          </h2>
        </div>

        {/* Botón de confirmación */}
        <div className="flex justify-center mb-6">
          <Button
            size="lg"
            onClick={onConfirm}
            className="px-16 py-8 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105"
          >
            <Rocket className="w-6 h-6 mr-3" />
            ¡Sí! Vamos a la simulación
          </Button>
        </div>

        {/* Decoración inferior */}
        <div className="mt-8 pt-8 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            Estamos a punto de mostrarte un análisis detallado y personalizado de las mejores oportunidades de expansión
            para tu negocio
          </p>
        </div>

        {/* Efectos visuales de fondo */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-150" />
        </div>
      </Card>
    </div>
  )
}
