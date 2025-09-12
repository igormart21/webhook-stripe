import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Search, 
  BookOpen, 
  Share2, 
  Shield, 
  Zap, 
  Users,
  ArrowRight,
  CheckCircle 
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Busca Inteligente",
      description: "Encontre qualquer carta pelo nome, número ou coleção usando nossa integração com a API oficial do Pokémon TCG.",
      color: "bg-gradient-primary"
    },
    {
      icon: BookOpen,
      title: "Álbuns Personalizados",
      description: "Crie múltiplos álbuns temáticos, organize por coleção, tipo ou raridade. Sua coleção, suas regras!",
      color: "bg-gradient-secondary"
    },
    {
      icon: Share2,
      title: "Compartilhamento Seguro",
      description: "Gere links únicos para mostrar seus álbuns. Visitantes podem apenas visualizar, você mantém o controle total.",
      color: "bg-gradient-accent"
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      description: "Sua coleção é protegida com autenticação segura. Acesse de qualquer dispositivo com total tranquilidade.",
      color: "bg-gradient-primary"
    },
    {
      icon: Zap,
      title: "Atualização Automática",
      description: "Novas cartas são adicionadas automaticamente à nossa base de dados. Sempre atualizado com os lançamentos!",
      color: "bg-gradient-secondary"
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Conecte-se com outros colecionadores, descubra novas cartas e compare suas coleções.",
      color: "bg-gradient-accent"
    }
  ];

  const benefits = [
    "Acesso gratuito a todas as funcionalidades básicas",
    "Busca em mais de 20.000 cartas oficiais",
    "Álbuns ilimitados para organizar sua coleção",
    "Compartilhamento seguro com links únicos",
    "Interface responsiva para todos os dispositivos",
    "Atualizações constantes com novas cartas"
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-6">
            Funcionalidades Poderosas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tudo que você precisa para organizar, catalogar e compartilhar sua coleção de cartas Pokémon TCG
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="pokemon-card p-6 hover:shadow-glow transition-all duration-300 border-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-start">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 shadow-card`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-card-foreground mb-6">
              Por que escolher nosso álbum digital?
            </h3>
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            <Link to="/dashboard">
              <Button variant="hero" size="lg" className="gap-3">
                Começar Agora
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <Card className="pokemon-card p-8 bg-gradient-hero text-white border-0 shadow-glow">
              <div className="text-center">
                <h4 className="text-2xl font-bold mb-4">Pronto para começar?</h4>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Junte-se a milhares de treinadores que já digitalizaram suas coleções. 
                  É gratuito e leva menos de 2 minutos para começar!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/dashboard">
                    <Button variant="secondary" size="lg" className="gap-2">
                      Criar Conta Grátis
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Ver Demo
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;