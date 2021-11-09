import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassFormComponent } from './compass-form.component';

describe('CompassFormComponent', () => {
  let component: CompassFormComponent;
  let fixture: ComponentFixture<CompassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompassFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
