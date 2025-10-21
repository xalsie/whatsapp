import { ConversationEntity } from '../../domain/entities/conversation.entity';

export interface ConversationPort {
    create(name: string, members: string[], admin: string): Promise<ConversationEntity>;
    find(id: string): Promise<ConversationEntity | null>;
    findByUser(userId: string): Promise<ConversationEntity[]>;
    update(id: string, updates: Partial<ConversationEntity>): Promise<ConversationEntity>;
}
