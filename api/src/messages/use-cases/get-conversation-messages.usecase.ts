import { Injectable, Inject } from '@nestjs/common';
import type { MessagePort } from '../ports/message.port';
import type { ConversationPort } from '../../conversations/ports/conversation.port';

@Injectable()
export class GetConversationMessagesUseCase {
    constructor(
        @Inject('MessageRepository') private readonly messagePort: MessagePort,
        @Inject('ConversationRepository')
        private readonly conversationPort: ConversationPort,
    ) {}

    async execute(conversationId: string, userId: string) {
        const conversation = await this.conversationPort.find(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const isMember = conversation.members.some((member) =>
            typeof member === 'string' ? member === userId : member._id.toString() === userId,
        );

        if (!isMember) {
            throw new Error('Access denied: You are not a member of this conversation');
        }

        if (conversation.blockedUsers && conversation.blockedUsers.includes(userId)) {
            throw new Error(
                "Access denied: You are blocked from viewing this conversation's history",
            );
        }

        return this.messagePort.findByConversation(conversationId);
    }
}
