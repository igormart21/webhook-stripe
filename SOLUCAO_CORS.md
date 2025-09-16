# Solução para Erro de CORS

## Problema Identificado
```
[Error] Origin http://localhost:8080 is not allowed by Access-Control-Allow-Origin. Status code: 504
[Error] XMLHttpRequest cannot load https://api.pokemontcg.io/v2/cards due to access control checks.
```

## Solução Implementada

### 1. Proxy no Vite
Adicionado proxy no `vite.config.ts` para contornar o problema de CORS:

```typescript
server: {
  proxy: {
    '/api/pokemon-tcg': {
      target: 'https://api.pokemontcg.io/v2',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/pokemon-tcg/, ''),
    }
  }
}
```

### 2. Atualização da URL da API
Modificado `pokemonApi.ts` para usar o proxy local:

```typescript
// Antes
const POKEMON_TCG_API_URL = 'https://api.pokemontcg.io/v2'

// Depois
const POKEMON_TCG_API_URL = '/api/pokemon-tcg'
```

## Como Funciona

1. **Requisição do Frontend**: `http://localhost:8080/api/pokemon-tcg/cards`
2. **Proxy do Vite**: Redireciona para `https://api.pokemontcg.io/v2/cards`
3. **Resposta**: Retorna para o frontend sem problemas de CORS

## Benefícios

- ✅ **Sem problemas de CORS**: O proxy resolve automaticamente
- ✅ **Transparente**: O código funciona igual, apenas muda a URL
- ✅ **Desenvolvimento**: Funciona apenas em desenvolvimento
- ✅ **Produção**: Em produção, use um proxy reverso ou CORS no servidor

## Teste

1. Reinicie o servidor: `npm run dev`
2. Acesse o site
3. Tente adicionar cartas ao álbum
4. Verifique se não há mais erros de CORS no console

## Logs do Proxy

O proxy inclui logs para debug:
- `Sending Request to the Target`: Quando envia requisição
- `Received Response from the Target`: Quando recebe resposta
- `proxy error`: Se houver erro no proxy

## Nota para Produção

Em produção, você precisará:
1. Configurar CORS no servidor backend
2. Ou usar um proxy reverso (Nginx, Apache)
3. Ou hospedar em um domínio que a API permita
