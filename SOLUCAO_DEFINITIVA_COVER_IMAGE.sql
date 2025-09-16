-- SOLUÇÃO DEFINITIVA: Adicionar coluna cover_image_url
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela albums existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'albums';

-- 2. Verificar estrutura atual da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'albums' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Adicionar a coluna cover_image_url se não existir
DO $$ 
BEGIN
    -- Verificar se a coluna já existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'albums' 
        AND column_name = 'cover_image_url'
        AND table_schema = 'public'
    ) THEN
        -- Adicionar a coluna
        ALTER TABLE public.albums ADD COLUMN cover_image_url TEXT;
        RAISE NOTICE '✅ Coluna cover_image_url adicionada com sucesso à tabela albums!';
    ELSE
        RAISE NOTICE 'ℹ️ Coluna cover_image_url já existe na tabela albums!';
    END IF;
END $$;

-- 4. Verificar se a coluna foi adicionada
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'albums' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Testar inserção de dados (opcional - descomente para testar)
-- INSERT INTO albums (user_id, name, description, cover_image_url, is_public) 
-- VALUES (
--     '00000000-0000-0000-0000-000000000000', 
--     'Álbum Teste', 
--     'Teste de álbum com imagem', 
--     'https://via.placeholder.com/300x200/0066cc/ffffff?text=Teste', 
--     false
-- );

-- 6. Verificar se o álbum de teste foi inserido (se executou o passo 5)
-- SELECT * FROM albums WHERE name = 'Álbum Teste';

-- 7. Limpar o álbum de teste (se necessário)
-- DELETE FROM albums WHERE name = 'Álbum Teste';
