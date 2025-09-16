import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Search, 
  Upload, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  ArrowLeft,
  LogOut,
  Home
} from 'lucide-react'
import { pokemonApiService, PokemonCard } from '@/services/pokemonApi'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<any[]>([])
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiTestResults, setApiTestResults] = useState<Array<{success: boolean, message: string}>>([])
  const [albums, setAlbums] = useState<any[]>([]);
  const [buyLink, setBuyLink] = useState('');
  const [buyLinkLoading, setBuyLinkLoading] = useState(false);
  const { user, signOut, isSuperAdmin } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast();

  // Verificar se o usuário é superadmin
  useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/')
    }
  }, [isSuperAdmin, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleBackToSite = () => {
    navigate('/')
  }

  // Buscar link do Supabase ao abrir configurações
  useEffect(() => {
    if (activeTab === 'settings') {
      setBuyLinkLoading(true);
      supabase.from('settings').select('value').eq('key', 'buy_link').single()
        .then(({ data }) => setBuyLink(data?.value || ''))
        .finally(() => setBuyLinkLoading(false));
    }
  }, [activeTab]);

  const handleBuyLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuyLink(e.target.value);
  };

  const handleSaveSettings = async () => {
    setBuyLinkLoading(true);
    const { error } = await supabase.from('settings').upsert({ key: 'buy_link', value: buyLink });
    setBuyLinkLoading(false);
    if (!error) {
      toast({ title: 'Configurações salvas!', description: 'Suas alterações foram salvas com sucesso.', variant: 'success' });
    } else {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    }
  };

  // Função para testar a API Pokémon TCG
  const testPokemonTcgApi = async () => {
    setLoading(true)
    setApiTestResults([])
    
    try {
      const response = await fetch('https://api.pokemontcg.io/v2/cards?pageSize=1', {
        headers: {
          'X-Api-Key': 'feb26d91-2c88-4ad0-bc4f-341300b092e3'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setApiTestResults([
          { success: true, message: `Pokémon TCG API: ✅ Funcionando (${data.totalCount} cartas disponíveis)` }
        ])
      } else {
        setApiTestResults([
          { success: false, message: `Pokémon TCG API: ❌ Erro ${response.status}` }
        ])
      }
    } catch (error) {
      setApiTestResults([
        { success: false, message: `Pokémon TCG API: ❌ Erro de conexão` }
      ])
    }
    
    setLoading(false)
  }

  // Função para testar a API TCGdx
  const testTcgdxApi = async () => {
    setLoading(true)
    setApiTestResults([])
    
    try {
      const response = await fetch('https://api.tcgdx.net/v2/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: 'query { cards(limit: 1) { id name { pt en } } }'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setApiTestResults([
          { success: true, message: `TCGdx API: ✅ Funcionando (GraphQL ativo)` }
        ])
      } else {
        setApiTestResults([
          { success: false, message: `TCGdx API: ❌ Erro ${response.status}` }
        ])
      }
    } catch (error) {
      setApiTestResults([
        { success: false, message: `TCGdx API: ❌ Servidor fora do ar` }
      ])
    }
    
    setLoading(false)
  }

  // Buscar usuários
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    }
  }

  // Buscar cartas da API
  const searchCards = async () => {
    if (!searchQuery.trim()) {
      // Se não há query, mostrar cartas aleatórias
      testApiConnection()
      return
    }
    
    setLoading(true)
    try {
      console.log('Buscando cartas com query:', searchQuery)
      const response = await pokemonApiService.getCards({
        name: searchQuery,
        pageSize: 20
      })
      console.log('Resposta da API:', response)
      setCards(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar cartas:', error)
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    }
  };

  useEffect(() => {
    fetchUsers()
    fetchAlbums()
    // Testar a API com uma busca inicial
    testApiConnection()
  }, [])

  // Testar conexão com a API
  const testApiConnection = async () => {
    try {
      console.log('Testando conexão com a API...')
      const response = await pokemonApiService.getCards({
        pageSize: 10
      })
      console.log('Teste da API bem-sucedido:', response)
      setCards(response.data || [])
    } catch (error) {
      console.error('Erro no teste da API:', error)
    }
  }

  const stats = {
    totalUsers: users.length,
    totalCards: cards.length,
    activeUsers: users.filter(u => u.last_sign_in_at).length,
    totalAlbums: albums.length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard Superadmin</h1>
              <p className="text-muted-foreground">Gerencie a plataforma Pokédex TCG</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleBackToSite}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Voltar ao Site
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Deslogar
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} usuários ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cartas Encontradas</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCards}</div>
              <p className="text-xs text-muted-foreground">
                Última busca: {searchQuery || 'Nenhuma'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Álbuns Criados</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAlbums}</div>
              <p className="text-xs text-muted-foreground">
                Em toda a plataforma
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sistema</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Online</div>
              <p className="text-xs text-muted-foreground">
                Todas as funcionalidades ativas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="albums">Álbuns</TabsTrigger>
            <TabsTrigger value="cards">Cartas</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas ações na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.full_name?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.full_name || 'Usuário sem nome'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {new Date(user.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Visualize e gerencie todos os usuários da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.full_name?.charAt(0) || user.email?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.full_name || 'Usuário sem nome'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Cadastrado em: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Albums Tab */}
          <TabsContent value="albums" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Álbuns</CardTitle>
                <CardDescription>Visualize e gerencie todos os álbuns da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {albums.map((album) => (
                    <div key={album.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{album.name}</p>
                        <p className="text-xs text-muted-foreground">Usuário: {album.user_id}</p>
                        <p className="text-xs text-muted-foreground">Criado em: {new Date(album.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">{album.is_public ? 'Público' : 'Privado'}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="secondary">{album.cardsCount || 0} cartas</Badge>
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                        <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Buscar Cartas Pokémon</CardTitle>
                <CardDescription>Integração com a API oficial do Pokémon TCG</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite o nome da carta (ex: Pikachu, Charizard)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchCards()}
                    />
                    <Button onClick={searchCards} disabled={loading}>
                      <Search className="h-4 w-4 mr-2" />
                      {loading ? 'Buscando...' : 'Buscar'}
                    </Button>
                    <Button variant="outline" onClick={testApiConnection} disabled={loading}>
                      <Database className="h-4 w-4 mr-2" />
                      Ver Todas
                    </Button>
                  </div>

                  {cards.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cards.map((card) => (
                        <Card key={card.id} className="overflow-hidden">
                          <div className="aspect-square relative">
                            <img
                              src={card.images.large}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold">{card.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {card.set.name} • {card.rarity}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <Badge variant="secondary">{card.supertype}</Badge>
                              <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload de Imagens</CardTitle>
                <CardDescription>Faça upload de imagens personalizadas de cartas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Arraste e solte suas imagens aqui</h3>
                  <p className="text-muted-foreground mb-4">
                    Ou clique para selecionar arquivos
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Arquivos
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Formatos suportados: PNG, JPG, JPEG (máx. 10MB)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Plataforma</CardTitle>
                <CardDescription>Gerencie as configurações gerais da plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações de APIs</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key Pokémon TCG</Label>
                    <Input
                      id="api-key"
                      value="feb26d91-2c88-4ad0-bc4f-341300b092e3"
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Chave da API para integração com Pokémon TCG (19.500+ cartas)
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      ✅ Ativa e Funcionando
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tcgdx-url">API TCGdx URL</Label>
                    <Input
                      id="tcgdx-url"
                      value="https://api.tcgdx.net/v2/graphql"
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL da API TCGdx para cartas em português
                    </p>
                    <Badge variant="destructive" className="text-xs">
                      ❌ Servidor Fora do Ar
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="translation-status">Sistema de Tradução</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Status: Ativo</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tradução automática de tipos, raridades, ataques e habilidades para português
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      ✅ Funcionando
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-upload">Tamanho máximo de upload (MB)</Label>
                  <Input
                    id="max-upload"
                    type="number"
                    defaultValue="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenance">Modo de manutenção</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="maintenance" />
                    <Label htmlFor="maintenance" className="text-sm">
                      Ativar modo de manutenção
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Teste de APIs</h3>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={testPokemonTcgApi}
                      variant="outline"
                      className="flex-1"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Testar Pokémon TCG API
                    </Button>
                    
                    <Button 
                      onClick={testTcgdxApi}
                      variant="outline"
                      className="flex-1"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Testar TCGdx API
                    </Button>
                  </div>
                  
                  {apiTestResults && (
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Resultados dos Testes:</h4>
                      <div className="space-y-1 text-sm">
                        {apiTestResults.map((result, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Badge variant={result.success ? "secondary" : "destructive"}>
                              {result.success ? "✅" : "❌"}
                            </Badge>
                            <span>{result.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buy-link">Link do botão Compre Aqui</Label>
                  <Input
                    id="buy-link"
                    value={buyLink}
                    onChange={handleBuyLinkChange}
                    placeholder="https://sualoja.com/produto"
                    disabled={buyLinkLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Este link será usado no botão "Compre Aqui" do cabeçalho da home.
                  </p>
                </div>

                <Button onClick={handleSaveSettings} disabled={buyLinkLoading}>
                  <Settings className="h-4 w-4 mr-2" />
                  {buyLinkLoading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard
