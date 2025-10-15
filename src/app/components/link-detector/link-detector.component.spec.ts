import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDetectorComponent } from './link-detector.component';

describe('LinkDetectorComponent', () => {
  let component: LinkDetectorComponent;
  let fixture: ComponentFixture<LinkDetectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkDetectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
