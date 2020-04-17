import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeMigrationConfigComponent } from './config.component';

describe('YoutubeMigrationConfigComponent', () => {
  let component: YoutubeMigrationConfigComponent;
  let fixture: ComponentFixture<YoutubeMigrationConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YoutubeMigrationConfigComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeMigrationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
