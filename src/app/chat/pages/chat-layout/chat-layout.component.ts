import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ChatService } from '../../services/chat.service';
import { ChatHistory, Message } from '../../interfaces/chat.iterfaces';
import { Observable, Observer, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.components.scss']
})
export class ChatLayoutComponent implements OnInit, OnDestroy {

  public message: string = '';
  public messageObject!: Message;
  public chatHistory: ChatHistory = {
    sentMessages: '',
    receivedMessages: '',
    messages: []
  };

  subscriptions!: Subscription;
  
  constructor(
    public socketSv: WebsocketService,
    public chatSv: ChatService
  ){ }

  ngOnInit(): void {
    this.subscriptions = this.chatSv.getMessages().subscribe((message) => {

      const msg = message.body || '';

      const newMessage:Message = {
        senderMessage: '',
        recipientMessage: '',
        senderType: 'user',
        recipientType: 'user',
        messageType: 'received',
        message: msg
      }

      this.chatHistory.messages.push(newMessage);

    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  sendMessage(){

    if(this.message.trim() == '') return;

    this.messageObject = {
      senderMessage: '',
      recipientMessage: '',
      senderType: 'user',
      recipientType: 'user',
      messageType: 'sent',
      message: this.message
    }

    this.chatHistory.messages.push(this.messageObject);
    this.chatSv.sendMessage(this.message);

    this.message = '';
  }
}
