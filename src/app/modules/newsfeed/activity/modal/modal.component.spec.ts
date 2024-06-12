import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityModalComponent, MediaModalParams } from './modal.component';
import { ChangeDetectorRef } from '@angular/core';
import { RelatedContentService } from '../../../../common/services/related-content.service';
import { ActivityModalService } from './modal.service';
import { AttachmentService } from '../../../../services/attachment';
import { ClientMetaService } from '../../../../common/services/client-meta.service';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { SiteService } from '../../../../common/services/site.service';
import { Location } from '@angular/common';
import { TranslationService } from '../../../../services/translation';
import { AnalyticsService } from '../../../../services/analytics';
import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { ActivityService } from '../activity.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ComposerService } from '../../../composer/services/composer.service';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../../common/services/activity.service';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ActivityModalComponent', () => {
  let comp: ActivityModalComponent;
  let fixture: ComponentFixture<ActivityModalComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        ActivityModalComponent,
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
        MockComponent({
          selector: 'm-activity__content',
          inputs: ['hideText', 'maxHeightAllowed', 'hideMedia'],
        }),
        MockComponent({
          selector: 'm-activity__modalQuote',
          inputs: ['entity'],
        }),
        MockComponent({
          selector: 'm-activity__nsfwConsent',
        }),
        MockComponent({
          selector: 'm-activity__modalTitleOverlay',
        }),
        MockComponent({
          selector: 'm-activity__modalPager',
        }),
        MockComponent({
          selector: 'm-activity__flag',
        }),
        MockComponent({
          selector: 'm-activity__ownerBlock',
        }),
        MockComponent({
          selector: 'm-activity__views',
        }),
        MockComponent({
          selector: 'm-activity__menu',
          outputs: ['deleted'],
        }),
        MockComponent({
          selector: 'm-activity__toolbar',
        }),
        MockComponent({
          selector: 'm-comments__entityOutletV2',
          inputs: [
            'entity',
            'canDelete',
            'fixedHeight',
            'showOnlyPoster',
            'isModal',
          ],
          outputs: ['onHeightChange'],
        }),
      ],
      providers: [
        { provide: Client, useValue: MockService(Client) },
        { provide: Session, useValue: MockService(Session) },
        { provide: AnalyticsService, useValue: MockService(AnalyticsService) },
        {
          provide: TranslationService,
          useValue: MockService(TranslationService),
        },
        { provide: Location, useValue: MockService(Location) },
        { provide: SiteService, useValue: MockService(SiteService) },
        {
          provide: ClientMetaDirective,
          useValue: MockService(ClientMetaDirective),
        },
        {
          provide: ClientMetaService,
          useValue: MockService(ClientMetaService),
        },
        {
          provide: AttachmentService,
          useValue: MockService(AttachmentService),
        },
        {
          provide: RelatedContentService,
          useValue: MockService(RelatedContentService),
        },
        ChangeDetectorRef,
      ],
    })
      .overrideProvider(ActivityService, {
        useValue: MockService(ActivityService, {
          has: [
            'entity$',
            'activeMultiImageIndex$',
            'isQuote$',
            'isMultiImage$',
            'canonicalUrl$',
          ],
          props: {
            entity$: {
              get: () => new BehaviorSubject<any>({ guid: '123' }),
            },
            activeMultiImageIndex$: {
              get: () => new BehaviorSubject<any>(0),
            },
            isQuote$: {
              get: () => new BehaviorSubject<any>(false),
            },
            isMultiImage$: {
              get: () => new BehaviorSubject<any>(false),
            },
            canonicalUrl$: {
              get: () => new BehaviorSubject<any>('https://example.minds.com/'),
            },
          },
        }),
      })
      .overrideProvider(ActivityModalService, {
        useValue: MockService(ActivityModalService),
      })
      .overrideProvider(ComposerService, {
        useValue: MockService(ComposerService),
      })
      .overrideProvider(ActivityServiceCommentsLegacySupport, {
        useValue: MockService(ActivityServiceCommentsLegacySupport),
      });

    fixture = TestBed.createComponent(ActivityModalComponent);
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

  it('should set modal data', () => {
    (comp as any).activityService.activeMultiImageIndex$.next(999);
    (comp as any).isComment = true;

    const mockParams: MediaModalParams = {
      entity: { guid: '123' },
      activeMultiImageIndex: 0,
      isComment: false,
    };

    comp.setModalData(mockParams);

    expect((comp as any).service.setActivityService).toHaveBeenCalledOnceWith(
      (comp as any).activityService
    );
    expect((comp as any).service.setSourceUrl).toHaveBeenCalledOnceWith(
      (comp as any).router.url
    );
    expect((comp as any).service.setEntity).toHaveBeenCalledOnceWith(
      mockParams.entity
    );
    expect(
      (comp as any).activityService.activeMultiImageIndex$.getValue()
    ).toBe(mockParams.activeMultiImageIndex);
    expect(
      (comp as any).activityService.setDisplayOptions
    ).toHaveBeenCalledOnceWith({
      showOnlyCommentsInput: false,
      showInteractions: true,
      canShowLargeCta: true,
      isModal: true,
      fixedHeight: false,
      autoplayVideo: true,
      permalinkBelowContent: true,
    });
    expect((comp as any).relatedContent.setBaseEntity).toHaveBeenCalledOnceWith(
      mockParams.entity
    );
    expect((comp as any).relatedContent.setParent).toHaveBeenCalledOnceWith(
      'activityModal'
    );
    expect((comp as any).isComment).toBe(mockParams.isComment);
  });
});
