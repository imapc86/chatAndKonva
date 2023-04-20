import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatLayoutComponent } from './pages/chat-layout/chat-layout.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChatLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
