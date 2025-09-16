import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, User, Search, Menu, LogIn, UserPlus, LogOut, Shield, CreditCard, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import logo from "@/assets/logo.png";
import { supabase } from '@/lib/supabase';

interface HeaderProps {
  currentPage?: 'home' | 'dashboard' | 'album' | 'search' | 'cards' | 'admin';
}

const Header = ({ currentPage = 'home' }: HeaderProps) => {
  const { user, signOut, isSuperAdmin } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [buyLink, setBuyLink] = useState<string>("");

  useEffect(() => {
    async function fetchBuyLink() {
      const { data } = await supabase.from('settings').select('value').eq('key', 'buy_link').single();
      setBuyLink(data?.value || "");
    }
    fetchBuyLink();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLoginClick = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Pokédex" 
              className="w-8 h-8 float-animation"
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold gradient-text">Pokédex</h1>
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
            
            {user && (
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
            )}
            
            <Link to="/cards">
              <Button 
                variant={currentPage === 'cards' ? 'default' : 'ghost'} 
                size="sm"
                className="gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Cartas
              </Button>
            </Link>
            
            <Link to="/search">
              <Button 
                variant={currentPage === 'search' ? 'default' : 'ghost'} 
                size="sm"
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                Buscar
              </Button>
            </Link>
            
            {isSuperAdmin && (
              <Link to="/admin">
                <Button 
                  variant={currentPage === 'admin' ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
            )}
            {buyLink && (
              <a href={buyLink} target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                  🛒 Compre Aqui
                </Button>
              </a>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Olá, {user.user_metadata?.full_name || user.email}
                </span>
                <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="gap-2" onClick={handleLoginClick}>
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Button>
                <Button variant="hero" size="sm" className="gap-2" onClick={handleRegisterClick}>
                  <UserPlus className="w-4 h-4" />
                  Cadastrar
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </header>
  );
};

export default Header;