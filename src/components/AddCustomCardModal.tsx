import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus } from 'lucide-react';
import { albumService } from '@/services/albumService';
import { ImageUpload } from './ImageUpload';
import { imageUploadService } from '@/services/imageUploadService';

interface AddCustomCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: string;
  onSuccess?: () => void;
}

export const AddCustomCardModal = ({ isOpen, onClose, albumId, onSuccess }: AddCustomCardModalProps) => {
  const [form, setForm] = useState({
    name: '',
    set: '',
    rarity: '',
    lang: '',
    condition: '',
    quantity: 1,
    priceMin: '',
    priceMax: '',
    imageUrl: '',
    notes: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value === '' ? '' : Number(value) }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Permite vazio ou número
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };
  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (value !== '' && !isNaN(Number(value))) {
      setForm((prev) => ({ ...prev, [id]: Number(value).toFixed(2) }));
    }
  };

  const handleImageSelect = async (file: File | null) => {
    setSelectedImage(file);
    if (file) {
      setUploading(true);
      setError(null);
      try {
        const url = await imageUploadService.uploadImage(file, 'album-cards');
        setForm((prev) => ({ ...prev, imageUrl: url }));
      } catch (err: any) {
        setError('Erro ao fazer upload da imagem. Tente novamente.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleClose = () => {
    if (!loading && !uploading) {
      setForm({
        name: '', set: '', rarity: '', lang: '', condition: '', quantity: 1, priceMin: '', priceMax: '', imageUrl: '', notes: ''
      });
      setSelectedImage(null);
      setError(null);
      onClose();
    }
  };

  const handleSave = async () => {
    if (!form.name || (!selectedImage && !isValidImageUrl(form.imageUrl))) {
      setError('Preencha pelo menos o nome e uma imagem (upload ou URL válida).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let imageUrl = form.imageUrl;
      if (selectedImage) {
        imageUrl = await imageUploadService.uploadImage(selectedImage, 'album-cards');
      }
      await albumService.addCustomCardToAlbum(albumId, { ...form, imageUrl });
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar carta.');
    } finally {
      setLoading(false);
    }
  };

  const isValidImageUrl = (url: string | null) =>
    !!url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/'));
  const previewUrl = selectedImage
    ? URL.createObjectURL(selectedImage)
    : (isValidImageUrl(form.imageUrl) ? form.imageUrl : null);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Carta Personalizada</DialogTitle>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="set">Coleção (Set)</Label>
            <Input id="set" value={form.set} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label htmlFor="rarity">Raridade</Label>
              <select id="rarity" value={form.rarity} onChange={handleChange} className="w-full border rounded px-2 py-1">
                <option value=""></option>
                <option>Common</option>
                <option>Uncommon</option>
                <option>Rare</option>
                <option>Holo Rare</option>
                <option>Ultra Rare</option>
                <option>Full Art</option>
                <option>Secret Rare</option>
                <option>Promo</option>
              </select>
            </div>
            <div>
              <Label htmlFor="condition">Condição</Label>
              <select id="condition" value={form.condition} onChange={handleChange} className="w-full border rounded px-2 py-1">
                <option value=""></option>
                <option>NM/M</option>
                <option>LP</option>
                <option>MP</option>
                <option>HP</option>
                <option>D</option>
                <option>Graded</option>
              </select>
            </div>
            <div>
              <Label htmlFor="lang">Idioma</Label>
              <select id="lang" value={form.lang} onChange={handleChange} className="w-full border rounded px-2 py-1">
                <option value=""></option>
                <option>PT-BR</option>
                <option>EN</option>
                <option>JP</option>
                <option>ES</option>
                <option>DE</option>
                <option>FR</option>
                <option>IT</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input id="quantity" type="number" min={1} value={form.quantity} onChange={handleNumberChange} />
            </div>
            <div>
              <Label htmlFor="imageUrl">URL da imagem</Label>
              <Input id="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Cole a URL da imagem ou faça upload" />
            </div>
          </div>
          <div>
            <ImageUpload onImageSelect={handleImageSelect} currentImageUrl={form.imageUrl} disabled={uploading || loading} />
          </div>
          <div>
            {previewUrl
              ? <div className="flex justify-center"><img src={previewUrl} alt="Preview" className="w-auto max-h-44 object-contain rounded border" /></div>
              : <div className="text-xs text-muted-foreground text-center">Preview da imagem aparecerá aqui</div>
            }
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="priceMin">Preço mín (R$)</Label>
              <Input id="priceMin" type="number" min={0} step="0.01" value={form.priceMin} onChange={handlePriceChange} onBlur={handlePriceBlur} />
            </div>
            <div>
              <Label htmlFor="priceMax">Preço máx (R$)</Label>
              <Input id="priceMax" type="number" min={0} step="0.01" value={form.priceMax} onChange={handlePriceChange} onBlur={handlePriceBlur} />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" value={form.notes} onChange={handleChange} rows={2} />
          </div>
        </div>
        <div className="flex gap-3 pt-4 mt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading || uploading} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || uploading || !form.name || (!selectedImage && !isValidImageUrl(form.imageUrl))} className="flex-1 gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
