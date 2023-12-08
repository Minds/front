import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  ComponentOnboardingV5OnboardingStep as OnboardingStep,
  FetchOnboardingV5VersionsGQL,
  FetchOnboardingV5VersionsQuery,
  OnboardingV5Version,
  OnboardingV5VersionStepsDynamicZone,
  ComponentOnboardingV5OnboardingStep,
} from '../../../../graphql/generated.strapi';
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  firstValueFrom,
  map,
} from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { CarouselItem } from '../../../common/components/feature-carousel/feature-carousel.component';
import { STRAPI_URL } from '../../../common/injection-tokens/url-injection-tokens';

/**
 * Manages image(s) displayed in the right column of the
 * auth modal forms (login/register) on minds.com
 */
@Injectable({ providedIn: 'root' })
export class AuthModalImageService {
  /**
   * Used to ensure that we only load the images once.
   */
  private loaded: boolean = false;

  /** Whether fetching steps is in progress. */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** Onboarding version. */
  public readonly version$: BehaviorSubject<
    OnboardingV5Version
  > = new BehaviorSubject<OnboardingV5Version>(null);

  /**
   * Confirms that the step is a step and not an error
   */
  private isOnboardingStep(
    step: OnboardingV5VersionStepsDynamicZone
  ): step is ComponentOnboardingV5OnboardingStep {
    return (
      step &&
      (step as ComponentOnboardingV5OnboardingStep).carousel !== undefined
    );
  }

  /** Unique carousel items from all the onboarding steps */
  public readonly carouselItems$: Observable<
    CarouselItem[]
  > = this.version$.pipe(
    distinctUntilChanged(),
    map(version => {
      if (!version || !version.steps || version.steps.length === 0) {
        console.warn(
          'Auth modal image service - invalid onboarding version or no steps found'
        );
        return [];
      }

      const carouselItems: CarouselItem[] = [];
      const uniqueTitles = new Set<string>();

      for (const step of version.steps) {
        if (this.isOnboardingStep(step) && step.carousel) {
          for (const carouselItem of step.carousel) {
            // Check if the title is unique before adding to carouselItems
            if (!uniqueTitles.has(carouselItem.title)) {
              uniqueTitles.add(carouselItem.title);

              carouselItems.push({
                title: carouselItem.title,
                media: {
                  fullUrl:
                    this.strapiUrl + carouselItem?.media?.data?.attributes?.url,
                  altText:
                    carouselItem?.media?.data?.attributes?.alternativeText ??
                    'Carousel image',
                },
              });
            }
          }
        }
      }

      return carouselItems;
    })
  );

  constructor(
    private fetchOnboardingV5VersionsGql: FetchOnboardingV5VersionsGQL,
    @Inject(STRAPI_URL) public strapiUrl: string
  ) {}

  /**
   * Starts loading the images (which are taken from the onboarding flow)
   * @returns { Promise<void> }
   */
  public async loadImages(): Promise<void> {
    if (this.loaded) {
      return;
    }
    try {
      // get onboarding version from CMS.
      const versionsResponse: ApolloQueryResult<FetchOnboardingV5VersionsQuery> = await firstValueFrom(
        this.fetchOnboardingV5VersionsGql.fetch()
      );

      const version: OnboardingV5Version = versionsResponse?.data
        ?.onboardingV5Versions?.data[0].attributes as OnboardingV5Version;

      this.version$.next(version);
    } catch (e) {
      console.error(e);
    } finally {
      this.inProgress$.next(false);
      this.loaded = true;
    }
  }
}
