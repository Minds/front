import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivityToolbarComponent } from './toolbar.component';
import { ActivityService } from '../../activity/activity.service';
import { Session } from '../../../../services/session';
import { BoostModalV2LazyService } from '../../../boost/modal-v2/boost-modal-v2-lazy.service';
import { InteractionsModalService } from '../../interactions-modal/interactions-modal.service';
import { ModalService } from '../../../../services/ux/modal.service';
import { PersistentFeedExperimentService } from '../../../experiments/sub-services/persistent-feed-experiment.service';
import { ExperimentsService } from '../../../experiments/experiments.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { By } from '@angular/platform-browser';

describe('ActivityToolbarComponent', () => {
  let comp: ActivityToolbarComponent;
  let fixture: ComponentFixture<ActivityToolbarComponent>;

  let mockEntity: any = {
    guid: 213,
    allow_comments: true,
    'thumbs:up:count': 3,
  };

  let mockDisplayOptions: any = {
    showInteractions: false,
    showOnlyCommentsToggle: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ActivityToolbarComponent,
        MockComponent({
          selector: 'm-supermind__banner',
          inputs: ['entity'],
        }),
        MockComponent({
          selector: 'm-supermind__button',
          inputs: ['entity', 'iconOnly', 'size'],
        }),
        MockComponent({
          selector: 'minds-button-thumbs-up',
          inputs: ['object', 'iconOnly'],
          outputs: ['thumbsUpChange'],
        }),
        MockComponent({
          selector: 'minds-button-thumbs-down',
          inputs: ['object', 'iconOnly'],
          outputs: ['thumbsDownChange'],
        }),
        MockComponent({
          selector: 'minds-button-comment',
          inputs: ['object', 'iconOnly'],
          outputs: ['click'],
        }),
        MockComponent({
          selector: 'm-activity__boostButton',
          inputs: ['iconOnly'],
          outputs: ['click'],
        }),
        MockComponent({
          selector: 'm-activity__boostCta',
          inputs: ['entity'],
        }),
        MockComponent({
          selector: 'm-activity__remindButton',
        }),
      ],
      providers: [
        {
          provide: ActivityService,
          useValue: MockService(ActivityService, {
            has: ['entity$', 'shouldShowPaywallBadge$', 'displayOptions'],
            props: {
              entity$: {
                get: () => new BehaviorSubject<any>(mockEntity),
              },
              shouldShowPaywallBadge$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              displayOptions: mockDisplayOptions,
            },
          }),
        },
        { provide: Session, useValue: MockService(Session) },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: BoostModalV2LazyService,
          useValue: MockService(BoostModalV2LazyService),
        },
        {
          provide: InteractionsModalService,
          useValue: MockService(InteractionsModalService),
        },
        { provide: ModalService, useValue: MockService(ModalService) },
        {
          provide: PersistentFeedExperimentService,
          useValue: MockService(PersistentFeedExperimentService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        ChangeDetectorRef,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityToolbarComponent);
    comp = fixture.componentInstance;

    (comp as any).experimentsService.hasVariation.and.returnValue(true);
    (comp as any).service.displayOptions = mockDisplayOptions;

    let entity: any = mockEntity;
    entity.allow_comments = true;
    (comp as any).service.entity$.next(entity);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should toggle comments on', fakeAsync(() => {
    (comp as any).service.displayOptions.showOnlyCommentsToggle = false;

    comp.toggleComments();
    tick();

    expect((comp as any).router.navigate).not.toHaveBeenCalled();
    expect((comp as any).service.displayOptions.showOnlyCommentsToggle).toBe(
      true
    );
  }));

  it('should toggle comments off', fakeAsync(() => {
    (comp as any).service.displayOptions.showOnlyCommentsToggle = true;

    comp.toggleComments();
    tick();

    expect((comp as any).router.navigate).not.toHaveBeenCalled();
    expect((comp as any).service.displayOptions.showOnlyCommentsToggle).toBe(
      false
    );
  }));

  it('should navigate comments on toggle when fixed height is set', fakeAsync(() => {
    (comp as any).service.displayOptions.fixedHeight = true;

    comp.toggleComments();
    tick();

    expect((comp as any).router.navigate).toHaveBeenCalledOnceWith([
      `/newsfeed/${mockEntity.guid}`,
    ]);
  }));

  it('should show toast if allow_comments is false, but still load existing comments on toggleComments', fakeAsync(() => {
    let entity: any = mockEntity;
    entity.allow_comments = false;
    entity['comments:count'] = 1;

    (comp as any).service.entity$.next(mockEntity);
    (comp as any).service.displayOptions.showOnlyCommentsToggle = false;

    comp.toggleComments();
    tick();

    expect((comp as any).router.navigate).not.toHaveBeenCalled();
    expect((comp as any).toast.warn).toHaveBeenCalledOnceWith(
      'This user has disabled comments on their post'
    );
    expect((comp as any).service.displayOptions.showOnlyCommentsToggle).toBe(
      true
    );
  }));

  it('should show toast if allow_comments is false, and not try to load existing comments if there are none on toggleComments', fakeAsync(() => {
    let entity: any = mockEntity;
    entity.allow_comments = false;
    entity['comments:count'] = 0;

    (comp as any).service.entity$.next(mockEntity);
    (comp as any).service.displayOptions.showOnlyCommentsToggle = false;

    comp.toggleComments();
    tick();

    expect((comp as any).router.navigate).not.toHaveBeenCalled();
    expect((comp as any).toast.warn).toHaveBeenCalledOnceWith(
      'This user has disabled comments on their post'
    );
    expect((comp as any).service.displayOptions.showOnlyCommentsToggle).toBe(
      false
    );
  }));

  describe('onThumbsDownChange', () => {
    it('should emit on thumbs down', () => {
      spyOn((comp as any).onDownvote, 'emit');
      comp.onThumbsDownChange(true);
      expect((comp as any).onDownvote.emit).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit on thumbs down cancellation', () => {
      spyOn((comp as any).onDownvote, 'emit');
      comp.onThumbsDownChange(false);
      expect((comp as any).onDownvote.emit).not.toHaveBeenCalled();
    });
  });

  describe('showMetrics', () => {
    it('should determine whether NOT to show metrics', () => {
      comp.entity = {
        ...mockEntity,
        'thumbs:up:count': 0,
        reminds: 0,
        quotes: 0,
      };
      expect(comp.showMetrics).toBeFalse();
    });

    it('should determine whether to show metrics because thumbs:up:count is greater than 0', () => {
      comp.entity = {
        ...mockEntity,
        'thumbs:up:count': 1,
        reminds: 0,
        quotes: 0,
      };
      expect(comp.showMetrics).toBeTrue();
    });

    it('should determine whether to show metrics because reminds count is greater than 0', () => {
      comp.entity = {
        ...mockEntity,
        'thumbs:up:count': 0,
        reminds: 1,
        quotes: 0,
      };
      expect(comp.showMetrics).toBeTrue();
    });

    it('should determine whether to show metrics because quotes count is greater than 0', () => {
      comp.entity = {
        ...mockEntity,
        'thumbs:up:count': 0,
        reminds: 0,
        quotes: 1,
      };
      expect(comp.showMetrics).toBeTrue();
    });
  });

  describe('hasBoostPermission', () => {
    it('should return true if the user has the boost permission', () => {
      (comp as any).permissionsService.canBoost.and.returnValue(true);
      comp.ngOnInit();
      expect((comp as any).hasBoostPermission).toBe(true);
    });

    it('should return false if the user does not have the boost permission', () => {
      (comp as any).permissionsService.canBoost.and.returnValue(false);
      comp.ngOnInit();
      expect((comp as any).hasBoostPermission).toBe(false);
    });
  });

  describe('rendering large actions', () => {
    it('should render no large actions when canShowLargeCta is false', () => {
      (comp as any).service.displayOptions.canShowLargeCta = false;
      (comp as any).isOwner = true;
      (comp as any).hasBoostPermission = true;

      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-activity__boostButton'))
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('m-supermind__banner'))
      ).toBeFalsy();
    });

    it('should render boost button canShowLargeCta is true and is an owner with boost permission', () => {
      (comp as any).service.displayOptions.canShowLargeCta = true;
      (comp as any).isOwner = true;
      (comp as any).hasBoostPermission = true;

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-activity__boostButton'))
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('m-supermind__banner'))
      ).toBeFalsy();
    });
  });
});
