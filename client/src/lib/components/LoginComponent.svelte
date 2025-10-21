<script lang="ts">
    import * as auth from '../../application/services/authService';
    import { goto } from '@roxi/routify';

    let email = $state('');
    let password = $state('');
    let error = $state('');
    let loading = $state(false);

    async function submit() {
        console.log('Login submit called');
        loading = true;
        error = '';
        try {
            const user = await auth.login(email, password);
            console.log('Login successful, navigating to index');
            window.location.href = '/'; // Force full reload to update state
        } catch (err:any) {
            console.log('Login failed:', err);
            error = 'Login failed. Please try again.';
        } finally {
            loading = false;
        }
    }
</script>

<h2>Login</h2>
<input placeholder="Email or username" bind:value={email} />
<input placeholder="password" type="password" bind:value={password} />
<button onclick={submit}>Login</button>

<div>
    {#if error}
        <p style="color: red;">{error}</p>
    {/if}
    {#if loading}
        <p>Loading...</p>
    {/if}
</div>
