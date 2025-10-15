import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./components/image-viewer/image-viewer.component').then(c => c.ImageViewerComponent)
  },
  { 
    path: 'selector', 
    loadComponent: () => import('./components/clothing-selector/clothing-selector.component').then(c => c.ClothingSelectorComponent)
  },
  { 
    path: 'wardrobe', 
    loadComponent: () => import('./components/wardrobe/wardrobe.component').then(c => c.WardrobeComponent)
  },
  { 
    path: 'detector', 
    loadComponent: () => import('./components/link-detector/link-detector.component').then(c => c.LinkDetectorComponent)
  },
  { 
    path: 'outfits', 
    loadComponent: () => import('./components/favorite-outfits/favorite-outfits.component').then(c => c.FavoriteOutfitsComponent)
  },
  { path: '**', redirectTo: '/home' }
];
