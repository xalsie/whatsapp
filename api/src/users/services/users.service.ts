import { Injectable, Inject } from '@nestjs/common';
import type { UserPort } from '../ports/user.port';
import type { UserEntity } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import type { ConversationPort } from '../../conversations/ports/conversation.port';

@Injectable()
export class UsersService {
    constructor(
        @Inject('UserRepository') private readonly userRepo: UserPort,
        @Inject('ConversationRepository') private readonly conversationPort: ConversationPort,
    ) {}

    async create(
        username: string,
        password: string,
        firstname?: string,
        lastname?: string,
        email?: string,
        options?: {
            color?: string;
            theme?: 'light' | 'dark';
        },
    ): Promise<UserEntity> {
        const createdUser = await this.userRepo.create(
            username,
            password,
            firstname,
            lastname,
            email,
            options,
        );
        const generalConversation = '695be8641909d30d16e9496b';
        const conversation = await this.conversationPort.find(generalConversation);
        if (!conversation) {
            throw new Error('General conversation not found');
        }

        const existingMemberIds = conversation.members.map((member) => {
            if (typeof member === 'string') {
                return member;
            }
            return String((member as UserEntity).id);
        });

        if (!existingMemberIds.includes(String(createdUser.id))) {
            existingMemberIds.push(String(createdUser.id));
            console.log('Updated conversation members:', existingMemberIds);
            await this.conversationPort.update(generalConversation, {
                members: existingMemberIds,
            });
        }
        return createdUser;
    }

    async findByUsername(username: string): Promise<UserEntity | null> {
        return this.userRepo.findByUsername(username);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepo.findByEmail(email);
    }

    async validateUser(username: string, password: string): Promise<UserEntity | null> {
        let user = await this.findByUsername(username);
        if (!user) {
            user = await this.findByEmail(username);
        }
        if (!user) return null;
        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;
        return user;
    }

    async updateProfile(
        id: string,
        updates: { username?: string; color?: string },
    ): Promise<UserEntity | null> {
        return await this.userRepo.updateProfile(id, updates);
    }
}
