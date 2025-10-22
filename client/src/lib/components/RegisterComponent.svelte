<script lang="ts">
    import * as auth from '../../application/services/authService';
    import { goto } from '@roxi/routify';

    let firstname = $state('');
    let lastname = $state('');
    let email = $state('');
    let username = $state('');
    let password = $state('');

    async function submit(event: Event) {
        event.preventDefault();
        try {
            await auth.register(firstname, lastname, email, username, password);
            alert('Registered, please login');
            $goto('/login');
        } catch (err:any) {
            alert(err.message || 'Register failed');
        }
    }
</script>

<div class="register-container">
    <div class="register-form">
        <h2>Register</h2>
        <form onsubmit={submit}>
            <div class="input-group">
                <input type="text" placeholder="First name" bind:value={firstname} required />
            </div>
            <div class="input-group">
                <input type="text" placeholder="Last name" bind:value={lastname} required />
            </div>
            <div class="input-group">
                <input type="email" placeholder="Email" bind:value={email} required />
            </div>
            <div class="input-group">
                <input type="text" placeholder="Username" bind:value={username} required />
            </div>
            <div class="input-group">
                <input type="password" placeholder="Password" bind:value={password} required />
            </div>
            <button type="submit" class="register-btn">Register</button>
        </form>
        <p class="login-link">Already have an account? <a href="/login">Login</a></p>
    </div>
</div>

<style>
    .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #36393f;
    }

    .register-form {
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
        /* border: 1px solid #fdfdfd; */
        border-style: none;
        border-radius: 5px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
        box-sizing: border-box;
    }

    input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }

    .register-btn {
        width: 100%;
        padding: 0.75rem;
        background: #667eea;
        color: #fdfdfd;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s ease;
        margin-top: 1rem;
    }

    .register-btn:hover {
        background: #5a6fd8;
    }

    .login-link {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #fdfdfd;
    }

    .login-link a {
        color: #5a6fd8;
        text-decoration: none;
    }

    .login-link a:hover {
        text-decoration: underline;
    }
</style>
