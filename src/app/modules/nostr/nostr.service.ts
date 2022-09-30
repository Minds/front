import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { createHash } from 'crypto';
import {
  combineLatest,
  Observable,
  of,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import {
  catchError,
  map,
  share,
  switchMap,
  take,
  takeWhile,
} from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { MindsUser } from '../../interfaces/entities';

@Injectable({ providedIn: 'root' })
export class NostrService implements OnDestroy {
  /**
   * Emit the user you wish to focus on
   */
  public user$$: ReplaySubject<MindsUser> = new ReplaySubject();

  /**
   * The nostr public key (minds.com owned keypair)
   */
  public publicKey$: Observable<string | null> = this.user$$.pipe(
    takeWhile(user => Boolean(user)),
    switchMap(user =>
      this.api.get(`.well-known/nostr.json?name=${user?.username}`)
    ),
    map(response => Object.values(response?.names || {})[0] as string),
    share()
  );

  /**
   * Returns configured NIP26
   */
  public configuredNip26Tag$: Observable<Array<string>> = this.user$$.pipe(
    takeWhile(user => Boolean(user)),
    switchMap(user => this.api.get(`api/v3/nostr/nip26-delegation`)),
    catchError(() => of(null)),
    map(response => response?.tag),
    share()
  );

  /**
   * Returns if NIP26 delegation is setup
   */
  public isNip26Setup$: Observable<boolean> = this.configuredNip26Tag$.pipe(
    map(configuredNip26Tag => !!configuredNip26Tag)
  );

  /**
   * The public key the user owns
   */
  public nip26PublicKey$$: ReplaySubject<string> = new ReplaySubject();

  /**
   * The NIP-26 query string
   */
  public nip26QueryString$: Observable<string> = of(
    Math.round(Date.now() / 1000)
  ).pipe(
    map(createdAt => {
      // createdAt is unix timestamp
      return `kind=1&created_at>${createdAt}`;
    })
  );

  /**
   * Provides a token that can be signed to allow Minds to post on the users behalf
   */
  public nip26DelegationToken$: Observable<string> = combineLatest([
    this.publicKey$,
    this.nip26QueryString$,
  ]).pipe(
    map(([publicKey, nip26QueryString]) => {
      return `nostr:delegation:${publicKey}:${nip26QueryString}`;
    })
  );

  /**
   * The SHA256 hash of the NIP26 delegation token
   */
  public nip26DelegationTokenSha256Hash$: Observable<
    string
  > = this.nip26DelegationToken$.pipe(
    map(nip26DelegationToken => {
      const tokenHash = createHash('sha256')
        .update(Buffer.from(nip26DelegationToken))
        .digest();
      return Buffer.from(tokenHash).toString('hex');
    })
  );

  /**
   * The signed delegation token
   */
  public nip26DelegationTokenSig$$: ReplaySubject<string> = new ReplaySubject();

  /**
   * The tag to be passed through with events
   */
  public nip26DelegationTag$: Observable<Array<string>> = combineLatest([
    this.nip26PublicKey$$,
    this.nip26QueryString$,
    this.nip26DelegationTokenSig$$,
  ]).pipe(
    map(([nip26PublicKey, nip26QueryString, nip26DelegationTokenSig]) => {
      return [
        'delegation',
        nip26PublicKey,
        nip26QueryString,
        nip26DelegationTokenSig,
      ];
    })
  );

  /**
   * The snapshot value of the nip26DelegationTag$ observable
   */
  public nip26DelegationTagSnapshot: Array<string>;

  /**
   * Will return the NIP-05 username for the provided user
   */
  public nip05Alias$: Observable<string> = this.user$$.pipe(
    map(user => {
      return user.username + '@minds.com'; // Fix this so we support other non-minds.com domains
    })
  );

  private subscriptions: Subscription[];

  constructor(private api: ApiService) {
    this.subscriptions = [
      this.nip26DelegationTag$.subscribe(
        nip26DelegationTag =>
          (this.nip26DelegationTagSnapshot = nip26DelegationTag)
      ),
    ];
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Submits the nip26 delegate information to the backend
   */
  async setupNip26Delegation() {
    await this.api
      .post('api/v3/nostr/nip26-delegation', {
        delegator_public_key: this.nip26DelegationTagSnapshot[1],
        conditions_query_string: this.nip26DelegationTagSnapshot[2],
        sig: this.nip26DelegationTagSnapshot[3],
      })
      .toPromise();
  }

  /**
   * Removes delegation for current user
   */
  async removeNip26Delegation() {
    await this.api.delete('api/v3/nostr/nip26-delegation').toPromise();
  }
}
