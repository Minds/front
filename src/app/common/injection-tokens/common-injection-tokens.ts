import { InjectionToken } from '@angular/core';
import { type Integration } from '@sentry/types';

// Site name.
export const SITE_NAME = new InjectionToken<string>('site_name');

// Reference to window.
export const WINDOW = new InjectionToken<string>('window');

// Sentry integrations for SSR.
export const SSR_SENTRY_INTEGRATIONS = new InjectionToken<Integration[]>(
  'SSR_SENTRY_INTEGRATIONS'
);
