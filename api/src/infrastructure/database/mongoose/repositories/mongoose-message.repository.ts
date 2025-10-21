import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { Message } from '../../../../schemas/message.schema';
import { MessageRepository } from '../../../../domain/repositories/message.repository';
import { MessageEntity } from '../../../../domain/entities/message.entity';
import { MessagePort } from '../../../../messages/ports/message.port';

type MessageDoc = HydratedDocument<Message>;

@Injectable()
export class MongooseMessageRepository implements MessageRepository, MessagePort {
    constructor(@InjectModel(Message.name) private messageModel: Model<MessageDoc>) {}

    async create(from: string, text: string, conversationId: string): Promise<MessageEntity> {
        const created = new this.messageModel({ from, text, conversationId });
        return (await created.save()) as MessageEntity;
    }

    async send(from: string, text: string, conversationId: string): Promise<MessageEntity> {
        return this.create(from, text, conversationId);
    }

    async findAll(): Promise<MessageEntity[]> {
        const docs = await this.messageModel.find().sort({ createdAt: 1 }).exec();
        return docs as MessageEntity[];
    }

    async list(): Promise<MessageEntity[]> {
        return this.findAll();
    }

    async findByConversation(conversationId: string): Promise<MessageEntity[]> {
        const docs = await this.messageModel
            .find({ conversationId })
            .sort({ createdAt: 1 })
            .populate({ path: 'from', select: 'username options.color' })
            .exec();
        return docs as MessageEntity[];
    }
}
