import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';

import { PosterComponent } from './poster.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { Upload } from '../../../services/api/upload';
import { uploadMock } from '../../../../tests/upload-mock.spec';
import { AttachmentService } from '../../../services/attachment';
import { attachmentServiceMock } from '../../../../tests/attachment-service-mock.spec';
import { AutoGrow } from '../../../common/directives/autogrow';
import { MaterialUploadMock } from '../../../mocks/common/directives/material/upload-mock';
import { CommonModule } from '@angular/common';
import { MockComponent } from '../../../utils/mock';
import { TextInputAutocompleteModule } from 'angular-text-input-autocomplete';
import { HashtagsSelectorComponent } from '../../hashtags/selector/selector.component';
import { DropdownComponent } from '../../../common/components/dropdown/dropdown.component';
import { TagsInput } from '../../hashtags/tags-input/tags.component';
import {TopbarHashtagsService} from "../../hashtags/service/topbar.service";
import {topbarHashtagsServiceMock} from "../../../mocks/modules/hashtags/service/topbar.service.mock";

@Component({
  selector: 'minds-third-party-networks-selector',
  exportAs: 'thirdPartyNetworksSelector',
  template: '',
})

class ThirdPartyNetworksSelectorMock {
  inject(data) {
    return data;
  }
}

describe('PosterComponent', () => {
  let comp: PosterComponent;
  let fixture: ComponentFixture<PosterComponent>;


  function getTextarea(): DebugElement {
    return fixture.debugElement.query(By.css('textarea'));
  }

  function getMatureButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-mature-button'));
  }

  function getPostButton(): DebugElement {
    return fixture.debugElement.query(By.css('button[type=submit]'));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AutoGrow,
        MaterialMock,
        MaterialUploadMock,
        ThirdPartyNetworksSelectorMock,
        MockComponent({
          selector: 'm-wire-threshold-input',
          inputs: ['threshold', 'disabled', 'enabled'],
          outputs: ['thresholdChange']
        }),
        MockComponent({ selector: 'minds-rich-embed', inputs: ['src', 'preview', 'maxheight', 'cropimage'] }),
        MockComponent({ selector: 'm-tooltip', template: '<ng-content></ng-content>' }),
        DropdownComponent,
        TagsInput,
        HashtagsSelectorComponent,
        PosterComponent,
      ],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TextInputAutocompleteModule,
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: Upload, useValue: uploadMock },
        { provide: AttachmentService, useValue: attachmentServiceMock },
        { provide: TopbarHashtagsService, useValue: topbarHashtagsServiceMock },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();

    fixture = TestBed.createComponent(PosterComponent);

    clientMock.response = {};

    window.Minds.user = {
      "guid": "732337264197111809",
      "type": "user",
      "subtype": false,
      "time_created": "1499978809",
      "time_updated": false,
      "container_guid": "0",
      "owner_guid": "0",
      "site_guid": false,
      "access_id": "2",
      "name": "minds",
      "username": "minds",
      "language": "en",
      "icontime": "1506690756",
      "legacy_guid": false,
      "featured_id": false,
      "banned": "no",
      "website": "",
      "dob": "",
      "gender": "",
      "city": "",
      "merchant": {},
      "boostProPlus": false,
      "fb": false,
      "mature": 0,
      "monetized": "",
      "signup_method": false,
      "social_profiles": [],
      "feature_flags": false,
      "programs": ["affiliate"],
      "plus": false,
      "verified": false,
      "disabled_boost": false,
      "show_boosts": false,
      "chat": true,
      "subscribed": false,
      "subscriber": false,
      "subscriptions_count": 1,
      "impressions": 10248,
      "boost_rating": "2",
      "spam": 0,
      "deleted": 0
    };

    attachmentServiceMock.rich = true;

    comp = fixture.componentInstance;

    spyOn(comp.session, 'isLoggedIn').and.callFake(() => {
      return true;
    });

    spyOn(comp.session, 'getLoggedInUser').and.callFake(() => {
      return window.Minds.user;
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should show the user's avatar", () => {
    const img: DebugElement = fixture.debugElement.query(By.css('.post .mdl-card__supporting-text .minds-avatar img'));
    expect(img).not.toBeNull();
    expect(img.nativeElement.src).toContain('icon/732337264197111809/medium/1506690756/');
  });

  it("should have a textarea", () => {
    expect(getTextarea()).not.toBeNull();
  });

  it('should have a list of third party networks', () => {
    expect(fixture.debugElement.query(By.css('minds-third-party-networks-selector'))).not.toBeNull();
  });

  it('should have an attachment button', () => {
    expect(fixture.debugElement.query(By.css('.attachment-button'))).not.toBeNull();
  });
  it('should have an input for attachments', () => {
    expect(fixture.debugElement.query(By.css('.attachment-button > input'))).not.toBeNull();
  });

  it('should have a mature toggle', () => {
    expect(getMatureButton()).not.toBeNull();
  });

  it('should have a wire threshold input', () => {
    expect(fixture.debugElement.query(By.css('m-wire-threshold-input'))).not.toBeNull();
  });

  it('should have a post button', () => {
    expect(getPostButton()).not.toBeNull();
  });
  it('clicking on the post button should call api/v1/newsfeed', fakeAsync(() => {
    comp.meta.message = 'test #tags ';
    comp.hashtagsSelector.parseTags(comp.meta.message);

    fixture.detectChanges();

    clientMock.response['api/v1/newsfeed'] = { status: 'success' };

    spyOn(comp, 'post').and.callThrough();

    getPostButton().nativeElement.click();
    tick();

    expect(comp.post).toHaveBeenCalled();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual('api/v1/newsfeed');
  }));
});
