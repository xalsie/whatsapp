import { UserEntity } from './user.entity';

type User = Pick<UserEntity, '_id' | 'username'> & { options?: { color?: string } };

export interface MessageEntity {
    _id: string;
    from: User | string;
    text: string;
    conversationId: string;
    createdAt?: Date;
}
