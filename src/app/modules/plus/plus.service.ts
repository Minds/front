import { Injectable } from '@angular/core';
import { Client } from '../../services/api/client';

@Injectable()
export class PlusService {
  constructor(protected client: Client) {}

  async isActive(): Promise<boolean> {
    const result: any = await this.client.get('api/v1/plus');

    if (!result || typeof result.active === 'undefined') {
      throw new Error('Unable to check your Plus status');
    }

    return Boolean(result.active);
  }

  async disable(): Promise<boolean> {
    await this.client.delete('api/v1/plus/subscription');
    return true;
  }
}
