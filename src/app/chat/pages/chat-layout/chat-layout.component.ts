import { Component } from '@angular/core';
import { SocketWebService } from '../../services/socket-web.service';

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.components.scss']
})
export class ChatLayoutComponent {

  constructor(private socketSv: SocketWebService){


  }

  emit(){

    this.socketSv.sendMessage('este es el mensaje');
  }





}
