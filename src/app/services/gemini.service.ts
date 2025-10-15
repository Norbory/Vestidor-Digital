import { Injectable } from '@angular/core';
import { GoogleGenAI, Modality } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  private ai: GoogleGenAI | null = null;

  constructor() { }

  private initializeAI(apiKey: string): GoogleGenAI {
    if (!this.ai || !apiKey) {
      this.ai = new GoogleGenAI({ apiKey: apiKey });
    }
    return this.ai;
  }

  async generateGeminiImage(
    prompt: any[],
    apiKey: string
  ) {
    try {
      const ai = this.initializeAI(apiKey);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt
      });
      return response;
    } catch (error) {
      console.error('❌ Error al generar imagen de Gemini:', error);
      throw error;
    }
  }

  async generateOutfitImage(
    baseImageUrl: string, 
    outfitDescription: string, 
    apiToken: string
  ): Promise<string> {
    try {
      // Simular delay de API real
      await this.delay(2000 + Math.random() * 3000);
      
      // Primero validar el token
      if (!apiToken || apiToken.trim().length < 10) {
        throw new Error('Token de API inválido. Debe tener al menos 10 caracteres.');
      }
      
      // Simular llamada a API de Gemini para análisis de texto
      console.log('🤖 Enviando prompt a Gemini:', outfitDescription);
      
      // En desarrollo, simulamos la generación
      if (apiToken.toLowerCase().includes('test') || apiToken === 'demo-token') {
        return this.simulateGeneratedImage(outfitDescription);
      }
      
      // Intentar llamada real a Gemini 2.0 Flash
      const response = await fetch(`${this.API_URL}?key=${apiToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Basándote en esta descripción de outfit: ${outfitDescription}
                     
                     Crea una descripción detallada y profesional para generar una imagen realista donde una persona use exactamente estas prendas. 
                     
                     Incluye:
                     - Pose natural y elegante
                     - Buena iluminación (luz natural o estudio)
                     - Fondo neutro o apropiado
                     - Estilo fotográfico profesional
                     - La persona debe verse confiada y bien vestida
                     
                     La imagen debe ser de cuerpo completo, alta calidad, y mostrar claramente cómo se ve el conjunto completo.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token de API inválido o expirado.');
        } else if (response.status === 429) {
          throw new Error('Límite de API excedido. Intenta más tarde.');
        } else {
          throw new Error(`Error de API: ${response.status} - ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('✅ Respuesta de Gemini recibida');
      
      // Por ahora simulamos la imagen generada
      // En producción integrarías con un servicio de generación de imágenes
      return this.simulateGeneratedImage(outfitDescription);
      
    } catch (error) {
      console.error('❌ Error calling Gemini API:', error);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private simulateGeneratedImage(description: string): string {
    // Simulación: En una implementación real, aquí recibirías la imagen generada
    // Por ahora retornamos una URL que simula la imagen generada
    console.log('🎨 Generando imagen para:', description);
    
    // Array de imágenes de ejemplo para diferentes tipos de outfit
    const exampleImages = [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1494790108755-2616c669a825?w=400',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400'
    ];
    
    // Seleccionar una imagen de ejemplo basada en la descripción
    const imageIndex = Math.abs(description.length) % exampleImages.length;
    return exampleImages[imageIndex];
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${token}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Método auxiliar para cuando se implemente la generación real de imágenes
  async generateImageWithAlternativeService(
    baseImageUrl: string,
    outfitDescription: string,
    apiToken: string
  ): Promise<string> {
    // Aquí podrías integrar con servicios como:
    // - OpenAI DALL-E
    // - Stability AI
    // - Midjourney API
    // - Otros servicios de generación de imágenes
    
    const prompt = `A person wearing ${outfitDescription}, photorealistic, high quality, full body shot, good lighting`;
    
    // Ejemplo de implementación futura:
    /*
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: '512x512'
      })
    });
    */
    
    throw new Error('Servicio de generación de imágenes no implementado aún');
  }
}
