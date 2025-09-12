import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Heart, Plus, ExternalLink } from 'lucide-react'
import { pokemonApiService } from '@/services/pokemonApi'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CardPreviewModal from '@/components/CardPreviewModal'

const Cards = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()

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

  const loadPopularCards = async () => {
    setLoading(true)
    try {
      const response = await pokemonApiService.getCards({
        pageSize: 24
      })
      setCards(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar cartas:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchCards = async () => {
    if (!searchQuery.trim()) {
      loadPopularCards()
      return
    }
    
    setLoading(true)
    try {
      const response = await pokemonApiService.getCards({
        name: searchQuery,
        pageSize: 24
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

  const addToCollection = (card: any) => {
    if (!user) {
      alert('Faça login para adicionar à sua coleção!')
      return
    }
    
    alert(`Carta ${card.name} adicionada à sua coleção!`)
  }

  const openCardPreview = (card: any) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  const closeCardPreview = () => {
    setIsModalOpen(false)
    setSelectedCard(null)
  }

  return (
    <div className="min-h-screen">
      <Header currentPage="cards" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Cartas Pokémon TCG
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore nossa vasta coleção de cartas Pokémon e encontre as suas favoritas
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Buscar Cartas Pokémon
            </h2>
            <div className="flex space-x-2">
              <Input
                placeholder="Busque por nome (ex: Pikachu, Charizard, Mewtwo)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchCards()}
                className="flex-1"
              />
              <Button onClick={searchCards} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
              <Button variant="outline" onClick={loadPopularCards} disabled={loading}>
                Ver Todas
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {cards.length} cartas encontradas
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando cartas...</p>
          </div>
        )}

        {/* Cards Display */}
        {!loading && cards.length > 0 && (
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
                      <h3 className="font-bold text-lg line-clamp-1">{card.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {card.set?.name} • #{card.number}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {card.types && card.types.map((type: string) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {card.rarity && (
                        <Badge variant="outline" className="text-xs">
                          {card.rarity}
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
                        onClick={() => addToCollection(card)}
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

      </div>

      <Footer />

      {/* Card Preview Modal */}
      <CardPreviewModal
        isOpen={isModalOpen}
        onClose={closeCardPreview}
        card={selectedCard}
        onToggleFavorite={toggleFavorite}
        onAddToCollection={addToCollection}
        isFavorite={selectedCard ? favorites.includes(selectedCard.id) : false}
      />
    </div>
  )
}

export default Cards
