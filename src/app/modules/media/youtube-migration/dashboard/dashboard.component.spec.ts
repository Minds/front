import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { YoutubeMigrationDashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: YoutubeMigrationDashboardComponent;
  let fixture: ComponentFixture<YoutubeMigrationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YoutubeMigrationDashboardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeMigrationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
