import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingCardComponent } from './voting-card.component';

describe('VotingCardComponent', () => {
  let component: VotingCardComponent;
  let fixture: ComponentFixture<VotingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
