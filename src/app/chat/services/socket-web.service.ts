import { Injectable } from '@angular/core';
import { Socket, SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { Observable } from 'rxjs';


interface coords {
  prevPos: string,
  currentPos: string   
}


const config: SocketIoConfig = { 
  url: 'http://localhost:8080',  
  options: {
    query:{
      nameRoom: 'sala-667'
    }
  }
};
@Injectable({
  providedIn: 'root',
})
export class SocketWebService extends Socket{

  constructor(){

    console.log('constructor');

    super({
      url: 'http://localhost:8080',  
      options: {
      query:{
          nameRoom: 'sala-667'
        }
      }
    });

    this.listen();

  }

  listen = () =>{

    this.ioSocket.on('event', (res: any) => console.log);
    
  }

  emitEvent({prevPos, currentPos}: coords){

    console.log('EmitEventSv');
    this.ioSocket.emit('event',{prevPos, currentPos});

  }

  sendMessage(message: string) {

    console.log(message);

    this.ioSocket.emit('event', { message: message });
  }

  onMessage(): Observable<any> {
    return this.ioSocket.fromEvent('my-response');
  }
}
