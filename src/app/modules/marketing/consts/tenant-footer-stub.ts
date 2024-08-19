import { Footer } from '../../../../graphql/generated.strapi';

/**
 * Stubbed data to render a static footer component for tenant networks.
 */
export const STRAPI_FOOTER_STUB_DATA: Footer = {
  __typename: 'Footer',
  columns: [],
  copyrightText: '',
  logo: {},
  showLanguageBar: false,
  slogan: '',
  bottomLinks: [
    {
      id: '1',
      text: 'Terms of Service',
      url: '/pages/terms-of-service',
      dataRef: 'tenant-footer-link-terms',
      __typename: 'ComponentFooterLink',
    },
    {
      id: '2',
      text: 'Privacy Policy',
      url: '/pages/privacy-policy',
      dataRef: 'tenant-footer-link-privacy',
      __typename: 'ComponentFooterLink',
    },
    {
      id: '3',
      text: 'Content Policy',
      url: '/pages/community-guidelines',
      dataRef: 'tenant-footer-link-content',
      __typename: 'ComponentFooterLink',
    },
    {
      id: '4',
      text: 'Powered by Minds Networks',
      url: 'https://networks.minds.com/',
      dataRef: 'tenant-footer-link-',
      __typename: 'ComponentFooterLink',
    },
  ],
};
