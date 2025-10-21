<script lang="ts">
    import * as auth from '../../application/services/authService';
    import { goto } from '@roxi/routify';

    let firstname = $state('');
    let lastname = $state('');
    let email = $state('');
    let username = $state('');
    let password = $state('');

    async function submit() {
        try {
            await auth.register(firstname, lastname, email, username, password);
            alert('Registered, please login');
            $goto('/login');
        } catch (err:any) {
            alert(err.message || 'Register failed');
        }
    }
</script>

<h2>Register</h2>
<input placeholder="First name" bind:value={firstname} />
<input placeholder="Last name" bind:value={lastname} />
<input placeholder="Email" bind:value={email} />
<input placeholder="username" bind:value={username} />
<input placeholder="password" type="password" bind:value={password} />
<button onclick={submit}>Register</button>
