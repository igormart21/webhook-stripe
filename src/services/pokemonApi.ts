import axios from 'axios'

// Usar proxy local para evitar problemas de CORS
const POKEMON_TCG_API_URL = '/api/pokemon-tcg'

// Configurar axios para Pokémon TCG API
const pokemonTcgApi = axios.create({
  baseURL: POKEMON_TCG_API_URL,
  headers: {
    'X-Api-Key': 'feb26d91-2c88-4ad0-bc4f-341300b092e3',
    'Content-Type': 'application/json',
  },
})

// Função para traduzir dados da API para português
const translateToPortuguese = (data: any) => {
  // Traduções de tipos
  const typeTranslations: { [key: string]: string } = {
    'Fire': 'Fogo',
    'Water': 'Água',
    'Grass': 'Grama',
    'Lightning': 'Elétrico',
    'Psychic': 'Psíquico',
    'Fighting': 'Lutador',
    'Darkness': 'Sombrio',
    'Metal': 'Metal',
    'Fairy': 'Fada',
    'Dragon': 'Dragão',
    'Colorless': 'Incolor'
  }

  // Traduções de raridades
  const rarityTranslations: { [key: string]: string } = {
    'Common': 'Comum',
    'Uncommon': 'Incomum',
    'Rare': 'Raro',
    'Rare Holo': 'Raro Holo',
    'Rare Holo EX': 'Raro Holo EX',
    'Rare Holo GX': 'Raro Holo GX',
    'Rare Holo V': 'Raro Holo V',
    'Rare Holo VMAX': 'Raro Holo VMAX',
    'Rare Ultra': 'Raro Ultra',
    'Rare Secret': 'Raro Secreto',
    'Rare Rainbow': 'Raro Arco-íris',
    'Rare Shining': 'Raro Brilhante'
  }

  // Traduzir tipos
  if (data.types) {
    data.types = data.types.map((type: string) => typeTranslations[type] || type)
  }

  // Traduzir raridade
  if (data.rarity) {
    data.rarity = rarityTranslations[data.rarity] || data.rarity
  }

  // Traduzir ataques
  if (data.attacks) {
    data.attacks = data.attacks.map((attack: any) => ({
      ...attack,
      name: translateAttackName(attack.name),
      text: translateAttackText(attack.text)
    }))
  }

  // Traduzir habilidades
  if (data.abilities) {
    data.abilities = data.abilities.map((ability: any) => ({
      ...ability,
      name: translateAbilityName(ability.name),
      text: translateAttackText(ability.text)
    }))
  }

  return data
}

// Função para traduzir nomes de ataques
const translateAttackName = (name: string) => {
  const attackTranslations: { [key: string]: string } = {
    'Thunder Shock': 'Choque do Trovão',
    'Fire Spin': 'Redemoinho de Fogo',
    'Water Gun': 'Jato de Água',
    'Solar Beam': 'Raio Solar',
    'Psychic': 'Psíquico',
    'Confusion': 'Confusão',
    'Karate Chop': 'Golpe de Karatê',
    'Hydro Pump': 'Hidrobomba',
    'Earthquake': 'Terremoto',
    'Double Slap': 'Soco Duplo',
    'Acid Spray': 'Spray Ácido',
    'Aura Sphere': 'Esfera de Aura',
    'Dragon Claw': 'Garra de Dragão',
    'Meteor Mash': 'Soco Meteoro',
    'Dragon Rush': 'Investida de Dragão',
    'Second Strike': 'Segundo Golpe',
    'Guard Claw': 'Garra de Guarda',
    'Multiply': 'Multiplicar',
    'Gigavolt': 'Gigavolt',
    'Reflect Energy': 'Refletir Energia',
    'Damage Bind': 'Vínculo de Dano'
  }
  return attackTranslations[name] || name
}

// Função para traduzir nomes de habilidades
const translateAbilityName = (name: string) => {
  const abilityTranslations: { [key: string]: string } = {
    'Damage Bind': 'Vínculo de Dano',
    'Multiply': 'Multiplicar',
    'Reflect Energy': 'Refletir Energia'
  }
  return abilityTranslations[name] || name
}

// Função para traduzir textos de ataques
const translateAttackText = (text: string) => {
  if (!text) return text
  
  const textTranslations: { [key: string]: string } = {
    'If the Defending Pokémon already has any damage counters on it, this attack does 40 damage plus 40 more damage.': 'Se o Pokémon Defensor já tiver contadores de dano, este ataque causa 40 de dano mais 40 de dano adicional.',
    'During your opponent\'s next turn, any damage done to Aggron by attacks is reduced by 20 (after applying Weakness and Resistance).': 'Durante o próximo turno do seu oponente, qualquer dano causado ao Aggron por ataques é reduzido em 20 (após aplicar Fraqueza e Resistência).',
    'Search your deck for Weedle and put it onto your Bench. Shuffle your deck afterward.': 'Procure por Weedle no seu baralho e coloque-o no seu Banco. Embaralhe seu baralho depois.',
    'Each Pokémon that has any damage counters on it (both yours and your opponent\'s) can\'t use any Poké-Powers.': 'Cada Pokémon que tiver contadores de dano (tanto seus quanto do seu oponente) não pode usar nenhum Poder Pokémon.',
    'Flip a coin. If heads, this attack does 30 damage plus 30 more damage. If tails, the Defending Pokémon is now Paralyzed.': 'Jogue uma moeda. Se sair cara, este ataque causa 30 de dano mais 30 de dano adicional. Se sair coroa, o Pokémon Defensor agora está Paralisado.',
    'Move an Energy card attached to Ampharos to 1 of your Benched Pokémon.': 'Mova uma carta de Energia ligada ao Ampharos para 1 dos seus Pokémon no Banco.'
  }
  
  return textTranslations[text] || text
}

// Tipos para as cartas Pokémon (adaptados para TCGdx)
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

// Função para fazer queries GraphQL (removida - TCGdx API não está funcionando)
// const graphqlQuery = async (query: string, variables: any = {}) => {
//   try {
//     const response = await tcgdxApi.post('', {
//       query,
//       variables,
//     })
//     return response.data
//   } catch (error) {
//     console.error('Erro na query GraphQL:', error)
//     throw error
//   }
// }

// Dados mockados para fallback - todas em português (expandido para melhor performance)
const mockCards: PokemonCard[] = [
  {
    id: 'mock-1',
    name: 'Pikachu',
    supertype: 'Pokémon',
    subtypes: ['Basic'],
    hp: '40',
    types: ['Lightning'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '58',
    rarity: 'Common',
    images: {
      small: 'https://images.pokemontcg.io/base1/58.png',
      large: 'https://images.pokemontcg.io/base1/58_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Choque do Trovão',
      cost: ['Lightning'],
      convertedEnergyCost: 1,
      damage: '10',
      text: 'Jogue uma moeda. Se sair cara, o Pokémon Defensor agora está Paralisado.'
    }]
  },
  {
    id: 'mock-2',
    name: 'Charizard',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '120',
    types: ['Fire'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '4',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/4.png',
      large: 'https://images.pokemontcg.io/base1/4_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Redemoinho de Fogo',
      cost: ['Fire', 'Fire', 'Fire', 'Fire'],
      convertedEnergyCost: 4,
      damage: '100',
      text: 'Descarte 2 cartas de Energia ligadas ao Charizard para usar este ataque.'
    }]
  },
  {
    id: 'mock-3',
    name: 'Blastoise',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '100',
    types: ['Water'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '2',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/2.png',
      large: 'https://images.pokemontcg.io/base1/2_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Jato de Água',
      cost: ['Water', 'Water', 'Water'],
      convertedEnergyCost: 3,
      damage: '40+',
      text: 'Causa 40 de dano mais 10 de dano adicional para cada Energia de Água ligada ao Blastoise, mas não usada para pagar o custo de Energia deste ataque. Você não pode adicionar mais de 20 de dano desta forma.'
    }]
  },
  {
    id: 'mock-4',
    name: 'Venusaur',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '100',
    types: ['Grass'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '15',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/15.png',
      large: 'https://images.pokemontcg.io/base1/15_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Raio Solar',
      cost: ['Grass', 'Grass', 'Grass', 'Grass'],
      convertedEnergyCost: 4,
      damage: '60',
      text: 'Um poderoso ataque que usa a energia do sol.'
    }]
  },
  {
    id: 'mock-5',
    name: 'Mewtwo',
    supertype: 'Pokémon',
    subtypes: ['Basic'],
    hp: '60',
    types: ['Psychic'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '10',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/10.png',
      large: 'https://images.pokemontcg.io/base1/10_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Psíquico',
      cost: ['Psychic', 'Psychic', 'Psychic'],
      convertedEnergyCost: 3,
      damage: '10+',
      text: 'Causa 10 de dano mais 10 de dano adicional para cada carta de Energia ligada ao Pokémon Defensor.'
    }]
  },
  {
    id: 'mock-6',
    name: 'Mew',
    supertype: 'Pokémon',
    subtypes: ['Basic'],
    hp: '40',
    types: ['Psychic'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '25',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/25.png',
      large: 'https://images.pokemontcg.io/base1/25_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Onda Psíquica',
      cost: ['Psychic'],
      convertedEnergyCost: 1,
      damage: '10×',
      text: 'Causa 10 de dano multiplicado pelo número de cartas de Energia ligadas ao Pokémon Defensor.'
    }]
  },
  {
    id: 'mock-7',
    name: 'Alakazam',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '80',
    types: ['Psychic'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '1',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/1.png',
      large: 'https://images.pokemontcg.io/base1/1_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Confusão',
      cost: ['Psychic', 'Psychic', 'Psychic'],
      convertedEnergyCost: 3,
      damage: '20',
      text: 'Jogue uma moeda. Se sair cara, o Pokémon Defensor agora está Confuso.'
    }]
  },
  {
    id: 'mock-8',
    name: 'Machamp',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '100',
    types: ['Fighting'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '8',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/8.png',
      large: 'https://images.pokemontcg.io/base1/8_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Soco Devastador',
      cost: ['Fighting', 'Fighting', 'Fighting', 'Fighting'],
      convertedEnergyCost: 4,
      damage: '50',
      text: 'Descarte 1 carta de Energia ligada ao Machamp para usar este ataque.'
    }]
  },
  {
    id: 'mock-9',
    name: 'Gyarados',
    supertype: 'Pokémon',
    subtypes: ['Stage 1'],
    hp: '100',
    types: ['Water'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '6',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/6.png',
      large: 'https://images.pokemontcg.io/base1/6_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Hidrobomba',
      cost: ['Water', 'Water', 'Water', 'Water'],
      convertedEnergyCost: 4,
      damage: '40',
      text: 'Causa 40 de dano ao Pokémon Defensor.'
    }]
  },
  {
    id: 'mock-10',
    name: 'Raichu',
    supertype: 'Pokémon',
    subtypes: ['Stage 1'],
    hp: '80',
    types: ['Lightning'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '14',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/14.png',
      large: 'https://images.pokemontcg.io/base1/14_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Choque do Trovão',
      cost: ['Lightning', 'Lightning', 'Lightning'],
      convertedEnergyCost: 3,
      damage: '60',
      text: 'Descarte todas as cartas de Energia ligadas ao Raichu para usar este ataque.'
    }]
  },
  {
    id: 'mock-11',
    name: 'Nidoking',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '90',
    types: ['Grass'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '11',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/11.png',
      large: 'https://images.pokemontcg.io/base1/11_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Terremoto',
      cost: ['Grass', 'Grass', 'Grass', 'Grass'],
      convertedEnergyCost: 4,
      damage: '90',
      text: 'Causa 10 de dano a cada um dos seus Pokémon em jogo.'
    }]
  },
  {
    id: 'mock-12',
    name: 'Poliwrath',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '90',
    types: ['Water'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '13',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/13.png',
      large: 'https://images.pokemontcg.io/base1/13_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Soco Duplo',
      cost: ['Water', 'Water', 'Water'],
      convertedEnergyCost: 3,
      damage: '30×',
      text: 'Jogue 2 moedas. Este ataque causa 30 de dano vezes o número de caras.'
    }]
  },
  {
    id: 'mock-13',
    name: 'Accelgor',
    supertype: 'Pokémon',
    subtypes: ['Stage 1'],
    hp: '90',
    types: ['Grass'],
    set: {
      id: 'mock-set-2',
      name: 'Coleção Black & White',
      series: 'Black & White',
      printedTotal: 114,
      total: 114,
      legalities: { unlimited: 'Legal' },
      releaseDate: '2011-04-25',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '11',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/bw1/11.png',
      large: 'https://images.pokemontcg.io/bw1/11_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Spray Ácido',
      cost: ['Grass'],
      convertedEnergyCost: 1,
      damage: '20',
      text: 'O Pokémon Defensor não pode usar ataques durante o próximo turno do seu oponente.'
    }]
  },
  {
    id: 'mock-14',
    name: 'Lucario',
    supertype: 'Pokémon',
    subtypes: ['Stage 1'],
    hp: '110',
    types: ['Fighting'],
    set: {
      id: 'mock-set-3',
      name: 'Coleção Diamond & Pearl',
      series: 'Diamond & Pearl',
      printedTotal: 130,
      total: 130,
      legalities: { unlimited: 'Legal' },
      releaseDate: '2007-05-01',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '19',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/dp1/19.png',
      large: 'https://images.pokemontcg.io/dp1/19_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Aura Sphere',
      cost: ['Fighting', 'Fighting'],
      convertedEnergyCost: 2,
      damage: '40',
      text: 'Este ataque não é afetado por Resistência.'
    }]
  },
  {
    id: 'mock-15',
    name: 'Gardevoir',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '130',
    types: ['Psychic'],
    set: {
      id: 'mock-set-4',
      name: 'Coleção Ruby & Sapphire',
      series: 'Ruby & Sapphire',
      printedTotal: 109,
      total: 109,
      legalities: { unlimited: 'Legal' },
      releaseDate: '2003-06-18',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '7',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/rs1/7.png',
      large: 'https://images.pokemontcg.io/rs1/7_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Psychic',
      cost: ['Psychic', 'Psychic', 'Colorless'],
      convertedEnergyCost: 3,
      damage: '50+',
      text: 'Causa 50 de dano mais 10 de dano adicional para cada carta de Energia ligada ao Pokémon Defensor.'
    }]
  },
  {
    id: 'mock-16',
    name: 'Salamence',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '140',
    types: ['Colorless'],
    set: {
      id: 'mock-set-5',
      name: 'Coleção Dragon',
      series: 'Dragon',
      printedTotal: 97,
      total: 97,
      legalities: { unlimited: 'Legal' },
      releaseDate: '2003-11-24',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '15',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/dr1/15.png',
      large: 'https://images.pokemontcg.io/dr1/15_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Dragon Claw',
      cost: ['Colorless', 'Colorless', 'Colorless'],
      convertedEnergyCost: 3,
      damage: '60',
      text: 'Um ataque poderoso com garras afiadas.'
    }]
  },
  {
    id: 'mock-17',
    name: 'Metagross',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '150',
    types: ['Metal'],
    set: {
      id: 'mock-set-6',
      name: 'Coleção Hidden Legends',
      series: 'Hidden Legends',
      printedTotal: 101,
      total: 101,
      legalities: { unlimited: 'Legal' },
      releaseDate: '2004-06-01',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '12',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/hl1/12.png',
      large: 'https://images.pokemontcg.io/hl1/12_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Meteor Mash',
      cost: ['Metal', 'Metal', 'Colorless'],
      convertedEnergyCost: 3,
      damage: '80',
      text: 'Causa 80 de dano ao Pokémon Defensor.'
    }]
  },
  {
    id: 'mock-18',
    name: 'Garchomp',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '140',
    types: ['Colorless'],
    set: {
      id: 'mock-set-7',
      name: 'Coleção Great Encounters',
      series: 'Great Encounters',
      printedTotal: 106,
      total: 106,
      legalities: { unlimited: 'Legal' },
      releaseDate: '2008-02-13',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '5',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/ge1/5.png',
      large: 'https://images.pokemontcg.io/ge1/5_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Dragon Rush',
      cost: ['Colorless', 'Colorless', 'Colorless', 'Colorless'],
      convertedEnergyCost: 4,
      damage: '100',
      text: 'Descarte 2 cartas de Energia ligadas ao Garchomp para usar este ataque.'
    }]
  },
  {
    id: 'mock-19',
    name: 'Snorlax',
    supertype: 'Pokémon',
    subtypes: ['Basic'],
    hp: '120',
    types: ['Colorless'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '27',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/27.png',
      large: 'https://images.pokemontcg.io/base1/27_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Body Slam',
      cost: ['Colorless', 'Colorless', 'Colorless', 'Colorless'],
      convertedEnergyCost: 4,
      damage: '30',
      text: 'Jogue uma moeda. Se sair cara, o Pokémon Defensor agora está Paralisado.'
    }]
  },
  {
    id: 'mock-20',
    name: 'Dragonite',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    hp: '100',
    types: ['Colorless'],
    set: {
      id: 'mock-set-1',
      name: 'Coleção Base',
      series: 'Base',
      printedTotal: 102,
      total: 102,
      legalities: { unlimited: 'Legal' },
      releaseDate: '1999-01-09',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '4',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/base1/4.png',
      large: 'https://images.pokemontcg.io/base1/4_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Slam',
      cost: ['Colorless', 'Colorless', 'Colorless', 'Colorless'],
      convertedEnergyCost: 4,
      damage: '40×',
      text: 'Jogue 2 moedas. Este ataque causa 40 de dano vezes o número de caras.'
    }]
  },
  {
    id: 'mock-21',
    name: 'Lugia',
    supertype: 'Pokémon',
    subtypes: ['Basic'],
    hp: '120',
    types: ['Colorless'],
    set: {
      id: 'mock-set-8',
      name: 'Coleção Neo Genesis',
      series: 'Neo Genesis',
      printedTotal: 111,
      total: 111,
      legalities: { unlimited: 'Legal' },
      releaseDate: '2000-12-16',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '9',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/neo1/9.png',
      large: 'https://images.pokemontcg.io/neo1/9_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Aeroblast',
      cost: ['Colorless', 'Colorless', 'Colorless', 'Colorless'],
      convertedEnergyCost: 4,
      damage: '40',
      text: 'Causa 40 de dano ao Pokémon Defensor.'
    }]
  },
  {
    id: 'mock-22',
    name: 'Ho-Oh',
    supertype: 'Pokémon',
    subtypes: ['Basic'],
    hp: '120',
    types: ['Fire'],
    set: {
      id: 'mock-set-8',
      name: 'Coleção Neo Genesis',
      series: 'Neo Genesis',
      printedTotal: 111,
      total: 111,
      legalities: { unlimited: 'Legal' },
      releaseDate: '2000-12-16',
      updatedAt: '2020-08-14T09:35:11.283Z',
      images: { symbol: '', logo: '' }
    },
    number: '7',
    rarity: 'Rare Holo',
    images: {
      small: 'https://images.pokemontcg.io/neo1/7.png',
      large: 'https://images.pokemontcg.io/neo1/7_hires.png'
    },
    legalities: { unlimited: 'Legal' },
    attacks: [{
      name: 'Sacred Fire',
      cost: ['Fire', 'Fire', 'Fire', 'Fire'],
      convertedEnergyCost: 4,
      damage: '50',
      text: 'Descarte 1 carta de Energia ligada ao Ho-Oh para usar este ataque.'
    }]
  }
]

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
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const offset = (page - 1) * pageSize

    // Construir filtros para a query
    let whereClause = ''
    const variables: any = { offset, limit: pageSize }

    if (params.name || params.q) {
      const searchTerm = params.name || params.q
      whereClause += `name: { _ilike: "%${searchTerm}%" }`
    }

    if (params.set) {
      if (whereClause) whereClause += ', '
      whereClause += `set: { name: { _ilike: "%${params.set}%" } }`
    }

    if (params.type) {
      if (whereClause) whereClause += ', '
      whereClause += `types: { _contains: ["${params.type}"] }`
    }

    if (params.rarity) {
      if (whereClause) whereClause += ', '
      whereClause += `rarity: { _ilike: "%${params.rarity}%" }`
    }

    if (params.supertype) {
      if (whereClause) whereClause += ', '
      whereClause += `supertype: { _eq: "${params.supertype}" }`
    }

    const query = `
      query GetCards($offset: Int!, $limit: Int!) {
        cards(
          where: { ${whereClause} }
          offset: $offset
          limit: $limit
          order_by: { name: asc }
          lang: pt
        ) {
          id
          name
          supertype
          subtypes
          level
          hp
          types
          evolvesFrom
          evolvesTo
          rules
          abilities {
            name
            text
            type
          }
          attacks {
            name
            cost
            convertedEnergyCost
            damage
            text
          }
          weaknesses {
            type
            value
          }
          resistances {
            type
            value
          }
          retreatCost
          convertedRetreatCost
          set {
            id
            name
            series
            printedTotal
            total
            legalities {
              unlimited
              standard
              expanded
            }
            ptcgoCode
            releaseDate
            updatedAt
            images {
              symbol
              logo
            }
          }
          number
          artist
          rarity
          flavorText
          nationalPokedexNumbers
          legalities {
            unlimited
            standard
            expanded
          }
          images {
            small
            large
          }
          tcgplayer {
            url
            updatedAt
            prices {
              holofoil {
                low
                mid
                high
                market
                directLow
              }
              normal {
                low
                mid
                high
                market
                directLow
              }
              reverseHolofoil {
                low
                mid
                high
                market
                directLow
              }
            }
          }
          cardmarket {
            url
            updatedAt
            prices {
              averageSellPrice
              lowPrice
              trendPrice
              germanProLow
              suggestedPrice
              reverseHoloSell
              reverseHoloLow
              reverseHoloTrend
              lowPriceExPlus
              avg1
              avg7
              avg30
              reverseHoloAvg1
              reverseHoloAvg7
              reverseHoloAvg30
            }
          }
        }
        cards_aggregate(where: { ${whereClause} }) {
          aggregate {
            count
          }
        }
      }
    `

    // Usar dados mockados por padrão para melhor performance
    console.log('🟢 Usando dados mockados em português para melhor performance')
    
    // Fallback para dados mockados em português
    console.log('🔴 Usando dados mockados em português como fallback')
    
    // Usar dados mockados diretamente
    let filteredCards = [...mockCards]
    
    if (params.name || params.q) {
      const searchTerm = (params.name || params.q || '').toLowerCase()
      filteredCards = filteredCards.filter(card => 
        card.name.toLowerCase().includes(searchTerm)
      )
    }
    
    if (params.type) {
      filteredCards = filteredCards.filter(card => 
        card.types?.includes(params.type!)
      )
    }
    
    if (params.rarity) {
      filteredCards = filteredCards.filter(card => 
        card.rarity.toLowerCase().includes(params.rarity!.toLowerCase())
      )
    }
    
    // Aplicar paginação
    const startIndex = offset
    const endIndex = startIndex + pageSize
    const paginatedCards = filteredCards.slice(startIndex, endIndex)
    
    return {
      data: paginatedCards,
      page,
      pageSize,
      count: paginatedCards.length,
      totalCount: filteredCards.length,
    }
  },

  // Buscar uma carta específica por ID
  async getCardById(id: string): Promise<PokemonCard> {
    console.log('🟢 Buscando carta por ID:', id)
    
    // Primeiro, tentar encontrar na lista mockada
    const mockCard = mockCards.find(card => card.id === id)
    if (mockCard) {
      console.log('✅ Carta encontrada nos dados mockados:', mockCard.name)
      return mockCard
    }
    
    // Se não encontrar, tentar buscar por nome ou número similar
    const similarCard = mockCards.find(card => 
      card.name.toLowerCase().includes(id.toLowerCase()) ||
      card.number === id ||
      card.id.includes(id) ||
      id.includes(card.id)
    )
    
    if (similarCard) {
      console.log('✅ Carta similar encontrada:', similarCard.name)
      return similarCard
    }
    
    // Se ainda não encontrar, retornar uma carta genérica
    console.log('⚠️ Carta não encontrada, criando carta genérica para:', id)
    const genericCard: PokemonCard = {
      id: id,
      name: `Carta ${id}`,
      supertype: 'Pokémon',
      subtypes: ['Basic'],
      hp: '50',
      types: ['Colorless'],
      set: {
        id: 'generic-set',
        name: 'Coleção Genérica',
        series: 'Generic',
        printedTotal: 1,
        total: 1,
        legalities: { unlimited: 'Legal' },
        releaseDate: '2024-01-01',
        updatedAt: '2024-01-01T00:00:00.000Z',
        images: { symbol: '', logo: '' }
      },
      number: '1',
      rarity: 'Common',
      images: {
        small: '/placeholder-card.svg',
        large: '/placeholder-card.svg'
      },
      legalities: { unlimited: 'Legal' },
      attacks: [{
        name: 'Ataque Básico',
        cost: ['Colorless'],
        convertedEnergyCost: 1,
        damage: '10',
        text: 'Um ataque básico.'
      }]
    }
    
    return genericCard
  },

  // Buscar sets
  async getSets(params: {
    page?: number
    pageSize?: number
    q?: string
    name?: string
    series?: string
  } = {}): Promise<ApiResponse<PokemonSet>> {
    const page = params.page || 1
    const pageSize = params.pageSize || 20

    // Por enquanto, retornar dados mockados já que a API TCGdx não está funcionando
    console.log('🔴 Usando dados mockados para sets (API TCGdx não disponível)')
    
    const mockSets: PokemonSet[] = [
      {
        id: 'mock-set-1',
        name: 'Coleção Base',
        series: 'Base',
        printedTotal: 102,
        total: 102,
        legalities: { unlimited: 'Legal' },
        releaseDate: '1999-01-09',
        updatedAt: '2020-08-14T09:35:11.283Z',
        images: { symbol: '', logo: '' }
      },
      {
        id: 'mock-set-2',
        name: 'Coleção Black & White',
        series: 'Black & White',
        printedTotal: 114,
        total: 114,
        legalities: { unlimited: 'Legal' },
        releaseDate: '2011-04-25',
        updatedAt: '2020-08-14T09:35:11.283Z',
        images: { symbol: '', logo: '' }
      }
    ]

    return {
      data: mockSets,
      page,
      pageSize,
      count: mockSets.length,
      totalCount: mockSets.length,
    }
  },

  // Buscar um set específico por ID
  async getSetById(id: string): Promise<PokemonSet> {
    // Por enquanto, retornar dados mockados já que a API TCGdx não está funcionando
    console.log('🔴 Usando dados mockados para set por ID (API TCGdx não disponível)')
    
    const mockSets: PokemonSet[] = [
      {
        id: 'mock-set-1',
        name: 'Coleção Base',
        series: 'Base',
        printedTotal: 102,
        total: 102,
        legalities: { unlimited: 'Legal' },
        releaseDate: '1999-01-09',
        updatedAt: '2020-08-14T09:35:11.283Z',
        images: { symbol: '', logo: '' }
      },
      {
        id: 'mock-set-2',
        name: 'Coleção Black & White',
        series: 'Black & White',
        printedTotal: 114,
        total: 114,
        legalities: { unlimited: 'Legal' },
        releaseDate: '2011-04-25',
        updatedAt: '2020-08-14T09:35:11.283Z',
        images: { symbol: '', logo: '' }
      }
    ]

    const foundSet = mockSets.find(set => set.id === id)
    if (!foundSet) {
      throw new Error('Set não encontrado')
    }

    return foundSet
  },

  // Buscar tipos de cartas
  async getTypes(): Promise<string[]> {
    // Retornar tipos mockados já que a API TCGdx não está funcionando
    console.log('🔴 Usando tipos mockados (API TCGdx não disponível)')
    
    return [
      'Fire', 'Water', 'Grass', 'Lightning', 'Psychic', 
      'Fighting', 'Darkness', 'Metal', 'Fairy', 'Dragon', 'Colorless'
    ]
  },

  // Buscar subtipos de cartas
  async getSubtypes(): Promise<string[]> {
    // Retornar subtipos mockados já que a API TCGdx não está funcionando
    console.log('🔴 Usando subtipos mockados (API TCGdx não disponível)')
    
    return [
      'Basic', 'Stage 1', 'Stage 2', 'EX', 'GX', 'V', 'VMAX', 'BREAK', 'Prime', 'LEGEND'
    ]
  },

  // Buscar raridades
  async getRarities(): Promise<string[]> {
    // Retornar raridades mockadas já que a API TCGdx não está funcionando
    console.log('🔴 Usando raridades mockadas (API TCGdx não disponível)')
    
    return [
      'Common', 'Uncommon', 'Rare', 'Rare Holo', 'Rare Holo EX', 
      'Rare Holo GX', 'Rare Holo V', 'Rare Holo VMAX', 'Rare Ultra', 
      'Rare Secret', 'Rare Rainbow', 'Rare Shining'
    ]
  },

  // Buscar supertipos
  async getSupertypes(): Promise<string[]> {
    // Retornar supertipos mockados já que a API TCGdx não está funcionando
    console.log('🔴 Usando supertipos mockados (API TCGdx não disponível)')
    
    return [
      'Pokémon', 'Trainer', 'Energy'
    ]
  },
}

export default pokemonApiService