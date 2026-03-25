import type { BusinessData, SimulationResult, CountryData, InvestmentBreakdown } from "@/types/simulation"
import { WorldBankAPI, type WorldBankCountryData } from "./world-bank-api"

const BUSINESS_TYPE_DATA: Record<
  string,
  {
    equipmentMultiplier: number // Multiplicador de costos de equipamiento
    inventoryMultiplier: number // Multiplicador de inventario inicial
    profitMarginAdjustment: number // Ajuste al margen de ganancia
    laborIntensity: number // Intensidad laboral (más empleados = mayor)
    setupComplexity: number // Complejidad de setup (permisos especiales, etc.)
  }
> = {
  Pizzería: {
    equipmentMultiplier: 1.6, // Aumentado de 1.3 a 1.6
    inventoryMultiplier: 1.3, // Aumentado de 1.1 a 1.3
    profitMarginAdjustment: 0.015, // Aumentado de 0.01 a 0.015
    laborIntensity: 1.4, // Aumentado de 1.2 a 1.4
    setupComplexity: 1.3, // Aumentado de 1.1 a 1.3
  },
  Sanguchería: {
    equipmentMultiplier: 0.6, // Reducido de 0.8 a 0.6
    inventoryMultiplier: 0.7, // Reducido de 0.9 a 0.7
    profitMarginAdjustment: 0.025, // Aumentado de 0.015 a 0.025
    laborIntensity: 0.7, // Reducido de 0.9 a 0.7
    setupComplexity: 0.6, // Reducido de 0.8 a 0.6
  },
  Rotisería: {
    equipmentMultiplier: 1.4, // Aumentado de 1.2 a 1.4
    inventoryMultiplier: 1.6, // Aumentado de 1.3 a 1.6
    profitMarginAdjustment: 0.008, // Aumentado de 0.005 a 0.008
    laborIntensity: 1.3, // Aumentado de 1.1 a 1.3
    setupComplexity: 1.2, // Aumentado de 1.0 a 1.2
  },
  Cafetería: {
    equipmentMultiplier: 1.3, // Aumentado de 1.1 a 1.3
    inventoryMultiplier: 0.7, // Reducido de 0.8 a 0.7
    profitMarginAdjustment: 0.03, // Aumentado de 0.02 a 0.03
    laborIntensity: 0.7, // Reducido de 0.8 a 0.7
    setupComplexity: 0.8, // Reducido de 0.9 a 0.8
  },
  Parrilla: {
    equipmentMultiplier: 1.8, // Aumentado de 1.4 a 1.8
    inventoryMultiplier: 1.8, // Aumentado de 1.4 a 1.8
    profitMarginAdjustment: 0.005, // Aumentado de 0.0 a 0.005
    laborIntensity: 1.6, // Aumentado de 1.3 a 1.6
    setupComplexity: 1.5, // Aumentado de 1.2 a 1.5
  },
  Hamburguesería: {
    equipmentMultiplier: 1.0,
    inventoryMultiplier: 1.0,
    profitMarginAdjustment: 0.015, // Aumentado de 0.01 a 0.015
    laborIntensity: 1.0,
    setupComplexity: 0.9,
  },
  Heladería: {
    equipmentMultiplier: 2.0, // Aumentado de 1.5 a 2.0
    inventoryMultiplier: 1.5, // Aumentado de 1.2 a 1.5
    profitMarginAdjustment: 0.035, // Aumentado de 0.025 a 0.035
    laborIntensity: 0.6, // Reducido de 0.7 a 0.6
    setupComplexity: 1.4, // Aumentado de 1.1 a 1.4
  },
  Viandas: {
    equipmentMultiplier: 0.8, // Reducido de 0.9 a 0.8
    inventoryMultiplier: 1.2, // Aumentado de 1.1 a 1.2
    profitMarginAdjustment: 0.01, // Aumentado de 0.005 a 0.01
    laborIntensity: 1.2, // Aumentado de 1.1 a 1.2
    setupComplexity: 0.8, // Reducido de 0.9 a 0.8
  },
  Otros: {
    equipmentMultiplier: 1.0,
    inventoryMultiplier: 1.0,
    profitMarginAdjustment: 0.0,
    laborIntensity: 1.0,
    setupComplexity: 1.0,
  },
}

const EXPANSION_MODEL_DATA: Record<
  string,
  {
    locationsMultiplier: number // Multiplicador de ubicaciones
    setupCostMultiplier: number // Multiplicador de costos de setup
    equipmentMultiplier: number // Multiplicador de equipamiento
    marketingMultiplier: number // Multiplicador de marketing
    workingCapitalMonths: number // Meses de capital de trabajo
    additionalCosts: number // Costos adicionales específicos del modelo
    revenueMultiplier: number // Multiplicador de ingresos potenciales
  }
> = {
  "Abrir un solo local": {
    locationsMultiplier: 1,
    setupCostMultiplier: 1.0,
    equipmentMultiplier: 1.0,
    marketingMultiplier: 1.0,
    workingCapitalMonths: 3,
    additionalCosts: 0,
    revenueMultiplier: 1.0,
  },
  "Abrir 3 o más sucursales": {
    locationsMultiplier: 4.0, // Aumentado de 3.5 a 4.0
    setupCostMultiplier: 3.8, // Aumentado de 3.2 a 3.8
    equipmentMultiplier: 4.2, // Aumentado de 3.5 a 4.2
    marketingMultiplier: 3.0, // Aumentado de 2.5 a 3.0
    workingCapitalMonths: 5, // Aumentado de 4 a 5
    additionalCosts: 35000, // Aumentado de 15000 a 35000
    revenueMultiplier: 4.0, // Aumentado de 3.5 a 4.0
  },
  "Abrir un local piloto para luego franquiciar": {
    locationsMultiplier: 1,
    setupCostMultiplier: 1.8, // Aumentado de 1.3 a 1.8
    equipmentMultiplier: 1.5, // Aumentado de 1.2 a 1.5
    marketingMultiplier: 2.5, // Aumentado de 1.8 a 2.5
    workingCapitalMonths: 5, // Aumentado de 4 a 5
    additionalCosts: 45000, // Aumentado de 25000 a 45000 (legal, manuales, branding)
    revenueMultiplier: 1.0,
  },
  "Lanzar operación digital y/o delivery": {
    locationsMultiplier: 1,
    setupCostMultiplier: 0.5, // Reducido de 0.7 a 0.5
    equipmentMultiplier: 0.6, // Reducido de 0.8 a 0.6
    marketingMultiplier: 2.8, // Aumentado de 2.0 a 2.8
    workingCapitalMonths: 4, // Aumentado de 3 a 4
    additionalCosts: 25000, // Aumentado de 12000 a 25000 (plataforma, apps, tecnología)
    revenueMultiplier: 0.85, // Reducido de 0.9 a 0.85
  },
}

const COMPANY_SIZE_DATA: Record<
  string,
  {
    investmentCapacity: number // Capacidad de inversión (multiplicador)
    operationalEfficiency: number // Eficiencia operativa
    negotiationPower: number // Poder de negociación con proveedores
    riskTolerance: number // Tolerancia al riesgo
  }
> = {
  "De 1 a 9 empleados": {
    investmentCapacity: 0.7,
    operationalEfficiency: 0.9,
    negotiationPower: 0.8,
    riskTolerance: 0.8,
  },
  "De 10 a 50 empleados": {
    investmentCapacity: 1.0,
    operationalEfficiency: 1.0,
    negotiationPower: 1.0,
    riskTolerance: 1.0,
  },
  "De 51 a 200 empleados": {
    investmentCapacity: 1.4,
    operationalEfficiency: 1.1,
    negotiationPower: 1.2,
    riskTolerance: 1.2,
  },
  "Más de 200 empleados": {
    investmentCapacity: 2.0,
    operationalEfficiency: 1.2,
    negotiationPower: 1.4,
    riskTolerance: 1.4,
  },
}

const COUNTRY_SUPPLEMENTARY_DATA: Record<
  string,
  {
    laborCost: number
    rentCost: number
    regulatoryComplexity: number
    culturalSimilarity: number
    gastronomicMarket: number
    competition: number
  }
> = {
  Uruguay: {
    laborCost: 1200,
    rentCost: 2500,
    regulatoryComplexity: 30,
    culturalSimilarity: 90,
    gastronomicMarket: 75,
    competition: 60,
  },
  Chile: {
    laborCost: 1000,
    rentCost: 2800,
    regulatoryComplexity: 35,
    culturalSimilarity: 85,
    gastronomicMarket: 80,
    competition: 75,
  },
  Paraguay: {
    laborCost: 600,
    rentCost: 1200,
    regulatoryComplexity: 40,
    culturalSimilarity: 88,
    gastronomicMarket: 60,
    competition: 45,
  },
  Brasil: {
    laborCost: 800,
    rentCost: 2000,
    regulatoryComplexity: 75,
    culturalSimilarity: 70,
    gastronomicMarket: 90,
    competition: 85,
  },
  Bolivia: {
    laborCost: 500,
    rentCost: 800,
    regulatoryComplexity: 50,
    culturalSimilarity: 80,
    gastronomicMarket: 55,
    competition: 40,
  },
}

export class SimulationEngine {
  private businessData: BusinessData
  private targetCountries: string[]
  private worldBankAPI: WorldBankAPI
  private businessTypeData: (typeof BUSINESS_TYPE_DATA)[keyof typeof BUSINESS_TYPE_DATA]
  private expansionModelData: (typeof EXPANSION_MODEL_DATA)[keyof typeof EXPANSION_MODEL_DATA]
  private companySizeData: (typeof COMPANY_SIZE_DATA)[keyof typeof COMPANY_SIZE_DATA]

  constructor(businessData: BusinessData) {
    this.businessData = businessData
    this.targetCountries = this.parseTargetCountries(businessData.targetCountries)
    this.worldBankAPI = new WorldBankAPI()

    console.log("[v0] ===== DATOS RECIBIDOS EN EL MOTOR =====")
    console.log("[v0] businessType recibido:", businessData.businessType)
    console.log("[v0] expansionModel recibido:", businessData.expansionModel)
    console.log("[v0] companySize recibido:", businessData.companySize)
    console.log("[v0] targetCountries recibido:", businessData.targetCountries)
    console.log("[v0] priorities recibido:", businessData.priorities)

    this.businessTypeData = BUSINESS_TYPE_DATA[businessData.businessType] || BUSINESS_TYPE_DATA["Otros"]
    console.log("[v0] businessTypeData encontrado:", this.businessTypeData ? "SÍ" : "NO (usando default)")
    console.log("[v0] Multiplicador equipamiento:", this.businessTypeData.equipmentMultiplier)

    this.expansionModelData =
      EXPANSION_MODEL_DATA[businessData.expansionModel || "Abrir un solo local"] ||
      EXPANSION_MODEL_DATA["Abrir un solo local"]
    console.log("[v0] expansionModelData encontrado:", this.expansionModelData ? "SÍ" : "NO (usando default)")
    console.log("[v0] Multiplicador locaciones:", this.expansionModelData.locationsMultiplier)

    this.companySizeData =
      COMPANY_SIZE_DATA[businessData.companySize || "De 10 a 50 empleados"] || COMPANY_SIZE_DATA["De 10 a 50 empleados"]
    console.log("[v0] companySizeData encontrado:", this.companySizeData ? "SÍ" : "NO (usando default)")
    console.log("[v0] Capacidad de inversión:", this.companySizeData.investmentCapacity)

    console.log("[v0] ===== RESUMEN DE MULTIPLICADORES =====")
    console.log(`[v0] Tipo de negocio: ${businessData.businessType}`)
    console.log(`[v0]   - Equipamiento: ${this.businessTypeData.equipmentMultiplier}x`)
    console.log(`[v0]   - Inventario: ${this.businessTypeData.inventoryMultiplier}x`)
    console.log(`[v0]   - Intensidad laboral: ${this.businessTypeData.laborIntensity}x`)
    console.log(`[v0] Modelo de expansión: ${businessData.expansionModel}`)
    console.log(`[v0]   - Locaciones: ${this.expansionModelData.locationsMultiplier}x`)
    console.log(`[v0]   - Setup: ${this.expansionModelData.setupCostMultiplier}x`)
    console.log(`[v0]   - Costos adicionales: USD ${this.expansionModelData.additionalCosts}`)
    console.log(`[v0] Tamaño de empresa: ${businessData.companySize}`)
    console.log(`[v0]   - Capacidad inversión: ${this.companySizeData.investmentCapacity}x`)
    console.log(`[v0] Países seleccionados: ${this.targetCountries.join(", ")}`)
    console.log("[v0] ==========================================")
  }

  private parseTargetCountries(countriesData: string | string[]): string[] {
    const countryMapping: Record<string, string> = {
      uruguay: "Uruguay",
      chile: "Chile",
      paraguay: "Paraguay",
      brasil: "Brasil",
      bolivia: "Bolivia",
    }

    // Si es un array, mapear los códigos a nombres
    if (Array.isArray(countriesData)) {
      const mapped = countriesData.map((code) => countryMapping[code.toLowerCase()] || code)
      console.log("[v0] Países parseados desde array:", mapped)
      return mapped.length > 0 ? mapped : ["Uruguay", "Chile", "Paraguay", "Brasil", "Bolivia"]
    }

    // Si es un string, buscar países mencionados
    if (!countriesData || typeof countriesData !== "string") {
      return ["Uruguay", "Chile", "Paraguay", "Brasil", "Bolivia"]
    }

    const allCountries = ["Uruguay", "Chile", "Paraguay", "Brasil", "Bolivia"]
    const mentioned = allCountries.filter((country) => countriesData.toLowerCase().includes(country.toLowerCase()))
    return mentioned.length > 0 ? mentioned : allCountries
  }

  public async runSimulation(): Promise<SimulationResult[]> {
    console.log("[v0] Iniciando simulación con datos del World Bank...")

    const worldBankData = await this.worldBankAPI.getAllCountriesData(this.targetCountries)

    const results: SimulationResult[] = []

    for (const countryName of this.targetCountries) {
      const wbData = worldBankData.get(countryName)
      const suppData = COUNTRY_SUPPLEMENTARY_DATA[countryName]

      if (!suppData) {
        console.error(`[v0] No hay datos suplementarios para ${countryName}`)
        continue
      }

      const countryData: CountryData = {
        name: countryName,
        marketSize: wbData ? wbData.population / 1000000 : 0, // Población en millones
        gdpPerCapita: wbData ? Math.round(wbData.gdpPerCapita) : 0,
        easeOfBusiness: wbData ? Math.round(wbData.easeOfBusiness) : 50,
        taxRate: wbData ? Math.round(wbData.taxRate) : suppData.laborCost === 1200 ? 25 : 27,
        laborCost: suppData.laborCost,
        rentCost: suppData.rentCost,
        regulatoryComplexity: suppData.regulatoryComplexity,
        culturalSimilarity: suppData.culturalSimilarity,
        gastronomicMarket: suppData.gastronomicMarket,
        competition: suppData.competition,
        growthRate: wbData ? Number(wbData.gdpGrowth.toFixed(1)) : 3.0,
        urbanPopulation: wbData ? wbData.urbanPopulation : 70,
        tourismReceipts: wbData ? wbData.tourismReceipts : 0,
        internetUsers: wbData ? wbData.internetUsers : 60,
        politicalStability: wbData ? wbData.politicalStability : 50,
        regulatoryQuality: wbData ? wbData.regulatoryQuality : 50,
        tradeOpenness: wbData ? wbData.tradeOpenness : 0,
        inflation: wbData ? wbData.inflation : 0,
        fdiInflow: wbData ? wbData.fdiInflow : 0,
      }

      console.log(`[v0] Analizando ${countryName} con datos reales del World Bank`)
      const result = this.analyzeCountry(countryData, wbData)
      results.push(result)
    }

    // Ordenar por score general
    return results.sort((a, b) => b.overallScore - a.overallScore)
  }

  private analyzeCountry(country: CountryData, wbData: WorldBankCountryData | null): SimulationResult {
    const marketScore = this.calculateMarketScore(country)
    const regulatoryScore = this.calculateRegulatoryScore(country)
    const financialScore = this.calculateFinancialScore(country)

    const weights = this.calculateScoreWeights()
    const overallScore = Number.parseFloat(
      (
        marketScore * weights.market +
        regulatoryScore * weights.regulatory +
        financialScore * weights.financial
      ).toFixed(2),
    )

    const { initialInvestment, investmentBreakdown, roi, paybackPeriod } = this.calculateFinancialProjections(
      country,
      wbData,
    )
    const successProbability = this.calculateSuccessProbability(overallScore, country, roi)

    const insights = this.generateDetailedInsights(country, marketScore, regulatoryScore, financialScore)
    const risks = this.generateDetailedRisks(country)
    const opportunities = this.generateDetailedOpportunities(country)

    return {
      country: country.name,
      marketScore,
      regulatoryScore,
      financialScore,
      overallScore,
      initialInvestment,
      investmentBreakdown,
      roi,
      paybackPeriod,
      successProbability,
      insights,
      risks,
      opportunities,
    }
  }

  private calculateScoreWeights(): { market: number; regulatory: number; financial: number } {
    const priorities = this.businessData.priorities || []

    const priorityMap: Record<string, string> = {
      "large-market": "Gran mercado",
      "low-taxes": "Bajos impuestos",
      "low-labor-cost": "Menor costo laboral",
      "good-logistics": "Buena logística",
      "better-infrastructure": "Mejor infraestructura",
      "digital-connectivity": "Conectividad digital",
      "monetary-stability": "Estabilidad monetaria y cambiaria",
    }

    const mappedPriorities = priorities.map((p) => priorityMap[p] || p)
    console.log("[v0] Prioridades mapeadas para cálculo de pesos:", mappedPriorities)

    let marketWeight = 0.45
    let regulatoryWeight = 0.25
    let financialWeight = 0.3

    // Ajustar pesos según prioridades seleccionadas
    if (mappedPriorities.includes("Gran mercado")) {
      marketWeight += 0.1
      regulatoryWeight -= 0.05
      financialWeight -= 0.05
      console.log("[v0] Ajuste por 'Gran mercado': market +0.1")
    }

    if (mappedPriorities.includes("Bajos impuestos") || mappedPriorities.includes("Menor costo laboral")) {
      financialWeight += 0.1
      marketWeight -= 0.05
      regulatoryWeight -= 0.05
      console.log("[v0] Ajuste por 'Bajos impuestos/Menor costo laboral': financial +0.1")
    }

    if (mappedPriorities.includes("Buena logística") || mappedPriorities.includes("Mejor infraestructura")) {
      regulatoryWeight += 0.1
      marketWeight -= 0.05
      financialWeight -= 0.05
      console.log("[v0] Ajuste por 'Buena logística/Mejor infraestructura': regulatory +0.1")
    }

    // Normalizar para que sumen 1
    const total = marketWeight + regulatoryWeight + financialWeight
    const normalized = {
      market: marketWeight / total,
      regulatory: regulatoryWeight / total,
      financial: financialWeight / total,
    }

    console.log("[v0] Pesos finales normalizados:", normalized)
    return normalized
  }

  private calculateMarketScore(country: CountryData): number {
    const marketSizeScore = Math.min((country.marketSize / 50) * 100, 100)
    const gastronomicScore = country.gastronomicMarket
    const growthScore = Math.min(Math.max((country.growthRate / 6) * 100, 0), 100)
    const competitionScore = 100 - country.competition
    const urbanScore = country.urbanPopulation || 70
    const tourismScore = Math.min((country.tourismReceipts / 5000) * 100, 100)
    const digitalScore = country.internetUsers || 60

    const priorities = this.businessData.priorities || []

    const priorityMap: Record<string, string> = {
      "large-market": "Gran mercado",
      "digital-connectivity": "Conectividad digital",
    }
    const mappedPriorities = priorities.map((p) => priorityMap[p] || p)

    const weights = {
      marketSize: 0.25,
      gastronomic: 0.2,
      growth: 0.15,
      competition: 0.15,
      urban: 0.1,
      tourism: 0.1,
      digital: 0.05,
    }

    if (mappedPriorities.includes("Gran mercado")) {
      weights.marketSize = 0.35
      weights.gastronomic = 0.25
      weights.growth = 0.2
      weights.competition = 0.1
      weights.urban = 0.05
      weights.tourism = 0.03
      weights.digital = 0.02
    }

    if (mappedPriorities.includes("Conectividad digital")) {
      weights.digital = 0.2
      weights.marketSize = 0.2
      weights.gastronomic = 0.15
      weights.growth = 0.15
      weights.competition = 0.15
      weights.urban = 0.1
      weights.tourism = 0.05
    }

    const score =
      marketSizeScore * weights.marketSize +
      gastronomicScore * weights.gastronomic +
      growthScore * weights.growth +
      competitionScore * weights.competition +
      urbanScore * weights.urban +
      tourismScore * weights.tourism +
      digitalScore * weights.digital

    return Number.parseFloat(score.toFixed(2))
  }

  private calculateRegulatoryScore(country: CountryData): number {
    const businessEaseScore = country.easeOfBusiness
    const regulatoryScore = 100 - country.regulatoryComplexity
    const culturalScore = country.culturalSimilarity
    const politicalStabilityScore = country.politicalStability || 50
    const regulatoryQualityScore = country.regulatoryQuality || 50
    const tradeOpennessScore = Math.min((country.tradeOpenness / 100) * 100, 100)

    const priorities = this.businessData.priorities || []

    const priorityMap: Record<string, string> = {
      "good-logistics": "Buena logística",
      "better-infrastructure": "Mejor infraestructura",
      "monetary-stability": "Estabilidad monetaria y cambiaria",
    }
    const mappedPriorities = priorities.map((p) => priorityMap[p] || p)

    const weights = {
      businessEase: 0.25,
      regulatory: 0.2,
      cultural: 0.2,
      politicalStability: 0.15,
      regulatoryQuality: 0.15,
      tradeOpenness: 0.05,
    }

    if (mappedPriorities.includes("Buena logística")) {
      weights.tradeOpenness = 0.25
      weights.businessEase = 0.25
      weights.regulatory = 0.15
      weights.cultural = 0.15
      weights.politicalStability = 0.1
      weights.regulatoryQuality = 0.1
    }

    if (mappedPriorities.includes("Mejor infraestructura")) {
      weights.businessEase = 0.3
      weights.regulatoryQuality = 0.25
      weights.regulatory = 0.15
      weights.cultural = 0.15
      weights.politicalStability = 0.1
      weights.tradeOpenness = 0.05
    }

    if (mappedPriorities.includes("Estabilidad monetaria y cambiaria")) {
      weights.politicalStability = 0.3
      weights.regulatoryQuality = 0.25
      weights.businessEase = 0.2
      weights.regulatory = 0.15
      weights.cultural = 0.05
      weights.tradeOpenness = 0.05
    }

    const score =
      businessEaseScore * weights.businessEase +
      regulatoryScore * weights.regulatory +
      culturalScore * weights.cultural +
      politicalStabilityScore * weights.politicalStability +
      regulatoryQualityScore * weights.regulatoryQuality +
      tradeOpennessScore * weights.tradeOpenness

    return Number.parseFloat(score.toFixed(2))
  }

  private calculateFinancialScore(country: CountryData): number {
    const budget = this.extractBudget()
    const monthlyCosts = country.laborCost * 5 + country.rentCost + 3000

    const costEfficiencyScore = Math.min((budget / (monthlyCosts * 12)) * 50, 100)
    const purchasingPowerScore = Math.min((country.gdpPerCapita / 20000) * 100, 100)
    const taxScore = Math.max(100 - (country.taxRate / 50) * 100, 0)
    const inflationScore = Math.max(100 - (Math.abs(country.inflation) / 10) * 100, 0)
    const fdiScore = Math.min((country.fdiInflow / 5) * 100, 100)

    const priorities = this.businessData.priorities || []

    const priorityMap: Record<string, string> = {
      "low-taxes": "Bajos impuestos",
      "low-labor-cost": "Menor costo laboral",
    }
    const mappedPriorities = priorities.map((p) => priorityMap[p] || p)

    const weights = {
      costEfficiency: 0.3,
      purchasingPower: 0.25,
      tax: 0.2,
      inflation: 0.15,
      fdi: 0.1,
    }

    if (mappedPriorities.includes("Bajos impuestos")) {
      weights.tax = 0.4
      weights.costEfficiency = 0.25
      weights.purchasingPower = 0.15
      weights.inflation = 0.15
      weights.fdi = 0.05
    }

    if (mappedPriorities.includes("Menor costo laboral")) {
      weights.costEfficiency = 0.45
      weights.purchasingPower = 0.2
      weights.tax = 0.15
      weights.inflation = 0.15
      weights.fdi = 0.05
    }

    const score =
      costEfficiencyScore * weights.costEfficiency +
      purchasingPowerScore * weights.purchasingPower +
      taxScore * weights.tax +
      inflationScore * weights.inflation +
      fdiScore * weights.fdi

    return Number.parseFloat(score.toFixed(2))
  }

  private calculateInvestmentBreakdown(
    country: CountryData,
    wbData: WorldBankCountryData | null,
    employees: number,
    budget: number,
  ): InvestmentBreakdown {
    // Usar datos reales del World Bank para ajustar costos
    const inflationAdjustment = wbData ? 1 + Math.abs(wbData.inflation) / 100 : 1
    const regulatoryComplexityFromWB = wbData ? 100 - wbData.regulatoryQuality : country.regulatoryComplexity
    const easeOfBusinessFromWB = wbData ? wbData.easeOfBusiness : country.easeOfBusiness

    console.log(`[v0] Usando datos World Bank para ${country.name}:`)
    console.log(`[v0]   - Inflación: ${wbData?.inflation.toFixed(2)}% (ajuste: ${inflationAdjustment.toFixed(2)}x)`)
    console.log(`[v0]   - Calidad regulatoria: ${wbData?.regulatoryQuality.toFixed(0)}/100`)
    console.log(`[v0]   - Facilidad negocios: ${easeOfBusinessFromWB.toFixed(0)}/100`)

    // Setup costs basados en complejidad regulatoria REAL del World Bank
    const setupCosts = Math.round(
      (8000 + (regulatoryComplexityFromWB / 100) * 15000 + (100 - easeOfBusinessFromWB) * 120) *
        this.businessTypeData.setupComplexity *
        this.expansionModelData.setupCostMultiplier *
        inflationAdjustment, // Ajustar por inflación
    )

    // Equipment costs ajustados por GDP per cápita REAL y inflación
    const gdpPerCapitaMultiplier = wbData ? Math.max(wbData.gdpPerCapita / 10000, 0.5) : 1
    const equipment = Math.round(
      employees *
        3500 *
        gdpPerCapitaMultiplier *
        1.2 *
        this.businessTypeData.equipmentMultiplier *
        this.expansionModelData.equipmentMultiplier *
        this.companySizeData.negotiationPower *
        inflationAdjustment,
    )

    console.log(`[v0]   - GDP per cápita multiplier: ${gdpPerCapitaMultiplier.toFixed(2)}x`)
    console.log(`[v0]   - Equipment ajustado: USD ${equipment.toLocaleString()}`)

    // Initial inventory ajustado por GDP per cápita y apertura comercial
    const tradeOpennessMultiplier = wbData ? Math.max(wbData.tradeOpenness / 100, 0.7) : 1
    const initialInventory = Math.round(
      8000 *
        gdpPerCapitaMultiplier *
        0.75 *
        this.businessTypeData.inventoryMultiplier *
        this.expansionModelData.locationsMultiplier *
        tradeOpennessMultiplier * // Más apertura = mejor acceso a insumos
        inflationAdjustment,
    )

    console.log(`[v0]   - Trade openness multiplier: ${tradeOpennessMultiplier.toFixed(2)}x`)

    // Marketing ajustado por competencia y penetración digital
    const digitalPenetration = wbData ? wbData.internetUsers / 100 : 0.6
    const marketing = Math.round(
      (5000 + (country.competition / 100) * 3000) *
        this.expansionModelData.marketingMultiplier *
        (1 + digitalPenetration * 0.3), // Más usuarios de internet = más inversión en marketing digital
    )

    console.log(`[v0]   - Digital penetration: ${(digitalPenetration * 100).toFixed(0)}%`)

    // Working capital basado en costos mensuales REALES
    const monthlyCosts = this.calculateMonthlyCosts(country, wbData, employees)
    const workingCapital = Math.round(monthlyCosts * this.expansionModelData.workingCapitalMonths * inflationAdjustment)

    const subtotal =
      setupCosts + equipment + initialInventory + marketing + workingCapital + this.expansionModelData.additionalCosts
    const contingency = Math.round(subtotal * 0.1)

    console.log(`[v0] Desglose final con datos World Bank:`)
    console.log(`[v0]   - Setup: USD ${setupCosts.toLocaleString()}`)
    console.log(`[v0]   - Equipment: USD ${equipment.toLocaleString()}`)
    console.log(`[v0]   - Inventory: USD ${initialInventory.toLocaleString()}`)
    console.log(`[v0]   - Marketing: USD ${marketing.toLocaleString()}`)
    console.log(`[v0]   - Working capital: USD ${workingCapital.toLocaleString()}`)

    return {
      setupCosts,
      equipment,
      initialInventory,
      marketing,
      workingCapital: workingCapital + this.expansionModelData.additionalCosts,
      contingency,
    }
  }

  private calculateMonthlyCosts(country: CountryData, wbData: WorldBankCountryData | null, employees: number): number {
    // Ajustar costos laborales por desempleo (más desempleo = menores salarios)
    const unemploymentRate = wbData ? Math.max(wbData.inflation, 5) : 8 // Usar inflación como proxy si no hay dato de desempleo
    const laborCostAdjustment = 1 + (unemploymentRate - 8) / 100
    const laborCost = country.laborCost * employees * this.businessTypeData.laborIntensity * laborCostAdjustment

    // Ajustar alquiler por urbanización (más urbanización = más caro)
    const urbanizationMultiplier = wbData ? Math.max(wbData.urbanPopulation / 70, 0.8) : 1
    const rentCost =
      this.businessData.expansionModel === "Lanzar operación digital y/o delivery"
        ? country.rentCost * 0.4 * urbanizationMultiplier
        : country.rentCost * this.expansionModelData.locationsMultiplier * urbanizationMultiplier

    const utilitiesCost = rentCost * 0.15
    // Ajustar insumos por GDP per cápita, inflación y apertura comercial
    const gdpPerCapitaMultiplier = wbData ? Math.max(wbData.gdpPerCapita / 10000, 0.5) : 1
    const inflationAdjustment = wbData ? 1 + Math.abs(wbData.inflation) / 100 : 1
    const tradeOpennessMultiplier = wbData ? Math.max(wbData.tradeOpenness / 100, 0.7) : 1

    const suppliesCost =
      8000 *
      gdpPerCapitaMultiplier *
      this.businessTypeData.inventoryMultiplier *
      this.expansionModelData.locationsMultiplier *
      inflationAdjustment *
      tradeOpennessMultiplier

    const marketingCost = 1500 * this.expansionModelData.marketingMultiplier
    const insuranceCost = 800 * this.expansionModelData.locationsMultiplier
    const maintenanceCost = 600 * this.expansionModelData.locationsMultiplier
    const miscCost = 1000 * this.expansionModelData.locationsMultiplier

    const total =
      laborCost + rentCost + utilitiesCost + suppliesCost + marketingCost + insuranceCost + maintenanceCost + miscCost

    console.log(`[v0] Costos mensuales con datos World Bank:`)
    console.log(`[v0]   - Labor (ajustado): USD ${laborCost.toLocaleString()}`)
    console.log(`[v0]   - Rent (ajustado por urbanización): USD ${rentCost.toLocaleString()}`)
    console.log(`[v0]   - Supplies (ajustado por GDP/inflación/trade): USD ${suppliesCost.toLocaleString()}`)
    console.log(`[v0]   - TOTAL: USD ${total.toLocaleString()}`)

    return total
  }

  private calculateFinancialProjections(
    country: CountryData,
    wbData: WorldBankCountryData | null,
  ): {
    initialInvestment: number
    investmentBreakdown: InvestmentBreakdown
    roi: number
    paybackPeriod: number
  } {
    const budget = this.extractBudget()
    const employees = this.extractEmployees()

    console.log(`[v0] ===== CALCULANDO PROYECCIONES PARA ${country.name} =====`)
    console.log(`[v0] Empleados base: ${employees}`)
    console.log(`[v0] Presupuesto base: USD ${budget.toLocaleString()}`)

    // Pasar wbData a calculateInvestmentBreakdown
    const investmentBreakdown = this.calculateInvestmentBreakdown(country, wbData, employees, budget)
    const initialInvestment = Object.values(investmentBreakdown).reduce((sum, val) => sum + val, 0)

    console.log(`[v0] INVERSIÓN TOTAL: USD ${initialInvestment.toLocaleString()}`)

    // Calcular costos mensuales con datos del World Bank
    const monthlyCosts = this.calculateMonthlyCosts(country, wbData, employees)

    // Calcular ingresos mensuales con datos del World Bank
    const monthlyRevenue = this.estimateMonthlyRevenue(country, wbData, employees)

    console.log(`[v0] Ingresos mensuales estimados: USD ${monthlyRevenue.toLocaleString()}`)

    // Calcular margen neto con datos del World Bank
    const netProfitMargin = this.calculateNetProfitMargin(country, wbData)
    const monthlyNetProfit = monthlyRevenue * netProfitMargin

    console.log(`[v0] Margen neto: ${(netProfitMargin * 100).toFixed(2)}%`)
    console.log(`[v0] Ganancia neta mensual: USD ${monthlyNetProfit.toLocaleString()}`)

    const annualNetProfit = monthlyNetProfit * 12
    const roi = Number.parseFloat(((annualNetProfit / initialInvestment) * 100).toFixed(2))

    const paybackPeriod = monthlyNetProfit > 0 ? Math.round(initialInvestment / monthlyNetProfit) : 999

    console.log(`[v0] ROI anual: ${roi}%`)
    console.log(`[v0] Período de recuperación: ${paybackPeriod} meses`)
    console.log(`[v0] ==========================================`)

    return { initialInvestment, investmentBreakdown, roi, paybackPeriod }
  }

  private calculateNetProfitMargin(country: CountryData, wbData: WorldBankCountryData | null): number {
    // Margen base: 3-5% según datos de la industria
    let margin = 0.04 // 4% base

    // Ajustes por factores del país usando datos REALES del World Bank
    if (country.competition < 50) margin += 0.015
    if (country.competition > 75) margin -= 0.01

    // Usar taxRate REAL del World Bank
    const realTaxRate = wbData ? wbData.taxRate : country.taxRate
    if (realTaxRate < 25) margin += 0.01
    if (realTaxRate > 35) margin -= 0.015

    console.log(`[v0] Tax rate real del World Bank: ${realTaxRate.toFixed(1)}%`)

    if (country.gastronomicMarket > 80) margin += 0.01

    // Usar GDP per cápita REAL del World Bank
    const realGdpPerCapita = wbData ? wbData.gdpPerCapita : country.gdpPerCapita
    if (realGdpPerCapita > 15000) margin += 0.005

    console.log(`[v0] GDP per cápita real: USD ${realGdpPerCapita.toLocaleString()}`)

    // Ajustar por inflación REAL
    if (wbData) {
      if (Math.abs(wbData.inflation) > 8)
        margin -= 0.01 // Alta inflación reduce margen
      else if (Math.abs(wbData.inflation) < 3) margin += 0.005 // Baja inflación mejora margen

      console.log(`[v0] Inflación real: ${wbData.inflation.toFixed(2)}%`)
    }

    // Ajustar por crecimiento económico REAL
    const realGrowth = wbData ? wbData.gdpGrowth : country.growthRate
    if (realGrowth > 4) margin += 0.008
    else if (realGrowth < 1) margin -= 0.005

    console.log(`[v0] Crecimiento económico real: ${realGrowth.toFixed(2)}%`)

    // Ajustar por estabilidad política REAL
    if (wbData) {
      if (wbData.politicalStability > 65) margin += 0.005
      else if (wbData.politicalStability < 40) margin -= 0.008

      console.log(`[v0] Estabilidad política: ${wbData.politicalStability.toFixed(0)}/100`)
    }

    // Limitar entre 2% y 8%
    const finalMargin = Math.max(0.02, Math.min(0.08, margin))
    console.log(`[v0] Margen neto final: ${(finalMargin * 100).toFixed(2)}%`)

    return finalMargin
  }

  private estimateMonthlyRevenue(country: CountryData, wbData: WorldBankCountryData | null, employees: number): number {
    const baseRevenuePerEmployee = 4000

    // Usar datos REALES del World Bank
    const marketMultiplier = country.gastronomicMarket / 70

    // GDP per cápita REAL del World Bank
    const realGdpPerCapita = wbData ? wbData.gdpPerCapita : country.gdpPerCapita
    const wealthMultiplier = Math.min(realGdpPerCapita / 10000, 2)

    // Urbanización REAL del World Bank
    const realUrbanPopulation = wbData ? wbData.urbanPopulation : country.urbanPopulation
    const urbanMultiplier = realUrbanPopulation / 70

    // Turismo REAL del World Bank
    const realTourismReceipts = wbData ? wbData.tourismReceipts : country.tourismReceipts
    const tourismMultiplier = 1 + realTourismReceipts / 10000

    // Ajustar por crecimiento económico REAL
    const realGrowth = wbData ? wbData.gdpGrowth : country.growthRate
    const growthMultiplier = 1 + Math.max(realGrowth / 100, 0)

    // Ajustar por penetración digital REAL
    const digitalPenetration = wbData ? wbData.internetUsers / 100 : 0.6
    const digitalMultiplier = 1 + digitalPenetration * 0.2 // Más usuarios de internet = más pedidos online

    console.log(`[v0] Multiplicadores de ingresos con datos World Bank:`)
    console.log(`[v0]   - Wealth (GDP per cápita): ${wealthMultiplier.toFixed(2)}x`)
    console.log(`[v0]   - Urban: ${urbanMultiplier.toFixed(2)}x`)
    console.log(`[v0]   - Tourism: ${tourismMultiplier.toFixed(2)}x`)
    console.log(`[v0]   - Growth: ${growthMultiplier.toFixed(2)}x`)
    console.log(`[v0]   - Digital: ${digitalMultiplier.toFixed(2)}x`)

    const monthlyRevenue =
      baseRevenuePerEmployee *
      employees *
      marketMultiplier *
      wealthMultiplier *
      urbanMultiplier *
      tourismMultiplier *
      growthMultiplier *
      digitalMultiplier *
      this.expansionModelData.revenueMultiplier *
      this.companySizeData.operationalEfficiency

    return Math.round(monthlyRevenue)
  }

  private extractEmployees(): number {
    const employeesStr = this.businessData.employees?.toLowerCase() || ""
    const numbers = employeesStr.match(/\d+/g)
    if (numbers && numbers.length > 0) {
      return Number.parseInt(numbers[0])
    }
    if (this.businessData.companySize === "De 1 a 9 empleados") return 5
    if (this.businessData.companySize === "De 10 a 50 empleados") return 8
    if (this.businessData.companySize === "De 51 a 200 empleados") return 12
    if (this.businessData.companySize === "Más de 200 empleados") return 15
    return 8
  }

  private calculateSuccessProbability(overallScore: number, country: CountryData, roi: number): number {
    // Base: 35% del score general (reducido de 40%)
    let probability = overallScore * 0.35

    // ROI es ahora el factor MÁS importante (45% del peso total, aumentado de 30%)
    if (roi > 25) {
      probability += 45 // ROI excelente
    } else if (roi > 20) {
      probability += 38 // ROI muy bueno
    } else if (roi > 15) {
      probability += 30 // ROI bueno
    } else if (roi > 10) {
      probability += 22 // ROI moderado
    } else if (roi > 5) {
      probability += 15 // ROI bajo
    } else {
      probability += 8 // ROI muy bajo
    }

    // Ajustes por factores de riesgo del país (20% del peso, sin cambios)
    if (country.regulatoryComplexity > 70) probability -= 10
    else if (country.regulatoryComplexity > 50) probability -= 5

    if (country.competition > 80) probability -= 8
    else if (country.competition > 60) probability -= 4

    if (country.politicalStability < 40) probability -= 8
    else if (country.politicalStability > 65) probability += 5

    if (country.regulatoryQuality < 40) probability -= 6
    else if (country.regulatoryQuality > 65) probability += 4

    // Ajustes por condiciones económicas
    if (Math.abs(country.inflation) > 10) probability -= 6
    else if (Math.abs(country.inflation) < 4) probability += 3

    if (country.gdpGrowth < 0) probability -= 10
    else if (country.gdpGrowth > 4) probability += 6
    else if (country.gdpGrowth > 2.5) probability += 3

    // Ajustes por similitud cultural
    if (country.culturalSimilarity > 85) probability += 4
    else if (country.culturalSimilarity < 70) probability -= 3

    // Limitar entre 15% y 95% para ser realista
    return Math.min(Math.max(Math.round(probability), 15), 95)
  }

  private generateDetailedInsights(
    country: CountryData,
    marketScore: number,
    regulatoryScore: number,
    financialScore: number,
  ): string[] {
    const insights: string[] = []

    // Análisis de mercado
    if (marketScore >= 80) {
      insights.push(
        `${country.name} presenta un mercado gastronómico excepcional con ${country.marketSize.toFixed(1)}M de habitantes y ${country.urbanPopulation.toFixed(0)}% de urbanización`,
      )
    } else if (marketScore >= 65) {
      insights.push(
        `Mercado moderado en ${country.name} con potencial en segmentos específicos y zonas urbanas principales`,
      )
    } else {
      insights.push(`Mercado emergente en ${country.name} que requiere estrategia de nicho y posicionamiento cuidadoso`)
    }

    // Análisis económico
    if (country.gdpGrowth > 3.5) {
      insights.push(
        `Economía en expansión con crecimiento del ${country.gdpGrowth.toFixed(1)}% anual, aumentando el poder adquisitivo`,
      )
    } else if (country.gdpGrowth < 1) {
      insights.push(
        `Crecimiento económico moderado del ${country.gdpGrowth.toFixed(1)}% requiere enfoque en eficiencia operativa`,
      )
    }

    // Análisis regulatorio
    if (regulatoryScore >= 75) {
      insights.push(
        `Ambiente regulatorio favorable (score ${regulatoryScore}/100) con calidad institucional de ${country.regulatoryQuality.toFixed(0)}/100`,
      )
    } else if (regulatoryScore < 60) {
      insights.push(
        `Complejidad regulatoria significativa requiere asesoría legal local especializada y mayor tiempo de apertura`,
      )
    }

    // Análisis financiero
    if (financialScore >= 75) {
      insights.push(
        `Excelente viabilidad financiera con costos laborales de USD ${country.laborCost}/mes y carga tributaria del ${country.taxRate.toFixed(0)}%`,
      )
    } else if (financialScore < 60) {
      insights.push(
        `Costos operativos elevados (USD ${country.laborCost + country.rentCost}/mes base) requieren modelo de alto margen`,
      )
    }

    // Análisis de turismo
    if (country.tourismReceipts > 2000) {
      insights.push(
        `Fuerte sector turístico (USD ${country.tourismReceipts.toFixed(0)}M anuales) genera demanda constante en zonas estratégicas`,
      )
    }

    // Análisis digital
    if (country.internetUsers > 75) {
      insights.push(
        `Alta penetración digital (${country.internetUsers.toFixed(0)}% de usuarios) facilita marketing online y delivery`,
      )
    }

    // Análisis de inversión extranjera
    if (country.fdiInflow > 3) {
      insights.push(
        `Clima favorable para inversión extranjera (${country.fdiInflow.toFixed(1)}% del PIB) indica confianza empresarial`,
      )
    }

    return insights.slice(0, 5) // Limitar a 5 insights más relevantes
  }

  private generateDetailedRisks(country: CountryData): string[] {
    const risks: string[] = []

    // Riesgos regulatorios
    if (country.regulatoryComplexity > 70) {
      risks.push(
        `Alta complejidad regulatoria (${country.regulatoryComplexity}/100) puede extender apertura 6-12 meses y aumentar costos legales en 30-50%`,
      )
    } else if (country.regulatoryComplexity > 50) {
      risks.push(`Complejidad regulatoria moderada requiere 3-6 meses adicionales para permisos y licencias`)
    }

    // Riesgos políticos y de estabilidad
    if (country.politicalStability < 45) {
      risks.push(
        `Inestabilidad política (score ${country.politicalStability.toFixed(0)}/100) puede afectar continuidad operativa y confianza del consumidor`,
      )
    }

    // Riesgos económicos
    if (Math.abs(country.inflation) > 8) {
      risks.push(
        `Inflación elevada (${Math.abs(country.inflation).toFixed(1)}% anual) impacta costos de insumos y poder adquisitivo del consumidor`,
      )
    } else if (Math.abs(country.inflation) > 5) {
      risks.push(
        `Inflación moderada (${Math.abs(country.inflation).toFixed(1)}%) requiere ajustes frecuentes de precios`,
      )
    }

    if (country.gdpGrowth < 1) {
      risks.push(
        `Bajo crecimiento económico (${country.gdpGrowth.toFixed(1)}%) limita expansión del mercado y puede reducir gasto discrecional`,
      )
    }

    // Riesgos de mercado
    if (country.competition > 80) {
      risks.push(
        `Mercado altamente saturado (competencia ${country.competition}/100) requiere diferenciación clara y presupuesto de marketing 40% superior`,
      )
    } else if (country.competition > 65) {
      risks.push(`Competencia significativa requiere propuesta de valor única y estrategia de posicionamiento agresiva`)
    }

    // Riesgos fiscales
    if (country.taxRate > 35) {
      risks.push(
        `Carga tributaria muy elevada (${country.taxRate.toFixed(0)}%) reduce márgenes netos en 15-25 puntos porcentuales`,
      )
    } else if (country.taxRate > 28) {
      risks.push(
        `Impuestos altos (${country.taxRate.toFixed(0)}%) requieren estructura fiscal optimizada y asesoría contable especializada`,
      )
    }

    // Riesgos de tamaño de mercado
    if (country.marketSize < 8) {
      risks.push(
        `Mercado pequeño (${country.marketSize.toFixed(1)}M habitantes) limita escalamiento a 2-3 ubicaciones máximo`,
      )
    }

    // Riesgos culturales
    if (country.culturalSimilarity < 75) {
      risks.push(
        `Diferencias culturales significativas requieren adaptación de menú, servicio y estrategia de comunicación`,
      )
    }

    // Riesgos de calidad regulatoria
    if (country.regulatoryQuality < 45) {
      risks.push(
        `Baja calidad regulatoria (${country.regulatoryQuality.toFixed(0)}/100) puede generar inconsistencias en aplicación de normas`,
      )
    }

    // Riesgos de costos
    if (country.laborCost + country.rentCost > 4000) {
      risks.push(
        `Costos operativos elevados (USD ${(country.laborCost + country.rentCost).toLocaleString()}/mes) requieren volumen alto para rentabilidad`,
      )
    }

    return risks.slice(0, 6) // Limitar a 6 riesgos más críticos
  }

  private generateDetailedOpportunities(country: CountryData): string[] {
    const opportunities: string[] = []

    // Oportunidades de crecimiento económico
    if (country.gdpGrowth > 4) {
      opportunities.push(
        `Crecimiento económico robusto (${country.gdpGrowth.toFixed(1)}% anual) proyecta aumento del 15-20% en gasto gastronómico en 3 años`,
      )
    } else if (country.gdpGrowth > 2.5) {
      opportunities.push(
        `Crecimiento económico estable (${country.gdpGrowth.toFixed(1)}%) permite expansión gradual y sostenible`,
      )
    }

    // Oportunidades de mercado
    if (country.gastronomicMarket > 80) {
      opportunities.push(
        `Mercado gastronómico maduro y sofisticado permite posicionamiento premium y márgenes superiores al 25%`,
      )
    } else if (country.gastronomicMarket > 65) {
      opportunities.push(`Mercado en desarrollo con espacio para conceptos innovadores y formatos diferenciados`)
    }

    // Oportunidades de competencia
    if (country.competition < 50) {
      opportunities.push(
        `Baja competencia (${country.competition}/100) permite capturar 8-12% de participación de mercado en 2 años`,
      )
    } else if (country.competition < 65) {
      opportunities.push(`Competencia moderada ofrece nichos desatendidos y oportunidades de diferenciación`)
    }

    // Oportunidades regulatorias
    if (country.easeOfBusiness > 75) {
      opportunities.push(
        `Facilidad para hacer negocios (${country.easeOfBusiness}/100) permite apertura rápida (3-4 meses) y expansión multi-local`,
      )
    }

    if (country.regulatoryQuality > 65) {
      opportunities.push(
        `Alta calidad regulatoria (${country.regulatoryQuality.toFixed(0)}/100) garantiza previsibilidad y protección de inversión`,
      )
    }

    // Oportunidades de costos
    if (country.laborCost < 700) {
      opportunities.push(
        `Costos laborales competitivos (USD ${country.laborCost}/mes) permiten márgenes operativos 30-40% superiores al promedio regional`,
      )
    } else if (country.laborCost < 1000) {
      opportunities.push(
        `Costos laborales moderados facilitan estructura de personal robusta sin comprometer rentabilidad`,
      )
    }

    // Oportunidades de tamaño de mercado
    if (country.marketSize > 40) {
      opportunities.push(
        `Gran mercado (${country.marketSize.toFixed(1)}M habitantes) permite estrategia multi-formato: restaurantes, dark kitchens, franquicias`,
      )
    } else if (country.marketSize > 15) {
      opportunities.push(`Mercado de tamaño medio permite 5-8 ubicaciones estratégicas en principales ciudades`)
    }

    // Oportunidades de turismo
    if (country.tourismReceipts > 3000) {
      opportunities.push(
        `Sector turístico robusto (USD ${country.tourismReceipts.toFixed(0)}M) genera demanda premium en zonas turísticas con márgenes 35-45%`,
      )
    } else if (country.tourismReceipts > 1500) {
      opportunities.push(`Turismo creciente ofrece oportunidades en zonas estratégicas con clientela internacional`)
    }

    // Oportunidades digitales
    if (country.internetUsers > 75) {
      opportunities.push(
        `Alta conectividad (${country.internetUsers.toFixed(0)}% usuarios) permite estrategia omnicanal: delivery, reservas online, marketing digital`,
      )
    }

    // Oportunidades de inversión
    if (country.fdiInflow > 3.5) {
      opportunities.push(
        `Alto flujo de inversión extranjera (${country.fdiInflow.toFixed(1)}% PIB) facilita acceso a financiamiento y socios estratégicos`,
      )
    }

    // Oportunidades de urbanización
    if (country.urbanPopulation > 80) {
      opportunities.push(
        `Alta urbanización (${country.urbanPopulation.toFixed(0)}%) concentra mercado objetivo y optimiza logística de distribución`,
      )
    }

    // Oportunidades de estabilidad
    if (country.politicalStability > 65) {
      opportunities.push(
        `Estabilidad política (${country.politicalStability.toFixed(0)}/100) reduce riesgo y permite planificación a largo plazo (5-10 años)`,
      )
    }

    // Oportunidades de apertura comercial
    if (country.tradeOpenness > 70) {
      opportunities.push(
        `Alta apertura comercial (${country.tradeOpenness.toFixed(0)}% del PIB) facilita importación de insumos especializados a precios competitivos`,
      )
    }

    return opportunities.slice(0, 7) // Limitar a 7 oportunidades más relevantes
  }

  private extractBudget(): number {
    const budgetStr = this.businessData.budget?.toLowerCase() || ""
    const numbers = budgetStr.match(/\d+/g)
    if (numbers && numbers.length > 0) {
      return Number.parseInt(numbers[0]) * 1000 // Asumimos que se da en miles
    }
    return 50000 // Default
  }

  private extractYearsOperating(): number {
    const yearsStr = this.businessData.yearsOperating?.toLowerCase() || ""
    const numbers = yearsStr.match(/\d+/g)
    if (numbers && numbers.length > 0) {
      return Number.parseInt(numbers[0])
    }
    return 3 // Default
  }
}
