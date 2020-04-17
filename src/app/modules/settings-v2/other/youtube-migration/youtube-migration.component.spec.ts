import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2YoutubeMigrationComponent } from './youtube-migration.component';

describe('SettingsV2YoutubeMigrationComponent', () => {
  let component: SettingsV2YoutubeMigrationComponent;
  let fixture: ComponentFixture<YoutubeMigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsV2YoutubeMigrationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2YoutubeMigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
