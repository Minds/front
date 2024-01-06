import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPolicyPageComponent } from './custom-policy-page.component';

// ojm
describe('CustomPolicyPageComponent', () => {
  let component: CustomPolicyPageComponent;
  let fixture: ComponentFixture<CustomPolicyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomPolicyPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPolicyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
