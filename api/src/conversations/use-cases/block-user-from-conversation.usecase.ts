import { Injectable, Inject } from '@nestjs/common';
import type { ConversationPort } from '../ports/conversation.port';
// import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class BlockUserFromConversationUseCase {
    constructor(
        @Inject('ConversationRepository')
        private readonly conversationPort: ConversationPort,
    ) {}

    async execute(conversationId: string, blockerUserId: string, userToBlockId: string) {
        const conversation = await this.conversationPort.find(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const memberIds = conversation.members
            .map((member) => {
                if (typeof member === 'string') {
                    return member;
                }
                if (
                    member &&
                    typeof member === 'object' &&
                    '_id' in member &&
                    (member as { _id?: unknown })._id
                ) {
                    return String((member as { _id: string })._id);
                }
                return undefined;
            })
            .filter((id): id is string => Boolean(id));

        const isBlockerMember = memberIds.includes(blockerUserId);
        if (!isBlockerMember) {
            throw new Error('Access denied: You are not a member of this conversation');
        }

        const isUserToBlockMember = memberIds.includes(userToBlockId);
        if (!isUserToBlockMember) {
            throw new Error('User to block is not a member of this conversation');
        }

        const blockedUsers = conversation.blockedUsers || [];
        if (!blockedUsers.includes(userToBlockId)) {
            blockedUsers.push(userToBlockId);
            await this.conversationPort.update(conversationId, { blockedUsers });
        }

        return {
            success: true,
            message: 'User blocked from viewing conversation history',
        };
    }
}
