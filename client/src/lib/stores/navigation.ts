import { writable } from 'svelte/store';

export type Page = 'conversations' | 'profile' | 'new-conversation' | 'chat' | 'login' | 'conversation-settings';

export const currentPage = writable<Page>('conversations');
export const currentChatId = writable<string | null>(null);