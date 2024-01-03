import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
  GetPostSubscriptionGQL,
  PostSubscription,
  PostSubscriptionFrequencyEnum,
  UpdatePostSubscriptionsGQL,
} from '../../../../graphql/generated.engine';

@Injectable({ providedIn: 'root' })
export class PostSubscriptionsService {
  constructor(
    private getPostSubscriptionGql: GetPostSubscriptionGQL,
    private updatePostSubvscriptionGql: UpdatePostSubscriptionsGQL
  ) {}

  /**
   * Returns a post subscription for a user
   */
  async getPostSubscription(entityGuid: string): Promise<PostSubscription> {
    const response = await lastValueFrom(
      this.getPostSubscriptionGql.fetch({
        entityGuid,
      })
    );

    return response.data.postSubscription;
  }

  /**
   * Changes the frequency of the post subscription
   */
  async updatePostSubscription(
    entityGuid: string,
    frequency: PostSubscriptionFrequencyEnum
  ): Promise<boolean> {
    const response = await lastValueFrom(
      this.updatePostSubvscriptionGql.mutate({
        entityGuid,
        frequency,
      })
    );

    return true;
  }
}
