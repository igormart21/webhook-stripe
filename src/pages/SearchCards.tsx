import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Plus, 
  Star, 
  Zap, 
  Droplets, 
  Leaf, 
  Mountain,
  Eye,
  BookOpen,
  Heart,
  ExternalLink
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pokemonApiService } from "@/services/pokemonApi";
import { useAuth } from "@/contexts/AuthContext";
import CardPreviewModal from "@/components/CardPreviewModal";

const SearchCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSet, setSelectedSet] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // Carregar cartas populares ao inicializar
  useEffect(() => {
    loadPopularCards();
  }, []);

  const loadPopularCards = async () => {
    setLoading(true);
    try {
      const response = await pokemonApiService.getCards({
        pageSize: 24
      });
      setCards(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar cartas:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCards = async () => {
    if (!searchTerm.trim()) {
      loadPopularCards();
      return;
    }
    
    setLoading(true);
    try {
      const params: any = {
        pageSize: 24
      };
      
      if (searchTerm.trim()) {
        params.name = searchTerm;
      }
      if (selectedType) {
        params.type = selectedType;
      }
      if (selectedSet) {
        params.set = selectedSet;
      }

      const response = await pokemonApiService.getCards(params);
      setCards(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar cartas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (cardId: string) => {
    if (!user) {
      alert('Faça login para adicionar aos favoritos!');
      return;
    }
    
    setFavorites(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const addToCollection = (card: any) => {
    if (!user) {
      alert('Faça login para adicionar à sua coleção!');
      return;
    }
    
    alert(`Carta ${card.name} adicionada à sua coleção!`);
  }

  const openCardPreview = (card: any) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  const closeCardPreview = () => {
    setIsModalOpen(false)
    setSelectedCard(null)
  };

  // Filtrar cartas localmente para tipos e sets
  const filteredCards = cards.filter(card => {
    const matchesType = !selectedType || (card.types && card.types.includes(selectedType));
    const matchesSet = !selectedSet || (card.set && card.set.name === selectedSet);
    
    return matchesType && matchesSet;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Fire': return <Mountain className="w-4 h-4 text-red-500" />;
      case 'Water': return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'Lightning': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'Grass': return <Leaf className="w-4 h-4 text-green-500" />;
      case 'Psychic': return <Star className="w-4 h-4 text-purple-500" />;
      case 'Fighting': return <Mountain className="w-4 h-4 text-orange-500" />;
      case 'Darkness': return <Star className="w-4 h-4 text-gray-800" />;
      case 'Metal': return <Star className="w-4 h-4 text-gray-500" />;
      case 'Fairy': return <Star className="w-4 h-4 text-pink-500" />;
      case 'Dragon': return <Star className="w-4 h-4 text-indigo-500" />;
      case 'Colorless': return <Star className="w-4 h-4 text-gray-400" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Rare Holo': return 'bg-gradient-accent text-white';
      case 'Rare': return 'bg-gradient-secondary text-secondary-foreground';
      case 'Uncommon': return 'bg-gradient-primary text-white';
      case 'Common': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const types = ["Fire", "Water", "Lightning", "Grass", "Psychic", "Fighting", "Darkness", "Metal", "Fairy", "Dragon", "Colorless"];
  const sets = Array.from(new Set(cards.map(card => card.set?.name).filter(Boolean))).slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header currentPage="search" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Buscar Cartas Pokémon
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore nossa extensa base de dados com mais de 20.000 cartas oficiais do Pokémon TCG. 
            Encontre cartas por nome, número ou coleção e adicione às suas coleções pessoais.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="pokemon-card p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome (ex: Charizard, Pikachu, Mewtwo)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchCards()}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Button onClick={searchCards} disabled={loading} className="md:col-span-1">
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os Tipos" />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(type)}
                      {type}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={loadPopularCards} disabled={loading}>
              Ver Todas
            </Button>
          </div>

          {/* Active Filters */}
          {selectedType && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {selectedType && (
                <Badge variant="secondary" className="gap-1">
                  {getTypeIcon(selectedType)}
                  {selectedType}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedType("");
                }}
                className="text-xs"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </Card>

        {/* Results */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {filteredCards.length} carta{filteredCards.length !== 1 ? 's' : ''} encontrada{filteredCards.length !== 1 ? 's' : ''} 
              {searchTerm && ` para "${searchTerm}"`}
            </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando cartas...</p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && filteredCards.length === 0 ? (
          <Card className="pokemon-card p-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Nenhuma carta encontrada
            </h3>
            <p className="text-muted-foreground mb-6">
              Tente ajustar sua busca ou usar filtros diferentes
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("Charizard")}>
                Charizard
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("Pikachu")}>
                Pikachu
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("Blastoise")}>
                Blastoise
              </Button>
            </div>
          </Card>
        ) : !loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCards.map((card) => (
              <Card key={card.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                <div className="relative">
                  <img
                    src={card.images?.small || card.images?.large}
                    alt={card.name}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => openCardPreview(card)}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-card.png'
                    }}
                  />
                  
                  {/* Favorite Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(card.id)
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(card.id) ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </Button>
                    </div>
                    
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1">{card.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {card.set?.name} • #{card.number}
                      </p>
                  </div>

                    <div className="flex flex-wrap gap-1">
                      {card.types && card.types.map((type: string) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {card.rarity && (
                        <Badge variant="outline" className="text-xs">
                        {card.rarity}
                      </Badge>
                      )}
                    </div>
                    
                    {card.hp && (
                      <div className="text-sm">
                        <span className="font-medium">HP: </span>
                        <span className="text-primary font-bold">{card.hp}</span>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => addToCollection(card)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(card.images?.large, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {searchTerm && filteredCards.length > 0 && (
          <Card className="pokemon-card p-6 mt-12 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Encontrou as cartas que procurava?
                </span>
              </div>
              <Button variant="hero" className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Novo Álbum
              </Button>
            </div>
          </Card>
        )}
      </main>
      
      <Footer />

      {/* Card Preview Modal */}
      <CardPreviewModal
        isOpen={isModalOpen}
        onClose={closeCardPreview}
        card={selectedCard}
        onToggleFavorite={toggleFavorite}
        onAddToCollection={addToCollection}
        isFavorite={selectedCard ? favorites.includes(selectedCard.id) : false}
      />
    </div>
  );
};

export default SearchCards;