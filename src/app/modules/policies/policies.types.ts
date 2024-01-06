/** Different types of custom policies that we allow */
export enum CustomPolicyId {
  PRIVACY = 'privacy',
  TERMS_OF_SERVICE = 'termsOfService',
  COMMUNITY_GUIDELINES = 'communityGuidelines',
}

/**
 * Different ways tenants can implement policies
 *  Default - use whatever minds has provided
 * Custom - tenant provides their own text
 * External - tenant provides external link
 */
export enum CustomPolicyImplementation {
  DEFAULT = 'default',
  CUSTOM = 'custom',
  EXTERNAL = 'external',
}
