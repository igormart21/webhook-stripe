import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Album = Database['public']['Tables']['albums']['Row']
type AlbumInsert = Database['public']['Tables']['albums']['Insert']
type AlbumUpdate = Database['public']['Tables']['albums']['Update']

export const albumService = {
  // Buscar todos os álbuns do usuário
  async getUserAlbums(userId: string): Promise<Album[]> {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar álbuns:', error)
      throw error
    }

    return data || []
  },

  // Buscar álbuns públicos
  async getPublicAlbums(): Promise<Album[]> {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar álbuns públicos:', error)
      throw error
    }

    return data || []
  },

  // Criar novo álbum
  async createAlbum(album: AlbumInsert): Promise<Album> {
    const { data, error } = await supabase
      .from('albums')
      .insert(album)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar álbum:', error)
      throw error
    }

    return data
  },

  // Atualizar álbum
  async updateAlbum(id: string, updates: AlbumUpdate): Promise<Album> {
    const { data, error } = await supabase
      .from('albums')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar álbum:', error)
      throw error
    }

    return data
  },

  // Deletar álbum
  async deleteAlbum(id: string): Promise<void> {
    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar álbum:', error)
      throw error
    }
  },

  // Buscar álbum por ID
  async getAlbumById(id: string): Promise<Album | null> {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar álbum:', error)
      throw error
    }

    return data
  },

  // Adicionar carta ao álbum
  async addCardToAlbum(albumId: string, cardId: string, quantity: number = 1, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('album_cards')
      .insert({
        album_id: albumId,
        card_id: cardId,
        quantity,
        notes
      })

    if (error) {
      console.error('Erro ao adicionar carta ao álbum:', error)
      throw error
    }
  },

  // Remover carta do álbum
  async removeCardFromAlbum(albumId: string, cardId: string): Promise<void> {
    const { error } = await supabase
      .from('album_cards')
      .delete()
      .eq('album_id', albumId)
      .eq('card_id', cardId)

    if (error) {
      console.error('Erro ao remover carta do álbum:', error)
      throw error
    }
  },

  // Buscar cartas do álbum
  async getAlbumCards(albumId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('album_cards')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar cartas do álbum:', error)
      throw error
    }

    return data || []
  }
}
