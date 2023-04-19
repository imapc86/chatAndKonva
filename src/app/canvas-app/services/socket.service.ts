import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';


interface coords {
  prevPos: string,
  currentPos: string   
}


@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket{

  constructor() { 

    super({
      url: 'http://localhost:8080',
      options:{
        query:{
          'nameRoom': 'sala-1'
        }
      }
    });

    this.on('connect', ()=>{

      console.log('conectado');


    })

    this.on('disconnect', ()=>{

      console.log('desconectado');

    });

  }

  sendCoords(coords: coords) {
    this.emit('coords', coords);
  }
  
  getCoords() {
    return this.fromEvent('coords').pipe(map((data:any) => data));
  }
}
