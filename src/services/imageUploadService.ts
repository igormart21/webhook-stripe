import { supabase } from '@/lib/supabase'

export const imageUploadService = {
  // Testar conectividade com o Supabase Storage
  async testStorageConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage.listBuckets()
      if (error) {
        console.error('Erro na conexão com Storage:', error)
        return false
      }
      console.log('Conexão com Storage OK. Buckets disponíveis:', data?.map(b => b.name))
      return true
    } catch (error) {
      console.error('Erro ao testar conexão:', error)
      return false
    }
  },

  // Upload alternativo usando base64 (fallback)
  async uploadImageAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result as string)
      }
      reader.onerror = () => {
        reject(new Error('Erro ao converter imagem para base64'))
      }
      reader.readAsDataURL(file)
    })
  },
  // Upload de imagem para o Supabase Storage
  async uploadImage(file: File, bucket: string = 'album-covers'): Promise<string> {
    try {
      // Testar conectividade primeiro
      const isConnected = await this.testStorageConnection()
      if (!isConnected) {
        console.warn('Supabase Storage não disponível, usando fallback base64')
        return await this.uploadImageAsBase64(file)
      }

      // Primeiro, verificar se o bucket existe
      await this.ensureBucketExists(bucket)
      
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      console.log('Tentando fazer upload do arquivo:', fileName, 'para bucket:', bucket)
      
      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Erro detalhado no upload:', error)
        console.warn('Tentando fallback para base64...')
        return await this.uploadImageAsBase64(file)
      }

      console.log('Upload bem-sucedido:', data)

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      console.log('URL pública gerada:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('Erro no upload da imagem:', error)
      console.warn('Tentando fallback para base64...')
      try {
        return await this.uploadImageAsBase64(file)
      } catch (fallbackError) {
        throw new Error(`Erro ao fazer upload da imagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    }
  },

  // Deletar imagem do Supabase Storage
  async deleteImage(imageUrl: string, bucket: string = 'album-covers'): Promise<void> {
    try {
      // Extrair nome do arquivo da URL
      const fileName = imageUrl.split('/').pop()
      if (!fileName) {
        throw new Error('URL de imagem inválida')
      }

      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName])

      if (error) {
        console.error('Erro ao deletar imagem:', error)
        throw new Error('Erro ao deletar imagem')
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      throw new Error('Erro ao deletar imagem')
    }
  },

  // Verificar se o bucket existe, se não, criar
  async ensureBucketExists(bucket: string = 'album-covers'): Promise<void> {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets()
      
      if (error) {
        console.error('Erro ao listar buckets:', error)
        throw new Error(`Erro ao verificar buckets: ${error.message}`)
      }

      const bucketExists = buckets?.some(b => b.name === bucket)
      
      if (!bucketExists) {
        console.log(`Bucket ${bucket} não existe. Tentando criar...`)
        
        // Tentar criar o bucket
        const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucket, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        })

        if (createError) {
          console.error('Erro ao criar bucket:', createError)
          throw new Error(`Bucket ${bucket} não existe e não foi possível criar. Crie manualmente no painel do Supabase.`)
        }

        console.log('Bucket criado com sucesso:', newBucket)
      } else {
        console.log(`Bucket ${bucket} já existe`)
      }
    } catch (error) {
      console.error('Erro ao verificar/criar bucket:', error)
      throw error
    }
  }
}
