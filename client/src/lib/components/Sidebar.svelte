<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '@roxi/routify';
    import * as chat from '../../application/services/chatService';
    import * as auth from '../../application/services/authService';
    import { currentPage, currentChatId } from '../../lib/stores/navigation';
    import { conversationsStore, refreshConversations } from '../../lib/stores/conversations';
    import type { IPopulatedConversation } from '../../domain';

    let conversations: IPopulatedConversation[] = [];
    let loading: boolean = false;
    let error: string = '';

    async function loadConversations() {
        loading = true;
        try {
            conversations = await chat.fetchConversations();
            conversationsStore.set(conversations);
            error = '';
        } catch (e) {
            error = 'Failed to load conversations';
        }
        loading = false;
    }

    // Subscribe to conversations store
    conversationsStore.subscribe(value => {
        conversations = value;
    });

    onMount(async () => {
        await loadConversations();
        // Set the refresh function in the store
        refreshConversations.set(loadConversations);
    });

    // function goConversations() {
    //     currentPage.set('conversations');
    // }

    function goProfile() {
        currentPage.set('profile');
    }

    function goNewConversation() {
        currentPage.set('new-conversation');
    }

    function goToConversation(id: string) {
        console.log('Navigating to conversation', id);
        currentPage.set('chat');
        currentChatId.set(id);
    }

    function logout() {
        auth.logout();
        currentPage.set('login');
        window.location.href = '/login';
    }
</script>

<aside class="sidebar">
    <div >
        <div class="sidebar-top">
            <h2 style="margin: 0;">Svelte + NestJs</h2>
            <button class="new-btn" type="button" onclick={goNewConversation}> + </button>
        </div>
        <div class="spacer" style="
            height:8px;
            border-bottom:1px solid #2f3136;
            margin:12px 0;
        "></div>
        <div class="conv-list">
            {#if loading}
                <div>Loading...</div>
            {:else if error}
                <div style="color: red">{error}</div>
            {:else}
                {#each conversations as c}
                    <button class="conv-item" type="button" onclick={() => goToConversation(c._id)}>
                        {c.name}
                    </button>
                {/each}
            {/if}
        </div>
    </div>
    <div class="sidebar-bottom">
        <div style="flex-grow:1; align-self:center; color:#b9bbbe; font-size:14px;">
            Connecté en tant que {auth.getUser()?.username}
        </div>
        <button type="button" onclick={goProfile} title="Profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#b9bbbe" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </button>
        <button type="button" onclick={logout} title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#b9bbbe" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
        </button>
    </div>
</aside>

<style>
    .sidebar {
        width: 260px;
        background: #202225;
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .sidebar-top { display:flex; align-items:center; justify-content:space-between; }
    .new-btn { background:#3ba55d; color:white; border:none; width:32px; height:32px; border-radius:6px; padding: 0; }
    .conv-item { display:block; padding:8px; color:inherit; text-decoration:none; border-radius:6px; margin-bottom:6px; background:#2f3136; border: none; text-align: left; cursor: pointer; }
    .conv-item:hover { background:#393c43 }
    .conv-item:hover { background:#393c43 }
    .sidebar-bottom { display:flex; gap:8px; }
</style>
