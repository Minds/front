///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  Pipe,
  PipeTransform,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MindsBlogEntity } from '../../../interfaces/entities';
import { BlogView } from './view';
import { SafePipe } from '../../../common/pipes/safe';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { Session } from '../../../services/session';
import { scrollServiceMock } from '../../../../tests/scroll-service-mock.spec';
import { ScrollService } from '../../../services/ux/scroll';
import { AttachmentService } from '../../../services/attachment';
import { attachmentServiceMock } from '../../../../tests/attachment-service-mock.spec';
import { contextServiceMock } from '../../../../tests/context-service-mock.spec';
import { ContextService } from '../../../services/context.service';
import { AnalyticsService } from '../../../services/analytics';
import { analyticsServiceMock } from '../../../../tests/analytics-service-mock.spec';
import { ActivityService as CommentsActivityService } from '../../../common/services/activity.service';
import { activityServiceMock as commentsActivityServiceMock } from '../../../../tests/activity-service-mock.spec';
import { ActivityService } from '../../newsfeed/activity/activity.service';
import { By } from '@angular/platform-browser';
import { MetaService } from '../../../common/services/meta.service';
import { metaServiceMock } from '../../notifications/notification.service.spec';
import { ConfigsService } from '../../../common/services/configs.service';
import { MockService } from '../../../utils/mock';
import { FeaturesService } from '../../../services/features.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { ModalService } from '../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../tests/modal-service-mock.spec';

xdescribe('Blog view component', () => {
  let comp: BlogView;
  let fixture: ComponentFixture<BlogView>;
  const blog: MindsBlogEntity = {
    guid: '1',
    title: 'test blog',
    description: 'description',
    ownerObj: {},
    allow_comments: true,
    perma_url: '/perma',
    thumbnail: '/thumbnail',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BlogView, SafePipe], // declare the test component
        imports: [NgCommonModule, RouterTestingModule],
        providers: [
          {
            provide: CommentsActivityService,
            useValue: commentsActivityServiceMock,
          },
          ActivityService,
          { provide: AnalyticsService, useValue: analyticsServiceMock },
          { provide: AttachmentService, useValue: attachmentServiceMock },
          { provide: Client, useValue: clientMock },
          { provide: ContextService, useValue: contextServiceMock },
          { provide: ScrollService, useValue: scrollServiceMock },
          { provide: Session, useValue: sessionMock },
          { provide: MetaService, useValue: metaServiceMock },
          { provide: ModalService, useValue: modalServiceMock },
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
          { provide: FeaturesService, useValue: MockService(FeaturesService) },
          {
            provide: FormToastService,
            useValue: MockService(FormToastService),
          },
          {
            provide: ClientMetaService,
            useValue: MockService(ClientMetaService),
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideProvider(CommentsActivityService, {
          useValue: commentsActivityServiceMock,
        })
        .compileComponents(); // compile template and css
    })
  );

  // synchronous beforeEach
  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(BlogView);
    comp = fixture.componentInstance;
    comp.blog = blog;

    sessionMock.user.hide_share_buttons = false;

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  xit('should have an instance of m-social-icons if the logged in user has it enabled', () => {
    let socialIcons = fixture.debugElement.query(By.css('m-social-icons'));

    expect(socialIcons).not.toBeNull();

    sessionMock.user.hide_share_buttons = true;

    fixture.detectChanges();

    socialIcons = fixture.debugElement.query(By.css('m-social-icons'));
    expect(socialIcons).toBeNull();
  });
});
