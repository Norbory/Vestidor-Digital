import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Outfit, ClothingItem } from '../../models/clothing.model';
import { ClothingService } from '../../services/clothing.service';

@Component({
  selector: 'app-favorite-outfits',
  imports: [CommonModule, FormsModule],
  templateUrl: './favorite-outfits.component.html',
  styleUrl: './favorite-outfits.component.scss'
})
export class FavoriteOutfitsComponent {
  @Input() currentOutfit: Outfit | null = null;
  @Output() outfitSelected = new EventEmitter<Outfit>();
  @Output() outfitDeleted = new EventEmitter<string>();

  savedOutfits: Outfit[] = [];
  favoriteOutfits: Outfit[] = [];
  isLoading = false;
  errorMessage = '';
  
  showSaveDialog = false;
  newOutfitName = '';
  newOutfitDescription = '';

  // Filtros y vista
  showOnlyFavorites = false;
  sortBy: 'date' | 'name' | 'favorites' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(private clothingService: ClothingService) {}

  ngOnInit() {
    this.loadOutfits();
  }

  async loadOutfits() {
    this.isLoading = true;
    try {
      this.savedOutfits = await this.clothingService.getSavedOutfits();
      this.updateFavoritesList();
    } catch (error) {
      this.errorMessage = 'Error al cargar los conjuntos';
      console.error('Error loading outfits:', error);
    } finally {
      this.isLoading = false;
    }
  }

  updateFavoritesList() {
    this.favoriteOutfits = this.savedOutfits.filter(outfit => outfit.isFavorite);
  }

  getDisplayedOutfits(): Outfit[] {
    let outfits = this.showOnlyFavorites ? this.favoriteOutfits : this.savedOutfits;

    // Aplicar ordenamiento
    outfits = [...outfits].sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'favorites':
          comparison = (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
          break;
      }

      return this.sortOrder === 'desc' ? -comparison : comparison;
    });

    return outfits;
  }

  openSaveDialog() {
    if (!this.currentOutfit || this.currentOutfit.items.length === 0) {
      this.errorMessage = 'No hay conjunto actual para guardar';
      return;
    }

    this.showSaveDialog = true;
    this.newOutfitName = this.currentOutfit.name || '';
    this.newOutfitDescription = this.currentOutfit.description || '';
    this.errorMessage = '';
  }

  async saveCurrentOutfit() {
    if (!this.currentOutfit || !this.newOutfitName.trim()) {
      this.errorMessage = 'El nombre del conjunto es obligatorio';
      return;
    }

    try {
      const outfitToSave: Outfit = {
        ...this.currentOutfit,
        id: '', // Se generará en el servicio
        name: this.newOutfitName.trim(),
        description: this.newOutfitDescription.trim() || undefined,
        createdAt: new Date(),
        isFavorite: false
      };

      const savedOutfit = await this.clothingService.saveOutfit(outfitToSave);
      this.savedOutfits.unshift(savedOutfit);
      this.updateFavoritesList();
      
      this.closeSaveDialog();
      this.errorMessage = '';
      
    } catch (error) {
      this.errorMessage = 'Error al guardar el conjunto';
      console.error('Error saving outfit:', error);
    }
  }

  closeSaveDialog() {
    this.showSaveDialog = false;
    this.newOutfitName = '';
    this.newOutfitDescription = '';
  }

  async toggleFavorite(outfit: Outfit) {
    try {
      const updatedOutfit = await this.clothingService.toggleFavorite(outfit.id);
      
      // Actualizar en la lista local
      const index = this.savedOutfits.findIndex(o => o.id === outfit.id);
      if (index >= 0) {
        this.savedOutfits[index] = updatedOutfit;
      }
      
      this.updateFavoritesList();
      
    } catch (error) {
      this.errorMessage = 'Error al actualizar favorito';
      console.error('Error toggling favorite:', error);
    }
  }

  async deleteOutfit(outfit: Outfit) {
    if (confirm(`¿Estás seguro de eliminar el conjunto "${outfit.name}"?`)) {
      try {
        await this.clothingService.deleteOutfit(outfit.id);
        
        this.savedOutfits = this.savedOutfits.filter(o => o.id !== outfit.id);
        this.updateFavoritesList();
        this.outfitDeleted.emit(outfit.id);
        
      } catch (error) {
        this.errorMessage = 'Error al eliminar el conjunto';
        console.error('Error deleting outfit:', error);
      }
    }
  }

  selectOutfit(outfit: Outfit) {
    this.outfitSelected.emit(outfit);
  }

  getOutfitPreviewText(outfit: Outfit): string {
    const itemNames = outfit.items.map(item => item.name).slice(0, 3);
    const remaining = outfit.items.length - 3;
    
    let text = itemNames.join(', ');
    if (remaining > 0) {
      text += ` y ${remaining} más`;
    }
    
    return text;
  }

  getOutfitItemsByType(outfit: Outfit): { [key: string]: ClothingItem[] } {
    const grouped: { [key: string]: ClothingItem[] } = {};
    
    outfit.items.forEach(item => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push(item);
    });
    
    return grouped;
  }

  clearFilters() {
    this.showOnlyFavorites = false;
    this.sortBy = 'date';
    this.sortOrder = 'desc';
  }

  // Método para exportar conjuntos (futuro)
  exportOutfits() {
    try {
      const data = JSON.stringify(this.savedOutfits, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `conjuntos-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      this.errorMessage = 'Error al exportar conjuntos';
      console.error('Error exporting outfits:', error);
    }
  }

  // Método para importar conjuntos (futuro)
  onFileImport(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        try {
          const importedOutfits = JSON.parse(e.target.result);
          // TODO: Validar formato y guardar conjuntos importados
          console.log('Imported outfits:', importedOutfits);
        } catch (error) {
          this.errorMessage = 'Error al importar conjuntos: formato inválido';
        }
      };
      reader.readAsText(file);
    }
  }

  getStats() {
    return {
      total: this.savedOutfits.length,
      favorites: this.favoriteOutfits.length,
      withImages: this.savedOutfits.filter(o => o.imageUrl).length,
      recent: this.savedOutfits.filter(o => {
        const daysDiff = (Date.now() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      }).length
    };
  }
}
