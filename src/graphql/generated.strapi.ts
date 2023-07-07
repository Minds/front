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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
  OnboardingV5VersionStepsDynamicZoneInput: { input: any; output: any };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any };
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
  text: Scalars['String']['output'];
};

export type ComponentCommonActionButtonFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<ComponentCommonActionButtonFiltersInput>>>;
  dataRef?: InputMaybe<StringFilterInput>;
  navigationUrl?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentCommonActionButtonFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonActionButtonFiltersInput>>>;
  text?: InputMaybe<StringFilterInput>;
};

export type ComponentCommonActionButtonInput = {
  action?: InputMaybe<Enum_Componentcommonactionbutton_Action>;
  dataRef?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  navigationUrl?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
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

export type Error = {
  __typename?: 'Error';
  code: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
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

export type GenericMorph =
  | AuxPage
  | ComponentCommonActionButton
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
  | Homepage
  | I18NLocale
  | OnboardingV5Version
  | ProductPage
  | TopbarAlert
  | TwitterSyncTweetText
  | UploadFile
  | UploadFolder
  | UsersPermissionsPermission
  | UsersPermissionsRole
  | UsersPermissionsUser;

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
  createOnboardingV5Version?: Maybe<OnboardingV5VersionEntityResponse>;
  createProductPage?: Maybe<ProductPageEntityResponse>;
  createUploadFile?: Maybe<UploadFileEntityResponse>;
  createUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteAuxPage?: Maybe<AuxPageEntityResponse>;
  deleteHomepage?: Maybe<HomepageEntityResponse>;
  deleteOnboardingV5Version?: Maybe<OnboardingV5VersionEntityResponse>;
  deleteProductPage?: Maybe<ProductPageEntityResponse>;
  deleteTopbarAlert?: Maybe<TopbarAlertEntityResponse>;
  deleteTwitterSyncTweetText?: Maybe<TwitterSyncTweetTextEntityResponse>;
  deleteUploadFile?: Maybe<UploadFileEntityResponse>;
  deleteUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Delete an existing role */
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>;
  /** Delete an existing user */
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse;
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
  updateFileInfo: UploadFileEntityResponse;
  updateHomepage?: Maybe<HomepageEntityResponse>;
  updateOnboardingV5Version?: Maybe<OnboardingV5VersionEntityResponse>;
  updateProductPage?: Maybe<ProductPageEntityResponse>;
  updateTopbarAlert?: Maybe<TopbarAlertEntityResponse>;
  updateTwitterSyncTweetText?: Maybe<TwitterSyncTweetTextEntityResponse>;
  updateUploadFile?: Maybe<UploadFileEntityResponse>;
  updateUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
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

export type MutationCreateOnboardingV5VersionArgs = {
  data: OnboardingV5VersionInput;
};

export type MutationCreateProductPageArgs = {
  data: ProductPageInput;
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

export type MutationDeleteAuxPageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteOnboardingV5VersionArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteProductPageArgs = {
  id: Scalars['ID']['input'];
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

export type MutationUpdateFileInfoArgs = {
  id: Scalars['ID']['input'];
  info?: InputMaybe<FileInfoInput>;
};

export type MutationUpdateHomepageArgs = {
  data: HomepageInput;
};

export type MutationUpdateOnboardingV5VersionArgs = {
  data: OnboardingV5VersionInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateProductPageArgs = {
  data: ProductPageInput;
  id: Scalars['ID']['input'];
};

export type MutationUpdateTopbarAlertArgs = {
  data: TopbarAlertInput;
};

export type MutationUpdateTwitterSyncTweetTextArgs = {
  data: TwitterSyncTweetTextInput;
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

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW',
}

export type Query = {
  __typename?: 'Query';
  auxPage?: Maybe<AuxPageEntityResponse>;
  auxPages?: Maybe<AuxPageEntityResponseCollection>;
  homepage?: Maybe<HomepageEntityResponse>;
  i18NLocale?: Maybe<I18NLocaleEntityResponse>;
  i18NLocales?: Maybe<I18NLocaleEntityResponseCollection>;
  me?: Maybe<UsersPermissionsMe>;
  onboardingV5Version?: Maybe<OnboardingV5VersionEntityResponse>;
  onboardingV5Versions?: Maybe<OnboardingV5VersionEntityResponseCollection>;
  productPage?: Maybe<ProductPageEntityResponse>;
  productPages?: Maybe<ProductPageEntityResponseCollection>;
  topbarAlert?: Maybe<TopbarAlertEntityResponse>;
  twitterSyncTweetText?: Maybe<TwitterSyncTweetTextEntityResponse>;
  uploadFile?: Maybe<UploadFileEntityResponse>;
  uploadFiles?: Maybe<UploadFileEntityResponseCollection>;
  uploadFolder?: Maybe<UploadFolderEntityResponse>;
  uploadFolders?: Maybe<UploadFolderEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>;
  usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>;
  usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>;
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

export type QueryProductPageArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryProductPagesArgs = {
  filters?: InputMaybe<ProductPageFiltersInput>;
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
