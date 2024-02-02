import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleTabsComponent } from './tabs.component';
import { By } from '@angular/platform-browser';

describe('NetworkAdminConsoleTabsComponent', () => {
  let comp: NetworkAdminConsoleTabsComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleTabsComponent],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleTabsComponent);
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should have a general tab', () => {
    expect(
      fixture.debugElement.query(
        By.css('[data-ref=network-admin-console-tab-general]')
      )
    ).toBeTruthy();
  });

  it('should have an appearance tab', () => {
    expect(
      fixture.debugElement.query(
        By.css('[data-ref=network-admin-console-tab-appearance]')
      )
    ).toBeTruthy();
  });

  it('should have a moderation tab', () => {
    expect(
      fixture.debugElement.query(
        By.css('[data-ref=network-admin-console-tab-moderation]')
      )
    ).toBeTruthy();
  });

  it('should have a monetization tab', () => {
    expect(
      fixture.debugElement.query(
        By.css('[data-ref=network-admin-console-tab-monetization]')
      )
    );
  });

  it('should have a mobile tab', () => {
    expect(
      fixture.debugElement.query(
        By.css('[data-ref=network-admin-console-tab-mobile]')
      )
    ).toBeTruthy();
  });
});
