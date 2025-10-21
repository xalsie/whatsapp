import { Module } from '@nestjs/common';
import { MongooseDatabaseModule } from './infrastructure/database/mongoose/mongoose.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { AuthController } from './users/controllers/auth.controller';
import { ChatGateway } from './infrastructure/websocket/chat.gateway';

@Module({
    imports: [
        MongooseDatabaseModule,
        InfrastructureModule,
        UsersModule,
        ConversationsModule,
        MessagesModule,
    ],
    controllers: [AuthController],
    providers: [ChatGateway],
})
export class AppModule {}
