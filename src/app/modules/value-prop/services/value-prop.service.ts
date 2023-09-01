import { Inject, Injectable } from '@angular/core';
import {
  ValuePropCard,
  GetValuePropCardsGQL,
  GetValuePropCardsQuery,
} from '../../../../graphql/generated.strapi';
import { Observable, catchError, map, of, shareReplay, take } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { STRAPI_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { PresentableValuePropCard } from '../value-prop.types';

/**
 * Service handling the showing and loading of data for value propositions.
 * Cards are inserted into the guest mode feed
 */
@Injectable({ providedIn: 'root' })
export class ValuePropService {
  // reference to cards that have already been shown.
  private shownCards: number[] = [];

  constructor(
    private getValuePropCardsGQL: GetValuePropCardsGQL,
    @Inject(STRAPI_URL) public strapiUrl: string
  ) {}

  /**
   * Get raw value prop cards from server.
   */
  private getRawValuePropCards$: Observable<
    ValuePropCard[]
  > = this.getValuePropCardsGQL.fetch().pipe(
    map(
      (result: ApolloQueryResult<GetValuePropCardsQuery>): ValuePropCard[] => {
        return result.data.valuePropCards.data.map(
          rawCard => rawCard.attributes
        ) as ValuePropCard[];
      }
    ),
    shareReplay(),
    catchError(
      (e: unknown): Observable<ValuePropCard[]> => {
        console.error(e);
        return of([]);
      }
    )
  );

  /**
   * Value prop cards cast into an easier to digest format.
   */
  private valuePropCards$: Observable<
    PresentableValuePropCard[]
  > = this.getRawValuePropCards$.pipe(
    map((rawCards: ValuePropCard[]): PresentableValuePropCard[] => {
      return rawCards.map(rawCard =>
        this.getPresentableCard(rawCard)
      ) as PresentableValuePropCard[];
    }),
    shareReplay(),
    catchError(
      (e: unknown): Observable<PresentableValuePropCard[]> => {
        console.error(e);
        return of([]);
      }
    )
  );

  /**
   * Gets the next card that has not been shown. Will be null if there are no cards left to show.
   */
  public readonly nextUnshownCard$: Observable<
    PresentableValuePropCard
  > = this.valuePropCards$.pipe(
    take(1),
    map(
      (cards: PresentableValuePropCard[]): PresentableValuePropCard => {
        return (
          cards.filter((card: PresentableValuePropCard) => {
            return !this.hasCardBeenShown(card);
          })?.[0] ?? null
        );
      }
    )
  );

  /**
   * Sets a card as shown in local state.
   * @param { PresentableValuePropCard } card - card to flag as shown.
   * @returns { void }
   */
  public setCardAsShown(card: PresentableValuePropCard): void {
    this.shownCards.push(card.order);
  }

  /**
   * Check whether a card has been shown.
   * @param { PresentableValuePropCard } card - card to check.
   * @returns { boolean } true if card has been shown.
   */
  private hasCardBeenShown(card: PresentableValuePropCard): boolean {
    return this.shownCards.includes(card.order);
  }

  /**
   * Converts a raw ValuePropCard into an easier to consume format.
   * @param { ValuePropCard } rawCard - raw card to convert.
   * @returns { PresentableValuePropCard } - presentable format.
   */
  private getPresentableCard(rawCard: ValuePropCard): PresentableValuePropCard {
    return {
      title: rawCard.title,
      imageUrl: this.getImageUrl(rawCard),
      altText: this.getAltText(rawCard),
      order: rawCard.order,
    };
  }

  /**
   * Gets image URL from raw value prop card from Strapi.
   * @param { ValuePropCard } rawCard - card to get image from.
   * @returns { string } url for image.
   */
  private getImageUrl(rawCard: ValuePropCard): string {
    const media = rawCard?.media?.data?.attributes;
    if (!media?.mime.includes('image')) {
      return null;
    }

    return this.strapiUrl + media?.url;
  }

  /**
   * Get alt text for image of raw value prop card from Strapi.
   * @param { ValuePropCard } rawCard - card to get alt text from.
   * @returns { string } alt text for card image.
   */
  private getAltText(rawCard: ValuePropCard): string {
    return rawCard?.media?.data?.attributes?.alternativeText ?? rawCard?.title;
  }
}
