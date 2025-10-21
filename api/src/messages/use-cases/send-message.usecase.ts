import { Injectable, Inject } from '@nestjs/common';
import type { MessagePort } from '../ports/message.port';
import { SendMessageDTO } from '../dto/send-message.dto';

@Injectable()
export class SendMessageUseCase {
    constructor(@Inject('MessageRepository') private readonly messagePort: MessagePort) {}

    async execute(dto: SendMessageDTO) {
        return this.messagePort.send(dto.from, dto.text, dto.conversationId);
    }
}
