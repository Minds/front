import { TestBed } from '@angular/core/testing';
import { ComposerModalService } from './modal.service';
import { ModalService } from '../../../../services/ux/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailConfirmationService } from '../../../../common/components/email-confirmation/email-confirmation.service';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';
import { MockService } from '../../../../utils/mock';
import { PermissionsEnum } from '../../../../../graphql/generated.engine';

describe('ComposerModalService', () => {
  let service: ComposerModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComposerModalService,
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: Router, useValue: MockService(Router) },
        { provide: ActivatedRoute, useValue: MockService(ActivatedRoute) },
        {
          provide: EmailConfirmationService,
          useValue: MockService(EmailConfirmationService),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
      ],
    });

    service = TestBed.inject(ComposerModalService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should present', () => {
    (service as any).emailConfirmation.ensureEmailConfirmed.and.returnValue(
      true
    );
    (service as any).permissionIntentsService.checkAndHandleAction
      .withArgs(PermissionsEnum.CanCreatePost)
      .and.returnValue(true);
    (service as any).modalService.present.and.returnValue({
      result: Promise.resolve(true),
    });

    service.present(null);

    expect((service as any).modalService.present).toHaveBeenCalledWith(
      jasmine.anything(),
      {
        data: {
          onPost: jasmine.any(Function),
        },
        modalDialogClass: 'modal-content--without-padding',
        injector: (service as any).injector,
      }
    );
  });

  it('should not present if a user does not have permission', () => {
    (service as any).emailConfirmation.ensureEmailConfirmed.and.returnValue(
      true
    );
    (service as any).permissionIntentsService.checkAndHandleAction
      .withArgs(PermissionsEnum.CanCreatePost)
      .and.returnValue(false);

    service.present(null);

    expect((service as any).modalService.present).not.toHaveBeenCalled();
  });
});
