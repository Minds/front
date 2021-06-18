import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from '../../../common/components/button/button.component';

import { NewCardModalComponent } from './new-card-modal.component';

describe('NewCardModalComponent', () => {
  let component: NewCardModalComponent;
  let fixture: ComponentFixture<NewCardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewCardModalComponent, ButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
