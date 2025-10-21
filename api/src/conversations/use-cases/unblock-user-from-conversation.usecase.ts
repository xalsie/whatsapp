import { Injectable, Inject } from '@nestjs/common';
import type { ConversationPort } from '../ports/conversation.port';

@Injectable()
export class UnblockUserFromConversationUseCase {
    constructor(
        @Inject('ConversationRepository')
        private readonly conversationPort: ConversationPort,
    ) {}

    async execute(conversationId: string, unblockerUserId: string, userToUnblockId: string) {
        const conversation = await this.conversationPort.find(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const memberIds = (conversation.members as Array<string | { _id?: string; id?: string }>)
            .map((member) => {
                if (typeof member === 'string') {
                    return member;
                }
                if (member && typeof member === 'object') {
                    if ('_id' in member && member._id) {
                        return member._id.toString();
                    }
                    if ('id' in member && member.id) {
                        return member.id.toString();
                    }
                }
                return undefined;
            })
            .filter((id): id is string => Boolean(id));
        const isUnblockerMember = memberIds.includes(unblockerUserId);
        if (!isUnblockerMember) {
            throw new Error('Access denied: You are not a member of this conversation');
        }

        const blockedUsers = conversation.blockedUsers || [];
        const index = blockedUsers.indexOf(userToUnblockId);
        if (index > -1) {
            blockedUsers.splice(index, 1);
            await this.conversationPort.update(conversationId, { blockedUsers });
        }

        return {
            success: true,
            message: 'User unblocked from viewing conversation history',
        };
    }
}
