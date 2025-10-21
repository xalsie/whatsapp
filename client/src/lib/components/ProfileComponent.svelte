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

    async function updateProfile() {
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

<h2>Profile</h2>
<div>
    <label for="username-input">Username</label>
    <input id="username-input" bind:value={username} />
</div>
<div>
    <label for="color-input">Color</label>
    <input id="color-input" type="color" bind:value={color} />
</div>
<button onclick={updateProfile} disabled={loading}>Save</button>
<p>{message}</p>
