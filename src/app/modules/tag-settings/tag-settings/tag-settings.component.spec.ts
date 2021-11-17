import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSettingsComponent } from './tag-settings.component';

describe('TagSettingsComponent', () => {
  let component: TagSettingsComponent;
  let fixture: ComponentFixture<TagSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
