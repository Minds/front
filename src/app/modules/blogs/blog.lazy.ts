export const BlogModuleLazyRoutes = {
  path: 'blog',
  loadChildren: () => import('./blog.module').then((m) => m.BlogModule),
};

export const BlogSlugModuleLazyRoutes = {
  path: ':username/blog',
  loadChildren: () =>
    import('./blog-slug.module').then((m) => m.BlogSlugModule),
};
