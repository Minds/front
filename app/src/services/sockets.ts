import { EventEmitter } from 'angular2/core';
import { SessionFactory } from './session';

export class SocketsService {
  SOCKET_IO_SERVER = window.Minds.socket_server;

  session = SessionFactory.build();

  socket: any;
  registered: boolean = false;
  subscriptions: any = {};
  rooms: string[] = [];

  constructor(){
    this.setUp();
  }

  setUp(){
    if (this.socket) {
      this.socket.destroy();
    }

    this.socket = window.io.connect(this.SOCKET_IO_SERVER, {
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
      if(is){
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
      console.log(`[ws]::connected to ${this.SOCKET_IO_SERVER}`);
    });

    this.socket.on('disconnect', () => {
      console.log(`[ws]::disconnected from ${this.SOCKET_IO_SERVER}`);
      this.registered = false;
    });

    this.socket.on('registered', (guid) => {
      this.registered = true;
      this.socket.emit('join', this.rooms);
    });

    this.socket.on('error', (e: any) => {
      console.error('[ws]::error', e);
    });

    // -- Rooms

    this.socket.on('rooms', (rooms: string[]) => {
      this.rooms = rooms;
    });

    this.socket.on('joined', (room: string, rooms: string[]) => {
      console.log(`[ws]::joined`, room, rooms);
      this.rooms = rooms;
    });

    this.socket.on('left', (room: string, rooms: string[]) => {
      console.log(`[ws]::left`, room, rooms);
      this.rooms = rooms;
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
    this.socket.emit.apply(this.socket, args);

    return this;
  }

  subscribe(name: string, callback: Function) {
    if (!this.subscriptions[name]){
      this.subscriptions[name] = new EventEmitter();

      this.socket.on(name, (...args) => {
        this.subscriptions[name].next(args);
      });
    }

    return this.subscriptions[name].subscribe({
      next: (args) => { callback.apply(this, args); }
    });
  }

  unSubscribe(subscription){
    subscription.unSubscribe();
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
