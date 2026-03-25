// Cliente para la API del World Bank
// Documentación: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392

interface WorldBankIndicator {
  indicator: { id: string; value: string }
  country: { id: string; value: string }
  countryiso3code: string
  date: string
  value: number | null
  unit: string
  obs_status: string
  decimal: number
}

interface WorldBankResponse {
  page: number
  pages: number
  per_page: number
  total: number
}

type WorldBankApiResponse = [WorldBankResponse, WorldBankIndicator[]]

const COUNTRY_CODES: Record<string, string> = {
  Uruguay: "UY",
  Chile: "CL",
  Paraguay: "PY",
  Brasil: "BR",
  Bolivia: "BO",
}

// Indicadores clave del World Bank
const INDICATORS = {
  GDP: "NY.GDP.MKTP.CD", // PIB (US$ actuales)
  GDP_PER_CAPITA: "NY.GDP.PCAP.CD", // PIB per cápita (US$ actuales)
  GDP_GROWTH: "NY.GDP.MKTP.KD.ZG", // Crecimiento del PIB (% anual)
  POPULATION: "SP.POP.TOTL", // Población total
  EASE_OF_BUSINESS: "IC.BUS.EASE.XQ", // Facilidad para hacer negocios
  TAX_RATE: "IC.TAX.TOTL.CP.ZS", // Tasa impositiva total (% de ganancias comerciales)
  LABOR_COST: "SL.UEM.TOTL.ZS", // Desempleo (inverso indica costo laboral)
  INFLATION: "FP.CPI.TOTL.ZG", // Inflación (% anual)
  URBAN_POPULATION: "SP.URB.TOTL.IN.ZS", // Población urbana (% del total)
  TRADE_OPENNESS: "NE.TRD.GNFS.ZS", // Comercio (% del PIB)
  FDI_INFLOW: "BX.KLT.DINV.WD.GD.ZS", // Inversión extranjera directa (% del PIB)
  POLITICAL_STABILITY: "PV.EST", // Estabilidad política (-2.5 a 2.5)
  REGULATORY_QUALITY: "RQ.EST", // Calidad regulatoria (-2.5 a 2.5)
  INTERNET_USERS: "IT.NET.USER.ZS", // Usuarios de internet (% de población)
  TOURISM_RECEIPTS: "ST.INT.RCPT.CD", // Ingresos por turismo (US$)
}

export interface WorldBankCountryData {
  gdp: number
  gdpPerCapita: number
  gdpGrowth: number
  population: number
  easeOfBusiness: number
  taxRate: number
  inflation: number
  urbanPopulation: number // % población urbana
  tradeOpenness: number // Comercio como % del PIB
  fdiInflow: number // Inversión extranjera como % del PIB
  politicalStability: number // -2.5 a 2.5, normalizado a 0-100
  regulatoryQuality: number // -2.5 a 2.5, normalizado a 0-100
  internetUsers: number // % de población con internet
  tourismReceipts: number // Ingresos por turismo en millones USD
}

export class WorldBankAPI {
  private baseUrl = "https://api.worldbank.org/v2"
  private cache: Map<string, WorldBankCountryData> = new Map()

  async getCountryData(countryName: string): Promise<WorldBankCountryData | null> {
    const countryCode = COUNTRY_CODES[countryName]
    if (!countryCode) {
      console.error(`[v0] País no encontrado: ${countryName}`)
      return null
    }

    // Verificar cache
    if (this.cache.has(countryName)) {
      console.log(`[v0] Usando datos en cache para ${countryName}`)
      return this.cache.get(countryName)!
    }

    try {
      console.log(`[v0] Obteniendo datos del World Bank para ${countryName}...`)

      // Obtener todos los indicadores en paralelo
      const [
        gdp,
        gdpPerCapita,
        gdpGrowth,
        population,
        easeOfBusiness,
        taxRate,
        inflation,
        urbanPopulation,
        tradeOpenness,
        fdiInflow,
        politicalStability,
        regulatoryQuality,
        internetUsers,
        tourismReceipts,
      ] = await Promise.all([
        this.getIndicator(countryCode, INDICATORS.GDP),
        this.getIndicator(countryCode, INDICATORS.GDP_PER_CAPITA),
        this.getIndicator(countryCode, INDICATORS.GDP_GROWTH),
        this.getIndicator(countryCode, INDICATORS.POPULATION),
        this.getIndicator(countryCode, INDICATORS.EASE_OF_BUSINESS),
        this.getIndicator(countryCode, INDICATORS.TAX_RATE),
        this.getIndicator(countryCode, INDICATORS.INFLATION),
        this.getIndicator(countryCode, INDICATORS.URBAN_POPULATION),
        this.getIndicator(countryCode, INDICATORS.TRADE_OPENNESS),
        this.getIndicator(countryCode, INDICATORS.FDI_INFLOW),
        this.getIndicator(countryCode, INDICATORS.POLITICAL_STABILITY),
        this.getIndicator(countryCode, INDICATORS.REGULATORY_QUALITY),
        this.getIndicator(countryCode, INDICATORS.INTERNET_USERS),
        this.getIndicator(countryCode, INDICATORS.TOURISM_RECEIPTS),
      ])

      const data: WorldBankCountryData = {
        gdp: gdp || 0,
        gdpPerCapita: gdpPerCapita || 0,
        gdpGrowth: gdpGrowth || 0,
        population: population || 0,
        easeOfBusiness: easeOfBusiness || 50,
        taxRate: taxRate || 25,
        inflation: inflation || 0,
        urbanPopulation: urbanPopulation || 70,
        tradeOpenness: tradeOpenness || 50,
        fdiInflow: fdiInflow || 2,
        politicalStability: politicalStability !== null ? ((politicalStability + 2.5) / 5) * 100 : 50,
        regulatoryQuality: regulatoryQuality !== null ? ((regulatoryQuality + 2.5) / 5) * 100 : 50,
        internetUsers: internetUsers || 60,
        tourismReceipts: tourismReceipts ? tourismReceipts / 1000000 : 0, // Convertir a millones
      }

      // Guardar en cache
      this.cache.set(countryName, data)
      console.log(`[v0] Datos obtenidos para ${countryName}:`, data)

      return data
    } catch (error) {
      console.error(`[v0] Error obteniendo datos para ${countryName}:`, error)
      return null
    }
  }

  private async getIndicator(countryCode: string, indicatorCode: string): Promise<number | null> {
    try {
      // Obtener el dato más reciente (últimos 5 años)
      const url = `${this.baseUrl}/country/${countryCode}/indicator/${indicatorCode}?format=json&date=2019:2024&per_page=5`

      const response = await fetch(url)
      if (!response.ok) {
        console.error(`[v0] Error en API World Bank: ${response.status}`)
        return null
      }

      const data: WorldBankApiResponse = await response.json()

      // La respuesta es un array [metadata, data]
      if (!data || data.length < 2 || !data[1] || data[1].length === 0) {
        console.log(`[v0] No hay datos disponibles para ${indicatorCode} en ${countryCode}`)
        return null
      }

      // Buscar el primer valor no nulo (más reciente)
      for (const item of data[1]) {
        if (item.value !== null) {
          return item.value
        }
      }

      return null
    } catch (error) {
      console.error(`[v0] Error obteniendo indicador ${indicatorCode}:`, error)
      return null
    }
  }

  async getAllCountriesData(countryNames: string[]): Promise<Map<string, WorldBankCountryData>> {
    const results = new Map<string, WorldBankCountryData>()

    // Obtener datos de todos los países en paralelo
    const promises = countryNames.map(async (name) => {
      const data = await this.getCountryData(name)
      if (data) {
        results.set(name, data)
      }
    })

    await Promise.all(promises)
    return results
  }
}
