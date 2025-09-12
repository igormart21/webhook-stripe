import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Grid3X3, List, Eye } from 'lucide-react'
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
      const newCardDetails: { [key: string]: any } = {}
      
      for (const card of cards) {
        if (card.card_id && !cardDetails[card.card_id]) {
          try {
            const cardData = await pokemonApiService.getCardById(card.card_id)
            newCardDetails[card.card_id] = cardData
          } catch (error) {
            console.error(`Erro ao carregar carta ${card.card_id}:`, error)
            // Usar dados básicos se não conseguir carregar da API
            newCardDetails[card.card_id] = {
              id: card.card_id,
              name: card.card_id,
              images: { small: '/placeholder-card.png' }
            }
          }
        }
      }
      
      if (Object.keys(newCardDetails).length > 0) {
        setCardDetails(prev => ({ ...prev, ...newCardDetails }))
      }
    }

    if (cards.length > 0) {
      loadCardDetails()
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
          {filteredCards.map((card) => (
            <Card
              key={card.id}
              className="pokemon-card group cursor-pointer hover:scale-105 transition-transform"
              onClick={() => openCardPreview(card)}
            >
              <CardContent className="p-4">
                {viewMode === 'grid' ? (
                  <div className="space-y-3">
                    <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={cardDetails[card.card_id]?.images?.small || `/placeholder-card.png`}
                        alt={cardDetails[card.card_id]?.name || card.card_id}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-card.png'
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm truncate">
                        {cardDetails[card.card_id]?.name || card.card_id}
                      </p>
                      {card.quantity > 1 && (
                        <Badge variant="secondary" className="text-xs">
                          x{card.quantity}
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-muted rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={cardDetails[card.card_id]?.images?.small || `/placeholder-card.png`}
                        alt={cardDetails[card.card_id]?.name || card.card_id}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-card.png'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{cardDetails[card.card_id]?.name || card.card_id}</h4>
                      {card.notes && (
                        <p className="text-sm text-muted-foreground">{card.notes}</p>
                      )}
                      {card.quantity > 1 && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Quantidade: {card.quantity}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openCardPreview(card)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {isOwn && onRemoveCard && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRemoveCard(card.card_id)
                          }}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
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
  )
}
