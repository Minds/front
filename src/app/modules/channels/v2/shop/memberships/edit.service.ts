import { Injectable } from '@angular/core';
import { SupportTier } from '../../../../wire/v2/support-tiers.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchAll, take, tap } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';

@Injectable()
export class ChannelShopMembershipsEditService {
  /**
   * Name subject
   */
  readonly name$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * USD amount subject
   */
  readonly usd$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * Accept tokens? subject
   */
  readonly hasTokens$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Description subject
   */
  readonly description$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  /**
   * Original entity (when loaded)
   */
  readonly original$: BehaviorSubject<SupportTier | null> = new BehaviorSubject<SupportTier | null>(
    null
  );

  /**
   * Are we editing a Support Tier?
   */
  readonly isEditing$: Observable<boolean> = this.original$.pipe(
    map(supportTier => Boolean(supportTier && supportTier.urn))
  );

  /**
   * Can the suport tier be saved?
   */
  readonly canSave$: Observable<boolean> = combineLatest([
    this.name$,
    this.usd$,
  ]).pipe(map(([name, usd]): boolean => Boolean(name && usd && usd > 0)));

  /**
   * Is there an operation in progress?
   */
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Constructor
   * @param api
   */
  constructor(protected api: ApiService) {}

  /**
   * Resets state
   */
  reset(): void {
    this.name$.next('');
    this.usd$.next(0);
    this.hasTokens$.next(false);
    this.description$.next('');
    this.original$.next(null);
    this.inProgress$.next(false);
  }

  /**
   * Sets state based on a Support Tier
   * @param supportTier
   */
  load(supportTier: SupportTier): void {
    this.name$.next(supportTier.name || '');
    this.usd$.next(supportTier.usd || 0);
    this.hasTokens$.next(Boolean(supportTier.has_tokens));
    this.description$.next(supportTier.description || '');
    this.original$.next(supportTier);
  }

  /**
   * Save
   */
  save(): Observable<SupportTier> {
    return combineLatest([
      this.name$,
      this.usd$,
      this.hasTokens$,
      this.description$,
      this.original$,
    ]).pipe(
      map(
        ([name, usd, hasTokens, description, original]): SupportTier => {
          const payload: Partial<SupportTier> = {
            ...(original || {}),
            name: name,
            usd: usd,
            has_tokens: hasTokens,
            description: description,
          };

          return payload as SupportTier;
        }
      ),
      tap(() => this.inProgress$.next(true)),
      map(supportTier =>
        this.api.post(
          supportTier.urn
            ? `api/v3/wire/supporttiers/${encodeURIComponent(supportTier.urn)}`
            : `api/v3/wire/supporttiers`,
          supportTier
        )
      ),
      switchAll(),
      map(response => response && response['support_tier']),
      tap(() => this.inProgress$.next(false)),
      take(1)
    );
  }
}
