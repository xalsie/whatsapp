import { Injectable, Inject } from '@nestjs/common';
import type { ConversationPort } from '../ports/conversation.port';
import type { UserPort } from '../../users/ports/user.port';
import { CreateConversationByEmailDTO } from '../dto/create-conversation-by-email.dto';

@Injectable()
export class CreateConversationByEmailUseCase {
    constructor(
        @Inject('ConversationRepository')
        private readonly conversationPort: ConversationPort,
        @Inject('UserRepository') private readonly userPort: UserPort,
    ) {}

    async execute(dto: CreateConversationByEmailDTO, creatorId: string) {
        const creator = await this.userPort.findById(creatorId);
        if (!creator) {
            throw new Error('Creator not found');
        }
        const creatorEmail = creator.email;

        const memberEmails = [creatorEmail, ...dto.emails];
        const memberIds: string[] = [];

        for (const email of memberEmails) {
            if (!email) {
                throw new Error('Email cannot be empty');
            }
            const user = await this.userPort.findByEmail(email);
            if (!user) {
                throw new Error(`User with email ${email} not found`);
            }
            memberIds.push(user._id);
        }

        return this.conversationPort.create(dto.name || 'New Conversation', memberIds, creatorId);
    }
}
