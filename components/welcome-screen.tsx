"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"
import Image from "next/image"

interface WelcomeScreenProps {
  onComplete: (companyName: string) => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [companyName, setCompanyName] = useState("")

  const handleContinue = () => {
    if (companyName.trim()) {
      onComplete(companyName.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && companyName.trim()) {
      handleContinue()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/10 via-background to-cyan-500/10 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 shadow-2xl border-2 border-blue-500/20">
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

        {/* Icono decorativo */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Título y descripción */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent leading-tight">
            Bienvenid@ a esta nueva experiencia
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Esperamos poder acompañarte en este proceso de la mejor manera. Para comenzar contanos cuál es el nombre de
            tu pyme
          </p>
        </div>

        {/* Input del nombre */}
        <div className="mb-8">
          <div className="relative">
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nombre de tu pyme..."
              className="text-center text-xl py-6 px-6 border-2 border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 rounded-xl"
              autoFocus
            />
            {companyName && (
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-xl rounded-xl" />
            )}
          </div>
        </div>

        {/* Botón continuar */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!companyName.trim()}
            className="px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comenzar
          </Button>
        </div>

        {/* Decoración inferior */}
        <div className="mt-8 pt-8 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            Tu información está segura y será utilizada únicamente para personalizar tu experiencia
          </p>
        </div>
      </Card>
    </div>
  )
}
