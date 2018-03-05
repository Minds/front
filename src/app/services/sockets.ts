import { EventEmitter, Inject, NgZone } from '@angular/core';
import { Session } from './session';
import * as io from 'socket.io-client';

export class SocketsService {

  SOCKET_IO_SERVER = window.Minds.socket_server;
  LIVE_ROOM_NAME = 'live';

  socket: any;
  registered: boolean = false;
  subscriptions: any = {};
  rooms: string[] = [];

  static _(session: Session, nz: NgZone) {
    return new SocketsService(session, nz);
  }

  constructor(public session: Session, private nz: NgZone) {
    nz.runOutsideAngular(() => {
      this.setUp();
    });
  }

  setUp() {
    if (this.socket) {
      this.socket.destroy();
    }

    this.socket = io.connect(this.SOCKET_IO_SERVER, {
      'reconnect': true,
      'reconnection': true,
      'timeout': 40000,
      'autoConnect': false
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

    return this;
  }

  setUpDefaultListeners() {
    this.socket.on('connect', () => {
      this.nz.run(() => {
        console.log(`[ws]::connected to ${this.SOCKET_IO_SERVER}`);
        this.join(`${this.LIVE_ROOM_NAME}:${window.Minds.user.guid}`);
      });
    });

    this.socket.on('disconnect', () => {
      this.nz.run(() => {
        console.log(`[ws]::disconnected from ${this.SOCKET_IO_SERVER}`);
        this.registered = false;
      });
    });

    this.socket.on('registered', (guid) => {
      this.nz.run(() => {
        this.registered = true;
        this.socket.emit('join', this.rooms);
      });
    });

    this.socket.on('error', (e: any) => {
      this.nz.run(() => {
        console.error('[ws]::error', e);
      });
    });

    // -- Rooms

    this.socket.on('rooms', (rooms: string[]) => {
      this.nz.run(() => {
        this.rooms = rooms;
      });
    });

    this.socket.on('joined', (room: string, rooms: string[]) => {
      this.nz.run(() => {
        console.log(`[ws]::joined`, room, rooms);
        this.rooms = rooms;
      });
    });

    this.socket.on('left', (room: string, rooms: string[]) => {
      this.nz.run(() => {
        console.log(`[ws]::left`, room, rooms);
        this.rooms = rooms;
      });
    });
  }

  reconnect() {
    console.log('[ws]::reconnect');
    this.registered = false;

    this.socket.disconnect();
    this.socket.connect();

    return this;
  }

  disconnect() {
    console.log('[ws]::disconnect');
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
      next: (args) => { callback.apply(this, args); }
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
