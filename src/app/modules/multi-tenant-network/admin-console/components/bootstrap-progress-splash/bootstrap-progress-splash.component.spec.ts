import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiTenantBootstrapProgressSplashComponent } from './bootstrap-progress-splash.component';
import { SidebarNavigationService } from '../../../../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { TopbarService } from '../../../../../common/layout/topbar.service';
import { BootstrapProgressSplashService } from './bootstrap-progress-splash.service';
import { BehaviorSubject } from 'rxjs';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { CommonModule as NgCommonModule } from '@angular/common';

describe('MultiTenantBootstrapProgressSplashComponent', () => {
  let comp: MultiTenantBootstrapProgressSplashComponent;
  let fixture: ComponentFixture<MultiTenantBootstrapProgressSplashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiTenantBootstrapProgressSplashComponent],
      providers: [
        {
          provide: BootstrapProgressSplashService,
          useValue: MockService(BootstrapProgressSplashService, {
            has: ['currentStepLoadingLabel$', 'completed$'],
            props: {
              currentStepLoadingLabel$: {
                get: () => new BehaviorSubject<string>('Custom loading...'),
              },
              completed$: { get: () => new BehaviorSubject<boolean>(false) },
            },
          }),
        },
        {
          provide: SidebarNavigationService,
          useValue: MockService(SidebarNavigationService),
        },
        {
          provide: PageLayoutService,
          useValue: MockService(PageLayoutService),
        },
        { provide: TopbarService, useValue: MockService(TopbarService) },
      ],
    })
      .overrideComponent(MultiTenantBootstrapProgressSplashComponent, {
        set: {
          imports: [
            NgCommonModule,
            MockComponent({
              selector: 'm-newTenantWelcomeVideo',
              standalone: true,
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(
      MultiTenantBootstrapProgressSplashComponent
    );
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();

    expect((comp as any).topbarService.toggleVisibility).toHaveBeenCalledWith(
      false
    );
    expect((comp as any).pageLayoutService.useFullWidth).toHaveBeenCalled();
    expect(
      (comp as any).pageLayoutService.removeTopbarBackground
    ).toHaveBeenCalled();
    expect(
      (comp as any).pageLayoutService.removeTopbarBorder
    ).toHaveBeenCalled();
  });

  it('should start polling on init', () => {
    (comp as any).bootstrapProgressSplashService.startPolling.calls.reset();
    comp.ngOnInit();
    expect(
      (comp as any).bootstrapProgressSplashService.startPolling
    ).toHaveBeenCalled();
  });

  it('should stop polling on destroy', () => {
    comp.ngOnDestroy();
    expect(
      (comp as any).bootstrapProgressSplashService.stopPolling
    ).toHaveBeenCalled();
  });

  it('should call startPolling when startPolling is called', () => {
    (comp as any).bootstrapProgressSplashService.startPolling.calls.reset();
    comp.startPolling();
    expect(
      (comp as any).bootstrapProgressSplashService.startPolling
    ).toHaveBeenCalled();
  });

  it('should call stopPolling when stopPolling is called', () => {
    comp.stopPolling();
    expect(
      (comp as any).bootstrapProgressSplashService.stopPolling
    ).toHaveBeenCalled();
  });

  it('should call redirectToNetwork when onNavigateToNetworkClick is called', () => {
    comp.onNavigateToNetworkClick();
    expect(
      (comp as any).bootstrapProgressSplashService.redirectToNetwork
    ).toHaveBeenCalled();
  });
});
