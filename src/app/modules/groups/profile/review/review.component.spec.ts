import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { GroupsProfileReviewComponent } from './review.component';
import { GroupsService } from '../../groups.service';
import { BehaviorSubject } from 'rxjs';
import { groupMock } from '../../../../mocks/responses/group.mock';
import { MockService } from '../../../../utils/mock';
import { MindsGroup } from '../../v2/group.model';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { Client } from '../../../../services/api';
import { ChangeDetectorRef } from '@angular/core';
import { ToasterService } from '../../../../common/services/toaster.service';

describe('GroupsProfileReviewComponent', () => {
  let comp: GroupsProfileReviewComponent;
  let fixture: ComponentFixture<GroupsProfileReviewComponent>;
  let newReviewCountEmitterSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupsProfileReviewComponent],
      providers: [
        {
          provide: GroupsService,
          useValue: MockService(GroupsService, {
            has: ['$group'],
            props: {
              $group: { get: () => new BehaviorSubject<MindsGroup>(groupMock) },
            },
          }),
        },
        { provide: Session, useValue: MockService(Session) },
        { provide: Router, useValue: MockService(Router) },
        { provide: Client, useValue: MockService(Client) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        ChangeDetectorRef,
      ],
    });

    fixture = TestBed.createComponent(GroupsProfileReviewComponent);
    comp = fixture.componentInstance;

    comp.group = {
      guid: '1234567890123456',
      'adminqueue:count': 0,
    };

    newReviewCountEmitterSpy = spyOn(comp.newReviewCount, 'emit');
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('approve', () => {
    it('should approve a normal activity', fakeAsync(() => {
      const mockActivity = {
        guid: '2234567890123456',
        urn: 'urn:activity:2234567890123456',
        activity_type: null,
      };
      const mockGroup = {
        guid: '1234567890123456',
        'adminqueue:count': 1,
      };

      comp.group = mockGroup;
      comp.approve(mockActivity, 0);
      tick();

      expect((comp as any).client.put).toHaveBeenCalledOnceWith(
        `api/v1/groups/review/${mockGroup.guid}/${mockActivity.guid}`
      );
      expect(comp.group['adminqueue:count']).toBe(0);
      expect(newReviewCountEmitterSpy).toHaveBeenCalledOnceWith(0);
    }));

    it('should approve a remind activity', fakeAsync(() => {
      const remindGuid: string = '3234567890123456';
      const mockActivity = {
        guid: '2234567890123456',
        urn: `urn:activity:${remindGuid}`,
        activity_type: 'remind',
      };
      const mockGroup = {
        guid: '1234567890123456',
        'adminqueue:count': 1,
      };

      comp.group = mockGroup;
      comp.approve(mockActivity, 0);
      tick();

      expect((comp as any).client.put).toHaveBeenCalledOnceWith(
        `api/v1/groups/review/${mockGroup.guid}/${remindGuid}`
      );
      expect(comp.group['adminqueue:count']).toBe(0);
      expect(newReviewCountEmitterSpy).toHaveBeenCalledOnceWith(0);
    }));
  });

  describe('reject', () => {
    it('should reject a normal activity', fakeAsync(() => {
      const mockActivity = {
        guid: '2234567890123456',
        urn: 'urn:activity:2234567890123456',
        activity_type: null,
      };
      const mockGroup = {
        guid: '1234567890123456',
        'adminqueue:count': 1,
      };

      comp.group = mockGroup;
      comp.reject(mockActivity, 0);
      tick();

      expect((comp as any).client.delete).toHaveBeenCalledOnceWith(
        `api/v1/groups/review/${mockGroup.guid}/${mockActivity.guid}`
      );
      expect(comp.group['adminqueue:count']).toBe(0);
      expect(newReviewCountEmitterSpy).toHaveBeenCalledOnceWith(0);
    }));

    it('should reject a remind activity', fakeAsync(() => {
      const remindGuid: string = '3234567890123456';
      const mockActivity = {
        guid: '2234567890123456',
        urn: `urn:activity:${remindGuid}`,
        activity_type: 'remind',
      };
      const mockGroup = {
        guid: '1234567890123456',
        'adminqueue:count': 1,
      };

      comp.group = mockGroup;
      comp.reject(mockActivity, 0);
      tick();

      expect((comp as any).client.delete).toHaveBeenCalledOnceWith(
        `api/v1/groups/review/${mockGroup.guid}/${remindGuid}`
      );
      expect(comp.group['adminqueue:count']).toBe(0);
      expect(newReviewCountEmitterSpy).toHaveBeenCalledOnceWith(0);
    }));
  });
});
