import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClothingItem, ClothingType } from '../../models/clothing.model';
import { ClothingService } from '../../services/clothing.service';

@Component({
  selector: 'app-wardrobe',
  imports: [CommonModule, FormsModule],
  templateUrl: './wardrobe.component.html',
  styleUrl: './wardrobe.component.scss'
})
export class WardrobeComponent {
  @Output() itemAdded = new EventEmitter<ClothingItem>();
  @Output() itemDeleted = new EventEmitter<string>();

  myClothes: ClothingItem[] = [];
  showAddForm = false;
  isLoading = false;
  errorMessage = '';
  
  // Formulario para agregar nueva prenda
  newItem: Partial<ClothingItem> = {
    name: '',
    type: ClothingType.SHIRT,
    color: '',
    brand: '',
    description: '',
    imageUrl: '/assets/placeholder-clothing.jpg'
  };

  clothingTypes = Object.values(ClothingType);

  constructor(private clothingService: ClothingService) {}

  ngOnInit() {
    this.loadWardrobe();
  }

  async loadWardrobe() {
    this.isLoading = true;
    try {
      // Por ahora usamos datos mock, más tarde se conectará con MongoDB
      this.myClothes = await this.clothingService.getMyClothes();
    } catch (error) {
      this.errorMessage = 'Error al cargar el guardarropa';
      console.error('Error loading wardrobe:', error);
    } finally {
      this.isLoading = false;
    }
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  async saveItem() {
    if (!this.newItem.name?.trim() || !this.newItem.color?.trim()) {
      this.errorMessage = 'Nombre y color son obligatorios';
      return;
    }

    try {
      const item: ClothingItem = {
        id: Date.now().toString(), // En MongoDB se generará automáticamente
        name: this.newItem.name!,
        type: this.newItem.type || ClothingType.SHIRT,
        color: this.newItem.color!,
        brand: this.newItem.brand || undefined,
        description: this.newItem.description || undefined,
        imageUrl: this.newItem.imageUrl || '/assets/placeholder-clothing.jpg',
        tags: []
      };

      // Guardar en el servicio (futuro: MongoDB)
      const savedItem = await this.clothingService.saveClothingItem(item);
      
      this.myClothes.unshift(savedItem);
      this.itemAdded.emit(savedItem);
      this.toggleAddForm();
      this.errorMessage = '';
      
    } catch (error) {
      this.errorMessage = 'Error al guardar la prenda';
      console.error('Error saving item:', error);
    }
  }

  async deleteItem(item: ClothingItem) {
    if (confirm(`¿Estás seguro de eliminar "${item.name}"?`)) {
      try {
        await this.clothingService.deleteClothingItem(item.id);
        this.myClothes = this.myClothes.filter(c => c.id !== item.id);
        this.itemDeleted.emit(item.id);
      } catch (error) {
        this.errorMessage = 'Error al eliminar la prenda';
        console.error('Error deleting item:', error);
      }
    }
  }

  selectItem(item: ClothingItem) {
    // Emitir evento para agregar al selector actual
    this.itemAdded.emit(item);
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // En una implementación real, subirías la imagen a un servicio
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newItem.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  resetForm() {
    this.newItem = {
      name: '',
      type: ClothingType.SHIRT,
      color: '',
      brand: '',
      description: '',
      imageUrl: '/assets/placeholder-clothing.jpg'
    };
    this.errorMessage = '';
  }

  // Método para conectar con MongoDB (implementar más tarde)
  async syncWithMongoDB() {
    try {
      this.isLoading = true;
      // await this.clothingService.syncWithDatabase();
      await this.loadWardrobe();
      alert('Sincronización completada (función no implementada aún)');
    } catch (error) {
      this.errorMessage = 'Error en la sincronización';
    } finally {
      this.isLoading = false;
    }
  }

  // Filtrar por tipo
  getItemsByType(type: ClothingType): ClothingItem[] {
    return this.myClothes.filter(item => item.type === type);
  }

  // Obtener estadísticas del guardarropa
  getStats() {
    const stats: { [key: string]: number } = {};
    this.clothingTypes.forEach(type => {
      stats[type] = this.getItemsByType(type).length;
    });
    return stats;
  }
}
