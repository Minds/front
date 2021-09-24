import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedImageComponent } from './embedded-image.component';

describe('EmbeddedImageComponent', () => {
  let component: EmbeddedImageComponent;
  let fixture: ComponentFixture<EmbeddedImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmbeddedImageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
