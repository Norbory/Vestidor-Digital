import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClothingItem, ClothingType } from '../../models/clothing.model';

interface DetectedItem extends ClothingItem {
  confidence: number;
  originalPrice?: number;
  onSale?: boolean;
}

@Component({
  selector: 'app-link-detector',
  imports: [CommonModule, FormsModule],
  templateUrl: './link-detector.component.html',
  styleUrl: './link-detector.component.scss'
})
export class LinkDetectorComponent {
  @Output() itemDetected = new EventEmitter<ClothingItem>();

  inputUrl = '';
  isAnalyzing = false;
  analysisComplete = false;
  errorMessage = '';
  detectedItems: DetectedItem[] = [];
  
  // Sitios web soportados (simulación)
  supportedSites = [
    'zara.com', 'hm.com', 'asos.com', 'amazon.com',
    'shein.com', 'mercadolibre.com', 'falabella.com'
  ];

  constructor() {}

  async analyzeUrl() {
    if (!this.inputUrl.trim()) {
      this.errorMessage = 'Por favor, ingresa una URL válida';
      return;
    }

    // Validar URL
    try {
      new URL(this.inputUrl);
    } catch {
      this.errorMessage = 'La URL ingresada no es válida';
      return;
    }

    this.isAnalyzing = true;
    this.errorMessage = '';
    this.analysisComplete = false;
    this.detectedItems = [];

    try {
      // Simular análisis de la página (en implementación real se usaría scraping o APIs)
      await this.simulateAnalysis();
      this.analysisComplete = true;
      
    } catch (error) {
      this.errorMessage = 'Error al analizar la página: ' + (error as Error).message;
    } finally {
      this.isAnalyzing = false;
    }
  }

  private async simulateAnalysis(): Promise<void> {
    // Simular tiempo de análisis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular detección de prendas basada en la URL
    const domain = this.extractDomain(this.inputUrl);
    
    if (!this.supportedSites.some(site => domain.includes(site.replace('.com', '')))) {
      throw new Error('Sitio web no soportado aún. Sitios soportados: ' + this.supportedSites.join(', '));
    }

    // Generar items simulados basados en el dominio
    this.detectedItems = this.generateMockDetectedItems(domain);
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return '';
    }
  }

  private generateMockDetectedItems(domain: string): DetectedItem[] {
    const mockItems: DetectedItem[] = [];

    // Simular diferentes tipos de prendas según el sitio
    if (domain.includes('zara')) {
      mockItems.push({
        id: 'detected-' + Date.now(),
        name: 'Blazer Estructura Oversize',
        type: ClothingType.JACKET,
        color: 'negro',
        brand: 'Zara',
        imageUrl: '/assets/detected/zara-blazer.jpg',
        description: 'Blazer oversize de estructura con solapas de pico',
        confidence: 0.95,
        originalPrice: 79.95,
        sourceUrl: this.inputUrl
      });
    } else if (domain.includes('hm') || domain.includes('h&m')) {
      mockItems.push({
        id: 'detected-' + Date.now(),
        name: 'Jersey de Punto Fino',
        type: ClothingType.SWEATER,
        color: 'beige',
        brand: 'H&M',
        imageUrl: '/assets/detected/hm-sweater.jpg',
        description: 'Jersey de punto fino con cuello redondo',
        confidence: 0.88,
        originalPrice: 24.99,
        onSale: true,
        sourceUrl: this.inputUrl
      });
    } else if (domain.includes('amazon')) {
      mockItems.push(
        {
          id: 'detected-' + Date.now() + '-1',
          name: 'Zapatillas Deportivas Blancas',
          type: ClothingType.SHOES,
          color: 'blanco',
          brand: 'Nike',
          imageUrl: '/assets/detected/nike-shoes.jpg',
          description: 'Zapatillas deportivas de entrenamiento',
          confidence: 0.92,
          originalPrice: 89.99,
          sourceUrl: this.inputUrl
        },
        {
          id: 'detected-' + Date.now() + '-2',
          name: 'Camiseta Básica Algodón',
          type: ClothingType.SHIRT,
          color: 'gris',
          brand: 'Amazon Essentials',
          imageUrl: '/assets/detected/basic-tee.jpg',
          description: 'Camiseta básica 100% algodón',
          confidence: 0.85,
          originalPrice: 15.99,
          sourceUrl: this.inputUrl
        }
      );
    } else {
      // Generar items genéricos para otros sitios
      mockItems.push({
        id: 'detected-' + Date.now(),
        name: 'Prenda Detectada',
        type: ClothingType.SHIRT,
        color: 'azul',
        brand: 'Marca Detectada',
        imageUrl: '/assets/placeholder-clothing.jpg',
        description: 'Prenda encontrada en la página web',
        confidence: 0.75,
        sourceUrl: this.inputUrl
      });
    }

    return mockItems;
  }

  selectDetectedItem(item: DetectedItem) {
    // Convertir el item detectado a un ClothingItem normal
    const clothingItem: ClothingItem = {
      id: item.id,
      name: item.name,
      type: item.type,
      color: item.color,
      brand: item.brand,
      imageUrl: item.imageUrl,
      description: item.description,
      sourceUrl: item.sourceUrl,
      price: item.originalPrice
    };

    this.itemDetected.emit(clothingItem);
  }

  addToWardrobe(item: DetectedItem) {
    // Emitir evento para agregar al guardarropa
    this.selectDetectedItem(item);
    alert(`"${item.name}" agregado al selector de prendas`);
  }

  openOriginalLink(url: string) {
    window.open(url, '_blank');
  }

  clearResults() {
    this.detectedItems = [];
    this.analysisComplete = false;
    this.errorMessage = '';
    this.inputUrl = '';
  }

  // Método para futura implementación real
  private async realWebScraping(url: string): Promise<DetectedItem[]> {
    // TODO: Implementar scraping real con APIs como:
    // - Puppeteer/Playwright para scraping
    // - APIs de tiendas específicas
    // - Servicios de detección de productos con IA
    // - OCR para detectar texto en imágenes
    
    throw new Error('Web scraping real no implementado aún');
  }

  // Método para análisis con IA de imágenes
  private async analyzeProductImages(imageUrls: string[]): Promise<DetectedItem[]> {
    // TODO: Integrar con servicios de análisis de imagen como:
    // - Google Vision API
    // - Amazon Rekognition
    // - Azure Computer Vision
    // - Servicios especializados en moda
    
    throw new Error('Análisis de imágenes con IA no implementado aún');
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.9) return '#28a745'; // Verde
    if (confidence >= 0.7) return '#ffc107'; // Amarillo
    return '#dc3545'; // Rojo
  }

  getConfidenceText(confidence: number): string {
    if (confidence >= 0.9) return 'Alta';
    if (confidence >= 0.7) return 'Media';
    return 'Baja';
  }
}
