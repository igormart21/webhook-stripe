-- Script final para adicionar a coluna cover_image_url
-- Execute este script no SQL Editor do Supabase

-- Verificar se a coluna já existe e adicionar se necessário
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
        RAISE NOTICE 'Coluna cover_image_url adicionada com sucesso à tabela albums!';
    ELSE
        RAISE NOTICE 'Coluna cover_image_url já existe na tabela albums!';
    END IF;
END $$;

-- Verificar a estrutura atual da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'albums' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Testar inserção de dados (opcional)
-- INSERT INTO albums (user_id, name, description, cover_image_url, is_public) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Teste', 'Teste descrição', 'https://example.com/test.jpg', false);
