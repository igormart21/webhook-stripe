import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus } from 'lucide-react';
import { albumService } from '@/services/albumService';
import React from 'react'; // Added missing import

interface EditApiCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: string;
  card: any;
  onSuccess?: () => void;
}

export const EditApiCardModal = ({ isOpen, onClose, albumId, card, onSuccess }: EditApiCardModalProps) => {
  const [form, setForm] = useState({
    name: card?.name || '',
    set: '',
    rarity: card?.rarity || '',
    lang: '',
    condition: '',
    quantity: 1,
    priceMin: '',
    priceMax: '',
    imageUrl: card?.images?.large || card?.images?.small || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Atualizar form se card mudar
  // (para evitar stale state ao abrir para cartas diferentes)
  React.useEffect(() => {
    setForm({
      name: card?.name || '',
      set: '',
      rarity: card?.rarity || '',
      lang: '',
      condition: '',
      quantity: 1,
      priceMin: '',
      priceMax: '',
      imageUrl: card?.images?.large || card?.images?.small || '',
      notes: '',
    });
  }, [card]);

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

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.imageUrl) {
      setError('Preencha pelo menos o nome.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await albumService.addCustomCardToAlbum(albumId, form);
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar carta.');
    } finally {
      setLoading(false);
    }
  };

  const isImageValid = form.imageUrl && (form.imageUrl.startsWith('http://') || form.imageUrl.startsWith('https://') || form.imageUrl.startsWith('data:image/'));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Carta Personalizada</DialogTitle>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-3">
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
              <Label>Imagem</Label>
              {isImageValid && (
                <div className="flex justify-center">
                  <img src={form.imageUrl} alt="Preview" className="w-32 h-44 object-contain rounded border" />
                </div>
              )}
            </div>
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
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || !form.name || !isImageValid} className="flex-1 gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
