import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from '../../../utils/mock';

import { NewCardModalComponent } from './new-card-modal.component';

describe('NewCardModalComponent', () => {
  let component: NewCardModalComponent;
  let fixture: ComponentFixture<NewCardModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewCardModalComponent,
        MockComponent({ selector: 'm-payments__newCard' }),
        MockComponent({ selector: 'm-button' }),
      ],
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
