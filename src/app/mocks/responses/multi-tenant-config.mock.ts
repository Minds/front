import {
  MultiTenantColorScheme,
  MultiTenantConfig,
} from '../../../graphql/generated.engine';

export const multiTenantConfigMock: MultiTenantConfig = {
  siteName: 'Site name',
  siteEmail: 'noreply@minds.com',
  colorScheme: MultiTenantColorScheme.Dark,
  primaryColor: '#ff0000',
  communityGuidelines: 'Community Guidelines Test',
  federationDisabled: true,
};
