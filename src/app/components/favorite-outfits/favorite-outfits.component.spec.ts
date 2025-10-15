import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteOutfitsComponent } from './favorite-outfits.component';

describe('FavoriteOutfitsComponent', () => {
  let component: FavoriteOutfitsComponent;
  let fixture: ComponentFixture<FavoriteOutfitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteOutfitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteOutfitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
