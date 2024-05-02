import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupActionsComponent } from './actions.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { GroupService } from '../group.service';
import { Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MindsGroup } from '../group.model';
import { groupMock } from '../../../../mocks/responses/group.mock';

describe('GroupActionsComponent', () => {
  let comp: GroupActionsComponent;
  let fixture: ComponentFixture<GroupActionsComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        GroupActionsComponent,
        MockComponent({
          selector: 'm-group__settingsButton',
        }),
        MockComponent({
          selector: 'm-group__chatButton',
          inputs: ['groupGuid'],
        }),
        MockComponent({
          selector: 'm-group__editButton',
        }),
        MockComponent({
          selector: 'm-group__membershipButton',
          inputs: [
            'group',
            'customColor',
            'size',
            'overlay',
            'verbose',
            'labelType',
          ],
          outputs: ['onMembershipChange'],
        }),
      ],
      providers: [
        {
          provide: GroupService,
          useValue: MockService(GroupService, {
            has: ['group$', 'isOwner$', 'isMember$', 'isCoversationDisabled$'],
            props: {
              group$: {
                get: () => new BehaviorSubject<MindsGroup>(groupMock),
              },
              isOwner$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              isMember$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
              isCoversationDisabled$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        { provide: Injector, useValue: MockService(Injector) },
      ],
    });

    fixture = TestBed.createComponent(GroupActionsComponent);
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

  describe('shouldShowChatButton$', () => {
    it('should determine if chat button should be shown because user is a member and conversation is enabled', (done: DoneFn) => {
      (comp as any).service.isCoversationDisabled$.next(false);
      (comp as any).service.isMember$.next(true);
      (comp as any).service.isOwner$.next(false);

      (comp as any).shouldShowChatButton$.subscribe(
        (shouldShowChatButton: boolean): void => {
          expect(shouldShowChatButton).toBeTrue();
          done();
        }
      );
    });

    it('should determine if chat button should be shown because user is the group owner', (done: DoneFn) => {
      (comp as any).service.isCoversationDisabled$.next(true);
      (comp as any).service.isMember$.next(true);
      (comp as any).service.isOwner$.next(true);

      (comp as any).shouldShowChatButton$.subscribe(
        (shouldShowChatButton: boolean): void => {
          expect(shouldShowChatButton).toBeTrue();
          done();
        }
      );
    });

    it('should determine if chat button should NOT be shown', (done: DoneFn) => {
      (comp as any).service.isCoversationDisabled$.next(true);
      (comp as any).service.isMember$.next(true);
      (comp as any).service.isOwner$.next(false);

      (comp as any).shouldShowChatButton$.subscribe(
        (shouldShowChatButton: boolean): void => {
          expect(shouldShowChatButton).toBeFalse();
          done();
        }
      );
    });
  });
});
