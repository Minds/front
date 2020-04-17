import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeMigrationConnectComponent } from './connect.component';

describe('YoutubeMigrationConnectComponent', () => {
  let component: YoutubeMigrationConnectComponent;
  let fixture: ComponentFixture<YoutubeMigrationConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YoutubeMigrationConnectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeMigrationConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
