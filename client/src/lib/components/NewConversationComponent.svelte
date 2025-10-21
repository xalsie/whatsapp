<script lang="ts">
    import { get } from 'svelte/store';
    import * as api from '../../application/services/chatService';
    import { currentPage, currentChatId } from '../../lib/stores/navigation';
    import { refreshConversations } from '../../lib/stores/conversations';

    let conversationName = $state('');
    let memberEmail = $state('');
    let error = $state('');
    let loading = $state(false);

    async function createConversation() {
        error = '';
        loading = true;
        try {
            const conversation = await api.createConversationByEmail(conversationName, memberEmail);
            conversationName = '';
            memberEmail = '';

            if (conversation && conversation._id) {
                const refreshFn = get(refreshConversations);
                if (refreshFn) {
                    refreshFn();
                }

                currentPage.set('chat');
                currentChatId.set(conversation._id);
                return;
            }
        } catch (e) {
            console.error('Failed to create conversation', e);
            error = 'Impossible de créer la conversation.';
        }
        loading = false;
    }
</script>

<div class="new-conversation">
    <h2>Créer une conversation privée</h2>
    {#if error}
        <div style="color: red">{error}</div>
    {/if}
    <div>
        <label for="conversation-name">Nom de la conversation :</label>
        <input id="conversation-name" type="text" bind:value={conversationName} placeholder="nom de la conversation" />
    </div>
    <div>
        <label for="member-email">Email du membre à ajouter :</label>
        <input id="member-email" type="email" bind:value={memberEmail} placeholder="email utilisateur" />
        <button onclick={createConversation} disabled={loading || !conversationName || !memberEmail}>
            Créer
        </button>
    </div>
</div>
