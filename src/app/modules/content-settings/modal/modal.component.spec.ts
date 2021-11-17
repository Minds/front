import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSettingsModalComponent } from './modal.component';

describe('ContentSettingsModalComponent', () => {
  let component: ContentSettingsModalComponent;
  let fixture: ComponentFixture<ContentSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentSettingsModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
