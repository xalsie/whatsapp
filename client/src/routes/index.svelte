<script lang="ts">
    // Page d'accueil avec navigation par state
    import { onMount } from 'svelte';
    import { goto } from '@roxi/routify';
    import * as auth from '../application/services/authService';
    import { currentPage, currentChatId } from '../lib/stores/navigation';

    import Sidebar from '../lib/components/Sidebar.svelte';
    import ConversationsComponent from '../lib/components/ConversationsComponent.svelte';
    import ProfileComponent from '../lib/components/ProfileComponent.svelte';
    import NewConversationComponent from '../lib/components/NewConversationComponent.svelte';
    import ChatComponent from '../lib/components/ChatComponent.svelte';
    import LoginComponent from '../lib/components/LoginComponent.svelte';
    import ConversationSettingsComponent from '../lib/components/ConversationSettingsComponent.svelte';

    let page: string = 'conversations';
    let chatId: string | null = null;

    currentPage.subscribe(value => page = value);
    currentChatId.subscribe(value => chatId = value);

    onMount(() => {
        if (!auth.checkTokenExpiry()) {
            $goto('/login');
        }
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
