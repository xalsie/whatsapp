import { Injectable, Inject } from '@nestjs/common';
import type { ConversationPort } from '../ports/conversation.port';

@Injectable()
export class GetConversationUseCase {
    constructor(
        @Inject('ConversationRepository')
        private readonly conversationPort: ConversationPort,
    ) {}

    async execute(id: string) {
        return this.conversationPort.find(id);
    }
}
