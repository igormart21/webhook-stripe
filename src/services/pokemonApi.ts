import axios from 'axios'

const POKEMON_TCG_API_KEY = 'feb26d91-2c88-4ad0-bc4f-341300b092e3'
const POKEMON_TCG_BASE_URL = 'https://api.pokemontcg.io/v2'

// Configurar axios com a API key
const pokemonApi = axios.create({
  baseURL: POKEMON_TCG_BASE_URL,
  headers: {
    'X-Api-Key': POKEMON_TCG_API_KEY,
  },
})

// Tipos para as cartas Pokémon
export interface PokemonCard {
  id: string
  name: string
  supertype: string
  subtypes: string[]
  level?: string
  hp?: string
  types?: string[]
  evolvesFrom?: string
  evolvesTo?: string[]
  rules?: string[]
  ancientTrait?: {
    name: string
    text: string
  }
  abilities?: Array<{
    name: string
    text: string
    type: string
  }>
  attacks?: Array<{
    name: string
    cost: string[]
    convertedEnergyCost: number
    damage: string
    text: string
  }>
  weaknesses?: Array<{
    type: string
    value: string
  }>
  resistances?: Array<{
    type: string
    value: string
  }>
  retreatCost?: string[]
  convertedRetreatCost?: number
  set: {
    id: string
    name: string
    series: string
    printedTotal: number
    total: number
    legalities: {
      unlimited: string
      standard?: string
      expanded?: string
    }
    ptcgoCode?: string
    releaseDate: string
    updatedAt: string
    images: {
      symbol: string
      logo: string
    }
  }
  number: string
  artist?: string
  rarity: string
  flavorText?: string
  nationalPokedexNumbers?: number[]
  legalities: {
    unlimited: string
    standard?: string
    expanded?: string
  }
  images: {
    small: string
    large: string
  }
  tcgplayer?: {
    url: string
    updatedAt: string
    prices: {
      holofoil?: {
        low: number
        mid: number
        high: number
        market: number
        directLow: number
      }
      normal?: {
        low: number
        mid: number
        high: number
        market: number
        directLow: number
      }
      reverseHolofoil?: {
        low: number
        mid: number
        high: number
        market: number
        directLow: number
      }
    }
  }
  cardmarket?: {
    url: string
    updatedAt: string
    prices: {
      averageSellPrice: number
      lowPrice: number
      trendPrice: number
      germanProLow: number
      suggestedPrice: number
      reverseHoloSell: number
      reverseHoloLow: number
      reverseHoloTrend: number
      lowPriceExPlus: number
      avg1: number
      avg7: number
      avg30: number
      reverseHoloAvg1: number
      reverseHoloAvg7: number
      reverseHoloAvg30: number
    }
  }
}

export interface PokemonSet {
  id: string
  name: string
  series: string
  printedTotal: number
  total: number
  legalities: {
    unlimited: string
    standard?: string
    expanded?: string
  }
  ptcgoCode?: string
  releaseDate: string
  updatedAt: string
  images: {
    symbol: string
    logo: string
  }
}

export interface ApiResponse<T> {
  data: T[]
  page: number
  pageSize: number
  count: number
  totalCount: number
}

// Funções da API
export const pokemonApiService = {
  // Buscar cartas com filtros
  async getCards(params: {
    page?: number
    pageSize?: number
    q?: string
    name?: string
    set?: string
    type?: string
    rarity?: string
    supertype?: string
  } = {}): Promise<ApiResponse<PokemonCard>> {
    // Converter parâmetros para o formato correto da API
    const apiParams: any = {}
    
    if (params.page) apiParams.page = params.page
    if (params.pageSize) apiParams.pageSize = params.pageSize
    if (params.name) apiParams.name = params.name
    if (params.set) apiParams.set = params.set
    if (params.type) apiParams.type = params.type
    if (params.rarity) apiParams.rarity = params.rarity
    if (params.supertype) apiParams.supertype = params.supertype
    
    // Para busca geral, usar o parâmetro 'name' em vez de 'q'
    if (params.q && !params.name) {
      apiParams.name = params.q
    }
    
    const response = await pokemonApi.get('/cards', { params: apiParams })
    return response.data
  },

  // Buscar uma carta específica por ID
  async getCardById(id: string): Promise<PokemonCard> {
    const response = await pokemonApi.get(`/cards/${id}`)
    return response.data.data
  },

  // Buscar sets
  async getSets(params: {
    page?: number
    pageSize?: number
    q?: string
    name?: string
    series?: string
  } = {}): Promise<ApiResponse<PokemonSet>> {
    const response = await pokemonApi.get('/sets', { params })
    return response.data
  },

  // Buscar um set específico por ID
  async getSetById(id: string): Promise<PokemonSet> {
    const response = await pokemonApi.get(`/sets/${id}`)
    return response.data.data
  },

  // Buscar tipos de cartas
  async getTypes(): Promise<string[]> {
    const response = await pokemonApi.get('/types')
    return response.data.data
  },

  // Buscar subtipos de cartas
  async getSubtypes(): Promise<string[]> {
    const response = await pokemonApi.get('/subtypes')
    return response.data.data
  },

  // Buscar raridades
  async getRarities(): Promise<string[]> {
    const response = await pokemonApi.get('/rarities')
    return response.data.data
  },

  // Buscar supertipos
  async getSupertypes(): Promise<string[]> {
    const response = await pokemonApi.get('/supertypes')
    return response.data.data
  },
}

export default pokemonApi
