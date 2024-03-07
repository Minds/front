import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminAnalyticsTabsComponent } from './tabs.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('NetworkAdminAnalyticsTabsComponent', () => {
  let comp: NetworkAdminAnalyticsTabsComponent;
  let fixture: ComponentFixture<NetworkAdminAnalyticsTabsComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NetworkAdminAnalyticsTabsComponent],
    });

    fixture = TestBed.createComponent(NetworkAdminAnalyticsTabsComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should have all tabs', () => {
    expect(
      fixture.debugElement.query(
        By.css('[data-ref=network-admin-console-analytics-tab-posts]')
      )
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(
        By.css('[data-ref=network-admin-console-analytics-tab-groups]')
      )
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(
        By.css('[data-ref=network-admin-console-analytics-tab-channels]')
      )
    ).toBeTruthy();
  });
});
