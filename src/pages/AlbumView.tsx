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
  Shield
} from "lucide-react";
import Header from "@/components/Header";
import { albumService } from "@/services/albumService";
import { useAuth } from "@/contexts/AuthContext";
import { AlbumCardGrid } from "@/components/AlbumCardGrid";
import { ShareAlbumModal } from "@/components/ShareAlbumModal";
import { EditAlbumModal } from "@/components/EditAlbumModal";

const AlbumView = () => {
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [albumData, setAlbumData] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();

  // Carregar dados do álbum
  useEffect(() => {
    const loadAlbum = async () => {
      if (!id) return;

      try {
        const album = await albumService.getAlbumById(id);
        if (album) {
          setAlbumData({
            ...album,
            isOwn: user?.id === album.user_id,
            cardsCount: 0, // Será calculado quando carregarmos as cartas
            totalCards: 0
          });

          // Carregar cartas do álbum
          const albumCards = await albumService.getAlbumCards(id);
          console.log('Cartas do álbum:', albumCards);
          setCards(albumCards);
        }
      } catch (error) {
        console.error('Erro ao carregar álbum:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlbum();
  }, [id, user]);

  // Filtrar cartas baseado na busca
  const filteredCards = cards.filter(card => 
    card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        if (album) {
          setAlbumData({
            ...album,
            isOwn: user?.id === album.user_id,
            cardsCount: cards.length,
            totalCards: cards.length
          });
        }
      } catch (error) {
        console.error('Erro ao recarregar álbum:', error);
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

        {/* Album Header */}
        <Card className="pokemon-card p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold gradient-text">
                  {albumData.name}
                </h1>
                {albumData.is_public && (
                  <Badge variant="secondary" className="gap-1">
                    <Share2 className="w-3 h-3" />
                    Público
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {albumData.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Criado em {new Date(albumData.created_at).toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span>{cards.length} cartas</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="gap-2" onClick={handleShareAlbum}>
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

          {/* Progress Bar */}
          <Separator className="my-6" />
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progresso da Coleção</span>
              <span>{albumData.cardsCount}/{albumData.totalCards}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="h-3 bg-gradient-primary rounded-full transition-all duration-300 shadow-glow"
                style={{ width: `${(albumData.cardsCount / albumData.totalCards) * 100}%` }}
              />
            </div>
          </div>
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
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>

          <div className="flex gap-3">
            {albumData.isOwn && (
              <Button variant="hero" className="gap-2">
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

        {/* Cards Display */}
        <AlbumCardGrid 
          cards={cards}
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
    </div>
  );
};

export default AlbumView;