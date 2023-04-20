import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';


interface msgResponse {
  from: string;
  body: string;
}
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;

  constructor(private socket: Socket){

    this.checkStatus();

  }

  checkStatus(){

    this.socket.on('connect', ()=> {
      console.log('Conectado');
      this.socketStatus = true;
    });
    
    this.socket.on('disconnect', ()=> {
      console.log('Desconectado');
      this.socketStatus = false;
    });

  }

  emit(event: string, payload?:any, callback?: Function){

    this.socket.emit(event, payload, callback);

  }

  listen(event:string):Observable<msgResponse>{

    return this.socket.fromEvent(event);

  }

}
