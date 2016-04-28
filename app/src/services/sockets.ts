import { EventEmitter } from 'angular2/core';
import { SessionFactory } from './session';
import { Client } from './api';

export class SocketsService {
  SOCKET_IO_SERVER = window.Minds.socket_server;

  session = SessionFactory.build();

  socket: any;
  registered: boolean = false;
  subscriptions: any = {};
  rooms: string[] = [];

  constructor(public client: Client){
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
      console.log('[ws]::connecting | is logged in');
      this.socket.connect();
    }

    this.session.isLoggedIn((is: any) => {
      if(is){
        console.log(`[ws]::connecting | logged in`);
        this.reconnect();
      } else {
        console.log(`[ws]::disconnecting | logged out`);
        this.disconnect();
        this.rooms = [];
        this.registered = false;
      }
    });

    window.TEST_SOCKET_SERVICE = this;

    return this;
  }

  setUpDefaultListeners() {
    this.socket.on('connect', () => {
      console.log(`[ws]::connected to ${this.SOCKET_IO_SERVER}`);
      this.register();
    });

    this.socket.on('disconnect', () => {
      console.log(`[ws]::disconnected from ${this.SOCKET_IO_SERVER}`);
      this.registered = false;
    });

    this.socket.on('registered', () => {
      console.log(`[ws]::registered`);
      this.registered = true;
      this.socket.emit('join', this.rooms);
    });

    this.socket.on('error', (e: any) => {
      console.error('[ws]::error', e);
    });

    // -- Rooms

    this.socket.on('rooms', (rooms: string[]) => {
      console.log(`[ws]::rooms`, rooms);
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

  register() {
    this.registered = false;

    console.log(`[ws]::trying to register`);

    this.getRegistrationData().then((result) => {
      console.log(`[ws]::registering`, result);

      if (!result[0] || !result[1]) {
        throw new Error('Missing registration data');
      }

      this.socket.emit('register', result[0], result[1]);
    })
    .catch(e => {
      console.log(`[ws]::registering error`, e);
    });
  }

  getRegistrationData() {
    if (!this.session.isLoggedIn()) {
      return Promise.reject('No user');
    }

    // TODO: [emi] Check this out. For some reason Promise.all is failing the second time it gets called
    // ^ Second time = when reconnecting
    // ^ The promise looks good, but .then() is never executing on it.
    // ^ Shim issue? Apparently.
    return Promise.all([
      this.session.getLoggedInUser().guid,
      this.getLoggedInAccessToken()
    ]);
  }

  getLoggedInAccessToken() {

    return 'SOCKET_TEST_TOKEN'; // Until we figure out a way to get an in-app access token

    // // TODO: this should be in session.ts
    // // But the injector has to be moved to
    // // providers.ts in order to Client work
    // 
    // if (!this.session.isLoggedIn()) {
    //   return false;
    // }
    //
    // if (window.localStorage.getItem('currentAccessToken')) {
    //   return window.localStorage.getItem('currentAccessToken');
    // }
    //
    // return this.client.post('oauth2/token', {})
    // .then(
    //   (result: any) => result.access_token
    // );
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
    console.log('[ws]::emit', JSON.stringify(args));
    this.socket.emit.apply(this.socket, args);

    return this;
  }

  subscribe(name: string, callback: Function) {
    console.log(`[ws]::subscription | -> ${name}`);

    if (!this.subscriptions[name]){
      this.subscriptions[name] = new EventEmitter();

      this.socket.on(name, (...args) => {
        console.log(`[ws]::event | -> ${name}`, args);
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
