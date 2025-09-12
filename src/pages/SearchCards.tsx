import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  BookOpen
} from "lucide-react";
import Header from "@/components/Header";

const SearchCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSet, setSelectedSet] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Mock data for Pokémon cards
  const cards = [
    {
      id: "xy1-1",
      name: "Venomoth",
      number: "1/146",
      set: "XY Base Set",
      type: "Grass",
      rarity: "Rare",
      hp: 90,
      imageUrl: "/api/placeholder/200/280",
      description: "A Pokémon that flutters around in the night sky."
    },
    {
      id: "xy1-2",
      name: "Butterfree",
      number: "2/146",
      set: "XY Base Set",
      type: "Grass",
      rarity: "Rare",
      hp: 130,
      imageUrl: "/api/placeholder/200/280",
      description: "In battle, it flaps its wings at high speed to release highly toxic dust into the air."
    },
    {
      id: "base-4",
      name: "Charizard",
      number: "4/102",
      set: "Base Set",
      type: "Fire",
      rarity: "Holo Rare",
      hp: 120,
      imageUrl: "/api/placeholder/200/280",
      description: "Spits fire that is hot enough to melt boulders."
    },
    {
      id: "base-2",
      name: "Blastoise",
      number: "2/102",
      set: "Base Set",
      type: "Water",
      rarity: "Holo Rare",
      hp: 100,
      imageUrl: "/api/placeholder/200/280",
      description: "A brutal Pokémon with pressurized water jets on its shell."
    },
    {
      id: "base-58",
      name: "Pikachu",
      number: "58/102",
      set: "Base Set",
      type: "Electric",
      rarity: "Common",
      hp: 40,
      imageUrl: "/api/placeholder/200/280",
      description: "When several of these Pokémon gather, their electricity could build and cause lightning storms."
    },
    {
      id: "jungle-11",
      name: "Bayleef",
      number: "11/64",
      set: "Jungle",
      type: "Grass",
      rarity: "Uncommon",
      hp: 60,
      imageUrl: "/api/placeholder/200/280",
      description: "The scent of spices comes from around its neck."
    }
  ];

  const sets = ["Base Set", "Jungle", "Fossil", "XY Base Set", "Sun & Moon"];
  const types = ["Grass", "Fire", "Water", "Electric", "Psychic", "Fighting", "Dark", "Metal"];

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.number.includes(searchTerm);
    const matchesSet = !selectedSet || card.set === selectedSet;
    const matchesType = !selectedType || card.type === selectedType;
    
    return matchesSearch && matchesSet && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Fire': return <Mountain className="w-4 h-4 text-red-500" />;
      case 'Water': return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'Electric': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'Grass': return <Leaf className="w-4 h-4 text-green-500" />;
      case 'Psychic': return <Star className="w-4 h-4 text-purple-500" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Holo Rare': return 'bg-gradient-accent text-white';
      case 'Rare': return 'bg-gradient-secondary text-secondary-foreground';
      case 'Uncommon': return 'bg-gradient-primary text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
                  placeholder="Buscar por nome ou número (ex: Charizard, 4/102)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedSet} onValueChange={setSelectedSet}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as Coleções" />
              </SelectTrigger>
              <SelectContent>
                {sets.map(set => (
                  <SelectItem key={set} value={set}>{set}</SelectItem>
                ))}
              </SelectContent>
            </Select>

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
          </div>

          {/* Active Filters */}
          {(selectedSet || selectedType) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {selectedSet && (
                <Badge variant="secondary" className="gap-1">
                  Coleção: {selectedSet}
                </Badge>
              )}
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
                  setSelectedSet("");
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
        {searchTerm && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {filteredCards.length} carta{filteredCards.length !== 1 ? 's' : ''} encontrada{filteredCards.length !== 1 ? 's' : ''} 
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {!searchTerm && filteredCards.length === 0 ? (
          <Card className="pokemon-card p-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Comece sua busca
            </h3>
            <p className="text-muted-foreground mb-6">
              Digite o nome de um Pokémon, número da carta ou use os filtros para explorar nossa coleção
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
        ) : filteredCards.length === 0 ? (
          <Card className="pokemon-card p-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Nenhuma carta encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar sua busca ou usar filtros diferentes
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCards.map((card) => (
              <Card key={card.id} className="pokemon-card group cursor-pointer overflow-hidden">
                <div className="p-4">
                  {/* Card Image */}
                  <div className="aspect-[2/3] bg-muted rounded-lg mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/40 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Imagem da Carta</span>
                    </div>
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Button variant="secondary" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Ver
                      </Button>
                      <Button variant="hero" size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-card-foreground truncate">
                        {card.name}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getRarityColor(card.rarity)}`}
                      >
                        {card.rarity}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{card.number}</span>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(card.type)}
                        <span>HP {card.hp}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {card.description}
                    </p>
                    
                    <div className="pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">{card.set}</span>
                    </div>
                  </div>
                </div>
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
    </div>
  );
};

export default SearchCards;