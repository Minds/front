import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComposerBoostToggleComponent } from './boost-toggle.component';
import { MockService } from '../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { ComposerBoostService } from '../../services/boost.service';
import { ComposerService } from '../../services/composer.service';
import { ToasterService } from '../../../../common/services/toaster.service';

describe('ComposerBoostToggleComponent', () => {
  let comp: ComposerBoostToggleComponent;
  let fixture: ComponentFixture<ComposerBoostToggleComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [ComposerBoostToggleComponent],
      providers: [
        {
          provide: ComposerBoostService,
          useValue: MockService(ComposerBoostService, {
            has: ['isBoostMode$'],
            props: {
              isBoostMode$: { get: () => new BehaviorSubject<boolean>(false) },
            },
          }),
        },
        {
          provide: ComposerService,
          useValue: MockService(ComposerService, {
            has: ['nsfw$'],
            props: {
              nsfw$: { get: () => new BehaviorSubject<string[]>([]) },
            },
          }),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    });

    fixture = TestBed.createComponent(ComposerBoostToggleComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('render button', () => {
    it('should have selected class on button when isBoostMode$ is true', () => {
      (comp as any).composerBoostService.isBoostMode$.next(true);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        '.m-composerBoostToggle__button'
      );
      expect(button.classList).toContain(
        'm-composerBoostToggle__button--selected'
      );
    });

    it('should NOT have selected class on button when isBoostMode$ is false', () => {
      (comp as any).composerBoostService.isBoostMode$.next(false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        '.m-composerBoostToggle__button'
      );
      expect(button.classList).not.toContain(
        'm-composerBoostToggle__button--selected'
      );
    });
  });

  describe('onClick', () => {
    it('should toggle isBoostMode$ when nsfw$ is empty', () => {
      (comp as any).composerService.nsfw$.next([]);
      (comp as any).composerBoostService.isBoostMode$.next(false);
      fixture.detectChanges();

      comp.onClick();

      expect((comp as any).composerBoostService.isBoostMode$.getValue()).toBe(
        true
      );

      comp.onClick();

      expect((comp as any).composerBoostService.isBoostMode$.getValue()).toBe(
        false
      );
    });

    it('should not toggle isBoostMode$ when nsfw$ is not empty', () => {
      (comp as any).composerService.nsfw$.next(['1']);
      (comp as any).composerBoostService.isBoostMode$.next(false);
      fixture.detectChanges();

      comp.onClick();

      expect((comp as any).toasterService.error).toHaveBeenCalledOnceWith(
        'NSFW content cannot be boosted'
      );
      expect((comp as any).composerBoostService.isBoostMode$.getValue()).toBe(
        false
      );
    });
  });
});
