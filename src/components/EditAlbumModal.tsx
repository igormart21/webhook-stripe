import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { albumService } from '@/services/albumService'
import logo from '@/assets/logo.png'

interface EditAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  album: any
  onSuccess?: () => void
}

export const EditAlbumModal = ({ isOpen, onClose, album, onSuccess }: EditAlbumModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados do álbum quando o modal abrir
  useEffect(() => {
    if (isOpen && album) {
      setName(album.name || '')
      setDescription(album.description || '')
      setIsPublic(album.is_public || false)
      setError(null)
    }
  }, [isOpen, album])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Nome do álbum é obrigatório')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await albumService.updateAlbum(album.id, {
        name: name.trim(),
        description: description.trim() || null,
        is_public: isPublic
      })
      
      onSuccess?.()
      onClose()
    } catch (err: any) {
      console.error('Erro ao atualizar álbum:', err)
      setError(err.message || 'Erro ao atualizar álbum')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setName('')
      setDescription('')
      setIsPublic(false)
      setError(null)
      onClose()
    }
  }

  if (!album) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <img 
              src={logo} 
              alt="Pokédex" 
              className="w-12 h-12"
            />
            <DialogTitle className="text-center text-2xl font-bold gradient-text">
              Editar Álbum
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Álbum *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do álbum..."
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva seu álbum..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public">Álbum Público</Label>
                <p className="text-sm text-muted-foreground">
                  Outros usuários poderão ver este álbum
                </p>
              </div>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>

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
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
