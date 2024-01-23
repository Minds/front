import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  map,
  of,
  take,
} from 'rxjs';
import { ApolloQueryResult, MutationResult } from '@apollo/client';
import {
  GetCustomPageGQL,
  SetCustomPageGQL,
  SetCustomPageMutation,
  SetCustomPageMutationVariables,
  CustomPage,
  CustomPageTypesEnum,
} from '../../../../graphql/generated.engine';
import { ToasterService } from '../../../common/services/toaster.service';
import {
  CustomPageExtended,
  CustomPageImplementation,
  CustomPageType,
} from '../../custom-pages/custom-pages.types';
import { DEFAULT_PRIVACY_POLICY_CONTENT } from '../../custom-pages/default-content/default-privacy-policy.constant';
import { DEFAULT_TERMS_OF_SERVICE_CONTENT } from '../../custom-pages/default-content/default-terms-of-service.constant';
import { DEFAULT_COMMUNITY_GUIDELINES_CONTENT } from '../../custom-pages/default-content/default-community-guidelines.constant';

@Injectable({ providedIn: 'root' })
export class CustomPageService implements OnDestroy {
  /** Subject to store a custom page value. */
  public readonly customPage$: BehaviorSubject<CustomPageExtended | null> = new BehaviorSubject<CustomPageExtended | null>(
    null
  );

  private subscriptions: Subscription[] = [];

  constructor(
    private getCustomPageGQL: GetCustomPageGQL,
    private setCustomPageGQL: SetCustomPageGQL,
    private toaster: ToasterService
  ) {}

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Fetches a custom page from the server based on page type
   */
  public fetchCustomPage(pageType: CustomPageType): void {
    this.subscriptions.push(
      this.getCustomPage(pageType).subscribe(
        (customPage: CustomPage | null): void => {
          const implementation: CustomPageImplementation = this.getImplementation(
            customPage
          );
          const displayName = this.getDisplayName(customPage.pageType);
          const displayContent = this.getDisplayContent(
            customPage,
            implementation
          );

          const customPageExtended: CustomPageExtended = {
            ...customPage,
            implementation: implementation,
            displayName: displayName,
            displayContent: displayContent,
          };

          this.customPage$.next(customPageExtended);
        },
        (error: any): void => {
          console.error('Error fetching custom page:', error);
          this.customPage$.next(null);
        }
      )
    );
  }

  /**
   * Gets a custom page from the server.
   */
  public getCustomPage(
    pageType: CustomPageType
  ): Observable<CustomPage | null> {
    return this.getCustomPageGQL.fetch({ pageType }).pipe(
      map((result: ApolloQueryResult<any>): CustomPage | null => {
        return result.data?.customPage || null;
      }),
      catchError(
        (e: unknown): Observable<null> => {
          console.error('getCustomPage Error: ', e);
          return of(null);
        }
      ),
      take(1)
    );
  }

  /**
   * Sets a custom page
   */
  public setCustomPage(
    pageType: CustomPageType,
    content: string,
    externalLink: string
  ): Observable<boolean> {
    const mutationVars: SetCustomPageMutationVariables = {
      pageType: pageType,
      content: content,
      externalLink: externalLink,
    };

    // Refresh cache after mutation
    return this.setCustomPageGQL
      .mutate(mutationVars, {
        refetchQueries: [
          {
            query: this.getCustomPageGQL.document,
            variables: { pageType: pageType },
          },
        ],
      })
      .pipe(
        take(1),
        map((result: MutationResult<SetCustomPageMutation>) => {
          return Boolean(result?.data?.setCustomPage);
        }),
        catchError(
          (e: any): Observable<boolean> => {
            if (e?.errors[0] && e.errors[0].message) {
              this.toaster.error(e.errors[0].message);
            }
            console.error(e);
            return of(false);
          }
        )
      );
  }

  public getDisplayName(pageType: CustomPageTypesEnum): string {
    switch (pageType) {
      case CustomPageTypesEnum.PrivacyPolicy:
        return 'privacy policy';
      case CustomPageTypesEnum.TermsOfService:
        return 'terms of service';
      case CustomPageTypesEnum.CommunityGuidelines:
        return 'community guidelines';
      default:
        throw new Error('Invalid CustomPageType');
    }
  }

  /**
   * Determines the page implementation type from the content and externalLink values.
   * @returns The CustomPageImplementation type.
   */
  public getImplementation(customPage: CustomPage): CustomPageImplementation {
    if (customPage?.content && !customPage?.externalLink) {
      return CustomPageImplementation.CUSTOM;
    } else if (!customPage?.content && customPage?.externalLink) {
      return CustomPageImplementation.EXTERNAL;
    }
    return CustomPageImplementation.DEFAULT;
  }

  public getDisplayContent(
    customPage: CustomPage,
    implementation: CustomPageImplementation
  ): string | null {
    if (implementation === CustomPageImplementation.EXTERNAL) {
      return null;
    }

    if (implementation === CustomPageImplementation.CUSTOM) {
      return customPage.content;
    }

    return this.getDefaultContent(customPage.pageType);
  }

  public getDefaultContent(pageType: CustomPageTypesEnum): string {
    switch (pageType) {
      case CustomPageTypesEnum.PrivacyPolicy:
        return DEFAULT_PRIVACY_POLICY_CONTENT;
      case CustomPageTypesEnum.TermsOfService:
        return DEFAULT_TERMS_OF_SERVICE_CONTENT;
      case CustomPageTypesEnum.CommunityGuidelines:
        return DEFAULT_COMMUNITY_GUIDELINES_CONTENT;
      default:
        throw new Error('Invalid CustomPageType');
    }
  }
}
