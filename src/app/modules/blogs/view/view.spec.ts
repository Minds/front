///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { ActivityService } from '../../../common/services/activity.service';
import { activityServiceMock } from '../../../../tests/activity-service-mock.spec';
import { By } from '@angular/platform-browser';
import { MetaService } from '../../../common/services/meta.service';
import { metaServiceMock } from '../../notifications/notification.service.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { clientMetaServiceMock } from '../../../../tests/client-meta-service-mock.spec';
import { ConfigsService } from '../../../common/services/configs.service';
import { MockService } from '../../../utils/mock';

describe('Blog view component', () => {
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlogView, SafePipe], // declare the test component
      imports: [NgCommonModule, RouterTestingModule],
      providers: [
        { provide: ActivityService, useValue: activityServiceMock },
        { provide: AnalyticsService, useValue: analyticsServiceMock },
        { provide: AttachmentService, useValue: attachmentServiceMock },
        { provide: Client, useValue: clientMock },
        { provide: ContextService, useValue: contextServiceMock },
        { provide: ScrollService, useValue: scrollServiceMock },
        { provide: Session, useValue: sessionMock },
        { provide: MetaService, useValue: metaServiceMock },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        { provide: ClientMetaService, useValue: clientMetaServiceMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideProvider(ActivityService, { useValue: activityServiceMock })
      .compileComponents(); // compile template and css
  }));

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

  it('should have an instance of m-social-icons if the owner has it enabled', () => {
    let socialIcons = fixture.debugElement.query(By.css('m-social-icons'));

    expect(socialIcons).not.toBeNull();

    sessionMock.user.hide_share_buttons = true;

    fixture.detectChanges();

    socialIcons = fixture.debugElement.query(By.css('m-social-icons'));
    expect(socialIcons).toBeNull();
  });
});
