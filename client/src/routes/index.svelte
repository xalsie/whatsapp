<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import { goto } from '@roxi/routify';
    import * as auth from '../application/services/authService';
    import { currentPage, currentChatId, navigateTo, urlFor } from '../lib/stores/navigation';
    import { parseHashValue } from '../lib/navigation/routes';
    import type { Page } from '../lib/navigation/types';

    import Sidebar from '../lib/components/Sidebar.svelte';
    import ProfileComponent from '../lib/components/ProfileComponent.svelte';
    import NewConversationComponent from '../lib/components/NewConversationComponent.svelte';
    import ChatComponent from '../lib/components/ChatComponent.svelte';
    import ConversationSettingsComponent from '../lib/components/ConversationSettingsComponent.svelte';

    let page: Page = null;
    let chatId: string | null = null;

    const unsubPage = currentPage.subscribe((v) => (page = v));
    const unsubChat = currentChatId.subscribe((v) => (chatId = v));

    // Route helpers live in ../lib/navigation/routes

    function syncUrl() {
        const p = get(currentPage);
        const id = get(currentChatId);
        const url = urlFor(p, id ?? null);
        if (location.hash !== url.split('#')[1]) {
            history.pushState(null, '', url);
        }
    }

    function parseHash() {
        const raw = (location.hash || '#/').replace(/^#\//, '');
        const res = parseHashValue(location.hash);
        currentPage.set(res.page);
        currentChatId.set(res.id);
    }

    const unsubSync1 = currentPage.subscribe(() => syncUrl());
    const unsubSync2 = currentChatId.subscribe(() => syncUrl());

    onMount(() => {
        parseHash();

        window.addEventListener('hashchange', parseHash);

        if (!auth.checkTokenExpiry()) {
            $goto('/login');
            return;
        }

        syncUrl();
    });

    onDestroy(() => {
        unsubPage();
        unsubChat();
        unsubSync1();
        unsubSync2();
        window.removeEventListener('hashchange', parseHash);
    });
</script>

<div class="app-root">
    <Sidebar />

    <main class="main-area">
        {#if page === 'new-conversation'}
            <NewConversationComponent />
        {:else if page === 'chat' && chatId}
            <ChatComponent conversationId={chatId} />
        {:else if page === 'conversation-settings' && chatId}
            <ConversationSettingsComponent conversationId={chatId} />
        {:else if page === 'profile'}
            <ProfileComponent />
        {/if}
    </main>
</div>

<style>
    .app-root {
        display: flex;
        height: 100vh;
        background: #36393f;
        color: white;
    }
    .main-area {
        flex: 1;
        padding: 0;
        overflow: auto;
    }
</style>
