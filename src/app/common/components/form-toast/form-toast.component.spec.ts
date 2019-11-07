import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormToastComponent } from './form-toast.component';

describe('FormToastComponent', () => {
  let component: FormToastComponent;
  let fixture: ComponentFixture<FormToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormToastComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
