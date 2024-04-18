import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import {
  ModalRef,
  ModalService,
} from '../../../../../../../../services/ux/modal.service';
import { UserRoleEdge } from '../../../../../../../../../graphql/generated.engine';
import { AssignRolesModalComponent } from './assign-roles-modal.component';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for loading the modal for adding featured entities.
 */
@Injectable({ providedIn: 'root' })
export class AssignRolesModalService {
  /**
   * Emits when a user's roles have been changed
   */
  public readonly updatedUserWithRoles$: BehaviorSubject<UserRoleEdge> =
    new BehaviorSubject<UserRoleEdge>(null);

  constructor(
    private modalService: ModalService,
    private injector: Injector,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * Open modal.
   * @param { UserRoleEdge } userWithRoles - the target user and their current roles
   * @returns { Promise<ModalRef<AssignRolesModalComponent>> } - modal reference.
   */
  public async open(
    userWithRoles: UserRoleEdge
  ): Promise<ModalRef<AssignRolesModalComponent>> {
    const modal = this.modalService.present(AssignRolesModalComponent, {
      size: 'md',
      data: {
        userWithRoles: userWithRoles,
        onRoleChange: (updatedUserWithRoles: UserRoleEdge) => {
          if (updatedUserWithRoles) {
            this.updatedUserWithRoles$.next(updatedUserWithRoles);
          }
        },
      },
    });
    return modal;
  }
}
