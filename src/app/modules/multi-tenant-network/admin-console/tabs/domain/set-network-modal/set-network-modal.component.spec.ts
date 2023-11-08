import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetNetworkModalComponent } from './set-network-modal.component';
// ojm
describe('SetNetworkModalComponent', () => {
  let component: SetNetworkModalComponent;
  let fixture: ComponentFixture<SetNetworkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetNetworkModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SetNetworkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
