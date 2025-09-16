-- Script para verificar se as tabelas e políticas estão corretas

-- 1. Verificar se a tabela album_cards existe
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'album_cards' 
ORDER BY ordinal_position;

-- 2. Verificar se RLS está habilitado
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    hasrls
FROM pg_tables 
WHERE tablename IN ('albums', 'album_cards');

-- 3. Verificar políticas RLS para album_cards
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'album_cards'
ORDER BY policyname;

-- 4. Verificar políticas RLS para albums
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'albums'
ORDER BY policyname;

-- 5. Testar inserção (substitua pelos IDs reais do seu usuário e álbum)
-- Primeiro, encontre um álbum existente:
SELECT id, name, user_id FROM albums LIMIT 5;

-- Depois teste a inserção (substitua 'album-id-aqui' pelo ID real):
-- INSERT INTO album_cards (album_id, card_id, quantity, notes) 
-- VALUES ('album-id-aqui', 'test-card-123', 1, 'Teste de inserção manual');

-- 6. Verificar dados existentes
SELECT 
    ac.*,
    a.name as album_name,
    a.user_id
FROM album_cards ac
JOIN albums a ON ac.album_id = a.id
LIMIT 10;
