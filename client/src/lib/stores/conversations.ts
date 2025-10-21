import { writable } from 'svelte/store';
import type { IPopulatedConversation } from '../../domain';

export const conversationsStore = writable<IPopulatedConversation[]>([]);
export const refreshConversations = writable<() => void>();
