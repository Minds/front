import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowboxLayoutComponent } from './shadowbox-layout.component';

describe('ShadowboxLayoutComponent', () => {
  let component: ShadowboxLayoutComponent;
  let fixture: ComponentFixture<ShadowboxLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShadowboxLayoutComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowboxLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
