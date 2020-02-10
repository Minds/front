import { Injectable } from '@angular/core';
import { MindsUser } from '../../interfaces/entities';
import { EntitiesService } from '../../common/services/entities.service';
import { ConfigsService } from '../../common/services/configs.service';

export type WirePaymentHandler = 'plus' | 'pro';

@Injectable()
export class WirePaymentHandlersService {
  readonly handlers; // TODO: add types
  constructor(protected entities: EntitiesService, configs: ConfigsService) {
    this.handlers = configs.get('handlers');
  }

  async get(service: WirePaymentHandler): Promise<MindsUser> {
    if (!this.handlers || !this.handlers[service]) {
      throw new Error('Invalid handler definitions');
    }

    const response: any = await this.entities
      .setCastToActivities(false)
      .fetch([`urn:user:${this.handlers[service]}`]);

    if (!response || !response.entities || !response.entities[0]) {
      throw new Error('Missing payment handler');
    }

    const handler = response.entities[0] as MindsUser;

    if (!handler.guid || !handler.is_admin) {
      throw new Error('Invalid payment target');
    }

    return handler;
  }
}
