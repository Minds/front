import { Injectable } from '@angular/core';
import {
  FetchPaymentMethodsGQL,
  FetchPaymentMethodsQuery,
  GiftCardProductIdEnum,
  PaymentMethod,
} from '../../../../graphql/generated.engine';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class SelectCardService {
  constructor(private fetchPaymentMethods: FetchPaymentMethodsGQL) {}

  public loadCards(
    productIdEnum: GiftCardProductIdEnum = null
  ): Observable<PaymentMethod[]> {
    return this.fetchPaymentMethods
      .fetch(
        {
          giftCardProductId: productIdEnum,
        },
        {
          fetchPolicy: 'no-cache',
        }
      )
      .pipe(
        map(response => {
          return response.data?.paymentMethods;
        }),
        catchError(error => {
          console.log('error', error);
          return of(null);
        })
      );
  }
}
