import { Injectable } from '@angular/core';
import { ConfigsService } from './configs.service';

/**
 * Service for checking whether a urn is the plus tier urn.
 */
@Injectable({ providedIn: 'root' })
export class PlusTierUrnService {
  // plus tier urn.
  private readonly plusTierUrn: string;

  constructor(config: ConfigsService) {
    this.plusTierUrn = config.get('plus').support_tier_urn;
  }

  /**
   * Check if a given URN matches the plus tier URN.
   * @param { string } urn - URN to check.
   * @returns { boolean } true if URN matches plus URN.
   */
  public isPlusTierUrn(urn: string): boolean {
    return urn === this.plusTierUrn;
  }
}
