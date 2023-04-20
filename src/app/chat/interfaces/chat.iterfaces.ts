export interface Message {
  senderMessage: string;
  recipientMessage: string;
  senderType: 'user' | 'bot';
  recipientType: 'user' | 'bot';
  messageType: 'sent' | 'received';
  message: string;
}

export interface ChatHistory {
  sentMessages?: string;
  receivedMessages?: string;
  messages: Message[];
}
