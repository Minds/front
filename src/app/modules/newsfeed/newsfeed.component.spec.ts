import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
import { MockComponent, MockDirective } from '../../utils/mock';
import { overlayModalServiceMock } from '../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { NewsfeedService } from './services/newsfeed.service';
import { newsfeedServiceMock } from '../../mocks/modules/newsfeed/services/newsfeed-service.mock';
import { IfFeatureDirective } from '../../common/directives/if-feature.directive';
import { FeaturesService } from '../../services/features.service';
import { featuresServiceMock } from '../../../tests/features-service-mock.spec';
import { NewsfeedHashtagSelectorService } from './services/newsfeed-hashtag-selector.service';
import { newsfeedHashtagSelectorServiceMock } from '../../../tests/newsfeed-hashtag-selector-service-mock.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PagesService } from '../../common/services/pages.service';
import { pagesServiceMock } from '../../mocks/services/pages-mock.spec';

describe('NewsfeedComponent', () => {
  let comp: NewsfeedComponent;
  let fixture: ComponentFixture<NewsfeedComponent>;

  beforeEach(async(() => {
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
          selector: 'minds-card-user',
          inputs: ['object'],
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
        IfFeatureDirective,
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
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        { provide: NewsfeedService, useValue: newsfeedServiceMock },
        {
          provide: NewsfeedHashtagSelectorService,
          useValue: newsfeedHashtagSelectorServiceMock,
        },
        { provide: FeaturesService, useValue: featuresServiceMock },
        { provide: PagesService, useValue: pagesServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(NewsfeedComponent);

    comp = fixture.componentInstance; // NewsfeedComponent test instance

    clientMock.response = {};
    featuresServiceMock.mock('top-feeds', false);
    featuresServiceMock.mock('suggested-users', false);
    featuresServiceMock.mock('pro', false);
    featuresServiceMock.mock('navigation', false);

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

  it('should have Top, Subscribed and BoostFeed sections in the toolbar', () => {
    const top = fixture.debugElement.query(
      By.css(
        '.m-topbar--navigation .m-topbar--navigation--item:nth-child(1) > span'
      )
    );
    const topTooltip = fixture.debugElement.query(
      By.css(
        '.m-topbar--navigation .m-topbar--navigation--item:nth-child(1) > m-tooltip'
      )
    );

    const subscribed = fixture.debugElement.query(
      By.css(
        '.m-topbar--navigation .m-topbar--navigation--item:nth-child(2) > span'
      )
    );
    const subscribedTooltip = fixture.debugElement.query(
      By.css(
        '.m-topbar--navigation .m-topbar--navigation--item:nth-child(2) > m-tooltip'
      )
    );

    const boostfeed = fixture.debugElement.query(
      By.css(
        '.m-topbar--navigation .m-topbar--navigation--item:nth-child(3) > span'
      )
    );
    const boostfeedTooltip = fixture.debugElement.query(
      By.css(
        '.m-topbar--navigation .m-topbar--navigation--item:nth-child(3) > m-tooltip'
      )
    );

    expect(top).not.toBeNull();
    expect(top.nativeElement.textContent).toContain('Top');
    expect(topTooltip.nativeElement.textContent).toContain(
      'Top displays your top suggested content on Minds based on hashtags'
    );

    expect(subscribed).not.toBeNull();
    expect(subscribed.nativeElement.textContent).toContain('Subscriptions');
    expect(subscribedTooltip.nativeElement.textContent).toContain(
      'Your Newsfeed contains posts from channels that you are subscribed to, as well as boosted posts from the wider network'
    );

    expect(boostfeed).not.toBeNull();
    expect(boostfeed.nativeElement.textContent).toContain('BoostFeed');
    expect(boostfeedTooltip.nativeElement.textContent).toContain(
      'The Boostfeed only shows boosted posts from the wider network. To Boost your content, click the Boost icon on the topbar'
    );
  });

  it('should have an m-newsfeed--dropdown', () => {
    expect(
      fixture.debugElement.query(
        By.css('.m-topbar--navigation m-newsfeed--dropdown')
      )
    ).not.toBeNull();
  });

  it('should have a User card in the sidebar', () => {
    expect(
      fixture.debugElement.query(By.css('.m-newsfeed--sidebar minds-card-user'))
    ).not.toBeNull();
  });

  xit("should have an 'Upgrade to Plus' button in the sidebar if the user isn't part of the program yet", () => {
    sessionMock.user.plus = false;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(
        By.css('.m-newsfeed--sidebar .m-newsfeed--upgrade-to-plus')
      )
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(
        By.css(
          '.m-newsfeed--sidebar .m-newsfeed--upgrade-to-plus div i:first-child'
        )
      ).nativeElement.textContent
    ).toContain('add_circle');
    expect(
      fixture.debugElement.query(
        By.css('.m-newsfeed--sidebar .m-newsfeed--upgrade-to-plus div')
      ).nativeElement.textContent
    ).toContain('Upgrade to Plus');
    expect(
      fixture.debugElement.query(
        By.css(
          '.m-newsfeed--sidebar .m-newsfeed--upgrade-to-plus div i:last-child'
        )
      ).nativeElement.textContent
    ).toContain('close');

    sessionMock.user.plus = true;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(
        By.css('.m-newsfeed--sidebar .m-newsfeed--upgrade-to-plus')
      )
    ).toBeNull();
  });

  xit('should allow to close the Upgrade to Plus button', () => {
    sessionMock.user.plus = false;
    fixture.detectChanges();

    spyOn(comp, 'hidePlusButton').and.callThrough();
    const button = fixture.debugElement.query(
      By.css(
        '.m-newsfeed--sidebar .m-newsfeed--upgrade-to-plus div i:last-child'
      )
    );
    button.nativeElement.click();
    fixture.detectChanges();

    expect(comp.hidePlusButton).toHaveBeenCalled();
    expect(comp.showPlusButton).toBeFalsy();
  });

  xit("should have a 'Buy Minds Tokens' button in the sidebar", () => {
    expect(
      fixture.debugElement.query(
        By.css('.m-newsfeed--sidebar .m-newsfeed--buy-tokens')
      )
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(
        By.css('.m-newsfeed--sidebar .m-newsfeed--buy-tokens div i:first-child')
      ).nativeElement.textContent
    ).toContain('account_balance');
    expect(
      fixture.debugElement.query(
        By.css('.m-newsfeed--sidebar .m-newsfeed--buy-tokens div')
      ).nativeElement.textContent
    ).toContain('Buy Minds Tokens');
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

  it('should have footer with links to different pages and a copyright in the right sidebar', () => {
    comp.showRightSidebar = true;
    fixture.detectChanges();

    const ul = fixture.debugElement.query(
      By.css('.m-newsfeed-footer ul.m-footer-nav')
    ).nativeElement;
    expect(ul.children[0].children[0].textContent).toContain('Newsfeed');
    expect(ul.children[1].children[0].textContent).toContain('Discovery');
    expect(ul.children[2].children[0].textContent).toContain('Blogs');
    expect(ul.children[3].children[0].textContent).toContain('Groups');
    expect(ul.children[4].children[0].textContent).toContain(
      'Help & Support Group'
    );
    expect(ul.children[5].children[0].textContent).toContain('Admin');

    const copyright = fixture.debugElement.query(
      By.css('.m-newsfeed-footer .copyright')
    );
    expect(copyright).not.toBeNull();
    expect(copyright.nativeElement.textContent).toContain('© Minds 2020');
  });
});
