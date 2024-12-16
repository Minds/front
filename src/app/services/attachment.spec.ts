import { AttachmentService } from './attachment';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { Inject } from '@angular/core';
import { Client, Upload } from './api';
import { Session } from './session';
import { clientMock } from '../../tests/client-mock.spec';
import { uploadMock } from '../../tests/upload-mock.spec';
import { sessionMock } from '../../tests/session-mock.spec';

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ConfigsService } from '../common/services/configs.service';
import { MockService } from '../utils/mock';
import { TextParserService } from '../common/services/text-parser.service';
import { PermissionsService } from '../common/services/permissions.service';
import { ToasterService } from '../common/services/toaster.service';
import { permissionsServiceMock } from '../../tests/permissions-service-mock.spec';
import { PermissionIntentsService } from '../common/services/permission-intents.service';

/* tslint:disable */

describe('Service: Attachment Service', () => {
  let service: AttachmentService;
  let mockObject;
  let httpMock;
  let permissionIntentsServiceMock =
    jasmine.createSpyObj<PermissionIntentsService>(['checkAndHandleAction']);
  let toasterMock = new (function () {
    this.error = jasmine.createSpy('error');
    this.success = jasmine.createSpy('success');
  })();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Upload, useValue: uploadMock },
        { provide: Client, useValue: clientMock },
        { provide: TextParserService, useValue: TextParserService },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    clientMock.response = {};

    clientMock.response[`/api/v1/newsfeed/preview`] = { status: 'success' };

    httpMock = TestBed.inject(HttpTestingController);
    service = new AttachmentService(
      sessionMock,
      clientMock,
      uploadMock,
      httpMock,
      new TextParserService(),
      permissionIntentsServiceMock,
      TestBed.inject(ConfigsService)
    );

    clientMock.get.calls.reset();
    clientMock.post.calls.reset();
    mockObject = {
      guid: '758019279000969217',
      type: 'object',
      subtype: 'video',
      time_created: '1506101878',
      time_updated: '1506101878',
      container_guid: '758019184876593168',
      owner_guid: '758019184876593168',
      access_id: '2',
      featured: false,
      featured_id: false,
      ownerObj: {
        guid: '758019184876593168',
        type: 'user',
        name: 'nicoronchiprod',
        username: 'nicoronchiprod',
      },
      category: false,
      flags: { mature: true },
      wire_threshold: '0',
      thumbnail: false,
      cinemr_guid: '758019279000969217',
      license: false,
      monetized: false,
      mature: false,
      boost_rejection_reason: -1,
      thumbnail_src:
        'https://d3ae0shxev0cb7.cloudfront.net/api/v1/media/thumbnails/758019279000969217',
      src: {
        '360.mp4':
          'https://d2isvgrdif6ua5.cloudfront.net/cinemr_com/758019279000969217/360.mp4',
        '720.mp4':
          'https://d2isvgrdif6ua5.cloudfront.net/cinemr_com/758019279000969217/720.mp4',
      },
      'play:count': 6,
      description: '',
    };
  }));

  it('parseMature should return false when undefined', () => {
    expect(service.parseMaturity(undefined)).toEqual(false);
  });

  it('service should should prioritice flag as mature when repeated value', () => {
    expect(service.parseMaturity(mockObject)).toEqual(true);
  });

  it('service should should prioritice flag as mature when repeated value when mature is undefined', () => {
    mockObject.mature = undefined;
    expect(service.parseMaturity(mockObject)).toEqual(true);
  });

  it('service should should return false if not present in flags, and mature:false', () => {
    mockObject.flags = {};
    expect(service.parseMaturity(mockObject)).toEqual(false);
  });

  it('service should should return false if not present in flags, and mature:true', () => {
    mockObject.mature = true;
    mockObject.flags = {};
    expect(service.parseMaturity(mockObject)).toEqual(false);
  });

  it('preview should be set', fakeAsync(() => {
    service.preview('https://github.com/releases');
    tick(1000);
    expect(clientMock.get).toHaveBeenCalled();
  }));

  it('preview wont call if url doesnt change', fakeAsync(() => {
    service.preview('https://github.com/releases');
    tick(1000);
    service.preview('https://github.com/releases');
    tick(1000);
    expect(clientMock.get).toHaveBeenCalledTimes(1);
  }));

  it('preview call twice if url change', fakeAsync(() => {
    service.preview('https://github.com/releases');
    tick(1000);
    service.preview('https://github.com/releases2');
    tick(1000);
    expect(clientMock.get).toHaveBeenCalledTimes(2);
  }));

  it('preview call twice if url change and paste similar ones', fakeAsync(() => {
    service.preview('https://github.com/releases');
    tick(1000);
    service.preview('https://github.com/releases2');
    tick(1000);
    service.preview('https://github.com/releases2');
    tick(1000);
    service.preview('https://github.com/releases');
    tick(1000);
    expect(clientMock.get).toHaveBeenCalledTimes(3);
  }));

  it('preview shouldnt be called if already has a file', fakeAsync(() => {
    let file = {
      attachment_guid: 'guid',
      custom_data: {
        thumbnail_src: 'thumbnail/url/',
      },
    };

    service.load(file);

    service.preview('githubcom/releases');
    tick(1000);
    expect(clientMock.get).toHaveBeenCalledTimes(0);
  }));

  it('preview should be called once', fakeAsync(() => {
    service.preview('githubcom/releases');
    tick(1000);
    service.preview('https://github.com/releases2');
    tick(1000);
    expect(clientMock.get).toHaveBeenCalledTimes(1);
  }));

  it('should populate the request array', fakeAsync(() => {
    spyOn(service, 'addPreviewRequest');

    service.preview('https://github.com/releases');
    tick(1000);

    expect(service.addPreviewRequest).toHaveBeenCalledTimes(1);
  }));

  it('should check the request array on response', fakeAsync(() => {
    spyOn(service, 'getPreviewRequests');

    service.preview('https://github.com/releases');
    tick(1000);

    expect(service.getPreviewRequests).toHaveBeenCalledTimes(1);
  }));

  it('should reset the request array when called', fakeAsync(() => {
    service.addPreviewRequest('https://github.com/releases');
    expect(service.getPreviewRequests().length).toBe(1);

    service.resetPreviewRequests();
    tick(1000);

    expect(service.getPreviewRequests().length).toBe(0);
  }));

  // it('should discard changes if request array has been cleared', fakeAsync(() => {
  //   service.preview('https://github.com/releases');
  //   tick(1000);
  //   expect((service as any).meta).toBeFalsy();
  // }));
});
