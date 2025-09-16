# Configuração do Supabase Storage para Upload de Imagens

## 1. Criar Bucket no Supabase

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para **Storage** no menu lateral
4. Clique em **New bucket**
5. Configure o bucket:
   - **Name**: `album-covers`
   - **Public bucket**: ✅ **Marcado** (importante para URLs públicas)
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`

## 2. Configurar Políticas de Acesso (RLS)

Após criar o bucket, configure as políticas de acesso:

### Política para Upload (INSERT)
```sql
CREATE POLICY "Users can upload album covers" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'album-covers' AND
  auth.uid() IS NOT NULL
);
```

### Política para Visualização (SELECT)
```sql
CREATE POLICY "Anyone can view album covers" ON storage.objects
FOR SELECT USING (bucket_id = 'album-covers');
```

### Política para Atualização (UPDATE)
```sql
CREATE POLICY "Users can update own album covers" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'album-covers' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Política para Exclusão (DELETE)
```sql
CREATE POLICY "Users can delete own album covers" ON storage.objects
FOR DELETE USING (
  bucket_id = 'album-covers' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 3. Verificar Configuração

1. No painel do Supabase, vá para **Storage > album-covers**
2. Verifique se o bucket está **público**
3. Teste fazendo upload de uma imagem manualmente

## 4. Testar no Aplicativo

1. Inicie o servidor: `npm run dev`
2. Acesse: `http://localhost:8080/dashboard`
3. Clique em "Criar Novo Álbum"
4. Tente fazer upload de uma imagem
5. Verifique o console do navegador para logs detalhados

## 5. Solução de Problemas

### Erro: "Bucket não existe"
- Verifique se o bucket `album-covers` foi criado
- Confirme que o nome está exatamente como `album-covers`

### Erro: "Permission denied"
- Verifique se as políticas RLS estão configuradas
- Confirme que o usuário está logado

### Erro: "File too large"
- Verifique o limite de tamanho do bucket (5MB)
- Reduza o tamanho da imagem

### Fallback para Base64
Se o Supabase Storage não funcionar, o sistema automaticamente usa base64 como fallback, salvando a imagem diretamente no banco de dados.

## 6. Estrutura de Arquivos

```
Supabase Storage
└── album-covers/
    ├── 1703123456789-abc123.jpg
    ├── 1703123456790-def456.png
    └── 1703123456791-ghi789.webp
```

## 7. URLs Públicas

As imagens serão acessíveis via URLs como:
```
https://seu-projeto.supabase.co/storage/v1/object/public/album-covers/1703123456789-abc123.jpg
```
