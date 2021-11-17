import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsfwSettingsFormComponent } from './form.component';

describe('NsfwSettingsFormComponent', () => {
  let component: NsfwSettingsFormComponent;
  let fixture: ComponentFixture<NsfwSettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NsfwSettingsFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsfwSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
