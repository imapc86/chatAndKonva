import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(public wsService: WebsocketService) { }

  sendMessage(message:string){

    console.log('SendeMessage');
    const payload = {
      from: 'Israel',
      body: message,
    }

    this.wsService.emit('message', payload);
  }

  getMessages(){

    return this.wsService.listen('new-message');

  }
}
