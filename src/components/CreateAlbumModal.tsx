import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { albumService } from '@/services/albumService'
import { imageUploadService } from '@/services/imageUploadService'
import { ImageUpload } from '@/components/ImageUpload'
import logo from '@/assets/logo.png'

const createAlbumSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  isPublic: z.boolean().default(false)
})

type CreateAlbumFormData = z.infer<typeof createAlbumSchema>

interface CreateAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const CreateAlbumModal = ({ isOpen, onClose, onSuccess }: CreateAlbumModalProps) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<CreateAlbumFormData>({
    resolver: zodResolver(createAlbumSchema),
    defaultValues: {
      isPublic: false
    }
  })

  const isPublic = watch('isPublic')

  const onSubmit = async (data: CreateAlbumFormData) => {
    if (!user) {
      setError('Você precisa estar logado para criar um álbum')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let coverImageUrl: string | null = null

      // Se há uma imagem selecionada, fazer upload primeiro
      if (selectedImage) {
        try {
          console.log('Fazendo upload da imagem...')
          coverImageUrl = await imageUploadService.uploadImage(selectedImage)
          console.log('Upload da imagem bem-sucedido:', coverImageUrl)
        } catch (uploadError) {
          console.warn('Erro no upload da imagem (não crítico):', uploadError)
          // Continuar sem imagem
        }
      }

      // Criar o álbum com ou sem imagem
      const albumData: any = {
        user_id: user.id,
        name: data.name,
        description: data.description || null,
        is_public: data.isPublic
      }

      // Adicionar cover_image_url se disponível
      if (coverImageUrl) {
        albumData.cover_image_url = coverImageUrl
        console.log('Criando álbum com imagem de capa:', albumData)
      } else {
        console.log('Criando álbum sem imagem de capa:', albumData)
      }

      const createdAlbum = await albumService.createAlbum(albumData)
      console.log('Álbum criado com sucesso:', createdAlbum)

      reset()
      setSelectedImage(null)
      onSuccess?.()
      onClose()
    } catch (err: any) {
      console.error('Erro ao criar álbum:', err)
      setError(err.message || 'Erro ao criar álbum. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      reset()
      setError(null)
      setSelectedImage(null)
      onClose()
    }
  }

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
              Criar Novo Álbum
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Álbum *</Label>
            <Input
              id="name"
              placeholder="Ex: Coleção Base Set, Cartas Raras..."
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva seu álbum..."
              rows={3}
              {...register('description')}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <ImageUpload
            onImageSelect={setSelectedImage}
            disabled={isLoading}
            maxSizeMB={5}
            acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
          />

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="isPublic" className="text-base font-medium">
                Álbum Público
              </Label>
              <p className="text-sm text-muted-foreground">
                Outros usuários poderão ver este álbum
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={(checked) => {
                setValue('isPublic', checked)
              }}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Criar Álbum
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
