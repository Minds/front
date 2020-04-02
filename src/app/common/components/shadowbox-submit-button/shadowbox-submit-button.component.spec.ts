import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowboxSubmitButtonComponent } from './shadowbox-submit-button.component';

describe('ShadowboxSubmitButtonComponent', () => {
  let component: ShadowboxSubmitButtonComponent;
  let fixture: ComponentFixture<ShadowboxSubmitButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShadowboxSubmitButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowboxSubmitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
