import { AttachmentService } from './attachment';
import { Inject } from '@angular/core';
import { Client, Upload } from './api';
import { Session } from './session';
import { clientMock } from '../../tests/client-mock.spec';
import { uploadMock } from '../../tests/upload-mock.spec';
import { sessionMock } from '../../tests/session-mock.spec';

import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

/* tslint:disable */

describe('Service: Attachment Service', () => {
  let service: AttachmentService;
  let mockObject;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentService ],
      providers: [
        { provide: Session, useValue: uploadMock },
        { provide: Upload, useValue: uploadMock },
        { provide: Client, useValue: sessionMock }
      ]
    });

    service = new AttachmentService(sessionMock, clientMock, uploadMock);

    mockObject = {
      'guid':'758019279000969217',
      'type':'object',
      'subtype':'video',
      'time_created':'1506101878',
      'time_updated':'1506101878',
      'container_guid':'758019184876593168',
      'owner_guid':'758019184876593168',
      'access_id':'2',
      'featured':false,
      'featured_id':false,
      'ownerObj':{
        'guid':'758019184876593168',
        'type':'user',
        'name':'nicoronchiprod',
        'username':'nicoronchiprod'
      },
      'category':false,
      'flags':{'mature':true},
      'wire_threshold':'0',
      'thumbnail':false,
      'cinemr_guid':'758019279000969217',
      'license':false,
      'monetized':false,
      'mature':false,
      'boost_rejection_reason':-1,
      'thumbnail_src':'https:\/\/d3ae0shxev0cb7.cloudfront.net\/api\/v1\/media\/thumbnails\/758019279000969217',
      'src':{'360.mp4':'https:\/\/d2isvgrdif6ua5.cloudfront.net\/cinemr_com\/758019279000969217\/360.mp4','720.mp4':'https:\/\/d2isvgrdif6ua5.cloudfront.net\/cinemr_com\/758019279000969217\/720.mp4'},
      'play:count':6,
      'description':''
    };
  }));

  it('parseMature should return false when undefined', () => {
    expect(service.parseMaturity(undefined)).toEqual(false);
  });

  it('service should should prioritice flag as mature when repeated value', () => {
    expect(service.parseMaturity(mockObject)).toEqual(true);
  });

  it('service should should prioritice flag as mature when repeated value', () => {
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
});
