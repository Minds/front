import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { By } from '@angular/platform-browser';

import { ButtonComponent } from '../../components/button/button.component';
import { GroupMembershipButtonComponent } from './group-membership-button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../services/session';
import { MockService } from '../../../utils/mock';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { GroupMembershipService } from '../../services/group-membership.service';
import { LoginReferrerService } from '../../../services/login-referrer.service';
import { loginReferrerServiceMock } from '../../../mocks/services/login-referrer-service-mock.spec';
import { ModernGroupsExperimentService } from '../../../modules/experiments/sub-services/modern-groups-experiment.service';
import { BehaviorSubject } from 'rxjs';
import { ClientMetaService } from '../../services/client-meta.service';
import { groupMock } from '../../../mocks/responses/group.mock';
import { ClientMetaDirective } from '../../directives/client-meta.directive';

describe('GroupMembershipButtonComponent', () => {
  let fixture: ComponentFixture<GroupMembershipButtonComponent>;
  let comp: GroupMembershipButtonComponent;

  /** Helpers */

  function setGroup(props: any) {
    comp.group = Object.assign(
      {
        guid: 1000,
        'is:banned': false,
        'is:awaiting': false,
        'is:invited': false,
        'is:member': false,
        membership: 2,
      },
      props
    );
  }

  function getJoinButton(): DebugElement {
    return fixture.debugElement.query(
      By.css(`[data-ref=group-membership-button-join]`)
    );
  }

  function getLeaveButton(): DebugElement {
    return fixture.debugElement.query(
      By.css(`[data-ref=group-membership-button-leave]`)
    );
  }

  function getAcceptAndDeclineInvitationButtons(): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.css(`[data-ref=group-membership-button-invited]`)
    );
  }

  function getCancelRequestButton(): DebugElement {
    return fixture.debugElement.query(
      By.css(`[data-ref=group-membership-button-awaiting]`)
    );
  }

  /** /Helpers */

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GroupMembershipButtonComponent, ButtonComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: Session, useValue: sessionMock },
          { provide: LoginReferrerService, useValue: loginReferrerServiceMock },
          {
            provide: ModernGroupsExperimentService,
            useValue: MockService(ModernGroupsExperimentService),
          },
          {
            provide: ClientMetaService,
            useValue: MockService(ClientMetaService),
          },
          {
            provide: ClientMetaDirective,
            useValue: MockService(ClientMetaDirective),
          },
        ],
      })
        .overrideProvider(GroupMembershipService, {
          useValue: MockService(GroupMembershipService, {
            has: ['isMember$', 'isAwaiting$', 'isInvited$', 'isBanned$'],
            props: {
              isMember$: { get: () => new BehaviorSubject<boolean>(false) },
              isAwaiting$: { get: () => new BehaviorSubject<boolean>(false) },
              isInvited$: { get: () => new BehaviorSubject<boolean>(false) },
              isBanned$: { get: () => new BehaviorSubject<boolean>(false) },
            },
          }),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(GroupMembershipButtonComponent);
    comp = fixture.componentInstance;

    setGroup({});
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

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  describe('recordClick', () => {
    it('should record a click on a non-boosted group', () => {
      comp.group = groupMock;
      (comp as any).joinClickRecorded = false;
      comp.recordClick();

      expect((comp as any).clientMetaService.recordClick).toHaveBeenCalledWith(
        groupMock.guid,
        (comp as any).parentClientMeta,
        {}
      );
      expect((comp as any).joinClickRecorded).toBe(true);
    });

    it('should record a click on a boosted group', () => {
      comp.group = {
        ...groupMock,
        boosted_guid: '1234567890123456',
        urn: 'urn:boost:1234567890123456',
      } as any;

      (comp as any).joinClickRecorded = false;
      comp.recordClick();

      expect((comp as any).clientMetaService.recordClick).toHaveBeenCalledWith(
        groupMock.guid,
        (comp as any).parentClientMeta,
        {
          campaign: comp.group.urn,
        }
      );
      expect((comp as any).joinClickRecorded).toBe(true);
    });

    it('should NOT record a click if one has already been recorded', () => {
      (comp as any).joinClickRecorded = true;
      comp.recordClick();

      expect(
        (comp as any).clientMetaService.recordClick
      ).not.toHaveBeenCalled();
      expect((comp as any).joinClickRecorded).toBe(true);
    });
  });
});
