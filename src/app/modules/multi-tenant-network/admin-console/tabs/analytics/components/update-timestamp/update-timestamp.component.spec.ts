import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminAnalyticsUpdateTimestampComponent } from './update-timestamp.component';
import { By } from '@angular/platform-browser';

describe('NetworkAdminAnalyticsUpdateTimestampComponent', () => {
  let comp: NetworkAdminAnalyticsUpdateTimestampComponent;
  let fixture: ComponentFixture<NetworkAdminAnalyticsUpdateTimestampComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [NetworkAdminAnalyticsUpdateTimestampComponent],
    });

    fixture = TestBed.createComponent(
      NetworkAdminAnalyticsUpdateTimestampComponent
    );
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

  it('should have marker', () => {
    expect(
      fixture.debugElement.query(
        By.css('.m-networkAdminAnalytics__updateTimestampMarker')
      )
    ).toBeTruthy();
  });

  it('should update timespan text', () => {
    expect(
      fixture.debugElement.query(
        By.css('.m-networkAdminAnalytics__updateTimestampSpan')
      ).nativeElement.textContent
    ).toBe('Analytics are up to date as of 8:00 AM (UTC)');
  });
});
