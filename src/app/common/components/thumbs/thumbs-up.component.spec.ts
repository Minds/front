import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToasterService } from '../../services/toaster.service';
import { ThumbsUpButton } from './thumbs-up.component';
import { MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import { Client } from '../../api/client.service';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { ChangeDetectorRef } from '@angular/core';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { ExplicitVotesExperimentService } from '../../../modules/experiments/sub-services/explicit-votes-experiment.service';
import { IsTenantService } from '../../services/is-tenant.service';
import { PermissionsService } from '../../services/permissions.service';

describe('ThumbsUpButton', () => {
  let comp: ThumbsUpButton;
  let fixture: ComponentFixture<ThumbsUpButton>;
  let mockLocalStorage = {};

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ThumbsUpButton],
        providers: [
          { provide: Session, useValue: MockService(Session) },
          { provide: Client, useValue: MockService(Client) },
          {
            provide: AuthModalService,
            useValue: MockService(AuthModalService),
          },
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: ExperimentsService,
            useValue: MockService(ExperimentsService),
          },
          { provide: ToasterService, useValue: MockService(ToasterService) },
          {
            provide: ExplicitVotesExperimentService,
            useValue: MockService(ExplicitVotesExperimentService),
          },
          {
            provide: IsTenantService,
            useValue: MockService(IsTenantService),
          },
          {
            provide: PermissionsService,
            useValue: MockService(PermissionsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbsUpButton);
    comp = fixture.componentInstance;

    (comp.object as any) = {
      guid: '123',
      type: 'activity',
      'thumbs:up:user_guids': [],
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return mockLocalStorage[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        mockLocalStorage[key] = value;
      }
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('showImproveRecsToast', () => {
    it('should show improve recs toast', () => {
      (comp.object as any) = {
        type: 'activity',
      };
      (comp as any).explicitVotesExperiment.isActive.and.returnValue(true);
      mockLocalStorage['improve_recs_toast_shown'] = null;

      (comp as any).showImproveRecsToast();

      expect((comp as any).toast.success).toHaveBeenCalledWith(
        'Thank you! We use this to improve your recommendations.'
      );
      expect(localStorage.getItem).toHaveBeenCalledWith(
        'improve_recs_toast_shown'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'improve_recs_toast_shown',
        '1'
      );
    });

    it('should NOT show improve recs toast because object is a comment', () => {
      (comp.object as any) = {
        type: 'comment',
      };
      (comp as any).explicitVotesExperiment.isActive.and.returnValue(true);
      mockLocalStorage['improve_recs_toast_shown'] = null;

      (comp as any).showImproveRecsToast();

      expect((comp as any).toast.success).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should NOT show improve recs toast because experiment is off', () => {
      (comp.object as any) = {
        type: 'activity',
      };
      (comp as any).explicitVotesExperiment.isActive.and.returnValue(false);
      mockLocalStorage['improve_recs_toast_shown'] = null;

      (comp as any).showImproveRecsToast();

      expect((comp as any).toast.success).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should NOT show improve recs toast because local storage item is set', () => {
      (comp.object as any) = {
        type: 'activity',
      };
      (comp as any).explicitVotesExperiment.isActive.and.returnValue(true);
      mockLocalStorage['improve_recs_toast_shown'] = '1';

      (comp as any).showImproveRecsToast();

      expect((comp as any).toast.success).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
