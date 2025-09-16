-- Script para testar se a coluna cover_image_url foi adicionada corretamente
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

-- 2. Se a coluna existir, mostrar sua estrutura
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'albums' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Testar inserção de um álbum com imagem (substitua o user_id por um real)
-- INSERT INTO albums (user_id, name, description, cover_image_url, is_public) 
-- VALUES (
--     '00000000-0000-0000-0000-000000000000', 
--     'Álbum Teste', 
--     'Teste de álbum com imagem', 
--     'https://via.placeholder.com/300x200/0066cc/ffffff?text=Teste', 
--     false
-- );

-- 4. Verificar se o álbum foi inserido
-- SELECT * FROM albums WHERE name = 'Álbum Teste';

-- 5. Limpar o álbum de teste (descomente se necessário)
-- DELETE FROM albums WHERE name = 'Álbum Teste';
