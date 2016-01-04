export * from './utils/tasks_tools';
export * from './utils/template_injectables';
export * from './utils/template_locals';

export function tsProjectFn(plugins) {
  return plugins.typescript.createProject('tsconfig.json', {
    typescript: require('typescript')
  });
}
