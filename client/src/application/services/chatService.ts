import type { Socket } from "socket.io-client";
import {
    connect,
    getSocket,
    disconnect,
} from "../../infrastructure/socket/socketClient";
import * as api from "../../infrastructure/http/apiClient";
import { getToken } from "./authService";

import type { IConversation, IPopulatedConversation } from "../../domain";

export async function connectToChat() {
    const token = getToken();
    const socket = connect(token);
    return socket as Socket;
}

export function getChatSocket() {
    return getSocket() as Socket | null;
}

export function leaveChat() {
    disconnect();
}

export async function createConversationByEmail(name: string, email: string) {
    const token = getToken();
    // Backend should accept { name, emails: [email] }
    return api.post('/conversations/by-email', { name, emails: [email] }, token);
}

export async function fetchHistory(conversationId?: string) {
    const token = getToken();
    const path = conversationId ? `/conversations/${conversationId}/messages` : '/messages';
    return api.get(path, token);
}

export function sendMessage(payload: { text: string; conversationId: string }) {
    const s = getSocket();
    if (!s) throw new Error("Not connected");
    const userStr = localStorage.getItem('user');
    let userId = '';
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userId = user.id;
        } catch {}
    }
    s.emit("message", { ...payload, from: userId });
}

export async function updateConversation(conversationId: string, updates: { name?: string; addMembers?: string[]; removeMembers?: string[] }) {
    const token = getToken();
    return api.put(`/conversations/${conversationId}`, updates, token);
}

export async function addMemberToConversation(conversationId: string, email: string) {
    const token = getToken();
    return api.put(`/conversations/${conversationId}`, { addMembers: [email] }, token);
}

export async function removeMemberFromConversation(conversationId: string, memberId: string) {
    const token = getToken();
    return api.put(`/conversations/${conversationId}`, { removeMembers: [memberId] }, token);
}

export async function fetchConversations(): Promise<IPopulatedConversation[]> {
    const token = getToken();
    return api.get('/conversations', token);
}

export async function fetchConversation(conversationId: string): Promise<IPopulatedConversation> {
    const token = getToken();
    return api.get(`/conversations/${conversationId}`, token);
}

export async function createConversation(members: string[]) {
    const token = getToken();
    return api.post('/conversations', { members });
}

export function sendTyping(conversationId: string, isTyping: boolean) {
    const s = getSocket();
    if (!s) return;
    const userStr = localStorage.getItem('user');
    let userId = '';
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userId = user.id;
        } catch {}
    }
    s.emit("typing", { conversationId, userId, isTyping });
}
