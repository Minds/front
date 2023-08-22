import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuePropCardComponent } from './card.component';

describe('ValuePropCardComponent', () => {
  let component: ValuePropCardComponent;
  let fixture: ComponentFixture<ValuePropCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValuePropCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValuePropCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
