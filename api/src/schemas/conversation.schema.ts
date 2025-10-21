import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
    members: string[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    admin: string;

    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    blockedUsers: string[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
