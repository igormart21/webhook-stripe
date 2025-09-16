import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Plus, ExternalLink, X, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AddToAlbumModal } from './AddToAlbumModal'
import { useState } from 'react'
import { translateType, translateRarity, translateUI, translateEnergyCost, translateAttackText, translateCardName } from '@/utils/translations'

interface CardPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  card: any
  onToggleFavorite: (cardId: string) => void
  onAddToCollection: (card: any) => void
  isFavorite: boolean
}

const CardPreviewModal = ({ 
  isOpen, 
  onClose, 
  card, 
  onToggleFavorite, 
  onAddToCollection, 
  isFavorite 
}: CardPreviewModalProps) => {
  const { user } = useAuth()
  const [isAddToAlbumOpen, setIsAddToAlbumOpen] = useState(false)

  if (!card || !isOpen) return null

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Fire': return '🔥'
      case 'Water': return '💧'
      case 'Lightning': return '⚡'
      case 'Grass': return '🌿'
      case 'Psychic': return '🔮'
      case 'Fighting': return '👊'
      case 'Darkness': return '🌑'
      case 'Metal': return '⚙️'
      case 'Fairy': return '🧚'
      case 'Dragon': return '🐉'
      case 'Colorless': return '⚪'
      default: return '⭐'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Rare Holo': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 'Rare': return 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
      case 'Uncommon': return 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
      case 'Common': return 'bg-gray-500 text-white'
      default: return 'bg-gray-400 text-white'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">{card.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Image */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={card.images?.large || card.images?.small}
                alt={card.name}
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-card.png'
                }}
              />
              
              {/* Favorite Button */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => onToggleFavorite(card.id)}
              >
                <Heart 
                  className={`h-4 w-4 ${
                    isFavorite ? 'fill-red-500 text-red-500' : ''
                  }`} 
                />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                className="flex-1"
                onClick={() => setIsAddToAlbumOpen(true)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {translateUI('Add to Album')}
              </Button>
              <Button
                variant="outline"
                onClick={() => onAddToCollection(card)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {translateUI('Favorite')}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(card.images?.large, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{card.name}</h3>
                <Badge className={getRarityColor(card.rarity)}>
                  {card.rarity}
                </Badge>
              </div>
              
              {/* Bloco de informações personalizadas */}
              <div className="space-y-1 mt-2">
                {(card.priceMin || card.priceMax) && (
                  <div className="text-green-700 font-semibold text-sm">
                    Preço: {card.priceMin ? `R$${card.priceMin}` : ''}
                    {card.priceMin && card.priceMax ? ' - ' : ''}
                    {card.priceMax ? `R$${card.priceMax}` : ''}
                  </div>
                )}
                {card.condition && (
                  <div className="text-xs text-muted-foreground">Condição: {card.condition}</div>
                )}
                {card.lang && (
                  <div className="text-xs text-muted-foreground">Idioma: {card.lang}</div>
                )}
                {card.set && (
                  <div className="text-xs text-muted-foreground">Coleção: {card.set}</div>
                )}
                {card.quantity > 1 && (
                  <div className="text-xs text-muted-foreground">Quantidade: {card.quantity}</div>
                )}
                {card.notes && (
                  <div className="text-xs text-muted-foreground">{card.notes}</div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Set:</strong> {card.set?.name}</p>
                <p><strong>Number:</strong> #{card.number}</p>
                {card.hp && <p><strong>HP:</strong> {card.hp}</p>}
              </div>
            </div>

            {/* Types */}
            {card.types && card.types.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Types:</h4>
                <div className="flex flex-wrap gap-2">
                  {card.types.map((type: string) => (
                    <Badge key={type} variant="secondary" className="text-sm">
                      {getTypeIcon(type)} {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Attacks */}
            {card.attacks && card.attacks.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Attacks:</h4>
                <div className="space-y-2">
                  {card.attacks.map((attack: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{attack.name}</h5>
                        <div className="flex items-center gap-1">
                          {attack.cost && attack.cost.map((cost: string, i: number) => (
                            <span key={i} className="text-xs bg-gray-200 px-1 rounded">
                              {cost}
                            </span>
                          ))}
                        </div>
                      </div>
                      {attack.damage && (
                        <p className="text-sm text-red-600 font-medium">
                          Damage: {attack.damage}
                        </p>
                      )}
                      {attack.text && (
                        <p className="text-sm text-muted-foreground">
                          {attack.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Abilities */}
            {card.abilities && card.abilities.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Abilities:</h4>
                <div className="space-y-2">
                  {card.abilities.map((ability: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h5 className="font-medium">{ability.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {ability.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses and Resistances */}
            <div className="grid grid-cols-2 gap-4">
              {card.weaknesses && card.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600">Weaknesses:</h4>
                  <div className="space-y-1">
                    {card.weaknesses.map((weakness: any, index: number) => (
                      <p key={index} className="text-sm">
                        {weakness.type} {weakness.value}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {card.resistances && card.resistances.length > 0 && (
                <div>
                  <h4 className="font-semibold text-blue-600">Resistances:</h4>
                  <div className="space-y-1">
                    {card.resistances.map((resistance: any, index: number) => (
                      <p key={index} className="text-sm">
                        {resistance.type} {resistance.value}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Retreat Cost */}
            {card.retreatCost && card.retreatCost.length > 0 && (
              <div>
                <h4 className="font-semibold">Retreat Cost:</h4>
                <div className="flex items-center gap-1">
                  {card.retreatCost.map((cost: string, index: number) => (
                    <span key={index} className="text-xs bg-gray-200 px-1 rounded">
                      {cost}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Flavor Text */}
            {card.flavorText && (
              <div>
                <h4 className="font-semibold">Flavor Text:</h4>
                <p className="text-sm text-muted-foreground italic">
                  {card.flavorText}
                </p>
              </div>
            )}

            {/* Artist */}
            {card.artist && (
              <div>
                <h4 className="font-semibold">Artist:</h4>
                <p className="text-sm text-muted-foreground">
                  {card.artist}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Add to Album Modal */}
      <AddToAlbumModal
        isOpen={isAddToAlbumOpen}
        onClose={() => setIsAddToAlbumOpen(false)}
        card={card}
        onSuccess={() => {
          setIsAddToAlbumOpen(false)
          onClose()
        }}
      />
    </Dialog>
  )
}

export default CardPreviewModal
