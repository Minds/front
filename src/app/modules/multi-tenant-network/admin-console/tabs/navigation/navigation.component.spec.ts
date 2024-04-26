import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleNavigationComponent } from './navigation.component';
import { MultiTenantNavigationService } from './services/navigation.service';

class MockMultiTenantNavigationService {
  fetchNavigationItems = jasmine.createSpy('fetchNavigationItems');
}

describe('NetworkAdminConsoleNavigationComponent', () => {
  let component: NetworkAdminConsoleNavigationComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleNavigationComponent>;
  let service: MultiTenantNavigationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleNavigationComponent],
      providers: [
        {
          provide: MultiTenantNavigationService,
          useClass: MockMultiTenantNavigationService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAdminConsoleNavigationComponent);
    component = fixture.componentInstance;
    // Inject the service instance from the test bed
    service = TestBed.inject(MultiTenantNavigationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchNavigationItems on init', () => {
    expect(service.fetchNavigationItems).toHaveBeenCalledWith(false);
  });
});
