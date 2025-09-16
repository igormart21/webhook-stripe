import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Heart, Plus, ExternalLink } from 'lucide-react'
import { pokemonApiService } from '@/services/pokemonApi'
import { useAuth } from '@/contexts/AuthContext'
import CardPreviewModal from '@/components/CardPreviewModal'
import { translateType, translateRarity, translateCardName } from '@/utils/translations'
import { EditApiCardModal } from '@/components/EditApiCardModal';

const CardSearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showEditApiModal, setShowEditApiModal] = useState(false);
  const [selectedCardToAdd, setSelectedCardToAdd] = useState<any>(null);
  const { user } = useAuth()

  const loadPopularCards = async () => {
    setLoading(true)
    try {
      const response = await pokemonApiService.getCards({
        pageSize: 12
      })
      setCards(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar cartas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Carregar cartas populares ao inicializar
  useEffect(() => {
    const loadInitialCards = async () => {
      try {
        await loadPopularCards()
      } catch (error) {
        console.error('Erro ao carregar cartas iniciais:', error)
      }
    }
    
    loadInitialCards()
  }, [])

  const searchCards = async () => {
    if (!searchQuery.trim()) {
      loadPopularCards()
      return
    }
    
    setLoading(true)
    try {
      const response = await pokemonApiService.getCards({
        name: searchQuery,
        pageSize: 20
      })
      setCards(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar cartas:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (cardId: string) => {
    if (!user) {
      alert('Faça login para adicionar aos favoritos!')
      return
    }
    
    setFavorites(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    )
  }

  const handleAddToAlbum = (card: any) => {
    if (!user) {
      alert('Faça login para adicionar à sua coleção!');
      return;
    }
    setSelectedCardToAdd(card);
    setShowEditApiModal(true);
  };
  const handleEditApiSuccess = () => {
    setShowEditApiModal(false);
    setSelectedCardToAdd(null);
    // Opcional: mostrar toast de sucesso
  };
  const handleEditApiClose = () => {
    setShowEditApiModal(false);
    setSelectedCardToAdd(null);
  };

  const openCardPreview = (card: any) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  const closeCardPreview = () => {
    setIsModalOpen(false)
    setSelectedCard(null)
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Explore Cartas Pokémon
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra e colete cartas incríveis do universo Pokémon TCG
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex space-x-2">
            <Input
              placeholder="Busque por nome (ex: Pikachu, Charizard, Mewtwo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchCards()}
              className="text-lg py-3"
            />
            <Button 
              onClick={searchCards} 
              disabled={loading}
              size="lg"
              className="px-8"
            >
              <Search className="h-5 w-5 mr-2" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              onClick={loadPopularCards} 
              disabled={loading}
            >
              Ver Cartas Populares
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        {cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card) => (
              <Card key={card.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                <div className="relative">
                  <img
                    src={card.images?.small || card.images?.large}
                    alt={card.name}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => openCardPreview(card)}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-card.png'
                    }}
                  />
                  
                  {/* Favorite Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(card.id)
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(card.id) ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1">{translateCardName(card.name)}</h3>
                      {card.set?.name && (
                        <p className="text-sm text-muted-foreground">{card.set.name} • #{card.number}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {card.types && card.types.map((type: string) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {translateType(type)}
                        </Badge>
                      ))}
                      {card.rarity && (
                        <Badge variant="outline" className="text-xs">
                          {translateRarity(card.rarity)}
                        </Badge>
                      )}
                    </div>

                    {card.hp && (
                      <div className="text-sm">
                        <span className="font-medium">HP: </span>
                        <span className="text-primary font-bold">{card.hp}</span>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToAlbum(card)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(card.images?.large, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && cards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">Nenhuma carta encontrada</h3>
            <p className="text-muted-foreground">
              Tente buscar por outro nome ou explore as cartas populares
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando cartas...</p>
          </div>
        )}
      </div>

      {/* Card Preview Modal */}
      <CardPreviewModal
        isOpen={isModalOpen}
        onClose={closeCardPreview}
        card={selectedCard}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedCard ? favorites.includes(selectedCard.id) : false}
      />
      {showEditApiModal && selectedCardToAdd && (
        <EditApiCardModal
          isOpen={showEditApiModal}
          onClose={handleEditApiClose}
          albumId={user?.id || ''} // ou passe o albumId correto se necessário
          card={selectedCardToAdd}
          onSuccess={handleEditApiSuccess}
        />
      )}
    </section>
  )
}

export default CardSearchSection
