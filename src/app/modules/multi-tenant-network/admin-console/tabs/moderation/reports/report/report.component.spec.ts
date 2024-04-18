import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { NetworkAdminConsoleReportComponent } from './report.component';
import { ReportUtilitiesService } from '../services/report-utilities.service';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import {
  ProvideVerdictGQL,
  ReportActionEnum,
  ReportEdge,
  ReportStatusEnum,
  UserEdge,
} from '../../../../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { Router } from '@angular/router';
import userMock from '../../../../../../../mocks/responses/user.mock';

describe('NetworkAdminConsoleReportComponent', () => {
  let comp: NetworkAdminConsoleReportComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleReportComponent>;
  let verdictProvidedEmitter;

  const mockReportEdge: ReportEdge = {
    cursor: '1',
    node: {
      __typename: 'Report',
      action: ReportActionEnum.Delete,
      createdTimestamp: Date.now(),
      cursor: '1',
      entityEdge: {
        __typename: 'UserEdge',
        cursor: '1',
        node: userMock,
      } as UserEdge,
      entityGuid: '1234567890123456',
      entityUrn: 'urn:user:1234567890123456',
      id: '2',
      illegalSubReason: null,
      moderatedByGuid: '2234567890123456',
      nsfwSubReason: null,
      reason: null,
      reportGuid: '3234567890123456',
      reportedByGuid: '4234567890123456',
      reportedByUserEdge: {
        __typename: 'UserEdge',
        cursor: '1',
        id: '223',
        type: 'UserEdge',
        node: userMock as any,
      },
      securitySubReason: null,
      status: ReportStatusEnum.Pending,
      tenantId: '123',
      updatedTimestamp: Date.now(),
    },
    type: 'mockType',
    __typename: 'ReportEdge',
  } as ReportEdge;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleReportComponent,
        MockComponent({
          selector: 'minds-avatar',
          inputs: ['object'],
        }),
        MockComponent({
          selector: 'm-activity',
          inputs: [
            'entity',
            'canDelete',
            'displayOptions',
            'autoplayVideo',
            'canRecordAnalytics',
          ],
        }),
        MockComponent({
          selector: 'm-publisherCard',
          inputs: ['publisher'],
        }),
        MockComponent({
          selector: 'm-comment',
          inputs: ['comment', 'hideMenuButton', 'hideToolbar'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'saving', 'disabled'],
          outputs: ['click'],
        }),
      ],
      providers: [
        {
          provide: ReportUtilitiesService,
          useValue: MockService(ReportUtilitiesService),
        },
        {
          provide: ProvideVerdictGQL,
          useValue: jasmine.createSpyObj<ProvideVerdictGQL>(['mutate']),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleReportComponent);
    comp = fixture.componentInstance;
    comp.reportEdge = mockReportEdge;
    verdictProvidedEmitter = spyOn(comp.verdictProvided, 'emit');
  });

  afterEach(() => {
    (comp as any).provideVerdictGql.mutate.calls.reset();
    verdictProvidedEmitter.calls.reset();
  });

  it('should init', fakeAsync(() => {
    expect(comp).toBeTruthy();
  }));

  describe('parseLegacyEntityJson', () => {
    it('should parse legacy entity json', () => {
      const entityJson = '{"guid": "1", "type": "activity"}';
      expect(comp.parseLegacyEntityJson(entityJson)).toEqual({
        guid: '1',
        type: 'activity',
      });
    });

    it('should NOT parse legacy entity json with error', () => {
      const entityJson = '{invalid"guid": "1", "type": "activity"}';
      expect(comp.parseLegacyEntityJson(entityJson)).toBeNull();
    });
  });

  describe('navigateToChannel', () => {
    it('should navigate to channel', () => {
      comp.navigateToChannel({ button: 0 } as any, 'test');
      expect((comp as any).router.navigate).toHaveBeenCalledWith(['/test']);
    });

    it('should open channel in new tab', () => {
      const windowOpenSpy = spyOn(window, 'open');
      comp.navigateToChannel({ button: 1 } as any, 'test');
      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect(windowOpenSpy).toHaveBeenCalledWith('/test', '_blank');
    });
  });

  describe('deleteButtonClick', () => {
    // success states

    it('should delete report for an activity', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Post deleted'
      );
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    it('should delete report for a comment', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Comment deleted'
      );
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    it('should delete report for a group', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Group deleted'
      );
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    it('should delete report for another node type', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Entity deleted'
      );
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    // error states - server returned false.

    it('should handle error when server could not delete activity report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when deleting this post'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not delete comment report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when deleting this comment'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not delete group report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when deleting this group'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not delete report for another entity type', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when deleting this entity'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    // error states - error returned from server.

    it('should handle error when server returned error upon deleting activity report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when deleting this post'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server returned error upon deleting comment report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when deleting this comment'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server returned error upon deleting group report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when deleting this group'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server returned error upon deleting report for another entity type', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.deleteButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Delete,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when deleting this entity'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));
  });

  describe('banButtonClick', () => {
    // success states

    it('should ban user for an activity report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.success).toHaveBeenCalledWith('User banned');
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    it('should ban user for a comment report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.success).toHaveBeenCalledWith('User banned');
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    it('should ban a user for a report on the user object', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.success).toHaveBeenCalledWith('User banned');
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    it('should ban a user for a report on another entity', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.success).toHaveBeenCalledWith('User banned');
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    // error states - server returned false.

    it('should handle error when server could not ban a user for activity report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when banning this user'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not  ban a user for comment report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when banning this user'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not ban a user for user report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when banning this user'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not ban a user for report for another entity type', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when banning this user'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    // error states - error returned from server.

    it('should handle error when server could not ban a user for activity report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when banning this user'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not  ban a user for comment report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when banning this user'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not ban a user for user report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when banning this user'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not ban a user for report for another entity type', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.banButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ban,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when banning this user'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));
  });

  describe('ignoreButtonClick', () => {
    // success states

    it('should ignore an activity report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.inform).toHaveBeenCalledWith(
        'Report ignored'
      );
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    it('should ignore a comment report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.inform).toHaveBeenCalledWith(
        'Report ignored'
      );
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    it('should ignore a group report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.inform).toHaveBeenCalledWith(
        'Report ignored'
      );
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    it('should ignore a user report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: true,
          },
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.inform).toHaveBeenCalledWith(
        'Report ignored'
      );
      expect((comp as any).verdictProvided.emit).toHaveBeenCalled();
    }));

    // error states - server returned false.

    it('should handle error when server could not ignore activity report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error ignoring this report'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not ignore comment report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error ignoring this report'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not ignore user report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error ignoring this report'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server could not ignore a group report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          data: {
            provideVerdict: false,
          },
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error ignoring this report'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    // error states - error returned from server.

    it('should handle error when server throws error while ignoring activity report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error ignoring this report'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server throws error while ignoring comment report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error ignoring this report'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server throws error while ignoring user report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error ignoring this report'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));

    it('should handle error when server throws error while ignoring group report', fakeAsync(() => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';

      (comp as any).provideVerdictGql.mutate.and.returnValue(
        of({
          errors: ['expectedError'],
        })
      );

      comp.ignoreButtonClick();
      tick();

      expect((comp as any).provideVerdictGql.mutate).toHaveBeenCalledWith({
        reportGuid: comp.reportEdge.node.reportGuid,
        action: ReportActionEnum.Ignore,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'There was an error ignoring this report'
      );
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
      expect((comp as any).verdictProvided.emit).not.toHaveBeenCalled();
    }));
  });

  describe('reasonLabel', () => {
    it('should get reason label', () => {
      const reasonLabel: string = 'reasonLabel';
      (
        comp as any
      ).reportUtilitiesService.getReasonLabelFromReport.and.returnValue(
        reasonLabel
      );

      expect(comp.reasonLabel).toBe(reasonLabel);
      expect(
        (comp as any).reportUtilitiesService.getReasonLabelFromReport
      ).toHaveBeenCalledWith(comp.reportEdge.node);
    });
  });

  describe('shouldShowDeleteButton', () => {
    it('should show delete button for activities', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';
      expect(comp.shouldShowDeleteButton).toBeTrue();
    });

    it('should show delete button for comments', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';
      expect(comp.shouldShowDeleteButton).toBeTrue();
    });

    it('should show delete button for groups', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';
      expect(comp.shouldShowDeleteButton).toBeTrue();
    });

    it('should NOT show delete button for users', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';
      expect(comp.shouldShowDeleteButton).toBeFalse();
    });
  });

  describe('shouldShowBanButton', () => {
    it('should show delete button for activities', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';
      expect(comp.shouldShowBanButton).toBeTrue();
    });

    it('should show delete button for comments', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';
      expect(comp.shouldShowBanButton).toBeTrue();
    });

    it('should show delete button for users', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';
      expect(comp.shouldShowBanButton).toBeTrue();
    });

    it('should NOT show delete button for groups', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';
      expect(comp.shouldShowBanButton).toBeFalse();
    });
  });

  describe('entity', () => {
    it('should get entity', () => {
      const entityJson: string = JSON.stringify({
        guid: '1',
        type: 'activity',
      });
      comp.reportEdge.node.entityEdge.node.legacy = entityJson;
      expect(comp.entity).toEqual(JSON.parse(entityJson));
    });

    it('should NOT get unparseable entity', () => {
      const entityJson: string = "{invalid guid: '1', type: 'activity' }";
      comp.reportEdge.node.entityEdge.node.legacy = entityJson;
      expect(comp.entity).toBe(null);
    });
  });

  describe('reportedByUser', () => {
    it('should get reported by user', () => {
      comp.reportEdge.node.reportedByUserEdge.node = userMock;
      expect(comp.reportedByUser).toBe(userMock);
    });
  });

  describe('deletePostButtonText', () => {
    it('should get delete button text for activities', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';
      expect(comp.deletePostButtonText).toBe('Delete activity post');
    });

    it('should get delete button text for comments', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';
      expect(comp.deletePostButtonText).toBe('Delete comment');
    });

    it('should get delete button text for groups', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';
      expect(comp.deletePostButtonText).toBe('Delete group');
    });

    it('should get delete button text for other entities', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';
      expect(comp.deletePostButtonText).toBe('Delete');
    });
  });

  describe('banButtonText', () => {
    it('should get ban button text for activities', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'ActivityNode';
      expect(comp.banButtonText).toBe('Ban user');
    });

    it('should get ban button text for comments', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'CommentNode';
      expect(comp.banButtonText).toBe('Ban user');
    });

    it('should get ban button text for users', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'UserNode';
      expect(comp.banButtonText).toBe('Ban user');
    });

    it('should get delete button text for other entities', () => {
      comp.reportEdge.node.entityEdge.node.__typename = 'GroupNode';
      expect(comp.banButtonText).toBe('Ban');
    });
  });
});
