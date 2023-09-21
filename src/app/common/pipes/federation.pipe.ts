import { Pipe } from '@angular/core';

/**
 * Used to extract the name of a federated domain
 * from a federation username
 * e.g.myusername@mastodon.social becomes mastodon.social
 */
@Pipe({
  name: 'federation',
})
export class FederationPipe {
  transform(federatedUsername: string) {
    return federatedUsername.split('@').pop();
  }
}
