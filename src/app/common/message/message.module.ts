import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { MessageService } from './message.service';

import { MessageRoutingModule } from './message-routing.module';

@NgModule({
  imports: [CommonModule, MessageRoutingModule],
  declarations: [MessageComponent],
  exports: [MessageComponent],
  providers: [MessageService]
})
export class MessageModule { }
