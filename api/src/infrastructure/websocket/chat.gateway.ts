import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../../messages/services/messages.service';
import { verifyJwt } from '../config/jwt.util';
import { MessageEntity } from '../../domain/entities/message.entity';

interface ChatMessage {
    from: string;
    text: string;
    conversationId: string;
}

interface TypingMessage {
    userId: string;
    conversationId: string;
    isTyping: boolean;
}

interface AuthenticatedSocket extends Socket {
    user?: { id: string; username: string } | null;
}

interface HandshakeAuth {
    auth?: { token?: string };
}

@WebSocketGateway({ cors: { origin: ['http://localhost:5173'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly messagesService: MessagesService) {}

    handleConnection(client: Socket) {
        const sock = client as AuthenticatedSocket;
        const handshake = sock.handshake as unknown as HandshakeAuth;
        let token: string | undefined;
        if (handshake.auth && handshake.auth.token) {
            token = String(handshake.auth.token);
        }
        const user = token ? (verifyJwt(token) as { id: string; username: string }) : null;
        if (!user) {
            sock.emit('error', 'Unauthorized: invalid or missing token');
            sock.disconnect(true);
            return;
        }

        sock.user = user;
        console.log(`User ${user.username} connected with socket ${sock.id}`);
    }

    handleDisconnect(client: Socket) {
        const sock = client as AuthenticatedSocket;
        if (sock.user) {
            console.log(`User ${sock.user.username} disconnected from socket ${sock.id}`);
        }
    }

    @SubscribeMessage('joinConversation')
    handleJoinConversation(
        @MessageBody() conversationId: string,
        @ConnectedSocket() client: Socket,
    ) {
        const sock = client as AuthenticatedSocket;
        const user = sock.user;
        if (!user) {
            console.log('Unauthenticated client tried to join conversation');
            sock.emit('error', 'Unauthorized: please authenticate first');
            return;
        }

        console.log(
            `User ${user.username} (${sock?.id || 'unknown'}) joining conversation ${conversationId}`,
        );
        if (client && client.join) {
            void client.join(conversationId);
            console.log(`User ${user.username} successfully joined conversation ${conversationId}`);
        } else {
            console.error('Invalid client socket for joining conversation');
        }
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() payload: ChatMessage, @ConnectedSocket() client: Socket) {
        const sock = client as AuthenticatedSocket;
        const user = sock.user;
        if (!user) {
            console.log('Unauthenticated client tried to send message');
            sock.emit('error', 'Unauthorized: please authenticate first');
            return;
        }

        console.log(`Received message from ${user.username}:`, payload);
        payload.from = user.username;

        let savedMessage: MessageEntity | null = null;
        try {
            await this.messagesService.create(user.id, payload.text, payload.conversationId);
            const messages = await this.messagesService.findByConversation(payload.conversationId);
            savedMessage = messages[messages.length - 1];
            console.log('Message saved and populated:', savedMessage);
        } catch (err) {
            console.error('Failed to save message:', err);
        }
        console.log(`Broadcasting message to room ${payload.conversationId}`);
        if (savedMessage) {
            this.server.to(payload.conversationId).emit('message', savedMessage);
        }
    }

    @SubscribeMessage('typing')
    handleTyping(@MessageBody() payload: TypingMessage, @ConnectedSocket() client: Socket) {
        const sock = client as AuthenticatedSocket;
        const user = sock.user;
        if (!user) {
            console.log('Unauthenticated client tried to send typing event');
            sock.emit('error', 'Unauthorized: please authenticate first');
            return;
        }

        console.log(
            `User ${user.username} ${payload.isTyping ? 'started' : 'stopped'} typing in conversation ${payload.conversationId}`,
        );

        client.to(payload.conversationId).emit('typing', {
            userId: user.username,
            conversationId: payload.conversationId,
            isTyping: payload.isTyping,
        });
    }
}
