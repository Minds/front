import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAdminConsoleEditDomainModalComponent } from './edit-domain-modal.component';
// ojm
describe('NetworkAdminConsoleEditDomainModalComponent', () => {
  let component: NetworkAdminConsoleEditDomainModalComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleEditDomainModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleEditDomainModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      NetworkAdminConsoleEditDomainModalComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
