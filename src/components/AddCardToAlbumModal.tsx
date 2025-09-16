import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, BookOpen, Plus, Search, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { albumService } from '@/services/albumService'
import { pokemonApiService } from '@/services/pokemonApi'
import { translateType, translateRarity, translateCardName } from '@/utils/translations'
import logo from '@/assets/logo.png'
import { AddCustomCardModal } from './AddCustomCardModal';
import { EditApiCardModal } from './EditApiCardModal';

interface AddCardToAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  albumId: string
  onSuccess?: () => void
}

export const AddCardToAlbumModal = ({ isOpen, onClose, albumId, onSuccess }: AddCardToAlbumModalProps) => {
  const [cards, setCards] = useState<any[]>([])
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingCards, setLoadingCards] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showEditApiModal, setShowEditApiModal] = useState(false);

  // Carregar cartas populares quando o modal abrir
  useEffect(() => {
    const loadCards = async () => {
      if (!isOpen) return

      setLoadingCards(true)
      setError(null)

      try {
        console.log('🟢 Carregando cartas para adicionar ao álbum...')
        const response = await pokemonApiService.getCards({ pageSize: 20 })
        setCards(response.data)
        console.log('✅ Cartas carregadas:', response.data.length)
      } catch (error) {
        console.error('❌ Erro ao carregar cartas:', error)
        setError('Erro ao carregar cartas')
      } finally {
        setLoadingCards(false)
      }
    }

    loadCards()
  }, [isOpen])

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddToAlbum = async () => {
    if (!selectedCard || !albumId) {
      setError('Selecione uma carta')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('🟢 Adicionando carta ao álbum:', {
        albumId,
        cardId: selectedCard.id,
        cardName: selectedCard.name,
        quantity,
        notes,
        user: user?.id
      })

      await albumService.addCardToAlbum(albumId, selectedCard.id, quantity, notes || undefined)
      console.log('✅ Carta adicionada com sucesso!')
      
      onSuccess?.()
      onClose()
    } catch (err: any) {
      console.error('❌ Erro ao adicionar carta ao álbum:', err)
      setError(err.message || 'Erro ao adicionar carta ao álbum')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomSuccess = () => {
    setShowCustomModal(false);
    onSuccess?.();
    onClose();
  };

  const handleCardSelect = (card: any) => {
    setSelectedCard(card);
    setShowEditApiModal(true);
  };
  const handleEditApiSuccess = () => {
    setShowEditApiModal(false);
    setSelectedCard(null);
    onSuccess?.();
    onClose();
  };
  const handleEditApiClose = () => {
    setShowEditApiModal(false);
    setSelectedCard(null);
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedCard(null)
      setQuantity(1)
      setNotes('')
      setSearchTerm('')
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <img 
              src={logo} 
              alt="Pokédex" 
              className="w-12 h-12"
            />
            <DialogTitle className="text-center text-2xl font-bold gradient-text">
              Adicionar Carta ao Álbum
            </DialogTitle>
          </div>
        </DialogHeader>
        <AddCustomCardModal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          albumId={albumId}
          onSuccess={handleCustomSuccess}
        />
        {selectedCard && (
          <EditApiCardModal
            isOpen={showEditApiModal}
            onClose={handleEditApiClose}
            albumId={albumId}
            card={selectedCard}
            onSuccess={handleEditApiSuccess}
          />
        )}
        <div className="flex flex-col h-full max-h-[70vh]">
          <Button
            variant="secondary"
            className="mb-4 self-end"
            onClick={() => setShowCustomModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Adicionar Carta Manualmente
          </Button>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cartas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Cards Grid */}
          <div className="flex-1 overflow-y-auto">
            {loadingCards ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando cartas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCards.map((card) => (
                  <Card 
                    key={card.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg`}
                    onClick={() => handleCardSelect(card)}
                  >
                    <CardContent className="p-3">
                      <div className="aspect-[3/4] mb-3">
                        <img
                          src={card.images?.small || card.images?.large}
                          alt={translateCardName(card.name)}
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {translateCardName(card.name)}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {card.types?.slice(0, 2).map((type: string) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {translateType(type)}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {translateRarity(card.rarity)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
