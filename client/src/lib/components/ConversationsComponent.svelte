<script lang="ts">
    import { onMount } from 'svelte';
    import * as chat from '../../application/services/chatService';
    import { goto } from '@roxi/routify';

    import type { IPopulatedConversation } from '../../domain';

    let conversations: Array<IPopulatedConversation> = $state([]);
    let loading = $state(false);
    let error = $state('');

    onMount(async () => {
        console.log("Loading conversations...");
        loading = true;
        try {
            conversations = await chat.fetchConversations();
        } catch (e) {
            error = 'Failed to load conversations';
        }
        loading = false;
    });

    function selectConversation(conversationId: string) {
        $goto(`/Chat/${conversationId}`);
    }

    function newConversation() {
        $goto('/NewConversation');
    }
</script>

<div class="conversations">
    <h3>Mes conversations</h3>
    {#if loading}
        <p>Loading...</p>
    {:else if error}
        <p style="color: red">{error}</p>
    {:else}
        <ul>
        {#each conversations as c}
            <li>
                <button type="button" onclick={() => selectConversation(c._id)} class="conversation-item">
                    Conversation avec {c.members.join(', ')}
                </button>
            </li>
        {/each}
        </ul>
    {/if}
    <button onclick={newConversation} class="new-conv-btn">Nouvelle conversation</button>
</div>
