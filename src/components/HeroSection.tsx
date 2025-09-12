import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, BookOpen, Share2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import pokemonHero from "@/assets/pokemon-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${pokemonHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/70" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-secondary/20 rounded-full float-animation" 
           style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-accent/20 rounded-full float-animation" 
           style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-primary-glow/20 rounded-full float-animation" 
           style={{ animationDelay: '4s' }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white drop-shadow-md">Organize sua coleção digital</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Seu Álbum de Cartas
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent drop-shadow-xl">
              Pokédex
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Crie, organize e compartilhe sua coleção de cartas Pokémon TCG de forma digital. 
            Busque cartas, monte seus álbuns favoritos e compartilhe com a comunidade!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="gap-3 font-bold">
                <BookOpen className="w-5 h-5" />
                Criar Meu Álbum
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="xl" 
              className="gap-3 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              <Share2 className="w-5 h-5" />
              Ver Exemplo
            </Button>
          </div>

          {/* Features Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="bg-black/20 backdrop-blur-sm border-white/30 p-6 pokemon-card shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2 text-white drop-shadow-lg">Organize</h3>
                <p className="text-sm text-white/90 drop-shadow-md">Crie álbuns personalizados e adicione suas cartas favoritas</p>
              </div>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-white/30 p-6 pokemon-card shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2 text-white drop-shadow-lg">Busque</h3>
                <p className="text-sm text-white/90 drop-shadow-md">Encontre cartas pelo nome ou número usando nossa base de dados</p>
              </div>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-white/30 p-6 pokemon-card shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2 text-white drop-shadow-lg">Compartilhe</h3>
                <p className="text-sm text-white/90 drop-shadow-md">Gere links públicos para mostrar sua coleção para amigos</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;