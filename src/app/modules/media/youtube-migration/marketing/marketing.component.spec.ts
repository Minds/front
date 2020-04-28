import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeMigrationMarketingComponent } from './marketing.component';

describe('YoutubeMigrationMarketingComponent', () => {
  let component: YoutubeMigrationMarketingComponent;
  let fixture: ComponentFixture<YoutubeMigrationMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YoutubeMigrationMarketingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeMigrationMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
