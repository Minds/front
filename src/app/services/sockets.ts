import {
  EventEmitter,
  Inject,
  NgZone,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import { Session } from './session';
import { Socket, io } from 'socket.io-client';
import { ConfigsService } from '../common/services/configs.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class SocketsService {
  public readonly SOCKET_IO_SERVER = '/api/socket.io';

  /** The socket. Can be used to talk directly to socket.io */
  public socket: Socket;

  /** An array of emitters that are fired when an event comes in */
  private subscriptions: any = {};

  /** A list of rooms that have previously been joined */
  private rooms: string[] = [];

  /** Set to true when in dev mode */
  debug: boolean = true;

  /** Any socket errors are emitted here */
  public error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /** Called when connected */
  onReady$: ReplaySubject<void> = new ReplaySubject();

  constructor(
    public session: Session,
    private nz: NgZone,
    private configs: ConfigsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  setUp(): SocketsService {
    if (isPlatformServer(this.platformId)) return this;
    this.nz.runOutsideAngular(() => {
      this.socket = io({
        path: '/api/sockets/socket.io',
        reconnection: true,
        timeout: 40000,
        autoConnect: false,
        transports: ['websocket', 'polling'],
      });

      this.rooms = [];
      this.setUpDefaultListeners();

      if (this.session.isLoggedIn()) {
        this.socket.connect();

        // join all rooms that have already been subscribed to
        for (const name in this.subscriptions) {
          this.nz.runOutsideAngular(() => {
            this.socket.on(name, (...args) => {
              this.nz.run(() => {
                this.subscriptions[name].next(args);
              });
            });
          });
        }
      }

      this.session.isLoggedIn((is: any) => {
        if (is) {
          this.reconnect();
        } else {
          this.disconnect();
        }
      });
    });

    return this;
  }

  setUpDefaultListeners() {
    this.socket.on('connect', () => {
      this.onReady$.next();
      this.error$.next(false);
      this.nz.run(() => {
        if (this.debug)
          console.log(`[ws]::connected to ${this.SOCKET_IO_SERVER}`);

        // Re-join previously join room on a reconnect
        this.rooms.forEach((room) => this.socket.emit('join', room));
      });
    });

    this.socket.on('disconnect', () => {
      this.error$.next(true);
      this.nz.run(() => {
        if (this.debug)
          console.log(`[ws]::disconnected from ${this.SOCKET_IO_SERVER}`);
      });
    });

    this.socket.on('error', (e: any) => {
      this.error$.next(true); // TODO: Add reconnect that sets error to null.
      this.nz.run(() => {
        console.error('[ws]::error', e);
      });
    });
  }

  /**
   * Performs a disconnect and then connect, useful for when a user changes
   */
  reconnect() {
    if (this.debug) console.log('[ws]::reconnect');

    this.socket.disconnect();
    this.socket.connect();

    return this;
  }

  /**
   * Call this when someone logs out so they are no longer connected
   */
  disconnect() {
    if (this.debug) console.log('[ws]::disconnect');

    this.socket.disconnect();

    return this;
  }

  /**
   * Sends an event to the socket.io server
   */
  emit(...args) {
    this.nz.runOutsideAngular(() => {
      this.socket.emit.apply(this.socket, args);
    });

    return this;
  }

  /**
   * Subscribe to socket events
   */
  subscribe(name: string, callback: Function) {
    if (!this.subscriptions[name]) {
      this.subscriptions[name] = new EventEmitter();

      if (this.socket) {
        this.nz.runOutsideAngular(() => {
          this.socket.on(name, (...args) => {
            this.nz.run(() => {
              this.subscriptions[name].next(args);
            });
          });
        });
      }
    }

    return this.subscriptions[name].subscribe({
      next: (args) => {
        callback.apply(this, args);
      },
    });
  }

  /**
   * Joins a room.
   * @deprecated
   */
  join(room: string) {
    // Even if the socket isn't connected, it will join the room on socket.on('connect')
    this.rooms.push(room);

    if (!this.socket.connected) {
      return this;
    }

    if (this.debug) console.log('[ws]:: joining room - ' + room);

    return this.emit('join', room);
  }

  /**
   * Leaves a room
   * @deprecated
   */
  leave(room: string) {
    const i = this.rooms.indexOf(room);
    this.rooms.splice(i, 1);

    return this.emit('leave', room);
  }
}
