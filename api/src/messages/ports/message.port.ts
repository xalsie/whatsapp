import { MessageEntity } from '../../domain/entities/message.entity';

export interface MessagePort {
    send(from: string, text: string, conversationId: string): Promise<MessageEntity>;
    list(): Promise<MessageEntity[]>;
    findByConversation(conversationId: string): Promise<MessageEntity[]>;
}
