import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClothingItem, Outfit } from '../../models/clothing.model';
import { GeminiService } from '../../services/gemini.service';
import { SelectionService } from '../../services/selection.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
// import * as fs from "node:fs"; // No se puede usar fs en el navegador

@Component({
  selector: 'app-image-viewer',
  imports: [CommonModule, FormsModule],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss'
})
export class ImageViewerComponent implements OnInit, OnDestroy {
  selectedItems: ClothingItem[] = [];
  baseImageUrl: string = 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png'; // Foto base del usuario
  
  currentOutfit: Outfit | null = null;
  generatedImageUrl: string = '';
  isGenerating: boolean = false;
  errorMessage: string = '';
  
  // Token de Gemini desde variables de entorno
  geminiToken: string = this.getGeminiToken();
  showTokenInput: boolean = !this.geminiToken;
  
  private subscriptions = new Subscription();

  constructor(
    private geminiService: GeminiService,
    private selectionService: SelectionService
  ) {}

  private getGeminiToken(): string {
    // Primero intentar desde environment
    if (environment.geminiApiKey) {
      return environment.geminiApiKey;
    }
    
    // En desarrollo, cargar desde localStorage
    const saved = localStorage.getItem('gemini_token');
    return saved || '';
  }

  ngOnInit() {
    // Solo cargar token guardado si no hay uno en environment
    if (!environment.geminiApiKey) {
      this.loadSavedToken();
    }
    
    // Suscribirse a los cambios de selección
    this.subscriptions.add(
      this.selectionService.selectedItems$.subscribe(items => {
        this.selectedItems = items;
        this.updatePreview();
        console.log('📱 Image Viewer recibió prendas:', items.length);
      })
    );
    
    // Suscribirse a los cambios del outfit
    this.subscriptions.add(
      this.selectionService.currentOutfit$.subscribe(outfit => {
        this.currentOutfit = outfit;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  updatePreview() {
    if (this.selectedItems.length > 0) {
      this.currentOutfit = {
        id: Date.now().toString(),
        name: 'Conjunto Actual',
        items: [...this.selectedItems],
        createdAt: new Date(),
        isFavorite: false
      };
    }
  }

  async generateWithGemini() {
    if (!this.geminiToken.trim()) {
      this.showTokenInput = true;
      this.errorMessage = 'Por favor, ingresa tu token de Gemini API';
      return;
    }

    if (this.selectedItems.length === 0) {
      this.errorMessage = 'Selecciona al menos una prenda para generar la imagen';
      return;
    }

    this.isGenerating = true;
    this.errorMessage = '';

    try {
      // Crear descripción del outfit para Gemini
      const outfitDescription = await this.createOutfitDescription(this.baseImageUrl, this.selectedItems.map(item => item.imageUrl));
      
      // const generatedUrl = await this.geminiService.generateOutfitImage(
      //   this.baseImageUrl,
      //   outfitDescription,
      //   this.geminiToken
      // );

      const generatedImg: any = await this.geminiService.generateGeminiImage(outfitDescription, this.geminiToken);

      for (const part of generatedImg.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          // Crear una URL de blob para mostrar la imagen generada
          const blob = this.base64ToBlob(imageData, part.inlineData.mimeType || 'image/png');
          this.generatedImageUrl = URL.createObjectURL(blob);
          console.log("✅ Imagen generada y lista para mostrar");
        }
      }

      if (this.generatedImageUrl && this.currentOutfit) {
        this.currentOutfit.imageUrl = this.generatedImageUrl;
      }
    } catch (error) {
      this.errorMessage = 'Error al generar la imagen: ' + (error as Error).message;
    } finally {
      this.isGenerating = false;
    }
  }

  private Img2Base64(imgUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        const base64 = dataURL.split(',')[1];
        resolve(base64);
      };
      img.onerror = reject;
      img.src = imgUrl;
    });
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  private async createOutfitDescription(baseImageUrl: string, selectedImgs: string[]): Promise<any[]> {
    // Convertir cada imagen a Base64
    const base64Images: string[] = [];
    
    for (const imgUrl of selectedImgs) {
      try {
        const base64 = await this.Img2Base64(imgUrl);
        base64Images.push(base64);
        console.log("✅ Base64 Image convertida");
      } catch (error) {
        console.warn("⚠️ Error convirtiendo imagen:", imgUrl, error);
      }
    }

    // Crear prompt para Gemini combinando las imágenes
    const prompt = [];

    prompt.push(...base64Images.map(base64 => ({
      inlineData: {
        mimeType: "image/png",
        data: base64,
      },
    })));

    // Convertir la imagen base a Base64
    try {
      const base64 = await this.Img2Base64(baseImageUrl);
      prompt.push({
        inlineData: {
          mimeType: "image/png",
          data: base64,
        },
      });
      console.log("✅ Base64 Base Image convertida");
    } catch (error) {
      console.warn("⚠️ Error convirtiendo Base Image:", baseImageUrl, error);
    }
    
    const descriptions = this.selectedItems.map(item => 
      `${item.name} (${item.type}) de color ${item.color}${item.brand ? ' marca ' + item.brand : ''}`
    );

    // Prompt mejorado para conservar características físicas
    const improvedPrompt = `Genera una imagen de la misma persona que aparece en la última imagen (conservando exactamente sus características físicas: rostro, complexión, altura, color de piel, cabello, etc.), pero ahora vistiendo las siguientes prendas: ${descriptions.join(', ')}.
    Instrucciones específicas:
    - Mantén EXACTAMENTE la misma persona de la imagen de referencia
    - Conserva sus rasgos faciales, complexión corporal y características físicas
    - Solo cambia la ropa por las prendas especificadas
    - Estilo: fotografía realista, profesional
    - Iluminación: natural, bien distribuida
    - Encuadre: cuerpo completo
    - Fondo: neutro y limpio
    - Pose: natural y relajada

    Las prendas deben verse bien ajustadas y naturales en la persona.`;

    prompt.push({ text: improvedPrompt });

    return prompt;
  }

  clearSelection() {
    this.selectionService.clearSelection();
    this.generatedImageUrl = '';
    this.errorMessage = '';
  }

  saveToken() {
    if (this.geminiToken.trim()) {
      // En una aplicación real, deberías guardar esto de forma segura
      localStorage.setItem('gemini_token', this.geminiToken);
      this.showTokenInput = false;
      this.errorMessage = '';
    }
  }

  loadSavedToken() {
    // Solo cargar desde localStorage si no hay token en environment
    if (!environment.geminiApiKey) {
      const saved = localStorage.getItem('gemini_token');
      if (saved) {
        this.geminiToken = saved;
        this.showTokenInput = false;
      }
    }
  }

  uploadBaseImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.baseImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
