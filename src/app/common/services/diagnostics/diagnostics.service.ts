import { Injectable } from '@angular/core';

export interface DiagnosticsInterface {
  listen(): void;
  setUser(currentUser): void;
}

export const SENTRY = null;

export class DiagnosticsService implements DiagnosticsInterface {
  listen() {}
  setUser(user) {}
}
