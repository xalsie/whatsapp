<script lang="ts">
    import { onMount } from 'svelte';
    import * as auth from '../../application/services/authService';
    import { getToken } from '../../application/services/authService';
    import * as api from '../../infrastructure/http/apiClient';

    let username: string = '';
    let color: string = '#2f3136';
    let message: string = '';
    let loading = false;

    onMount(async () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            username = user.username;
            color = user?.options?.color || '#2f3136';
        }
    });

    async function updateProfile(event: Event) {
        event.preventDefault();
        loading = true;
        message = '';
        try {
            const token = getToken();
            const res = await api.patch('/users/me', { username, options: { color } }, token);

            if (!res) {
                message = 'Erreur lors de la mise à jour.';
                loading = false;
                return;
            }

            const existingUserStr = localStorage.getItem('user');
            if (existingUserStr) {
                const existingUser = JSON.parse(existingUserStr);
                const updatedUser = { ...existingUser, ...res };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                localStorage.setItem('user', JSON.stringify(res));
            }
            message = 'Profil mis à jour !';
        } catch (e) {
            message = 'Erreur réseau.';
        }
        loading = false;
    }
</script>

<div class="profile-settings">
    <h2>Profile</h2>

    {#if message}
        <div class="message" class:error={message.includes('Erreur')} class:success={!message.includes('Erreur')}>
            {message}
        </div>
    {/if}

    <div class="section">
        <h3>Informations personnelles</h3>
        <div class="input-group">
            <label for="username-input">Username</label>
            <input id="username-input" type="text" bind:value={username} required />
        </div>
        <div class="input-group">
            <label for="color-input">Color</label>
            <input id="color-input" type="color" bind:value={color} />
        </div>
        <button onclick={updateProfile} disabled={loading} class="save-btn">
            {#if loading}
                Saving...
            {:else}
                Save
            {/if}
        </button>
    </div>
</div>

<style>
    .profile-settings {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        color: #fff;
    }

    h2 {
        margin-bottom: 20px;
        color: #fff;
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

    .input-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        color: #b9bbbe;
        font-size: 14px;
    }

    input {
        width: 100%;
        padding: 8px;
        border: 1px solid #40444b;
        border-radius: 4px;
        background: #202225;
        color: #fff;
        font-size: 14px;
    }

    input:focus {
        outline: none;
        border-color: #5865f2;
    }

    input[type="color"] {
        height: 36px;
        cursor: pointer;
    }

    .save-btn {
        background: #5865f2;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }

    .save-btn:hover:not(:disabled) {
        background: #4752c4;
    }

    .save-btn:disabled {
        background: #40444b;
        cursor: not-allowed;
    }

    .message {
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 20px;
        font-size: 14px;
    }

    .message.success {
        color: #3ba55d;
        background: rgba(59, 165, 93, 0.1);
    }

    .message.error {
        color: #ed4245;
        background: rgba(237, 66, 69, 0.1);
    }
</style>
