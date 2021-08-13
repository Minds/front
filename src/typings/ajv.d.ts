/**
 * The AVJ library is a dependency of @snapshot-labs/snapshot.js.
 * This library uses type declarations unsupported by typescript
 * version < 4.2.0.
 *
 * To avoid upgrading TypeScript (and Angular as a consequence),
 * types for the AVJ library are overwritten by this definition file.
 *
 * in the future, if the TypeScript gets upgraded, this could be removed.
 */
declare module 'avj' {}
