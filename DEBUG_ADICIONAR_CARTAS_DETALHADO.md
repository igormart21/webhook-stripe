# Debug Detalhado: Adicionar Cartas ao Álbum

## Status Atual
- ✅ Servidor rodando em `http://localhost:8080`
- ✅ Proxy CORS configurado
- ✅ Logs de debug implementados
- ❓ Problema ainda persiste

## Passos para Debug

### 1. Verificar Console do Navegador
1. Abra `http://localhost:8080`
2. Abra DevTools (F12) → Console
3. Faça login
4. Crie um álbum
5. Vá para uma página com cartas
6. Clique em uma carta
7. Clique em "Adicionar ao Álbum"
8. Selecione o álbum
9. Clique em "Adicionar ao Álbum"

### 2. Logs Esperados
Se tudo estiver funcionando, você deve ver:
```
🟢 Iniciando adição de carta ao álbum: {selectedAlbum: "album-id", cardId: "card-id", ...}
🟢 albumService.addCardToAlbum chamado com: {albumId: "album-id", cardId: "card-id", ...}
🟢 Dados para inserção: {album_id: "album-id", card_id: "card-id", ...}
✅ Carta adicionada com sucesso ao álbum: [...]
```

### 3. Possíveis Erros

#### Erro 1: "Tabela album_cards não existe"
**Solução**: Execute o script `SUPABASE_SETUP.md` no SQL Editor do Supabase

#### Erro 2: "Política RLS bloqueando"
**Solução**: Execute o script `VERIFICAR_BANCO.sql` para verificar as políticas

#### Erro 3: "Usuário não autenticado"
**Solução**: Faça login novamente

#### Erro 4: "Álbum não encontrado"
**Solução**: Crie um álbum primeiro

### 4. Verificar Banco de Dados
Execute no SQL Editor do Supabase:

```sql
-- Verificar se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('albums', 'album_cards');

-- Verificar se há álbuns
SELECT id, name, user_id FROM albums;

-- Verificar se há cartas nos álbuns
SELECT * FROM album_cards LIMIT 5;
```

### 5. Teste Manual
Se o problema persistir, teste inserir manualmente:

```sql
-- Substitua pelos IDs reais
INSERT INTO album_cards (album_id, card_id, quantity, notes) 
VALUES ('seu-album-id', 'test-card-123', 1, 'Teste manual');
```

### 6. Verificar Autenticação
No console do navegador, execute:
```javascript
// Verificar se está logado
console.log('Usuário logado:', localStorage.getItem('supabase.auth.token'));

// Verificar dados do usuário
console.log('Dados do usuário:', window.supabase?.auth?.getUser());
```

## Próximos Passos

1. **Execute os testes acima**
2. **Me informe os logs específicos** que aparecem no console
3. **Execute o script** `VERIFICAR_BANCO.sql` no Supabase
4. **Me informe os resultados** para que eu possa ajudar melhor

## Arquivos de Debug Criados

- `VERIFICAR_BANCO.sql` - Script para verificar o banco
- `DEBUG_ADICIONAR_CARTAS_DETALHADO.md` - Este guia
- `SOLUCAO_CORS.md` - Solução para CORS

## Contato

Me informe:
1. O que aparece no console do navegador
2. Os resultados do script `VERIFICAR_BANCO.sql`
3. Se consegue criar álbuns normalmente
4. Se consegue ver as cartas na página
