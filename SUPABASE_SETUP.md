# Configuração do Supabase

## 1. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` e substitua pelos seus valores reais do Supabase:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
   ```

## 2. Configurar o Banco de Dados

Execute os seguintes comandos SQL no SQL Editor do Supabase:

### Criar tabela de perfis
```sql
-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários atualizarem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para usuários inserirem apenas seu próprio perfil
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Criar tabela de álbuns
```sql
-- Criar tabela de álbuns
CREATE TABLE albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem seus próprios álbuns e álbuns públicos
CREATE POLICY "Users can view own albums and public albums" ON albums
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

-- Política para usuários criarem álbuns
CREATE POLICY "Users can create albums" ON albums
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem seus próprios álbuns
CREATE POLICY "Users can update own albums" ON albums
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários deletarem seus próprios álbuns
CREATE POLICY "Users can delete own albums" ON albums
  FOR DELETE USING (auth.uid() = user_id);
```

### Criar tabela de cartas nos álbuns
```sql
-- Criar tabela de cartas nos álbuns
CREATE TABLE album_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE NOT NULL,
  card_id TEXT NOT NULL, -- ID da carta da API do Pokémon TCG
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE album_cards ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem cartas de seus álbuns e álbuns públicos
CREATE POLICY "Users can view cards from own albums and public albums" ON album_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM albums 
      WHERE albums.id = album_cards.album_id 
      AND (albums.user_id = auth.uid() OR albums.is_public = true)
    )
  );

-- Política para usuários adicionarem cartas aos seus álbuns
CREATE POLICY "Users can add cards to own albums" ON album_cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM albums 
      WHERE albums.id = album_cards.album_id 
      AND albums.user_id = auth.uid()
    )
  );

-- Política para usuários atualizarem cartas em seus álbuns
CREATE POLICY "Users can update cards in own albums" ON album_cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM albums 
      WHERE albums.id = album_cards.album_id 
      AND albums.user_id = auth.uid()
    )
  );

-- Política para usuários removerem cartas de seus álbuns
CREATE POLICY "Users can delete cards from own albums" ON album_cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM albums 
      WHERE albums.id = album_cards.album_id 
      AND albums.user_id = auth.uid()
    )
  );
```

### Criar função para atualizar updated_at
```sql
-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 3. Configurar Autenticação

1. No painel do Supabase, vá para **Authentication > Settings**
2. Configure as URLs permitidas:
   - **Site URL**: `http://localhost:8080` (para desenvolvimento)
   - **Redirect URLs**: `http://localhost:8080/**`

## 4. Testar a Configuração

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:8080`
3. Teste o cadastro e login de usuários

## 5. Próximos Passos

- Implementar páginas de login/registro
- Criar funcionalidades de CRUD para álbuns
- Integrar com a API do Pokémon TCG
- Implementar upload de imagens (opcional)

## Estrutura do Banco de Dados

```
profiles (perfis de usuário)
├── id (UUID, chave primária)
├── email (TEXT)
├── full_name (TEXT, opcional)
├── avatar_url (TEXT, opcional)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

albums (álbuns de cartas)
├── id (UUID, chave primária)
├── user_id (UUID, referência para auth.users)
├── name (TEXT)
├── description (TEXT, opcional)
├── cover_image_url (TEXT, opcional)
├── is_public (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

album_cards (cartas nos álbuns)
├── id (UUID, chave primária)
├── album_id (UUID, referência para albums)
├── card_id (TEXT, ID da carta da API)
├── quantity (INTEGER)
├── notes (TEXT, opcional)
└── created_at (TIMESTAMP)
```
