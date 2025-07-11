import { Route } from '@angular/router';
import { NotificationsV3ListFullscreenComponent } from './v3/fullscreen/fullscreen.component';
import { NotificationsComponent } from './notifications.component';

export const notificationRoutes: Route[] = [
  {
    path: 'notifications/v3',
    component: NotificationsV3ListFullscreenComponent,
  },
  { path: 'notifications/:filter', component: NotificationsComponent },
  { path: 'notifications', component: NotificationsComponent },
];
