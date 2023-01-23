import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostConsoleStatsBarComponent } from './stats-bar.component';

describe('BoostConsoleStatsBarComponent', () => {
  let component: BoostConsoleStatsBarComponent;
  let fixture: ComponentFixture<BoostConsoleStatsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoostConsoleStatsBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostConsoleStatsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
