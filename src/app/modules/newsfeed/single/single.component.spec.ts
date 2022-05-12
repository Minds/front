import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { NewsfeedSingleComponent } from './single.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By, Meta } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { uploadMock } from '../../../../tests/upload-mock.spec';
import { Upload } from '../../../services/api/upload';
import { ContextService } from '../../../services/context.service';
import { contextServiceMock } from '../../../../tests/context-service-mock.spec';
import { of, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { EntitiesService } from '../../../common/services/entities.service';
import { MockService, MockComponent, MockDirective } from '../../../utils/mock';
import { FeaturesService } from '../../../services/features.service';
import { featuresServiceMock } from '../../../../tests/features-service-mock.spec';
import { MetaService } from '../../../common/services/meta.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { SocialIcons } from '../../legacy/components/social-icons/social-icons';
import { ActivityComponent } from '../activity/activity.component';
import { HeadersService } from '../../../common/services/headers.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { LoadingSpinnerComponent } from '../../../common/components/loading-spinner/loading-spinner.component';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { ExperimentsService } from '../../experiments/experiments.service';

@Component({
  selector: 'minds-activity',
  template: '',
})
class MindsActivityMock {
  @Input() focusedCommentGuid: string;
  @Input() object: any;
  @Input() commentsToggle: boolean;
  @Input() showRatingToggle: boolean;
  @Input() editing: boolean;
  @Input() autoplayVideo: boolean;
}

const routerMock = new (function() {
  this.navigate = jasmine.createSpy('navigate').and.stub();
})();

describe('NewsfeedSingleComponent', () => {
  let comp: NewsfeedSingleComponent;
  let fixture: ComponentFixture<NewsfeedSingleComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MaterialMock,
          MindsActivityMock,
          NewsfeedSingleComponent,
          MockComponent({
            selector: 'm-social-icons',
            inputs: ['url', 'title', 'embed'],
          }),
          MockComponent({
            selector: 'm-activity',
            inputs: ['entity', 'displayOptions', 'autoplayVideo'],
          }),
          LoadingSpinnerComponent,
          MockDirective({
            selector: 'm-clientMeta',
          }),
          MockComponent({
            selector: 'm-newsfeed__activitySuggestions',
            inputs: ['baseEntity'],
          }),
          MockComponent({
            selector: 'm-discovery__sidebarTags',
            inputs: ['entityGuid'],
          }),
        ],
        imports: [RouterTestingModule, ReactiveFormsModule],
        providers: [
          { provide: Session, useValue: sessionMock },
          { provide: Client, useValue: clientMock },
          { provide: Upload, useValue: uploadMock },
          { provide: ContextService, useValue: contextServiceMock },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({ guid: 123 }),
              snapshot: {
                queryParamMap: convertToParamMap({}),
              },
              queryParamMap: new BehaviorSubject(convertToParamMap({})),
            },
          },
          { provide: MetaService, useValue: MockService(MetaService) },
          { provide: EntitiesService, useValue: MockService(EntitiesService) },
          { provide: FeaturesService, useValue: featuresServiceMock },
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
          { provide: HeadersService, useValue: MockService(HeadersService) },
          {
            provide: AuthModalService,
            useValue: MockService(AuthModalService),
          },
          {
            provide: ExperimentsService,
            useValue: MockService(ExperimentsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(NewsfeedSingleComponent);

    comp = fixture.componentInstance;

    clientMock.response = {};

    clientMock.response['api/v1/newsfeed/single/123'] = {
      status: 'success',
      activity: {
        guid: '123',
        type: 'activity',
        time_created: '1525415052',
        time_updated: '1525415052',
        container_guid: '1234',
        owner_guid: '1234',
        access_id: '2',
        message: "i'm a message",
        ownerObj: {},
      },
      require_login: false,
    };

    sessionMock.user.admin = false;
    sessionMock.user.hide_share_buttons = false;

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

  xit("should have loaded the activity on component's init", () => {
    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe(
      'api/v1/newsfeed/single/123'
    );
  });

  xit('it should show the activity', () => {
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.minds-list m-activity'))
    ).not.toBeNull();
  });

  it('it should show a spam notice if the activity was marked as spam', () => {
    comp.activity = {
      spam: true,
    };

    fixture.detectChanges();

    const spamNotice = fixture.debugElement.query(By.css('.m--spam-notice'));
    expect(spamNotice).not.toBeNull();
    expect(spamNotice.nativeElement.textContent).toContain(
      'This activity is flagged as spam.'
    );
    expect(spamNotice.nativeElement.textContent).toContain(
      'If you wish to appeal, please contact us at info@minds.com.'
    );
  });

  it('it should not show the appeal text if the user is an admin', () => {
    comp.activity = {
      spam: true,
    };
    sessionMock.user.admin = true;

    fixture.detectChanges();

    const spamNotice = fixture.debugElement.query(By.css('.m--spam-notice'));
    expect(spamNotice).not.toBeNull();
    expect(spamNotice.nativeElement.textContent).toContain(
      'This activity is flagged as spam.'
    );
    expect(spamNotice.nativeElement.textContent).not.toContain(
      'If you wish to appeal, please contact us at info@minds.com.'
    );
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
