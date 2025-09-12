import { useState } from "react";
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

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for albums
  const albums = [
    {
      id: 1,
      name: "Coleção Base Set",
      description: "Cartas clássicas do primeiro set de Pokémon TCG",
      cardsCount: 45,
      totalCards: 102,
      createdAt: "2024-01-15",
      isPublic: true,
      coverCard: "Charizard"
    },
    {
      id: 2,
      name: "Gym Heroes",
      description: "Cartas dos líderes de ginásio",
      cardsCount: 28,
      totalCards: 132,
      createdAt: "2024-02-20",
      isPublic: false,
      coverCard: "Lt. Surge's Raichu"
    },
    {
      id: 3,
      name: "Coleção EX",
      description: "Cartas raras EX e GX",
      cardsCount: 67,
      totalCards: 89,
      createdAt: "2024-03-10",
      isPublic: true,
      coverCard: "Pikachu EX"
    }
  ];

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
          
          <Button variant="hero" size="lg" className="gap-3 w-full lg:w-auto">
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

        {/* Albums Grid */}
        {filteredAlbums.length === 0 ? (
          <Card className="pokemon-card p-12 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Nenhum álbum encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Tente ajustar sua busca" : "Crie seu primeiro álbum para começar"}
            </p>
            <Button variant="hero" className="gap-3">
              <Plus className="w-4 h-4" />
              Criar Álbum
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.map((album) => (
              <Card key={album.id} className="pokemon-card p-6 group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {album.description}
                    </p>
                  </div>
                  {album.isPublic && (
                    <Badge variant="secondary" className="ml-3">
                      <Share2 className="w-3 h-3 mr-1" />
                      Público
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{album.cardsCount}/{album.totalCards} cartas</span>
                    <span>{Math.round((album.cardsCount / album.totalCards) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-primary rounded-full transition-all duration-300"
                      style={{ width: `${(album.cardsCount / album.totalCards) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                  <span>Criado em {new Date(album.createdAt).toLocaleDateString('pt-BR')}</span>
                  <span className="font-medium">{album.coverCard}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="w-4 h-4" />
                    Ver
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;