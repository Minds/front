import {
  createNgModule,
  Inject,
  Injectable,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import {
  ModalRef,
  ModalService,
} from '../../../../../../../../services/ux/modal.service';
import { UserRoleEdge } from '../../../../../../../../../graphql/generated.engine';
import { AssignRolesModalComponent } from './assign-roles-modal.component';
import { AssignRolesModalLazyModule } from './assign-roles-modal-lazy.module';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for loading the modal for adding featured entities lazily.
 */
@Injectable({ providedIn: 'root' })
export class AssignRolesModalLazyService {
  /**
   * Emits when a user's roles have been changed
   */
  public readonly updatedUserWithRoles$: BehaviorSubject<
    UserRoleEdge
  > = new BehaviorSubject<UserRoleEdge>(null);

  constructor(
    private modalService: ModalService,
    private injector: Injector,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * Lazy load module and open modal.
   * @param { UserRoleEdge } userWithRoles - the target user and their current roles
   * @returns { Promise<ModalRef<AssignRolesModalComponent>> } - modal reference.
   */
  public async open(
    userWithRoles: UserRoleEdge
  ): Promise<ModalRef<AssignRolesModalComponent>> {
    const componentRef: typeof AssignRolesModalComponent = await this.getComponentRef();
    const modal = this.modalService.present(componentRef, {
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

  /**
   * Gets reference to component to load.
   * @returns { Promise<typeof AssignRolesModalComponent> } modal component.
   */
  private async getComponentRef(): Promise<typeof AssignRolesModalComponent> {
    return createNgModule<AssignRolesModalLazyModule>(
      (await import('./assign-roles-modal-lazy.module'))
        .AssignRolesModalLazyModule,
      this.injector
    ).instance.resolveComponent();
  }
}
