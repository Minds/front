import { StrapiActionButton } from '../strapi-action-resolver.service';
import { StrapiMetadata } from '../strapi-meta.service';

// hero section.
export type ProductMarketingHero = {
  h1: string;
  body: string;
  showBackgroundEffects: boolean;
  image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
};

// other features section.
export type ProductMarketingOtherFeaturesSection = {
  title: string;
  column1Title: string;
  column1Body: string;
  column2Title: string;
  column2Body: string;
  column3Title: string;
  column3Body: string;
};

// marketing section.
export type ProductMarketingSection = {
  title: string;
  body: string;
  image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  imageOverlay: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  actionButtons: StrapiActionButton[];
  leftAligned: boolean;
  showBackgroundEffects: boolean;
  showBodyBackground: boolean;
};

// marketing section tail / footer
export type ProductMarketingSectionTail = {
  actionButton: StrapiActionButton;
};

// full attributes returned for a marketing page when using full query.
export type ProductMarketingAttributes = {
  hero: ProductMarketingHero;
  sections: ProductMarketingSection[];
  other: ProductMarketingOtherFeaturesSection;
  footer: ProductMarketingSectionTail;
  metadata: StrapiMetadata;
};

// full response
export type ProductMarketingResponse = {
  productPages: {
    data: {
      attributes: ProductMarketingAttributes;
    }[];
  };
};
