import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
    @Prop({ required: true, type: 'ObjectId', ref: 'User' })
    from: string;

    @Prop({ required: true })
    text: string;

    @Prop({ required: true, type: String, ref: 'Conversation' })
    conversationId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
