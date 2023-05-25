import { StrapiActionButton } from '../strapi-action-resolver.service';
import { StrapiMetadata } from '../strapi-meta.service';

// hero section.
export type MarketingHero = {
  h1: string;
  body: string;
  ctaText: string;
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
export type MarketingOtherFeaturesSection = {
  title: string;
  column1Title: string;
  column1Body: string;
  column2Title: string;
  column2Body: string;
  column3Title: string;
  column3Body: string;
};

// marketing section.
export type MarketingSection = {
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

// full attributes returned for a marketing page when using full query.
export type MarketingAttributes = {
  hero: MarketingHero;
  sections: MarketingSection;
  otherFeaturesSection: MarketingOtherFeaturesSection;
  metadata: StrapiMetadata;
};
