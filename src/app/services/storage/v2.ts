import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Session } from '../session';
import { MemoryStorageService } from './memory/memory-storage.service';
import { SessionStorageService } from './session/session-storage.service';

@Injectable({ providedIn: 'root' })
export class StorageV2 {
  /**
   * global in-browser memory
   */
  memory = new MemoryStorageService();
  /**
   * session storage
   */
  session = new SessionStorageService();
}
