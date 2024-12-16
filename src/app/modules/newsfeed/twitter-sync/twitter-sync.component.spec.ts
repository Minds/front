import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { TwitterSyncService } from './twitter-sync.service';
import { TwitterSyncTweetMessageGQL } from '../../../../graphql/generated.strapi';
import { SITE_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { TwitterSyncComponent } from './twitter-sync.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { of, throwError } from 'rxjs';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('TwitterSyncComponent', () => {
  let comp: TwitterSyncComponent;
  let fixture: ComponentFixture<TwitterSyncComponent>;

  const configsMock: jasmine.SpyObj<ConfigsService> =
    jasmine.createSpyObj<ConfigsService>(['get']);
  const twitterSyncTweetMessageGqlMock: jasmine.SpyObj<TwitterSyncTweetMessageGQL> =
    jasmine.createSpyObj<TwitterSyncTweetMessageGQL>(['fetch']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TwitterSyncComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'saving'],
          outputs: ['onAction'],
        }),
      ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        { provide: ConfigsService, useValue: configsMock },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: TwitterSyncService,
          useValue: MockService(TwitterSyncService),
        },
        {
          provide: TwitterSyncTweetMessageGQL,
          useValue: twitterSyncTweetMessageGqlMock,
        },
        { provide: SITE_URL, useValue: 'https://example.minds.com/' },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    spyOn(window, 'open');
  });

  beforeEach(() => {
    configsMock.get.withArgs('twitter').and.returnValue({
      min_followers_for_sync: 1,
    });

    fixture = TestBed.createComponent(TwitterSyncComponent);
    comp = fixture.componentInstance;

    (comp as any).twitterSyncService.getConnectedAccount.and.returnValue(
      Promise.resolve({ discoverable: true })
    );
    (comp as any).session.getLoggedInUser.and.returnValue({
      username: 'testuser',
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    (window.open as any).calls.reset();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to open Twitter to post with Strapi driven message', fakeAsync(() => {
    (comp as any).twitterSyncMessageGql.fetch.and.returnValue(
      of({
        data: {
          twitterSyncTweetText: {
            data: {
              attributes: {
                tweetText: 'Here is my Minds account {url}',
              },
            },
          },
        },
      })
    );

    comp.postToTwitter(null);
    tick();

    expect((comp as any).twitterSyncMessageGql.fetch).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledOnceWith(
      'https://twitter.com/intent/tweet?text=Here is my Minds account https://example.minds.com/testuser'
    );
  }));

  it('should call to open Twitter to post with default message when no tweet text is provided', fakeAsync(() => {
    (comp as any).twitterSyncMessageGql.fetch.and.returnValue(
      of({
        data: {
          twitterSyncTweetText: {
            data: {
              attributes: {
                tweetText: '',
              },
            },
          },
        },
      })
    );

    comp.postToTwitter(null);
    tick();

    expect((comp as any).twitterSyncMessageGql.fetch).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledOnceWith(
      'https://twitter.com/intent/tweet?text=Follow me on @minds https://example.minds.com/testuser'
    );
  }));

  it('should call to open Twitter to post with default message when there is an error retrieving tweet text', fakeAsync(() => {
    (comp as any).twitterSyncMessageGql.fetch.and.returnValue(
      throwError(() => new Error('ERROR!'))
    );

    comp.postToTwitter(null);
    tick();

    expect((comp as any).twitterSyncMessageGql.fetch).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledOnceWith(
      'https://twitter.com/intent/tweet?text=Follow me on @minds https://example.minds.com/testuser'
    );
  }));
});
