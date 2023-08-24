import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoostConsoleFeedComponent } from './feed.component';
import { BoostConsoleService } from '../services/console.service';
import { MockService } from '../../../../utils/mock';
import { FeedsService } from '../../../../common/services/feeds.service';
import { BehaviorSubject, of } from 'rxjs';

describe('BoostConsoleFeedComponent', () => {
  let component: BoostConsoleFeedComponent;
  let fixture: ComponentFixture<BoostConsoleFeedComponent>;

  let feedsServiceMock = {
    canFetchMore: true,
    inProgress: new BehaviorSubject(false),
    offset: new BehaviorSubject<number>(0),
    feed: new BehaviorSubject(Array(25).fill(of({}))),
    clear() {
      of({ response: false }, { response: false }, { response: true });
    },
    response() {
      return { response: true };
    },
    setEndpoint(str) {
      return this;
    }, //chainable
    setLimit(limit) {
      return this;
    },
    setParams(params) {
      return this;
    },
    setUnseen(params) {
      return this;
    },
    fetch() {
      return this;
    },
    loadMore() {
      return this;
    },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.overrideComponent(BoostConsoleFeedComponent, {
        set: {
          providers: [
            {
              provide: FeedsService,
              useValue: feedsServiceMock,
            },
          ],
        },
      }); // https://medium.com/ngconf/how-to-override-component-providers-in-angular-unit-tests-b73b47b582e3
      TestBed.configureTestingModule({
        declarations: [BoostConsoleFeedComponent],
        providers: [
          {
            provide: BoostConsoleService,
            useValue: MockService(BoostConsoleService),
          },
        ],
      })
        .overrideProvider(FeedsService, {
          useValue: feedsServiceMock,
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostConsoleFeedComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
