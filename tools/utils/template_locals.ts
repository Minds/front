import {APP_BASE, APP_DEST, APP_ROOT, APP_TITLE, SYSTEM_CONFIG, VERSION, BOOTSTRAP_MODULE } from '../config';

// TODO: Add an interface to register more template locals.
export function templateLocals() {
  return {
    APP_BASE,
    APP_DEST,
    APP_ROOT,
    APP_TITLE,
    SYSTEM_CONFIG,
    VERSION,
    BOOTSTRAP_MODULE
  };
}
