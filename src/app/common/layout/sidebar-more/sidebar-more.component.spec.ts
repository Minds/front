import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { themeServiceMock } from '../../../mocks/common/services/theme.service-mock.spec';
import { Session } from '../../../services/session';
import { MockComponent, MockService } from '../../../utils/mock';
import { ThemeService } from '../../services/theme.service';
import { SidebarNavigationService } from '../sidebar/navigation.service';
import { SidebarMoreComponent } from './sidebar-more.component';
import { HelpdeskRedirectService } from '../../services/helpdesk-redirect.service';
import { SidebarV2ReorgExperimentService } from '../../../modules/experiments/sub-services/front-5924-sidebar-v2-reorg.service';
import { ConfigsService } from '../../services/configs.service';
import userMock from '../../../mocks/responses/user.mock';

describe('SidebarMoreComponent', () => {
  let component: SidebarMoreComponent;
  let fixture: ComponentFixture<SidebarMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SidebarMoreComponent,
        MockComponent({
          selector: 'm-icon',
        }),
        MockComponent({
          selector: 'm-chatIcon',
        }),
        MockComponent({
          selector: 'a',
          inputs: ['routerLink', 'data-ref'],
        }),
      ],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: ThemeService, useValue: themeServiceMock },
        {
          provide: SidebarNavigationService,
          useValue: MockService(SidebarNavigationService),
        },
        {
          provide: HelpdeskRedirectService,
          useValue: MockService(HelpdeskRedirectService),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', [
            'navigate',
            'navigateByUrl',
          ]),
        },
        {
          provide: SidebarV2ReorgExperimentService,
          useValue: MockService(SidebarV2ReorgExperimentService),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMoreComponent);
    component = fixture.componentInstance;

    (component as any).router.navigateByUrl.calls.reset();
    (component as any).session.getLoggedInUser.and.returnValue(userMock);
    (component as any).sidebarV2ReorgExperiment.isReorgVariationActive.and.returnValue(
      true
    );
    component.showReorgVariation = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to supermind console', () => {
    component.openSupermindConsole();
    expect((component as any).router.navigate).toHaveBeenCalledWith([
      '/supermind/inbox',
    ]);
  });

  it('should open boost console', () => {
    component.openBoostConsole();
    expect((component as any).router.navigate).toHaveBeenCalledWith([
      '/boost/boost-console',
    ]);
  });

  it('should open blog on earn option click', () => {
    component.onEarnClick();
    expect((component as any).router.navigateByUrl).toHaveBeenCalledWith(
      '/info/blog/how-to-earn-on-minds-1486070032210333697'
    );
  });

  it('should determine whether reorg variation should be shown', () => {
    (component as any).sidebarV2ReorgExperiment.isReorgVariationActive.and.returnValue(
      true
    );
    expect(component.shouldShowReorgVariation()).toBeTrue();
  });

  it('should determine whether reorg variation should NOT be shown', () => {
    (component as any).sidebarV2ReorgExperiment.isReorgVariationActive.and.returnValue(
      false
    );
    expect(component.shouldShowReorgVariation()).toBeFalse();
  });
});
