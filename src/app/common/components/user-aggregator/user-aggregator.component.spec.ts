import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { sampleUsers } from '../../../../tests/samples/sample-users';
import { MockComponent } from '../../../utils/mock';
import { UserAggregatorComponent } from './user-aggregator.component';

describe('UserAggregatorComponent', () => {
  let comp: UserAggregatorComponent;
  let fixture: ComponentFixture<UserAggregatorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          UserAggregatorComponent,
          MockComponent({
            selector: 'm-hovercard',
            inputs: ['publisher', 'offset'],
          }),
          MockComponent({
            selector: 'minds-avatar',
            inputs: ['object'],
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAggregatorComponent);
    comp = fixture.componentInstance;
    comp.users = sampleUsers;
    comp.usernameAmount = 2;
    comp.avatarAmount = 3;
    comp.totalCount = null;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should display 2 names by default', () => {
    const usernames: DebugElement[] = fixture.debugElement.queryAll(
      By.css(`.m-userAggregator__usernameHref`)
    );
    expect(usernames.length).toBe(2);
  });

  it('should display 3 names by when usernameAmount overridden', () => {
    comp.usernameAmount = 3;
    fixture.detectChanges();

    const usernames: DebugElement[] = fixture.debugElement.queryAll(
      By.css(`.m-userAggregator__usernameHref`)
    );
    expect(usernames.length).toBe(3);
  });

  it('should have usernames linked to channels', () => {
    const usernames: DebugElement[] = fixture.debugElement.queryAll(
      By.css(`.m-userAggregator__usernameHref`)
    );
    expect(usernames[0].nativeElement.getAttribute('href')).toBe('/user1');
    expect(usernames[1].nativeElement.getAttribute('href')).toBe('/user2');
  });

  it('should display total count of users if no totalCount is provided', () => {
    const summary: DebugElement = fixture.debugElement.query(
      By.css(`.m-userAggregator__userSummary`)
    );
    expect(summary).toBeTruthy();
    expect(summary.nativeElement.innerHTML).toContain('and 3 others');
  });

  it('should display total count of users if totalCount IS provided', () => {
    comp.totalCount = 10;
    fixture.detectChanges();

    const summary: DebugElement = fixture.debugElement.query(
      By.css(`.m-userAggregator__userSummary`)
    );
    expect(summary).toBeTruthy();
    expect(summary.nativeElement.innerHTML).toContain('and 8 others');
  });

  it('should have hovercards for the amount of users specified in the avatarAmount', () => {
    comp.avatarAmount = 3;
    fixture.detectChanges();

    const hovercards: DebugElement[] = fixture.debugElement.queryAll(
      By.css(`.m-userAggregator__hoverCard`)
    );

    expect(hovercards.length).toBe(3);
  });
});
