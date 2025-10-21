import { Injectable, Inject } from '@nestjs/common';
import type { ConversationPort } from '../ports/conversation.port';

@Injectable()
export class GetUserConversationsUseCase {
    constructor(
        @Inject('ConversationRepository')
        private readonly conversationPort: ConversationPort,
    ) {}

    async execute(userId: string) {
        return this.conversationPort.findByUser(userId);
    }
}
