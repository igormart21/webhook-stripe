import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Share2, 
  Edit3, 
  Trash2, 
  Eye,
  Grid3X3,
  Calendar,
  BarChart3
} from "lucide-react";
import Header from "@/components/Header";
import { CreateAlbumModal } from "@/components/CreateAlbumModal";
import { EditAlbumModal } from "@/components/EditAlbumModal";
import { ShareAlbumModal } from "@/components/ShareAlbumModal";
import { albumService } from "@/services/albumService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [albums, setAlbums] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se o usuário está logado
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Se não há usuário, não renderizar nada (será redirecionado)
  if (!user) {
    return null;
  }

  // Carregar álbuns do usuário
  useEffect(() => {
    const loadAlbums = async () => {
      console.log('Carregando álbuns...', { user: user?.id });
      
      if (!user) {
        console.log('Usuário não logado, usando dados mock');
        setAlbums([
    {
      id: 1,
      name: "Coleção Base Set",
      description: "Cartas clássicas do primeiro set de Pokémon TCG",
      cardsCount: 45,
      totalCards: 102,
            created_at: "2024-01-15",
            is_public: true,
      coverCard: "Charizard"
          }
        ]);
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando álbuns do usuário:', user.id);
        const userAlbums = await albumService.getUserAlbums(user.id);
        console.log('Álbuns encontrados:', userAlbums);
        console.log('Verificando cover_image_url nos álbuns:', userAlbums.map(a => ({ id: a.id, name: a.name, cover_image_url: (a as any).cover_image_url })));
        
        // Carregar contagem de cartas para cada álbum
        const albumsWithCounts = await Promise.all(
          userAlbums.map(async (album) => {
            try {
              const albumCards = await albumService.getAlbumCards(album.id);
              return {
                ...album,
                cardsCount: albumCards.length,
                totalCards: albumCards.length // Por enquanto, usar o mesmo valor
              };
            } catch (error) {
              console.error(`Erro ao carregar cartas do álbum ${album.id}:`, error);
              return {
                ...album,
                cardsCount: 0,
                totalCards: 0
              };
            }
          })
        );
        
        setAlbums(albumsWithCounts);
      } catch (error) {
        console.error('Erro ao carregar álbuns:', error);
        // Em caso de erro, usar dados mock temporariamente
        setAlbums([
          {
            id: 1,
            name: "Coleção Base Set",
            description: "Cartas clássicas do primeiro set de Pokémon TCG",
            cardsCount: 45,
            totalCards: 102,
            created_at: "2024-01-15",
            is_public: true,
            coverCard: "Charizard"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
  }, [user]);


  const handleCreateAlbum = () => {
    setIsCreateModalOpen(true);
  };

  const handleAlbumCreated = () => {
    // Recarregar álbuns após criação
    if (user) {
      albumService.getUserAlbums(user.id).then(setAlbums).catch(console.error);
    }
  };

  const handleEditAlbum = (album: any) => {
    setSelectedAlbum(album);
    setIsEditModalOpen(true);
  };

  const handleShareAlbum = (album: any) => {
    setSelectedAlbum(album);
    setIsShareModalOpen(true);
  };

  const handleAlbumUpdated = () => {
    // Recarregar álbuns após edição
    if (user) {
      albumService.getUserAlbums(user.id).then(setAlbums).catch(console.error);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    if (confirm('Tem certeza que deseja deletar este álbum? Esta ação não pode ser desfeita.')) {
      try {
        await albumService.deleteAlbum(albumId);
        // Recarregar álbuns após deleção
        if (user) {
          const updatedAlbums = await albumService.getUserAlbums(user.id);
          setAlbums(updatedAlbums);
        }
      } catch (error) {
        console.error('Erro ao deletar álbum:', error);
        alert('Erro ao deletar álbum. Tente novamente.');
      }
    }
  };

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };


  const filteredAlbums = albums.filter(album => 
    album.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header currentPage="dashboard" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              Meus Álbuns
            </h1>
            <p className="text-muted-foreground">
              Gerencie sua coleção de cartas Pokémon TCG
            </p>
          </div>
          <Button 
            variant="hero" 
            size="lg" 
            className="gap-3 w-full lg:w-auto"
            onClick={handleCreateAlbum}
          >
            <Plus className="w-5 h-5" />
            Criar Novo Álbum
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="pokemon-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{albums.length}</p>
                <p className="text-sm text-muted-foreground">Álbuns</p>
              </div>
            </div>
          </Card>

          <Card className="pokemon-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {albums.reduce((acc, album) => acc + album.cardsCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Cartas Coletadas</p>
              </div>
            </div>
          </Card>

          <Card className="pokemon-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {albums.filter(album => album.isPublic).length}
                </p>
                <p className="text-sm text-muted-foreground">Públicos</p>
              </div>
            </div>
          </Card>

          <Card className="pokemon-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {Math.round((albums.reduce((acc, album) => acc + album.cardsCount, 0) / albums.reduce((acc, album) => acc + album.totalCards, 0)) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Completude</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar álbuns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              Data
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Progresso
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando álbuns...</p>
          </div>
        )}

        {/* Albums Grid */}
        {!loading && filteredAlbums.length === 0 ? (
          <Card className="pokemon-card p-12 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Nenhum álbum encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Tente ajustar sua busca" : "Crie seu primeiro álbum para começar"}
            </p>
            <Button variant="hero" className="gap-3" onClick={handleCreateAlbum}>
              <Plus className="w-4 h-4" />
              Criar Álbum
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.map((album) => (
              <Card key={album.id} className="pokemon-card p-6 group cursor-pointer" onClick={() => handleAlbumClick(album.id)}>
                {/* Imagem de capa do álbum */}
                {(album as any).cover_image_url ? (
                  <div className="mb-4">
                    <img
                      src={(album as any).cover_image_url}
                      alt={`Capa do álbum ${album.name}`}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        console.log('Erro ao carregar imagem de capa:', (album as any).cover_image_url)
                        e.currentTarget.style.display = 'none'
                      }}
                      onLoad={() => {
                        console.log('Imagem de capa carregada com sucesso:', (album as any).cover_image_url)
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center border">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Sem imagem de capa
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {album.description}
                    </p>
                  </div>
                  {album.is_public && (
                    <Badge variant="secondary" className="ml-3">
                      <Share2 className="w-3 h-3 mr-1" />
                      Público
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{album.cardsCount || 0} cartas</span>
                    <span>{album.cardsCount > 0 ? '100%' : '0%'}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-primary rounded-full transition-all duration-300"
                      style={{ width: album.cardsCount > 0 ? '100%' : '0%' }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                  <span>Criado em {new Date(album.created_at).toLocaleDateString('pt-BR')}</span>
                  <span className="font-medium">{album.cardsCount > 0 ? `${album.cardsCount} cartas` : 'Vazio'}</span>
                </div>

                <div className="flex gap-2">
                  <Link to={`/album/${album.id}`}>
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={(e) => e.stopPropagation()}>
                    <Eye className="w-4 h-4" />
                    Ver
                  </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={(e) => { e.stopPropagation(); handleEditAlbum(album); }}>
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={(e) => { e.stopPropagation(); handleShareAlbum(album); }}>
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create Album Modal */}
      <CreateAlbumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleAlbumCreated}
      />

      {/* Edit Album Modal */}
      <EditAlbumModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        album={selectedAlbum}
        onSuccess={handleAlbumUpdated}
      />

      {/* Share Album Modal */}
      <ShareAlbumModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        album={selectedAlbum}
      />

    </div>
  );
};

export default Dashboard;