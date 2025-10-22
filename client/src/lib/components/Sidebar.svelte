<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "@roxi/routify";
    import * as chat from "../../application/services/chatService";
    import * as auth from "../../application/services/authService";
    import { currentPage, currentChatId, navigateTo } from "../../lib/stores/navigation";
    import {
        conversationsStore,
        refreshConversations,
    } from "../../lib/stores/conversations";
    import type { IPopulatedConversation } from "../../domain";

    let conversations: IPopulatedConversation[] = [];
    let loading: boolean = false;
    let error: string = "";

    async function loadConversations() {
        loading = true;
        try {
            conversations = await chat.fetchConversations();
            conversationsStore.set(conversations);
            error = "";
        } catch (e) {
            error = "Failed to load conversations";
        }
        loading = false;
    }

    conversationsStore.subscribe((value) => {
        conversations = value;
    });

    onMount(async () => {
        await loadConversations();
        refreshConversations.set(loadConversations);
    });

    function goProfile() {
        navigateTo('profile', null);
    }

    function goNewConversation() {
        navigateTo('new-conversation', null);
    }

    function goToConversation(id: string) {
        console.log("Navigating to conversation", id);
        navigateTo('chat', id);
    }

    function logout() {
        // auth.logout();
        navigateTo('login', null);
        window.location.href = "/login";
    }
</script>

<aside class="sidebar">
    <div>
        <div class="sidebar-top">
            <h2 style="margin: 0;">Svelte + NestJs</h2>
            <button class="new-btn" type="button" onclick={goNewConversation} title="New Conversation">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" height="15"><path fill="#fff" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/></svg>
            </button>
        </div>
        <div
            class="spacer"
            style="
                height:8px;
                border-bottom:1px solid #2f3136;
                margin:12px 0;
            "
        ></div>
        <div class="conv-list">
            {#if loading}
                <div>Loading...</div>
            {:else if error}
                <div style="color: red">{error}</div>
            {:else}
                {#each conversations as c}
                    <button
                        class="conv-item"
                        type="button"
                        onclick={() => goToConversation(c._id)}
                    >
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20"><path fill="#b9bbbe" d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/></svg>
        </button>
        <button type="button" onclick={logout} title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20"><path fill="#b9bbbe" d="M345 273c9.4-9.4 9.4-24.6 0-33.9L201 95c-6.9-6.9-17.2-8.9-26.2-5.2S160 102.3 160 112l0 80-112 0c-26.5 0-48 21.5-48 48l0 32c0 26.5 21.5 48 48 48l112 0 0 80c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2L345 273zm7 143c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0z"/></svg>
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
    .sidebar-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .new-btn {
        background: #5a6fd8;
        color: white;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        padding: 0;
        font-size: 20px;
    }
    .new-btn:hover {
        background: #4e5fc2;
    }
    .conv-item {
        display: block;
        padding: 8px;
        color: inherit;
        text-decoration: none;
        border-radius: 6px;
        margin-bottom: 6px;
        background: #2f3136;
        border: none;
        text-align: left;
        cursor: pointer;
    }
    .conv-item:hover {
        background: #393c43;
    }
    .conv-item:hover {
        background: #393c43;
    }
    .sidebar-bottom {
        display: flex;
        gap: 8px;
    }
</style>
