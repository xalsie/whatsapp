<script lang="ts">
    import type { IPopulatedConversation } from '../../domain';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import * as chat from '../../application/services/chatService';
    import * as auth from '../../application/services/authService';
    import { currentPage } from '../../lib/stores/navigation';
    import { refreshConversations } from '../../lib/stores/conversations';

    let { conversationId } = $props();

    let conversation = $state<IPopulatedConversation | null>(null);
    let users = $state<any[]>([]);
    let newMemberEmail = $state('');
    let newName = $state('');
    let loading = $state(false);
    let error = $state('');
    let success = $state('');

    let currentUserId = $state('');
    let isAdmin = $state(false);

    onMount(async () => {
        // Get current user
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                currentUserId = user.id;
            } catch (e) {
                console.error('Failed to parse user data', e);
            }
        }

        await loadConversation();
        await loadUsers();
    });

    async function loadConversation() {
        try {
            conversation = await chat.fetchConversation(conversationId);
            if (conversation) {
                newName = conversation.name;
                isAdmin = (typeof conversation.admin === 'string' ? conversation.admin : conversation.admin._id) === currentUserId;
            }
        } catch (e) {
            error = 'Failed to load conversation';
        }
    }

    async function loadUsers() {
        try {
            // TODO: Add API endpoint to get all users
            // For now, we'll use a placeholder
            users = [];
        } catch (e) {
            console.error('Failed to load users', e);
        }
    }

    async function updateConversationName() {
        if (!conversation || !isAdmin) return;

        loading = true;
        error = '';
        success = '';

        try {
            await chat.updateConversation(conversation._id, { name: newName });
            success = 'Nom mis à jour !';
            conversation.name = newName;
            // Update the sidebar by refreshing conversations
            window.location.reload(); // Simple refresh for now
        } catch (e) {
            error = 'Erreur lors de la mise à jour';
        }

        loading = false;
    }

    async function addMember() {
        if (!conversation || !isAdmin || !newMemberEmail) return;

        loading = true;
        error = '';
        success = '';

        try {
            await chat.addMemberToConversation(conversation._id, newMemberEmail);
            success = 'Membre ajouté !';
            newMemberEmail = '';
            await loadConversation();
            // Refresh conversations list in sidebar
            const refreshFn = get(refreshConversations);
            if (refreshFn) {
                refreshFn();
            }
        } catch (e) {
            error = 'Erreur lors de l\'ajout du membre';
        }

        loading = false;
    }

    async function removeMember(memberId: string) {
        if (!conversation || !isAdmin || memberId === conversation.admin) return;

        loading = true;
        error = '';
        success = '';

        try {
            await chat.removeMemberFromConversation(conversation._id, memberId);
            success = 'Membre retiré !';
            await loadConversation();
            
            // Refresh conversations list in sidebar
            const refreshFn = get(refreshConversations);
            if (refreshFn) {
                refreshFn();
            }
        } catch (e) {
            error = 'Erreur lors du retrait du membre';
        }

        loading = false;
    }

    function goBack() {
        currentPage.set('chat');
    }
</script>

{#if conversation}
    <div class="conversation-settings">
        <div class="header">
            <button onclick={goBack} class="back-btn">← Retour</button>
            <h2>Paramètres de {conversation.name}</h2>
        </div>

        {#if success}
            <div class="success">{success}</div>
        {/if}

        {#if error}
            <div class="error">{error}</div>
        {/if}

        {#if isAdmin}
            <div class="section">
                <h3>Renommer la conversation</h3>
                <input type="text" bind:value={newName} placeholder="Nouveau nom" />
                <button onclick={updateConversationName} disabled={loading || !newName}>
                    Renommer
                </button>
            </div>

            <div class="section">
                <h3>Ajouter un membre</h3>
                <input type="email" bind:value={newMemberEmail} placeholder="Email du membre" />
                <button onclick={addMember} disabled={loading || !newMemberEmail}>
                    Ajouter
                </button>
            </div>

            <div class="section">
                <h3>Membres ({conversation.members.length})</h3>
                <div class="members-list">
                    {#each conversation.members as member}
                        <div class="member-item">
                            <span>{member.username || member}</span>
                            {#if member._id !== (typeof conversation.admin === 'string' ? conversation.admin : conversation.admin._id)}
                                <button onclick={() => removeMember(member._id)} disabled={loading}>
                                    Retirer
                                </button>
                            {:else}
                                <span class="admin-badge">Admin</span>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {:else}
            <div class="section">
                <p>Seul l'administrateur peut modifier les paramètres de cette conversation.</p>
            </div>
        {/if}
    </div>
{:else}
    <div class="loading">Chargement...</div>
{/if}

<style>
    .conversation-settings {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
    }

    .header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
    }

    .back-btn {
        background: #5865f2;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
    }

    .section {
        margin-bottom: 30px;
        padding: 20px;
        background: #2f3136;
        border-radius: 8px;
    }

    .section h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #fff;
    }

    .section input {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #40444b;
        border-radius: 4px;
        background: #202225;
        color: #fff;
    }

    .section button {
        background: #5865f2;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
    }

    .section button:hover:not(:disabled) {
        background: #4752c4;
    }

    .section button:disabled {
        background: #40444b;
        cursor: not-allowed;
    }

    .members-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .member-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: #202225;
        border-radius: 4px;
    }

    .admin-badge {
        background: #faa61a;
        color: #000;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
    }

    .success {
        color: #3ba55d;
        padding: 10px;
        background: rgba(59, 165, 93, 0.1);
        border-radius: 4px;
        margin-bottom: 20px;
    }

    .error {
        color: #ed4245;
        padding: 10px;
        background: rgba(237, 66, 69, 0.1);
        border-radius: 4px;
        margin-bottom: 20px;
    }

    .loading {
        text-align: center;
        padding: 40px;
        color: #b9bbbe;
    }
</style>