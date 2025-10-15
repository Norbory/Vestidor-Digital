import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClothingItem, Outfit } from '../models/clothing.model';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private selectedItemsSubject = new BehaviorSubject<ClothingItem[]>([]);
  public selectedItems$ = this.selectedItemsSubject.asObservable();

  private currentOutfitSubject = new BehaviorSubject<Outfit | null>(null);
  public currentOutfit$ = this.currentOutfitSubject.asObservable();

  constructor() {
    // Cargar selección guardada del localStorage
    this.loadFromStorage();
    
    // Suscribirse a cambios para actualizar localStorage
    this.selectedItems$.subscribe(items => {
      this.saveToStorage(items);
      this.updateCurrentOutfit(items);
    });
  }

  // Obtener prendas seleccionadas actuales
  get selectedItems(): ClothingItem[] {
    return this.selectedItemsSubject.value;
  }

  // Obtener outfit actual
  get currentOutfit(): Outfit | null {
    return this.currentOutfitSubject.value;
  }

  // Agregar prenda a la selección
  addItem(item: ClothingItem): void {
    const currentItems = this.selectedItems;
    const existingIndex = currentItems.findIndex(i => i.id === item.id);
    
    if (existingIndex === -1) {
      const newItems = [...currentItems, item];
      this.selectedItemsSubject.next(newItems);
      console.log('✅ Prenda agregada:', item.name);
    } else {
      console.log('⚠️ Prenda ya seleccionada:', item.name);
    }
  }

  // Remover prenda de la selección
  removeItem(itemId: string): void {
    const currentItems = this.selectedItems;
    const newItems = currentItems.filter(item => item.id !== itemId);
    this.selectedItemsSubject.next(newItems);
    console.log('🗑️ Prenda removida');
  }

  // Limpiar toda la selección
  clearSelection(): void {
    this.selectedItemsSubject.next([]);
    this.currentOutfitSubject.next(null);
    localStorage.removeItem('selected_items');
    console.log('🧹 Selección limpiada');
  }

  // Verificar si una prenda está seleccionada
  isItemSelected(itemId: string): boolean {
    return this.selectedItems.some(item => item.id === itemId);
  }

  // Establecer un outfit completo
  setOutfit(outfit: Outfit): void {
    this.selectedItemsSubject.next([...outfit.items]);
    this.currentOutfitSubject.next(outfit);
  }

  // Obtener número de prendas seleccionadas
  getSelectionCount(): number {
    return this.selectedItems.length;
  }

  // Actualizar el outfit actual basado en las prendas seleccionadas
  private updateCurrentOutfit(items: ClothingItem[]): void {
    if (items.length > 0) {
      const outfit: Outfit = {
        id: 'current-selection',
        name: `Conjunto Actual (${items.length} prendas)`,
        items: [...items],
        createdAt: new Date(),
        isFavorite: false
      };
      this.currentOutfitSubject.next(outfit);
    } else {
      this.currentOutfitSubject.next(null);
    }
  }

  // Guardar en localStorage
  private saveToStorage(items: ClothingItem[]): void {
    try {
      localStorage.setItem('selected_items', JSON.stringify(items));
    } catch (error) {
      console.error('Error guardando selección:', error);
    }
  }

  // Cargar desde localStorage
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('selected_items');
      if (saved) {
        const items = JSON.parse(saved);
        this.selectedItemsSubject.next(items);
      }
    } catch (error) {
      console.error('Error cargando selección:', error);
      this.selectedItemsSubject.next([]);
    }
  }

  // Método para debugging
  debugSelection(): void {
    console.log('🔍 Estado actual de selección:');
    console.log('Prendas seleccionadas:', this.selectedItems);
    console.log('Outfit actual:', this.currentOutfit);
  }
}