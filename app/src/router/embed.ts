import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { MediaView } from '../controllers/media/media';

export const MindsEmbedRoutes: Routes = [
  { path: 'api/v1/embed/:guid', component: MediaView }
];

export const MindsEmbedRoutingProviders: any[] = [{ provide: APP_BASE_HREF, useValue: '/' }];
export const MINDS_EMBED_ROUTING_DECLARATIONS: any[] = [
  MediaView,
];
