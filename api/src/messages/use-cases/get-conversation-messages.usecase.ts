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

        const isMember = conversation.members.some((member) => {
            console.log(
                'Checking member:',
                typeof member === 'string'
                    ? member.toString()
                    : (member as { _id?: { toString: () => string } })._id?.toString(),
                'against userId:',
                userId,
            );
            if (
                typeof member === 'string'
                    ? member === userId
                    : (member as { _id?: { toString: () => string } })._id?.toString() === userId
            ) {
                console.log('Member match found');
                return true;
            }
        });

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
