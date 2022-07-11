import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from '../../../../common/api/api.service';
import { sampleUsers } from '../../../../../tests/samples/sample-users';
import { MockComponent, MockDirective } from '../../../../utils/mock';
import { MutualSubscriptionsComponent } from './mutual-subscriptions.component';
import { UserAggregatorComponent } from '../../../../common/components/user-aggregator/user-aggregator.component';
import { TruncatePipe } from '../../../../common/pipes/truncate.pipe';

describe('MutualSubscriptionsComponent', () => {
  let comp: MutualSubscriptionsComponent;
  let fixture: ComponentFixture<MutualSubscriptionsComponent>;

  let mockedApiResponse = new Subject();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          MutualSubscriptionsComponent,
          UserAggregatorComponent,
          MockComponent({
            selector: 'm-hovercard',
            inputs: ['publisher', 'offset'],
          }),
          MockComponent({
            selector: 'minds-avatar',
            inputs: ['object'],
          }),
          TruncatePipe,
        ],
        providers: [
          {
            provide: ApiService,
            useValue: {
              get: () => mockedApiResponse,
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualSubscriptionsComponent);
    comp = fixture.componentInstance;
    comp.userGuid = '123';
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should display if api has users', () => {
    mockedApiResponse.next({
      count: 12,
      users: sampleUsers,
    });

    fixture.detectChanges();

    const usernames: DebugElement[] = fixture.debugElement.queryAll(
      By.css(`.m-userAggregator__usernameHref`)
    );

    expect(usernames.length).toBe(2);
  });

  it('should NOT display if api has no users', () => {
    mockedApiResponse.next({
      count: 0,
      users: [],
    });

    fixture.detectChanges();

    const usernames: DebugElement[] = fixture.debugElement.queryAll(
      By.css(`.m-userAggregator__usernameHref`)
    );

    expect(usernames.length).toBe(0);
  });
});
