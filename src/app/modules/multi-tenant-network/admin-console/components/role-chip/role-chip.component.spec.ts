import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleChipComponent } from './role-chip.component';

describe('RoleChipComponent', () => {
  let component: RoleChipComponent;
  let fixture: ComponentFixture<RoleChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
