import { Directive, Input, Optional, SkipSelf } from '@angular/core';
import {
  ClientMetaData,
  ClientMetaService,
} from '../services/client-meta.service';

@Directive({
  selector: '[m-clientMeta]',
})
export class ClientMetaDirective {
  /**
   * Client meta input binding
   * @param clientMetaData
   * @private
   */
  @Input('m-clientMeta') set _clientMetaData(
    clientMetaData: Partial<ClientMetaData>
  ) {
    if (clientMetaData && clientMetaData.source) {
      this.reset();
    }

    this.clientMetaData = clientMetaData;
  }

  /**
   * Client meta
   */
  public clientMetaData: Partial<ClientMetaData> = {};

  /**
   * Salt
   */
  protected salt: string;

  /**
   * Current timestamp
   */
  protected timestamp: number;

  /**
   * Constructor. Resets to initial values.
   * @param parent
   * @param service
   */
  constructor(
    @Optional() @SkipSelf() protected parent: ClientMetaDirective,
    protected service: ClientMetaService
  ) {}

  /**
   * Resets salt and timestamp. Used when source is re-set.
   */
  reset(): void {
    this.salt = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '');

    this.timestamp = Date.now();
  }

  /**
   * Fetches client metadata from this instance and its parent.
   */
  fetchClientMetaData(): Partial<ClientMetaData> {
    const clientMetaData: Partial<ClientMetaData> = {
      ...((this.parent && this.parent.fetchClientMetaData()) || {}),
      ...(this.clientMetaData || {}),
    };

    if (this.salt && this.timestamp) {
      clientMetaData.salt = this.salt;
      clientMetaData.timestamp = this.timestamp;
      clientMetaData.page_token = this.service.buildPageToken(
        this.salt,
        this.timestamp
      );
    }

    return clientMetaData;
  }

  /**
   * Builds metadata
   * @param extraClientMetaData
   */
  build(extraClientMetaData: Partial<ClientMetaData> = {}): ClientMetaData {
    const clientMetaData: ClientMetaData = {
      platform: 'web',
      campaign: '',
      medium: null,
      source: null,
      salt: '',
      page_token: '',
      delta: 0,
      timestamp: Date.now(),
      ...this.fetchClientMetaData(),
      ...extraClientMetaData,
    };

    if (clientMetaData.timestamp) {
      clientMetaData.delta = Math.floor(
        (Date.now() - clientMetaData.timestamp) / 1000
      );
    }

    return clientMetaData;
  }
}
