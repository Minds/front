import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchiveView } from '../plugins/archive/archive';

export const embedRoutes: Routes = [
  { path: 'archive/view/:guid', component: ArchiveView }
];

export const MindsEmbedRoutingProviders: any[] = [];
export const MindsEmbedRouting: ModuleWithProviders = RouterModule.forRoot(embedRoutes);
export const MINDS_EMBED_ROUTING_DECLARATIONS: any[] = [
  ArchiveView,
];
