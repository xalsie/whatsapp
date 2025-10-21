import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../../schemas/user.schema';
import { Message, MessageSchema } from '../../../schemas/message.schema';
import { Conversation, ConversationSchema } from '../../../schemas/conversation.schema';

const mongoUri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1/whatsapp';

@Module({
    imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Message.name, schema: MessageSchema },
            { name: Conversation.name, schema: ConversationSchema },
        ]),
    ],
    exports: [MongooseModule],
})
export class MongooseDatabaseModule {}
