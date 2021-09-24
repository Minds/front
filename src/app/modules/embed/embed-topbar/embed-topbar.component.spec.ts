import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedTopbarComponent } from './embed-topbar.component';

describe('EmbedTopbarComponent', () => {
  let component: EmbedTopbarComponent;
  let fixture: ComponentFixture<EmbedTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmbedTopbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
