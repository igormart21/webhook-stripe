# Debug: Problema com Adição de Cartas ao Álbum

## Passos para Identificar o Problema

### 1. Verificar Console do Navegador
1. Abra o DevTools (F12)
2. Vá para a aba "Console"
3. Tente adicionar uma carta ao álbum
4. Verifique se aparecem os logs:
   - 🟢 "Iniciando adição de carta ao álbum"
   - 🟢 "albumService.addCardToAlbum chamado com"
   - ✅ "Carta adicionada com sucesso ao álbum"

### 2. Verificar Erros no Console
Procure por erros como:
- ❌ "Erro ao adicionar carta ao álbum"
- Erros de rede (Network errors)
- Erros de autenticação
- Erros de permissão (RLS)

### 3. Verificar Banco de Dados
Execute o script `TEST_ALBUM_CARDS.sql` no SQL Editor do Supabase para verificar:
- Se a tabela `album_cards` existe
- Se as políticas RLS estão configuradas
- Se há dados na tabela

### 4. Verificar Autenticação
- Certifique-se de estar logado
- Verifique se o usuário tem permissão para adicionar cartas aos álbuns

### 5. Verificar Dados do Álbum
- Certifique-se de que o álbum existe
- Verifique se o usuário é o dono do álbum

## Possíveis Problemas e Soluções

### Problema 1: Tabela `album_cards` não existe
**Solução**: Execute o script SQL do `SUPABASE_SETUP.md` para criar a tabela

### Problema 2: Políticas RLS bloqueando
**Solução**: Verifique se as políticas estão configuradas corretamente

### Problema 3: Usuário não autenticado
**Solução**: Faça login novamente

### Problema 4: Álbum não existe
**Solução**: Crie um álbum primeiro

## Logs de Debug Adicionados

Os seguintes logs foram adicionados para facilitar o debug:

### AddToAlbumModal.tsx
- Log dos dados antes de chamar o serviço
- Log de erro detalhado

### albumService.ts
- Log dos parâmetros recebidos
- Log dos dados para inserção
- Log de sucesso ou erro

## Como Testar

1. Abra o site
2. Faça login
3. Crie um álbum
4. Vá para a página de cartas
5. Clique em uma carta
6. Clique em "Adicionar ao Álbum"
7. Selecione o álbum
8. Clique em "Adicionar ao Álbum"
9. Verifique o console para logs
