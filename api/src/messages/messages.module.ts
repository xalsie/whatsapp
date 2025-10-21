import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { MessageController } from './controllers/message.controller';
import { MessagesService } from './services/messages.service';
import { SendMessageUseCase } from './use-cases/send-message.usecase';
import { GetConversationMessagesUseCase } from './use-cases/get-conversation-messages.usecase';

@Module({
    imports: [InfrastructureModule],
    controllers: [MessageController],
    providers: [MessagesService, SendMessageUseCase, GetConversationMessagesUseCase],
    exports: [MessagesService, SendMessageUseCase, GetConversationMessagesUseCase],
})
export class MessagesModule {}
