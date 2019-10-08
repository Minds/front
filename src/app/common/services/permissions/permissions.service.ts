import { Flags } from './flags';

export type Permissions = {
  name: string;
  permissions: string[];
};

export class PermissionsService {
  canInteract(entity: any, permission: Flags): boolean {
    const permissions: Permissions = entity.permissions;

    if (!permissions) {
      return false;
    }

    return (
      permissions.permissions.findIndex(item => item === permission) !== -1
    );
  }
}
