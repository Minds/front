import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeMigrationComponent } from './youtube-migration.component';

describe('YoutubeMigrationComponent', () => {
  let component: YoutubeMigrationComponent;
  let fixture: ComponentFixture<YoutubeMigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YoutubeMigrationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeMigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
