import { Injectable } from '@angular/core';
import { ClothingItem, ClothingType, Outfit, ClothingFilter } from '../models/clothing.model';

@Injectable({
  providedIn: 'root'
})
export class ClothingService {
  private readonly STORAGE_KEY = 'wardrobe_items';
  private readonly OUTFITS_KEY = 'saved_outfits';

  // Datos mock para desarrollo (serán reemplazados por MongoDB)
  private mockClothes: ClothingItem[] = [
    // Camisas
    {
      id: '1',
      name: 'Camisa Blanca Formal',
      type: ClothingType.SHIRT,
      color: 'blanco',
      brand: 'Hugo Boss',
      imageUrl: 'https://scabal.com/cdn/shop/files/4400239_I.jpg?v=1716203255&width=1445',
      description: 'Camisa formal de manga larga'
    },
    {
      id: '2',
      name: 'Camisa Azul Cielo',
      type: ClothingType.SHIRT,
      color: 'azul',
      brand: 'Ralph Lauren',
      imageUrl: 'https://m.media-amazon.com/images/I/519-6fgzdQL._UY1000_.jpg',
      description: 'Camisa casual de algodón'
    },
    {
      id: '3',
      name: 'Camisa Rosa Pastel',
      type: ClothingType.SHIRT,
      color: 'rosa',
      brand: 'Zara',
      imageUrl: 'https://i.pinimg.com/736x/85/45/9b/85459baf7f68204dcf08f509de2a1fb3.jpg',
      description: 'Camisa elegante rosa claro'
    },
    
    // Pantalones
    {
      id: '4',
      name: 'Pantalón Negro Formal',
      type: ClothingType.PANTS,
      color: 'negro',
      brand: 'Zara',
      imageUrl: 'https://media.falabella.com/falabellaPE/120195552_01/w=1500,h=1500,fit=pad',
      description: 'Pantalón de vestir negro'
    },
    {
      id: '5',
      name: 'Jeans Azul Oscuro',
      type: ClothingType.PANTS,
      color: 'azul oscuro',
      brand: 'Levi\'s',
      imageUrl: 'https://armatura.com.co/cdn/shop/files/pantalon-hombre-jean-slim-azul-oscuro-frente.webp?v=1727450366&width=1080',
      description: 'Jeans clásicos de corte slim'
    },
    {
      id: '6',
      name: 'Pantalón Beige Chino',
      type: ClothingType.PANTS,
      color: 'beige',
      brand: 'Gap',
      imageUrl: 'https://www.patucos.pe/wp-content/uploads/2024/04/13-00530-016-L-5.jpg',
      description: 'Pantalón casual chino'
    },
    
    // Zapatos
    {
      id: '7',
      name: 'Zapatos Oxford Marrón',
      type: ClothingType.SHOES,
      color: 'marrón',
      brand: 'Clarks',
      imageUrl: 'https://elbosqueperu.vtexassets.com/arquivos/ids/166202-800-800?v=638369630958100000&width=800&height=800&aspect=true',
      description: 'Zapatos de cuero marrón'
    },
    {
      id: '8',
      name: 'Zapatillas Blancas',
      type: ClothingType.SHOES,
      color: 'blanco',
      brand: 'Nike',
      imageUrl: 'https://img.kwcdn.com/product/fancy/d192cbf0-39e5-41c8-b2ae-e8254e98f5e4.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp',
      description: 'Zapatillas deportivas blancas'
    },
    {
      id: '9',
      name: 'Zapatos Negros Formales',
      type: ClothingType.SHOES,
      color: 'negro',
      brand: 'Cole Haan',
      imageUrl: 'https://i.pinimg.com/474x/7a/38/fb/7a38fb48067b565992cf2a09461c660b.jpg',
      description: 'Zapatos de vestir negros'
    },
    
    // Vestidos
    {
      id: '10',
      name: 'Vestido Rojo Elegante',
      type: ClothingType.DRESS,
      color: 'rojo',
      brand: 'H&M',
      imageUrl: 'https://oechsle.vteximg.com.br/arquivos/ids/22243673-800-800/2950176.jpg?v=638944291512600000',
      description: 'Vestido casual rojo'
    },
    {
      id: '11',
      name: 'Vestido Negro Cocktail',
      type: ClothingType.DRESS,
      color: 'negro',
      brand: 'Forever 21',
      imageUrl: 'https://e00-telva.uecdn.es/assets/multimedia/imagenes/2022/07/09/16573240449292.jpg',
      description: 'Vestido elegante para ocasiones especiales'
    },
    
    // Chaquetas
    {
      id: '12',
      name: 'Chaqueta Denim Azul',
      type: ClothingType.JACKET,
      color: 'azul',
      brand: 'Levi\'s',
      imageUrl: 'https://shop.mango.com/assets/rcs/pics/static/T3/fotos/S/37074385_TO_B.jpg?imwidth=2048&imdensity=1&ts=1657191237377',
      description: 'Chaqueta de mezclilla clásica'
    },
    {
      id: '13',
      name: 'Blazer Negro Formal',
      type: ClothingType.JACKET,
      color: 'negro',
      brand: 'Hugo Boss',
      imageUrl: 'https://e00-telva.uecdn.es/assets/multimedia/imagenes/2023/03/21/16794083992866.jpg',
      description: 'Blazer elegante para oficina'
    },
    {
      id: '14',
      name: 'Abrigo Camel',
      type: ClothingType.JACKET,
      color: 'beige',
      brand: 'Zara',
      imageUrl: 'https://home.ripley.com.pe/Attachment/WOP_5/2005336696420/2005336696420-1.jpg',
      description: 'Abrigo largo color camel'
    },
    
    // Accesorios
    {
      id: '15',
      name: 'Cinturón de Cuero Negro',
      type: ClothingType.ACCESSORY,
      color: 'negro',
      brand: 'Tommy Hilfiger',
      imageUrl: 'https://oechsle.vteximg.com.br/arquivos/ids/14234373/2283954.jpg?v=638155767980000000',
      description: 'Cinturón clásico de cuero'
    },
    {
      id: '16',
      name: 'Reloj Deportivo',
      type: ClothingType.ACCESSORY,
      color: 'negro',
      brand: 'Casio',
      imageUrl: 'https://oechsle.vteximg.com.br/arquivos/ids/11314577/imageUrl_2.jpg?v=637986566814100000',
      description: 'Reloj digital deportivo'
    }
  ];

  constructor() { }

  // Obtener toda la ropa del guardarropa
  async getMyClothes(): Promise<ClothingItem[]> {
    try {
      // Simular llamada async (más tarde será llamada real a MongoDB)
      await this.delay(500);
      
      // Por ahora usa localStorage, más tarde MongoDB
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const storedItems = JSON.parse(stored);
        return [...this.mockClothes, ...storedItems];
      }
      
      return [...this.mockClothes];
    } catch (error) {
      console.error('Error loading clothes:', error);
      return this.mockClothes;
    }
  }

  // Guardar nueva prenda
  async saveClothingItem(item: ClothingItem): Promise<ClothingItem> {
    try {
      await this.delay(300);
      
      // Por ahora guarda en localStorage, más tarde MongoDB
      const stored = this.getStoredItems();
      const newItem = { ...item, id: Date.now().toString() };
      stored.push(newItem);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
      
      return newItem;
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    }
  }

  // Eliminar prenda
  async deleteClothingItem(itemId: string): Promise<void> {
    try {
      await this.delay(200);
      
      const stored = this.getStoredItems();
      const filtered = stored.filter(item => item.id !== itemId);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  // Actualizar prenda existente
  async updateClothingItem(item: ClothingItem): Promise<ClothingItem> {
    try {
      await this.delay(300);
      
      const stored = this.getStoredItems();
      const index = stored.findIndex(i => i.id === item.id);
      
      if (index >= 0) {
        stored[index] = item;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
        return item;
      }
      
      throw new Error('Item not found');
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  // Filtrar ropa
  async filterClothes(filter: ClothingFilter): Promise<ClothingItem[]> {
    const allClothes = await this.getMyClothes();
    
    return allClothes.filter(item => {
      return (!filter.type || item.type === filter.type) &&
             (!filter.color || item.color.toLowerCase().includes(filter.color.toLowerCase())) &&
             (!filter.brand || item.brand?.toLowerCase().includes(filter.brand.toLowerCase()));
    });
  }

  // === MANEJO DE CONJUNTOS ===

  // Obtener conjuntos guardados
  async getSavedOutfits(): Promise<Outfit[]> {
    try {
      await this.delay(300);
      const stored = localStorage.getItem(this.OUTFITS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading outfits:', error);
      return [];
    }
  }

  // Guardar conjunto
  async saveOutfit(outfit: Outfit): Promise<Outfit> {
    try {
      await this.delay(300);
      
      const stored = await this.getSavedOutfits();
      const newOutfit = { ...outfit, id: Date.now().toString() };
      stored.push(newOutfit);
      
      localStorage.setItem(this.OUTFITS_KEY, JSON.stringify(stored));
      return newOutfit;
    } catch (error) {
      console.error('Error saving outfit:', error);
      throw error;
    }
  }

  // Eliminar conjunto
  async deleteOutfit(outfitId: string): Promise<void> {
    try {
      await this.delay(200);
      
      const stored = await this.getSavedOutfits();
      const filtered = stored.filter(outfit => outfit.id !== outfitId);
      
      localStorage.setItem(this.OUTFITS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting outfit:', error);
      throw error;
    }
  }

  // Marcar/desmarcar como favorito
  async toggleFavorite(outfitId: string): Promise<Outfit> {
    try {
      const stored = await this.getSavedOutfits();
      const outfit = stored.find(o => o.id === outfitId);
      
      if (outfit) {
        outfit.isFavorite = !outfit.isFavorite;
        localStorage.setItem(this.OUTFITS_KEY, JSON.stringify(stored));
        return outfit;
      }
      
      throw new Error('Outfit not found');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  // === MÉTODOS AUXILIARES ===

  private getStoredItems(): ClothingItem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // === MÉTODOS PARA FUTURA INTEGRACIÓN CON MONGODB ===

  // Configurar conexión con MongoDB (implementar más tarde)
  async connectToMongoDB(): Promise<boolean> {
    try {
      // TODO: Implementar conexión real con MongoDB
      console.log('Conectando a MongoDB...');
      await this.delay(1000);
      return true;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      return false;
    }
  }

  // Sincronizar datos locales con MongoDB
  async syncWithDatabase(): Promise<void> {
    try {
      // TODO: Implementar sincronización real
      console.log('Sincronizando con base de datos...');
      await this.delay(2000);
      
      // Aquí se implementaría:
      // 1. Subir cambios locales a MongoDB
      // 2. Descargar cambios remotos
      // 3. Resolver conflictos si existen
      
    } catch (error) {
      console.error('Error syncing with database:', error);
      throw error;
    }
  }

  // Método para migrar datos cuando se implemente MongoDB
  async migrateToDabase(): Promise<void> {
    try {
      const localClothes = this.getStoredItems();
      const localOutfits = await this.getSavedOutfits();
      
      // TODO: Enviar datos a MongoDB
      console.log('Migrando', localClothes.length, 'prendas y', localOutfits.length, 'conjuntos');
      
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }
}
