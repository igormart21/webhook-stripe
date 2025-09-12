import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Share2, ExternalLink, Check } from 'lucide-react'
import logo from '@/assets/logo.png'

interface ShareAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  album: any
}

export const ShareAlbumModal = ({ isOpen, onClose, album }: ShareAlbumModalProps) => {
  const [copied, setCopied] = useState(false)

  if (!album) return null

  const albumUrl = `${window.location.origin}/album/${album.id}`
  const shareText = `Confira minha coleção de cartas Pokémon: ${album.name}`
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(albumUrl)}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(albumUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const shareOnTwitter = () => {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(albumUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${albumUrl}`)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <img 
              src={logo} 
              alt="Pokédex" 
              className="w-12 h-12"
            />
            <DialogTitle className="text-center text-2xl font-bold gradient-text">
              Compartilhar Álbum
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Album Info */}
          <div className="text-center">
            <h3 className="font-bold text-lg">{album.name}</h3>
            {album.description && (
              <p className="text-sm text-muted-foreground mt-1">{album.description}</p>
            )}
            <div className="flex justify-center gap-2 mt-2">
              {album.is_public ? (
                <Badge variant="default">Público</Badge>
              ) : (
                <Badge variant="secondary">Privado</Badge>
              )}
            </div>
          </div>

          {!album.is_public && (
            <Alert>
              <AlertDescription>
                Este álbum é privado. Apenas você pode visualizá-lo. 
                Torne-o público nas configurações para compartilhar.
              </AlertDescription>
            </Alert>
          )}

          {/* Share URL */}
          <div className="space-y-2">
            <Label>Link do Álbum</Label>
            <div className="flex gap-2">
              <Input
                value={albumUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          {album.is_public && (
            <div className="space-y-3">
              <Label>Compartilhar em:</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={shareOnTwitter}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  onClick={shareOnFacebook}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  onClick={shareOnWhatsApp}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(albumUrl, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
