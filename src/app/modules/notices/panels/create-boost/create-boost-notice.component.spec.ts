import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { Injector } from '@angular/core';
import { ComposerBoostService } from '../../../composer/services/boost.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { CreateBoostNoticeComponent } from './create-boost-notice.component';
import { BehaviorSubject } from 'rxjs';
import { BoostLatestPostNoticeService } from '../boost-latest-post/boost-latest-post-notice.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Router } from '@angular/router';

describe('CreateBoostNoticeComponent', () => {
  let comp: CreateBoostNoticeComponent;
  let fixture: ComponentFixture<CreateBoostNoticeComponent>;
  const mockEntity: any = { guid: 123 };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CreateBoostNoticeComponent,
        MockComponent({
          selector: 'm-feedNotice',
          inputs: ['icon', 'dismissible', 'showIcon'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'solid', 'size'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        {
          provide: ComposerBoostService,
          useValue: MockService(ComposerBoostService, {
            has: ['isBoostMode$'],
            props: {
              isBoostMode$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: BoostLatestPostNoticeService,
          useValue: MockService(BoostLatestPostNoticeService, {
            has: ['latestPost$'],
            props: {
              latestPost$: {
                get: () => new BehaviorSubject<any>(mockEntity),
              },
            },
          }),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
        Injector,
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(CreateBoostNoticeComponent);
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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should handle primary option click', () => {
    (comp as any).composerBoostService.isBoostMode$.next(false);
    (comp as any).composerModalService.setInjector.and.returnValue(
      (comp as any).composerModalService
    );
    comp.onCreateBoostClick();

    expect((comp as any).composerBoostService.isBoostMode$.getValue()).toBe(
      true
    );
    expect((comp as any).composerModalService.setInjector).toHaveBeenCalled();
    expect((comp as any).composerModalService.present).toHaveBeenCalled();
  });

  describe('onBoostLatestPostClick', () => {
    it('should navigate to newsfeed if no latest post is found', () => {
      (comp as any).boostLatestPostNoticeService.latestPost$.next(mockEntity);
      comp.onBoostLatestPostClick();

      expect((comp as any).toaster.warn).not.toHaveBeenCalled();
      expect((comp as any).router.navigate).toHaveBeenCalledWith(
        ['newsfeed', mockEntity.guid],
        {
          queryParams: {
            boostModalDelayMs: 1000,
          },
        }
      );
    });

    it('should warn if latest post is not found', () => {
      (comp as any).boostLatestPostNoticeService.latestPost$.next(null);
      comp.onBoostLatestPostClick();

      expect((comp as any).toaster.warn).toHaveBeenCalled();
      expect((comp as any).router.navigate).not.toHaveBeenCalled();
    });
  });
});
