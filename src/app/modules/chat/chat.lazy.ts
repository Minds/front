import { ChatModule } from './chat.module';

/** Lazy routes for chat module. */
export const ChatModuleLazyRoutes = {
  path: 'chat',
  loadChildren: () => import('./chat.module').then((m) => ChatModule),
};
