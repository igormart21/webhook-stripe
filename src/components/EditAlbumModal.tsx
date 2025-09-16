import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, X } from 'lucide-react'
import { albumService } from '@/services/albumService'
import { imageUploadService } from '@/services/imageUploadService'
import { ImageUpload } from '@/components/ImageUpload'
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)

  // Carregar dados do álbum quando o modal abrir
  useEffect(() => {
    if (isOpen && album) {
      setName(album.name || '')
      setDescription(album.description || '')
      setIsPublic(album.is_public || false)
      setCurrentImageUrl(album.cover_image_url || null)
      setSelectedImage(null)
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
      let coverImageUrl = currentImageUrl

      // Se há uma nova imagem selecionada, fazer upload
      if (selectedImage) {
        try {
          console.log('Fazendo upload da nova imagem...')
          coverImageUrl = await imageUploadService.uploadImage(selectedImage)
          console.log('Upload da nova imagem bem-sucedido:', coverImageUrl)
        } catch (uploadError) {
          console.warn('Erro no upload da nova imagem (não crítico):', uploadError)
          // Continuar com a imagem atual se upload falhar
        }
      }

      // Atualizar o álbum com ou sem imagem
      const updateData: any = {
        name: name.trim(),
        description: description.trim() || null,
        is_public: isPublic
      }

      // Adicionar cover_image_url se disponível
      if (coverImageUrl) {
        updateData.cover_image_url = coverImageUrl
      }

      console.log('Atualizando álbum com dados:', updateData)
      await albumService.updateAlbum(album.id, updateData)
      
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
      setSelectedImage(null)
      setCurrentImageUrl(null)
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

            {/* Upload de nova imagem de capa */}
            <div>
              <Label>Imagem de Capa</Label>
              {currentImageUrl && !selectedImage && (
                <div className="mt-2 mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Imagem atual:</p>
                  <div className="relative inline-block">
                    <img
                      src={currentImageUrl}
                      alt="Imagem atual do álbum"
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        console.log('Erro ao carregar imagem atual:', currentImageUrl)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => {
                        setCurrentImageUrl(null)
                        setSelectedImage(null)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              <ImageUpload
                onImageSelect={setSelectedImage}
                currentImageUrl={currentImageUrl}
                disabled={loading}
                maxSizeMB={5}
                acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
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
