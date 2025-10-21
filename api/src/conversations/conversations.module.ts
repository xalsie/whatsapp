import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ConversationController } from './controllers/conversation.controller';
import { CreateConversationByEmailUseCase } from './use-cases/create-conversation-by-email.usecase';
import { UpdateConversationUseCase } from './use-cases/update-conversation.usecase';
import { GetUserConversationsUseCase } from './use-cases/get-user-conversations.usecase';
import { GetConversationUseCase } from './use-cases/get-conversation.usecase';
import { BlockUserFromConversationUseCase } from './use-cases/block-user-from-conversation.usecase';
import { UnblockUserFromConversationUseCase } from './use-cases/unblock-user-from-conversation.usecase';

@Module({
    imports: [InfrastructureModule],
    controllers: [ConversationController],
    providers: [
        CreateConversationByEmailUseCase,
        UpdateConversationUseCase,
        GetUserConversationsUseCase,
        GetConversationUseCase,
        BlockUserFromConversationUseCase,
        UnblockUserFromConversationUseCase,
    ],
    exports: [
        CreateConversationByEmailUseCase,
        UpdateConversationUseCase,
        GetUserConversationsUseCase,
        GetConversationUseCase,
    ],
})
export class ConversationsModule {}
