export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface BusinessData {
  companyName?: string // Agregado campo para nombre de la empresa
  businessType: string
  yearsOperating: string
  employees: string
  targetCountries: string
  budget: string
  revenue?: string
  businessModel?: string
  motivation?: string
  priorities?: string[]
  companySize?: string
  expansionModel?: string
  selectedCountries?: string[] // Agregado campo para países seleccionados como array
}

export interface SimulationResult {
  country: string
  marketScore: number
  regulatoryScore: number
  financialScore: number
  overallScore: number
  initialInvestment: number
  investmentBreakdown: InvestmentBreakdown
  roi: number
  paybackPeriod: number
  successProbability: number
  insights: string[]
  risks: string[]
  opportunities: string[]
}

export interface InvestmentBreakdown {
  setupCosts: number
  equipment: number
  initialInventory: number
  marketing: number
  workingCapital: number
  contingency: number
}

export interface CountryData {
  name: string
  marketSize: number
  gdpPerCapita: number
  easeOfBusiness: number
  taxRate: number
  laborCost: number
  rentCost: number
  regulatoryComplexity: number
  culturalSimilarity: number
  gastronomicMarket: number
  competition: number
  growthRate: number
  urbanPopulation: number
  tourismReceipts: number
  internetUsers: number
  politicalStability: number
  regulatoryQuality: number
  tradeOpenness: number
  inflation: number
  fdiInflow: number
}
