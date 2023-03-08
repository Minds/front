import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewsfeedComponent } from './newsfeed.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../services/session';
import { clientMock } from '../../../tests/client-mock.spec';
import { sessionMock } from '../../../tests/session-mock.spec';
import { uploadMock } from '../../../tests/upload-mock.spec';
import { Upload } from '../../services/api/upload';
import { ContextService } from '../../services/context.service';
import { contextServiceMock } from '../../../tests/context-service-mock.spec';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '../../services/storage';
import { storageMock } from '../../../tests/storage-mock.spec';
import { Navigation } from '../../services/navigation';
import { navigationMock } from '../../../tests/navigation-service-mock.spec';
import { MockComponent, MockDirective, MockService } from '../../utils/mock';
import { NewsfeedService } from './services/newsfeed.service';
import { newsfeedServiceMock } from '../../mocks/modules/newsfeed/services/newsfeed-service.mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PagesService } from '../../common/services/pages.service';
import { pagesServiceMock } from '../../mocks/services/pages-mock.spec';
import { LiquiditySpotComponent } from '../boost/liquidity-spot/liquidity-spot.component';
import { ModalService } from '../../services/ux/modal.service';
import { modalServiceMock } from '../../../tests/modal-service-mock.spec';
import { ApiService } from '../../common/api/api.service';
import { ExperimentsService } from '../experiments/experiments.service';

describe('NewsfeedComponent', () => {
  let comp: NewsfeedComponent;
  let fixture: ComponentFixture<NewsfeedComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
          MockComponent({
            selector: 'm-tooltip',
            inputs: ['icon'],
            template: '<ng-content></ng-content>',
          }),
          MockComponent({
            selector: 'm-newsfeed--dropdown',
            inputs: ['options'],
            template: '',
          }),
          MockComponent({
            selector: 'm-tagcloud',
            inputs: ['options'],
            template: '',
          }),
          MockComponent({
            selector: 'm-ads-boost',
            inputs: ['handler', 'limit'],
            template: '',
          }),
          MockComponent({
            selector: 'm-topbar--hashtags',
            inputs: ['enabled'],
            outputs: ['selectionChange'],
            template: '',
          }),
          MockComponent({ selector: 'm-suggestions__sidebar' }),
          MockComponent({
            selector: 'm-hashtags--sidebar-selector',
            inputs: ['disabled', 'currentHashtag', 'preferred', 'compact'],
            outputs: ['filterChange', 'switchAttempt'],
          }),
          MockComponent({ selector: 'm-liquiditySpot' }),
          NewsfeedComponent,
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
              params: of({}),
              url: of({ segments: [] }),
              snapshot: { firstChild: { routeConfig: { path: '' } } },
            },
          },
          { provide: Storage, useValue: storageMock },
          { provide: Navigation, useValue: navigationMock },
          { provide: ModalService, useValue: modalServiceMock },
          { provide: NewsfeedService, useValue: newsfeedServiceMock },
          { provide: PagesService, useValue: pagesServiceMock },
          { provide: ApiService, useValue: MockService(ApiService) },
          {
            provide: ExperimentsService,
            useValue: MockService(ExperimentsService),
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents(); // compile template and css
    })
  );

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(NewsfeedComponent);

    comp = fixture.componentInstance; // NewsfeedComponent test instance

    clientMock.response = {};

    sessionMock.user.admin = false;
    sessionMock.loggedIn = true;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
    (<any>localStorage).clear();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a right sidebar', () => {
    comp.showRightSidebar = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-newsfeed--boost-sidebar'))
    ).not.toBeNull();
  });

  it('should have m-ads-boost in the right sidebar', () => {
    comp.showRightSidebar = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.css('.m-newsfeed--boost-sidebar m-ads-boost')
      )
    ).not.toBeNull();
  });

  it('should not have m-ads-boost in the right sidebar if the user is plus and has boosts disabled', () => {
    comp.showRightSidebar = true;
    sessionMock.user.plus = true;
    sessionMock.user.disabled_boost = false;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.css('.m-newsfeed--boost-sidebar m-ads-boost')
      )
    ).not.toBeNull();
  });
});
