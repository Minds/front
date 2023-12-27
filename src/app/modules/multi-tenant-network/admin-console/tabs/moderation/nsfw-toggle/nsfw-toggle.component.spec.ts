import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsfwToggleComponent } from './nsfw-toggle.component';

describe('NsfwToggleComponent', () => {
  let component: NsfwToggleComponent;
  let fixture: ComponentFixture<NsfwToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NsfwToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NsfwToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
