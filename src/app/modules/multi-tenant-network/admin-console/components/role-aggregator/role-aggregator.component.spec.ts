import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAggregatorComponent } from './role-aggregator.component';

describe('RoleAggregatorComponent', () => {
  let component: RoleAggregatorComponent;
  let fixture: ComponentFixture<RoleAggregatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleAggregatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleAggregatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
