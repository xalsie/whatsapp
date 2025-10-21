import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
    create(
        username: string,
        password: string,
        firstname?: string,
        lastname?: string,
        email?: string,
        options?: { color?: string; theme?: 'light' | 'dark' },
    ): Promise<UserEntity>;
    findByUsername(username: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    updateProfile(
        id: string,
        updates: { username?: string; color?: string },
    ): Promise<UserEntity | null>;
}
