import { writable } from 'svelte/store';
import type { Page } from '../navigation/types';
import { buildHash } from '../navigation/routes';

export const currentPage = writable<Page>(null);
export const currentChatId = writable<string | null>(null);

// Helper to navigate programmatically and also update the URL hash
export function navigateTo(p: Page, id: string | null = null) {
	currentPage.set(p);
	currentChatId.set(id);
	// Update hash for deep-linking and add a history entry
	const hash = buildHash(p, id);
	if (location.hash !== hash) {
		history.pushState(null, '', `${location.pathname}${hash}`);
	}
}

export function urlFor(p: Page, id: string | null = null) {
	return `${location.pathname}${buildHash(p, id)}`;
}
