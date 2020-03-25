import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackableModalComponent } from './stackable-modal.component';

describe('StackableModalComponent', () => {
  let component: StackableModalComponent;
  let fixture: ComponentFixture<StackableModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StackableModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
