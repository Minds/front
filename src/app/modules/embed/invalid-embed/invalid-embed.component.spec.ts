import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidEmbedComponent } from './invalid-embed.component';

describe('InvalidEmbedComponent', () => {
  let component: InvalidEmbedComponent;
  let fixture: ComponentFixture<InvalidEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvalidEmbedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
