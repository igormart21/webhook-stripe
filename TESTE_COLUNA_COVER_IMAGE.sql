-- TESTE: Verificar se a coluna cover_image_url está funcionando
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a coluna existe
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'albums' 
AND table_schema = 'public'
AND column_name = 'cover_image_url';

-- 2. Verificar estrutura completa da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'albums' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Testar inserção de um álbum com imagem (substitua o user_id por um real)
-- INSERT INTO albums (user_id, name, description, cover_image_url, is_public) 
-- VALUES (
--     '00000000-0000-0000-0000-000000000000', 
--     'Álbum Teste com Imagem', 
--     'Teste de álbum com imagem de capa', 
--     'https://via.placeholder.com/300x200/0066cc/ffffff?text=Teste+Imagem', 
--     false
-- );

-- 4. Verificar se o álbum foi inserido (se executou o passo 3)
-- SELECT * FROM albums WHERE name = 'Álbum Teste com Imagem';

-- 5. Verificar todos os álbuns com imagens
SELECT id, name, cover_image_url, is_public 
FROM albums 
WHERE cover_image_url IS NOT NULL;

-- 6. Limpar o álbum de teste (se necessário)
-- DELETE FROM albums WHERE name = 'Álbum Teste com Imagem';
