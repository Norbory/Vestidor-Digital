import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClothingItem, ClothingType, ClothingFilter } from '../../models/clothing.model';
import { ClothingService } from '../../services/clothing.service';
import { SelectionService } from '../../services/selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clothing-selector',
  imports: [CommonModule, FormsModule],
  templateUrl: './clothing-selector.component.html',
  styleUrl: './clothing-selector.component.scss'
})
export class ClothingSelectorComponent implements OnInit, OnDestroy {

  clothingTypes = Object.values(ClothingType);
  selectedType: ClothingType | '' = '';
  selectedColor = '';
  selectedBrand = '';
  
  clothingItems: ClothingItem[] = [];
  filteredItems: ClothingItem[] = [];
  selectedItems: ClothingItem[] = [];
  isLoading = true;
  
  private subscriptions = new Subscription();

  constructor(
    private clothingService: ClothingService,
    private selectionService: SelectionService
  ) {}

  async ngOnInit() {
    await this.loadClothing();
    
    // Suscribirse a los cambios de selección para actualizar la UI
    this.subscriptions.add(
      this.selectionService.selectedItems$.subscribe(items => {
        this.selectedItems = items;
        console.log('👕 Selector recibió selección actualizada:', items.length);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async loadClothing() {
    try {
      this.isLoading = true;
      this.clothingItems = await this.clothingService.getMyClothes();
      this.filteredItems = [...this.clothingItems];
      console.log('📦 Cargadas', this.clothingItems.length, 'prendas');
    } catch (error) {
      console.error('Error cargando ropa:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onFilterChange() {
    const filter: ClothingFilter = {
      type: this.selectedType || undefined,
      color: this.selectedColor || undefined,
      brand: this.selectedBrand || undefined
    };

    this.filteredItems = this.clothingItems.filter(item => {
      return (!filter.type || item.type === filter.type) &&
             (!filter.color || item.color.toLowerCase().includes(filter.color.toLowerCase())) &&
             (!filter.brand || item.brand?.toLowerCase().includes(filter.brand.toLowerCase()));
    });

    console.log('🔍 Filtros aplicados. Items mostrados:', this.filteredItems.length);
  }

  onItemSelect(item: ClothingItem) {
    if (this.isItemSelected(item.id)) {
      this.selectionService.removeItem(item.id);
    } else {
      this.selectionService.addItem(item);
    }
  }

  isItemSelected(itemId: string): boolean {
    return this.selectionService.isItemSelected(itemId);
  }

  clearFilters() {
    this.selectedType = '';
    this.selectedColor = '';
    this.selectedBrand = '';
    this.onFilterChange();
  }

  clearSelection() {
    this.selectionService.clearSelection();
  }

  getSelectionCount(): number {
    return this.selectionService.getSelectionCount();
  }
}
