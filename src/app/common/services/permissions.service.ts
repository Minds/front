import { Injectable } from '@angular/core';
import { Client } from '../../services/api';
import { Subscription } from 'rxjs';

type EntitiesPermissions = {
  channels: { number: Permissions };
  entities: { number: Permissions };
  groups: { number: Permissions };
};

type Permissions = {
  name: string;
  permissions: string[];
};

@Injectable()
export class PermissionsService {
  static readonly MAX_ENTITIES = 500;

  entities: any = {};

  private permissions$: Subscription;

  static _(client: Client) {
    return new PermissionsService(client);
  }

  constructor(private client: Client) {
    this.permissions$ = this.client.permissionsSubject.subscribe(
      (permissions: EntitiesPermissions) => {
        this.updatePermissions(permissions);
      }
    );
  }

  /**
   * should be called when loading endpoints, maybe as a Client hook
   * @param entities
   */
  updatePermissions(entities: EntitiesPermissions) {
    for (let guid in entities.channels) {
      this.entities[guid] = entities.channels[guid];
    }

    for (let guid in entities.entities) {
      this.entities[guid] = entities.entities[guid];
    }

    for (let guid in entities.groups) {
      this.entities[guid] = entities.groups[guid];
    }

    const length = this.entities.length;

    if (length > PermissionsService.MAX_ENTITIES) {
      let i = 0;
      const amountToDelete = PermissionsService.MAX_ENTITIES - length;
      for (let key in this.entities) {
        if (i > amountToDelete) {
          break;
        }
        delete this.entities[key];
        i++;
      }
    }
  }

  async canInteract(entity: any, permission: string) {
    let permissions: Permissions = await this.getPermissions(entity.guid);

    return (
      permissions &&
      permissions.permissions.findIndex(item => item === permission) !== -1
    );
  }

  private async getPermissions(guid: string) {
    if (!this.entities[guid]) {
      try {
        const response: any = await this.client.get(
          `api/v2/permissions/${guid}`
        );

        if (response.permissions) {
          this.updatePermissions(response.permissions);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return this.entities[guid] || null;
  }
}
