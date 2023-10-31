import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any };
  /** A string used to identify an i18n locale */
  I18NLocaleCode: { input: any; output: any };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
  OnboardingV5VersionStepsDynamicZoneInput: { input: any; output: any };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any };
  V2ProductPageProductPageDynamicZoneInput: { input: any; output: any };
};

export type AuxPage = {
  __typename?: 'AuxPage';
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  h1: Scalars['String']['output'];
  metadata?: Maybe<ComponentMetadataGeneralPageMetadata>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AuxPageEntity = {
  __typename?: 'AuxPageEntity';
  attributes?: Maybe<AuxPage>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type AuxPageEntityResponse = {
  __typename?: 'AuxPageEntityResponse';
  data?: Maybe<AuxPageEntity>;
};

export type AuxPageEntityResponseCollection = {
  __typename?: 'AuxPageEntityResponseCollection';
  data: Array<AuxPageEntity>;
  meta: ResponseCollectionMeta;
};

export type AuxPageFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<AuxPageFiltersInput>>>;
  body?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  h1?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  metadata?: InputMaybe<ComponentMetadataGeneralPageMetadataFiltersInput>;
  not?: InputMaybe<AuxPageFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<AuxPageFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type AuxPageInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  h1?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<ComponentMetadataGeneralPageMetadataInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type BooleanFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  contains?: InputMaybe<Scalars['Boolean']['input']>;
  containsi?: InputMaybe<Scalars['Boolean']['input']>;
  endsWith?: InputMaybe<Scalars['Boolean']['input']>;
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  eqi?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['Boolean']['input']>;
  gte?: InputMaybe<Scalars['Boolean']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  lt?: InputMaybe<Scalars['Boolean']['input']>;
  lte?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<BooleanFilterInput>;
  notContains?: InputMaybe<Scalars['Boolean']['input']>;
  notContainsi?: InputMaybe<Scalars['Boolean']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  startsWith?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ComponentCommonActionButton = {
  __typename?: 'ComponentCommonActionButton';
  action?: Maybe<Enum_Componentcommonactionbutton_Action>;
  dataRef?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  navigationUrl?: Maybe<Scalars['String']['output']>;
  solid?: Maybe<Scalars['Boolean']['output']>;
  text: Scalars['String']['output'];
};

export type ComponentCommonActionButtonFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<ComponentCommonActionButtonFiltersInput>>>;
  dataRef?: InputMaybe<StringFilterInput>;
  navigationUrl?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentCommonActionButtonFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonActionButtonFiltersInput>>>;
  solid?: InputMaybe<BooleanFilterInput>;
  text?: InputMaybe<StringFilterInput>;
};

export type ComponentCommonActionButtonInput = {
  action?: InputMaybe<Enum_Componentcommonactionbutton_Action>;
  dataRef?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  navigationUrl?: InputMaybe<Scalars['String']['input']>;
  solid?: InputMaybe<Scalars['Boolean']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentExplainerScreenContinueButton = {
  __typename?: 'ComponentExplainerScreenContinueButton';
  dataRef: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type ComponentExplainerScreenContinueButtonFiltersInput = {
  and?: InputMaybe<
    Array<InputMaybe<ComponentExplainerScreenContinueButtonFiltersInput>>
  >;
  dataRef?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentExplainerScreenContinueButtonFiltersInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentExplainerScreenContinueButtonFiltersInput>>
  >;
  text?: InputMaybe<StringFilterInput>;
};

export type ComponentExplainerScreenContinueButtonInput = {
  dataRef?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentExplainerScreenSection = {
  __typename?: 'ComponentExplainerScreenSection';
  description: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type ComponentExplainerScreenSectionFiltersInput = {
  and?: InputMaybe<
    Array<InputMaybe<ComponentExplainerScreenSectionFiltersInput>>
  >;
  description?: InputMaybe<StringFilterInput>;
  icon?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentExplainerScreenSectionFiltersInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentExplainerScreenSectionFiltersInput>>
  >;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentExplainerScreenSectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentFooterColumns = {
  __typename?: 'ComponentFooterColumns';
  id: Scalars['ID']['output'];
  links: Array<Maybe<ComponentFooterLink>>;
  title: Scalars['String']['output'];
};

export type ComponentFooterColumnsLinksArgs = {
  filters?: InputMaybe<ComponentFooterLinkFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentFooterColumnsFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentFooterColumnsFiltersInput>>>;
  links?: InputMaybe<ComponentFooterLinkFiltersInput>;
  not?: InputMaybe<ComponentFooterColumnsFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentFooterColumnsFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentFooterColumnsInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  links?: InputMaybe<Array<InputMaybe<ComponentFooterLinkInput>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentFooterLink = {
  __typename?: 'ComponentFooterLink';
  dataRef?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ComponentFooterLinkFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentFooterLinkFiltersInput>>>;
  dataRef?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentFooterLinkFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentFooterLinkFiltersInput>>>;
  text?: InputMaybe<StringFilterInput>;
  url?: InputMaybe<StringFilterInput>;
};

export type ComponentFooterLinkInput = {
  dataRef?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentMarketingComponentsAsFeaturedIn = {
  __typename?: 'ComponentMarketingComponentsAsFeaturedIn';
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileRelationResponseCollection>;
};

export type ComponentMarketingComponentsAsFeaturedInImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentMarketingComponentsAsFeaturedInFiltersInput = {
  and?: InputMaybe<
    Array<InputMaybe<ComponentMarketingComponentsAsFeaturedInFiltersInput>>
  >;
  not?: InputMaybe<ComponentMarketingComponentsAsFeaturedInFiltersInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentMarketingComponentsAsFeaturedInFiltersInput>>
  >;
};

export type ComponentMarketingComponentsAsFeaturedInInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ComponentMarketingComponentsHero = {
  __typename?: 'ComponentMarketingComponentsHero';
  body: Scalars['String']['output'];
  ctaText: Scalars['String']['output'];
  h1: Scalars['String']['output'];
  heroBackground?: Maybe<UploadFileEntityResponse>;
  heroStats?: Maybe<Array<Maybe<ComponentMarketingComponentsStatsBarStat>>>;
  id: Scalars['ID']['output'];
};

export type ComponentMarketingComponentsHeroHeroStatsArgs = {
  filters?: InputMaybe<ComponentMarketingComponentsStatsBarStatFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentMarketingComponentsHeroInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  ctaText?: InputMaybe<Scalars['String']['input']>;
  h1?: InputMaybe<Scalars['String']['input']>;
  heroBackground?: InputMaybe<Scalars['ID']['input']>;
  heroStats?: InputMaybe<
    Array<InputMaybe<ComponentMarketingComponentsStatsBarStatInput>>
  >;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type ComponentMarketingComponentsMarketingPageSection = {
  __typename?: 'ComponentMarketingComponentsMarketingPageSection';
  body: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image: UploadFileEntityResponse;
  leftAligned: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type ComponentMarketingComponentsMarketingPageSectionFiltersInput = {
  and?: InputMaybe<
    Array<
      InputMaybe<ComponentMarketingComponentsMarketingPageSectionFiltersInput>
    >
  >;
  body?: InputMaybe<StringFilterInput>;
  leftAligned?: InputMaybe<BooleanFilterInput>;
  not?: InputMaybe<
    ComponentMarketingComponentsMarketingPageSectionFiltersInput
  >;
  or?: InputMaybe<
    Array<
      InputMaybe<ComponentMarketingComponentsMarketingPageSectionFiltersInput>
    >
  >;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentMarketingComponentsMarketingPageSectionInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Scalars['ID']['input']>;
  leftAligned?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentMarketingComponentsSectionTail = {
  __typename?: 'ComponentMarketingComponentsSectionTail';
  ctaText: Scalars['String']['output'];
  h3: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type ComponentMarketingComponentsSectionTailInput = {
  ctaText?: InputMaybe<Scalars['String']['input']>;
  h3?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type ComponentMarketingComponentsStatsBarStat = {
  __typename?: 'ComponentMarketingComponentsStatsBarStat';
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  number: Scalars['String']['output'];
};

export type ComponentMarketingComponentsStatsBarStatFiltersInput = {
  and?: InputMaybe<
    Array<InputMaybe<ComponentMarketingComponentsStatsBarStatFiltersInput>>
  >;
  label?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentMarketingComponentsStatsBarStatFiltersInput>;
  number?: InputMaybe<StringFilterInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentMarketingComponentsStatsBarStatFiltersInput>>
  >;
};

export type ComponentMarketingComponentsStatsBarStatInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentMetadataGeneralPageMetadata = {
  __typename?: 'ComponentMetadataGeneralPageMetadata';
  author?: Maybe<Scalars['String']['output']>;
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ogAuthor?: Maybe<Scalars['String']['output']>;
  ogImage?: Maybe<UploadFileEntityResponse>;
  ogType?: Maybe<Scalars['String']['output']>;
  ogUrl?: Maybe<Scalars['String']['output']>;
  robots?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentMetadataGeneralPageMetadataFiltersInput = {
  and?: InputMaybe<
    Array<InputMaybe<ComponentMetadataGeneralPageMetadataFiltersInput>>
  >;
  author?: InputMaybe<StringFilterInput>;
  canonicalUrl?: InputMaybe<StringFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentMetadataGeneralPageMetadataFiltersInput>;
  ogAuthor?: InputMaybe<StringFilterInput>;
  ogType?: InputMaybe<StringFilterInput>;
  ogUrl?: InputMaybe<StringFilterInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentMetadataGeneralPageMetadataFiltersInput>>
  >;
  robots?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentMetadataGeneralPageMetadataInput = {
  author?: InputMaybe<Scalars['String']['input']>;
  canonicalUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ogAuthor?: InputMaybe<Scalars['String']['input']>;
  ogImage?: InputMaybe<Scalars['ID']['input']>;
  ogType?: InputMaybe<Scalars['String']['input']>;
  ogUrl?: InputMaybe<Scalars['String']['input']>;
  robots?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentOnboardingV5ActionButton = {
  __typename?: 'ComponentOnboardingV5ActionButton';
  dataRef?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type ComponentOnboardingV5CarouselItem = {
  __typename?: 'ComponentOnboardingV5CarouselItem';
  id: Scalars['ID']['output'];
  media: UploadFileEntityResponse;
  title: Scalars['String']['output'];
};

export type ComponentOnboardingV5CarouselItemFiltersInput = {
  and?: InputMaybe<
    Array<InputMaybe<ComponentOnboardingV5CarouselItemFiltersInput>>
  >;
  not?: InputMaybe<ComponentOnboardingV5CarouselItemFiltersInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentOnboardingV5CarouselItemFiltersInput>>
  >;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentOnboardingV5CompletionStep = {
  __typename?: 'ComponentOnboardingV5CompletionStep';
  id: Scalars['ID']['output'];
  media?: Maybe<UploadFileEntityResponse>;
  message: Scalars['String']['output'];
};

export type ComponentOnboardingV5CompletionStepFiltersInput = {
  and?: InputMaybe<
    Array<InputMaybe<ComponentOnboardingV5CompletionStepFiltersInput>>
  >;
  message?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentOnboardingV5CompletionStepFiltersInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentOnboardingV5CompletionStepFiltersInput>>
  >;
};

export type ComponentOnboardingV5CompletionStepInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  media?: InputMaybe<Scalars['ID']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentOnboardingV5GroupSelectorStep = {
  __typename?: 'ComponentOnboardingV5GroupSelectorStep';
  id: Scalars['ID']['output'];
};

export type ComponentOnboardingV5OnboardingStep = {
  __typename?: 'ComponentOnboardingV5OnboardingStep';
  actionButton?: Maybe<ComponentOnboardingV5ActionButton>;
  carousel: Array<Maybe<ComponentOnboardingV5CarouselItem>>;
  description: Scalars['String']['output'];
  groupSelector?: Maybe<ComponentOnboardingV5GroupSelectorStep>;
  id: Scalars['ID']['output'];
  radioSurvey?: Maybe<Array<Maybe<ComponentOnboardingV5RadioOption>>>;
  radioSurveyQuestion?: Maybe<Scalars['String']['output']>;
  skipButton?: Maybe<ComponentOnboardingV5SkipButton>;
  stepKey: Scalars['String']['output'];
  stepType: Enum_Componentonboardingv5Onboardingstep_Steptype;
  tagSelector?: Maybe<ComponentOnboardingV5TagSelectorStep>;
  title: Scalars['String']['output'];
  userSelector?: Maybe<ComponentOnboardingV5UserSelectorStep>;
  verifyEmailForm?: Maybe<ComponentOnboardingV5VerifyEmailStep>;
};

export type ComponentOnboardingV5OnboardingStepCarouselArgs = {
  filters?: InputMaybe<ComponentOnboardingV5CarouselItemFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentOnboardingV5OnboardingStepRadioSurveyArgs = {
  filters?: InputMaybe<ComponentOnboardingV5RadioOptionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentOnboardingV5RadioOption = {
  __typename?: 'ComponentOnboardingV5RadioOption';
  id: Scalars['ID']['output'];
  optionDescription: Scalars['String']['output'];
  optionKey: Scalars['String']['output'];
  optionTitle: Scalars['String']['output'];
};

export type ComponentOnboardingV5RadioOptionFiltersInput = {
  and?: InputMaybe<
    Array<InputMaybe<ComponentOnboardingV5RadioOptionFiltersInput>>
  >;
  not?: InputMaybe<ComponentOnboardingV5RadioOptionFiltersInput>;
  optionDescription?: InputMaybe<StringFilterInput>;
  optionKey?: InputMaybe<StringFilterInput>;
  optionTitle?: InputMaybe<StringFilterInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentOnboardingV5RadioOptionFiltersInput>>
  >;
};

export type ComponentOnboardingV5SkipButton = {
  __typename?: 'ComponentOnboardingV5SkipButton';
  dataRef?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type ComponentOnboardingV5TagSelectorStep = {
  __typename?: 'ComponentOnboardingV5TagSelectorStep';
  customTagInputText: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type ComponentOnboardingV5UserSelectorStep = {
  __typename?: 'ComponentOnboardingV5UserSelectorStep';
  id: Scalars['ID']['output'];
};

export type ComponentOnboardingV5VerifyEmailStep = {
  __typename?: 'ComponentOnboardingV5VerifyEmailStep';
  changeEmailActionButton: ComponentOnboardingV5ActionButton;
  changeEmailActionText: Scalars['String']['output'];
  changeEmailDescription: Scalars['String']['output'];
  changeEmailInputLabel: Scalars['String']['output'];
  changeEmailInputPlaceholder?: Maybe<Scalars['String']['output']>;
  changeEmailTitle: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  inputLabel: Scalars['String']['output'];
  inputPlaceholder?: Maybe<Scalars['String']['output']>;
  resendCodeActionText: Scalars['String']['output'];
  resendCodeText: Scalars['String']['output'];
};

export type ComponentProductFooter = {
  __typename?: 'ComponentProductFooter';
  actionButton?: Maybe<ComponentCommonActionButton>;
  id: Scalars['ID']['output'];
};

export type ComponentProductFooterFiltersInput = {
  actionButton?: InputMaybe<ComponentCommonActionButtonFiltersInput>;
  and?: InputMaybe<Array<InputMaybe<ComponentProductFooterFiltersInput>>>;
  not?: InputMaybe<ComponentProductFooterFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentProductFooterFiltersInput>>>;
};

export type ComponentProductFooterInput = {
  actionButton?: InputMaybe<ComponentCommonActionButtonInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type ComponentProductHero = {
  __typename?: 'ComponentProductHero';
  body: Scalars['String']['output'];
  h1: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image: UploadFileEntityResponse;
  showBackgroundEffects: Scalars['Boolean']['output'];
};

export type ComponentProductHeroFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentProductHeroFiltersInput>>>;
  body?: InputMaybe<StringFilterInput>;
  h1?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentProductHeroFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentProductHeroFiltersInput>>>;
  showBackgroundEffects?: InputMaybe<BooleanFilterInput>;
};

export type ComponentProductHeroInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  h1?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Scalars['ID']['input']>;
  showBackgroundEffects?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ComponentProductOther = {
  __typename?: 'ComponentProductOther';
  column1Body: Scalars['String']['output'];
  column1Title: Scalars['String']['output'];
  column2Body: Scalars['String']['output'];
  column2Title: Scalars['String']['output'];
  column3Body: Scalars['String']['output'];
  column3Title: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentProductOtherFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentProductOtherFiltersInput>>>;
  column1Body?: InputMaybe<StringFilterInput>;
  column1Title?: InputMaybe<StringFilterInput>;
  column2Body?: InputMaybe<StringFilterInput>;
  column2Title?: InputMaybe<StringFilterInput>;
  column3Body?: InputMaybe<StringFilterInput>;
  column3Title?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentProductOtherFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentProductOtherFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentProductOtherInput = {
  column1Body?: InputMaybe<Scalars['String']['input']>;
  column1Title?: InputMaybe<Scalars['String']['input']>;
  column2Body?: InputMaybe<Scalars['String']['input']>;
  column2Title?: InputMaybe<Scalars['String']['input']>;
  column3Body?: InputMaybe<Scalars['String']['input']>;
  column3Title?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentProductSection = {
  __typename?: 'ComponentProductSection';
  actionButtons?: Maybe<Array<Maybe<ComponentCommonActionButton>>>;
  body: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  imageOverlay?: Maybe<UploadFileEntityResponse>;
  leftAligned: Scalars['Boolean']['output'];
  showBackgroundEffects: Scalars['Boolean']['output'];
  showBodyBackground: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type ComponentProductSectionActionButtonsArgs = {
  filters?: InputMaybe<ComponentCommonActionButtonFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentProductSectionFiltersInput = {
  actionButtons?: InputMaybe<ComponentCommonActionButtonFiltersInput>;
  and?: InputMaybe<Array<InputMaybe<ComponentProductSectionFiltersInput>>>;
  body?: InputMaybe<StringFilterInput>;
  leftAligned?: InputMaybe<BooleanFilterInput>;
  not?: InputMaybe<ComponentProductSectionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentProductSectionFiltersInput>>>;
  showBackgroundEffects?: InputMaybe<BooleanFilterInput>;
  showBodyBackground?: InputMaybe<BooleanFilterInput>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentProductSectionInput = {
  actionButtons?: InputMaybe<
    Array<InputMaybe<ComponentCommonActionButtonInput>>
  >;
  body?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Scalars['ID']['input']>;
  imageOverlay?: InputMaybe<Scalars['ID']['input']>;
  leftAligned?: InputMaybe<Scalars['Boolean']['input']>;
  showBackgroundEffects?: InputMaybe<Scalars['Boolean']['input']>;
  showBodyBackground?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentV2ProductActionButton = {
  __typename?: 'ComponentV2ProductActionButton';
  action?: Maybe<Enum_Componentv2Productactionbutton_Action>;
  dataRef?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  navigationUrl?: Maybe<Scalars['String']['output']>;
  rounded?: Maybe<Scalars['Boolean']['output']>;
  solid?: Maybe<Scalars['Boolean']['output']>;
  text: Scalars['String']['output'];
};

export type ComponentV2ProductActionButtonFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<
    Array<InputMaybe<ComponentV2ProductActionButtonFiltersInput>>
  >;
  dataRef?: InputMaybe<StringFilterInput>;
  navigationUrl?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentV2ProductActionButtonFiltersInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentV2ProductActionButtonFiltersInput>>
  >;
  rounded?: InputMaybe<BooleanFilterInput>;
  solid?: InputMaybe<BooleanFilterInput>;
  text?: InputMaybe<StringFilterInput>;
};

export type ComponentV2ProductActionButtonInput = {
  action?: InputMaybe<Enum_Componentv2Productactionbutton_Action>;
  dataRef?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  navigationUrl?: InputMaybe<Scalars['String']['input']>;
  rounded?: InputMaybe<Scalars['Boolean']['input']>;
  solid?: InputMaybe<Scalars['Boolean']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentV2ProductBasicExplainer = {
  __typename?: 'ComponentV2ProductBasicExplainer';
  body: Scalars['String']['output'];
  button?: Maybe<ComponentV2ProductActionButton>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type ComponentV2ProductClosingCta = {
  __typename?: 'ComponentV2ProductClosingCta';
  body: Scalars['String']['output'];
  borderImage?: Maybe<UploadFileEntityResponse>;
  button?: Maybe<ComponentV2ProductActionButton>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type ComponentV2ProductFeatureHighlight = {
  __typename?: 'ComponentV2ProductFeatureHighlight';
  alignImage: Enum_Componentv2Productfeaturehighlight_Alignimage;
  backgroundColor: Scalars['String']['output'];
  body: Scalars['String']['output'];
  button?: Maybe<ComponentV2ProductActionButton>;
  colorScheme: Enum_Componentv2Productfeaturehighlight_Colorscheme;
  id: Scalars['ID']['output'];
  image: UploadFileEntityResponse;
  title: Scalars['String']['output'];
};

export type ComponentV2ProductFeatureShowcase = {
  __typename?: 'ComponentV2ProductFeatureShowcase';
  id: Scalars['ID']['output'];
  items: Array<Maybe<ComponentV2ProductFeatureShowcaseItem>>;
};

export type ComponentV2ProductFeatureShowcaseItemsArgs = {
  filters?: InputMaybe<ComponentV2ProductFeatureShowcaseItemFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentV2ProductFeatureShowcaseItem = {
  __typename?: 'ComponentV2ProductFeatureShowcaseItem';
  body: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image: UploadFileEntityResponse;
  title: Scalars['String']['output'];
};

export type ComponentV2ProductFeatureShowcaseItemFiltersInput = {
  and?: InputMaybe<
    Array<InputMaybe<ComponentV2ProductFeatureShowcaseItemFiltersInput>>
  >;
  body?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentV2ProductFeatureShowcaseItemFiltersInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentV2ProductFeatureShowcaseItemFiltersInput>>
  >;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentV2ProductFeatureTable = {
  __typename?: 'ComponentV2ProductFeatureTable';
  columns?: Maybe<FeatTableColumnRelationResponseCollection>;
  id: Scalars['ID']['output'];
  subtitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ComponentV2ProductFeatureTableColumnsArgs = {
  filters?: InputMaybe<FeatTableColumnFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentV2ProductFeatureTableHeader = {
  __typename?: 'ComponentV2ProductFeatureTableHeader';
  button: ComponentV2ProductActionButton;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type ComponentV2ProductFeatureTableHeaderFiltersInput = {
  and?: InputMaybe<
    Array<InputMaybe<ComponentV2ProductFeatureTableHeaderFiltersInput>>
  >;
  button?: InputMaybe<ComponentV2ProductActionButtonFiltersInput>;
  not?: InputMaybe<ComponentV2ProductFeatureTableHeaderFiltersInput>;
  or?: InputMaybe<
    Array<InputMaybe<ComponentV2ProductFeatureTableHeaderFiltersInput>>
  >;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentV2ProductFeatureTableHeaderInput = {
  button?: InputMaybe<ComponentV2ProductActionButtonInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentV2ProductHero = {
  __typename?: 'ComponentV2ProductHero';
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type ComponentV2ProductPerk = {
  __typename?: 'ComponentV2ProductPerk';
  id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
};

export type ComponentV2ProductPerkFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentV2ProductPerkFiltersInput>>>;
  not?: InputMaybe<ComponentV2ProductPerkFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentV2ProductPerkFiltersInput>>>;
  text?: InputMaybe<StringFilterInput>;
};

export type ComponentV2ProductPerkInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentV2ProductPricingCards = {
  __typename?: 'ComponentV2ProductPricingCards';
  id: Scalars['ID']['output'];
  productPlans?: Maybe<ProductPlanRelationResponseCollection>;
  savingsText: Scalars['String']['output'];
};

export type ComponentV2ProductPricingCardsProductPlansArgs = {
  filters?: InputMaybe<ProductPlanFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type DateTimeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  contains?: InputMaybe<Scalars['DateTime']['input']>;
  containsi?: InputMaybe<Scalars['DateTime']['input']>;
  endsWith?: InputMaybe<Scalars['DateTime']['input']>;
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  eqi?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  ne?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeFilterInput>;
  notContains?: InputMaybe<Scalars['DateTime']['input']>;
  notContainsi?: InputMaybe<Scalars['DateTime']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  startsWith?: InputMaybe<Scalars['DateTime']['input']>;
};

export enum Enum_Componentcommonactionbutton_Action {
  OpenComposer = 'open_composer',
  OpenOnchainTransferModal = 'open_onchain_transfer_modal',
  OpenPlusUpgradeModal = 'open_plus_upgrade_modal',
  OpenProUpgradeModal = 'open_pro_upgrade_modal',
  OpenRegisterModal = 'open_register_modal',
  OpenUniswapV2Liquidity = 'open_uniswap_v2_liquidity',
  ScrollToTop = 'scroll_to_top',
}

export enum Enum_Componentonboardingv5Onboardingstep_Steptype {
  GroupSelector = 'group_selector',
  Survey = 'survey',
  TagSelector = 'tag_selector',
  UserSelector = 'user_selector',
  VerifyEmail = 'verify_email',
}

export enum Enum_Componentv2Productactionbutton_Action {
  OpenComposer = 'open_composer',
  OpenOnchainTransferModal = 'open_onchain_transfer_modal',
  OpenPlusUpgradeModal = 'open_plus_upgrade_modal',
  OpenProUpgradeModal = 'open_pro_upgrade_modal',
  OpenRegisterModal = 'open_register_modal',
  OpenUniswapV2Liquidity = 'open_uniswap_v2_liquidity',
  ScrollToTop = 'scroll_to_top',
}

export enum Enum_Componentv2Productfeaturehighlight_Alignimage {
  Left = 'left',
  Right = 'right',
}

export enum Enum_Componentv2Productfeaturehighlight_Colorscheme {
  Dark = 'dark',
  Light = 'light',
}

export enum Enum_Feattablecolumn_Tier {
  Free = 'free',
  Networks = 'networks',
  Plus = 'plus',
  Pro = 'pro',
}

export enum Enum_Productplan_Tier {
  Free = 'free',
  Networks = 'networks',
  Plus = 'plus',
  Pro = 'pro',
}

export enum Enum_Upgradepage_Cardid {
  Hero = 'hero',
  Networks = 'networks',
  Plus = 'plus',
  Pro = 'pro',
}

export enum Enum_Upgradepage_Iconsource {
  Material = 'material',
  Svg = 'svg',
}

export enum Enum_Upgradepage_Rowtype {
  Bullet = 'bullet',
  LinkText = 'linkText',
  Price = 'price',
  Title = 'title',
}

export type Error = {
  __typename?: 'Error';
  code: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
};

export type ExplainerScreenMobile = {
  __typename?: 'ExplainerScreenMobile';
  continueButton: ComponentExplainerScreenContinueButton;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  key: Scalars['String']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  section: Array<Maybe<ComponentExplainerScreenSection>>;
  subtitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ExplainerScreenMobileSectionArgs = {
  filters?: InputMaybe<ComponentExplainerScreenSectionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ExplainerScreenMobileEntity = {
  __typename?: 'ExplainerScreenMobileEntity';
  attributes?: Maybe<ExplainerScreenMobile>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ExplainerScreenMobileEntityResponse = {
  __typename?: 'ExplainerScreenMobileEntityResponse';
  data?: Maybe<ExplainerScreenMobileEntity>;
};

export type ExplainerScreenMobileEntityResponseCollection = {
  __typename?: 'ExplainerScreenMobileEntityResponseCollection';
  data: Array<ExplainerScreenMobileEntity>;
  meta: ResponseCollectionMeta;
};

export type ExplainerScreenMobileFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ExplainerScreenMobileFiltersInput>>>;
  continueButton?: InputMaybe<
    ComponentExplainerScreenContinueButtonFiltersInput
  >;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  key?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ExplainerScreenMobileFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ExplainerScreenMobileFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  section?: InputMaybe<ComponentExplainerScreenSectionFiltersInput>;
  subtitle?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ExplainerScreenMobileInput = {
  continueButton?: InputMaybe<ComponentExplainerScreenContinueButtonInput>;
  key?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  section?: InputMaybe<Array<InputMaybe<ComponentExplainerScreenSectionInput>>>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ExplainerScreenWeb = {
  __typename?: 'ExplainerScreenWeb';
  continueButton: ComponentExplainerScreenContinueButton;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  key: Scalars['String']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  section: Array<Maybe<ComponentExplainerScreenSection>>;
  subtitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
  triggerRoute?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ExplainerScreenWebSectionArgs = {
  filters?: InputMaybe<ComponentExplainerScreenSectionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ExplainerScreenWebEntity = {
  __typename?: 'ExplainerScreenWebEntity';
  attributes?: Maybe<ExplainerScreenWeb>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ExplainerScreenWebEntityResponse = {
  __typename?: 'ExplainerScreenWebEntityResponse';
  data?: Maybe<ExplainerScreenWebEntity>;
};

export type ExplainerScreenWebEntityResponseCollection = {
  __typename?: 'ExplainerScreenWebEntityResponseCollection';
  data: Array<ExplainerScreenWebEntity>;
  meta: ResponseCollectionMeta;
};

export type ExplainerScreenWebFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ExplainerScreenWebFiltersInput>>>;
  continueButton?: InputMaybe<
    ComponentExplainerScreenContinueButtonFiltersInput
  >;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  key?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ExplainerScreenWebFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ExplainerScreenWebFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  section?: InputMaybe<ComponentExplainerScreenSectionFiltersInput>;
  subtitle?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  triggerRoute?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ExplainerScreenWebInput = {
  continueButton?: InputMaybe<ComponentExplainerScreenContinueButtonInput>;
  key?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  section?: InputMaybe<Array<InputMaybe<ComponentExplainerScreenSectionInput>>>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  triggerRoute?: InputMaybe<Scalars['String']['input']>;
};

export type FeatTableColumn = {
  __typename?: 'FeatTableColumn';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  featTableHeader?: Maybe<ComponentV2ProductFeatureTableHeader>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  sections?: Maybe<FeatTableSectionRelationResponseCollection>;
  tier?: Maybe<Enum_Feattablecolumn_Tier>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FeatTableColumnSectionsArgs = {
  filters?: InputMaybe<FeatTableSectionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type FeatTableColumnEntity = {
  __typename?: 'FeatTableColumnEntity';
  attributes?: Maybe<FeatTableColumn>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FeatTableColumnEntityResponse = {
  __typename?: 'FeatTableColumnEntityResponse';
  data?: Maybe<FeatTableColumnEntity>;
};

export type FeatTableColumnEntityResponseCollection = {
  __typename?: 'FeatTableColumnEntityResponseCollection';
  data: Array<FeatTableColumnEntity>;
  meta: ResponseCollectionMeta;
};

export type FeatTableColumnFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<FeatTableColumnFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  featTableHeader?: InputMaybe<
    ComponentV2ProductFeatureTableHeaderFiltersInput
  >;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<FeatTableColumnFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<FeatTableColumnFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  sections?: InputMaybe<FeatTableSectionFiltersInput>;
  tier?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type FeatTableColumnInput = {
  featTableHeader?: InputMaybe<ComponentV2ProductFeatureTableHeaderInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  sections?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tier?: InputMaybe<Enum_Feattablecolumn_Tier>;
};

export type FeatTableColumnRelationResponseCollection = {
  __typename?: 'FeatTableColumnRelationResponseCollection';
  data: Array<FeatTableColumnEntity>;
};

export type FeatTableItem = {
  __typename?: 'FeatTableItem';
  checkbox?: Maybe<Scalars['Boolean']['output']>;
  columnText?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  productFeature?: Maybe<ProductFeatureEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FeatTableItemEntity = {
  __typename?: 'FeatTableItemEntity';
  attributes?: Maybe<FeatTableItem>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FeatTableItemEntityResponse = {
  __typename?: 'FeatTableItemEntityResponse';
  data?: Maybe<FeatTableItemEntity>;
};

export type FeatTableItemEntityResponseCollection = {
  __typename?: 'FeatTableItemEntityResponseCollection';
  data: Array<FeatTableItemEntity>;
  meta: ResponseCollectionMeta;
};

export type FeatTableItemFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<FeatTableItemFiltersInput>>>;
  checkbox?: InputMaybe<BooleanFilterInput>;
  columnText?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<FeatTableItemFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<FeatTableItemFiltersInput>>>;
  productFeature?: InputMaybe<ProductFeatureFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type FeatTableItemInput = {
  checkbox?: InputMaybe<Scalars['Boolean']['input']>;
  columnText?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  productFeature?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FeatTableItemRelationResponseCollection = {
  __typename?: 'FeatTableItemRelationResponseCollection';
  data: Array<FeatTableItemEntity>;
};

export type FeatTableSection = {
  __typename?: 'FeatTableSection';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  headerText: Scalars['String']['output'];
  items?: Maybe<FeatTableItemRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FeatTableSectionItemsArgs = {
  filters?: InputMaybe<FeatTableItemFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type FeatTableSectionEntity = {
  __typename?: 'FeatTableSectionEntity';
  attributes?: Maybe<FeatTableSection>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FeatTableSectionEntityResponse = {
  __typename?: 'FeatTableSectionEntityResponse';
  data?: Maybe<FeatTableSectionEntity>;
};

export type FeatTableSectionEntityResponseCollection = {
  __typename?: 'FeatTableSectionEntityResponseCollection';
  data: Array<FeatTableSectionEntity>;
  meta: ResponseCollectionMeta;
};

export type FeatTableSectionFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<FeatTableSectionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  headerText?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  items?: InputMaybe<FeatTableItemFiltersInput>;
  not?: InputMaybe<FeatTableSectionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<FeatTableSectionFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type FeatTableSectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  headerText?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FeatTableSectionRelationResponseCollection = {
  __typename?: 'FeatTableSectionRelationResponseCollection';
  data: Array<FeatTableSectionEntity>;
};

export type FileInfoInput = {
  alternativeText?: InputMaybe<Scalars['String']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FloatFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  contains?: InputMaybe<Scalars['Float']['input']>;
  containsi?: InputMaybe<Scalars['Float']['input']>;
  endsWith?: InputMaybe<Scalars['Float']['input']>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  eqi?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  ne?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<FloatFilterInput>;
  notContains?: InputMaybe<Scalars['Float']['input']>;
  notContainsi?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  startsWith?: InputMaybe<Scalars['Float']['input']>;
};

export type Footer = {
  __typename?: 'Footer';
  bottomLinks?: Maybe<Array<Maybe<ComponentFooterLink>>>;
  columns: Array<Maybe<ComponentFooterColumns>>;
  copyrightText: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  logo: UploadFileEntityResponse;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  showLanguageBar: Scalars['Boolean']['output'];
  slogan: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FooterBottomLinksArgs = {
  filters?: InputMaybe<ComponentFooterLinkFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type FooterColumnsArgs = {
  filters?: InputMaybe<ComponentFooterColumnsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type FooterEntity = {
  __typename?: 'FooterEntity';
  attributes?: Maybe<Footer>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FooterEntityResponse = {
  __typename?: 'FooterEntityResponse';
  data?: Maybe<FooterEntity>;
};

export type FooterInput = {
  bottomLinks?: InputMaybe<Array<InputMaybe<ComponentFooterLinkInput>>>;
  columns?: InputMaybe<Array<InputMaybe<ComponentFooterColumnsInput>>>;
  copyrightText?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  showLanguageBar?: InputMaybe<Scalars['Boolean']['input']>;
  slogan?: InputMaybe<Scalars['String']['input']>;
};

export type GenericMorph =
  | AuxPage
  | ComponentCommonActionButton
  | ComponentExplainerScreenContinueButton
  | ComponentExplainerScreenSection
  | ComponentFooterColumns
  | ComponentFooterLink
  | ComponentMarketingComponentsAsFeaturedIn
  | ComponentMarketingComponentsHero
  | ComponentMarketingComponentsMarketingPageSection
  | ComponentMarketingComponentsSectionTail
  | ComponentMarketingComponentsStatsBarStat
  | ComponentMetadataGeneralPageMetadata
  | ComponentOnboardingV5ActionButton
  | ComponentOnboardingV5CarouselItem
  | ComponentOnboardingV5CompletionStep
  | ComponentOnboardingV5GroupSelectorStep
  | ComponentOnboardingV5OnboardingStep
  | ComponentOnboardingV5RadioOption
  | ComponentOnboardingV5SkipButton
  | ComponentOnboardingV5TagSelectorStep
  | ComponentOnboardingV5UserSelectorStep
  | ComponentOnboardingV5VerifyEmailStep
  | ComponentProductFooter
  | ComponentProductHero
  | ComponentProductOther
  | ComponentProductSection
  | ComponentV2ProductActionButton
  | ComponentV2ProductBasicExplainer
  | ComponentV2ProductClosingCta
  | ComponentV2ProductFeatureHighlight
  | ComponentV2ProductFeatureShowcase
  | ComponentV2ProductFeatureShowcaseItem
  | ComponentV2ProductFeatureTable
  | ComponentV2ProductFeatureTableHeader
  | ComponentV2ProductHero
  | ComponentV2ProductPerk
  | ComponentV2ProductPricingCards
  | ExplainerScreenMobile
  | ExplainerScreenWeb
  | FeatTableColumn
  | FeatTableItem
  | FeatTableSection
  | Footer
  | Homepage
  | I18NLocale
  | OnboardingV5Version
  | ProductFeature
  | ProductPage
  | ProductPlan
  | TopbarAlert
  | TwitterSyncTweetText
  | UpgradePage
  | UploadFile
  | UploadFolder
  | UsersPermissionsPermission
  | UsersPermissionsRole
  | UsersPermissionsUser
  | V2ProductPage
  | ValuePropCard;

export type Homepage = {
  __typename?: 'Homepage';
  asFeaturedIn?: Maybe<Array<Maybe<ComponentMarketingComponentsAsFeaturedIn>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  hero?: Maybe<ComponentMarketingComponentsHero>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  sectionTail?: Maybe<ComponentMarketingComponentsSectionTail>;
  sections?: Maybe<
    Array<Maybe<ComponentMarketingComponentsMarketingPageSection>>
  >;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type HomepageAsFeaturedInArgs = {
  filters?: InputMaybe<ComponentMarketingComponentsAsFeaturedInFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type HomepageSectionsArgs = {
  filters?: InputMaybe<
    ComponentMarketingComponentsMarketingPageSectionFiltersInput
  >;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type HomepageEntity = {
  __typename?: 'HomepageEntity';
  attributes?: Maybe<Homepage>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type HomepageEntityResponse = {
  __typename?: 'HomepageEntityResponse';
  data?: Maybe<HomepageEntity>;
};

export type HomepageInput = {
  asFeaturedIn?: InputMaybe<
    Array<InputMaybe<ComponentMarketingComponentsAsFeaturedInInput>>
  >;
  hero?: InputMaybe<ComponentMarketingComponentsHeroInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  sectionTail?: InputMaybe<ComponentMarketingComponentsSectionTailInput>;
  sections?: InputMaybe<
    Array<InputMaybe<ComponentMarketingComponentsMarketingPageSectionInput>>
  >;
};

export type I18NLocale = {
  __typename?: 'I18NLocale';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type I18NLocaleEntity = {
  __typename?: 'I18NLocaleEntity';
  attributes?: Maybe<I18NLocale>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type I18NLocaleEntityResponse = {
  __typename?: 'I18NLocaleEntityResponse';
  data?: Maybe<I18NLocaleEntity>;
};

export type I18NLocaleEntityResponseCollection = {
  __typename?: 'I18NLocaleEntityResponseCollection';
  data: Array<I18NLocaleEntity>;
  meta: ResponseCollectionMeta;
};

export type I18NLocaleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  code?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<I18NLocaleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IdFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contains?: InputMaybe<Scalars['ID']['input']>;
  containsi?: InputMaybe<Scalars['ID']['input']>;
  endsWith?: InputMaybe<Scalars['ID']['input']>;
  eq?: InputMaybe<Scalars['ID']['input']>;
  eqi?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  gte?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  lte?: InputMaybe<Scalars['ID']['input']>;
  ne?: InputMaybe<Scalars['ID']['input']>;
  not?: InputMaybe<IdFilterInput>;
  notContains?: InputMaybe<Scalars['ID']['input']>;
  notContainsi?: InputMaybe<Scalars['ID']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  startsWith?: InputMaybe<Scalars['ID']['input']>;
};

export type IntFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  contains?: InputMaybe<Scalars['Int']['input']>;
  containsi?: InputMaybe<Scalars['Int']['input']>;
  endsWith?: InputMaybe<Scalars['Int']['input']>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  eqi?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<IntFilterInput>;
  notContains?: InputMaybe<Scalars['Int']['input']>;
  notContainsi?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  startsWith?: InputMaybe<Scalars['Int']['input']>;
};

export type JsonFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  contains?: InputMaybe<Scalars['JSON']['input']>;
  containsi?: InputMaybe<Scalars['JSON']['input']>;
  endsWith?: InputMaybe<Scalars['JSON']['input']>;
  eq?: InputMaybe<Scalars['JSON']['input']>;
  eqi?: InputMaybe<Scalars['JSON']['input']>;
  gt?: InputMaybe<Scalars['JSON']['input']>;
  gte?: InputMaybe<Scalars['JSON']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  lt?: InputMaybe<Scalars['JSON']['input']>;
  lte?: InputMaybe<Scalars['JSON']['input']>;
  ne?: InputMaybe<Scalars['JSON']['input']>;
  not?: InputMaybe<JsonFilterInput>;
  notContains?: InputMaybe<Scalars['JSON']['input']>;
  notContainsi?: InputMaybe<Scalars['JSON']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  startsWith?: InputMaybe<Scalars['JSON']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Change user password. Confirm with the current password. */
  changePassword?: Maybe<UsersPermissionsLoginPayload>;
  createAuxPage?: Maybe<AuxPageEntityResponse>;
  createExplainerScreenMobile?: Maybe<ExplainerScreenMobileEntityResponse>;
  createExplainerScreenWeb?: Maybe<ExplainerScreenWebEntityResponse>;
  createFeatTableColumn?: Maybe<FeatTableColumnEntityResponse>;
  createFeatTableItem?: Maybe<FeatTableItemEntityResponse>;
  createFeatTableSection?: Maybe<FeatTableSectionEntityResponse>;
  createOnboardingV5Version?: Maybe<OnboardingV5VersionEntityResponse>;
  createProductFeature?: Maybe<ProductFeatureEntityResponse>;
  createProductPage?: Maybe<ProductPageEntityResponse>;
  createProductPlan?: Maybe<ProductPlanEntityResponse>;
  createUpgradePage?: Maybe<UpgradePageEntityResponse>;
  createUpgradePageLocalization?: Maybe<UpgradePageEntityResponse>;
  createUploadFile?: Maybe<UploadFileEntityResponse>;
  createUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  createV2ProductPage?: Maybe<V2ProductPageEntityResponse>;
  createValuePropCard?: Maybe<ValuePropCardEntityResponse>;
  createValuePropCardLocalization?: Maybe<ValuePropCardEntityResponse>;
  deleteAuxPage?: Maybe<AuxPageEntityResponse>;
  deleteExplainerScreenMobile?: Maybe<ExplainerScreenMobileEntityResponse>;
  deleteExplainerScreenWeb?: Maybe<ExplainerScreenWebEntityResponse>;
  deleteFeatTableColumn?: Maybe<FeatTableColumnEntityResponse>;
  deleteFeatTableItem?: Maybe<FeatTableItemEntityResponse>;
  deleteFeatTableSection?: Maybe<FeatTableSectionEntityResponse>;
  deleteFooter?: Maybe<FooterEntityResponse>;
  deleteHomepage?: Maybe<HomepageEntityResponse>;
  deleteOnboardingV5Version?: Maybe<OnboardingV5VersionEntityResponse>;
  deleteProductFeature?: Maybe<ProductFeatureEntityResponse>;
  deleteProductPage?: Maybe<ProductPageEntityResponse>;
  deleteProductPlan?: Maybe<ProductPlanEntityResponse>;
  deleteTopbarAlert?: Maybe<TopbarAlertEntityResponse>;
  deleteTwitterSyncTweetText?: Maybe<TwitterSyncTweetTextEntityResponse>;
  deleteUpgradePage?: Maybe<UpgradePageEntityResponse>;
  deleteUploadFile?: Maybe<UploadFileEntityResponse>;
  deleteUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Delete an existing role */
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>;
  /** Delete an existing user */
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteV2ProductPage?: Maybe<V2ProductPageEntityResponse>;
  deleteValuePropCard?: Maybe<ValuePropCardEntityResponse>;
  /** Confirm an email users email address */
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
  /** Request a reset password token */
  forgotPassword?: Maybe<UsersPermissionsPasswordPayload>;
  login: UsersPermissionsLoginPayload;
  multipleUpload: Array<Maybe<UploadFileEntityResponse>>;
  /** Register a user */
  register: UsersPermissionsLoginPayload;
  removeFile?: Maybe<UploadFileEntityResponse>;
  /** Reset user password. Confirm with a code (resetToken from forgotPassword) */
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  updateAuxPage?: Maybe<AuxPageEntityResponse>;
  updateExplainerScreenMobile?: Maybe<ExplainerScreenMobileEntityResponse>;
  updateExplainerScreenWeb?: Maybe<ExplainerScreenWebEntityResponse>;
  updateFeatTableColumn?: Maybe<FeatTableColumnEntityResponse>;
  updateFeatTableItem?: Maybe<FeatTableItemEntityResponse>;
  updateFeatTableSection?: Maybe<FeatTableSectionEntityResponse>;
  updateFileInfo: UploadFileEntityResponse;
  updateFooter?: Maybe<FooterEntityResponse>;
  updateHomepage?: Maybe<HomepageEntityResponse>;
  updateOnboardingV5Version?: Maybe<OnboardingV5VersionEntityResponse>;
  updateProductFeature?: Maybe<ProductFeatureEntityResponse>;
  updateProductPage?: Maybe<ProductPageEntityResponse>;
  updateProductPlan?: Maybe<ProductPlanEntityResponse>;
  updateTopbarAlert?: Maybe<TopbarAlertEntityResponse>;
  updateTwitterSyncTweetText?: Maybe<TwitterSyncTweetTextEntityResponse>;
  updateUpgradePage?: Maybe<UpgradePageEntityResponse>;
  updateUploadFile?: Maybe<UploadFileEntityResponse>;
  updateUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  updateV2ProductPage?: Maybe<V2ProductPageEntityResponse>;
  updateValuePropCard?: Maybe<ValuePropCardEntityResponse>;
  upload: UploadFileEntityResponse;
};

export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};

export type MutationCreateAuxPageArgs = {
  data: AuxPageInput;
};

export type MutationCreateExplainerScreenMobileArgs = {
  data: ExplainerScreenMobileInput;
};

export type MutationCreateExplainerScreenWebArgs = {
  data: ExplainerScreenWebInput;
};

export type MutationCreateFeatTableColumnArgs = {
  data: FeatTableColumnInput;
};

export type MutationCreateFeatTableItemArgs = {
  data: FeatTableItemInput;
};

export type MutationCreateFeatTableSectionArgs = {
  data: FeatTableSectionInput;
};

export type MutationCreateOnboardingV5VersionArgs = {
  data: OnboardingV5VersionInput;
};

export type MutationCreateProductFeatureArgs = {
  data: ProductFeatureInput;
};

export type MutationCreateProductPageArgs = {
  data: ProductPageInput;
};

export type MutationCreateProductPlanArgs = {
  data: ProductPlanInput;
};

export type MutationCreateUpgradePageArgs = {
  data: UpgradePageInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};

export type MutationCreateUpgradePageLocalizationArgs = {
  data?: InputMaybe<UpgradePageInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};

export type MutationCreateUploadFileArgs = {
  data: UploadFileInput;
};

export type MutationCreateUploadFolderArgs = {
  data: UploadFolderInput;
};

export type MutationCreateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
};

export type MutationCreateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
};

export type MutationCreateV2ProductPageArgs = {
  data: V2ProductPageInput;
};

export type MutationCreateValuePropCardArgs = {
  data: ValuePropCardInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};

export type MutationCreateValuePropCardLocalizationArgs = {
  data?: InputMaybe<ValuePropCardInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};

export type MutationDeleteAuxPageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteExplainerScreenMobileArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteExplainerScreenWebArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteFeatTableColumnArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteFeatTableItemArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteFeatTableSectionArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteOnboardingV5VersionArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteProductFeatureArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteProductPageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteProductPlanArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteUpgradePageArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};

export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteUploadFolderArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteUsersPermissionsRoleArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteUsersPermissionsUserArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteV2ProductPageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteValuePropCardArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};

export type MutationEmailConfirmationArgs = {
  confirmation: Scalars['String']['input'];
};

export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};

export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput;
};

export type MutationMultipleUploadArgs = {
  field?: InputMaybe<Scalars['String']['input']>;
  files: Array<InputMaybe<Scalars['Upload']['input']>>;
  ref?: InputMaybe<Scalars['String']['input']>;
  refId?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};

export type MutationRemoveFileArgs = {
  id: Scalars['ID']['input'];
};

export type MutationResetPasswordArgs = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};

export type MutationUpdateAuxPageArgs = {
  data: AuxPageInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateExplainerScreenMobileArgs = {
  data: ExplainerScreenMobileInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateExplainerScreenWebArgs = {
  data: ExplainerScreenWebInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateFeatTableColumnArgs = {
  data: FeatTableColumnInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateFeatTableItemArgs = {
  data: FeatTableItemInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateFeatTableSectionArgs = {
  data: FeatTableSectionInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateFileInfoArgs = {
  id: Scalars['ID']['input'];
  info?: InputMaybe<FileInfoInput>;
};

export type MutationUpdateFooterArgs = {
  data: FooterInput;
};

export type MutationUpdateHomepageArgs = {
  data: HomepageInput;
};

export type MutationUpdateOnboardingV5VersionArgs = {
  data: OnboardingV5VersionInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateProductFeatureArgs = {
  data: ProductFeatureInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateProductPageArgs = {
  data: ProductPageInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateProductPlanArgs = {
  data: ProductPlanInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateTopbarAlertArgs = {
  data: TopbarAlertInput;
};

export type MutationUpdateTwitterSyncTweetTextArgs = {
  data: TwitterSyncTweetTextInput;
};

export type MutationUpdateUpgradePageArgs = {
  data: UpgradePageInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};

export type MutationUpdateUploadFileArgs = {
  data: UploadFileInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateUploadFolderArgs = {
  data: UploadFolderInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateV2ProductPageArgs = {
  data: V2ProductPageInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateValuePropCardArgs = {
  data: ValuePropCardInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};

export type MutationUploadArgs = {
  field?: InputMaybe<Scalars['String']['input']>;
  file: Scalars['Upload']['input'];
  info?: InputMaybe<FileInfoInput>;
  ref?: InputMaybe<Scalars['String']['input']>;
  refId?: InputMaybe<Scalars['ID']['input']>;
};

export type OnboardingV5Version = {
  __typename?: 'OnboardingV5Version';
  completionStep: ComponentOnboardingV5CompletionStep;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  steps: Array<Maybe<OnboardingV5VersionStepsDynamicZone>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OnboardingV5VersionEntity = {
  __typename?: 'OnboardingV5VersionEntity';
  attributes?: Maybe<OnboardingV5Version>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type OnboardingV5VersionEntityResponse = {
  __typename?: 'OnboardingV5VersionEntityResponse';
  data?: Maybe<OnboardingV5VersionEntity>;
};

export type OnboardingV5VersionEntityResponseCollection = {
  __typename?: 'OnboardingV5VersionEntityResponseCollection';
  data: Array<OnboardingV5VersionEntity>;
  meta: ResponseCollectionMeta;
};

export type OnboardingV5VersionFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<OnboardingV5VersionFiltersInput>>>;
  completionStep?: InputMaybe<ComponentOnboardingV5CompletionStepFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<OnboardingV5VersionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<OnboardingV5VersionFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type OnboardingV5VersionInput = {
  completionStep?: InputMaybe<ComponentOnboardingV5CompletionStepInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  steps?: InputMaybe<
    Array<Scalars['OnboardingV5VersionStepsDynamicZoneInput']['input']>
  >;
};

export type OnboardingV5VersionStepsDynamicZone =
  | ComponentOnboardingV5OnboardingStep
  | Error;

export type Pagination = {
  __typename?: 'Pagination';
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginationArg = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductFeature = {
  __typename?: 'ProductFeature';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  explainerText?: Maybe<Scalars['String']['output']>;
  featureName: Scalars['String']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProductFeatureEntity = {
  __typename?: 'ProductFeatureEntity';
  attributes?: Maybe<ProductFeature>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ProductFeatureEntityResponse = {
  __typename?: 'ProductFeatureEntityResponse';
  data?: Maybe<ProductFeatureEntity>;
};

export type ProductFeatureEntityResponseCollection = {
  __typename?: 'ProductFeatureEntityResponseCollection';
  data: Array<ProductFeatureEntity>;
  meta: ResponseCollectionMeta;
};

export type ProductFeatureFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ProductFeatureFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  explainerText?: InputMaybe<StringFilterInput>;
  featureName?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<ProductFeatureFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ProductFeatureFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ProductFeatureInput = {
  explainerText?: InputMaybe<Scalars['String']['input']>;
  featureName?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ProductPage = {
  __typename?: 'ProductPage';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  footer?: Maybe<ComponentProductFooter>;
  hero: ComponentProductHero;
  metadata?: Maybe<ComponentMetadataGeneralPageMetadata>;
  other?: Maybe<ComponentProductOther>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  sections: Array<Maybe<ComponentProductSection>>;
  slug: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProductPageSectionsArgs = {
  filters?: InputMaybe<ComponentProductSectionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ProductPageEntity = {
  __typename?: 'ProductPageEntity';
  attributes?: Maybe<ProductPage>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ProductPageEntityResponse = {
  __typename?: 'ProductPageEntityResponse';
  data?: Maybe<ProductPageEntity>;
};

export type ProductPageEntityResponseCollection = {
  __typename?: 'ProductPageEntityResponseCollection';
  data: Array<ProductPageEntity>;
  meta: ResponseCollectionMeta;
};

export type ProductPageFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ProductPageFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  footer?: InputMaybe<ComponentProductFooterFiltersInput>;
  hero?: InputMaybe<ComponentProductHeroFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  metadata?: InputMaybe<ComponentMetadataGeneralPageMetadataFiltersInput>;
  not?: InputMaybe<ProductPageFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ProductPageFiltersInput>>>;
  other?: InputMaybe<ComponentProductOtherFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  sections?: InputMaybe<ComponentProductSectionFiltersInput>;
  slug?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ProductPageInput = {
  footer?: InputMaybe<ComponentProductFooterInput>;
  hero?: InputMaybe<ComponentProductHeroInput>;
  metadata?: InputMaybe<ComponentMetadataGeneralPageMetadataInput>;
  other?: InputMaybe<ComponentProductOtherInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  sections?: InputMaybe<Array<InputMaybe<ComponentProductSectionInput>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type ProductPlan = {
  __typename?: 'ProductPlan';
  button: ComponentV2ProductActionButton;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  mostPopular?: Maybe<Scalars['Boolean']['output']>;
  perks?: Maybe<Array<Maybe<ComponentV2ProductPerk>>>;
  perksTitle: Scalars['String']['output'];
  priceStartingAt?: Maybe<Scalars['Boolean']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  subtitle: Scalars['String']['output'];
  tier: Enum_Productplan_Tier;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProductPlanPerksArgs = {
  filters?: InputMaybe<ComponentV2ProductPerkFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ProductPlanEntity = {
  __typename?: 'ProductPlanEntity';
  attributes?: Maybe<ProductPlan>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ProductPlanEntityResponse = {
  __typename?: 'ProductPlanEntityResponse';
  data?: Maybe<ProductPlanEntity>;
};

export type ProductPlanEntityResponseCollection = {
  __typename?: 'ProductPlanEntityResponseCollection';
  data: Array<ProductPlanEntity>;
  meta: ResponseCollectionMeta;
};

export type ProductPlanFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ProductPlanFiltersInput>>>;
  button?: InputMaybe<ComponentV2ProductActionButtonFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  mostPopular?: InputMaybe<BooleanFilterInput>;
  not?: InputMaybe<ProductPlanFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ProductPlanFiltersInput>>>;
  perks?: InputMaybe<ComponentV2ProductPerkFiltersInput>;
  perksTitle?: InputMaybe<StringFilterInput>;
  priceStartingAt?: InputMaybe<BooleanFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  subtitle?: InputMaybe<StringFilterInput>;
  tier?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ProductPlanInput = {
  button?: InputMaybe<ComponentV2ProductActionButtonInput>;
  mostPopular?: InputMaybe<Scalars['Boolean']['input']>;
  perks?: InputMaybe<Array<InputMaybe<ComponentV2ProductPerkInput>>>;
  perksTitle?: InputMaybe<Scalars['String']['input']>;
  priceStartingAt?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  tier?: InputMaybe<Enum_Productplan_Tier>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ProductPlanRelationResponseCollection = {
  __typename?: 'ProductPlanRelationResponseCollection';
  data: Array<ProductPlanEntity>;
};

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW',
}

export type Query = {
  __typename?: 'Query';
  auxPage?: Maybe<AuxPageEntityResponse>;
  auxPages?: Maybe<AuxPageEntityResponseCollection>;
  explainerScreenMobile?: Maybe<ExplainerScreenMobileEntityResponse>;
  explainerScreenWeb?: Maybe<ExplainerScreenWebEntityResponse>;
  explainerScreensMobile?: Maybe<ExplainerScreenMobileEntityResponseCollection>;
  explainerScreensWeb?: Maybe<ExplainerScreenWebEntityResponseCollection>;
  featTableColumn?: Maybe<FeatTableColumnEntityResponse>;
  featTableColumns?: Maybe<FeatTableColumnEntityResponseCollection>;
  featTableItem?: Maybe<FeatTableItemEntityResponse>;
  featTableItems?: Maybe<FeatTableItemEntityResponseCollection>;
  featTableSection?: Maybe<FeatTableSectionEntityResponse>;
  featTableSections?: Maybe<FeatTableSectionEntityResponseCollection>;
  footer?: Maybe<FooterEntityResponse>;
  homepage?: Maybe<HomepageEntityResponse>;
  i18NLocale?: Maybe<I18NLocaleEntityResponse>;
  i18NLocales?: Maybe<I18NLocaleEntityResponseCollection>;
  me?: Maybe<UsersPermissionsMe>;
  onboardingV5Version?: Maybe<OnboardingV5VersionEntityResponse>;
  onboardingV5Versions?: Maybe<OnboardingV5VersionEntityResponseCollection>;
  productFeature?: Maybe<ProductFeatureEntityResponse>;
  productFeatures?: Maybe<ProductFeatureEntityResponseCollection>;
  productPage?: Maybe<ProductPageEntityResponse>;
  productPages?: Maybe<ProductPageEntityResponseCollection>;
  productPlan?: Maybe<ProductPlanEntityResponse>;
  productPlans?: Maybe<ProductPlanEntityResponseCollection>;
  topbarAlert?: Maybe<TopbarAlertEntityResponse>;
  twitterSyncTweetText?: Maybe<TwitterSyncTweetTextEntityResponse>;
  upgradePage?: Maybe<UpgradePageEntityResponse>;
  upgradePages?: Maybe<UpgradePageEntityResponseCollection>;
  uploadFile?: Maybe<UploadFileEntityResponse>;
  uploadFiles?: Maybe<UploadFileEntityResponseCollection>;
  uploadFolder?: Maybe<UploadFolderEntityResponse>;
  uploadFolders?: Maybe<UploadFolderEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>;
  usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>;
  usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>;
  v2ProductPage?: Maybe<V2ProductPageEntityResponse>;
  v2ProductPages?: Maybe<V2ProductPageEntityResponseCollection>;
  valuePropCard?: Maybe<ValuePropCardEntityResponse>;
  valuePropCards?: Maybe<ValuePropCardEntityResponseCollection>;
};

export type QueryAuxPageArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryAuxPagesArgs = {
  filters?: InputMaybe<AuxPageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryExplainerScreenMobileArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryExplainerScreenWebArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryExplainerScreensMobileArgs = {
  filters?: InputMaybe<ExplainerScreenMobileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryExplainerScreensWebArgs = {
  filters?: InputMaybe<ExplainerScreenWebFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryFeatTableColumnArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryFeatTableColumnsArgs = {
  filters?: InputMaybe<FeatTableColumnFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryFeatTableItemArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryFeatTableItemsArgs = {
  filters?: InputMaybe<FeatTableItemFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryFeatTableSectionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryFeatTableSectionsArgs = {
  filters?: InputMaybe<FeatTableSectionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryFooterArgs = {
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryHomepageArgs = {
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryI18NLocaleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryI18NLocalesArgs = {
  filters?: InputMaybe<I18NLocaleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryOnboardingV5VersionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryOnboardingV5VersionsArgs = {
  filters?: InputMaybe<OnboardingV5VersionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryProductFeatureArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryProductFeaturesArgs = {
  filters?: InputMaybe<ProductFeatureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryProductPageArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryProductPagesArgs = {
  filters?: InputMaybe<ProductPageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryProductPlanArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryProductPlansArgs = {
  filters?: InputMaybe<ProductPlanFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryTopbarAlertArgs = {
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryTwitterSyncTweetTextArgs = {
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryUpgradePageArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};

export type QueryUpgradePagesArgs = {
  filters?: InputMaybe<UpgradePageFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryUploadFileArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryUploadFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryUploadFolderArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryUploadFoldersArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryUsersPermissionsRoleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryUsersPermissionsRolesArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryUsersPermissionsUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryUsersPermissionsUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryV2ProductPageArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryV2ProductPagesArgs = {
  filters?: InputMaybe<V2ProductPageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryValuePropCardArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};

export type QueryValuePropCardsArgs = {
  filters?: InputMaybe<ValuePropCardFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ResponseCollectionMeta = {
  __typename?: 'ResponseCollectionMeta';
  pagination: Pagination;
};

export type StringFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  containsi?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  eqi?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<StringFilterInput>;
  notContains?: InputMaybe<Scalars['String']['input']>;
  notContainsi?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type TopbarAlert = {
  __typename?: 'TopbarAlert';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  enabled: Scalars['Boolean']['output'];
  identifier: Scalars['String']['output'];
  message: Scalars['String']['output'];
  onlyDisplayAfter: Scalars['DateTime']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type TopbarAlertEntity = {
  __typename?: 'TopbarAlertEntity';
  attributes?: Maybe<TopbarAlert>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type TopbarAlertEntityResponse = {
  __typename?: 'TopbarAlertEntityResponse';
  data?: Maybe<TopbarAlertEntity>;
};

export type TopbarAlertInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  onlyDisplayAfter?: InputMaybe<Scalars['DateTime']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type TwitterSyncTweetText = {
  __typename?: 'TwitterSyncTweetText';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  tweetText: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TwitterSyncTweetTextEntity = {
  __typename?: 'TwitterSyncTweetTextEntity';
  attributes?: Maybe<TwitterSyncTweetText>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type TwitterSyncTweetTextEntityResponse = {
  __typename?: 'TwitterSyncTweetTextEntityResponse';
  data?: Maybe<TwitterSyncTweetTextEntity>;
};

export type TwitterSyncTweetTextInput = {
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  tweetText?: InputMaybe<Scalars['String']['input']>;
};

export type UpgradePage = {
  __typename?: 'UpgradePage';
  bulletOrderWithinCard?: Maybe<Scalars['Float']['output']>;
  cardId: Enum_Upgradepage_Cardid;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  displayText: Scalars['String']['output'];
  iconId?: Maybe<Scalars['String']['output']>;
  iconSource?: Maybe<Enum_Upgradepage_Iconsource>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<UpgradePageRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  rowType: Enum_Upgradepage_Rowtype;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UpgradePageLocalizationsArgs = {
  filters?: InputMaybe<UpgradePageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UpgradePageEntity = {
  __typename?: 'UpgradePageEntity';
  attributes?: Maybe<UpgradePage>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UpgradePageEntityResponse = {
  __typename?: 'UpgradePageEntityResponse';
  data?: Maybe<UpgradePageEntity>;
};

export type UpgradePageEntityResponseCollection = {
  __typename?: 'UpgradePageEntityResponseCollection';
  data: Array<UpgradePageEntity>;
  meta: ResponseCollectionMeta;
};

export type UpgradePageFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UpgradePageFiltersInput>>>;
  bulletOrderWithinCard?: InputMaybe<FloatFilterInput>;
  cardId?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  displayText?: InputMaybe<StringFilterInput>;
  iconId?: InputMaybe<StringFilterInput>;
  iconSource?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<UpgradePageFiltersInput>;
  not?: InputMaybe<UpgradePageFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UpgradePageFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  rowType?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UpgradePageInput = {
  bulletOrderWithinCard?: InputMaybe<Scalars['Float']['input']>;
  cardId?: InputMaybe<Enum_Upgradepage_Cardid>;
  displayText?: InputMaybe<Scalars['String']['input']>;
  iconId?: InputMaybe<Scalars['String']['input']>;
  iconSource?: InputMaybe<Enum_Upgradepage_Iconsource>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  rowType?: InputMaybe<Enum_Upgradepage_Rowtype>;
};

export type UpgradePageRelationResponseCollection = {
  __typename?: 'UpgradePageRelationResponseCollection';
  data: Array<UpgradePageEntity>;
};

export type UploadFile = {
  __typename?: 'UploadFile';
  alternativeText?: Maybe<Scalars['String']['output']>;
  caption?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  ext?: Maybe<Scalars['String']['output']>;
  formats?: Maybe<Scalars['JSON']['output']>;
  hash: Scalars['String']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  mime: Scalars['String']['output'];
  name: Scalars['String']['output'];
  previewUrl?: Maybe<Scalars['String']['output']>;
  provider: Scalars['String']['output'];
  provider_metadata?: Maybe<Scalars['JSON']['output']>;
  related?: Maybe<Array<Maybe<GenericMorph>>>;
  size: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type UploadFileEntity = {
  __typename?: 'UploadFileEntity';
  attributes?: Maybe<UploadFile>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UploadFileEntityResponse = {
  __typename?: 'UploadFileEntityResponse';
  data?: Maybe<UploadFileEntity>;
};

export type UploadFileEntityResponseCollection = {
  __typename?: 'UploadFileEntityResponseCollection';
  data: Array<UploadFileEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFileFiltersInput = {
  alternativeText?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  caption?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  ext?: InputMaybe<StringFilterInput>;
  folder?: InputMaybe<UploadFolderFiltersInput>;
  folderPath?: InputMaybe<StringFilterInput>;
  formats?: InputMaybe<JsonFilterInput>;
  hash?: InputMaybe<StringFilterInput>;
  height?: InputMaybe<IntFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  mime?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFileFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  previewUrl?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  provider_metadata?: InputMaybe<JsonFilterInput>;
  size?: InputMaybe<FloatFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  url?: InputMaybe<StringFilterInput>;
  width?: InputMaybe<IntFilterInput>;
};

export type UploadFileInput = {
  alternativeText?: InputMaybe<Scalars['String']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  ext?: InputMaybe<Scalars['String']['input']>;
  folder?: InputMaybe<Scalars['ID']['input']>;
  folderPath?: InputMaybe<Scalars['String']['input']>;
  formats?: InputMaybe<Scalars['JSON']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  mime?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  previewUrl?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_metadata?: InputMaybe<Scalars['JSON']['input']>;
  size?: InputMaybe<Scalars['Float']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadFileRelationResponseCollection = {
  __typename?: 'UploadFileRelationResponseCollection';
  data: Array<UploadFileEntity>;
};

export type UploadFolder = {
  __typename?: 'UploadFolder';
  children?: Maybe<UploadFolderRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  files?: Maybe<UploadFileRelationResponseCollection>;
  name: Scalars['String']['output'];
  parent?: Maybe<UploadFolderEntityResponse>;
  path: Scalars['String']['output'];
  pathId: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UploadFolderChildrenArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UploadFolderFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UploadFolderEntity = {
  __typename?: 'UploadFolderEntity';
  attributes?: Maybe<UploadFolder>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UploadFolderEntityResponse = {
  __typename?: 'UploadFolderEntityResponse';
  data?: Maybe<UploadFolderEntity>;
};

export type UploadFolderEntityResponseCollection = {
  __typename?: 'UploadFolderEntityResponseCollection';
  data: Array<UploadFolderEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFolderFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  children?: InputMaybe<UploadFolderFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  files?: InputMaybe<UploadFileFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFolderFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  parent?: InputMaybe<UploadFolderFiltersInput>;
  path?: InputMaybe<StringFilterInput>;
  pathId?: InputMaybe<IntFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UploadFolderInput = {
  children?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  files?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  pathId?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadFolderRelationResponseCollection = {
  __typename?: 'UploadFolderRelationResponseCollection';
  data: Array<UploadFolderEntity>;
};

export type UsersPermissionsCreateRolePayload = {
  __typename?: 'UsersPermissionsCreateRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsDeleteRolePayload = {
  __typename?: 'UsersPermissionsDeleteRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String']['input'];
  password: Scalars['String']['input'];
  provider?: Scalars['String']['input'];
};

export type UsersPermissionsLoginPayload = {
  __typename?: 'UsersPermissionsLoginPayload';
  jwt?: Maybe<Scalars['String']['output']>;
  user: UsersPermissionsMe;
};

export type UsersPermissionsMe = {
  __typename?: 'UsersPermissionsMe';
  blocked?: Maybe<Scalars['Boolean']['output']>;
  confirmed?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  role?: Maybe<UsersPermissionsMeRole>;
  username: Scalars['String']['output'];
};

export type UsersPermissionsMeRole = {
  __typename?: 'UsersPermissionsMeRole';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type UsersPermissionsPasswordPayload = {
  __typename?: 'UsersPermissionsPasswordPayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsPermission = {
  __typename?: 'UsersPermissionsPermission';
  action: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UsersPermissionsPermissionEntity = {
  __typename?: 'UsersPermissionsPermissionEntity';
  attributes?: Maybe<UsersPermissionsPermission>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsPermissionFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UsersPermissionsPermissionRelationResponseCollection = {
  __typename?: 'UsersPermissionsPermissionRelationResponseCollection';
  data: Array<UsersPermissionsPermissionEntity>;
};

export type UsersPermissionsRegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type UsersPermissionsRole = {
  __typename?: 'UsersPermissionsRole';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  permissions?: Maybe<UsersPermissionsPermissionRelationResponseCollection>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  users?: Maybe<UsersPermissionsUserRelationResponseCollection>;
};

export type UsersPermissionsRolePermissionsArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UsersPermissionsRoleUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UsersPermissionsRoleEntity = {
  __typename?: 'UsersPermissionsRoleEntity';
  attributes?: Maybe<UsersPermissionsRole>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsRoleEntityResponse = {
  __typename?: 'UsersPermissionsRoleEntityResponse';
  data?: Maybe<UsersPermissionsRoleEntity>;
};

export type UsersPermissionsRoleEntityResponseCollection = {
  __typename?: 'UsersPermissionsRoleEntityResponseCollection';
  data: Array<UsersPermissionsRoleEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsRoleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  permissions?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  type?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  users?: InputMaybe<UsersPermissionsUserFiltersInput>;
};

export type UsersPermissionsRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type UsersPermissionsUpdateRolePayload = {
  __typename?: 'UsersPermissionsUpdateRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsUser = {
  __typename?: 'UsersPermissionsUser';
  blocked?: Maybe<Scalars['Boolean']['output']>;
  confirmed?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username: Scalars['String']['output'];
};

export type UsersPermissionsUserEntity = {
  __typename?: 'UsersPermissionsUserEntity';
  attributes?: Maybe<UsersPermissionsUser>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsUserEntityResponse = {
  __typename?: 'UsersPermissionsUserEntityResponse';
  data?: Maybe<UsersPermissionsUserEntity>;
};

export type UsersPermissionsUserEntityResponseCollection = {
  __typename?: 'UsersPermissionsUserEntityResponseCollection';
  data: Array<UsersPermissionsUserEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsUserFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  blocked?: InputMaybe<BooleanFilterInput>;
  confirmationToken?: InputMaybe<StringFilterInput>;
  confirmed?: InputMaybe<BooleanFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsUserFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  password?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  resetPasswordToken?: InputMaybe<StringFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UsersPermissionsUserInput = {
  blocked?: InputMaybe<Scalars['Boolean']['input']>;
  confirmationToken?: InputMaybe<Scalars['String']['input']>;
  confirmed?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  resetPasswordToken?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UsersPermissionsUserRelationResponseCollection = {
  __typename?: 'UsersPermissionsUserRelationResponseCollection';
  data: Array<UsersPermissionsUserEntity>;
};

export type V2ProductPage = {
  __typename?: 'V2ProductPage';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  metadata?: Maybe<ComponentMetadataGeneralPageMetadata>;
  productPage?: Maybe<Array<Maybe<V2ProductPageProductPageDynamicZone>>>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type V2ProductPageEntity = {
  __typename?: 'V2ProductPageEntity';
  attributes?: Maybe<V2ProductPage>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type V2ProductPageEntityResponse = {
  __typename?: 'V2ProductPageEntityResponse';
  data?: Maybe<V2ProductPageEntity>;
};

export type V2ProductPageEntityResponseCollection = {
  __typename?: 'V2ProductPageEntityResponseCollection';
  data: Array<V2ProductPageEntity>;
  meta: ResponseCollectionMeta;
};

export type V2ProductPageFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<V2ProductPageFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  metadata?: InputMaybe<ComponentMetadataGeneralPageMetadataFiltersInput>;
  not?: InputMaybe<V2ProductPageFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<V2ProductPageFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type V2ProductPageInput = {
  metadata?: InputMaybe<ComponentMetadataGeneralPageMetadataInput>;
  productPage?: InputMaybe<
    Array<Scalars['V2ProductPageProductPageDynamicZoneInput']['input']>
  >;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type V2ProductPageProductPageDynamicZone =
  | ComponentV2ProductBasicExplainer
  | ComponentV2ProductClosingCta
  | ComponentV2ProductFeatureHighlight
  | ComponentV2ProductFeatureShowcase
  | ComponentV2ProductFeatureTable
  | ComponentV2ProductHero
  | ComponentV2ProductPricingCards
  | Error;

export type ValuePropCard = {
  __typename?: 'ValuePropCard';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<ValuePropCardRelationResponseCollection>;
  media: UploadFileEntityResponse;
  order?: Maybe<Scalars['Float']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ValuePropCardLocalizationsArgs = {
  filters?: InputMaybe<ValuePropCardFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ValuePropCardEntity = {
  __typename?: 'ValuePropCardEntity';
  attributes?: Maybe<ValuePropCard>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ValuePropCardEntityResponse = {
  __typename?: 'ValuePropCardEntityResponse';
  data?: Maybe<ValuePropCardEntity>;
};

export type ValuePropCardEntityResponseCollection = {
  __typename?: 'ValuePropCardEntityResponseCollection';
  data: Array<ValuePropCardEntity>;
  meta: ResponseCollectionMeta;
};

export type ValuePropCardFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ValuePropCardFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<ValuePropCardFiltersInput>;
  not?: InputMaybe<ValuePropCardFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ValuePropCardFiltersInput>>>;
  order?: InputMaybe<FloatFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ValuePropCardInput = {
  media?: InputMaybe<Scalars['ID']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ValuePropCardRelationResponseCollection = {
  __typename?: 'ValuePropCardRelationResponseCollection';
  data: Array<ValuePropCardEntity>;
};

export type GetV2ProductPageBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;

export type GetV2ProductPageBySlugQuery = {
  __typename?: 'Query';
  v2ProductPages?: {
    __typename?: 'V2ProductPageEntityResponseCollection';
    data: Array<{
      __typename?: 'V2ProductPageEntity';
      attributes?: {
        __typename?: 'V2ProductPage';
        slug: string;
        metadata?: {
          __typename?: 'ComponentMetadataGeneralPageMetadata';
          title?: string | null;
          description?: string | null;
          canonicalUrl?: string | null;
          robots?: string | null;
          author?: string | null;
          ogUrl?: string | null;
          ogType?: string | null;
          ogAuthor?: string | null;
          ogImage?: {
            __typename?: 'UploadFileEntityResponse';
            data?: {
              __typename?: 'UploadFileEntity';
              attributes?: {
                __typename?: 'UploadFile';
                url: string;
                height?: number | null;
                width?: number | null;
              } | null;
            } | null;
          } | null;
        } | null;
        productPage?: Array<
          | {
              __typename: 'ComponentV2ProductBasicExplainer';
              id: string;
              title: string;
              body: string;
              button?: {
                __typename?: 'ComponentV2ProductActionButton';
                text: string;
                dataRef?: string | null;
                solid?: boolean | null;
                rounded?: boolean | null;
                navigationUrl?: string | null;
                action?: Enum_Componentv2Productactionbutton_Action | null;
              } | null;
            }
          | {
              __typename: 'ComponentV2ProductClosingCta';
              id: string;
              title: string;
              body: string;
              borderImage?: {
                __typename?: 'UploadFileEntityResponse';
                data?: {
                  __typename?: 'UploadFileEntity';
                  attributes?: {
                    __typename?: 'UploadFile';
                    url: string;
                    height?: number | null;
                    width?: number | null;
                    alternativeText?: string | null;
                  } | null;
                } | null;
              } | null;
              button?: {
                __typename?: 'ComponentV2ProductActionButton';
                text: string;
                dataRef?: string | null;
                solid?: boolean | null;
                rounded?: boolean | null;
                navigationUrl?: string | null;
                action?: Enum_Componentv2Productactionbutton_Action | null;
              } | null;
            }
          | {
              __typename: 'ComponentV2ProductFeatureHighlight';
              id: string;
              backgroundColor: string;
              colorScheme: Enum_Componentv2Productfeaturehighlight_Colorscheme;
              title: string;
              body: string;
              alignImage: Enum_Componentv2Productfeaturehighlight_Alignimage;
              image: {
                __typename?: 'UploadFileEntityResponse';
                data?: {
                  __typename?: 'UploadFileEntity';
                  attributes?: {
                    __typename?: 'UploadFile';
                    url: string;
                    height?: number | null;
                    width?: number | null;
                    alternativeText?: string | null;
                  } | null;
                } | null;
              };
              button?: {
                __typename?: 'ComponentV2ProductActionButton';
                text: string;
                dataRef?: string | null;
                solid?: boolean | null;
                rounded?: boolean | null;
                navigationUrl?: string | null;
                action?: Enum_Componentv2Productactionbutton_Action | null;
              } | null;
            }
          | {
              __typename: 'ComponentV2ProductFeatureShowcase';
              id: string;
              items: Array<{
                __typename?: 'ComponentV2ProductFeatureShowcaseItem';
                title: string;
                body: string;
                image: {
                  __typename?: 'UploadFileEntityResponse';
                  data?: {
                    __typename?: 'UploadFileEntity';
                    attributes?: {
                      __typename?: 'UploadFile';
                      url: string;
                      height?: number | null;
                      width?: number | null;
                      alternativeText?: string | null;
                    } | null;
                  } | null;
                };
              } | null>;
            }
          | {
              __typename: 'ComponentV2ProductFeatureTable';
              id: string;
              title: string;
              subtitle: string;
              columns?: {
                __typename?: 'FeatTableColumnRelationResponseCollection';
                data: Array<{
                  __typename?: 'FeatTableColumnEntity';
                  attributes?: {
                    __typename?: 'FeatTableColumn';
                    tier?: Enum_Feattablecolumn_Tier | null;
                    featTableHeader?: {
                      __typename?: 'ComponentV2ProductFeatureTableHeader';
                      title: string;
                      button: {
                        __typename?: 'ComponentV2ProductActionButton';
                        text: string;
                        dataRef?: string | null;
                        solid?: boolean | null;
                        rounded?: boolean | null;
                        navigationUrl?: string | null;
                        action?: Enum_Componentv2Productactionbutton_Action | null;
                      };
                    } | null;
                    sections?: {
                      __typename?: 'FeatTableSectionRelationResponseCollection';
                      data: Array<{
                        __typename?: 'FeatTableSectionEntity';
                        attributes?: {
                          __typename?: 'FeatTableSection';
                          headerText: string;
                          items?: {
                            __typename?: 'FeatTableItemRelationResponseCollection';
                            data: Array<{
                              __typename?: 'FeatTableItemEntity';
                              attributes?: {
                                __typename?: 'FeatTableItem';
                                checkbox?: boolean | null;
                                columnText?: string | null;
                                productFeature?: {
                                  __typename?: 'ProductFeatureEntityResponse';
                                  data?: {
                                    __typename?: 'ProductFeatureEntity';
                                    attributes?: {
                                      __typename?: 'ProductFeature';
                                      featureName: string;
                                      explainerText?: string | null;
                                    } | null;
                                  } | null;
                                } | null;
                              } | null;
                            }>;
                          } | null;
                        } | null;
                      }>;
                    } | null;
                  } | null;
                }>;
              } | null;
            }
          | { __typename: 'ComponentV2ProductHero'; id: string; text: string }
          | {
              __typename: 'ComponentV2ProductPricingCards';
              id: string;
              savingsText: string;
              productPlans?: {
                __typename?: 'ProductPlanRelationResponseCollection';
                data: Array<{
                  __typename?: 'ProductPlanEntity';
                  attributes?: {
                    __typename?: 'ProductPlan';
                    tier: Enum_Productplan_Tier;
                    title?: string | null;
                    subtitle: string;
                    mostPopular?: boolean | null;
                    priceStartingAt?: boolean | null;
                    perksTitle: string;
                    button: {
                      __typename?: 'ComponentV2ProductActionButton';
                      text: string;
                      dataRef?: string | null;
                      solid?: boolean | null;
                      rounded?: boolean | null;
                      navigationUrl?: string | null;
                      action?: Enum_Componentv2Productactionbutton_Action | null;
                    };
                    perks?: Array<{
                      __typename?: 'ComponentV2ProductPerk';
                      text?: string | null;
                    } | null> | null;
                  } | null;
                }>;
              } | null;
            }
          | { __typename: 'Error' }
          | null
        > | null;
      } | null;
    }>;
  } | null;
  footer?: {
    __typename?: 'FooterEntityResponse';
    data?: {
      __typename?: 'FooterEntity';
      attributes?: {
        __typename?: 'Footer';
        showLanguageBar: boolean;
        slogan: string;
        copyrightText: string;
        logo: {
          __typename?: 'UploadFileEntityResponse';
          data?: {
            __typename?: 'UploadFileEntity';
            attributes?: {
              __typename?: 'UploadFile';
              url: string;
              height?: number | null;
              width?: number | null;
              alternativeText?: string | null;
            } | null;
          } | null;
        };
        columns: Array<{
          __typename?: 'ComponentFooterColumns';
          title: string;
          links: Array<{
            __typename?: 'ComponentFooterLink';
            text: string;
            url: string;
            dataRef?: string | null;
          } | null>;
        } | null>;
        bottomLinks?: Array<{
          __typename?: 'ComponentFooterLink';
          text: string;
          url: string;
          dataRef?: string | null;
        } | null> | null;
      } | null;
    } | null;
  } | null;
};

export type GetExplainerScreensQueryVariables = Exact<{ [key: string]: never }>;

export type GetExplainerScreensQuery = {
  __typename?: 'Query';
  explainerScreensWeb?: {
    __typename?: 'ExplainerScreenWebEntityResponseCollection';
    data: Array<{
      __typename?: 'ExplainerScreenWebEntity';
      attributes?: {
        __typename?: 'ExplainerScreenWeb';
        key: string;
        triggerRoute?: string | null;
        title: string;
        subtitle: string;
        section: Array<{
          __typename?: 'ComponentExplainerScreenSection';
          icon: string;
          title: string;
          description: string;
        } | null>;
        continueButton: {
          __typename?: 'ComponentExplainerScreenContinueButton';
          text: string;
          dataRef: string;
        };
      } | null;
    }>;
  } | null;
};

export type GetFooterQueryVariables = Exact<{ [key: string]: never }>;

export type GetFooterQuery = {
  __typename?: 'Query';
  footer?: {
    __typename?: 'FooterEntityResponse';
    data?: {
      __typename?: 'FooterEntity';
      attributes?: {
        __typename?: 'Footer';
        showLanguageBar: boolean;
        slogan: string;
        copyrightText: string;
        logo: {
          __typename?: 'UploadFileEntityResponse';
          data?: {
            __typename?: 'UploadFileEntity';
            attributes?: {
              __typename?: 'UploadFile';
              url: string;
              height?: number | null;
              width?: number | null;
              alternativeText?: string | null;
            } | null;
          } | null;
        };
        columns: Array<{
          __typename?: 'ComponentFooterColumns';
          title: string;
          links: Array<{
            __typename?: 'ComponentFooterLink';
            text: string;
            url: string;
            dataRef?: string | null;
          } | null>;
        } | null>;
        bottomLinks?: Array<{
          __typename?: 'ComponentFooterLink';
          text: string;
          url: string;
          dataRef?: string | null;
        } | null> | null;
      } | null;
    } | null;
  } | null;
};

export type TwitterSyncTweetMessageQueryVariables = Exact<{
  [key: string]: never;
}>;

export type TwitterSyncTweetMessageQuery = {
  __typename?: 'Query';
  twitterSyncTweetText?: {
    __typename?: 'TwitterSyncTweetTextEntityResponse';
    data?: {
      __typename?: 'TwitterSyncTweetTextEntity';
      attributes?: {
        __typename?: 'TwitterSyncTweetText';
        tweetText: string;
      } | null;
    } | null;
  } | null;
};

export type FetchOnboardingV5VersionsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type FetchOnboardingV5VersionsQuery = {
  __typename?: 'Query';
  onboardingV5Versions?: {
    __typename?: 'OnboardingV5VersionEntityResponseCollection';
    data: Array<{
      __typename?: 'OnboardingV5VersionEntity';
      attributes?: {
        __typename?: 'OnboardingV5Version';
        publishedAt?: any | null;
        steps: Array<
          | {
              __typename: 'ComponentOnboardingV5OnboardingStep';
              id: string;
              title: string;
              description: string;
              stepKey: string;
              stepType: Enum_Componentonboardingv5Onboardingstep_Steptype;
              radioSurveyQuestion?: string | null;
              carousel: Array<{
                __typename: 'ComponentOnboardingV5CarouselItem';
                id: string;
                title: string;
                media: {
                  __typename?: 'UploadFileEntityResponse';
                  data?: {
                    __typename?: 'UploadFileEntity';
                    attributes?: {
                      __typename?: 'UploadFile';
                      url: string;
                      height?: number | null;
                      width?: number | null;
                      alternativeText?: string | null;
                      hash: string;
                      mime: string;
                      name: string;
                      provider: string;
                      size: number;
                    } | null;
                  } | null;
                };
              } | null>;
              verifyEmailForm?: {
                __typename: 'ComponentOnboardingV5VerifyEmailStep';
                id: string;
                inputLabel: string;
                inputPlaceholder?: string | null;
                resendCodeText: string;
                resendCodeActionText: string;
                changeEmailActionText: string;
                changeEmailTitle: string;
                changeEmailDescription: string;
                changeEmailInputLabel: string;
                changeEmailInputPlaceholder?: string | null;
                changeEmailActionButton: {
                  __typename: 'ComponentOnboardingV5ActionButton';
                  id: string;
                  text: string;
                  dataRef?: string | null;
                };
              } | null;
              tagSelector?: {
                __typename: 'ComponentOnboardingV5TagSelectorStep';
                id: string;
                customTagInputText: string;
              } | null;
              radioSurvey?: Array<{
                __typename: 'ComponentOnboardingV5RadioOption';
                id: string;
                optionTitle: string;
                optionDescription: string;
                optionKey: string;
              } | null> | null;
              userSelector?: {
                __typename: 'ComponentOnboardingV5UserSelectorStep';
                id: string;
              } | null;
              groupSelector?: {
                __typename: 'ComponentOnboardingV5GroupSelectorStep';
                id: string;
              } | null;
              actionButton?: {
                __typename: 'ComponentOnboardingV5ActionButton';
                id: string;
                text: string;
                dataRef?: string | null;
              } | null;
              skipButton?: {
                __typename: 'ComponentOnboardingV5SkipButton';
                id: string;
                text: string;
                dataRef?: string | null;
              } | null;
            }
          | { __typename: 'Error' }
          | null
        >;
        completionStep: {
          __typename: 'ComponentOnboardingV5CompletionStep';
          id: string;
          message: string;
          media?: {
            __typename?: 'UploadFileEntityResponse';
            data?: {
              __typename?: 'UploadFileEntity';
              attributes?: {
                __typename?: 'UploadFile';
                url: string;
                height?: number | null;
                width?: number | null;
                alternativeText?: string | null;
                hash: string;
                mime: string;
                name: string;
                provider: string;
                size: number;
              } | null;
            } | null;
          } | null;
        };
      } | null;
    }>;
  } | null;
};

export type UpgradePageQueryVariables = Exact<{ [key: string]: never }>;

export type UpgradePageQuery = {
  __typename?: 'Query';
  upgradePages?: {
    __typename?: 'UpgradePageEntityResponseCollection';
    data: Array<{
      __typename?: 'UpgradePageEntity';
      attributes?: {
        __typename?: 'UpgradePage';
        cardId: Enum_Upgradepage_Cardid;
        rowType: Enum_Upgradepage_Rowtype;
        displayText: string;
        iconId?: string | null;
        iconSource?: Enum_Upgradepage_Iconsource | null;
      } | null;
    }>;
  } | null;
};

export type GetValuePropCardsQueryVariables = Exact<{ [key: string]: never }>;

export type GetValuePropCardsQuery = {
  __typename?: 'Query';
  valuePropCards?: {
    __typename?: 'ValuePropCardEntityResponseCollection';
    data: Array<{
      __typename?: 'ValuePropCardEntity';
      id?: string | null;
      attributes?: {
        __typename?: 'ValuePropCard';
        title: string;
        order?: number | null;
        media: {
          __typename?: 'UploadFileEntityResponse';
          data?: {
            __typename?: 'UploadFileEntity';
            attributes?: {
              __typename?: 'UploadFile';
              url: string;
              mime: string;
              alternativeText?: string | null;
            } | null;
          } | null;
        };
      } | null;
    }>;
  } | null;
};

export const GetV2ProductPageBySlugDocument = gql`
  query GetV2ProductPageBySlug($slug: String!) {
    v2ProductPages(filters: { slug: { eq: $slug } }) {
      data {
        attributes {
          slug
          metadata {
            title
            description
            canonicalUrl
            robots
            author
            ogUrl
            ogType
            ogAuthor
            ogImage {
              data {
                attributes {
                  url
                  height
                  width
                }
              }
            }
          }
          productPage {
            __typename
            ... on ComponentV2ProductHero {
              id
              text
            }
            ... on ComponentV2ProductPricingCards {
              id
              savingsText
              productPlans {
                data {
                  attributes {
                    tier
                    title
                    subtitle
                    mostPopular
                    priceStartingAt
                    button {
                      text
                      dataRef
                      solid
                      rounded
                      navigationUrl
                      action
                    }
                    perksTitle
                    perks {
                      text
                    }
                  }
                }
              }
            }
            ... on ComponentV2ProductFeatureTable {
              id
              title
              subtitle
              columns {
                data {
                  attributes {
                    tier
                    featTableHeader {
                      title
                      button {
                        text
                        dataRef
                        solid
                        rounded
                        navigationUrl
                        action
                      }
                    }
                    sections {
                      data {
                        attributes {
                          headerText
                          items {
                            data {
                              attributes {
                                checkbox
                                columnText
                                productFeature {
                                  data {
                                    attributes {
                                      featureName
                                      explainerText
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            ... on ComponentV2ProductFeatureShowcase {
              id
              items {
                image {
                  data {
                    attributes {
                      url
                      height
                      width
                      alternativeText
                    }
                  }
                }
                title
                body
              }
            }
            ... on ComponentV2ProductBasicExplainer {
              id
              title
              body
              button {
                text
                dataRef
                solid
                rounded
                navigationUrl
                action
              }
            }
            ... on ComponentV2ProductFeatureHighlight {
              id
              backgroundColor
              colorScheme
              title
              body
              image {
                data {
                  attributes {
                    url
                    height
                    width
                    alternativeText
                  }
                }
              }
              alignImage
              button {
                text
                dataRef
                solid
                rounded
                navigationUrl
                action
              }
            }
            ... on ComponentV2ProductClosingCta {
              id
              title
              body
              borderImage {
                data {
                  attributes {
                    url
                    height
                    width
                    alternativeText
                  }
                }
              }
              button {
                text
                dataRef
                solid
                rounded
                navigationUrl
                action
              }
            }
          }
        }
      }
    }
    footer {
      data {
        attributes {
          logo {
            data {
              attributes {
                url
                height
                width
                alternativeText
              }
            }
          }
          showLanguageBar
          slogan
          copyrightText
          columns {
            title
            links {
              text
              url
              dataRef
            }
          }
          bottomLinks {
            text
            url
            dataRef
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetV2ProductPageBySlugGQL extends Apollo.Query<
  GetV2ProductPageBySlugQuery,
  GetV2ProductPageBySlugQueryVariables
> {
  document = GetV2ProductPageBySlugDocument;
  client = 'strapi';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetExplainerScreensDocument = gql`
  query GetExplainerScreens {
    explainerScreensWeb {
      data {
        attributes {
          key
          triggerRoute
          title
          subtitle
          section {
            icon
            title
            description
          }
          continueButton {
            text
            dataRef
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetExplainerScreensGQL extends Apollo.Query<
  GetExplainerScreensQuery,
  GetExplainerScreensQueryVariables
> {
  document = GetExplainerScreensDocument;
  client = 'strapi';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetFooterDocument = gql`
  query GetFooter {
    footer {
      data {
        attributes {
          logo {
            data {
              attributes {
                url
                height
                width
                alternativeText
              }
            }
          }
          showLanguageBar
          slogan
          copyrightText
          columns {
            title
            links {
              text
              url
              dataRef
            }
          }
          bottomLinks {
            text
            url
            dataRef
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetFooterGQL extends Apollo.Query<
  GetFooterQuery,
  GetFooterQueryVariables
> {
  document = GetFooterDocument;
  client = 'strapi';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const TwitterSyncTweetMessageDocument = gql`
  query TwitterSyncTweetMessage {
    twitterSyncTweetText {
      data {
        attributes {
          tweetText
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class TwitterSyncTweetMessageGQL extends Apollo.Query<
  TwitterSyncTweetMessageQuery,
  TwitterSyncTweetMessageQueryVariables
> {
  document = TwitterSyncTweetMessageDocument;
  client = 'strapi';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchOnboardingV5VersionsDocument = gql`
  query FetchOnboardingV5Versions {
    onboardingV5Versions {
      data {
        attributes {
          publishedAt
          steps {
            __typename
            ... on ComponentOnboardingV5OnboardingStep {
              id
              carousel {
                id
                __typename
                title
                media {
                  data {
                    attributes {
                      url
                      height
                      width
                      alternativeText
                      hash
                      mime
                      name
                      provider
                      size
                    }
                  }
                }
              }
              title
              description
              stepKey
              stepType
              verifyEmailForm {
                id
                __typename
                inputLabel
                inputPlaceholder
                resendCodeText
                resendCodeActionText
                changeEmailActionText
                changeEmailTitle
                changeEmailDescription
                changeEmailInputLabel
                changeEmailInputPlaceholder
                changeEmailActionButton {
                  id
                  __typename
                  text
                  dataRef
                }
              }
              tagSelector {
                id
                __typename
                customTagInputText
              }
              radioSurveyQuestion
              radioSurvey {
                id
                __typename
                optionTitle
                optionDescription
                optionKey
              }
              userSelector {
                id
                __typename
              }
              groupSelector {
                id
                __typename
              }
              actionButton {
                id
                __typename
                text
                dataRef
              }
              skipButton {
                id
                __typename
                text
                dataRef
              }
            }
          }
          completionStep {
            id
            __typename
            message
            media {
              data {
                attributes {
                  url
                  height
                  width
                  alternativeText
                  hash
                  mime
                  name
                  provider
                  size
                }
              }
            }
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchOnboardingV5VersionsGQL extends Apollo.Query<
  FetchOnboardingV5VersionsQuery,
  FetchOnboardingV5VersionsQueryVariables
> {
  document = FetchOnboardingV5VersionsDocument;
  client = 'strapi';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpgradePageDocument = gql`
  query UpgradePage {
    upgradePages(sort: "bulletOrderWithinCard:ASC") {
      data {
        attributes {
          cardId
          rowType
          displayText
          iconId
          iconSource
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpgradePageGQL extends Apollo.Query<
  UpgradePageQuery,
  UpgradePageQueryVariables
> {
  document = UpgradePageDocument;
  client = 'strapi';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetValuePropCardsDocument = gql`
  query GetValuePropCards {
    valuePropCards(sort: "order") {
      data {
        id
        attributes {
          title
          order
          media {
            data {
              attributes {
                url
                mime
                alternativeText
              }
            }
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetValuePropCardsGQL extends Apollo.Query<
  GetValuePropCardsQuery,
  GetValuePropCardsQueryVariables
> {
  document = GetValuePropCardsDocument;
  client = 'strapi';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
