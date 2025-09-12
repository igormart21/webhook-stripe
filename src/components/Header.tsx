import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, User, Search, Menu, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import pokeballIcon from "@/assets/pokeball-icon.png";

interface HeaderProps {
  currentPage?: 'home' | 'dashboard' | 'album' | 'search';
}

const Header = ({ currentPage = 'home' }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={pokeballIcon} 
              alt="Pokémon TCG Album" 
              className="w-8 h-8 float-animation"
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold gradient-text">Pokédx TCG</h1>
              <span className="text-xs text-muted-foreground">Pokémon Collection</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/">
              <Button 
                variant={currentPage === 'home' ? 'default' : 'ghost'} 
                size="sm"
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Início
              </Button>
            </Link>
            
            <Link to="/dashboard">
              <Button 
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'} 
                size="sm"
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Meus Álbuns
              </Button>
            </Link>
            
            <Link to="/search">
              <Button 
                variant={currentPage === 'search' ? 'default' : 'ghost'} 
                size="sm"
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                Buscar Cartas
              </Button>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2">
              <LogIn className="w-4 h-4" />
              Entrar
            </Button>
            <Button variant="hero" size="sm" className="gap-2">
              <img src={pokeballIcon} alt="" className="w-4 h-4" />
              Cadastrar
            </Button>
          </div>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;