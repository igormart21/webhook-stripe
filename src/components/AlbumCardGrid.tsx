import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Grid3X3, List, Eye, Trash2 } from 'lucide-react'
import CardPreviewModal from './CardPreviewModal'
import { pokemonApiService } from '@/services/pokemonApi'

interface AlbumCardGridProps {
  cards: any[]
  onRemoveCard?: (cardId: string) => void
  isOwn?: boolean
}

export const AlbumCardGrid = ({ cards, onRemoveCard, isOwn = false }: AlbumCardGridProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cardDetails, setCardDetails] = useState<{ [key: string]: any }>({})

  // Carregar detalhes das cartas automaticamente
  useEffect(() => {
    const loadCardDetails = async () => {
      console.log('🟢 Carregando detalhes das cartas do álbum:', cards.length, 'cartas')
      console.log('🟢 IDs das cartas no álbum:', cards.map(c => c.card_id))
      const newCardDetails: { [key: string]: any } = {}
      
      for (const card of cards) {
        if (card.card_id && !cardDetails[card.card_id]) {
          console.log('🟢 Carregando detalhes da carta:', card.card_id)
          try {
            const cardData = await pokemonApiService.getCardById(card.card_id)
            console.log('✅ Carta carregada com sucesso:', cardData.name, 'para ID:', card.card_id)
            newCardDetails[card.card_id] = cardData
          } catch (error) {
            console.error(`❌ Erro ao carregar carta ${card.card_id}:`, error)
            // Usar dados básicos se não conseguir carregar da API
            newCardDetails[card.card_id] = {
              id: card.card_id,
              name: `Carta ${card.card_id}`,
              images: { small: '/placeholder-card.svg' },
              rarity: 'Desconhecida',
              types: ['Incolor'],
              supertype: 'Pokémon',
              subtypes: ['Basic'],
              hp: '50',
              set: {
                id: 'unknown-set',
                name: 'Coleção Desconhecida',
                series: 'Unknown',
                printedTotal: 1,
                total: 1,
                legalities: { unlimited: 'Legal' },
                releaseDate: '2024-01-01',
                updatedAt: '2024-01-01T00:00:00.000Z',
                images: { symbol: '', logo: '' }
              },
              number: '1',
              legalities: { unlimited: 'Legal' },
              attacks: [{
                name: 'Ataque Básico',
                cost: ['Colorless'],
                convertedEnergyCost: 1,
                damage: '10',
                text: 'Um ataque básico.'
              }]
            }
            console.log('⚠️ Usando dados básicos para carta:', card.card_id)
          }
        } else if (card.card_id) {
          console.log('ℹ️ Carta já carregada:', card.card_id)
        } else {
          console.log('⚠️ Carta sem card_id:', card)
        }
      }
      
      if (Object.keys(newCardDetails).length > 0) {
        console.log('✅ Detalhes das cartas carregados:', Object.keys(newCardDetails))
        setCardDetails(prev => ({ ...prev, ...newCardDetails }))
      } else {
        console.log('ℹ️ Nenhuma nova carta para carregar')
      }
    }

    if (cards.length > 0) {
      loadCardDetails()
    } else {
      console.log('ℹ️ Nenhuma carta no álbum para carregar')
    }
  }, [cards])

  const filteredCards = cards.filter(card => {
    const searchLower = searchTerm.toLowerCase()
    return (
      card.card_id?.toLowerCase().includes(searchLower) ||
      card.notes?.toLowerCase().includes(searchLower) ||
      cardDetails[card.card_id]?.name?.toLowerCase().includes(searchLower)
    )
  })

  const openCardPreview = async (card: any) => {
    try {
      // Buscar detalhes da carta da API se ainda não tivermos
      if (!cardDetails[card.card_id]) {
        const cardData = await pokemonApiService.getCardById(card.card_id)
        setCardDetails(prev => ({ ...prev, [card.card_id]: cardData }))
        setSelectedCard({ ...card, ...cardData })
      } else {
        setSelectedCard({ ...card, ...cardDetails[card.card_id] })
      }
      setIsModalOpen(true)
    } catch (error) {
      console.error('Erro ao carregar detalhes da carta:', error)
      // Usar dados básicos se não conseguir carregar da API
      setSelectedCard(card)
      setIsModalOpen(true)
    }
  }

  const closeCardPreview = () => {
    setIsModalOpen(false)
    setSelectedCard(null)
  }

  const handleToggleFavorite = (cardId: string) => {
    // Implementar favoritos se necessário
    console.log('Toggle favorite:', cardId)
  }

  const handleAddToCollection = (card: any) => {
    // Implementar adicionar à coleção se necessário
    console.log('Add to collection:', card)
  }

  const formatPrice = (value: any) =>
    value !== undefined && value !== null && value !== ''
      ? Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '';

  if (cards.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Grid3X3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-card-foreground mb-2">
          Álbum vazio
        </h3>
        <p className="text-muted-foreground">
          Adicione cartas ao seu álbum para começar sua coleção
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cartas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Cards Grid/List */}
      {filteredCards.length === 0 ? (
        <Card className="p-8 text-center">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Nenhuma carta encontrada
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar sua busca
          </p>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
            : 'space-y-4'
        }>
          {filteredCards.map((card, index) => {
            const apiCard = cardDetails[card.card_id] || {};
            const mergedCard = {
              ...apiCard,
              ...card,
              priceMin: card.price_min ?? card.priceMin,
              priceMax: card.price_max ?? card.priceMax,
              imageUrl: card.image_url ?? card.imageUrl,
              condition: card.condition,
              lang: card.lang,
              set: card.set,
              notes: card.notes,
              quantity: card.quantity,
              rarity: card.rarity ?? apiCard.rarity,
              name: card.name ?? apiCard.name,
              images: {
                small: (card.image_url ?? apiCard.images?.small ?? apiCard.images?.large ?? '/placeholder-card.svg'),
                large: (card.image_url ?? apiCard.images?.large ?? apiCard.images?.small ?? '/placeholder-card.svg'),
              },
            };
            return (
              <Card
                key={card.id || card.card_id}
                className="pokemon-card group cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  setSelectedCard(mergedCard);
                  setIsModalOpen(true);
                }}
              >
                <CardContent className="p-4">
                  {viewMode === 'grid' ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          {mergedCard.images?.small ? (
                            <img
                              src={mergedCard.images.small}
                              alt={mergedCard.name || mergedCard.card_id}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-card.svg';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                              <div className="text-center">
                                <div className="text-2xl mb-2">🃏</div>
                                <div className="text-xs">Carregando...</div>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Botões de ação na visualização grid */}
                        {isOwn && onRemoveCard && (
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveCard(card.card_id);
                              }}
                              title="Remover carta"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-sm truncate">
                          {mergedCard.name || `Carta ${card.card_id}`}
                        </p>
                        {mergedCard.rarity && (
                          <Badge variant="secondary" className="text-xs">
                            {mergedCard.rarity}
                          </Badge>
                        )}
                        {(mergedCard.priceMin || mergedCard.priceMax) && (
                          <span className="block text-xs text-green-700 font-semibold">
                            Preço: {mergedCard.priceMin ? formatPrice(mergedCard.priceMin) : ''}
                            {mergedCard.priceMin && mergedCard.priceMax ? ' - ' : ''}
                            {mergedCard.priceMax ? formatPrice(mergedCard.priceMax) : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {mergedCard.images?.small ? (
                          <img
                            src={mergedCard.images.small}
                            alt={mergedCard.name || mergedCard.card_id}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-card.svg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                            <div className="text-center">
                              <div className="text-lg">🃏</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{mergedCard.name || `Carta ${card.card_id}`}</h4>
                        {mergedCard.rarity && (
                          <span className="block text-xs text-muted-foreground">{mergedCard.rarity}</span>
                        )}
                        {(mergedCard.priceMin || mergedCard.priceMax) && (
                          <span className="block text-xs text-green-700 font-semibold">
                            Preço: {mergedCard.priceMin ? formatPrice(mergedCard.priceMin) : ''}
                            {mergedCard.priceMin && mergedCard.priceMax ? ' - ' : ''}
                            {mergedCard.priceMax ? formatPrice(mergedCard.priceMax) : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCard(mergedCard);
                            setIsModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {isOwn && onRemoveCard && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveCard(card.card_id);
                            }}
                            title="Remover carta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {/* Card Preview Modal */}
      <CardPreviewModal
        isOpen={isModalOpen}
        onClose={closeCardPreview}
        card={selectedCard}
        onToggleFavorite={handleToggleFavorite}
        onAddToCollection={handleAddToCollection}
        isFavorite={false}
      />
    </div>
  );
};
