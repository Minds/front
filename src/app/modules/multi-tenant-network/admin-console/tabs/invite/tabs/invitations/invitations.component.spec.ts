import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationsComponent } from './invitations.component';

describe('InvitationsComponent', () => {
  let component: InvitationsComponent;
  let fixture: ComponentFixture<InvitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvitationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
