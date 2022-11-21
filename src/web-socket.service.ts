import { Injectable } from '@angular/core';
import * as SocketIO from 'socket.io-client';
import {Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: SocketIO.Socket;
  readonly uri = 'ws://18.212.58.116:80';

  constructor() { 
    this.socket = SocketIO.connect(this.uri);
  }

  listen(eventName: string) {
    return new Observable(subscriber => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      })
    })
  }

  emit(eventName: string, data: any) {
    this.socket?.emit(eventName, data);
  }

  joinCompany(data: any) {
    this.emit("join", data)
  }

  disconnect() {
    return this.socket.emit('disconnect')
  }

  // sendLocation() {
  //     // io.to(user.room)
  //   this.socket.
  // }
}
