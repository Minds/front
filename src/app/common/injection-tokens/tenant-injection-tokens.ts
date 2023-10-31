import { InjectionToken } from '@angular/core';

// Whether this is a tenant network.
export const IS_TENANT_NETWORK = new InjectionToken<boolean>('is_tenant');
