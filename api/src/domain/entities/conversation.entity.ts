import { UserEntity } from './user.entity';

export interface ConversationEntity {
    _id: string;
    name: string;
    members: UserEntity[] | string[];
    admin: string | UserEntity;
    blockedUsers?: string[];
    createdAt?: Date;
}
