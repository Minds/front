import { Inject, Injector, provide, EventEmitter } from 'angular2/angular2';
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
    this.socket.io.connect();
  }

  disconnect(){
    console.log('[ws][disconnect]::triggered');
    this.socket.io.disconnect();
  }

  emit(name : string, data : any){
    if(this.socket)
      this.socket.emit(name, data);
    else
      console.log('[ws][emit]:: called before socket setup');
  }

  subscribe(name : string, callback : Function){
    console.log('[sub]:: ' + name);
    if(!this.emitters[name] && this.socket){
      console.log('[sub][registered]:: ' + name);
      this.emitters[name] = new EventEmitter();
      this.socket.on(name, (data) => {
        console.log('[ws][on]:: ' + name);
        this.emitters[name].next(data);
      });
      return this.emitters[name].subscribe({ next: callback });
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
