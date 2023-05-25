import { STRAPI_ACTION_BUTTON_SNIPPET } from '../strapi-action-resolver.service';
import { STRAPI_METADATA_SNIPPET } from '../strapi-meta.service';

// full sub-query to get all marketing page data.
export const PRODUCT_MARKETING_PAGE_QUERY_FULL: string = `
  data {
    attributes {
      hero {
        h1
        body
        showBackgroundEffects
        image {
          data {
            attributes {
              url
            }
          }
        }
      }
      sections {
        title
        body
        image {
          data {
            attributes {
              url
            }
          }
        }
        imageOverlay {
          data {
            attributes {
              url
            }
          }
        }
        ${STRAPI_ACTION_BUTTON_SNIPPET}
        leftAligned
        showBackgroundEffects
        showBodyBackground
      }
      otherFeaturesSection {
        title
        column1Title
        column1Body
        column2Title
        column2Body
        column3Title
        column3Body
      }
      ${STRAPI_METADATA_SNIPPET}
    }
  }
`;
