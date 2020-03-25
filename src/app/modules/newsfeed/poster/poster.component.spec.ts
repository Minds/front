import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

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
import { MockComponent, MockDirective, MockService } from '../../../utils/mock';
import { HashtagsSelectorComponent } from '../../hashtags/selector/selector.component';
import { DropdownComponent } from '../../../common/components/dropdown/dropdown.component';
import { TagsInput } from '../../hashtags/tags-input/tags.component';
import { TopbarHashtagsService } from '../../hashtags/service/topbar.service';
import { topbarHashtagsServiceMock } from '../../../mocks/modules/hashtags/service/topbar.service.mock';
import { InMemoryStorageService } from '../../../services/in-memory-storage.service';
import { inMemoryStorageServiceMock } from '../../../../tests/in-memory-storage-service-mock.spec';
import { TextInputAutocompleteModule } from '../../../common/components/autocomplete';
import { AutocompleteSuggestionsService } from '../../suggestions/services/autocomplete-suggestions.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigsService } from '../../../common/services/configs.service';
import { TagsService } from '../../../common/services/tags.service';

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
          outputs: ['thresholdChange'],
        }),
        MockComponent({
          selector: 'minds-rich-embed',
          inputs: ['src', 'preview', 'maxheight', 'cropimage'],
        }),
        MockComponent({
          selector: 'm-poster-date-selector',
          inputs: ['date', 'dateFormat'],
          outputs: ['dateChange'],
        }),
        MockComponent({
          selector: 'm-tooltip',
          template: '<ng-content></ng-content>',
        }),
        DropdownComponent,
        TagsInput,
        HashtagsSelectorComponent,
        PosterComponent,
        MockDirective({
          selector: '[mIfFeature]',
          inputs: ['mIfFeature'],
        }),
        MockDirective({
          selector: '[mIfFeatureElse]',
          inputs: ['mIfFeatureElse'],
        }),
      ],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TextInputAutocompleteModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: Upload, useValue: uploadMock },
        { provide: AttachmentService, useValue: attachmentServiceMock },
        { provide: TopbarHashtagsService, useValue: topbarHashtagsServiceMock },
        {
          provide: InMemoryStorageService,
          useValue: inMemoryStorageServiceMock,
        },
        {
          provide: AutocompleteSuggestionsService,
          useValue: MockService(AutocompleteSuggestionsService),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
        {
          provide: TagsService,
          useValue: MockService(TagsService),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(PosterComponent);

    clientMock.response = {};

    attachmentServiceMock.rich = true;

    comp = fixture.componentInstance;

    spyOn(comp.session, 'isLoggedIn').and.callFake(() => {
      return true;
    });

    spyOn(comp.session, 'getLoggedInUser').and.callFake(() => {
      return {};
    });

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a textarea', () => {
    expect(getTextarea()).not.toBeNull();
  });

  it('should have an attachment button', () => {
    expect(
      fixture.debugElement.query(By.css('.attachment-button'))
    ).not.toBeNull();
  });
  it('should have an input for attachments', () => {
    expect(
      fixture.debugElement.query(By.css('.attachment-button > input'))
    ).not.toBeNull();
  });

  xit('should have a mature toggle', () => {
    expect(getMatureButton()).not.toBeNull();
  });

  it('should have a wire threshold input', () => {
    expect(
      fixture.debugElement.query(By.css('m-wire-threshold-input'))
    ).not.toBeNull();
  });

  it('should have a post button', () => {
    expect(getPostButton()).not.toBeNull();
  });

  it('should display an error when more than 6 hashtags are selected', fakeAsync(() => {
    const postButton: DebugElement = getPostButton();
    comp.meta.message = 'test #tags ';
    comp.hashtagsSelector.parseTags(
      '#test1 #test2 #test3 #test4 #test5 #test6'
    );
    comp.tags = comp.hashtagsSelector.tags;
    tick();

    spyOn(comp, 'post').and.callThrough();
    postButton.nativeElement.click();
    tick();

    expect(comp.hashtagsSelector.tags.length).toBe(6);
    expect(comp.tags.length).toBe(6);
    expect(comp.tooManyTags).toBeTruthy();
    expect(this.error).not.toBeNull();
  }));

  it('clicking on the post button should call api/v1/newsfeed', fakeAsync(() => {
    comp.meta.message = 'test #tags ';
    comp.hashtagsSelector.parseTags(comp.meta.message);

    fixture.detectChanges();

    clientMock.response['api/v1/newsfeed'] = { status: 'success' };

    spyOn(window, 'alert').and.callFake(function() {
      return true;
    });
    spyOn(comp, 'post').and.callThrough();

    getPostButton().nativeElement.click();
    tick();

    expect(comp.post).toHaveBeenCalled();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual(
      'api/v1/newsfeed'
    );
  }));

  it('should allow the user to make an NSFW post', fakeAsync(() => {
    comp.attachment.setNSFW([
      { value: 'naughty', selected: true },
      { value: 'rude', selected: true },
      { value: 'not very nice', selected: true },
    ]);

    comp.meta.message = 'test #tags ';
    comp.hashtagsSelector.parseTags(comp.meta.message);

    fixture.detectChanges();

    clientMock.response['api/v1/newsfeed'] = { status: 'success' };

    spyOn(window, 'alert').and.callFake(function() {
      return true;
    });
    spyOn(comp, 'post').and.callThrough();

    getPostButton().nativeElement.click();
    tick();

    expect(comp.post).toHaveBeenCalled();
    expect(clientMock.post).toHaveBeenCalled();

    expect(clientMock.post.calls.mostRecent().args[1]['nsfw']).toEqual([
      'naughty',
      'rude',
      'not very nice',
    ]);
  }));
});
