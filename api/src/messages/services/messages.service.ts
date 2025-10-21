import { Injectable, Inject } from '@nestjs/common';
import type { MessageRepository } from '../../domain/repositories/message.repository';
import { MessageEntity } from '../../domain/entities/message.entity';

@Injectable()
export class MessagesService {
    constructor(@Inject('MessageRepository') private readonly repo: MessageRepository) {}

    async create(from: string, text: string, conversationId: string): Promise<MessageEntity> {
        return this.repo.create(from, text, conversationId);
    }

    async findByConversation(conversationId: string): Promise<MessageEntity[]> {
        return this.repo.findByConversation(conversationId);
    }
}
