import { Inject, Injector, provide, EventEmitter } from 'angular2/core';
import { SessionFactory } from './session';

export class SocketsService {

  session = SessionFactory.build();

  socket;
  emitters : {} = {};

  constructor(){
    this.setUp();
  }

  setUp(){

    System.import('https://cdn.socket.io/socket.io-1.3.7.js').then((io) => {
      this.socket = io.connect(window.Minds.socket_server, {
				'reconnect': true,
        'reconnection': true,
        'timeout': 40000
			});

  		this.socket.on('connect', () => {
  			console.log('[ws]::connect', 'connect to socket server');
  		});

      this.socket.on('error', (err) => {
        console.log('[ws]::error', err);
      });

      this.session.isLoggedIn((is) => {
        if(is){
          this.reconnect();
        } else {
          this.disconnect();
        }
      })
    });

  }

  reconnect(){
    console.log('[ws][reconnect]::triggered');
    this.socket.io.disconnect();
    this.socket.io.connect();
  }

  disconnect(){
    console.log('[ws][disconnect]::triggered');
    this.socket.io.disconnect();
  }

  emit(){
    if(this.socket) {
      var _emit = this.socket.emit;
      _emit.apply(this.socket, arguments);
    } else {
      //console.log('[ws][emit]:: called before socket setup');
    }
  }

  subscribe(name : string, callback : Function){
    if(!this.emitters[name] && this.socket){
      //console.log('[sub][registered]:: ' + name);
      this.emitters[name] = new EventEmitter();
      var emitter = this.emitters[name];
      this.socket.on(name, function() {
        emitter.next(arguments);
      });
    }
    if(this.socket){
      return this.emitters[name].subscribe({
        next: (args) => { callback.apply(this, args); }
      });
    } else {
      setTimeout(() => {
        this.subscribe(name, callback);
      }, 1000);
    }
  }

  unSubscribe(subscription){
    subscription.unSubscribe();
  }

}

export const SOCKETS_PROVIDERS : any[] = [
   provide(SocketsService, {
     useFactory: () => new SocketsService(),
     deps: []
   })
];
