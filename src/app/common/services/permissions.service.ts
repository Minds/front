export type Permissions = {
  name: string;
  permissions: string[];
};

export class PermissionsService {
  canInteract(entity: any, permission: string) {
    let permissions: Permissions = entity.permissions;

    return (
      permissions &&
      permissions.permissions.findIndex(item => item === permission) !== -1
    );
  }
}
