import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../services/session';
import { MockComponent, MockService } from '../../../utils/mock';
import { DiscoveryTabsComponent } from './tabs.component';
import { ActivatedRoute } from '@angular/router';
import { DiscoveryService } from '../discovery.service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import userMock from '../../../mocks/responses/user.mock';

describe('DiscoveryTabsComponent', () => {
  let comp: DiscoveryTabsComponent;
  let fixture: ComponentFixture<DiscoveryTabsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockComponent({
            selector: 'm-discovery__settingsButton',
            inputs: ['modalType'],
          }),
          DiscoveryTabsComponent,
        ],
        imports: [RouterTestingModule],
        providers: [
          { provide: ActivatedRoute, useValue: MockService(ActivatedRoute) },
          {
            provide: DiscoveryService,
            useValue: MockService(DiscoveryService, {
              has: ['isPlusPage$'],
              props: {
                isPlusPage$: {
                  get: () => new BehaviorSubject<boolean>(false),
                },
              },
            }),
          },
          { provide: Session, useValue: MockService(Session) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoveryTabsComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should init', (): void => {
    expect(comp).not.toBeNull();
  });

  describe('isPlusPage$ is false', (): void => {
    beforeEach(() => {
      (comp as any).service.isPlusPage$.next(false);
      fixture.detectChanges();
    });

    it('should have a trending tab', (): void => {
      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-trending]')
      );
      expect(tab).toBeDefined();
      expect(tab.nativeElement.innerText).toBe('Trending');
      expect(tab.nativeElement.href.endsWith('/discovery/trending')).toBeTrue();
    });

    it('should have a trending tags tab', (): void => {
      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-trending-tags]')
      );
      expect(tab).toBeDefined();
      expect(tab.nativeElement.innerText).toBe('Trending tags');
      expect(
        tab.nativeElement.href.endsWith('/discovery/tags/trending')
      ).toBeTrue();
    });

    it('should have a channels tab', (): void => {
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      fixture.detectChanges();

      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-channels]')
      );
      expect(tab).toBeDefined();
      expect(tab.nativeElement.innerText).toBe('Channels');
      expect(
        tab.nativeElement.href.endsWith(
          '/discovery/suggestions/user?explore=true'
        )
      ).toBeTrue();
    });

    it('should have a groups tab', (): void => {
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      fixture.detectChanges();

      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-groups]')
      );
      expect(tab).toBeDefined();
      expect(tab.nativeElement.innerText).toBe('Groups');
      expect(
        tab.nativeElement.href.endsWith(
          '/discovery/suggestions/group?explore=true'
        )
      ).toBeTrue();
    });

    it('should NOT have a channels tab when not logged in', (): void => {
      (comp as any).session.getLoggedInUser.and.returnValue(null);
      fixture.detectChanges();

      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-channels]')
      );
      expect(tab).toBeNull();
    });

    it('should NOT have a groups tab when not logged in', (): void => {
      (comp as any).session.getLoggedInUser.and.returnValue(null);
      fixture.detectChanges();

      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-groups]')
      );
      expect(tab).toBeNull();
    });
  });

  describe('isPlusPage$ is true', (): void => {
    beforeEach(() => {
      (comp as any).service.isPlusPage$.next(true);
      fixture.detectChanges();
    });

    it('should have a Just for you tab', (): void => {
      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-plus-overview]')
      );
      expect(tab).toBeDefined();
      expect(tab.nativeElement.innerText).toBe('Just for you');
      expect(
        tab.nativeElement.href.endsWith('/discovery/plus/overview')
      ).toBeTrue();
    });

    it('should have a Your tags tab', (): void => {
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      fixture.detectChanges();

      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-tags]')
      );
      expect(tab).toBeDefined();
      expect(tab.nativeElement.innerText).toBe('Your tags');
      expect(
        tab.nativeElement.href.endsWith('/discovery/plus/tags/your')
      ).toBeTrue();
    });

    it('should have a Trending tab', (): void => {
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      fixture.detectChanges();

      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-trending]')
      );
      expect(tab).toBeDefined();
      expect(tab.nativeElement.innerText).toBe('Trending');
      expect(
        tab.nativeElement.href.endsWith('/discovery/plus/tags/trending')
      ).toBeTrue();
    });

    it('should have a Latest tab', (): void => {
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      fixture.detectChanges();

      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-plus-latest]')
      );
      expect(tab).toBeDefined();
      expect(tab.nativeElement.innerText).toBe('Latest');
      expect(
        tab.nativeElement.href.endsWith('/discovery/plus/latest/feed')
      ).toBeTrue();
    });

    it('should NOT have a Your tags when not logged in', (): void => {
      (comp as any).session.getLoggedInUser.and.returnValue(null);
      fixture.detectChanges();

      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-tags]')
      );
      expect(tab).toBeNull();
    });

    it('should NOT have a Trending tab when not logged in', (): void => {
      (comp as any).session.getLoggedInUser.and.returnValue(null);
      fixture.detectChanges();

      const tab: DebugElement = fixture.debugElement.query(
        By.css('[data-ref=discovery-tab-link-trending]')
      );
      expect(tab).toBeNull();
    });
  });

  it('should have a discovery settings button', () => {
    const settingsButton: DebugElement = fixture.debugElement.query(
      By.css('m-discovery__settingsButton')
    );
    expect(settingsButton).toBeDefined();
  });
});
