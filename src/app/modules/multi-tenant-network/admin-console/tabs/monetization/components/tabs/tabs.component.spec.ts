import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminMonetizationTabsComponent } from './tabs.component';

describe('NetworkAdminMonetizationTabsComponent', () => {
  let comp: NetworkAdminMonetizationTabsComponent;
  let fixture: ComponentFixture<NetworkAdminMonetizationTabsComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [NetworkAdminMonetizationTabsComponent],
    });

    fixture = TestBed.createComponent(NetworkAdminMonetizationTabsComponent);
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

  it('should have a tab for memberships', () => {
    expect(
      fixture.nativeElement.querySelector(
        'a[data-ref=tenant-admin-monetization-tab-memberships]'
      )
    ).toBeTruthy();
  });
});
