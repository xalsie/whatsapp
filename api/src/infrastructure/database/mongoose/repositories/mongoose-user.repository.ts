import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { User } from '../../../../schemas/user.schema';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { UserEntity } from '../../../../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';

type UserDoc = HydratedDocument<User>;

@Injectable()
export class MongooseUserRepository implements UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDoc>) {}

    async create(
        username: string,
        password: string,
        firstname?: string,
        lastname?: string,
        email?: string,
        options?: { color?: string; theme?: 'light' | 'dark' },
    ): Promise<UserEntity> {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const created = new this.userModel({
            username,
            password: hashed,
            firstname,
            lastname,
            email,
            options,
        });
        return await created.save();
    }

    async findByUsername(username: string): Promise<UserEntity | null> {
        const doc = await this.userModel.findOne({ username }).exec();
        if (!doc) return null;
        return doc;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const doc = await this.userModel.findOne({ email }).exec();
        if (!doc) return null;
        return doc;
    }

    async findById(id: string): Promise<UserEntity | null> {
        const doc = await this.userModel.findById(id).exec();
        if (!doc) return null;
        return doc;
    }

    async updateProfile(
        id: string,
        updates: { username?: string; color?: string },
    ): Promise<UserEntity | null> {
        const doc = await this.userModel
            .findByIdAndUpdate(id, { $set: updates }, { new: true })
            .exec();
        if (!doc) return null;
        return doc;
    }
}
