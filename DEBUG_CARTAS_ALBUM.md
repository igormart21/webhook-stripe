# Debug: Cartas não aparecendo no álbum

## Problema Identificado
Algumas cartas não estão aparecendo no álbum, mesmo estando salvas no banco de dados.

## Soluções Implementadas

### 1. Melhorias na função `getCardById`
- ✅ Busca mais robusta por cartas mockadas
- ✅ Busca por similaridade (nome, número, ID parcial)
- ✅ Criação automática de cartas genéricas para IDs não encontrados
- ✅ Logs detalhados para debug

### 2. Melhorias no `AlbumCardGrid`
- ✅ Logs detalhados do processo de carregamento
- ✅ Fallback robusto com dados completos
- ✅ Tratamento de cartas sem `card_id`
- ✅ Placeholder SVG para imagens não carregadas

### 3. Sistema de Placeholder
- ✅ Criado `/public/placeholder-card.svg` para cartas sem imagem
- ✅ Fallback automático quando imagem não carrega

## Como Testar

1. **Abra o console do navegador** (F12)
2. **Navegue para um álbum** com cartas
3. **Verifique os logs**:
   - 🟢 "Carregando detalhes das cartas do álbum"
   - 🟢 "IDs das cartas no álbum"
   - ✅ "Carta carregada com sucesso" ou ⚠️ "Usando dados básicos"

## Logs Esperados

```
🟢 Carregando detalhes das cartas do álbum: 3 cartas
🟢 IDs das cartas no álbum: ["mock-1", "mock-2", "base1-4"]
🟢 Carregando detalhes da carta: mock-1
✅ Carta encontrada nos dados mockados: Pikachu
✅ Carta carregada com sucesso: Pikachu para ID: mock-1
🟢 Carregando detalhes da carta: mock-2
✅ Carta encontrada nos dados mockados: Charizard
✅ Carta carregada com sucesso: Charizard para ID: mock-2
🟢 Carregando detalhes da carta: base1-4
⚠️ Carta não encontrada, criando carta genérica para: base1-4
✅ Detalhes das cartas carregados: ["mock-1", "mock-2", "base1-4"]
```

## Cartas Mockadas Disponíveis

O sistema tem 22 cartas mockadas disponíveis:
- mock-1: Pikachu
- mock-2: Charizard
- mock-3: Blastoise
- mock-4: Venusaur
- mock-5: Mewtwo
- mock-6: Mew
- mock-7: Machamp
- mock-8: Alakazam
- mock-9: Gengar
- mock-10: Dragonite
- mock-11: Snorlax
- mock-12: Lugia
- mock-13: Ho-Oh
- mock-14: Accelgor
- mock-15: Lucario
- mock-16: Gardevoir
- mock-17: Garchomp
- mock-18: Hydreigon
- mock-19: Zoroark
- mock-20: Volcarona
- mock-21: Genesect
- mock-22: Keldeo

## Se o Problema Persistir

1. **Verifique os logs** no console
2. **Confirme os IDs** das cartas no banco de dados
3. **Teste adicionando** uma carta mockada (mock-1 até mock-22)
4. **Verifique se** as imagens estão carregando

## Próximos Passos

Se ainda houver problemas:
1. Adicionar mais cartas mockadas
2. Implementar busca na API real do Pokémon TCG
3. Melhorar o sistema de cache de cartas
