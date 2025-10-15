import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothingSelectorComponent } from './clothing-selector.component';

describe('ClothingSelectorComponent', () => {
  let component: ClothingSelectorComponent;
  let fixture: ComponentFixture<ClothingSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClothingSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClothingSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
