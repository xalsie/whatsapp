import { Injectable, Inject } from '@nestjs/common';
import type { UserPort } from '../ports/user.port';
import type { UserEntity } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(@Inject('UserRepository') private readonly userRepo: UserPort) {}

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
        return this.userRepo.create(username, password, firstname, lastname, email, options);
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
