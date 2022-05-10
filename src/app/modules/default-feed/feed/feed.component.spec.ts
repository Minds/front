import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DefaultFeedComponent } from './feed.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../utils/mock';
import { FeedsService } from '../../../common/services/feeds.service';
import { feedsServiceMock } from '../../../../tests/feed-service-mock.spec';
import { GlobalScrollService } from '../../../services/ux/global-scroll.service';
import { By } from '@angular/platform-browser';
import { Session } from './../../../services/session';
import { ExperimentsService } from '../../experiments/experiments.service';

describe('DefaultFeedComponent', () => {
  let comp: DefaultFeedComponent;
  let fixture: ComponentFixture<DefaultFeedComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.overrideComponent(DefaultFeedComponent, {
        set: {
          providers: [{ provide: FeedsService, useValue: feedsServiceMock }],
        },
      }); // https://medium.com/ngconf/how-to-override-component-providers-in-angular-unit-tests-b73b47b582e3
      TestBed.configureTestingModule({
        declarations: [
          MockComponent({
            selector: 'm-activity',
            inputs: ['entity', 'displayOptions', 'slot'],
          }),
          MockComponent({
            selector: 'infinite-scroll',
            inputs: ['moreData', 'inProgress'],
            outputs: ['load'],
          }),
          DefaultFeedComponent,
        ],
        imports: [RouterTestingModule, ReactiveFormsModule],
        providers: [
          { provide: FeedsService, useValue: feedsServiceMock },
          {
            provide: GlobalScrollService,
            useValue: MockService(GlobalScrollService),
          },
          { provide: Session, useValue: MockService(Session) },
          {
            provide: ExperimentsService,
            useValue: MockService(ExperimentsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(DefaultFeedComponent);

    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should have loaded an activity', () => {
    expect(By.css('m-activity')).toBeDefined();
  });

  it('should have an infinite scroll component', () => {
    expect(By.css('infinite-scroll')).toBeDefined();
  });

  it('should load', () => {
    spyOn(comp.feedsService, 'setEndpoint').and.returnValue(comp.feedsService);
    spyOn(comp.feedsService, 'setLimit').and.returnValue(comp.feedsService);
    spyOn(comp.feedsService, 'setUnseen').and.returnValue(comp.feedsService);
    spyOn(comp.feedsService, 'fetch');

    (comp as any).load();

    expect(comp.feedsService.setEndpoint).toHaveBeenCalledWith(
      'api/v3/newsfeed/default-feed'
    );
    expect(comp.feedsService.setLimit).toHaveBeenCalledWith(12);
    expect(comp.feedsService.fetch).toHaveBeenCalledWith(false);
  });

  it('should call to load more', () => {
    comp.feedsService.canFetchMore = true;
    comp.feedsService.inProgress.next(false);
    comp.feedsService.offset.next(12);

    spyOn(comp.feedsService, 'fetch');
    spyOn(comp.feedsService, 'loadMore');

    (comp as any).loadNext();

    expect(comp.feedsService.fetch).toHaveBeenCalled();
    expect(comp.feedsService.loadMore).toHaveBeenCalled();
  });
});
