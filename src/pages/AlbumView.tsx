import { useState } from "react";
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

const AlbumView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for album cards
  const albumData = {
    name: "Coleção Base Set",
    description: "Cartas clássicas do primeiro set de Pokémon TCG de 1998",
    owner: "TrainerAsh",
    createdAt: "2024-01-15",
    isOwn: true,
    isPublic: true,
    cardsCount: 45,
    totalCards: 102
  };

  const cards = [
    {
      id: 1,
      name: "Charizard",
      number: "4/102",
      rarity: "Holo Rare",
      type: "Fire",
      owned: true,
      imageUrl: "/api/placeholder/200/280"
    },
    {
      id: 2,
      name: "Blastoise",
      number: "2/102",
      rarity: "Holo Rare",
      type: "Water",
      owned: true,
      imageUrl: "/api/placeholder/200/280"
    },
    {
      id: 3,
      name: "Venusaur",
      number: "15/102",
      rarity: "Holo Rare",
      type: "Grass",
      owned: false,
      imageUrl: "/api/placeholder/200/280"
    },
    {
      id: 4,
      name: "Pikachu",
      number: "58/102",
      rarity: "Common",
      type: "Electric",
      owned: true,
      imageUrl: "/api/placeholder/200/280"
    },
    {
      id: 5,
      name: "Alakazam",
      number: "1/102",
      rarity: "Holo Rare",
      type: "Psychic",
      owned: false,
      imageUrl: "/api/placeholder/200/280"
    },
    {
      id: 6,
      name: "Machamp",
      number: "8/102",
      rarity: "Holo Rare",
      type: "Fighting",
      owned: true,
      imageUrl: "/api/placeholder/200/280"
    }
  ];

  const filteredCards = cards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.number.includes(searchTerm)
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
                {albumData.isPublic && (
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
                <span>Por: <strong>{albumData.owner}</strong></span>
                <span>•</span>
                <span>Criado em {new Date(albumData.createdAt).toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span>{albumData.cardsCount}/{albumData.totalCards} cartas ({Math.round((albumData.cardsCount / albumData.totalCards) * 100)}%)</span>
              </div>
            </div>

            {albumData.isOwn && (
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
                <Button variant="hero" className="gap-2">
                  <Edit3 className="w-4 h-4" />
                  Editar Álbum
                </Button>
              </div>
            )}
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
        {filteredCards.length === 0 ? (
          <Card className="pokemon-card p-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Nenhuma carta encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar sua busca ou adicionar novas cartas ao álbum
            </p>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "space-y-4"
          }>
            {filteredCards.map((card) => (
              <Card 
                key={card.id} 
                className={`pokemon-card group cursor-pointer ${!card.owned ? 'opacity-60' : ''}`}
              >
                {viewMode === 'grid' ? (
                  <div className="p-4">
                    <div className="aspect-[2/3] bg-muted rounded-lg mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/40 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Imagem da Carta</span>
                      </div>
                      {!card.owned && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="outline">Não possui</Badge>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-card-foreground truncate">
                        {card.name}
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{card.number}</span>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(card.type)}
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getRarityColor(card.rarity)}`}
                      >
                        {card.rarity}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-16 h-20 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Card</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">{card.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{card.number}</span>
                        <Badge variant="secondary" className="text-xs">
                          {card.rarity}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(card.type)}
                          <span>{card.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {card.owned ? (
                        <Badge variant="default">Possui</Badge>
                      ) : (
                        <Badge variant="outline">Não possui</Badge>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AlbumView;