import { MessageEntity } from '../entities/message.entity';

export interface MessageRepository {
    create(from: string, text: string, conversationId: string): Promise<MessageEntity>;
    findAll(): Promise<MessageEntity[]>;
    findByConversation(conversationId: string): Promise<MessageEntity[]>;
}
