import { Injectable, Inject } from '@nestjs/common';
import type { ConversationPort } from '../ports/conversation.port';

@Injectable()
export class GetUserConversationsUseCase {
    constructor(
        @Inject('ConversationRepository')
        private readonly conversationPort: ConversationPort,
    ) {}

    async execute(userId: string) {
        const userConversations = await this.conversationPort.findByUser(userId);
        console.log(userConversations);
        const generalConversation = await this.conversationPort.findByUser(
            '695bd3bdbd113580e1e9496a',
        );
        userConversations.push(...generalConversation);
        console.log(generalConversation);
        // conversations = userConversations.push(generalConversation);
        return userConversations;
    }
}
