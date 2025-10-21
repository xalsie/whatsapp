import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { Conversation } from '../../../../schemas/conversation.schema';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';

type ConversationDoc = HydratedDocument<Conversation>;

@Injectable()
export class MongooseConversationRepository {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<ConversationDoc>,
    ) {}

    async create(name: string, members: string[], admin: string): Promise<ConversationDoc> {
        const created = new this.conversationModel({ name, members, admin, blockedUsers: [] });
        return await created.save();
    }

    async find(id: string): Promise<ConversationDoc | null> {
        const doc = await this.conversationModel
            .findById(id)
            .populate('members', 'username email _id')
            .populate('admin', 'username email _id')
            .exec();
        if (!doc) return null;
        return doc;
    }

    async findByUser(userId: string): Promise<ConversationDoc[] | null> {
        const docs = await this.conversationModel
            .find({ members: userId })
            .populate('members', 'username email _id')
            .populate('admin', 'username email _id')
            .exec();
        return docs;
    }

    async update(id: string, updates: Partial<ConversationEntity>): Promise<ConversationDoc> {
        const doc = await this.conversationModel
            .findByIdAndUpdate(id, { $set: updates }, { new: true })
            .exec();
        if (!doc) {
            throw new Error('Conversation not found');
        }
        return doc;
    }
}
