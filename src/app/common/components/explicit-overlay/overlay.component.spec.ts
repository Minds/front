import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ExplicitOverlayComponent } from './overlay.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import { TopbarAlertService } from '../topbar-alert/topbar-alert.service';
import { BehaviorSubject } from 'rxjs';
import userMock from '../../../mocks/responses/user.mock';
import { groupMock } from '../../../mocks/responses/group.mock';

describe('ExplicitOverlayComponent', () => {
  let comp: ExplicitOverlayComponent;
  let fixture: ComponentFixture<ExplicitOverlayComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ExplicitOverlayComponent,
          MockComponent({
            selector: 'm-button',
            outputs: ['onAction'],
          }),
        ],
        providers: [
          {
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: TopbarAlertService,
            useValue: MockService(TopbarAlertService, {
              has: ['shouldShow$'],
              props: {
                shouldShow$: {
                  get: () => new BehaviorSubject<boolean>(false),
                },
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(ExplicitOverlayComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.hidden = false;
    comp.entity = groupMock;

    (comp as any).topbarAlertService.shouldShow$.next(false);
    (comp as any).session.getLoggedInUser.and.returnValue(userMock);

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set topbarAlertShown to true if topbar alert is shown', fakeAsync(() => {
      (comp as any).topbarAlertService.shouldShow$.next(true);

      comp.ngOnInit();
      tick();

      expect((comp as any).topbarAlertShown).toBeTrue();
    }));

    it('should set topbarAlertShown to false if topbar alert is NOT shown', fakeAsync(() => {
      (comp as any).topbarAlertService.shouldShow$.next(false);

      comp.ngOnInit();
      tick();

      expect((comp as any).topbarAlertShown).toBeFalse();
    }));
  });

  describe('set entity', () => {
    it('should set a group as the entity', () => {
      comp.entity = groupMock;
      expect(comp.type).toBe('group');
      expect((comp as any)._entity).toEqual(groupMock);
    });

    it('should set a user as the entity', () => {
      comp.entity = userMock;
      expect(comp.type).toBe('channel');
      expect((comp as any)._entity).toEqual(userMock);
    });

    it('should set to hidden because logged in user is mature', () => {
      let user = userMock;
      user.mature = true;
      (comp as any).session.getLoggedInUser.and.returnValue(user);

      comp.entity = groupMock;
      expect(comp.hidden).toBeTrue();
    });

    it('should set to not hidden because entity is mature', () => {
      let user = userMock;
      user.mature = false;
      (comp as any).session.getLoggedInUser.and.returnValue(user);

      let group = groupMock;
      (group as any).is_mature = true;

      comp.entity = group;
      expect(comp.hidden).toBeFalse();
    });

    it('should set to not hidden because entity is nsfw', () => {
      let user = userMock;
      user.mature = false;
      (comp as any).session.getLoggedInUser.and.returnValue(user);

      let group = groupMock;
      (group as any).nsfw = [1];

      comp.entity = group;
      expect(comp.hidden).toBeFalse();
    });

    it('should set to not hidden because entity has nsfw lock', () => {
      let user = userMock;
      user.mature = false;
      (comp as any).session.getLoggedInUser.and.returnValue(user);

      let group = groupMock;
      (group as any).nsfw_lock = [1];

      comp.entity = group;
      expect(comp.hidden).toBeFalse();
    });

    it('should set to not hidden because entity is not nsfw', () => {
      let user = userMock;
      user.mature = false;
      (comp as any).session.getLoggedInUser.and.returnValue(user);

      let group = groupMock;
      (group as any).nsfw = [];
      (group as any).nsfw_lock = [];
      (group as any).is_mature = false;

      comp.entity = group;
      expect(comp.hidden).toBeTrue();
    });
  });

  describe('close', () => {
    it('should_close', () => {
      comp.hidden = false;
      comp.close();
      expect(comp.hidden).toBeTrue();
    });
  });
});
