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

describe('ActivityToolbarComponent', () => {
  let comp: ActivityToolbarComponent;
  let fixture: ComponentFixture<ActivityToolbarComponent>;

  let mockEntity: any = {
    guid: 213,
    allow_comments: true,
    'thumbs:up:count': 3,
    'thumbs:down:count': 1,
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
});
