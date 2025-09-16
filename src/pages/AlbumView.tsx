import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Grid3X3, 
  List, 
  Filter,
  Share2,
  Edit3,
  Star,
  Zap,
  Shield,
  X,
  Calendar,
  User,
  Eye,
  Heart,
  BarChart3,
  Trophy,
  Sparkles
} from "lucide-react";
import Header from "@/components/Header";
import { albumService } from "@/services/albumService";
import { useAuth } from "@/contexts/AuthContext";
import { AlbumCardGrid } from "@/components/AlbumCardGrid";
import { ShareAlbumModal } from "@/components/ShareAlbumModal";
import { EditAlbumModal } from "@/components/EditAlbumModal";
import { AddCardToAlbumModal } from "@/components/AddCardToAlbumModal";

const AlbumView = () => {
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [albumData, setAlbumData] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddToAlbumOpen, setIsAddToAlbumOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [filterRarity, setFilterRarity] = useState<string>('');
  const { user } = useAuth();

  // Carregar dados do álbum
  useEffect(() => {
    const loadAlbum = async () => {
      if (!id) return;

      try {
        const album = await albumService.getAlbumById(id);
        if (album) {
          // Verificar se o álbum é público ou se o usuário é o dono
          if (!album.is_public && user?.id !== album.user_id) {
            // Álbum privado e usuário não é o dono - redirecionar
            window.location.href = '/';
            return;
          }

          // Carregar cartas do álbum
          const albumCards = await albumService.getAlbumCards(id);
          console.log('Cartas do álbum:', albumCards);
          setCards(albumCards);

          setAlbumData({
            ...album,
            isOwn: user?.id === album.user_id,
            cardsCount: albumCards.length,
            totalCards: albumCards.length
          });
        }
      } catch (error) {
        console.error('Erro ao carregar álbum:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlbum();
  }, [id, user]);

  // Filtrar cartas baseado na busca e filtros
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.card_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Aqui você pode adicionar mais filtros baseados nos detalhes da carta
    // Por enquanto, apenas o filtro de busca está implementado
    return matchesSearch;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Holo Rare': return 'bg-gradient-accent';
      case 'Rare': return 'bg-gradient-secondary';
      default: return 'bg-gradient-primary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Electric': return <Zap className="w-4 h-4" />;
      case 'Psychic': return <Star className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    if (!id || !confirm('Tem certeza que deseja remover esta carta do álbum?')) return;
    
    try {
      await albumService.removeCardFromAlbum(id, cardId);
      // Recarregar cartas
      const albumCards = await albumService.getAlbumCards(id);
      setCards(albumCards);
    } catch (error) {
      console.error('Erro ao remover carta:', error);
      alert('Erro ao remover carta');
    }
  };

  const handleEditAlbum = () => {
    setIsEditModalOpen(true);
  };

  const handleShareAlbum = () => {
    setIsShareModalOpen(true);
  };

  const handleAlbumUpdated = async () => {
    // Recarregar dados do álbum
    if (id) {
      try {
        const album = await albumService.getAlbumById(id);
        const albumCards = await albumService.getAlbumCards(id);
        if (album) {
          setAlbumData({
            ...album,
            isOwn: user?.id === album.user_id,
            cardsCount: albumCards.length,
            totalCards: albumCards.length
          });
          setCards(albumCards);
        }
      } catch (error) {
        console.error('Erro ao recarregar álbum:', error);
      }
    }
  };

  const handleAddCardSuccess = async () => {
    // Recarregar cartas do álbum
    if (id) {
      try {
        const albumCards = await albumService.getAlbumCards(id);
        setCards(albumCards);
        // Atualizar contador de cartas
        setAlbumData(prev => ({
          ...prev,
          cardsCount: albumCards.length,
          totalCards: albumCards.length
        }));
      } catch (error) {
        console.error('Erro ao recarregar cartas:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header currentPage="album" />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando álbum...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!albumData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header currentPage="album" />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Álbum não encontrado</h1>
            <p className="text-muted-foreground mb-6">O álbum que você está procurando não existe ou foi removido.</p>
            <Link to="/dashboard">
              <Button variant="hero">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Álbuns
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header currentPage="album" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar aos Álbuns
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">{albumData.name}</span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-8">
          {/* Background com imagem de capa ou gradiente */}
          {(albumData as any).cover_image_url ? (
            <div className="relative h-64 md:h-80">
              <img
                src={(albumData as any).cover_image_url}
                alt={`Capa do álbum ${albumData.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-64 md:h-80 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-primary/60 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {albumData.name}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {albumData.description}
                </p>
              </div>
            </div>
          )}
          
          {/* Conteúdo sobreposto */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {albumData.name}
                  </h1>
                  {albumData.is_public && (
                    <Badge variant="secondary" className="gap-1 bg-white/20 text-white border-white/30">
                    <Share2 className="w-3 h-3" />
                    Público
                  </Badge>
                )}
              </div>
              
                <p className="text-white/90 mb-4 leading-relaxed drop-shadow-md">
                {albumData.description}
              </p>
              
                <div className="flex flex-wrap gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Criado em {new Date(albumData.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    {cards.length} cartas
                  </span>
              </div>
            </div>

              <div className="flex gap-3">
                <Button variant="outline" className="gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30" onClick={handleShareAlbum}>
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
                {albumData.isOwn && (
                  <Button variant="hero" className="gap-2" onClick={handleEditAlbum}>
                  <Edit3 className="w-4 h-4" />
                  Editar Álbum
                </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas do Álbum */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="pokemon-card p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">{cards.length}</p>
            <p className="text-sm text-muted-foreground">Cartas</p>
          </Card>
          
          <Card className="pokemon-card p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-secondary rounded-lg mx-auto mb-3">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {Math.round((cards.length / Math.max(albumData.totalCards, 1)) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">Completude</p>
          </Card>
          
          <Card className="pokemon-card p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-accent rounded-lg mx-auto mb-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {albumData.is_public ? 'Público' : 'Privado'}
            </p>
            <p className="text-sm text-muted-foreground">Visibilidade</p>
          </Card>
          
          <Card className="pokemon-card p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {new Date(albumData.created_at).toLocaleDateString('pt-BR', { month: 'short' })}
            </p>
            <p className="text-sm text-muted-foreground">Criado</p>
          </Card>
        </div>

        {/* Progress Bar Melhorado */}
        <Card className="pokemon-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Progresso da Coleção
            </h3>
            <span className="text-sm text-muted-foreground">
              {cards.length} de {albumData.totalCards} cartas
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div 
              className="h-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500 shadow-glow relative"
              style={{ width: `${Math.min((cards.length / Math.max(albumData.totalCards, 1)) * 100, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {cards.length === 0 ? 'Comece adicionando cartas ao seu álbum!' : 
             cards.length === albumData.totalCards ? 'Parabéns! Coleção completa!' :
             `Faltam ${albumData.totalCards - cards.length} cartas para completar`}
          </p>
        </Card>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>

          <div className="flex gap-3">
            {albumData.isOwn && (
              <Button variant="hero" className="gap-2" onClick={() => setIsAddToAlbumOpen(true)}>
                <Plus className="w-4 h-4" />
                Adicionar Carta
              </Button>
            )}
            <div className="flex rounded-lg border border-border">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filtros</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="w-4 h-4" />
              </Button>
                      </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Tipo:</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Fire">Fogo</option>
                  <option value="Water">Água</option>
                  <option value="Lightning">Elétrico</option>
                  <option value="Grass">Planta</option>
                  <option value="Psychic">Psíquico</option>
                  <option value="Fighting">Lutador</option>
                  <option value="Darkness">Sombrio</option>
                  <option value="Metal">Metal</option>
                  <option value="Fairy">Fada</option>
                  <option value="Dragon">Dragão</option>
                  <option value="Colorless">Incolor</option>
                </select>
                        </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Raridade:</label>
                <select 
                  value={filterRarity}
                  onChange={(e) => setFilterRarity(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="">Todas</option>
                  <option value="Common">Comum</option>
                  <option value="Uncommon">Incomum</option>
                  <option value="Rare">Raro</option>
                  <option value="Rare Holo">Raro Holo</option>
                </select>
                    </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFilterType('');
                  setFilterRarity('');
                }}
              >
                Limpar Filtros
              </Button>
                  </div>
              </Card>
        )}

        {/* Cards Display */}
        <AlbumCardGrid 
          cards={filteredCards}
          onRemoveCard={albumData.isOwn ? handleRemoveCard : undefined}
          isOwn={albumData.isOwn}
        />
      </main>

      {/* Share Album Modal */}
      <ShareAlbumModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        album={albumData}
      />

      {/* Edit Album Modal */}
      <EditAlbumModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        album={albumData}
        onSuccess={handleAlbumUpdated}
      />

      {/* Add Card to Album Modal */}
      <AddCardToAlbumModal
        isOpen={isAddToAlbumOpen}
        onClose={() => setIsAddToAlbumOpen(false)}
        albumId={id || ''}
        onSuccess={handleAddCardSuccess}
      />
    </div>
  );
};

export default AlbumView;