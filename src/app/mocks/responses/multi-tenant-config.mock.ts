import {
  MultiTenantColorScheme,
  MultiTenantConfig,
} from '../../../graphql/generated.engine';

export const multiTenantConfigMock: MultiTenantConfig = {
  siteName: 'Site name',
  siteEmail: 'noreply@minds.com',
  colorScheme: MultiTenantColorScheme.Dark,
  primaryColor: '#ff0000',
  federationDisabled: true,
  replyEmail: 'some@email.com',
  canEnableFederation: true,
  customHomePageEnabled: true,
  customHomePageDescription: 'Hello world',
  walledGardenEnabled: true,
};
