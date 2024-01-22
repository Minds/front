import {
  CustomPage,
  CustomPageTypesEnum,
} from '../../../graphql/generated.engine';

/**
 * Different types of custom pages that we allow
 */
export enum CustomPageType {
  PRIVACY_POLICY = 'privacy_policy',
  TERMS_OF_SERVICE = 'terms',
  COMMUNITY_GUIDELINES = 'community_guidelines',
}

/**
 * Different ways tenants can implement their custom pages
 *   Default - use whatever minds has provided
 *   Custom - tenant provides their own text
 *   External - tenant provides external link
 */
export enum CustomPageImplementation {
  DEFAULT = 'default',
  CUSTOM = 'custom',
  EXTERNAL = 'external',
}

/**
 * CustomPage that we get from the backend,
 * plus additional fields we calculate in the front
 */
export type CustomPageExtended = CustomPage & {
  implementation: CustomPageImplementation;
  displayName: string;
  displayContent: string;
};
