import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleMobileComponent } from './mobile.component';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { MobileAppPreviewService } from '../../services/mobile-app-preview.service';
import { BehaviorSubject } from 'rxjs';

describe('NetworkAdminConsoleMobileComponent', () => {
  let comp: NetworkAdminConsoleMobileComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleMobileComponent,
        MockComponent({
          selector: 'm-networkAdminConsole__mobileAssets',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__mobileSplashConfig',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__editAppearance',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__previewBuilder',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__release',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__configSettingsToggle',
          inputs: ['title', 'toggleText', 'fieldName'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
      ],
      providers: [
        {
          provide: MobileAppPreviewService,
          useValue: MockService(MobileAppPreviewService, {
            has: ['initInProgress$'],
            props: {
              initInProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleMobileComponent);
    comp = fixture.componentInstance;
    (comp as any).MobileAppPreviewService.initInProgress$.next(false);
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to init service onInit', () => {
    comp.ngOnInit();
    expect((comp as any).MobileAppPreviewService.init).toHaveBeenCalled();
  });

  it('should render assets component while still initialising', () => {
    (comp as any).MobileAppPreviewService.initInProgress$.next(true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('m-networkAdminConsole__mobileAssets')
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('m-loadingSpinner')
    ).toBeTruthy();

    expect(
      fixture.nativeElement.querySelector(
        'm-networkAdminConsole__mobileSplashConfig'
      )
    ).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector(
        'm-networkAdminConsole__editAppearance'
      )
    ).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector(
        'm-networkAdminConsole__previewBuilder'
      )
    ).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector('m-networkAdminConsole__release')
    ).toBeFalsy();
  });

  it('should render components that require init when done initialising', () => {
    (comp as any).MobileAppPreviewService.initInProgress$.next(false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('m-networkAdminConsole__mobileAssets')
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector(
        'm-networkAdminConsole__mobileSplashConfig'
      )
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector(
        'm-networkAdminConsole__editAppearance'
      )
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector(
        'm-networkAdminConsole__previewBuilder'
      )
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('m-networkAdminConsole__release')
    ).toBeTruthy();

    expect(fixture.nativeElement.querySelector('m-loadingSpinner')).toBeFalsy();
  });
});
