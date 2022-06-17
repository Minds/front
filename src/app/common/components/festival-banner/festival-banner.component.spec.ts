import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../utils/mock';
import { FestivalBannerComponent } from './festival-banner.component';
import { Storage } from '../../../services/storage';
import { FestivalBannerExperimentService } from '../../../modules/experiments/sub-services/festival-banner-experiment.service';
import { ThemeService } from '../../services/theme.service';
import { ConfigsService } from '../../services/configs.service';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

describe('FestivalBannerComponent', () => {
  let comp: FestivalBannerComponent;
  let fixture: ComponentFixture<FestivalBannerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [
          FestivalBannerComponent,
          MockComponent({
            selector: 'm-button',
            inputs: ['color', 'size'],
            outputs: ['onAction'],
          }),
        ],
        providers: [
          {
            provide: Storage,
            useValue: MockService(Storage),
          },
          {
            provide: FestivalBannerExperimentService,
            useValue: MockService(FestivalBannerExperimentService),
          },
          {
            provide: ThemeService,
            useValue: MockService(ThemeService, {
              has: ['isDark$'],
              props: {
                isDark$: { get: () => new BehaviorSubject<boolean>(false) },
              },
            }),
          },
          {
            provide: ConfigsService,
            useValue: MockService(ConfigsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(FestivalBannerComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).dismissed = false;
    // forcing this value as configs is hard to mock as its encapsulated only for use
    // in the constructor.
    (comp as any).cdnAssetsUrl = 'https://www.minds.com/en/static/';

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should see if component is dismissed on init', () => {
    (comp as any).localStorage.get.and.returnValue('true');
    comp.ngOnInit();
    expect((comp as any).localStorage.get).toHaveBeenCalledWith(
      'dismissed_festival_banner'
    );
    expect(comp.dismissed).toBeTrue();
  });

  it('should see if component is NOT dismissed on init', () => {
    (comp as any).localStorage.get.and.returnValue(null);
    comp.ngOnInit();
    expect((comp as any).localStorage.get).toHaveBeenCalledWith(
      'dismissed_festival_banner'
    );
    expect(comp.dismissed).toBeFalse();
  });

  it('should get correct logo for dark mode', () => {
    (comp as any).themes.isDark$.next(true);
    comp.largeLogoUrl.pipe(take(1)).subscribe(val => {
      expect(val).toBe(
        'https://www.minds.com/en/static/assets/logos/logo-light-mode.svg'
      );
    });
  });

  it('should get correct logo for light mode', () => {
    (comp as any).themes.isDark$.next(false);
    comp.largeLogoUrl.pipe(take(1)).subscribe(val => {
      expect(val).toBe(
        'https://www.minds.com/en/static/assets/logos/logo-dark-mode.svg'
      );
    });
  });

  it('should show if festival banner is active and not dismissed', () => {
    (comp as any).festivalBannerExperiment.isActive.and.returnValue(true);
    comp.dismissed = false;
    expect(comp.shouldShow()).toBe(true);
  });

  it('should NOT show if festival banner is NOT active', () => {
    (comp as any).festivalBannerExperiment.isActive.and.returnValue(false);
    comp.dismissed = false;
    expect(comp.shouldShow()).toBe(false);
  });

  it('should NOT show if festival banner is dismissed', () => {
    (comp as any).festivalBannerExperiment.isActive.and.returnValue(true);
    comp.dismissed = true;
    expect(comp.shouldShow()).toBe(false);
  });

  it('should set local dismiss state and set localStorage dismiss state on dismiss', () => {
    comp.dismissed = false;
    comp.dismiss();

    expect(comp.dismissed).toBe(true);
    expect((comp as any).localStorage.set).toHaveBeenCalledWith(
      'dismissed_festival_banner',
      true
    );
  });

  it('should open window on buy tickets click', () => {
    spyOn(window, 'open');
    comp.buyTickets();
    expect(window.open).toHaveBeenCalledWith(
      'https://www.ticketmaster.com/event/3B005CB2CF161F8D?utm_source=minds&utm_medium=banner&utm_campaign=festival',
      '_blank'
    );
  });
});
