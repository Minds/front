import { Injectable } from '@angular/core';
import { Client } from '../../services/api/client';

@Injectable({ providedIn: 'root' })
export class PlusService {
  protected cachedResponse: any;

  constructor(protected client: Client) {}

  async isActive(): Promise<boolean> {
    const result: any = await this.client.get('api/v1/plus');
    if (!result || typeof result.active === 'undefined') {
      throw new Error('Unable to check your Plus status');
    }

    this.cachedResponse = result;

    return Boolean(result.active);
  }

  async canBeCancelled(): Promise<boolean> {
    if (!this.cachedResponse) {
      await this.isActive();
    }

    return Boolean(this.cachedResponse.can_be_cancelled);
  }

  async hasSubscription(): Promise<boolean> {
    if (!this.cachedResponse) {
      await this.isActive();
    }
    return Boolean(this.cachedResponse.has_subscription);
  }

  async expires(): Promise<number> {
    if (!this.cachedResponse) {
      await this.isActive();
    }
    return Number(this.cachedResponse.expires) || 0;
  }

  async disable(): Promise<boolean> {
    await this.client.delete('api/v1/plus/subscription');
    return true;
  }
}
