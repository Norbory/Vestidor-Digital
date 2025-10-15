export interface ClothingItem {
  id: string;
  name: string;
  type: ClothingType;
  color: string;
  brand?: string;
  imageUrl: string;
  description?: string;
  tags?: string[];
  price?: number;
  sourceUrl?: string; // URL de donde se detectó la prenda
}

export enum ClothingType {
  SHIRT = 'shirt',
  PANTS = 'pants',
  SHOES = 'shoes',
  DRESS = 'dress',
  JACKET = 'jacket',
  SKIRT = 'skirt',
  SHORTS = 'shorts',
  SWEATER = 'sweater',
  ACCESSORY = 'accessory',
  HAT = 'hat',
  BAG = 'bag'
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  imageUrl?: string; // Imagen generada por Gemini
  createdAt: Date;
  isFavorite: boolean;
  description?: string;
}

export interface ClothingFilter {
  type?: ClothingType;
  color?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}