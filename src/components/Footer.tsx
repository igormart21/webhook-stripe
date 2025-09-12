import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Github, Twitter, Mail, BookOpen } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-muted/50 to-background border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logo} 
                alt="Pokédex" 
                className="w-8 h-8"
              />
              <div>
                <h3 className="text-lg font-bold gradient-text">Pokédex</h3>
                <span className="text-sm text-muted-foreground">Digital Collection Manager</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
              A plataforma mais completa para organizar, catalogar e compartilhar sua coleção de cartas Pokémon TCG. 
              Conecte-se com outros colecionadores e descubra novas cartas!
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-primary">
                  Como Funciona
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-primary">
                  Buscar Cartas
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-primary">
                  Criar Álbum
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-primary">
                  Exemplos
                </Button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-4">Suporte</h4>
            <ul className="space-y-3">
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-primary gap-2">
                  <BookOpen className="w-4 h-4" />
                  Documentação
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-primary">
                  FAQ
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-primary">
                  Contato
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-primary">
                  Reportar Bug
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Feito com</span>
            <Heart className="w-4 h-4 text-accent fill-current" />
            <span>por desenvolvedores Pokémon</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>© 2024 Pokédex. Todos os direitos reservados.</span>
            <div className="flex gap-4">
              <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                Privacidade
              </Button>
              <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                Termos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;