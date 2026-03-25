import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BarChart3, Globe2, TrendingUp, Shield, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/belyon-logo-full.png"
              alt="BELYON"
              width={1050}
              height={300}
              className="h-20 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#caracteristicas"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Características
            </Link>
            <Link
              href="#como-funciona"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cómo Funciona
            </Link>
            <Link href="#paises" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Países
            </Link>
            <Button size="sm" asChild>
              <Link href="/simulacion">Comenzar Simulación</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Zap className="w-4 h-4" />
            <span>Impulsado por Inteligencia Artificial</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Expande tu negocio gastronómico a{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Latinoamérica
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Simula escenarios de expansión internacional con análisis de mercado, regulaciones y proyecciones
            financieras personalizadas para tu PYME.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/simulacion">
                Iniciar Simulación Gratuita
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Resultados en minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>La mejor opción del mercado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Todo lo que necesitas para decidir</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Análisis integral con datos reales y simulaciones personalizadas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Análisis de Mercado</h3>
            <p className="text-muted-foreground leading-relaxed">
              Evaluación detallada de demanda, competencia y oportunidades en cada país objetivo.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Regulaciones y Legal</h3>
            <p className="text-muted-foreground leading-relaxed">
              Información actualizada sobre requisitos legales, fiscales y operativos por país.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Proyecciones Financieras</h3>
            <p className="text-muted-foreground leading-relaxed">
              Cálculo de ROI, período de recuperación y probabilidad de éxito basado en tu negocio.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Globe2 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Comparación entre Países</h3>
            <p className="text-muted-foreground leading-relaxed">
              Visualiza y compara múltiples destinos simultáneamente con gráficos interactivos.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">IA Conversacional</h3>
            <p className="text-muted-foreground leading-relaxed">
              Conversa naturalmente sobre tu negocio y recibe análisis personalizados.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Reportes Detallados</h3>
            <p className="text-muted-foreground leading-relaxed">
              Informes completos con gráficos, tablas y recomendaciones estratégicas.
            </p>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Cómo funciona</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tres pasos simples para obtener tu análisis de expansión
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="text-xl font-semibold">Cuéntanos sobre tu negocio</h3>
            <p className="text-muted-foreground leading-relaxed">
              Conversa con nuestra IA sobre tu restaurante, café o negocio gastronómico
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="text-xl font-semibold">Análisis automático</h3>
            <p className="text-muted-foreground leading-relaxed">
              Nuestro motor simula escenarios con datos reales de mercado y regulaciones
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="text-xl font-semibold">Recibe tu reporte</h3>
            <p className="text-muted-foreground leading-relaxed">
              Obtén análisis comparativo, proyecciones y recomendaciones personalizadas
            </p>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section id="paises" className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Países disponibles</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analiza oportunidades en los principales mercados de Latinoamérica
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Uruguay", code: "uy" },
            { name: "Chile", code: "cl" },
            { name: "Paraguay", code: "py" },
            { name: "Brasil", code: "br" },
            { name: "Bolivia", code: "bo" },
          ].map((country) => (
            <Card
              key={country.name}
              className="p-6 text-center border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
            >
              <div className="mb-3 flex items-center justify-center">
                <div className="relative w-24 h-16 rounded-md overflow-hidden shadow-md ring-2 ring-border/50 group-hover:ring-primary/50 group-hover:scale-110 transition-all duration-300">
                  <Image
                    src={`https://flagcdn.com/w160/${country.code}.png`}
                    alt={`Bandera de ${country.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="font-semibold text-foreground">{country.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center space-y-6 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold">¿Listo para expandir tu negocio?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comienza tu simulación gratuita ahora y descubre las mejores oportunidades para tu PYME
          </p>
          <Button size="lg" className="text-base px-8" asChild>
            <Link href="/simulacion">
              Iniciar Simulación
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/belyon-logo-icon.png" alt="BELYON" width={80} height={80} className="h-16 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2025 BELYON. Expansión internacional para PYMEs gastronómicas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
