import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeMigrationListComponent } from './list.component';

describe('ListComponent', () => {
  let component: YoutubeMigrationListComponent;
  let fixture: ComponentFixture<YoutubeMigrationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YoutubeMigrationListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeMigrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
