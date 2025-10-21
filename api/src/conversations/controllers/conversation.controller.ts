import { Controller, Post, Put, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateConversationByEmailDTO } from '../dto/create-conversation-by-email.dto';
import { UpdateConversationDTO } from '../dto/update-conversation.dto';
import { CreateConversationByEmailUseCase } from '../use-cases/create-conversation-by-email.usecase';
import { UpdateConversationUseCase } from '../use-cases/update-conversation.usecase';
import { GetUserConversationsUseCase } from '../use-cases/get-user-conversations.usecase';
import { GetConversationUseCase } from '../use-cases/get-conversation.usecase';
import { BlockUserFromConversationUseCase } from '../use-cases/block-user-from-conversation.usecase';
import { UnblockUserFromConversationUseCase } from '../use-cases/unblock-user-from-conversation.usecase';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationController {
    constructor(
        private readonly createConversationByEmailUseCase: CreateConversationByEmailUseCase,
        private readonly updateConversationUseCase: UpdateConversationUseCase,
        private readonly getUserConversationsUseCase: GetUserConversationsUseCase,
        private readonly getConversationUseCase: GetConversationUseCase,
        private readonly blockUserFromConversationUseCase: BlockUserFromConversationUseCase,
        private readonly unblockUserFromConversationUseCase: UnblockUserFromConversationUseCase,
    ) {}

    @Post('by-email')
    createByEmail(@Body() dto: CreateConversationByEmailDTO, @CurrentUser() user: { id: string }) {
        return this.createConversationByEmailUseCase.execute(dto, user.id);
    }

    @Put(':id')
    updateConversation(
        @Param('id') conversationId: string,
        @Body() dto: UpdateConversationDTO,
        @CurrentUser() user: { id: string },
    ) {
        console.log('Updating conversation', conversationId, 'with data', dto, 'by user', user.id);
        return this.updateConversationUseCase.execute(conversationId, dto, user.id);
    }

    @Get()
    getUserConversations(@CurrentUser() user: { id: string }) {
        return this.getUserConversationsUseCase.execute(user.id);
    }

    @Get(':id')
    getConversation(@Param('id') conversationId: string) {
        return this.getConversationUseCase.execute(conversationId);
    }

    @Post(':id/block')
    blockUser(
        @Param('id') conversationId: string,
        @Body() body: { userId: string },
        @CurrentUser() user: { id: string },
    ) {
        return this.blockUserFromConversationUseCase.execute(conversationId, user.id, body.userId);
    }

    @Delete(':id/block')
    unblockUser(
        @Param('id') conversationId: string,
        @Body() body: { userId: string },
        @CurrentUser() user: { id: string },
    ) {
        return this.unblockUserFromConversationUseCase.execute(
            conversationId,
            user.id,
            body.userId,
        );
    }
}
