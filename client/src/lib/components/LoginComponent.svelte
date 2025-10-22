<script lang="ts">
    import * as auth from '../../application/services/authService';
    import { goto } from '@roxi/routify';

    let email = $state('');
    let password = $state('');
    let error = $state('');
    let loading = $state(false);

    async function submit(event: Event) {
        event.preventDefault();
        console.log('Login submit called');
        loading = true;
        error = '';
        try {
            const user = await auth.login(email, password);
            console.log('Login successful, navigating to index');
            window.location.href = '/';
        } catch (err:any) {
            console.log('Login failed:', err);
            error = 'Login failed. Please try again.';
        } finally {
            loading = false;
        }
    }
</script>

<div class="login-container">
    <div class="login-form">
        <h2>Login</h2>
        <form onsubmit={submit}>
            <div class="input-group">
                <input type="text" placeholder="Email or username" bind:value={email} required />
            </div>
            <div class="input-group">
                <input type="password" placeholder="Password" bind:value={password} required />
            </div>
            <button type="submit" class="login-btn" disabled={loading}>
                {#if loading}
                    Loading...
                {:else}
                    Login
                {/if}
            </button>
        </form>
        <p class="register-link">Don't have an account? <a href="/register">Register</a></p>
        {#if error}
            <p class="error">{error}</p>
        {/if}
    </div>
</div>

<style>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #36393f;
    }

    .login-form {
        width: 100%;
        max-width: 400px;
        text-align: center;
    }

    h2 {
        margin-bottom: 1.5rem;
        color: #bbbbbb;
        font-size: 2rem;
    }

    .input-group {
        margin-bottom: 1rem;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border-style: none;
        border-radius: 5px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
        box-sizing: border-box;
    }

    input:focus {
        outline: none;
        border-color: white;
        box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }

    .login-btn {
        width: 100%;
        padding: 0.75rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s ease;
        margin-top: 1rem;
    }

    .login-btn:hover:not(:disabled) {
        background: #5a6fd8;
    }

    .login-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .register-link {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #bbbbbb;
    }

    .register-link a {
        color: #667eea;
        text-decoration: none;
    }

    .register-link a:hover {
        text-decoration: underline;
    }

    .error {
        margin-top: 1rem;
        color: red;
        font-size: 0.9rem;
    }
</style>
