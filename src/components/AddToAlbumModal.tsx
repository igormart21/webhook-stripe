import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, BookOpen, Plus, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { albumService } from '@/services/albumService'
import logo from '@/assets/logo.png'

interface AddToAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  card: any
  onSuccess?: () => void
}

export const AddToAlbumModal = ({ isOpen, onClose, card, onSuccess }: AddToAlbumModalProps) => {
  const [albums, setAlbums] = useState<any[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Carregar álbuns do usuário
  useEffect(() => {
    const loadAlbums = async () => {
      if (!user) return

      try {
        const userAlbums = await albumService.getUserAlbums(user.id)
        setAlbums(userAlbums)
      } catch (error) {
        console.error('Erro ao carregar álbuns:', error)
        setError('Erro ao carregar álbuns')
      }
    }

    if (isOpen && user) {
      loadAlbums()
    }
  }, [isOpen, user])

  const filteredAlbums = albums.filter(album =>
    album.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddToAlbum = async () => {
    if (!selectedAlbum || !card) {
      setError('Selecione um álbum')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await albumService.addCardToAlbum(selectedAlbum, card.id, quantity, notes || undefined)
      onSuccess?.()
      onClose()
    } catch (err: any) {
      console.error('Erro ao adicionar carta ao álbum:', err)
      setError(err.message || 'Erro ao adicionar carta ao álbum')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setSelectedAlbum('')
      setQuantity(1)
      setNotes('')
      setSearchTerm('')
      setError(null)
      onClose()
    }
  }

  if (!card) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border">
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

        <div className="space-y-6">
          {/* Card Info */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={card.images?.small || card.images?.large}
                alt={card.name}
                className="w-16 h-20 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-card.png'
                }}
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{card.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {card.set?.name} • #{card.number}
                </p>
                {card.types && (
                  <div className="flex gap-1 mt-2">
                    {card.types.map((type: string) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Album Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Buscar Álbum</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Digite o nome do álbum..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Selecione um Álbum</Label>
              <div className="grid gap-2 mt-2 max-h-48 overflow-y-auto">
                {filteredAlbums.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-8 h-8 mx-auto mb-2" />
                    <p>Nenhum álbum encontrado</p>
                    <p className="text-sm">Crie um álbum primeiro</p>
                  </div>
                ) : (
                  filteredAlbums.map((album) => (
                    <Card
                      key={album.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedAlbum === album.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedAlbum(album.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{album.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {album.description || 'Sem descrição'}
                          </p>
                        </div>
                        {album.is_public && (
                          <Badge variant="secondary" className="text-xs">
                            Público
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quantity and Notes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Adicione uma nota sobre esta carta..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddToAlbum}
              disabled={loading || !selectedAlbum}
              className="flex-1 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Adicionar ao Álbum
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
