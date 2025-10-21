import { Module } from '@nestjs/common';
import { MongooseUserRepository } from './database/mongoose/repositories/mongoose-user.repository';
import { MongooseMessageRepository } from './database/mongoose/repositories/mongoose-message.repository';
import { MongooseDatabaseModule } from './database/mongoose/mongoose.module';
import { MongooseConversationRepository } from './database/mongoose/repositories/mongoose-conversation.repository';

@Module({
    imports: [MongooseDatabaseModule],
    providers: [
        { provide: 'UserRepository', useClass: MongooseUserRepository },
        { provide: 'MessageRepository', useClass: MongooseMessageRepository },
        {
            provide: 'ConversationRepository',
            useClass: MongooseConversationRepository,
        },
    ],
    exports: ['UserRepository', 'MessageRepository', 'ConversationRepository'],
})
export class InfrastructureModule {}
