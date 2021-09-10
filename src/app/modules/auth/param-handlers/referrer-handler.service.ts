import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';
import { Client } from '../../../services/api';
import { MetaService } from '../../../common/services/meta.service';

/**
 * Handles setting the og:image metatag based on referrer.
 */
@Injectable({ providedIn: 'root' })
export class ReferrerHandlerService implements OnDestroy {
  private paramsSubscription: Subscription;
  private referrer: string;
  private cdnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private client: Client,
    private meta: MetaService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  /**
   * Subscribe to params for referrer changes and set appropriate og:image
   * @returns { void }
   */
  public subscribe(): void {
    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      if (params['referrer']) {
        this.referrer = params['referrer'];
        this.setReferrerMetaImage();
      } else {
        this.setPlaceholderMetaImage();
      }
    });
  }

  /**
   * Unsubscribe from params subscription.
   * @returns { void }
   */
  public unsubscribe(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  /**
   * Set referrer meta image.
   * @returns { Promise<void> }
   */
  private async setReferrerMetaImage(): Promise<void> {
    try {
      const response: any = await this.client.get(
        `api/v1/channel/${this.referrer}`
      );
      if (response && response.channel) {
        const ch = response.channel;
        ch.icontime = ch.icontime ? ch.icontime : '';

        this.meta.setOgImage(
          `${this.cdnUrl}icon/${ch.guid}/large/${ch.icontime}`
        );
      } else {
        this.setPlaceholderMetaImage();
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Sets default placeholder meta image
   * @returns { void }
   */
  private setPlaceholderMetaImage(): void {
    this.meta.setOgImage('/assets/og-images/default-v3.png');
  }
}
