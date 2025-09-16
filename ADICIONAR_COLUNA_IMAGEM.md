# Como Adicionar a Coluna cover_image_url ao Banco de Dados

## ⚠️ PROBLEMA ATUAL
O erro "Could not find the 'cover_image_url' column of 'albums' in the schema cache" ocorre porque a coluna `cover_image_url` não existe na tabela `albums` do Supabase.

## ✅ SOLUÇÃO

### 1. Acesse o Supabase Dashboard
1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em **SQL Editor** no menu lateral

### 2. Execute o Script SQL
Cole e execute o seguinte comando SQL:

```sql
-- Adicionar coluna cover_image_url na tabela albums
ALTER TABLE albums ADD COLUMN cover_image_url TEXT;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'albums' 
ORDER BY ordinal_position;
```

### 3. Verificar se Funcionou
Após executar o script, você deve ver a coluna `cover_image_url` na lista de colunas da tabela `albums`.

### 4. Testar no Aplicativo
1. Recarregue a página do dashboard
2. Tente criar um novo álbum com imagem
3. A imagem de capa deve aparecer nos álbuns

## 🔧 ALTERNATIVA: Script Mais Robusto

Se o script simples não funcionar, use este:

```sql
-- Verificar se a coluna já existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'albums' 
        AND column_name = 'cover_image_url'
    ) THEN
        ALTER TABLE albums ADD COLUMN cover_image_url TEXT;
        RAISE NOTICE 'Coluna cover_image_url adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna cover_image_url já existe!';
    END IF;
END $$;
```

## 📋 ESTRUTURA FINAL DA TABELA

Após adicionar a coluna, a tabela `albums` deve ter:

```
albums
├── id (UUID, PRIMARY KEY)
├── user_id (UUID, FOREIGN KEY)
├── name (TEXT)
├── description (TEXT)
├── cover_image_url (TEXT) ← NOVA COLUNA
├── is_public (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🚀 PRÓXIMOS PASSOS

1. ✅ Execute o script SQL
2. ✅ Verifique se a coluna foi adicionada
3. ✅ Teste criar um álbum com imagem
4. ✅ Verifique se a imagem aparece no dashboard

## ❓ PROBLEMAS COMUNS

### Erro: "permission denied"
- Verifique se você tem permissões de administrador no projeto Supabase

### Erro: "table does not exist"
- Verifique se a tabela `albums` existe
- Execute primeiro o script de criação da tabela em `SUPABASE_SETUP.md`

### Coluna não aparece
- Force refresh no navegador (Ctrl+F5)
- Aguarde alguns segundos para o cache atualizar
