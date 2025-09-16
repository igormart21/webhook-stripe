-- Script para testar a tabela album_cards e suas políticas RLS

-- 1. Verificar se a tabela existe
SELECT table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'album_cards' 
ORDER BY ordinal_position;

-- 2. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'album_cards';

-- 3. Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'album_cards';

-- 4. Testar inserção (substitua pelos IDs reais)
-- INSERT INTO album_cards (album_id, card_id, quantity, notes) 
-- VALUES ('seu-album-id-aqui', 'test-card-id', 1, 'Teste de inserção');

-- 5. Verificar dados existentes
SELECT * FROM album_cards LIMIT 5;
