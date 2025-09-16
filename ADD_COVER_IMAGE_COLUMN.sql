-- Script para adicionar o campo cover_image_url na tabela albums
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna cover_image_url se não existir
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

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'albums' 
ORDER BY ordinal_position;
