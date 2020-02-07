import {
  EventEmitter,
  Inject,
  NgZone,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import { Session } from './session';
import * as io from 'socket.io-client';
import { ConfigsService } from '../common/services/configs.service';
import { BehaviorSubject } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class SocketsService {
  SOCKET_IO_SERVER: string;
  LIVE_ROOM_NAME = 'live';

  socket: any;
  registered: boolean = false;
  subscriptions: any = {};
  rooms: string[] = [];
  debug: boolean = false;
  public error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    public session: Session,
    private nz: NgZone,
    private configs: ConfigsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.SOCKET_IO_SERVER = this.configs.get('socket_server');
  }

  setUp(): SocketsService {
    if (isPlatformServer(this.platformId)) return this;
    this.SOCKET_IO_SERVER = this.configs.get('socket_server');
    this.nz.runOutsideAngular(() => {
      if (this.socket) {
        this.socket.destroy();
      }

      this.socket = io.connect(this.SOCKET_IO_SERVER, {
        reconnect: true,
        reconnection: true,
        timeout: 40000,
        autoConnect: false,
      });

      this.rooms = [];
      this.registered = false;
      this.setUpDefaultListeners();

      if (this.session.isLoggedIn()) {
        this.socket.connect();
      }

      this.session.isLoggedIn((is: any) => {
        if (is) {
          this.reconnect();
        } else {
          this.disconnect();
          this.rooms = [];
          this.registered = false;
        }
      });
    });

    return this;
  }

  setUpDefaultListeners() {
    this.socket.on('connect', () => {
      this.error$.next(false);
      this.nz.run(() => {
        if (this.debug)
          console.log(`[ws]::connected to ${this.SOCKET_IO_SERVER}`);
        this.join(
          `${this.LIVE_ROOM_NAME}:${this.session.getLoggedInUser().guid}`
        );
      });
    });

    this.socket.on('disconnect', () => {
      this.error$.next(true);
      this.nz.run(() => {
        if (this.debug)
          console.log(`[ws]::disconnected from ${this.SOCKET_IO_SERVER}`);
        this.registered = false;
      });
    });

    this.socket.on('registered', guid => {
      if (this.debug) console.log('[ws]::registered');
      this.nz.run(() => {
        this.registered = true;
        this.socket.emit('join', this.rooms);
      });
    });

    this.socket.on('error', (e: any) => {
      this.error$.next(true); // TODO: Add reconnect that sets error to null.
      this.nz.run(() => {
        console.error('[ws]::error', e);
      });
    });

    // -- Rooms

    this.socket.on('rooms', (rooms: string[]) => {
      if (this.debug) console.log('rooms', rooms);
      this.nz.run(() => {
        this.rooms = rooms;
      });
    });

    this.socket.on('joined', (room: string, rooms: string[]) => {
      this.nz.run(() => {
        if (this.debug) console.log(`[ws]::joined`, room, rooms);
        this.rooms = rooms;
      });
    });

    this.socket.on('left', (room: string, rooms: string[]) => {
      this.nz.run(() => {
        if (this.debug) console.log(`[ws]::left`, room, rooms);
        this.rooms = rooms;
      });
    });
  }

  reconnect() {
    if (this.debug) console.log('[ws]::reconnect');
    this.registered = false;

    this.socket.disconnect();
    this.socket.connect();

    return this;
  }

  disconnect() {
    if (this.debug) console.log('[ws]::disconnect');
    this.registered = false;

    this.socket.disconnect();

    return this;
  }

  emit(...args) {
    this.nz.runOutsideAngular(() => {
      this.socket.emit.apply(this.socket, args);
    });

    return this;
  }

  subscribe(name: string, callback: Function) {
    if (!this.socket) return;
    if (!this.subscriptions[name]) {
      this.subscriptions[name] = new EventEmitter();

      this.nz.runOutsideAngular(() => {
        this.socket.on(name, (...args) => {
          this.nz.run(() => {
            this.subscriptions[name].next(args);
          });
        });
      });
    }

    return this.subscriptions[name].subscribe({
      next: args => {
        callback.apply(this, args);
      },
    });
  }

  join(room: string) {
    if (!room) {
      return this;
    }

    if (!this.registered || !this.socket.connected) {
      this.rooms.push(room);
      return this;
    }

    return this.emit('join', room);
  }

  leave(room: string) {
    if (!room) {
      return this;
    }

    return this.emit('leave', room);
  }
}
