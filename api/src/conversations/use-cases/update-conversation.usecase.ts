import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { ConversationPort } from '../ports/conversation.port';
import type { UserPort } from '../../users/ports/user.port';
import { UpdateConversationDTO } from '../dto/update-conversation.dto';
import { ConversationEntity } from '../../domain/entities/conversation.entity';

@Injectable()
export class UpdateConversationUseCase {
    constructor(
        @Inject('ConversationRepository')
        private readonly conversationPort: ConversationPort,
        @Inject('UserRepository') private readonly userPort: UserPort,
    ) {}

    async execute(conversationId: string, dto: UpdateConversationDTO, userId: string) {
        const conversation = await this.conversationPort.find(conversationId);
        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        let adminId: string;
        if (typeof conversation.admin === 'string') {
            adminId = conversation.admin;
        } else if (conversation.admin && typeof conversation.admin === 'object') {
            adminId = conversation.admin.id.toString();
        } else {
            adminId = '';
        }

        if (adminId !== userId) {
            throw new ForbiddenException('Only the conversation admin can update it');
        }

        const updates: Partial<ConversationEntity> = {};

        if (dto.name !== undefined) {
            updates.name = dto.name;
        }

        let memberIds: string[] = conversation.members.map((m: string | { id: string }) =>
            typeof m === 'string' ? m.toString() : m.id.toString(),
        );

        if (dto.addMembers && dto.addMembers.length > 0) {
            for (const email of dto.addMembers) {
                const user = await this.userPort.findByEmail(email);
                if (!user) {
                    throw new NotFoundException(`User with email ${email} not found`);
                }
                const userIdStr = user.id.toString();
                if (!memberIds.includes(userIdStr)) {
                    memberIds.push(userIdStr);
                }
            }
        }

        if (dto.removeMembers && dto.removeMembers.length > 0) {
            for (const memberId of dto.removeMembers) {
                if (memberId === adminId) {
                    throw new ForbiddenException('Cannot remove the conversation admin');
                }
                memberIds = memberIds.filter((id) => id !== memberId);
            }
        }

        if (!memberIds.includes(adminId)) {
            memberIds.push(adminId);
        }

        if (dto.addMembers || dto.removeMembers) {
            updates.members = memberIds;
        }

        return this.conversationPort.update(conversationId, updates);
    }
}
