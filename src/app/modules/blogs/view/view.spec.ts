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
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideProvider(ActivityService, { useValue: activityServiceMock })
      .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(BlogView);
    comp = fixture.componentInstance;
    comp.blog = blog;
    fixture.detectChanges();
  });
});
