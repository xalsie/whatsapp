import { UserEntity } from './user.entity';

type User = Pick<UserEntity, 'id' | 'username'> & { options?: { color?: string } };

export interface MessageEntity {
    id: string;
    from: User | string;
    text: string;
    conversationId: string;
    createdAt?: Date;
}
