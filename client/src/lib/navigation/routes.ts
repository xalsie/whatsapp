import type { Page } from './types';

type Route = {
    name: Page | 'conversations';
    pattern: RegExp;
    build: (id?: string | null | undefined) => string;
    extract?: (m: RegExpMatchArray) => { page: Page; id: string | null };
};

const ROUTES: Route[] = [
    { name: 'conversations', pattern: /^$/, build: () => '#/' },
    { name: 'profile', pattern: /^profile$/, build: () => '#/profile' },
    { name: 'new-conversation', pattern: /^new-conversation$/, build: () => '#/new-conversation' },
    {
        name: 'chat',
        pattern: /^chat\/([^/]+)$/,
        build: (id?: string | null) => (id ? `#/chat/${id}` : '#/'),
        extract: (m) => ({ page: 'chat', id: m[1] }),
    },
    {
        name: 'conversation-settings',
        pattern: /^chat\/([^/]+)\/settings$/,
        build: (id?: string | null) => (id ? `#/chat/${id}/settings` : '#/'),
        extract: (m) => ({ page: 'conversation-settings', id: m[1] }),
    },
];

export function buildHash(p: Page, id: string | null | undefined) {
    const route = ROUTES.find((r) => r.name === p);
    if (!route) return '#/';
    return route.build(id ?? null);
}

export function parseHashValue(hash: string) {
    const raw = (hash || '#/').replace(/^#\//, '');
    for (const r of ROUTES) {
        const m = raw.match(r.pattern);
        if (m) {
            if (r.extract) return r.extract(m);
            return { page: (r.name as Page), id: null };
        }
    }
    return { page: null, id: null };
}

export function getRoutes() {
    return ROUTES.slice();
}
