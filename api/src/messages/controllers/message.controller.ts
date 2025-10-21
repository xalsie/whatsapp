import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';
import { SendMessageUseCase } from '../use-cases/send-message.usecase';
import { GetConversationMessagesUseCase } from '../use-cases/get-conversation-messages.usecase';
import { SendMessageDTO } from '../dto/send-message.dto';

@Controller('conversations/:conversationId/messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
    constructor(
        private readonly sendMessageUseCase: SendMessageUseCase,
        private readonly getConversationMessagesUseCase: GetConversationMessagesUseCase,
    ) {}

    @Post()
    async sendMessage(
        @Param('conversationId') conversationId: string,
        @Body() dto: SendMessageDTO,
        @CurrentUser() user: { id: string },
    ) {
        dto.conversationId = conversationId;
        dto.from = user.id;
        return this.sendMessageUseCase.execute(dto);
    }

    @Get()
    async getMessages(
        @Param('conversationId') conversationId: string,
        @CurrentUser() user: { id: string },
    ) {
        console.log(`Getting messages for conversation ${conversationId}`);
        const messages = await this.getConversationMessagesUseCase.execute(conversationId, user.id);
        console.log(`Found ${messages.length} messages for conversation ${conversationId}`);
        return messages;
    }
}
